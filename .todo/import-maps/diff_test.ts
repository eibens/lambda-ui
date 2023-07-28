import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { diff, ImportMap, ImportMapDiff } from "./diff.ts";

Deno.test("diff", () => {
  const a: ImportMap = {
    imports: {
      "a": "foo",
      "b": "bar",
    },
  };

  const b: ImportMap = {
    imports: {
      "a": "foo",
      "b": "baz",
    },
  };

  const d: ImportMapDiff = {
    imports: {
      "a": {
        operation: "retain",
        value: "foo",
      },
      "b": {
        operation: "update",
        value: "baz",
        previous: "bar",
      },
    },
  };

  assertEquals(d, diff(a, b));
});
