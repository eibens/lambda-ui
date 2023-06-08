import { createContext } from "preact";
import { Monaco } from "../utils/types.ts";

/** MAIN **/

export const Context = createContext<Monaco | null>(null);
