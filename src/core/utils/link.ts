import { Path, Rule, traverse } from "litdoc/graphs/mod.ts";
import {
  CallExpression,
  ExpressionStatement,
  Node,
  Program,
  TaggedTemplateExpression,
} from "litdoc/swc/mod.ts";

/** HELPERS **/

const isType = (type: string) => (ctx: { node: Node }) => {
  return ctx.node.type === type;
};

const descendProgram: Rule<Node, Program> = {
  match: (ctx) => {
    return ctx.node.type === "Module" || ctx.node.type === "Script";
  },
  apply: function* (ctx) {
    for (let i = 0; i < ctx.node.body.length; i++) {
      yield [...ctx.path, "body", i];
    }
  },
};

const pickExpression: Rule<Node, ExpressionStatement> = {
  match: isType("ExpressionStatement"),
  apply: function* (ctx) {
    yield [...ctx.path, "expression"];
  },
};

/** MAIN **/

export type LinkResult = Path[];

export type Call = {
  name: string;
};

export function link(program: Program, calls: Call[]): LinkResult {
  const queue = [...calls];

  const result: {
    path: Path;
  }[] = [];

  const handleCall = (
    node:
      | CallExpression["callee"]
      | TaggedTemplateExpression["tag"],
    path: Path, // points to parent
  ) => {
    if (node.type !== "Identifier") return;

    const call = queue[0];
    if (node.value !== call.name) return;

    queue.shift();
    result.push({ path });
  };

  const detectCall: Rule<Node, CallExpression> = {
    match: isType("CallExpression"),
    apply: function (ctx) {
      const { node, path } = ctx;
      const { callee } = node;
      handleCall(callee, path);
    },
  };

  const detectTemplateCall: Rule<Node, TaggedTemplateExpression> = {
    match: isType("TaggedTemplateExpression"),
    apply: function (ctx) {
      const { node, path } = ctx;
      const { tag } = node;
      handleCall(tag, path);
    },
  };

  traverse(program, [
    descendProgram,
    pickExpression,
    detectCall,
    detectTemplateCall,
  ]);

  if (queue.length > 0) {
    throw new Error(`Could not find ${queue.length} function calls.`);
  }

  return result.map(({ path }) => path);
}
