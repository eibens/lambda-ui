/** MAIN **/

export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type TemplateFunction<Value> = (
  ...args: TemplateArgs<Value>
) => Node;

export type TemplateCall<Value> = {
  type: "Call";
  name: string;
  args: TemplateArgs<Value>;
};

export type TagsState = TemplateCall<unknown>[];

export type TagsFunction = () => TagsState;

export type TemplateFunctionMap<Config> = {
  [Name in keyof Config]: TemplateFunction<Config[Name]>;
};

export type Tags<Config> =
  & TemplateFunctionMap<Config>
  & TagsFunction;

export default function lit<Config = Record<string, unknown>>(): Tags<Config> {
  const state: TagsState = [];

  return new Proxy(() => state, {
    get: (_, name) => {
      return (...args: TemplateArgs<Config[keyof Config]>) => {
        const call: TemplateCall<unknown> = {
          type: "Call",
          name: String(name),
          args,
        };
        state.push(call);
        return call;
      };
    },
  }) as unknown as Tags<Config>;
}
