import { toHashString } from "$std/crypto/to_hash_string.ts";

export async function generate(text: string) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return toHashString(hashBuffer).substring(0, 8);
}
