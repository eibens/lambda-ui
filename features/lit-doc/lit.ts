/** MAIN **/

export type LitStartEvent = {
  type: "start";
};

export type LitTagEvent = {
  type: "tag";
  tag: string;
  args: unknown[];
};

export type LitEvent =
  | LitStartEvent
  | LitTagEvent;

export type LitStream = {
  events: LitEvent[];
};

export type LitTags = {
  [key: string]: (...args: never[]) => unknown;
};

export type LitConfig = {
  tags: LitTags;
};

export type LitConfigDefaults = {
  tags: {
    [key: string]:
      | ((...args: unknown[]) => void)
      | ((string: TemplateStringsArray, ...values: unknown[]) => void);
  };
};

export type LitContext = {
  state: LitStream;
};

export type LitResult<T extends LitConfig> =
  & {
    [K in keyof T["tags"]]: (...args: Parameters<T["tags"][K]>) => void;
  }
  & {
    (...args: unknown[]): void;
    state: LitStream;
  };

export function lit<T extends LitConfig = LitConfigDefaults>(): LitResult<T> {
  const state: LitStream = {
    events: [{
      type: "start",
    }],
  };

  function push(tag: string, args: unknown[]) {
    state.events.push({
      type: "tag",
      tag,
      args,
    });
  }

  function func(tag: string) {
    return (...args: unknown[]) => {
      push(tag, args);
    };
  }

  const provider = new Proxy(
    func("default"),
    {
      get: (_, prop) => {
        if (prop === "state") return state;
        if (typeof prop !== "string") return undefined;
        return func(prop);
      },
    },
  );

  return provider as LitResult<T>;
}
