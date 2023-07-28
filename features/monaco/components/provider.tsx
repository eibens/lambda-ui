import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Context } from "../utils/context.ts";
import { load } from "../utils/load.ts";
import { Monaco } from "../utils/types.ts";

/** MAIN **/

export function Provider(props: {
  path?: string;
  children?: ComponentChildren;
}) {
  const { path, children } = props;

  const [instance, setInstance] = useState<Monaco | null>(null);

  useEffect(() => {
    load({ path }).then((instance) => {
      setInstance(instance);
    });
  }, []);

  return (
    <Context.Provider
      value={instance}
    >
      {children}
    </Context.Provider>
  );
}
