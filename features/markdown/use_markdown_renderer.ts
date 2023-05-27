import { ViewChildren } from "../theme/view.tsx";
import { render } from "./render.ts";
import type { Node } from "./types.ts";
import { useMarkdown } from "./use_markdown.ts";

/** MAIN **/

export function useMarkdownRenderer() {
  const { theme } = useMarkdown();
  return (node: Node) => render<ViewChildren>(node, { theme });
}
