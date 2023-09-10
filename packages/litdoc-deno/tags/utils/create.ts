export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type TemplateFunction<Value> = (
  ...args: TemplateArgs<Value>
) => Call<Value>;

export type TemplateFunctionMap<Config> = {
  [Name in keyof Config]: TemplateFunction<Config[Name]>;
};

export type Call<Value = unknown> = {
  type: "Call";
  name: string;
  args: TemplateArgs<Value>;
};

export type Tags<Config> =
  & TemplateFunctionMap<Config>
  & (() => Call[]);

export function create<Config = Record<string, unknown>>(): Tags<Config> {
  const calls: Call[] = [];

  return new Proxy(() => calls, {
    get: (_, name) => {
      return (...args: TemplateArgs<Config[keyof Config]>) => {
        const call: Call = {
          type: "Call",
          name: String(name),
          args,
        };
        calls.push(call);
        return call;
      };
    },
  }) as unknown as Tags<Config>;
}
