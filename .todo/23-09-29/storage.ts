import { dirname } from "$std/path/dirname.ts";

export type SyncStorage<T> = {
  has: (key: string) => boolean;
  get: (key: string) => T;
  set: (key: string, value: T) => void;
  delete: (key: string) => void;
};

export type Storage<T> = {
  has: (key: string) => Promise<boolean>;
  get: (key: string) => Promise<T>;
  set: (key: string, value: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

export function files(): Storage<Uint8Array> {
  return {
    has: async (key) => {
      try {
        await Deno.stat(key);
        return true;
      } catch {
        return false;
      }
    },
    get: async (key) => {
      return await Deno.readFile(key);
    },
    set: async (key, value) => {
      await Deno.mkdir(dirname(key), { recursive: true });
      await Deno.writeFile(key, value);
    },
    delete: async (key) => {
      await Deno.remove(key, { recursive: true });
    },
  };
}

export function memory<T>(
  initial: Record<string, T> = {},
): SyncStorage<T> {
  const values = { ...initial };
  return {
    has: (key) => {
      return key in values;
    },
    get: (key) => {
      if (!(key in values)) {
        throw new Error(`Unknown key: ${key}`);
      }
      return values[key];
    },
    set: (key, value) => {
      values[key] = value;
    },
    delete: (key) => {
      delete values[key];
    },
  };
}

export function decode(storage: Storage<Uint8Array>): Storage<string> {
  return {
    has: storage.has,
    get: async (key) => {
      const bytes = await storage.get(key);
      return new TextDecoder().decode(bytes);
    },
    set: async (key, value) => {
      const bytes = new TextEncoder().encode(value);
      await storage.set(key, bytes);
    },
    delete: storage.delete,
  };
}

export function resolve<T>(
  storage: Storage<T>,
  map: (key: string) => string,
): Storage<T> {
  return {
    has: (key: string) => {
      return storage.has(map(key));
    },
    get: (key: string) => {
      return storage.get(map(key));
    },
    set: (key: string, value: T) => {
      return storage.set(map(key), value);
    },
    delete: (key: string) => {
      return storage.delete(map(key));
    },
  };
}

export function parse<T>(storage: Storage<string>, format: {
  parse: (content: string) => T;
  stringify: (value: T) => string;
} = JSON): Storage<T> {
  return {
    has: storage.has,
    get: async (key: string) => {
      return format.parse(await storage.get(key));
    },
    set: async (key: string, value: T) => {
      const content = format.stringify(value);
      await storage.set(key, content);
    },
    delete: async (key: string) => {
      await storage.delete(key);
    },
  };
}

export function freeze<T>(storage: Storage<T>): Storage<T> {
  return {
    has: storage.has,
    get: storage.get,
    set: () => {
      throw new Error("Cannot set frozen storage");
    },
    delete: () => {
      throw new Error("Cannot delete frozen storage");
    },
  };
}

export function logged<T>(message: string, storage: Storage<T>): Storage<T> {
  return {
    has: storage.has,
    get: async (key: string) => {
      console.log(`Storage.get ${message}: ${key}`);
      return await storage.get(key);
    },
    set: async (key: string, value: T) => {
      console.log(`Storage.set ${message}: ${key}`);
      await storage.set(key, value);
    },
    delete: async (key: string) => {
      console.log(`Storage.delete ${message}: ${key}`);
      await storage.delete(key);
    },
  };
}

export function async<T>(store: SyncStorage<T>) {
  return {
    has: (key: string) => {
      return Promise.resolve(store.has(key));
    },
    get: (key: string) => {
      return Promise.resolve(store.get(key));
    },
    set: (key: string, value: T) => {
      return Promise.resolve(store.set(key, value));
    },
    delete: (key: string) => {
      return Promise.resolve(store.delete(key));
    },
  };
}

export function optional<T>(store: Storage<T>): Storage<T | null> {
  return {
    has: store.has,
    delete: store.delete,
    get: async (key: string) => {
      return await store.has(key) ? await store.get(key) : null;
    },
    set: (key: string, value: T | null) => {
      return value == null ? store.delete(key) : store.set(key, value);
    },
  };
}

export function manager<T>(storages: {
  delete: (key: string) => Promise<void>;
}[]) {
  return {
    delete: async (key: string) => {
      await Promise.all(storages.map((storage) => storage.delete(key)));
    },
  };
}
