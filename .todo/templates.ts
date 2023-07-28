import { Editor, Element, Node, Transforms } from "slate";

/** HELPERS **/

function inline(editor: Editor) {
  // Replace the slots with explicit slot nodes.
  for (const [node, path] of editor.nodes()) {
    if (!Element.isElement(node)) continue;
    if (node.type !== "Value") continue;

    const value = editor.values[node.id];
    if (Node.isNode(value)) {
      Transforms.select(editor, {
        anchor: Editor.start(editor, path),
        focus: Editor.end(editor, path),
      });
    }
  }
}

export type Value<T = never> =
  | undefined
  | null
  | boolean
  | number
  | string
  | T
  | Value<T>[];

function stringify(
  value: unknown,
  fallback?: (value: unknown) => string,
): string {
  const recurse = (value: unknown) => stringify(value, props, fallback);
  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  if (fallback) return fallback(value);
  return String(value);
}

export type Mixin = {
  values: Record<string, unknown>;
  insertTemplate: (editor: Editor) => void;
};

export function create() {
  return (editor: Editor & Mixin) => {
    return Object.assign(editor, {
      values: {},
      insertTemplate: (other: Editor) => {
        editor.insertFragment(other.children);
        Object.assign(editor.values, other.values);
      },
    });
  };
}
