import { weave } from "litdoc/utils/weave.ts";

/** MAIN **/

export type ClientConfig = {
  modules: {
    [key: string]: unknown;
  };
};

export type ClientContext = {
  getValues: (key: string) => Record<string, unknown>;
};

export function client(config: ClientConfig): ClientContext {
  const {
    modules,
  } = config;

  const ctx: ClientContext = {
    getValues: (key: string) => {
      if (!state.values.has(key)) {
        const module = modules[key];
        const { values } = weave({ type: "Values", module });
        state.values.set(key, values);
        return values;
      }
      return state.values.get(key) || {};
    },
  };

  const state = {
    values: new Map<string, Record<string, unknown>>(),
  };

  return ctx;
}
