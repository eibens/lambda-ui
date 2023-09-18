import { assertEquals } from "$std/assert/assert_equals.ts";
import { swc } from "litdoc/utils/swc.ts";
import { weave } from "litdoc/utils/weave.ts";

/** HELPERS **/

const parse = await swc();

async function ts(strings: TemplateStringsArray) {
  const text = strings.join("");
  return {
    text,
    program: await parse(text, {
      syntax: "typescript",
    }),
  };
}

const EXAMPLE = await ts`
const someCodeBefore = 123;

md\`
Some Markdown.
\`

const someCodeBetween = 456;

const someMoreCode = 123;

md\`
More Markdown.
\`

md\`
Even more Markdown.
\`

const someCodeAfter = 789;
`;

const MODULE = {
  doc: () => [{
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

const RESULT = `
Some Markdown.

~~~ts
const someCodeBetween = 456;

const someMoreCode = 123;
~~~

More Markdown.

Even more Markdown.
`.trim();

Deno.test("weave program works ", () => {
  const { text } = weave({
    type: "Program",
    ...EXAMPLE,
    module: MODULE,
  });

  assertEquals(text, RESULT);
});
