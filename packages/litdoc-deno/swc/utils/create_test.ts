import { assertEquals } from "$std/assert/assert_equals.ts";
import { create } from "./create.ts";

Deno.test("create swc parser from default URL", async () => {
  const parse = await create();
  const program = parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});

Deno.test("create swc parser form local URL", async () => {
  const parse = await create({
    wasmUrl: new URL("../assets/deno_swc_bg.wasm", import.meta.url),
  });
  const program = parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});
