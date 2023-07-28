#!/usr/bin/env -S deno run -A --watch=static/,routes/,features/
import dev from "$fresh/dev.ts";
import * as Litdoc from "litdoc";

await Litdoc.dev(import.meta.url, {
  routes: {
    match: [
      /\/index\.tsx?$/,
    ],
    skip: [
      /\/\.todo\//,
      /\/\routes\//,
    ],
  },
});

await dev(import.meta.url, "./main.ts");
