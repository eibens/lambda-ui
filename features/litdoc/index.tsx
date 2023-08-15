import { LitdocEditor } from "litdoc";
import lit from "litdoc/lit";
import manifest from "../../litdoc.gen.ts";

/** HELPERS **/

function getDocs() {
  return Object.keys(manifest.routes)
    .filter((path) => /\/features\/litdoc\/docs\/[^/.]+.tsx$/.test(path))
    .sort((a, b) => a.localeCompare(b))
    .flatMap((path) => {
      const sub = LitdocEditor.createFromManifest({ manifest, path });
      if (!sub) return [];
      const title = LitdocEditor.getTitle(sub);
      const icon = LitdocEditor.getIcon(sub);
      const url = path.substring(1, path.length - ".tsx".length);
      return { title, url, icon };
    });
}

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :book: [Litdoc](#litdoc)

Litdoc is a document generator for Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.

  ${() =>
  getDocs().map(({ icon, title, url }) =>
    `> - ### :${icon}: [${title}](${url})\n\n`
  )}  
  
`;
