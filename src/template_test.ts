import { assertEquals } from "$std/assert/assert_equals.ts";
import * as Kernel from "./kernel.ts";
import type { Litdoc, Manifest } from "./types.ts";

/** HELPERS **/

const RESULT = `
Some Markdown.

~~~ts
const half = 21;

const answer = 2 * half;
~~~

More Markdown.

Even more Markdown.
`.trim();

const main: Litdoc = {
  doc: () => manifest,
};

const manifest: Manifest = {
  baseUrl: new URL("./assets/", import.meta.url).href,
  assets: {
    ["./example.ts"]: main,
  },
  calls: [{
    args: [["Some Markdown."]],
    name: "md",
  }, {
    args: [["More Markdown."]],
    name: "md",
  }, {
    args: [["Even more Markdown."]],
    name: "md",
  }],
};

const kernel = Kernel.create(manifest);

Deno.test("stringify works for program", async () => {
  const template = await Kernel.getTemplate(kernel, "./example.ts");
  assertEquals(template, RESULT);
});
