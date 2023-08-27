/** HELPERS **/

import { Editor } from "slate";

type RouteOptions = {
  path: string[];
  isIndex: boolean;
  file: string;
  editor: Editor;
};


export function createPage(mod: DocModule, file: string): Page {
  const { doc } = mod;
  if (typeof doc !== "function") {
    throw new Error(`No doc() function found in ${file}`);
  }

  const editor = createFromTags(doc());
  const route = Router.toRoute(file);

  return {
    editor,
    path: route.parts,
    isIndex: route.isIndex,
    file,
  };
}

export function createPages(manifest: Manifest): Page[] {
  const pages: Page[] = [];
  const record: Record<string, { index: boolean }> = {};
  for (const file in manifest.routes) {
    const page = createPage(manifest, file);
    pages.push();
  }
  return pages;
}

export function createIndex(manifest: Manifest, options: {
  match: RegExp;
}) {
  const { match } = options;
  return Object.keys(manifest.routes)
    .filter((file) => match.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => createPage(manifest, file));
}
