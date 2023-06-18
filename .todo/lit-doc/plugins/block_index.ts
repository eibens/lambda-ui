import { LitPlugin } from "../mod.ts";

/** HELPERS **/

/** MAIN **/

const plugin: LitPlugin = {
  name: "block-index",
  process: (root) => {
    root.children
      .forEach((child, blockIndex) => {
        // @ts-ignore TODO
        child.blockIndex = blockIndex;
      });

    return root;
  },
};

export default plugin;
