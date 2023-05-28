import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { Twind } from "./deps.ts";

/** MAIN **/

export const TwindSheetContext = createContext<Twind.Sheet | undefined>(
  undefined,
);

export function useTwindSheet() {
  return useContext(TwindSheetContext);
}
