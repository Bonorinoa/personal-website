import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./styles/fonts";
import "./index.css";
import App from "./App.tsx";

// Initialize theme from storage / system preference before first paint
(function initTheme() {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
  } catch {
    /* ignore */
  }
})();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
