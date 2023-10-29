import { assertEquals } from "$std/assert/assert_equals.ts";
import type { Manifest } from "./lit.ts";
import { async, memory } from "./storage.ts";

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

const modules: Record<string, unknown> = {
  "./example.ts": {
    doc: () => manifest,
  },
};

const manifest: Manifest = {
  assets: {},
  routes: {},
  calls: [{
    type: "Call",
    args: [["Some Markdown."]],
    name: "md",
  }, {
    type: "Call",
    args: [["More Markdown."]],
    name: "md",
  }, {
    type: "Call",
    args: [["Even more Markdown."]],
    name: "md",
  }],
};

const compiler = Compiler.create({
  cache: async(memory()),
  import: (path) => Promise.resolve(modules[path]),
  read: () => {
    
  },
});

compiler.getValues;

Deno.test("stringify works for program", async () => {
  const template = await compiler.getTemplate("./example.ts");
  assertEquals(template, RESULT);
});
