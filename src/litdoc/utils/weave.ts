import { Path, Rule, traverse } from "litdoc/graphs/mod.ts";
import {
  CallExpression,
  ExpressionStatement,
  Module,
  Node,
  Program,
  Script,
  TaggedTemplateExpression,
} from "litdoc/swc/mod.ts";

export type WeaveCall = {
  name: string;
};

export type WeaveResult = Path[];

/**
 * For every call, find the corresponding node in the AST.
 *
 * @param program parsed AST of TypeScript source code
 * @param calls an array of
 * @returns
 */
export function weave(program: Program, calls: WeaveCall[]): WeaveResult {
  const queue = [...calls];

  const result: {
    path: Path;
  }[] = [];

  const descendTopLevel: Rule<Node, Script | Module> = {
    match: (ctx) => {
      return ctx.node.type === "Module" || ctx.node.type === "Script";
    },
    apply: function* (ctx) {
      for (let i = 0; i < ctx.node.body.length; i++) {
        yield [...ctx.path, "body", i];
      }
    },
  };

  const descendExpressionStatements: Rule<Node, ExpressionStatement> = {
    match: (ctx) => {
      return ctx.node.type === "ExpressionStatement";
    },
    apply: function* (ctx) {
      yield [...ctx.path, "expression"];
    },
  };

  const detectCall: Rule<Node, CallExpression> = {
    match: (ctx) => {
      return ctx.node.type === "CallExpression";
    },
    apply: function (ctx) {
      const { callee } = ctx.node;
      if (callee.type !== "Identifier") return;

      const call = queue[0];
      if (callee.value !== call.name) return;

      queue.shift();
      result.push({ path: ctx.path });
    },
  };

  const detectTemplateCall: Rule<Node, TaggedTemplateExpression> = {
    match: (ctx) => {
      return ctx.node.type === "TaggedTemplateExpression";
    },
    apply: function (ctx) {
      const { tag } = ctx.node;
      if (tag.type !== "Identifier") return;

      const call = queue[0];
      if (tag.value !== call.name) return;

      queue.shift();
      result.push({ path: ctx.path });
    },
  };

  traverse(program, [
    descendTopLevel,
    descendExpressionStatements,
    detectCall,
    detectTemplateCall,
  ]);

  if (queue.length > 0) {
    throw new Error(`Could not find ${queue.length} function calls.`);
  }

  return result.map(({ path }) => path);
}
