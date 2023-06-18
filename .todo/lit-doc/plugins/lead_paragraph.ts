import { LitPlugin } from "../mod.ts";

/** HELPERS **/

/** MAIN **/

const plugin: LitPlugin = {
  name: "lead-paragraph",
  process: (root) => {
    const [child1, child2] = root.children;

    if (!child1 || !child2) return root;
    if (child1.type !== "heading") return root;
    if (child2.type !== "paragraph") return root;

    // @ts-ignore TODO
    child2.isLead = true;

    return root;
  },
};

export default plugin;
