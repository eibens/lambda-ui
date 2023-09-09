import { toHashString } from "$std/crypto/to_hash_string.ts";
import { modified } from "litdoc/cache/fs.ts";
import { memoized } from "litdoc/cache/memoized.ts";
import * as Text from "./text.ts";

/** HELPERS **/

async function hashed(text: string) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return toHashString(hashBuffer).substring(0, 8);
}

const cache = modified(memoized(
  async (file) => {
    const text = await Text.get(file);
    return hashed(text);
  },
));

/** MAIN **/

export function get(file: string) {
  return cache(file);
}
