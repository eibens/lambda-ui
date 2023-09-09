export type Loader<T> = (key: string, version?: unknown) => Promise<T>;

export type Entry<T> = {
  version: unknown;
  value: T;
};

export type Storage<T> = Map<string, Entry<T>>;
