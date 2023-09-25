import { assertEquals } from "$std/assert/assert_equals.ts";
import lit from "./lit.ts";

Deno.test("basic example works", () => {
  const doc = lit();
  const { text } = doc;

  text`something`;
  text`value: ${2 * (2 * 10 + 1)}`;

  const actual = doc()
    .calls
    ?.map((call) => {
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
