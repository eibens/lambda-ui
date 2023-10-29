import { extname } from "$std/path/extname.ts";
import { instantiate } from "./assets/swc/deno_swc.generated.js";
import type { ParseOptions, Program } from "./assets/swc/deno_swc.ts";

/** HELPERS **/

function getParseOptions(path: string): ParseOptions {
  const language = extname(path).slice(1);
  const isTypescript = ["ts", "tsx"].includes(language);
  const isJavascript = ["js", "jsx"].includes(language);
  const isScript = isTypescript || isJavascript;
  if (!isScript) {
    throw new Error(
      `Unsupported file extension: ${path}. Only .js, .jsx, .ts, and .tsx are supported.`,
    );
  }
  const tsx = ["tsx", "jsx"].includes(language);
  const syntax = isTypescript ? "typescript" : "ecmascript";
  return { syntax, tsx };
}

/** MAIN **/

export type { Program };

export const PATH = "swc.wasm";

export const ASSETS = {
  [PATH]: new URL(
    "./assets/swc/deno_swc_bg.wasm",
    import.meta.url,
  ),
};

export async function parse(
  swc: Uint8Array,
  text: string,
  path: string,
) {
  const { parseSync } = await instantiate(swc);
  return parseSync(text, getParseOptions(path));
}
