import { useContext } from "preact/hooks";
import { MarkdownContext } from "./markdown_context.ts";

/** MAIN **/

export function useMarkdown(): MarkdownContext {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error("MarkdownContext not found");
  }
  return context;
}
