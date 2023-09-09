import { modified } from "litdoc/cache/fs.ts";
import { memoized } from "litdoc/cache/memoized.ts";

/** HELPERS **/

const cache = modified(memoized((file) => {
  return Deno.readTextFile(file);
}));

/** MAIN **/

export function get(file: string) {
  return cache(file);
}
