import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";
import "@/i18n/config";
import { App } from "@/App";

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

window.addEventListener("error", (e) => {
  console.error("[runtime]", e.error ?? e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[unhandled]", e.reason);
});
