import { Node } from "slate";
import { Core, Templates } from "./plugins/mod.ts";
import * as Themes from "./themes/mod.ts";
import { Markdown, Renderers } from "./utils/mod.ts";

/** MAIN **/

export * from "./dev.ts";

export const withLitdoc = Core.create();

export function createLitdocRenderers() {
  return Renderers.fromComponents(Themes.Basic);
}

export function lit<Data>() {
  const slots: Record<string, unknown> = {};
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
      const children: Node[] = [];

      for (const event of events) {
        switch (event.type) {
          case "md": {
            const newChildren = Markdown.weave(slots, event.input, { data });
            children.push(...newChildren);
            break;
          }
          default: {
            throw new Error(`Unknown event type: ${event.type}`);
          }
        }
      }

      return {
        children,
        slots,
      };
    },
  };
}
