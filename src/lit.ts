import { Call, create, TemplateArgs } from "litdoc/utils/tags.ts";

export type Manifest = {
  url?: string;
  root?: string;
  route?: string;
  routes: Record<string, unknown>;
  assets: Record<string, unknown>;
  calls: Call[];
};

export type Doc =
  & (() => Manifest)
  & {
    [key: string]: (...args: TemplateArgs<unknown>) => unknown;
  };

export type Litdoc = {
  doc: () => Manifest;
};

export default function lit(config: Partial<Manifest> = {}): Doc {
  return create((calls) => {
    return {
      assets: {},
      routes: {},
      calls,
      ...config,
    };
  });
}
