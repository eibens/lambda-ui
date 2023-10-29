import type { VNode } from "preact";
import type { Node } from "./markdown.ts";

/** MAIN **/

export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Litdoc
  | Call
  | Call[]
  | Node
  | Node[]
  | VNode;

export type TemplateArgs = [
  strings: string[],
  ...values: Value[],
];

export type Call = {
  type: "Call";
  name: string;
  args: TemplateArgs;
};

export type Lit =
  & (() => Manifest)
  & {
    [key: string]: (
      strings: TemplateStringsArray,
      ...values: Value[]
    ) => Call;
  };

export type Manifest = {
  baseUrl?: string;
  calls: Call[];
  assets: Record<string, unknown>;
  routes: Record<string, unknown>;
};

export type Litdoc = {
  doc: () => Partial<Manifest>;
};

export default function lit(config: Partial<Manifest> = {}): Lit {
  const calls: Call[] = [];

  const doc = (): Manifest => {
    return {
      assets: {},
      routes: {},
      calls,
      ...config,
    };
  };

  const proxy = new Proxy(doc, {
    get: (_, name) => {
      return (...args: TemplateArgs) => {
        const call: Call = {
          type: "Call",
          name: String(name),
          args,
        };
        calls.push(call);
        return call;
      };
    },
  });

  return proxy as Lit;
}
