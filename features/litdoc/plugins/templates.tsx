import { Editor, Element, Text } from "slate";

export type Template = {
  children: (Element | Text)[];
  slots: Record<string, unknown>;
};

export type Mixin = {
  slots: Record<string, unknown>;
  addTemplate: (template: Template) => void;
};

export function create() {
  return (editor: Editor & Mixin) => {
    return Object.assign(editor, {
      slots: {},
      addTemplate: (template: Template) => {
        editor.children.push(...template.children);
        Object.assign(editor.slots, template.slots);
        editor.normalize({ force: true });
      },
    });
  };
}
