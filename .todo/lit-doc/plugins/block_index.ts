import { Root } from "../types.ts";

export function blockIndex(root: Root) {
  root.children
    .forEach((child, blockIndex) => {
      child.blockIndex = blockIndex;
    });

  return root;
}
