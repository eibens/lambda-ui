import { LitContext, LitSchema } from "./lit.ts";
import { Call, Node, Root } from "./types.ts";

/** MAIN **/

export type Replacer = (node: Node) => Node | Node[] | null;

export type LitProcessor = (root: Root) => Root;

export type LitPlugin<Schema extends LitSchema = LitSchema> = {
  name?: string;
  tags?: Schema;
};

export function weave<T extends LitSchema>(options: {
  doc: LitContext<T>;
  plugins: LitPlugin[];
}) {
  const { doc, plugins } = options;

  const handlers = plugins.map(
    (plugin) => plugin.handle ?? (() => []),
  );

  const processors = plugins.flatMap(
    (plugin) => plugin.process ?? ((x: Root) => x),
  );

  const root: Root = {
    type: "Root",
    children: doc.root.children
      .filter((child): child is Call => child.type === "Call")
      .flatMap((child) =>
        handlers.flatMap((handler) => handler(child) ?? [])
      ) as Node[],
  };

  return [
    ...processors,
  ].reduce((acc, processor) => {
    return processor(acc);
  }, root);
}
