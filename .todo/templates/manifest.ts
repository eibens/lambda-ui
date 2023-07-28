
/** MAIN **/


export type Expression<X, Y> =
  | ((x: X) => Y)
  | Y;

export type TemplateArgs<Value> = [TemplateStringsArray, ...Value[]];

export function tag<Props, Value = Primitive>(
  ...args: TemplateArgs<Expression<Props, Value>>
) {
  return args;
}

export function stringify<Props, Value>(
  args: TemplateArgs<Expression<Props, Value>>,
  props: Props,
  fallback?: (x: unknown, props: Props) => string,
): string {
  const [strings, ...values] = args;

  const output: string[] = [];
  for (let i = 0; i < strings.length; i++) {
    output.push(strings[i]);
    const value = values[i];
    const stringified = stringifyValue(
      value,
      props,
      fallback ? (value) => fallback(value, props) : undefined,
    );
    output.push(stringified);
  }
  return output.join("");
}

export function weave<V>(
  slots: Record<string, unknown>,
  input: Input<V>,
  stringify: (value: V, key: string, slots: Record<string, unknown>) => string,
) {
  const [strings, ...values] = toArgs(input);

  for (let i = 0; i < strings.length; i++) {
    // Generate a unique slot identifier.
    const id = nanoid();

    // Collect the slots in a map.
    slots[id] = value;

    // Embed the slot in the source.
    text += stringify(value, id, slots);
  }

}
