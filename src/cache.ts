import { dirname, join } from "$std/path/mod.ts";
import { BinaryCache, CacheMap, Memory, MemoryMap, Ref } from "./types.ts";

/** MAIN **/

export function fromMemory<T>(
  store: Memory<T>,
  loader: () => Promise<T>,
) {
  if (store.loaded) {
    return store.value;
  }
  const promise = loader();
  store.loaded = true;
  store.value = promise;
  return promise;
}

export function fromMemoryMap<T>(
  memory: MemoryMap<T>,
  ref: Ref,
  loader: () => Promise<T>,
): Promise<T> {
  const { key, version } = ref;
  const entry = memory[key];
  if (!entry || entry.version !== version) {
    const promise = loader();
    memory[key] = { version, promise };
    return promise;
  }
  return memory[key].promise;
}

export async function dumpMemoryMap<T>(
  memory: MemoryMap<T>,
): Promise<Record<string, T>> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(memory).map(async ([key, { promise }]) => {
        const value = await promise;
        return [key, value] as const;
      }),
    ),
  );
}

export function hydrateMemoryMap<T>(
  memory: MemoryMap<T>,
  values: Record<string, T>,
  versions: Record<string, string | number>,
) {
  for (const [key, value] of Object.entries(values)) {
    const version = versions[key];
    const entry = memory[key];
    if (!entry || entry.version !== version) {
      memory[key] = { version, promise: Promise.resolve(value) };
    }
  }
}

export function fromBinaryCache(
  cache: BinaryCache,
  loader: () => Promise<Uint8Array>,
) {
  const {
    file,
    decompress,
    memory,
    storage,
  } = cache;
  return fromMemory(memory, async () => {
    if (storage === "memory") {
      const bytes = await loader();
      return decompress?.(bytes) ?? bytes;
    }

    try {
      const bytes = await Deno.readFile(file);
      return decompress?.(bytes) ?? bytes;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        const bytes = await loader();
        await Deno.mkdir(dirname(file), { recursive: true });
        await Deno.writeFile(file, bytes);
        return decompress?.(bytes) ?? bytes;
      } else {
        throw error;
      }
    }
  });
}

export function fromCacheMap<T>(
  cache: CacheMap<T>,
  ref: Ref,
  loader: () => Promise<T>,
): Promise<T> {
  const {
    prefix,
    postfix,
    extension,
    parse,
    stringify,
    memory,
    storage,
  } = cache;
  return fromMemoryMap(memory, ref, async () => {
    if (storage === "memory") return loader();

    const { key, version } = ref;
    const fileRoot = join(prefix, key, postfix ?? "");
    const fileName = String(version) + "." + extension;
    const filePath = join(fileRoot, fileName);
    try {
      const text = await Deno.readTextFile(filePath);
      return parse(text);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        try {
          await Deno.remove(fileRoot, { recursive: true });
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            // ignore
          } else {
            throw error;
          }
        }

        const value = await loader();
        const data = stringify(value);
        await Deno.mkdir(dirname(filePath), { recursive: true });
        await Deno.writeTextFile(filePath, data);
        return value;
      } else {
        throw error;
      }
    }
  });
}
