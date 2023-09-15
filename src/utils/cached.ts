import { dirname, join } from "$std/path/mod.ts";
import { Async, HookCallback, logFileOperation } from "litdoc/utils/log.ts";
import { memoize } from "litdoc/utils/memoize.ts";

/** HELPERS **/

function fileCache<T>(options: CachedOptions<T>) {
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

/** MAIN **/

export type CachedOptions<T> = {
  path: string;
  log: string;
  stringify: (value: T) => string;
  parse: (str: string) => T;
  ext: string;
  load: (file: string, f: HookCallback<T>) => Async<T>;
};

export function cached<T>(options: CachedOptions<T>) {
  const cache = fileCache(options);
  return memoize((file, hash) => {
    return cache(file, hash, () => {
      return logFileOperation(options.log, file, (f) => {
        return options.load(file, f);
      });
    });
  });
}
