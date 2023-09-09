import { Loader, Storage } from "./types.ts";

export function concurrent<T>(loader: Loader<T>): Loader<T> {
  const promises: Storage<Promise<T>> = new Map();

  return (key, version) => {
    const entry = promises.get(key);
    if (entry) {
      if (entry.version === version) {
        return entry.value;
      }
    }

    const promise = loader(key, version);
    promises.set(key, {
      version,
      value: promise.catch((error) => {
        promises.delete(key);
        throw error;
      }),
    });

    return promise;
  };
}
