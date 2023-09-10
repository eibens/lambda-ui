#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import "$std/dotenv/load.ts";
import { dev as litdoc } from "litdoc/mod.ts";
import config from "./fresh.config.ts";

await litdoc(import.meta.url, {
  routes: {
    match: [
      /example\.tsx$/,
      ///src\/.*\/index\.tsx$/,
    ],
    skip: [
      /\/\.todo\//,
      /\/\routes\//,
    ],
  },
});

await dev(import.meta.url, "./main.ts", config);
