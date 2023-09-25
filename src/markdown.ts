import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { parseTokens } from "./tokens.ts";
import type { Fragment, Node, Root } from "./types.ts";

/** HELPERS **/

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
    const children: Node[] = [];

    let prev = node as Node;
    for (const child of list) {
      if (child.type === "Token") {
        if (child.assign === "before") {
          prev.tokens = prev.tokens ?? [];
          prev.tokens.push(child.url);
        } else if (child.assign === "after") {
          console.warn("TODO: Handle after tokens");
        } else {
          children.push(child);
          prev = child;
        }
      } else {
        children.push(child);
        prev = child;
      }
    }

    node.children = children;
  }

  return [node as Node];
}

/** MAIN **/

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
