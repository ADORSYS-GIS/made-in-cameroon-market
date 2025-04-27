// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

// Create an offline.html page for offline fallback
const offlineHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Made in Cameroon - Offline</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    .offline-message {
      margin: 40px 0;
      padding: 20px;
      background-color: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    h1 {
      color: #059669;
    }
  </style>
</head>
<body>
  <h1>Made in Cameroon</h1>
  <div class="offline-message">
    <h2>You are currently offline</h2>
    <p>Please check your internet connection and try again.</p>
    <p>Some features may be available in offline mode.</p>
  </div>
  <button onclick="window.location.reload()">Try Again</button>
</body>
</html>
`;

// Save the offline HTML file (in a real app you'd create this file in public folder)
if ("serviceWorker" in navigator) {
  fetch("/offline.html").catch(() => {
    const blob = new Blob([offlineHtml], { type: "text/html" });
    return navigator.serviceWorker.ready.then((registration) => {
      return fetch("/offline.html", {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": "text/html",
        },
      });
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
