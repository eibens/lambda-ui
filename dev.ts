#!/usr/bin/env -S deno run -A --watch=static/,routes/
import * as Manifest from "@lambda-ui/manifest";

await Manifest.Fresh.dev(
  import.meta.url,
  "./main.ts",
);
