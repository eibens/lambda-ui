import { Core, Templates } from "./plugins/mod.ts";
import * as Themes from "./themes/mod.ts";
import { Markdown, Renderers } from "./utils/mod.ts";

/** MAIN **/

export * from "./dev.ts";

export const withLitdoc = Core.create();

export function createLitdocRenderers() {
  return Renderers.create(Themes.Basic);
}

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
    doc: (data: Data): Templates.Template => {
      const doc: Templates.Template = {
        children: [],
        slots: {} as Record<string, unknown>,
      };

      for (const event of events) {
        switch (event.type) {
          case "md": {
            const md = Markdown.weave(event.input, { data });
            doc.children.push(...md.children);
            Object.assign(doc.slots, md.slots);
            break;
          }
          default: {
            throw new Error(`Unknown event type: ${event.type}`);
          }
        }
      }

      return doc;
    },
  };
}
