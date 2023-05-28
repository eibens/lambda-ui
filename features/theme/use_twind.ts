import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { Twind } from "./deps.ts";

/** MAIN **/

export const TwindContext = createContext<Twind.Instance | null>(null);

export function useTwind() {
  return useContext(TwindContext);
}
