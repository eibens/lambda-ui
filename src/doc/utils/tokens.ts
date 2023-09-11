import { Editor } from "slate";
import { Node, NodeEntry } from "./schema.ts";

/** HELPERS **/

const createText = (text = ""): Node => ({
  type: "Text",
  text,
});

function* generator(str: string): Generator<Node> {
  const pattern = /:([^:\s]+):/g;

  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(str)) !== null) {
    const [_, text] = match;
    const before = str.slice(lastIndex, match.index);
    if (before) yield createText(before);
    yield {
      type: "Link",
      url: new URL(`token:///${text}`).href,
      children: [createText()],
      isInline: true,
    };
    lastIndex = pattern.lastIndex;
  }
  const after = str.slice(lastIndex);
  if (after) yield createText(after);
}

function parse(str: string): Node[] {
  return [...generator(str)];
}

/** MAIN **/

export function normalizeNode(editor: Editor, entry: NodeEntry): boolean {
  const [node, path] = entry;
  const match = node.type === "Text";
  if (!match) return false;

  const children = parse(node.text);

  if (children.length === 0) return false;

  // single child of a paragraph?
  if (children.length === 1) {
    const [child] = children;
    if (child.type !== "Link") return false;
    child.isInline = false;
  }

  Editor.withoutNormalizing(editor, () => {
    editor.removeNodes({ at: path });
    editor.insertNodes(children, { at: path });
  });

  return true;
}

export function isToken(node: Node): node is Node<"Link"> {
  return node.type === "Link" && node.url.startsWith("token:///");
}

export function parseToken(node: Node): null | {
  type: string;
  id: string;
} {
  if (!isToken(node)) return null;
  const url = new URL(node.url);
  const [, type, id] = url.pathname.split("/");
  return { type, id };
}
