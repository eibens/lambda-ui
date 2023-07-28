import {
  walk as walkImpl,
  WalkEntry,
  WalkOptions,
} from "https://deno.land/std@0.194.0/fs/walk.ts";

async function walk(
  dir: URL,
  options?: WalkOptions,
): Promise<WalkEntry[]> {
  const entries: WalkEntry[] = [];
  try {
    // TODO(lucacasonato): remove the extranious Deno.readDir when
    // https://github.com/denoland/deno_std/issues/1310 is fixed.
    for await (const _ of Deno.readDir(dir)) {
      // do nothing
    }
    const routesFolder = walkImpl(dir, options);
    for await (const entry of routesFolder) {
      entries.push(entry);
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      console.log(`No such file or directory '${dir}'`);
      // Do nothing
    } else {
      throw err;
    }
  }
  return entries
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((entry) => ({
      ...entry,
      path: entry.path.slice(dir.pathname.length),
    }));
}

export type CollectEntry = WalkEntry & {
  id: string;
  varName: string;
};

export type Index = Record<string, CollectEntry>;

export type IndexMap<T> = {
  [key in keyof T]: Index;
};

export async function collect<T>(
  baseUrl: URL,
  config: {
    [key in keyof T]: WalkOptions;
  },
): Promise<IndexMap<T>> {
  const indexes: Partial<IndexMap<T>> = {};

  let varId = 0;
  const lookup: Record<string, CollectEntry> = {};

  for (const key in config) {
    const options = config[key];
    const entries = await walk(baseUrl, options);

    const index: Index = {};

    for (const entry of entries) {
      if (lookup[entry.path] == null) {
        const varName = `$${varId++}`;
        const collectEntry: CollectEntry = {
          ...entry,
          id: entry.path,
          varName,
        };
        lookup[entry.path] = collectEntry;
      }
      index[entry.path] = lookup[entry.path];
    }

    indexes[key] = index;
  }
  return indexes as IndexMap<T>;
}
