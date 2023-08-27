export * from "slate";
import {
  createEditor,
  Editor,
  EditorNodesOptions,
  Element,
  Node,
  NodeEntry,
  Operation,
} from "slate";

export type Plugin = Partial<{
  isInline: (element: Element) => boolean;
  isVoid: (element: Element) => boolean;
  normalizeNode: (entry: NodeEntry, next: () => void) => void;
  onChange: (options?: { operation?: Operation }) => void;
}>;

export function create(children: Node[]) {
  const editor = createEditor();
  editor.children = children;
  return editor;
}

export function map(
  editor: Editor,
  options: EditorNodesOptions<Node> & {
    apply: (entry: NodeEntry<Node>) => boolean;
  },
) {
  const { apply, ...nodesOptions } = options;
  const iter = editor.nodes(nodesOptions);
  const entries = Array.from(iter);
  if (entries.length === 0) return;

  for (const entry of entries) {
    if (apply(entry)) {
      map(editor, options);
      return;
    }
  }
}

export function override(
  editor: Editor,
  plugin: Plugin,
) {
  const { isInline, isVoid, normalizeNode, onChange } = editor;
  return Object.assign(editor, {
    isInline: (element: Element) => {
      return plugin.isInline?.(element) || isInline(element);
    },
    isVoid: (element: Element) => {
      return plugin.isVoid?.(element) || isVoid(element);
    },
    normalizeNode: (entry: NodeEntry, options: {
      operation?: Operation;
    }) => {
      const next = () => normalizeNode(entry, options);
      if (!plugin.normalizeNode) return next();
      plugin.normalizeNode(entry, next);
    },
    onChange: (options?: { operation?: Operation }) => {
      plugin.onChange?.(options);
      onChange(options);
    },
  });
}
