import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import * as Swc from "litdoc/swc/mod.ts";
import { Program } from "litdoc/swc/mod.ts";
import * as Templates from "litdoc/templates/mod.ts";
import { weave, WeaveCall, WeaveResult } from "./weave.ts";

/** HELPERS **/

const parse = await Swc.create();

function ts(...args: Templates.Args): Program {
  const template = Templates.tagged(...args);
  const source = Templates.stringify(template, String);
  return parse(source, {
    syntax: "typescript",
  });
}

/** MAIN **/

Deno.test("weave finds top-level function call", () => {
  const program = ts`
    foo("test");
  `;
  console.log(program);

  const calls: WeaveCall[] = [
    { name: "foo" },
  ];

  const expected: WeaveResult = [
    ["body", 0, "expression", "callee"],
  ];

  const actual = weave(program, calls);
  assertEquals(actual, expected);
});

Deno.test("weave finds multiple top-level function call", () => {
  const program = ts`
    foo("test");
    bar("test");
  `;

  const calls: WeaveCall[] = [
    { name: "foo" },
    { name: "bar" },
  ];

  const expected: WeaveResult = [
    ["body", 0, "expression", "callee"],
    ["body", 1, "expression", "callee"],
  ];

  const actual = weave(program, calls);
  assertEquals(actual, expected);
});

Deno.test("weave throws if there are too many function calls", () => {
  const program = ts`
    // no function calls
  `;

  const calls: WeaveCall[] = [
    { name: "foo" },
  ];

  assertThrows(() => {
    weave(program, calls);
  });
});

Deno.test("weave ignores function calls in other contexts", () => {
  const program = ts`
    if (true) {
      foo("test");
    }
  `;

  const calls: WeaveCall[] = [];

  const expected: WeaveResult = [];

  const actual = weave(program, calls);
  assertEquals(actual, expected);
});

Deno.test("weave finds tagged template literals", () => {
  const program = ts`
    foo\`test\`;
  `;

  const calls: WeaveCall[] = [
    { name: "foo" },
  ];

  const expected: WeaveResult = [
    ["body", 0, "expression", "tag"],
  ];

  const actual = weave(program, calls);
  assertEquals(actual, expected);
});
