/** MAIN **/

export function stringify<V>(options: {
  args: [TemplateStringsArray, ...V[]];
  path: number[];
}): string {
  const { args, path } = options;
  const [strings, ...values] = args;

  function stringifyPrimitive(value: unknown): string | null {
    if (value === undefined) return "";
    if (value === null) return "";
    if (typeof value === "boolean") return "";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string") return value;
    return null;
  }

  function stringify(
    value: unknown,
    path: number[],
  ): string {
    const primitive = stringifyPrimitive(value);
    if (primitive !== null) return primitive;

    if (Array.isArray(value)) {
      const recurse = (value: unknown, i: number) =>
        stringify(value, [...path, i]);
      return value.map(recurse).join("");
    }

    return `:values/${path.join("/")}:`;
  }

  const iter = (function* (): Generator<string> {
    for (let i = 0; i < strings.length; i++) {
      yield strings[i];
      if (i < values.length) {
        const value = values[i];
        yield stringify(value, [...path, i]);
      }
    }
  })();

  return Array.from(iter).join("");
}
