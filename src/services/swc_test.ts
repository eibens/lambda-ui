import { assertEquals } from "$std/assert/assert_equals.ts";
import { load, parse } from "litdoc/services/swc.ts";

Deno.test("create swc parser from default URL", async () => {
  const program = await parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});

Deno.test("create swc parser form local URL", async () => {
  await load(new URL("../assets/swc/deno_swc_bg.wasm", import.meta.url));
  const program = await parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});
