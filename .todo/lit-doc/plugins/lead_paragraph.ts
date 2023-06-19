import { Root } from "../types.ts";

export function leadParagraph(root: Root) {
  const [child1, child2] = root.children;

  if (!child1 || !child2) return root;
  if (child1.type !== "Heading") return root;
  if (child2.type !== "Paragraph") return root;

  child2.isLead = true;

  return root;
}
