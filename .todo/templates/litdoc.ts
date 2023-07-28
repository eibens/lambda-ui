import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import * as Primitive from "./primitive.ts";

/** MAIN **/

export type Value = Primitive.Value<
  | Node
  | VNode
  | ((data: Data, id: string, slots: Record<string, unknown>) => Value<Data>)
>;

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
