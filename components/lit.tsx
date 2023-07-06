import { Markdown } from "@/features/lit-doc/mod.ts";
import { LitDoc, LitElement } from "@/features/lit-doc/types.ts";

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
    doc: (data: Data): LitDoc => {
      const doc = {
        children: [] as LitElement[],
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
