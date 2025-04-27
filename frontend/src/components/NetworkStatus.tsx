// src/components/NetworkStatus.tsx
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useState, useEffect } from "react";

export function NetworkStatus() {
  const { isOnline, connectionType, connectionStatus } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [dismissable, setDismissable] = useState(false);

  useEffect(() => {
    // Show immediately when offline or limited
    if (!isOnline || connectionStatus === "limited") {
      setVisible(true);
      setDismissable(false);
    } else {
      // When coming back online, allow dismissal after 3 seconds
      setDismissable(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, connectionStatus]);

  if (!visible) return null;

  const getBgColor = () => {
    if (!isOnline) return "bg-red-100 text-red-800";
    if (connectionStatus === "limited") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getMessage = () => {
    if (!isOnline)
      return "You are offline. Changes will sync when connection returns.";
    if (connectionType === "slow-2g")
      return "Very slow connection detected. Some features limited.";
    if (connectionType === "2g")
      return "Slow connection detected. Using low-data mode.";
    return "You are back online!";
  };

  const handleDismiss = () => {
    if (dismissable) setVisible(false);
  };

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 mx-auto w-max max-w-[90%] px-4 py-2 rounded-full shadow-md flex items-center gap-2 z-50 ${getBgColor()}`}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
      ></span>
      <span className="text-sm font-medium">{getMessage()}</span>
      {dismissable && (
        <button
          onClick={handleDismiss}
          className="ml-2 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
