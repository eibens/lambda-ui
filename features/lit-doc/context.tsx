import { createEditor } from "slate";
import { RenderElementProps, RenderLeafProps, withReact } from "slate-react";
import { LitEditor, LitEditorMixin } from "./types.ts";

let current: LitEditor | undefined;

export function get(): LitEditor {
  if (!current) throw new Error("No editor in context.");
  return current;
}

export function set(editor?: LitEditor): void {
  if (current != null && editor != null) {
    throw new Error("Must set editor to undefined.");
  }
  current = editor;
}

export function apply(editor: LitEditor, fn: () => void): void {
  const prev = current;
  set(editor);
  fn();
  set(prev);
}

export function create(fn?: () => void): LitEditor {
  const mixin: LitEditorMixin = {
    slots: {},
    renderElement: (props: RenderElementProps) => {
      const { attributes, children } = props;
      return <div {...attributes}>{children}</div>;
    },
    renderLeaf: (props: RenderLeafProps) => {
      const { attributes, children } = props;
      return <span {...attributes}>{children}</span>;
    },
  };

  const editor = Object.assign(
    withReact(createEditor()),
    mixin,
  );

  if (fn) apply(editor, fn);

  return editor;
}
