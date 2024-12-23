import "./reset.css";
import App from "./App.tsx";
import { createRoot } from "./dom/render.ts";

createRoot(document.getElementById("app")!, App());
