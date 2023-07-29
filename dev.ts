#!/usr/bin/env -S deno run -A --watch=static/,routes/,features/
import dev from "$fresh/dev.ts";
import devLitdoc from "litdoc/dev";

await devLitdoc(import.meta.url, {
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
