import { lookup, Path } from "litdoc/utils/lookup.ts";

/** MAIN **/

export type { Path };

export type RuleContext<T> = {
  path: Path;
  node: T;
};

export type Rule<Node, Match> = {
  match: (ctx: RuleContext<Node>) => boolean;
  apply: (ctx: RuleContext<Match>) => Iterable<Path> | void;
};

export function traverse<Node>(
  root: Node,
  // deno-lint-ignore no-explicit-any
  rules: Rule<Node, any>[],
) {
  const queue: Path[] = [[]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = lookup(root, path);
    const ctx = { path, node };

    for (const rule of rules) {
      const { match, apply } = rule;

      if (!match(ctx)) continue;

      const result = apply(ctx);
      if (result) {
        const paths: Path[] = Array.from(result);
        queue.push(...paths);
        break;
      }
    }
  }
}
