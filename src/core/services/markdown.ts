import { cached, concurrent, memoized } from "litdoc/cache/mod.ts";
import { toMarkdown } from "../utils/weave.ts";
import * as Blocks from "./blocks.ts";
import * as Hash from "./hash.ts";
import * as Text from "./text.ts";

/** HELPERS **/

const cache = cached({
  ext: "md",
  parse: (text: string) => text,
  stringify: (text: string) => text,
  path: "./.litdoc/md",
});

const memo = memoized(concurrent((file, hash) => {
  return cache(file, hash, async () => {
    const text = await Text.get(file);
    const blocks = await Blocks.get(file);
    return toMarkdown(blocks, text);
  });
}));

/** MAIN **/

export async function get(file: string) {
  const hash = await Hash.get(file);
  return memo(file, hash);
}
