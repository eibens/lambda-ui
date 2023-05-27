import { createContext } from "react";
import { ViewNode } from "../theme/view.tsx";
import type { Theme } from "./types.ts";

/** MAIN **/

export type MarkdownContext = {
  theme: Theme<ViewNode>;
  slots: Record<string, ViewNode>;
};

export const MarkdownContext = createContext<MarkdownContext | null>(null);
