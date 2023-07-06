#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import { globToRegExp } from "$std/path/glob.ts";
import * as Manifest from "./features/manifest/mod.ts";

const patterns = {
  feature: {
    doc: globToRegExp("/*/index.tsx"),
    module: globToRegExp("/*/mod.ts"),
  },
};

await Manifest.write(import.meta.url, {
  output: "./lit.gen.ts",
  source: "./features",
  filter: (path) => {
    if (patterns.feature.doc.test(path)) return true;
    if (patterns.feature.module.test(path)) return true;
    return false;
  },
});

await dev(import.meta.url, "./main.ts");
