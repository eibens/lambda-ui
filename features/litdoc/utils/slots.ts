import { Editor, Node, NodeEntry } from "slate";
import { mapped } from "./mapped.ts";

export function parse(str: string) {
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

  return [...generator(str)];
}

export function replace(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (node.type !== "Text") return false;

  const children = parse(node.text);
  if (children.length === 1) return false;

  editor.removeNodes({ at: path });
  editor.insertNodes(children, { at: path });

  return true;
}

export function replaceAll(
  editor: Editor,
) {
  mapped(editor, (entry) => replace(editor, entry), {
    at: [],
    voids: true,
    match: (node) => node.type === "Text",
  });
}
