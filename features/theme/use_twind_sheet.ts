import { createContext, useContext } from "react";
import { Twind } from "./deps.ts";

/** MAIN **/

export const TwindSheetContext = createContext<Twind.Sheet | undefined>(
  undefined,
);

export function useTwindSheet() {
  return useContext(TwindSheetContext);
}
