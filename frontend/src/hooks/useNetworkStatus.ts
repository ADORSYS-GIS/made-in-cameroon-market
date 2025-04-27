import { useState, useEffect } from "react";

export type ConnectionType = "slow-2g" | "2g" | "3g" | "4g" | "unknown";
export type ConnectionStatus = "online" | "offline" | "limited";

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: ConnectionType;
  connectionStatus: ConnectionStatus;
  downlink: number | null; // Speed in Mbps
  rtt: number | null; // Round trip time in ms
  saveData: boolean; // Data saver mode
}

// Extend Navigator interface to include connection
interface NavigatorNetwork extends Navigator {
  connection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  effectiveType: ConnectionType;
  downlink: number;
  rtt: number;
  saveData: boolean;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    connectionType: getEffectiveConnectionType(),
    connectionStatus: navigator.onLine ? "online" : "offline",
    downlink: getDownlink(),
    rtt: getRTT(),
    saveData: getSaveDataMode(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        connectionStatus: determineConnectionStatus(
          true,
          getEffectiveConnectionType(),
        ),
      }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        connectionStatus: "offline",
      }));
    };

    const handleConnectionChange = () => {
      const connectionType = getEffectiveConnectionType();
      setStatus((prev) => ({
        ...prev,
        connectionType,
        downlink: getDownlink(),
        rtt: getRTT(),
        saveData: getSaveDataMode(),
        connectionStatus: determineConnectionStatus(
          navigator.onLine,
          connectionType,
        ),
      }));
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for connection changes if available
    const nav = navigator as NavigatorNetwork;
    if (nav.connection) {
      nav.connection.addEventListener("change", handleConnectionChange);
    }

    // Check periodically for slow connections
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        // Simple ping to check real connectivity
        fetch("/api/ping", {
          method: "HEAD",
          cache: "no-cache",
          headers: { "Cache-Control": "no-cache" },
        })
          .then(() => {
            setStatus((prev) => ({
              ...prev,
              connectionStatus: determineConnectionStatus(
                true,
                prev.connectionType,
              ),
            }));
          })
          .catch(() => {
            setStatus((prev) => ({
              ...prev,
              connectionStatus: "limited",
            }));
          });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (nav.connection) {
        nav.connection.removeEventListener("change", handleConnectionChange);
      }
      clearInterval(intervalId);
    };
  }, []);

  return status;
}

// Helper functions
function getEffectiveConnectionType(): ConnectionType {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "effectiveType" in nav.connection) {
    return nav.connection.effectiveType;
  }
  return "unknown";
}

function getDownlink(): number | null {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "downlink" in nav.connection) {
    return nav.connection.downlink;
  }
  return null;
}

function getRTT(): number | null {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "rtt" in nav.connection) {
    return nav.connection.rtt;
  }
  return null;
}

function getSaveDataMode(): boolean {
  const nav = navigator as NavigatorNetwork;
  if (nav.connection && "saveData" in nav.connection) {
    return nav.connection.saveData;
  }
  return false;
}

function determineConnectionStatus(
  isOnline: boolean,
  connectionType: ConnectionType,
): ConnectionStatus {
  if (!isOnline) return "offline";
  return connectionType === "slow-2g" || connectionType === "2g"
    ? "limited"
    : "online";
}
