import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Disable any service workers (if any)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let reg of registrations) reg.unregister();
  });
}

// Force reload with cache-busting (optional for dev)
window.addEventListener("load", () => {
  fetch(window.location.href, { cache: "no-store" });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
