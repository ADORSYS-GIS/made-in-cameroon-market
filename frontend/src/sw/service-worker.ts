/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference lib="webworker" />

import { openDB, IDBPDatabase } from "idb";
import {
  SyncOperation,
  CameroonMarketplaceDB,
} from "../services/localDatabase";

declare const self: ServiceWorkerGlobalScope;

// Define SyncEvent interface for background sync
interface SyncEvent extends ExtendableEvent {
  tag: string;
  lastChance: boolean;
}

const CACHE_NAME = "cameroon-marketplace-v1";
const OFFLINE_URL = "/offline.html";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/assets/index.css",
  "/assets/index.js",
  "/vite.svg",
  "/manifest.json",
];

// Low-priority assets that can be skipped on very slow connections
const LOW_PRIORITY_ASSETS = ["/assets/vendor-logos/", "/assets/banners/"];

// Connection type to match useNetworkStatus.ts
type ConnectionType = "slow-2g" | "2g" | "3g" | "4g" | "unknown";

// Extend Navigator interface for connection
interface NavigatorNetwork extends Navigator {
  connection?: NetworkInformation;
}

interface NetworkInformation {
  effectiveType: ConnectionType;
}

// Helper function to determine if a request is for a low priority asset
const isLowPriorityAsset = (url: string): boolean => {
  return LOW_PRIORITY_ASSETS.some((asset) => url.includes(asset));
};

// Helper function to determine connection quality
const getConnectionQuality = async (): Promise<"fast" | "medium" | "slow"> => {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "effectiveType" in nav.connection) {
    const { effectiveType } = nav.connection;
    if (effectiveType === "slow-2g" || effectiveType === "2g") {
      return "slow";
    } else if (effectiveType === "3g") {
      return "medium";
    } else {
      return "fast";
    }
  }

  // Fallback: simple speed test
  try {
    const start = Date.now();
    const response = await fetch("/api/ping", {
      method: "HEAD",
      cache: "no-cache",
    });
    const duration = Date.now() - start;

    if (duration > 1000) {
      return "slow";
    } else if (duration > 300) {
      return "medium";
    } else {
      return "fast";
    }
  } catch (error: unknown) {
    return "slow"; // Assume slow on error
  }
};

// Initialize IndexedDB
async function initDB(): Promise<IDBPDatabase<CameroonMarketplaceDB>> {
  return openDB<CameroonMarketplaceDB>("cameroon-marketplace", 1);
}

// Install event - cache critical assets
self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - handle network requests with caching strategy
self.addEventListener("fetch", (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip analytics and third-party requests
  if (
    url.pathname.startsWith("/analytics") ||
    !url.hostname.includes(self.location.hostname)
  ) {
    return;
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(async () => {
          // Try cache first
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;

          // If API call fails and no cache, return JSON error
          return new Response(
            JSON.stringify({
              error:
                "You are offline. This action will be synced when you reconnect.",
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
    );
    return;
  }

  // HTML requests - network first with offline fallback
  if (
    event.request.mode === "navigate" ||
    event.request.headers.get("accept")?.includes("text/html")
  ) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        const offlineResponse = await caches.match(OFFLINE_URL);
        return (
          offlineResponse ??
          new Response("Offline page not found", { status: 404 })
        );
      }),
    );
    return;
  }

  // For images and other assets - adapt strategy based on priority and connection
  event.respondWith(
    (async () => {
      const connectionQuality = await getConnectionQuality();
      const isLowPriority = isLowPriorityAsset(event.request.url);

      // On slow connections, skip low priority assets completely
      if (connectionQuality === "slow" && isLowPriority) {
        return new Response("", { status: 204 });
      }

      // For medium connections and low priority, use cache-first strategy
      if (connectionQuality === "medium" && isLowPriority) {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
      }

      // Standard stale-while-revalidate strategy for everything else
      const cachedResponse = await caches.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((response) => {
          // Cache the updated response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          // Return cached response if available
          return cachedResponse || new Response("", { status: 504 });
        });

      return cachedResponse || fetchPromise;
    })(),
  );
});

// Handle background sync for offline operations
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "sync-cart-operations") {
    event.waitUntil(syncCartOperations());
  } else if (event.tag === "sync-user-actions") {
    event.waitUntil(syncUserActions());
  }
});

// Background sync functions
async function syncCartOperations(): Promise<void> {
  try {
    const db = await initDB();
    const pendingOperations = await db.getAllFromIndex(
      "syncQueue",
      "by-status",
      "pending",
    );

    for (const operation of pendingOperations) {
      try {
        await syncOperation(operation);
        await db.put("syncQueue", { ...operation, status: "completed" });
      } catch (error: unknown) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        const retryCount = (operation.retryCount || 0) + 1;
        if (retryCount < 3) {
          await db.put("syncQueue", {
            ...operation,
            status: "pending",
            retryCount,
          });
        } else {
          await db.put("syncQueue", {
            ...operation,
            status: "failed",
            retryCount,
          });
        }
      }
    }
  } catch (error: unknown) {
    console.error("Failed to sync cart operations:", error);
  }
}

async function syncUserActions(): Promise<void> {
  try {
    const db = await initDB();
    const pendingOperations = await db.getAllFromIndex(
      "syncQueue",
      "by-status",
      "pending",
    );

    for (const operation of pendingOperations) {
      try {
        await syncOperation(operation);
        await db.put("syncQueue", { ...operation, status: "completed" });
      } catch (error: unknown) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        const retryCount = (operation.retryCount || 0) + 1;
        if (retryCount < 3) {
          await db.put("syncQueue", {
            ...operation,
            status: "pending",
            retryCount,
          });
        } else {
          await db.put("syncQueue", {
            ...operation,
            status: "failed",
            retryCount,
          });
        }
      }
    }
  } catch (error: unknown) {
    console.error("Failed to sync user actions:", error);
  }
}

// Helper function to sync a single operation
async function syncOperation(operation: SyncOperation): Promise<void> {
  const { operation: opType, entityType, entityId, data } = operation;
  let url = `/api/${entityType}`;
  let method: string;

  switch (opType) {
    case "create":
      method = "POST";
      break;
    case "update":
      method = "PUT";
      url += `/${entityId}`;
      break;
    case "delete":
      method = "DELETE";
      url += `/${entityId}`;
      break;
    default:
      throw new Error(`Unsupported operation: ${opType}`);
  }

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Sync failed with status ${response.status}`);
  }

  // Optionally parse response if needed
  await response.json(); // Use response to avoid unused variable warning
}
