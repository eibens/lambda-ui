import { assertEquals } from "$std/assert/assert_equals.ts";
import { h } from "preact";
import { create } from "./create.ts";

Deno.test("tokens are parsed", () => {
  const editor = create({
    values: {},
    children: [{
      type: "Paragraph",
      children: [{
        type: "Text",
        text: "Hello :world:!",
      }],
    }],
  });

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

Deno.test("vdom is ignored", () => {
  const editor = create({
    values: {
      world: h("div", {}, "you"),
    },
    children: [{
      type: "Paragraph",
      children: [{
        type: "Text",
        text: "Hello :values/world:!",
      }],
    }],
  });

  assertEquals(editor.children, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "Hello ",
    }, {
      type: "Link",
      url: "token:///values/world",
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
