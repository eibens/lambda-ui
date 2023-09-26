import { Call, Doc, Manifest, Template } from "./types.ts";

/** MAIN **/

export default function lit(config: Partial<Manifest> = {}): Doc {
  const calls: Call[] = [];

  const doc = (): Manifest => {
    return {
      assets: {},
      routes: {},
      ...config,
      calls,
    };
  };

  const proxy = new Proxy(doc, {
    get: (_, name) => {
      return (...args: Template) => {
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

  return proxy as Doc;
}
