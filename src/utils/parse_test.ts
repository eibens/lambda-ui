import { assertEquals } from "$std/assert/assert_equals.ts";
import { parse } from "litdoc/utils/parse.ts";

Deno.test("tokens are parsed", () => {
  const editor = parse(`Hello :world:!`);

  assertEquals(editor.children, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "Hello ",
    }, {
      type: "Link",
      url: "token:///world",
      isInline: true,
      children: [{
        type: "Text",
        text: "",
      }],
    }, {
      type: "Text",
      text: "!",
    }],
  }]);
});
