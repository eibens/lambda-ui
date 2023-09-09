import { create } from "./create.ts";
import type { ParseOptions, Program } from "./types.ts";

export async function parse(
  source: string,
  options: ParseOptions,
): Promise<Program> {
  // NOTE: Must create SWC for every parse operation.
  // Otherwise, the spans accumulate.
  const parse = await create();
  return parse(source, options);
}
