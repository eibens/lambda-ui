import { toFileUrl, walk } from "./deps.ts";

export async function collect(dir: URL): Promise<URL[]> {
  const routes: URL[] = [];
  try {
    // TODO(lucacasonato): remove the extranious Deno.readDir when
    // https://github.com/denoland/deno_std/issues/1310 is fixed.
    for await (const _ of Deno.readDir(dir)) {
      // do nothing
    }
    const routesFolder = walk(dir, {
      includeDirs: false,
      includeFiles: true,
      exts: ["tsx", "jsx", "ts", "js"],
    });
    for await (const entry of routesFolder) {
      if (entry.isFile) {
        routes.push(toFileUrl(entry.path));
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  routes.sort((a, b) => a.href.localeCompare(b.href));
  return routes;
}
