import { Editor } from "slate";
import { Node, NodeEntry } from "./schema.ts";

/** HELPERS **/

const createText = (text = ""): Node => ({
  type: "Text",
  text,
});

const createToken = (text: string): Node => ({
  type: "Token",
  children: [createText(text)],
});

function* generator(str: string): Generator<Node> {
  const iconRegex = /:([-_a-zA-Z0-9]+):/g;

  let lastIndex = 0;
  let match;
  while ((match = iconRegex.exec(str)) !== null) {
    const [_, name] = match;
    yield createText(str.slice(lastIndex, match.index));
    yield createToken(name);
    lastIndex = iconRegex.lastIndex;
  }
  yield createText(str.slice(lastIndex));
}

function parse(str: string): Node[] {
  return [...generator(str)];
}

/** MAIN **/

export function match(_: Editor, node: Node): node is Node<"Text"> {
  return node.type === "Text";
}

export function apply(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (!match(editor, node)) return false;

  const children = parse(node.text);
  if (children.length === 1) return false;

  editor.removeNodes({ at: path });
  editor.insertNodes(children, { at: path });

  return true;
}
