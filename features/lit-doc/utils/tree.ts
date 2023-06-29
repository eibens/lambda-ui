export type Entry = [Node, Path];

export type Path = number[];

export type Node = {
  type: string;
  children?: Node[];
} & Record<string, unknown>;

export function* nodes(node: Node, path: Path = []): Generator<Entry> {
  yield [node, path];

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = [...path, i];
      yield* nodes(child, childPath);
    }
  }
}

export function parent(root: Node, path: Path): Node {
  if (path.length === 0) {
    throw new Error("Parent not found.");
  }
  const parentPath = path.slice(0, -1);
  let parent: Node | null = root;
  for (const index of parentPath) {
    if (!parent.children) {
      throw new Error("Parent not found.");
    }
    parent = parent.children[index];
  }
  return parent;
}

export function replace(root: Node, path: Path, replacement: Node) {
  const p = parent(root, path);
  if (!p) throw new Error("Parent not found.");
  const index = path[path.length - 1];
  p.children![index] = replacement;
}
