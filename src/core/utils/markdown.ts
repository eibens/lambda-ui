import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Root } from "litdoc/doc/mod.ts";

/** HELPERS **/

function fix(node: Record<string, unknown>) {
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

  // Convert InlineCode nodes to Code elements.
  if (node.type === "InlineCode") {
    node.type = "Code";
    node.isInline = true;
    node.children = [{ type: "Text", text: node.text }];
    delete node.text;
  }

  // Some nodes in Markdown AST have not children.
  // These need an empty text element for Slate compatibility.
  // Ignore elements with child array.
  const hasChildren = "children" in node;
  const isText = typeof node.text === "string";
  if (!hasChildren && !isText) {
    node.children = [{
      type: "Text",
      text: "",
    }];
  }

  // Recurse into child nodes.
  if (Array.isArray(node.children)) {
    node.children.forEach(fix);
  }
}

/** MAIN **/

export function parse(str: string): Root {
  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(str);

  fix(root as unknown as Record<string, unknown>);

  // Assume all compatibility problems have now been fixed in order to cast.
  return root as unknown as Root;
}
