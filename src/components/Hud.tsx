import { Breadcrumbs } from "./Breadcrumbs.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { View } from "./View.tsx";

/** MAIN **/

export type HeaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
};

export function Hud(props: HeaderProps) {
  const { size = "md" } = props;
  const height = 4 * { xs: 8, sm: 12, md: 16, lg: 20 }[size];
  const padding = 4 * { xs: 1, sm: 2, md: 3, lg: 4 }[size];

  return (
    <View
      tag="header"
      class={[
        "fixed z-10 top-0 left-0 right-0 bottom-0",
        "flex justify-between items-center",
        `p-[${padding}px]`,
        `h-[${height}px]`,
        "pointer-events-none",
      ]}
    >
      <View
        class={[
          "pointer-events-auto",
        ].join(" ")}
      >
        <Breadcrumbs
          items={[]}
        />
      </View>
      <View class="pointer-events-auto">
        <ThemeToggle />
      </View>
    </View>
  );
}
