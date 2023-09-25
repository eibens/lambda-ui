import type { Node } from "./types.ts";

/** HELPERS **/

export type TokenData = {
  href: string;
  path: string[];
  params: URLSearchParams;
};

export function getTokens(node: Node): TokenData[] {
  return (node.tokens ?? [])
    .map((href) => new URL(href))
    .map((url) => ({
      href: url.href,
      path: url.pathname.split("/").filter(Boolean),
      params: url.searchParams,
    }));
}

export function* parseTokens(str: string): Generator<Node> {
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

export function applyTokens(node: Node) {
  if (!("children" in node)) return;

  let prev: Node = node;
  const children: Node[] = [];
  for (const child of node.children) {
    if (child.type === "Token") {
      if (child.assign === "before") {
        prev.tokens = prev.tokens ?? [];
        prev.tokens.push(child.url);
      } else if (child.assign === "after") {
        console.warn("TODO: Handle after tokens");
      } else {
        children.push(child);
        prev = child;
      }
    } else {
      children.push(child);
      prev = child;
    }
  }

  return children;
}
