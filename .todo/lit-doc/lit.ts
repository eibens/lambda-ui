import { Root } from "./types.ts";

export type LitTags = Record<string, (...args: unknown[]) => void>;

export type LitSchema = {
  tags: LitTags;
};

export type LitContext<T extends LitSchema> =
  & { root: Root }
  & {
    [K in keyof T["tags"]]: (...args: Parameters<T["tags"][K]>) => void;
  }
  & {
    (...args: unknown[]): void;
  };

export function lit<T extends LitSchema = LitSchema>(): LitContext<T> {
  const state: Root = {
    type: "Root",
    children: [],
  };

  function func(name: string) {
    return (...args: unknown[]) => {
      state.children.push({
        type: "Call",
        name,
        args,
        children: [],
      });
    };
  }

  const context = new Proxy(
    func("default"),
    {
      get: (_, prop) => {
        if (prop === "state") return state;
        if (typeof prop !== "string") return undefined;
        return func(prop);
      },
    },
  );

  return context as LitContext<T>;
}
