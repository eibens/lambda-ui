import { concurrent } from "./concurrent.ts";
import { Loader } from "./types.ts";

export async function clearKv(kv: Deno.Kv, options: {
  prefix: Deno.KvKey;
}) {
  const { prefix } = options;
  const iterator = kv.list({ prefix });
  for await (const entry of iterator) {
    await kv.delete(entry.key);
  }
}

export function fromKv<T>(
  loader: Loader<T>,
  storage: Deno.Kv,
  options: {
    prefix?: Deno.KvKey;
    stringify?: (value: T) => string;
    parse?: (value: string) => T;
  } = {},
): Loader<T> {
  const {
    prefix = [],
    stringify = JSON.stringify,
    parse = JSON.parse,
  } = options;

  const abs = (key: string) => [...prefix, key];
  return concurrent(async (key, version) => {
    const entry = await storage.get<string>(abs(key));
    if (entry.versionstamp !== null) {
      const data = JSON.parse(entry.value);
      if (data.version === version) {
        return parse(data.value);
      }
    }
    const value = await loader(key, version);
    const data = JSON.stringify({
      version,
      value: stringify(value),
    });
    await storage.set(abs(key), data);
    return value;
  });
}
