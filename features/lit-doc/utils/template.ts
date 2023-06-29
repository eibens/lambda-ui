import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import * as Slot from "./slot.ts";

/** HELPERS **/

// Helper to convert string input to TemplateArgs.
function tag(...args: Args): Args {
  return args;
}

/** MAIN **/

export type Args = [TemplateStringsArray, ...unknown[]];

export type Input = Args | [string];

export function isArgs(input: Input): input is Args {
  return typeof input[0] !== "string";
}

export function toArgs(...input: Input): Args {
  return isArgs(input) ? input : tag`${input[0]}`;
}

export function weave(...input: Input) {
  const [strings, ...values] = toArgs(...input);

  let text = "";
  const slots: Record<string, unknown> = {};

  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    const value = values[i];

    // Treat non-primitive objects as slots.
    // For example, a Preact VNode could be embedded as a slot.
    // What defines a slot can be adjusted when additional use-cases emerge.
    if (typeof value === "object" && value !== null) {
      // Generate a unique slot identifier.
      const id = nanoid();

      // Collect the slots in a map.
      slots[id] = value;

      // Embed the slot in the Markdown source.
      text += Slot.stringify({ id });
    } else {
      // Everything else is treated as a string.
      text += String(value ?? "");
    }
  }

  return { text, slots };
}
