import { FaIcon } from "litdoc/components/FaIcon.tsx";
import { Tag } from "litdoc/components/Tag.tsx";

export function Token(props: {
  href: string;
}) {
  const url = new URL(props.href);
  const path = url.pathname.split("/").filter(Boolean);
  const [type, id] = path;

  const handlers = {
    icons: () => {
      return (
        <FaIcon
          tag="span"
          name={id}
        />
      );
    },
    unknown: () => {
      return (
        <Tag color="orange">
          <span class="font-bold">Unresolved token:</span>{" "}
          <span class="font-mono">{url.href}</span>
        </Tag>
      );
    },
  };

  const handler = handlers[type as keyof typeof handlers] ?? handlers.unknown;

  return handler();
}
