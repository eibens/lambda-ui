import type { Storage, SyncStorage } from "./storage.ts";

/** MAIN **/

export type Getter<T> = (path: string) => Promise<T>;

export type SyncGetter<T> = (path: string) => T;

export type Loader<T> = {
  get: Getter<T>;
};

export type SyncLoader<T> = {
  get: SyncGetter<T>;
};

export function func<T>(
  get: (path: string) => T,
): { get: (path: string) => T } {
  return { get };
}

export function files(): Loader<Uint8Array> {
  return {
    get: async (key) => {
      return await Deno.readFile(key);
    },
  };
}

export function fetcher(
  urls: Record<string, URL | undefined>,
): Loader<Uint8Array> {
  return {
    get: async (path) => {
      const url = urls[path];
      if (!url) {
        throw new Error(`Unknown path: ${path}`);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }

      const content = await response.arrayBuffer();
      return new Uint8Array(content);
    },
  };
}

export function cached<T>(storage: Storage<T>, loader: Loader<T>): Loader<T> {
  return {
    get: async (path) => {
      const has = await storage.has(path);
      if (has) {
        return await storage.get(path);
      }

      const value = await loader.get(path);
      await storage.set(path, value);
      return value;
    },
  };
}

export function memoized<T>(
  storage: SyncStorage<T>,
  loader: SyncLoader<T>,
): SyncLoader<T> {
  return {
    get: (path) => {
      const has = storage.has(path);
      if (has) {
        return storage.get(path)!;
      }
      const value = loader.get(path);
      storage.set(path, value);
      return value;
    },
  };
}

export function concurrent<T>(loader: Loader<T>): Loader<T> {
  const promises = new Map<string, Promise<T>>();
  return {
    get: async (path) => {
      const promise = promises.get(path) ?? loader.get(path);
      promises.set(path, promise);
      const value = await promise;
      return value;
    },
  };
}

export function logged<T>(message: string, loader: Loader<T>): Loader<T> {
  return {
    get: async (path) => {
      console.log(`Loader.get ${message}: ${path}`);
      return await loader.get(path);
    },
  };
}

export function resolve<T>(
  loader: Loader<T>,
  map: (path: string) => string,
): Loader<T> {
  return {
    get: (key: string) => {
      return loader.get(map(key));
    },
  };
}

export function transform<A, B>(
  map: (value: A) => B,
  loader: Loader<A>,
): Loader<B> {
  return {
    get: async (path) => {
      return map(await loader.get(path));
    },
  };
}

export function decode(loader: Loader<Uint8Array>): Loader<string> {
  return transform(
    (value) => new TextDecoder().decode(value),
    loader,
  );
}

