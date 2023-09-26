import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import type {
  Call,
  Fragment,
  Node,
  Program,
  Root,
  Template,
  Value,
} from "./types.ts";

/** HELPERS **/

function* parseTokens(str: string): Generator<Node> {
  const createText = (text = ""): Node => ({
    type: "Text",
    text,
  });

  const pattern = /:([^:\s]+):/g;

  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(str)) !== null) {
    const [_, data] = match;
    const before = str.slice(lastIndex, match.index);
    if (before) yield createText(before);

    const children = [createText()];
    const getUrl = (text: string) => new URL(`token:///${text}`).toString();
    if (data.startsWith("^")) {
      yield {
        type: "Token",
        assign: "before" as const,
        url: getUrl(data.slice(1)),
        children,
      };
    } else if (data.endsWith("^")) {
      yield {
        type: "Token",
        assign: "after" as const,
        url: getUrl(data.slice(0, -1)),
        children,
      };
    } else {
      yield {
        type: "Token",
        url: getUrl(data),
        children,
      };
    }

    lastIndex = pattern.lastIndex;
  }
  const after = str.slice(lastIndex);
  if (after) yield createText(after);
}

function fix(node: Record<string, unknown>): Node[] {
  // Right now, we are not using the position data.
  delete node.position;

  // from lowerCamelCase to UpperCamelCase
  const type = node.type as string;
  node.type = type.replace(/^[a-z]/, (c) => c.toUpperCase());

  // In Markdown AST, nodes that contain text are typed as Literal.
  // A Literal has a `value` property that contains the text.
  const isLiteral = typeof node.value === "string";
  if (isLiteral) {
    // Rename the `value` property to `text` for each such node.
    node.text = node.value;
    delete node.value;
  }

  // Convert markdown code nodes to Code elements.
  if (node.type === "InlineCode" || node.type === "Code") {
    node.isInline = node.type === "InlineCode";
    node.type = "Code";
    node.children = [{ type: "Text", text: node.text }];
    delete node.text;
  }

  // Some nodes in Markdown AST have no children.
  // These need an empty text element for Slate compatibility.
  // Ignore elements with child array.
  const hasChildren = "children" in node;
  const isText = typeof node.text === "string";
  if (!hasChildren && !isText) {
    node.children = [{ type: "Text", text: "" }];
  }

  // Parse tokens in text nodes.
  if (node.type === "Text") {
    const text = node.text as string;
    return Array.from(parseTokens(text));
  }

  // Recurse into child nodes.
  if (Array.isArray(node.children)) {
    const list = node.children.flatMap(fix);
    node.children = list;
  }

  return [node as Node];
}

function stringifyCode(text: string, lang: string): string {
  if (lang === "md") return text;
  if (lang === "ts") return `~~~ts\n${text.trim()}\n~~~`;
  return `~~~${lang}\n${text}\n~~~`;
}

function stringifyBlocks(block: { lang: string; text: string }[]) {
  return block
    .map(({ lang, text }) => stringifyCode(text, lang))
    .join("\n\n");
}

/** MAIN **/

export function weave(
  template: Template,
  offset = 0,
): [string, ...Value[]] {
  const [strings, ...values] = template;

  const newValues: Value[] = [];
  const iter = (function* (): Generator<string> {
    for (let i = 0; i < strings.length; i++) {
      yield strings[i];
      if (i >= values.length) break;

      const value = values[i];
      newValues.push(value);
      const innerOffset = offset + newValues.length;

      if (value === undefined) yield "";
      else if (value === null) yield "";
      else if (typeof value === "boolean") yield "";
      else if (typeof value === "number") yield value.toString();
      else if (typeof value === "string") yield value;
      else if (typeof value === "object") {
        const array = [value].flat();
        for (const item of array) {
          const type = Reflect.get(item, "type");
          if (type === "Call") {
            const call = item as Call;
            const result = weave(call.args, innerOffset);
            const [text, ...values] = result;
            yield text;
            newValues.push(...values);
          }
        }
      } else {
        yield `:values/${innerOffset}:`;
      }
    }
  })();

  const text = Array.from(iter).join("");
  return [text, ...newValues];
}

export function stringifyCalls(calls: Call[]) {
  const blocks = calls.map((call, i) => {
    const { args, name: lang } = call;
    const [text] = weave(args, i);
    return { lang, text };
  });

  return stringifyBlocks(blocks);
}

export function stringifyProgram(options: {
  program: Program;
  text: string;
  calls: Call[];
}) {
  const { program, text: source, calls } = options;

  let cursor = 0;
  let valueOffset = 0;
  const blocks: { lang: string; text: string }[] = [];

  for (let i = 0; i < program.body.length; i++) {
    // Ignore everything after the last template.
    if (calls.length === 0) break;

    // A template is an expression statement...
    const node = program.body[i];
    if (node.type !== "ExpressionStatement") continue;

    // ... of either a call or a tagged template...
    const { expression } = node;
    const isCall = expression.type === "CallExpression";
    const isTagged = expression.type === "TaggedTemplateExpression";
    if (!isCall && !isTagged) continue;

    // ... that has an identifier as callee or tag...
    const identifier = isCall ? expression.callee : expression.tag;
    if (identifier.type !== "Identifier") continue;

    // ... that matches the next call in the queue.
    if (identifier.value !== calls[0].name) continue;

    // Before adding the template, add code since the last one.
    // Unless, this is the first template or empty, then ignore.
    const { start, end } = program.body[i].span;
    if (blocks.length > 0) {
      const text = source.slice(cursor, start - 1);
      if (text.trim().length > 0) {
        blocks.push({ lang: "ts", text });
      }
    }

    // Add the template.
    const { args, name: lang } = calls.shift()!;
    const [text] = weave(args, valueOffset);
    blocks.push({ lang, text });

    cursor = end;
    valueOffset += args.length - 1;
  }

  return stringifyBlocks(blocks);
}

export function parse(str: string): Root {
  const parsed = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(str);

  const nodes = fix(parsed as unknown as Record<string, unknown>);
  const root = nodes[0] as Root;
  return root;
}

export function parseFragment(str: string): Fragment {
  const root = parse(str);

  if (root.children.length > 1) {
    throw new Error(
      "Inline markdown must not contain multiple blocks. Single paragraph expected.",
    );
  }

  const [child] = root.children;
  if (child.type !== "Paragraph") {
    throw new Error(
      `Inline markdown must be a paragraph. Got ${child.type}.`,
    );
  }

  return {
    type: "Fragment",
    children: child.children,
  };
}

export function md(strings: TemplateStringsArray, ...values: Value[]): Call {
  return {
    type: "Call",
    name: "md",
    args: [[...strings], ...values],
  };
}

export function mdi(
  strings: TemplateStringsArray,
  ...values: Value[]
) {
  return {
    type: "Call",
    name: "mdi",
    args: [[...strings], ...values],
  };
}
