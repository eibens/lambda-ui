import type { Node, Value } from "./lit.ts";

/** MAIN **/

export function* parse(str: string): Generator<Node> {
  const createText = (text = ""): Node => ({
    type: "Text",
    text,
  });

  const pattern = /:([^:\s]+):/g;

  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(str)) !== null) {
    const [_, data] = match;
    const before = str.slice(lastIndex, match.index);
    if (before) yield createText(before);

    const children = [createText()];
    const getUrl = (text: string) => new URL(`token:///${text}`).toString();
    if (data.startsWith("^")) {
      yield {
        type: "Token",
        assign: "before" as const,
        url: getUrl(data.slice(1)),
        children,
      };
    } else if (data.endsWith("^")) {
      yield {
        type: "Token",
        assign: "after" as const,
        url: getUrl(data.slice(0, -1)),
        children,
      };
    } else {
      yield {
        type: "Token",
        url: getUrl(data),
        children,
      };
    }

    lastIndex = pattern.lastIndex;
  }
  const after = str.slice(lastIndex);
  if (after) yield createText(after);
}

export function* resolve(
  node: Node,
  values: Record<string, Value>,
): Iterable<Node> {
  if (node.type !== "Token") {
    return yield node;
  }

  // Token is not a value.
  const valuePrefix = "token:///values/";
  if (!node.url.startsWith(valuePrefix)) {
    return yield node;
  }

  // Extract key and value.
  const key = node.url.slice(valuePrefix.length);
  const value = values[key];

  // All values must resolve.
  if (value == null) {
    console.warn(`Value ${key} not found.`);
    return yield node;
  }

  // At this stage, there should be only nodes and VDom.
  if (typeof value !== "object") {
    throw new Error(`Value ${key} is not an object.`);
  }

  if ("doc" in value) {
    throw new Error("TODO: Handle Litdoc values.");
  }

  // VDom will be handled later during rendering.
  if ("$$typeof" in value) {
    return [node];
  }

  const nodes = (Array.isArray(value) ? value : [value]) as unknown[] as Node[];
  for (const child of nodes) {
    if (child.type === "Fragment" || child.type === "Root") {
      yield* child.children;
    } else {
      yield child;
    }
  }
}
