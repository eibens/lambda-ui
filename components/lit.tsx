import { Markdown, Template } from "@/features/lit-doc/mod.ts";
import { LitElement } from "@/features/lit-doc/types.ts";

/** MAIN **/

export function lit() {
  const editor = {
    children: [] as LitElement[],
    slots: {} as Record<string, unknown>,
  };
  return {
    editor,
    md: (...input: Template.Input) => {
      const md = Markdown.parse(...input);
      editor.children.push(...md.children);
      Object.assign(editor.slots, md.slots);
    },
  };
}
