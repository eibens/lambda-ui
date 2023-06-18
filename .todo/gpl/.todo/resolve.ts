import { isAtom, isElement, Node, Resolver } from "../core.ts";

export function resolve(
  node: Node,
  resolvers: Record<string, Resolver>,
  resolveRef: (name: string) => unknown,
): unknown {
  if (isAtom(node)) {
    return node;
  }

  if (isElement(node)) {
    const { type, name, children } = node;

    if (type === "ref") {
      return resolveRef(name);
    }

    const fn = resolvers[name];
    if (!fn) {
      throw new Error(`No resolver for ${name}`);
    }

    return fn(
      ...children.map((child) => resolve(child, resolvers, resolveRef)),
    );
  }
}
