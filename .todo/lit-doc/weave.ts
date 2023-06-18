import { Node } from "../markdown/types.ts";
import { LitContext, LitSchema, LitTagNode } from "./core.ts";

/** MAIN **/

export type LitHandler = (node: LitTagNode) => Node | Node[] | null;

export type LitProcessor = (root: Node<"Root">) => Node<"Root">;

export type LitPlugin<Schema extends LitSchema = LitSchema> = {
  name?: string;
  handle?: LitHandler;
  process?: LitProcessor;
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
    (plugin) => plugin.process ?? ((x: Node<"Root">) => x),
  );

  const root: Node<"Root"> = {
    type: "root",
    children: doc.root.children
      .filter((child): child is LitTagNode => child.type === "tag")
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
