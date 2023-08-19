import { Manifest } from "litdoc";
import lit from "litdoc/lit";
import manifest from "./litdoc.gen.ts";

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
  Manifest.createIndex(manifest, {
    match: /\/features\/[^/]+\/index.tsx$/,
  }).map((doc) =>
    `> - ##### :folder: [${doc.title}](${doc.url})\n>   ${doc.lead}\n\n`
  )}  
`;
