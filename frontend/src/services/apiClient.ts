import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useRequestQueue } from "./requestQueue";
import {
  getProducts,
  getCart,
  addToCart,
  addToSyncQueue,
} from "./localDatabase";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
  priority?: 1 | 2 | 3; // 1 = highest
  retries?: number;
  timeout?: number;
  forceNetwork?: boolean; // Force network request even if offline
}

// Define the shape of the request queue's enqueue function
interface RequestQueue {
  enqueue: <T>(
    url: string,
    method: string,
    data: unknown,
    priority: 1 | 2 | 3,
  ) => Promise<T>;
}

export function useApiClient() {
  const { isOnline, connectionType } = useNetworkStatus();
  const { enqueue } = useRequestQueue() as RequestQueue;

  const request = async <T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> => {
    const {
      method = "GET",
      data = null,
      priority = 2,
      retries = getRetriesForConnectionType(),
      forceNetwork = false,
    } = options;

    // For non-GET requests when offline, enqueue for later
    if (!isOnline && method !== "GET" && !forceNetwork) {
      if (endpoint === "/cart" && method === "POST") {
        const cartData = data as { productId: number; quantity: number };
        await addToCart(cartData.productId, cartData.quantity);
        await addToSyncQueue({
          operation: "create",
          entityType: "cart",
          entityId: cartData.productId,
          data,
          priority,
        });
        return { success: true } as T;
      }
      return enqueue<T>(`/api${endpoint}`, method, data, priority);
    }

    // Handle test data from IndexedDB
    if (method === "GET") {
      if (endpoint === "/products") {
        return getProducts() as Promise<T>;
      } else if (endpoint === "/cart") {
        return getCart() as Promise<T>;
      }
    } else if (method === "POST" && endpoint === "/cart") {
      // Simulate adding to cart locally
      const cartData = data as { productId: number; quantity: number };
      await addToCart(cartData.productId, cartData.quantity);
      await addToSyncQueue({
        operation: "create",
        entityType: "cart",
        entityId: cartData.productId,
        data,
        priority,
      });
      return { success: true } as T; // Return a mock response
    }

    // Fallback for unsupported endpoints (should not be reached with test data)
    if (forceNetwork) {
      try {
        const controller = new AbortController();
        const timeout = getTimeoutForConnectionType();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`/api${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
      } catch (error: unknown) {
        if (retries > 0 && isOnline) {
          console.log(
            `Retrying request to ${endpoint}, ${retries} attempts left`,
          );

          await new Promise((resolve) =>
            setTimeout(
              resolve,
              1000 * Math.pow(2, getRetriesForConnectionType() - retries),
            ),
          );

          return request<T>(endpoint, {
            ...options,
            retries: retries - 1,
          });
        }

        if (method !== "GET") {
          return enqueue<T>(`/api${endpoint}`, method, data, priority);
        }

        throw error;
      }
    }

    throw new Error(`Endpoint ${endpoint} not supported with test data`);
  };

  const getRetriesForConnectionType = (): number => {
    switch (connectionType) {
      case "slow-2g":
        return 5;
      case "2g":
        return 4;
      case "3g":
        return 3;
      default:
        return 2;
    }
  };

  const getTimeoutForConnectionType = (): number => {
    switch (connectionType) {
      case "slow-2g":
        return 30000; // 30 seconds
      case "2g":
        return 20000; // 20 seconds
      case "3g":
        return 10000; // 10 seconds
      default:
        return 5000; // 5 seconds
    }
  };

  return {
    get: <T>(
      endpoint: string,
      options?: Omit<FetchOptions, "method" | "data">,
    ) => request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(
      endpoint: string,
      data?: unknown,
      options?: Omit<FetchOptions, "method">,
    ) => request<T>(endpoint, { ...options, method: "POST", data }),

    put: <T>(
      endpoint: string,
      data?: unknown,
      options?: Omit<FetchOptions, "method">,
    ) => request<T>(endpoint, { ...options, method: "PUT", data }),

    delete: <T>(endpoint: string, options?: Omit<FetchOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "DELETE" }),

    patch: <T>(
      endpoint: string,
      data?: unknown,
      options?: Omit<FetchOptions, "method">,
    ) => request<T>(endpoint, { ...options, method: "PATCH", data }),
  };
}
