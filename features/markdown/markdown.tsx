import type { Node, NodeType } from "./types.ts";
import { useMarkdownRenderer } from "./use_markdown_renderer.ts";

/** MAIN **/

export type MarkdownRoot = Node<"Root">;

export type MarkdownNode = Node<NodeType>;

export type MarkdownProps = {
  root: MarkdownRoot;
};

export function Markdown(props: MarkdownProps) {
  const { root } = props;
  const render = useMarkdownRenderer();
  return <>{render(root)}</>;
}
