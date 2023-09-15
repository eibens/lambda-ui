import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { instantiate } from "litdoc/assets/swc/deno_swc.generated.js";
import type { ParseOptions, Program } from "litdoc/utils/swc.ts";

/** HELPERS **/

const DEFAULT_URL = new URL(
  "../assets/swc/deno_swc_bg.wasm",
  import.meta.url,
);

/** MAIN **/

export type * from "litdoc/utils/swc.ts";

export type Parser = (source: string, options: ParseOptions) => Program;

let binary: Uint8Array | null = null;

export async function load(url: URL = DEFAULT_URL) {
  if (binary) return;
  const response = await fetch(url);
  const wasm = new Uint8Array(await response.arrayBuffer());
  binary = decompress(wasm);
}

export async function parse(
  source: string,
  options: ParseOptions,
): Promise<Program> {
  // NOTE: Must instantiate SWC for every parse operation.
  // Otherwise, the spans accumulate.
  await load();
  const { parseSync } = await instantiate(binary);
  return parseSync(source, options);
}
