import { toHashString } from "$std/crypto/to_hash_string.ts";
import { extname } from "$std/path/mod.ts";
import type { Call } from "litdoc/tags/mod.ts";
import { parseAst } from "./utils/ast.ts";
import { weave } from "./utils/weave.ts";

/** HELPERS **/

async function getHash(text: string) {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return toHashString(hashBuffer);
}

function getTagCalls(value: unknown) {
  if (typeof value !== "object" || value === null) return [];

  // 'doc' is the canonical name.
  // '_doc' can be used as fallback in case 'doc' is already taken.
  // '_doc' will take precedence over 'doc' if both are present.
  const doc = Reflect.get(value, "_doc") ?? Reflect.get(value, "doc");
  if (typeof doc !== "function") return [];

  return doc() as Call[];
}

/** MAIN **/

export default async function litdoc(options: {
  manifest: Record<string, unknown>;
}) {
  const { manifest } = options;

  const cache = await Deno.openKv();

  for (const file in manifest) {
    const value = manifest[file];
    const source = await Deno.readTextFile(file);
    const hash = await getHash(source);
    const ext = extname(file);
    const isScript = [".ts", ".tsx"].includes(ext);

    if (!isScript) continue;

    const calls = getTagCalls(value);
    const ast = await parseAst({
      file,
      source,
      hash,
      cache,
    });

    console.log({ file, calls });
    const result = weave(ast, calls);
    console.log(result);
  }
}
