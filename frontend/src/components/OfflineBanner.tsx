// src/components/OfflineBanner.tsx
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useState, useEffect } from "react";

export function OfflineBanner() {
  const { connectionStatus, connectionType } = useNetworkStatus();
  const [pendingActions, setPendingActions] = useState(0);

  // This would be connected to your sync queue to get actual pending actions
  useEffect(() => {
    // Example implementation - replace with actual sync queue status
    const checkPendingActions = async () => {
      try {
        // In a real implementation, get this from your local database
        // const pending = await getPendingSyncOperations();
        // setPendingActions(pending.length);
        setPendingActions(Math.floor(Math.random() * 5)); // Mock for example
      } catch (error) {
        console.error("Failed to check pending actions:", error);
      }
    };

    checkPendingActions();
    const interval = setInterval(checkPendingActions, 5000);

    return () => clearInterval(interval);
  }, []);

  if (connectionStatus === "online") return null;

  const getBannerStyle = () => {
    if (connectionStatus === "offline") {
      return "bg-red-50 border-red-200 text-red-700";
    }
    return "bg-yellow-50 border-yellow-200 text-yellow-700";
  };

  const getMessage = () => {
    if (connectionStatus === "offline") {
      return pendingActions > 0
        ? `You're offline. ${pendingActions} changes will sync when you reconnect.`
        : "You're offline. Some features may be unavailable.";
    }

    if (connectionType === "slow-2g") {
      return "Very slow connection. Using minimal data mode.";
    }

    return "Slow connection detected. Some images may not load.";
  };

  return (
    <div className={`w-full px-4 py-2 text-center text-sm ${getBannerStyle()}`}>
      <p>{getMessage()}</p>
    </div>
  );
}
