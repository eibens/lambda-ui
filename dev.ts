#!/usr/bin/env -S deno run -A --watch=static/,routes/
import * as Fresh from "@lambda-ui/fresh";
import * as Litdoc from "litdoc";

await Litdoc.dev(import.meta.url);
await Fresh.dev(import.meta.url, "./main.ts");
