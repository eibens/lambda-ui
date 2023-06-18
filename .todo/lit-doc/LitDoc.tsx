import { Markdown, md } from "../markdown/mod.ts";
import { LitDoc as LitDocProps, LitTag } from "./node.ts";

export function LitDoc(props: LitDocProps) {
  const { children } = props;

  const parts = children
    .filter((x) => x.type === "Tag")
    .map((x) => x as LitTag)
    .map((x) => md(...x.args as [TemplateStringsArray, ...unknown[]]));

  return (
    <>
      {parts.map((x, i) => (
        <Markdown
          key={i}
          root={x}
        />
      ))}
    </>
  );
}
