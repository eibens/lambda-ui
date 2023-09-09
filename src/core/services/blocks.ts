import { cached, concurrent, memoized } from "litdoc/cache/mod.ts";
import { weave } from "../utils/weave.ts";
import * as Ast from "./ast.ts";
import * as Hash from "./hash.ts";
import * as Module from "./module.ts";

/** HELPERS **/

const cache = cached({
  ext: "json",
  parse: JSON.parse,
  stringify: JSON.stringify,
  path: "./.litdoc/blocks",
});

const memo = memoized(concurrent((file, hash) => {
  return cache(file, hash, async () => {
    const ast = await Ast.get(file);
    const mod = Module.get(file);
    return weave(mod, ast);
  });
}));

/** MAIN **/

export async function get(file: string) {
  const hash = await Hash.get(file);
  return memo(file, hash);
}
