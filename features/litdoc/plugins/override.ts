import { BaseEditor, Element, NodeEntry, Operation } from "slate";

export type Plugin = Partial<{
  isInline: (element: Element) => boolean;
  isVoid: (element: Element) => boolean;
  normalizeNode: (entry: NodeEntry, next: () => void) => void;
  onChange: (options?: { operation?: Operation }) => void;
}>;

export function create(
  plugin: Plugin,
) {
  return <E extends BaseEditor>(editor: E) => {
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
  };
}
