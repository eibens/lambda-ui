import { createContext, useContext } from "react";
import { Twind } from "./deps.ts";

/** MAIN **/

export const TwindContext = createContext<Twind.Instance | null>(null);

export function useTwind() {
  const twind = useContext(TwindContext);
  if (twind === null) {
    throw new Error("TwindContext is null");
  }
  return twind;
}
