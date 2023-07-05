import { Markdown } from "@/features/lit-doc/mod.ts";
import { LitElement } from "@/features/lit-doc/types.ts";
import { ViewChild } from "@/features/theme/view.tsx";

/** MAIN **/

export function lit<Data>() {
  const events: {
    type: "md";
    input: Markdown.Input<Data>;
  }[] = [];

  return {
    md: (...input: Markdown.Input<Data>) => {
      events.push({
        type: "md",
        input,
      });
    },
    editor: (data: Data) => {
      const editor = {
        children: [] as LitElement[],
        slots: {} as Record<string, unknown>,
      };

      for (const event of events) {
        switch (event.type) {
          case "md": {
            const md = Markdown.weave(event.input, { data });
            editor.children.push(...md.children);
            Object.assign(editor.slots, md.slots);
            break;
          }
          default: {
            throw new Error(`Unknown event type: ${event.type}`);
          }
        }
      }

      return editor;
    },
  };
}
