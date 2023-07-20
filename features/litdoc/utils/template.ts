import { nanoid } from "https://esm.sh/nanoid@4.0.0";

/** MAIN **/

export type Args<V> = [TemplateStringsArray, ...V[]];

export type Input<V> = Args<V> | [string];

export function isArgs<V>(input: Input<V>): input is Args<V> {
  return typeof input[0] !== "string";
}

export function toArgs<V>(input: Input<V>): Args<V> {
  if (isArgs(input)) return input;
  const strings = [input[0]];
  return [Object.assign(strings, { raw: strings })];
}

export function evaluate(
  slots: Record<string, unknown>,
  fn: (slot: unknown) => unknown,
) {
  for (const id in slots) {
    const value = slots[id];
    slots[id] = fn(value);
  }
}

export function weave<V>(
  slots: Record<string, unknown>,
  input: Input<V>,
  stringify: (value: V, key: string, slots: Record<string, unknown>) => string,
) {
  const [strings, ...values] = toArgs(input);

  let text = "";

  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    const value = values[i];

    // Generate a unique slot identifier.
    const id = nanoid();

    // Collect the slots in a map.
    slots[id] = value;

    // Embed the slot in the source.
    text += stringify(value, id, slots);
  }

  return text;
}
