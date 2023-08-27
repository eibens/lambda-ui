import { titleCase } from "https://esm.sh/tiny-case@1.0.3";
import { Link } from "./Link.tsx";
import { View } from "";
import { useScrollOffset } from "../hooks/use_scroll_offset.ts";

/** MAIN **/

export type BreadcrumbsItem = {
  name: string;
  title?: string;
};

export function Breadcrumbs(props: {
  size?: "xs" | "sm" | "md" | "lg";
  items: BreadcrumbsItem[];
}) {
  const { size, items } = props;

  const offset = useScrollOffset();
  const raised = offset > 10;
  const showScrollTop = offset > 100;

  return (
    <View
      class={[
        "flex gap-2 rounded-full p-1",
        "font-sans",
        raised &&
        "shadow-lg bg-white bg-opacity-30 dark:(bg-black bg-opacity-30)",
        "transition-colors",
      ].join(" ")}
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      {items.map((item, index, items) => {
        const isLast = items.length === index + 1;
        const show = !isLast || showScrollTop;
        const path = "/" + items
          .slice(1, index + 1)
          .map((item) => item.name)
          .join("/");
        const href = isLast ? "#top" : path;
        const label = item.title ?? titleCase(item.name);

        return (
          <View
            class={[
              `pill-${size}`,
              show ? "opacity-100" : "opacity-0",
              show ? "pointer-events-auto" : "pointer-events-none",
              "transition-opacity",
            ].join(" ")}
          >
            <Link class="mx-2" href={href}>
              <View tag="span">{label}</View>
            </Link>
          </View>
        );
      })}
    </View>
  );
}
