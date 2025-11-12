import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeAirlineFont } from "./lib/fontConfig";
import React from "react";
import { AppStoreProvider } from "./store/Store";

// Initialize airline-specific font before rendering
initializeAirlineFont();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStoreProvider>
      <App />
    </AppStoreProvider>
  </React.StrictMode>
);
