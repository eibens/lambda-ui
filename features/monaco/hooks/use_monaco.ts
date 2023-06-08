import { useContext } from "preact/hooks";
import { Context } from "../utils/context.ts";

/** MAIN **/

export function useMonaco() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useMonaco() must be used inside MonacoProvider",
    );
  }
  return context;
}
