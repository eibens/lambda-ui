import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import type { Node } from "slate";

/** HELPERS **/

const Text = (text = ""): Node => ({
  type: "Text",
  text,
});

const Value = (id: string): Node => ({
  type: "Value",
  id,
  children: [Text()],
});

const Code = (lang: string, children: Node[]): Node => ({
  type: "Code",
  lang,
  children,
});

/** MAIN **/

export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type TemplateFunction<Value> = (
  ...args: TemplateArgs<Value>
) => Node;

export type TagsResult = {
  children: Node[];
  values: Record<string, unknown>;
};

export type TagsFunction = () => TagsResult;

export type TemplateFunctionMap<Config> = {
  [Name in keyof Config]: TemplateFunction<Config[Name]>;
};

export type Tags<Config> =
  & TemplateFunctionMap<Config>
  & TagsFunction;

export default function lit<Config = Record<string, unknown>>(): Tags<Config> {
  const state: TagsResult = {
    children: [],
    values: {},
  };

  return new Proxy(() => state, {
    get: (_, name) => {
      return (...args: TemplateArgs<Config[keyof Config]>) => {
        const [strings, ...values] = args;

        function* toChildren(): Generator<Node> {
          const id = nanoid();
          for (const [i, string] of strings.entries()) {
            yield Text(string);
            if (i < values.length) {
              state.values[id] = values[i];
              yield Value(id);
            }
          }
        }

        const code = Code(String(name), [...toChildren()]);
        state.children.push(code);
        return code;
      };
    },
  }) as unknown as Tags<Config>;
}
