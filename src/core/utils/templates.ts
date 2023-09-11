/** MAIN **/

export type Args<V = unknown> = [TemplateStringsArray, ...V[]];

export type Text = {
  type: "Text";
  raw?: string;
  text: string;
};

export type Value = {
  type: "Value";
  index: number;
};

export type Node =
  | Value
  | Text;

export type Template<V> = {
  values: V[];
  children: Node[];
};

export type Expression<V, Y> = (
  value: V,
  index: number,
  values: V[],
) => Y;

export type Evaluate<V> = Expression<V, V>;

export type Transform<V> = Expression<V, Node>;

export type Stringify<V> = Expression<V, string>;

export function tagged<V>(...args: Args<V>): Template<V> {
  const [strings, ...values] = args;
  const template: Template<V> = {
    values: [],
    children: [],
  };

  for (let i = 0; i < strings.length; i++) {
    const text = strings[i];
    template.children.push({ type: "Text", text });

    if (i < values.length) {
      template.values[i] = values[i];
      template.children.push({
        type: "Value",
        index: i,
      });
    }
  }

  return template;
}

export function evaluate<V>(
  template: Template<V>,
  evaluate: Evaluate<V>,
) {
  const { values } = template;
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    values[index] = evaluate(value, index, values);
  }
  return template;
}

export function inline<V>(
  template: Template<V>,
  stringify: Stringify<V>,
): Template<V> {
  const { values } = template;
  return {
    ...template,
    children: template.children.map((child) => {
      if (child.type === "Text") return child;
      const { index } = child;
      const value = values[index];
      const text = stringify(value, index, values);
      return { type: "Text", text };
    }),
  };
}

export function stringify<V>(
  template: Template<V>,
  stringify: Stringify<V>,
): string {
  return inline(template, stringify)
    .children
    .filter((child) => child.type === "Text")
    .map((child) => child as Text)
    .map((child) => child.text)
    .join("");
}
