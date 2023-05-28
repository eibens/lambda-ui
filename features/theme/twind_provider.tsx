import { useMemo } from "preact/hooks";
import { Twind } from "./deps.ts";
import { DefaultTwindConfig } from "./twind_config.ts";
import { TwindContext } from "./use_twind.ts";
import { useTwindSheet } from "./use_twind_sheet.ts";
import { ViewChildren } from "./view.tsx";

/** MAIN **/

export function TwindProvider(props: {
  children?: ViewChildren;
  config?: Parameters<typeof Twind.create>[0];
}) {
  const { children, config } = props;

  const sheet = useTwindSheet();

  const instance = useMemo(() => {
    const instance = Twind.create({
      sheet,
      darkMode: "class",
      ...config ?? DefaultTwindConfig,
    });

    return instance;
  }, [sheet]);

  return (
    <TwindContext.Provider value={instance}>
      {children}
    </TwindContext.Provider>
  );
}
