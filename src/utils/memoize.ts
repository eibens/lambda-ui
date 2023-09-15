/** HELPERS **/

function concurrent<T>(
  load: Loader<T>,
): Loader<T> {
  const promises: Storage<Promise<T>> = new Map();

  return (key, version) => {
    const entry = promises.get(key);
    if (entry) {
      if (entry.version === version) {
        return entry.value;
      }
    }

    const promise = load(key, version);
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

function memoized<T>(
  load: Loader<T>,
  storage: Storage<T> = new Map(),
): Loader<T> {
  return async (key, version) => {
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

/** MAIN **/

export type Loader<T> = (key: string, version?: unknown) => Promise<T>;

export type Entry<T> = { version: unknown; value: T };

export type Storage<T> = Map<string, Entry<T>>;

export function memoize<T>(
  loader: Loader<T>,
  storage: Storage<T> = new Map(),
): Loader<T> {
  return concurrent(memoized(loader, storage));
}
