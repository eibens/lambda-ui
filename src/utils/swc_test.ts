import { assertEquals } from "$std/assert/assert_equals.ts";
import { swc } from "litdoc/utils/swc.ts";

Deno.test("create swc parser from default URL", async () => {
  const parse = await swc();
  const program = await parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});

Deno.test("create swc parser form local URL", async () => {
  const parse = await swc(
    new URL("../assets/swc/deno_swc_bg.wasm", import.meta.url),
  );
  const program = await parse("const answer = 42;", {
    syntax: "typescript",
  });
  assertEquals(program.type, "Module");
});
