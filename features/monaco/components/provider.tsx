import { useEffect, useState } from "preact/hooks";
import { ViewChildren } from "../../theme/view.tsx";
import { Context } from "../utils/context.ts";
import { load } from "../utils/load.ts";
import { Monaco } from "../utils/types.ts";

/** MAIN **/

export function Provider(props: {
  path?: string;
  children?: ViewChildren;
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
