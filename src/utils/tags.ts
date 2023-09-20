export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type TemplateFunction<Value> = (
  ...args: TemplateArgs<Value>
) => Call<Value>;

export type TemplateFunctionMap<Schema> = {
  [Name in keyof Schema]: TemplateFunction<Schema[Name]>;
};

export type Call<Value = unknown> = {
  name: string;
  args: TemplateArgs<Value>;
};

export type Tags<State, Schema> =
  & TemplateFunctionMap<Schema>
  & (() => State);

export function create<
  Schema = Record<string, unknown>,
>(): Tags<Call[], Schema>;
export function create<
  State,
  Schema = Record<string, unknown>,
>(fn: (calls: Call[]) => State): Tags<State, Schema>;
export function create<
  State,
  Schema = Record<string, unknown>,
>(fn: (calls: Call[]) => unknown = (calls) => calls): Tags<State, Schema> {
  const calls: Call[] = [];

  return new Proxy(() => fn(calls), {
    get: (_, name) => {
      return (...args: TemplateArgs<Schema[keyof Schema]>) => {
        const call: Call = {
          name: String(name),
          args,
        };
        calls.push(call);
        return call;
      };
    },
  }) as unknown as Tags<State, Schema>;
}
