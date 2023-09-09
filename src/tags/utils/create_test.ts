import { assertEquals } from "$std/assert/assert_equals.ts";
import { create } from "./create.ts";

Deno.test("basic example works", () => {
  const tags = create();
  const { text } = tags;

  text`something`;
  text`value: ${2 * (2 * 10 + 1)}`;

  const actual = tags()
    .map((call) => {
      return {
        name: call.name,
        strings: [...call.args[0]],
        values: call.args.slice(1),
      };
    });

  const expected = [{
    name: "text",
    strings: ["something"],
    values: [],
  }, {
    name: "text",
    strings: ["value: ", ""],
    values: [42],
  }];

  assertEquals(actual, expected);
});
