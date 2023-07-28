import { nanoid } from "https://esm.sh/nanoid@4.0.0";

/** MAIN **/

export type TemplateArgs<V> = [TemplateStringsArray, ...V[]];

export type TemplateString = {
  type: "string";
  raw?: string;
  text: string;
};

export type TemplateValue = {
  type: "value";
  id: string;
};

export type TemplateChild =
  | TemplateString
  | TemplateValue;

export type Template<V> = {
  values: Record<string, V>;
  children: TemplateChild[];
};

export type TemplateExpression<V, Y> = (
  value: V,
  id: string,
  values: Record<string, V>,
) => Y;

export type TemplateEvaluate<V> = TemplateExpression<V, V>;

export type TemplateTransform<V> = TemplateExpression<V, TemplateChild>;

export type TemplateStringify<V> = TemplateExpression<V, string>;

export function tagged<V>(...args: TemplateArgs<V>): Template<V> {
  const [strings, ...values] = args;
  const template: Template<V> = {
    values: {},
    children: [],
  };

  for (let i = 0; i < strings.length; i++) {
    const text = strings[i];
    template.children.push({ type: "string", text });

    if (i >= values.length) continue;

    const value = values[i];
    const id = nanoid();
    template.values[id] = value;
    template.children.push({ type: "value", id });
  }

  return template;
}

export function evaluate<V>(
  template: Template<V>,
  evaluate: TemplateEvaluate<V>,
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
  stringify: TemplateStringify<V>,
): Template<V> {
  const { values } = template;
  return {
    ...template,
    children: template.children.map((child) => {
      if (child.type === "string") return child;
      const { id } = child;
      const value = values[id];
      const text = stringify(value, id, values);
      return { type: "string", text };
    }),
  };
}

export function stringify<V>(
  template: Template<V>,
  stringify: TemplateStringify<V>,
): string {
  return inline(template, stringify)
    .children
    .filter((child) => child.type === "string")
    .map((child) => child as TemplateString)
    .map((child) => child.text)
    .join("");
}
