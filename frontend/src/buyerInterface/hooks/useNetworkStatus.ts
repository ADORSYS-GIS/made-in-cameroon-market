import { useEffect, useState } from "react";

// Define a type that extends Navigator with connection types
interface NavigatorConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  addEventListener(
    type: "change",
    listener: EventListenerOrEventListenerObject,
  ): void;
  removeEventListener(
    type: "change",
    listener: EventListenerOrEventListenerObject,
  ): void;
}

// Now type navigator properly without 'any'
const getConnection = (): NetworkInformation | undefined => {
  const nav = navigator as NavigatorConnection;
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
};

export function useNetworkStatus() {
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [effectiveType, setEffectiveType] = useState<string>(
    getConnection()?.effectiveType ?? "4g",
  );

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    const connection = getConnection();

    const updateConnection = () => {
      if (connection?.effectiveType) {
        setEffectiveType(connection.effectiveType);
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    if (connection) {
      connection.addEventListener("change", updateConnection);
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      connection?.removeEventListener("change", updateConnection);
    };
  }, []);

  return { online, effectiveType };
}
