import { Manifest } from "litdoc";
import lit from "litdoc/lit";
import manifest from "../../litdoc.gen.ts";

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :book: [Litdoc](#litdoc)

Litdoc is a document generator for Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.

${() =>
  Manifest.createIndex(manifest, {
    match: /\/features\/litdoc\/docs\/[^/.]+\.tsx$/,
  }).map((doc) => `> - ### :${doc.icon}: [${doc.title}](${doc.url})\n\n`)}  
`;
