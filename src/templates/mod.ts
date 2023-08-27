import { nanoid } from "https://esm.sh/nanoid@4.0.0";

/** MAIN **/

export type Args<V = unknown> = [TemplateStringsArray, ...V[]];

export type Text = {
  type: "Text";
  raw?: string;
  text: string;
};

export type Value = {
  type: "Value";
  id: string;
  isInline?: boolean;
  children: Node[];
};

export type Node =
  | Value
  | Text;

export type Template<V> = {
  values: Record<string, V>;
  children: Node[];
};

export type Expression<V, Y> = (
  value: V,
  id: string,
  values: Record<string, V>,
) => Y;

export type Evaluate<V> = Expression<V, V>;

export type Transform<V> = Expression<V, Node>;

export type Stringify<V> = Expression<V, string>;

export function tagged<V>(...args: Args<V>): Template<V> {
  const [strings, ...values] = args;
  const template: Template<V> = {
    values: {},
    children: [],
  };

  for (let i = 0; i < strings.length; i++) {
    const text = strings[i];
    template.children.push({ type: "Text", text });

    if (i < values.length) {
      const id = nanoid();
      template.values[id] = values[i];
      template.children.push({
        type: "Value",
        id,
        isInline: true,
        children: [{
          type: "Text",
          text: `{{id:${id}}}`,
        }],
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
  for (const id in values) {
    const value = values[id];
    values[id] = evaluate(value, id, values);
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
      const { id } = child;
      const value = values[id];
      const text = stringify(value, id, values);
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
