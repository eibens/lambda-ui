import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import * as Swc from "litdoc/swc/mod.ts";
import { Program } from "litdoc/swc/mod.ts";
import * as Templates from "litdoc/templates/mod.ts";
import { Call, link, LinkResult } from "./link.ts";

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

Deno.test("link finds top-level function call", () => {
  const program = ts`
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

Deno.test("link finds multiple top-level function call", () => {
  const program = ts`
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

Deno.test("link throws if there are too many function calls", () => {
  const program = ts`
    // no function calls
  `;

  const calls: Call[] = [
    { name: "foo" },
  ];

  assertThrows(() => {
    link(program, calls);
  });
});

Deno.test("link ignores function calls in other contexts", () => {
  const program = ts`
    if (true) {
      foo("test");
    }
  `;

  const calls: Call[] = [];

  const expected: LinkResult = [];

  const actual = link(program, calls);
  assertEquals(actual, expected);
});

Deno.test("link finds tagged template literals", () => {
  const program = ts`
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
