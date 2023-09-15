import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import * as IconLists from "litdoc/utils/icon_lists.ts";
import type { Root } from "litdoc/utils/schema.ts";
import * as Tokens from "litdoc/utils/tokens.ts";
import { createEditor, Editor, Element, NodeEntry, Text } from "slate";

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

  // Convert markdown code nodes to Code elements.
  if (node.type === "InlineCode" || node.type === "Code") {
    node.isInline = node.type === "InlineCode";
    node.type = "Code";
    node.children = [{ type: "Text", text: node.text }];
    delete node.text;
  }

  // Some nodes in Markdown AST have not children.
  // These need an empty text element for Slate compatibility.
  // Ignore elements with child array.
  const hasChildren = "children" in node;
  const isText = typeof node.text === "string";
  if (!hasChildren && !isText) {
    node.children = [{ type: "Text", text: "" }];
  }

  // Recurse into child nodes.
  if (Array.isArray(node.children)) {
    node.children.forEach(fix);
  }
}

function isInline(node: Element) {
  if ("isInline" in node) return Boolean(node.isInline);
  return [
    "Emphasis",
    "Strong",
    "Delete",
    "Link",
  ].includes(node.type);
}

function isVoid(node: Element) {
  if ("isVoid" in node) return Boolean(node.isVoid);
  return [
    "ThematicBreak",
    "Image",
    "Html",
    "Break",
    "FootnoteReference",
    "LinkReference",
  ].includes(node.type);
}

function normalizeNode(
  editor: Editor,
  entry: NodeEntry,
) {
  const [node, path] = entry;

  if (!node.type) {
    const isEmptyText = Text.isText(node) && editor.string(path) === "";
    const type = isEmptyText ? "Text" : "Unknown";
    editor.setNodes({ type }, { at: path });
    return true;
  }

  if (Tokens.normalizeNode(editor, entry)) {
    return true;
  }

  if (IconLists.normalizeNode(editor, entry)) {
    return true;
  }

  return false;
}

/** MAIN **/

export function parse(str: string): Editor {
  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(str);

  fix(root as unknown as Record<string, unknown>);

  const editor = createEditor();
  const old = { ...editor };

  editor.children = (root as Root).children;

  editor.values = {};

  editor.type = "Root";

  editor.isInline = (node) => {
    return isInline(node) || old.isInline(node);
  };

  editor.isVoid = (node) => {
    return isVoid(node) || old.isVoid(node);
  };

  editor.normalizeNode = (entry, options) => {
    const applied = normalizeNode(editor, entry);
    if (applied) return;
    old.normalizeNode(entry, options);
  };

  editor.normalize({
    force: true,
  });

  return editor;
}
