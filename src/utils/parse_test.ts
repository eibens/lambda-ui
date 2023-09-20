import { assertEquals } from "$std/assert/assert_equals.ts";
import { parse, parseFragment } from "litdoc/utils/parse.ts";

Deno.test("single paragraph", () => {
  const node = parse(`hello world`);

  assertEquals(node, {
    type: "Root",
    children: [{
      type: "Paragraph",
      children: [{
        type: "Text",
        text: "hello world",
      }],
    }],
  });
});

Deno.test("inline token with text after", () => {
  const node = parseFragment(`:hello: world`);
  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Token",
      url: "token:///hello",
      children: [{
        type: "Text",
        text: "",
      }],
    }, {
      type: "Text",
      text: " world",
    }],
  });
});

Deno.test("inline token with text before", () => {
  const node = parseFragment(`hello :world:`);
  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Text",
      text: "hello ",
    }, {
      type: "Token",
      url: "token:///world",
      children: [{
        type: "Text",
        text: "",
      }],
    }],
  });
});

Deno.test("token that sticks to text before", () => {
  const node = parseFragment(`hello :^world:`);
  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Text",
      text: "hello",
      tokens: [
        "token:///world",
      ],
    }],
  });
});

Deno.test("token that sticks to text after", () => {
  const node = parseFragment(`:hello^: world`);

  assertEquals(node, {
    type: "Fragment",
    children: [{
      type: "Text",
      text: "world",
      tokens: [
        "token:///hello",
      ],
    }],
  });
});

Deno.test("token that sticks to parent node before", () => {
  const editor = parseFragment(`:^hello: world`);

  assertEquals(editor, {
    type: "Fragment",
    tokens: [
      "token:///hello",
    ],
    children: [{
      type: "Text",
      text: "world",
    }],
  });
});

Deno.test("token that stick to parent node after", () => {
  const editor = parseFragment(`hello :world^:`);

  assertEquals(editor, {
    type: "Fragment",
    tokens: [
      "token:///world",
    ],
    children: [{
      type: "Text",
      text: "hello",
    }],
  });
});
