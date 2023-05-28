import { hydrateRoot } from "react-dom/client";
import { App } from "./app.tsx";

/** MAIN **/

if (globalThis.document) {
  const rootElement = document.getElementById("root")!;
  hydrateRoot(rootElement, <App />);
}
