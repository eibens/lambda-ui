export type TemplateArgs<Value> = [
  TemplateStringsArray,
  ...Value[],
];

export type TemplateFunction<Value> = (
  ...args: TemplateArgs<Value>
) => Template<Value>;

export type Template<Value> = {
  name: string;
  args: TemplateArgs<Value>;
};

export type TagsState<Config> = {
  children: Template<Config[keyof Config]>[];
};

export type TagsFunction<Config> = () => TagsState<Config>;

export type TemplateFunctionMap<Config> = {
  [Name in keyof Config]: TemplateFunction<Config[Name]>;
};

export type Tags<Config> =
  & TemplateFunctionMap<Config>
  & TagsFunction<Config>;

export function tags<Config = Record<string, unknown>>(): Tags<Config> {
  const templates: Template<Config[keyof Config]>[] = [];

  return new Proxy(() => templates, {
    get: (_, name) => {
      return (...args: TemplateArgs<Config[keyof Config]>) => {
        templates.push({
          name: String(name),
          args,
        });
      };
    },
  }) as unknown as Tags<Config>;
}
