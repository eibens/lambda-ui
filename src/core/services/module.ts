/** HELPERS **/

const cache = new Map<string, Mod>();

/** MAIN **/

export type Mod = Record<string, unknown>;

export function get(file: string) {
  if (!cache.has(file)) throw new Error(`Module not found: ${file}`);
  return cache.get(file)!;
}

export function set(file: string, value: Mod) {
  cache.set(file, value);
}
