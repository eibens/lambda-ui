import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { instantiate } from "./deno_swc.generated.js";
import type { ParseOptions, Program } from "./types.ts";

const DEFAULT_LOCAL_WASM_URL = new URL("./deno_swc_bg.wasm", import.meta.url);

export type Parser = (source: string, options: ParseOptions) => Program;

export async function create(options: {
  wasmUrl?: URL;
} = {}): Promise<Parser> {
  const { wasmUrl = DEFAULT_LOCAL_WASM_URL } = options;
  const wasmResponse = await fetch(wasmUrl);
  const wasmCode = new Uint8Array(await wasmResponse.arrayBuffer());
  const { parseSync } = await instantiate(decompress(wasmCode));
  return parseSync;
}
