import { toHashString } from "$std/crypto/to_hash_string.ts";
import { extname } from "$std/path/mod.ts";
import * as Swc from "litdoc/swc/mod.ts";
import type { Call } from "litdoc/tags/mod.ts";
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

async function getAst(options: {
  file: string;
  source: string;
  hash: string;
  cache: Deno.Kv;
}): Promise<Swc.Program> {
  const { file, source, hash, cache } = options;

  const key = ["litdoc-swc-cache", file];
  const entry = await cache.get<string>(key);

  if (entry.versionstamp !== null) {
    const data = JSON.parse(entry.value) as {
      hash: string;
      payload: string;
    };

    if (data.hash === hash) {
      console.log(`SWC cache hit: ${file}#${hash.slice(0, 8)}...`);
      return JSON.parse(data.payload);
    }
  }

  // NOTE: Must reload SWC for every parse operation.
  // Otherwise, the spans accumulate.
  const parse = await Swc.create();

  const ast = parse(source, {
    syntax: "typescript",
  });

  const data = JSON.stringify({
    hash,
    payload: JSON.stringify(ast),
  });

  await cache.set(key, data);
  return ast;
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
    const ast = await getAst({
      file,
      source,
      hash,
      cache,
    });

    console.log(calls);
    const result = weave(ast, calls);
    console.log(result);
  }
}
