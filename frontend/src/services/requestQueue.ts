/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/requestQueue.ts
import { addToSyncQueue, getPendingSyncOperations } from "./localDatabase";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useState } from "react";

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data: any;
  priority: 1 | 2 | 3; // 1 = highest
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export class RequestQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing: boolean = false;
  private networkStatus: ReturnType<typeof useNetworkStatus>;
  private syncInterval: number | null = null;

  constructor(networkStatus: ReturnType<typeof useNetworkStatus>) {
    this.networkStatus = networkStatus;
    this.loadPendingRequests();
  }

  public async enqueue(
    url: string,
    method: string = "GET",
    data: any = null,
    priority: 1 | 2 | 3 = 2,
    maxRetries: number = 5,
  ): Promise<any> {
    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const request: QueuedRequest = {
      id,
      url,
      method,
      data,
      priority,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };

    // Add to queue
    this.queue.push(request);
    this.sortQueue();

    // Also add to IndexedDB for persistence
    await addToSyncQueue({
      operation:
        method === "DELETE"
          ? "delete"
          : method === "POST"
            ? "create"
            : "update",
      entityType: this.getEntityTypeFromUrl(url),
      entityId: this.getEntityIdFromUrl(url) || 0,
      data,
      priority: priority,
    });

    // Start processing if not already
    if (!this.isProcessing && this.networkStatus.isOnline) {
      this.processQueue();
    }

    // If offline or on very slow connection, set up sync interval if not already
    if (
      !this.networkStatus.isOnline ||
      this.networkStatus.connectionType === "slow-2g"
    ) {
      this.setupSyncInterval();
    }

    return new Promise((resolve, reject) => {
      // For high priority requests on good connections, we wait for result
      if (
        priority === 1 &&
        this.networkStatus.isOnline &&
        this.networkStatus.connectionType !== "slow-2g"
      ) {
        this.processRequest(request).then(resolve).catch(reject);
      } else {
        // For lower priority or on poor connections, resolve immediately with 'queued' status
        resolve({ status: "queued", requestId: id });
      }
    });
  }

  public async processQueue(): Promise<void> {
    if (
      this.isProcessing ||
      this.queue.length === 0 ||
      !this.networkStatus.isOnline
    ) {
      return;
    }

    this.isProcessing = true;

    try {
      // Sort by priority and timestamp
      this.sortQueue();

      // Process batch based on connection type
      const batchSize = this.getBatchSizeForConnection();
      const batch = this.queue.slice(0, batchSize);

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map((request) => this.processRequest(request)),
      );

      // Handle results
      results.forEach((result, index) => {
        const request = batch[index];

        if (result.status === "fulfilled") {
          // Remove successful request from queue
          this.queue = this.queue.filter((r) => r.id !== request.id);
        } else {
          // Increment retry count for failed requests
          const failedRequest = this.queue.find((r) => r.id === request.id);
          if (failedRequest) {
            failedRequest.retryCount++;

            // Remove if max retries reached
            if (failedRequest.retryCount >= failedRequest.maxRetries) {
              this.queue = this.queue.filter((r) => r.id !== request.id);
              console.error(
                `Request ${failedRequest.url} failed after ${failedRequest.maxRetries} attempts`,
              );
            }
          }
        }
      });
    } catch (error) {
      console.error("Error processing queue:", error);
    } finally {
      this.isProcessing = false;

      // Continue processing if more items in queue
      if (this.queue.length > 0 && this.networkStatus.isOnline) {
        setTimeout(
          () => this.processQueue(),
          this.getRetryDelayForConnection(),
        );
      }
    }
  }

  private async processRequest(request: QueuedRequest): Promise<any> {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          "X-Request-Priority": request.priority.toString(),
        },
        body: request.data ? JSON.stringify(request.data) : undefined,
        // Timeout based on connection type
        signal: AbortSignal.timeout(this.getTimeoutForConnection()),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(
        `Request failed (attempt ${request.retryCount + 1}):`,
        error,
      );
      throw error;
    }
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // Sort by priority first (1 is highest)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }

      // Then by timestamp (older first)
      return a.timestamp - b.timestamp;
    });
  }

  private getBatchSizeForConnection(): number {
    switch (this.networkStatus.connectionType) {
      case "slow-2g":
        return 1;
      case "2g":
        return 2;
      case "3g":
        return 5;
      default:
        return 10;
    }
  }

  private getTimeoutForConnection(): number {
    switch (this.networkStatus.connectionType) {
      case "slow-2g":
        return 30000; // 30 seconds
      case "2g":
        return 20000; // 20 seconds
      case "3g":
        return 15000; // 15 seconds
      default:
        return 10000; // 10 seconds
    }
  }

  private getRetryDelayForConnection(): number {
    switch (this.networkStatus.connectionType) {
      case "slow-2g":
        return 10000; // 10 seconds
      case "2g":
        return 5000; // 5 seconds
      default:
        return 1000; // 1 second
    }
  }

  private getEntityTypeFromUrl(
    url: string,
  ): "product" | "cart" | "order" | "profile" {
    if (url.includes("/products")) return "product";
    if (url.includes("/cart")) return "cart";
    if (url.includes("/orders")) return "order";
    if (url.includes("/profile")) return "profile";
    return "product"; // Default
  }

  private getEntityIdFromUrl(url: string): string | number | null {
    // Extract ID from URL patterns like /products/123
    const matches = url.match(/\/([a-zA-Z]+)\/([a-zA-Z0-9-]+)/);
    return matches ? matches[2] : null;
  }

  private setupSyncInterval(): void {
    if (this.syncInterval !== null) return;

    this.syncInterval = window.setInterval(() => {
      if (
        this.networkStatus.isOnline &&
        this.networkStatus.connectionType !== "slow-2g"
      ) {
        this.processQueue();
      }
    }, 30000); // Check every 30 seconds
  }

  private async loadPendingRequests(): Promise<void> {
    try {
      const pendingOperations = await getPendingSyncOperations();

      // Convert sync operations to queue items
      pendingOperations.forEach((op) => {
        const url = this.getUrlFromOperation(op);
        const method =
          op.operation === "create"
            ? "POST"
            : op.operation === "delete"
              ? "DELETE"
              : "PUT";

        this.queue.push({
          id: `stored_${op.id}`,
          url,
          method,
          data: op.data,
          priority: op.priority,
          timestamp: op.timestamp,
          retryCount: op.retryCount,
          maxRetries: 5,
        });
      });

      // Process queue if online
      if (this.networkStatus.isOnline) {
        this.processQueue();
      }
    } catch (error) {
      console.error("Failed to load pending requests:", error);
    }
  }

  private getUrlFromOperation(operation: any): string {
    const baseUrl = "/api";

    switch (operation.entityType) {
      case "product":
        return operation.operation === "create"
          ? `${baseUrl}/products`
          : `${baseUrl}/products/${operation.entityId}`;
      case "cart":
        return `${baseUrl}/cart`;
      case "order":
        return operation.operation === "create"
          ? `${baseUrl}/orders`
          : `${baseUrl}/orders/${operation.entityId}`;
      case "profile":
        return `${baseUrl}/profile`;
      default:
        return `${baseUrl}/${operation.entityType}`;
    }
  }
}

// Create a hook to use the request queue
export function useRequestQueue() {
  const networkStatus = useNetworkStatus();
  const [queue] = useState(() => new RequestQueue(networkStatus));

  return {
    enqueue: queue.enqueue.bind(queue),
    processQueue: queue.processQueue.bind(queue),
  };
}
