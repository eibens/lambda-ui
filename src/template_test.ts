import { assertEquals } from "$std/assert/assert_equals.ts";
import * as Kernel from "./kernel.ts";
import { parse, parseFragment } from "./template.ts";
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

const kernel = Kernel.create(manifest);

Deno.test("stringify works for program", async () => {
  const template = await Kernel.getTemplate(kernel, "./example.ts");
  assertEquals(template, RESULT);
});

Deno.test("single paragraph", () => {
  const node = parse(`hello world`);

  assertEquals(node, {
    type: "Root",
    children: [{
      type: "Paragraph",
      children: [{
        type: "Text",
        text: "hello world",
      }],
    }],
  });
});

Deno.test("inline token with text after", () => {
  const node = parseFragment(`:hello: world`);
  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Token",
      url: "token:///hello",
      children: [{
        type: "Text",
        text: "",
      }],
    }, {
      type: "Text",
      text: " world",
    }],
  });
});

Deno.test("inline token with text before", () => {
  const node = parseFragment(`hello :world:`);
  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Text",
      text: "hello ",
    }, {
      type: "Token",
      url: "token:///world",
      children: [{
        type: "Text",
        text: "",
      }],
    }],
  });
});
