import { dirname, join } from "$std/path/mod.ts";
import { Loader } from "litdoc/cache/mod.ts";

/** MAIN **/

export type CachedOptions<T> = {
  path: string;
  stringify: (value: T) => string;
  parse: (str: string) => T;
  ext: string;
};

export function cached<T>(options: CachedOptions<T>) {
  const { path, stringify, parse, ext } = options;
  return async (
    file: string,
    version: unknown,
    load: () => Promise<T>,
  ): Promise<T> => {
    const filePath = join(path, file, String(version) + "." + ext);
    try {
      const text = await Deno.readTextFile(filePath);
      return parse(text);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        const fileDir = join(path, file);
        try {
          await Deno.remove(fileDir, { recursive: true });
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            // ignore
          } else {
            throw error;
          }
        }

        const value = await load();
        const filePath = join(path, file, String(version) + "." + ext);
        const data = stringify(value);
        await Deno.mkdir(dirname(filePath), { recursive: true });
        await Deno.writeTextFile(filePath, data);
        return value;
      } else {
        throw error;
      }
    }
  };
}

export function modified<T>(loader: Loader<T>) {
  return async (file: string, versionPostfix = "") => {
    const stats = await Deno.stat(file);
    const version = `${stats.mtime?.getTime()}-${stats.size}-${versionPostfix}`;
    return loader(file, version);
  };
}
