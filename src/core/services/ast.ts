import { cached, concurrent, memoized } from "litdoc/cache/mod.ts";
import { parse } from "litdoc/swc/mod.ts";
import * as Config from "./config.ts";
import * as Hash from "./hash.ts";
import * as Text from "./text.ts";

/** HELPERS **/

const cache = cached({
  ext: "json",
  path: "./.litdoc/ast",
  parse: JSON.parse,
  stringify: (value) => JSON.stringify(value, null, Config.formatAst ? 2 : 0),
});

const memo = memoized(concurrent((file, hash) => {
  return cache(file, hash, async () => {
    const text = await Text.get(file);
    return parse(text, {
      syntax: "typescript",
    });
  });
}));

/** MAIN **/

export async function get(file: string) {
  const hash = await Hash.get(file);
  return memo(file, hash);
}
