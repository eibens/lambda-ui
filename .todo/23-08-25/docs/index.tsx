import lit from "litdoc/lit";

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

${(ctx) =>
  ctx.pages
    .filter((doc) => /\/features\/[^/]+\/index.tsx$/.test(doc.file))
    .map((doc) => `> ${doc}\n\n`)}
`;
