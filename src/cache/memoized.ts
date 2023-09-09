import { Loader, Storage } from "./types.ts";

export function memoized<T>(
  load: Loader<T>,
  storage: Storage<T> = new Map(),
) {
  return async (key: string, version: unknown) => {
    if (storage.has(key)) {
      const entry = storage.get(key)!;

      if (entry.version === version) {
        return entry.value;
      }

      storage.delete(key);
    }
    const value = await load(key, version);
    storage.set(key, { version, value });
    return value;
  };
}
