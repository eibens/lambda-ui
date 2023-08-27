function toRoute(file: string): Route {
  if (!file.endsWith(".tsx")) {
    throw new Error("Only files ending with .tsx are supported.");
  }

  const parts = file
    .slice(0, -".tsx".length)
    .split("/")
    .filter(Boolean);

  const last = parts[parts.length - 1];

  if (last === "index") {
    return {
      parts: parts.slice(0, -1),
      isIndex: true,
    };
  }

  return {
    parts,
    isIndex: false,
  };
}

function toFile(options: PathResult): string {
  const { isIndex, parts } = options;
  return "./" + parts.join("/") + (isIndex ? "/index" : "") + ".tsx";
}

/** MAIN **/

export type Route = {
  type: "Route";
  file: string;
  path: string[];
  isIndex: boolean;
};


export type DocModule = {
  doc: () => TagsState;
};

export function createPage(mod: DocModule, file: string): Page {
  const { doc } = mod;

  if (typeof doc !== "function") {
    throw new Error(`No doc() function found in ${file}`);
  }

  const route = Router.toRoute(file);

  return {
    editor,
    path: route.path,
    isIndex: route.isIndex,
    file,
  };
}

export function createPages(manifest: Manifest): Page[] {
  const pages: Page[] = [];
  const record: Record<string, { index: boolean }> = {};
  for (const file in manifest.routes) {
    const page = createPage(manifest, file);
    pages.push(page);
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
