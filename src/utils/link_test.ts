import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import { parse, Program } from "litdoc/services/swc.ts";
import { Call, link, LinkResult } from "litdoc/utils/link.ts";

/** HELPERS **/

function ts(strings: TemplateStringsArray): Promise<Program> {
  const source = strings.join("");
  return parse(source, {
    syntax: "typescript",
  });
}

/** MAIN **/

Deno.test("link finds top-level function call", async () => {
  const program = await ts`
    foo("test");
  `;

  const calls: Call[] = [
    { name: "foo" },
  ];

  const expected: LinkResult = [
    ["body", 0, "expression"],
  ];

  const actual = link(program, calls);
  assertEquals(actual, expected);
});

Deno.test("link finds multiple top-level function call", async () => {
  const program = await ts`
    foo("test");
    bar("test");
  `;

  const calls: Call[] = [
    { name: "foo" },
    { name: "bar" },
  ];

  const expected: LinkResult = [
    ["body", 0, "expression"],
    ["body", 1, "expression"],
  ];

  const actual = link(program, calls);
  assertEquals(actual, expected);
});

Deno.test("link throws if there are too many function calls", async () => {
  const program = await ts`
    // no function calls
  `;

  const calls: Call[] = [
    { name: "foo" },
  ];

  assertThrows(() => {
    link(program, calls);
  });
});

Deno.test("link ignores function calls in other contexts", async () => {
  const program = await ts`
    if (true) {
      foo("test");
    }
  `;

  const calls: Call[] = [];

  const expected: LinkResult = [];

  const actual = link(program, calls);
  assertEquals(actual, expected);
});

Deno.test("link finds tagged template literals", async () => {
  const program = await ts`
    foo\`test\`;
  `;

  const calls: Call[] = [
    { name: "foo" },
  ];

  const expected: LinkResult = [
    ["body", 0, "expression"],
  ];

  const actual = link(program, calls);
  assertEquals(actual, expected);
});
