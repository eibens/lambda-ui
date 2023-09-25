#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import "$std/dotenv/load.ts";
import config from "./fresh.config.ts";
import { generate } from "./src/dev.ts";

await generate(import.meta.url, "./docs.ts", {
  root: "src/docs",
});

await dev(import.meta.url, "./main.ts", config);
