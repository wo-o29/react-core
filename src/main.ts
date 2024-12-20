import App from "./App.tsx";
import { createRoot } from "./dom/root.ts";

createRoot(document.getElementById("app")!, App());
