import { Loader } from "./types.ts";

export function modified<T>(loader: Loader<T>) {
  return async (file: string, versionPostfix = "") => {
    const stats = await Deno.stat(file);
    const version = `${stats.mtime?.getTime()}-${stats.size}-${versionPostfix}`;
    return loader(file, version);
  };
}