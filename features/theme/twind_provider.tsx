import { useMemo } from "react";
import { Twind } from "./deps.ts";
import { DefaultTwindConfig } from "./twind_config.ts";
import { TwindContext } from "./use_twind.ts";
import { ViewChildren } from "./view.tsx";

/** MAIN **/

export function TwindProvider(props: {
  children?: ViewChildren;
  config?: Parameters<typeof Twind.create>[0];
}) {
  const { children, config } = props;

  const instance = useMemo(() => {
    const sheet = document ? Twind.cssomSheet() : undefined;

    const instance = Twind.create({
      sheet,
      darkMode: "class",
      ...config ?? DefaultTwindConfig,
    });

    return instance;
  }, []);

  return (
    <TwindContext.Provider value={instance}>
      {children}
    </TwindContext.Provider>
  );
}
