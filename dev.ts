#!/usr/bin/env -S deno run -A --watch=static/,routes/,features/
import fresh from "$fresh/dev.ts";
import litdoc from "litdoc/dev/mod.ts";

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

await fresh(import.meta.url, "./main.ts");
