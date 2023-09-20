#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import "$std/dotenv/load.ts";
import litdoc from "litdoc/dev.ts";
import config from "./fresh.config.ts";

await litdoc(import.meta.url, "./docs.ts", {
  root: "docs",
});

await dev(import.meta.url, "./main.ts", config);
