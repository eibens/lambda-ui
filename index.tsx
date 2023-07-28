import { create } from "litdoc";
import lit, { Tags } from "litdoc/lit";
import manifest from "./litdoc.gen.ts";

export const doc = lit();
const { md } = doc;

md`
# :shape-hexagon: [Litdoc](#litdoc)

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

> Until further notice, this is a proprietary library.

## [Features](#features)

The \`features\` folders export the API of the library.
The following features are available:

---
${function () {
  return Object.entries(manifest.routes)
    .filter(([path]) => path.startsWith("./features"))
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([mod]) => {
      const { doc } = mod as unknown as { doc: Tags<unknown> };
      if (typeof doc !== "function") {
        throw new Error("Expected doc to be a function");
      }

      const sub = create(doc());
      return [
        sub.getTitle({ at: [] }),
        sub.getLead({ at: [] }),
      ];
    });
}}
`;
