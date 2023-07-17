/** HELPERS **/

function stringifyValue(
  value: unknown,
  props: unknown,
  fallback?: (value: unknown) => string,
): string {
  const recurse = (value: unknown) => stringifyValue(value, props, fallback);

  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  if (fallback) return fallback(value);
  return String(value);
}

/** MAIN **/

export type Primitive<T = never> =
  | undefined
  | null
  | boolean
  | number
  | string
  | T
  | Primitive<T>[];

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
