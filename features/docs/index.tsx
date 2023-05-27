import { createRoot } from "react-dom/client";
import { md } from "../markdown/mod.ts";
import { Layout } from "./layout.tsx";

/** MAIN **/

const root = md`
# Lambda UI

> TODO: Add some examples.
`;

if (globalThis.document) {
  const rootElement = document.getElementById("root")!;
  createRoot(rootElement).render(
    <Layout root={root} />,
  );
}
