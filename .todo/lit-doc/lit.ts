import { LitDoc } from "./core.ts";

export type LitTags = Record<string, (...args: unknown[]) => void>;

export type LitSchema = {
  tags: LitTags;
};

export type LitContext<T extends LitSchema> =
  & { root: LitDoc }
  & {
    [K in keyof T["tags"]]: (...args: Parameters<T["tags"][K]>) => void;
  }
  & {
    (...args: unknown[]): void;
  };

export function lit<T extends LitSchema = LitSchema>(): LitContext<T> {
  const state: LitDoc = {
    type: "Doc",
    children: [],
  };

  function func(tag: string) {
    return (...args: unknown[]) => {
      state.children.push({
        type: "Tag",
        tag,
        args,
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
