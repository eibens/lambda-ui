import { Markdown, md } from "../markdown/mod.ts";
import { LitEvent, LitTagEvent } from "./lit.ts";

export function LitDoc(props: {
  events: LitEvent[];
}) {
  const { events } = props;

  const parts = events
    .filter((x) => x.type === "tag")
    .map((x) => x as LitTagEvent)
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
