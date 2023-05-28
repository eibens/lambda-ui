import { virtualSheet } from "https://esm.sh/twind@0.16.17/sheets";
import { useMemo } from "react";
import { Twind } from "./deps.ts";
import { TwindSheetContext } from "./use_twind_sheet.ts";
import { ViewChildren } from "./view.tsx";

/** MAIN **/

export function TwindSheetProvider(props: {
  children?: ViewChildren;
  sheet?: Twind.Sheet;
}) {
  const { children, sheet } = props;

  const state = useMemo(() => {
    return sheet ?? (globalThis.document ? Twind.cssomSheet() : virtualSheet());
  }, [sheet]);

  return (
    <TwindSheetContext.Provider value={state}>
      {children}
    </TwindSheetContext.Provider>
  );
}
