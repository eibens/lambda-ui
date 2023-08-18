import { LitdocEditor } from "litdoc";
import lit from "litdoc/lit";
import manifest from "./litdoc.gen.ts";

/** HELPERS **/

function getFeatures() {
  return Object.keys(manifest.routes)
    .filter((path) => /\/features\/[^/]+\/index.tsx$/.test(path))
    .sort((a, b) => a.localeCompare(b))
    .flatMap((path) => {
      const sub = LitdocEditor.createFromManifest({ manifest, path });
      if (!sub) return [];
      const title = LitdocEditor.getTitle(sub);
      const lead = LitdocEditor.getLead(sub);
      const url = path.substring(0, path.length - "/index.tsx".length);
      return { title, lead, url };
    });
}

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :cube: [Litdoc](#litdoc)

This is Lukas Eibensteiner's personal UI library.
It is built for TypeScript, Preact, and Deno.

## [Features](#features)

The \`features\` folders export the API of the library.
The following features are available:

${() =>
  getFeatures().map((feature) =>
    `> - ##### :folder: [${feature.title}](${feature.url})\n>   ${feature.lead}\n\n`
  )}  


`;
