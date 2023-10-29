import type { Lit, Manifest } from "./lit.ts";

/** MAIN **/

export function getManifest(mod: unknown): Manifest | null {
  if (mod == null) return null;
  if (typeof mod !== "object") return null;
  if (!("doc" in mod)) return null;
  if (typeof mod.doc !== "function") return null;
  const doc = mod.doc as Lit;
  const manifest = doc();
  return manifest;
}
