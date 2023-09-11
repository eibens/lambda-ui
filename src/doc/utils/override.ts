import { Editor, Element, NodeEntry, Operation } from "slate";

/** MAIN **/

export type Plugin = Partial<{
  isInline: (editor: Editor, element: Element) => boolean;
  isVoid: (editor: Editor, element: Element) => boolean;
  normalizeNode: (editor: Editor, entry: NodeEntry, next: () => void) => void;
  onChange: (editor: Editor, options?: { operation?: Operation }) => void;
}>;

export function override(plugin: Plugin) {
  return (editor: Editor): Editor => {
    const { isInline, isVoid, normalizeNode, onChange } = editor;
    return Object.assign(editor, {
      isInline: (element: Element) => {
        return plugin.isInline?.(editor, element) || isInline(element);
      },
      isVoid: (element: Element) => {
        return plugin.isVoid?.(editor, element) || isVoid(element);
      },
      normalizeNode: (entry: NodeEntry, options: {
        operation?: Operation;
      }) => {
        const next = () => normalizeNode(entry, options);
        if (!plugin.normalizeNode) return next();
        plugin.normalizeNode(editor, entry, next);
      },
      onChange: (options?: { operation?: Operation }) => {
        plugin.onChange?.(editor, options);
        onChange(options);
      },
    });
  };
}
