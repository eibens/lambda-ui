import { LitdocEditor } from "litdoc";
import lit from "litdoc/lit";
import manifest from "./litdoc.gen.ts";

export const doc = lit();
const { md } = doc;

md`
# :hexagon: [Litdoc](#litdoc)

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

> Until further notice, this is a proprietary library.

## [Features](#features)

The \`features\` folders export the API of the library.
The following features are available:

${function () {
  return Object.keys(manifest.routes)
    .filter((path) => path.startsWith("./features"))
    .sort((a, b) => a.localeCompare(b))
    .flatMap((path) => {
      const sub = LitdocEditor.createFromManifest({ manifest, path });
      if (!sub) return [];
      const title = LitdocEditor.getTitle(sub);
      const lead = LitdocEditor.getLead(sub);
      const url = path.substring(0, path.length - "/index.tsx".length);
      return `> ###### :folder: [${title}](${url})\n> ${lead}\n\n`;
    });
}}
`;
