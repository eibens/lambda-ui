import { assertEquals } from "$std/assert/assert_equals.ts";
import { traverse } from "litdoc/graphs/mod.ts";

/** MAIN **/

Deno.test("traverse calls match", () => {
  const actual: unknown[] = [];
  const node = { foo: "bar" };

  traverse(node, [{
    match: (ctx) => {
      actual.push(ctx);
      return true;
    },
    apply: () => {},
  }]);

  const expected = [
    { path: [], node },
  ];

  assertEquals(actual, expected);
});

Deno.test("traverse calls apply", () => {
  const actual: unknown[] = [];
  const node = { foo: "bar" };

  traverse(node, [{
    match: () => {
      return true;
    },
    apply: (ctx) => {
      actual.push(ctx);
    },
  }]);

  const expected = [
    { path: [], node },
  ];

  assertEquals(actual, expected);
});

Deno.test("traverse visits descendants", () => {
  const actual: unknown[] = [];
  const node = {
    foo: "bar",
  };

  traverse(node, [{
    match: () => {
      return true;
    },
    apply: (ctx) => {
      actual.push(ctx);

      if (ctx.path.length === 0) {
        return [["foo"]];
      }
    },
  }]);

  const expected = [
    { path: [], node },
    { path: ["foo"], node: "bar" },
  ];

  assertEquals(actual, expected);
});
