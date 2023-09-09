import { Editor } from "slate";
import { Node, NodeEntry } from "./schema.ts";

function* generator(str: string): Generator<Node> {
  const pattern = /\{\{id:([-_a-zA-Z0-9]+)\}\}/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(str)) !== null) {
    const [_, id] = match;

    yield {
      type: "Text",
      text: str.slice(lastIndex, match.index),
    };

    yield {
      type: "Value",
      id,
      isInline: true,
      children: [{
        type: "Text",
        text: "",
      }],
    };

    lastIndex = pattern.lastIndex;
  }

  yield {
    type: "Text",
    text: str.slice(lastIndex),
  };
}

function parse(str: string): Node[] {
  return Array.from(generator(str));
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
