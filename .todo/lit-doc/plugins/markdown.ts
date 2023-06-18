import { md } from "../../markdown/md.ts";
import { LitPlugin } from "../mod.ts";

/** HELPERS **/

type TemplateArgs = [TemplateStringsArray, ...unknown[]];

/** MAIN **/

export type Schema = {
  tags: {
    md: (..._: TemplateArgs) => void;
  };
};

const plugin: LitPlugin<Schema> = {
  name: "markdown",
  handle: (event) => {
    if (event.type !== "Tag") return [];
    if (event.tag !== "md") return [];

    const args = event.args as TemplateArgs;
    return md(...args).children;
  },
};

export default plugin;
