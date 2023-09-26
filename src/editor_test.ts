import { assertEquals } from "$std/assert/assert_equals.ts";
import { create } from "./editor.ts";
import * as Template from "./template.ts";
import { md, weave } from "./template.ts";
import { Value } from "./types.ts";

function parse(template: string, values?: Record<string | number, Value>) {
  const root = Template.parse(template);
  const editor = create(root, values);
  return editor.children;
}

Deno.test("token that sticks to text before", () => {
  const node = parse(`hello :^world:`);
  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "hello",
      tokens: [
        "token:///world",
      ],
    }],
  }]);
});

Deno.test("token that sticks to text after", () => {
  const node = parse(`:hello^: world`);

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "world",
      tokens: [
        "token:///hello",
      ],
    }],
  }]);
});

Deno.test("token that sticks to parent node before", () => {
  const node = parse(`:^hello: world`);

  assertEquals(node, [{
    type: "Paragraph",
    tokens: [
      "token:///hello",
    ],
    children: [{
      type: "Text",
      text: "world",
    }],
  }]);
});

Deno.test("token that stick to parent node after", () => {
  const node = parse(`hello :world^:`);

  assertEquals(node, [{
    type: "Paragraph",
    tokens: [
      "token:///world",
    ],
    children: [{
      type: "Text",
      text: "hello",
    }],
  }]);
});

Deno.test("inserts node as value", () => {
  const node = parse(`hello :values/world:`, {
    world: {
      type: "Emphasis",
      children: [{
        type: "Text",
        text: "world",
      }],
    },
  });

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "hello ",
    }, {
      type: "Emphasis",
      children: [{
        type: "Text",
        text: "world",
      }],
    }, {
      text: "",
      type: "Text",
    }],
  }]);
});

Deno.test("inserts multiple nodes as value", () => {
  const node = parse(`hello :values/world:`, {
    world: [{
      type: "Emphasis",
      children: [{
        type: "Text",
        text: "world",
      }],
    }, {
      type: "Text",
      text: "!",
    }],
  });

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "hello ",
    }, {
      type: "Emphasis",
      children: [{
        type: "Text",
        text: "world",
      }],
    }, {
      text: "!",
      type: "Text",
    }],
  }]);
});

Deno.test("unwraps fragment node", () => {
  const node = parse(`hello :values/world:`, {
    world: {
      type: "Fragment",
      children: [{
        type: "Text",
        text: "world",
      }],
    },
  });

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "hello world",
    }],
  }]);
});

Deno.test("unwraps root node", () => {
  const node = parse(`hello :values/world:`, {
    world: {
      type: "Root",
      children: [{
        type: "Paragraph",
        children: [{
          type: "Text",
          text: "world",
        }],
      }],
    },
  });

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "hello ",
    }],
  }, {
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "world",
    }],
  }]);
});

Deno.test("handles nested calls", () => {
  const call = md`${"foo"} ${md`${"bar"} ${md`${"baz"}`}`}`;
  const [template, ...args] = weave(call.args);
  const values = Object.fromEntries(args.entries());
  const node = parse(template, values);

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "foo bar baz",
    }],
  }]);
});

Deno.test("handles nested arrays of calls", () => {
  const array = [md`foo`, md`bar`, md`baz`];
  const call = md`${array}`;
  const [template, ...args] = weave(call.args);
  const values = Object.fromEntries(args.entries());
  const node = parse(template, values);

  assertEquals(node, [{
    type: "Paragraph",
    children: [{
      type: "Text",
      text: "foobarbaz",
    }],
  }]);
});
