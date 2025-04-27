import { useState, useEffect } from "react";
import { getProducts, getCart, getProduct } from "./localDatabase";

// Define ConnectionType to match useNetworkStatus.ts
export type ConnectionType = "slow-2g" | "2g" | "3g" | "4g" | "unknown";

// Define ResourceOptions interface
interface ResourceOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
  priority?: "high" | "low" | "auto";
}

// Extend Navigator interface for connection
interface NavigatorNetwork extends Navigator {
  connection?: NetworkInformation;
}

interface NetworkInformation {
  effectiveType: ConnectionType;
}

// React hook for resources
export function useResource<T>(
  url: string | null,
  options: Partial<ResourceOptions> = {},
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(url !== null);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    loadResource<T>(url, options)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [url, refreshTrigger]);

  const refresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refresh };
}

// Resource loading function
async function loadResource<T>(
  url: string,
  options: Partial<ResourceOptions> = {},
): Promise<T> {
  // Check IndexedDB first for test data
  if (url.includes("/products")) {
    if (url.includes("/products/")) {
      const id = parseInt(url.split("/").pop() || "0", 10);
      const product = await getProduct(id);
      if (product) return product as T;
    } else {
      return (await getProducts()) as T;
    }
  } else if (url.includes("/cart")) {
    return (await getCart()) as T;
  }

  const {
    method = "GET",
    headers = {},
    body,
    cache = "default",
    priority = "auto",
  } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      priority,
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

// Image optimization utilities
export function getOptimizedImageUrl(
  originalUrl: string,
  connectionType: ConnectionType,
  width?: number,
): string {
  // Handle empty URLs
  if (!originalUrl) return "";

  // For external URLs (e.g., Unsplash), append width parameters directly
  const url = new URL(originalUrl);

  // Add width parameter if specified
  if (width) {
    url.searchParams.set("w", width.toString());
  }

  switch (connectionType) {
    case "slow-2g":
      // Tiny placeholder for progressive loading
      url.searchParams.set("w", width ? Math.min(width, 20).toString() : "20");
      return url.toString();
    case "2g":
      // Low resolution
      url.searchParams.set(
        "w",
        width ? Math.min(width, 200).toString() : "200",
      );
      return url.toString();
    case "3g":
      // Medium resolution
      url.searchParams.set(
        "w",
        width ? Math.min(width, 400).toString() : "400",
      );
      return url.toString();
    case "4g":
    default:
      // Full resolution (use original or specified width)
      return url.toString();
  }
}

// Font loading optimization
export function loadOptimizedFonts(): void {
  const connectionType = getConnectionType();

  // Only load web fonts on faster connections
  if (connectionType === "slow-2g" || connectionType === "2g") {
    document.documentElement.classList.add("use-system-fonts");
    return;
  }

  // Load essential font first (e.g., regular weight)
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "/assets/fonts/essential.css";
  document.head.appendChild(fontLink);

  // On good connections, load additional font weights
  if (connectionType === "4g") {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const extraFontLink = document.createElement("link");
        extraFontLink.rel = "stylesheet";
        extraFontLink.href = "/assets/fonts/all-weights.css";
        document.head.appendChild(extraFontLink);
      }, 2000);
    });
  }
}

// Utility to get connection type
function getConnectionType(): ConnectionType {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "effectiveType" in nav.connection) {
    return nav.connection.effectiveType;
  }
  return "unknown";
}
