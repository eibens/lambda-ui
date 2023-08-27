import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { create } from "./mod.ts";

Deno.test("create swc parser from default URL", async () => {
  const parse = await create();
  const program = parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});

Deno.test("create swc parser form local URL", async () => {
  const parse = await create({
    wasmUrl: new URL("./deno_swc_bg.wasm", import.meta.url),
  });
  const program = parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});
