import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { instantiate } from "litdoc/assets/swc/deno_swc.generated.js";
import type { ParseOptions, Program } from "litdoc/assets/swc/deno_swc.ts";

/** HELPERS **/

const DEFAULT_URL = new URL(
  "../assets/swc/deno_swc_bg.wasm",
  import.meta.url,
);

/** MAIN **/

export type * from "litdoc/assets/swc/deno_swc.ts";

export type SwcParser = (
  source: string,
  options: ParseOptions,
) => Promise<Program>;

export async function swc(url: URL = DEFAULT_URL): Promise<SwcParser> {
  const response = await fetch(url);
  const wasm = new Uint8Array(await response.arrayBuffer());
  const binary = decompress(wasm);
  return async (source: string, options: ParseOptions) => {
    const { parseSync } = await instantiate(binary);
    return parseSync(source, options);
  };
}
