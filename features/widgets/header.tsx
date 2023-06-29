import { useEffect, useState } from "preact/hooks";
import { View, ViewChild } from "../theme/mod.ts";
import { Button } from "./button.tsx";
import { ThemeToggle } from "./theme_toggle.tsx";

/** MAIN **/

export type Breadcrumbs = {
  href: string;
  icon?: ViewChild;
  label?: ViewChild;
}[];

export type HeaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  breadcrumbs?: Breadcrumbs;
};

export function Header(props: HeaderProps) {
  const { size = "md", breadcrumbs } = props;

  const [scroll, setScroll] = useState(0);

  const height = 4 * { xs: 8, sm: 12, md: 16, lg: 20 }[size];
  const padding = 4 * { xs: 1, sm: 2, md: 3, lg: 4 }[size];

  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY;
      setScroll(scroll);
    };
    addEventListener("scroll", onScroll);
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <View
      tag="header"
      class={[
        "fixed z-10 top-0 left-0 right-0",
        "flex justify-between items-center",
        `p-[${padding}px]`,
        `h-[${height}px]`,
      ]}
    >
      <View
        class={[
          "flex gap-2 rounded-full p-1",
          scroll > 16 ? "bg-gray-100 dark:bg-gray-900 shadow-lg" : "",
        ]}
      >
        {breadcrumbs && breadcrumbs.map((item) => {
          return (
            <Button
              href={item.href}
              label={item.label}
              icon={item.icon}
              size={size}
            />
          );
        })}
      </View>
      <ThemeToggle size={size} />
    </View>
  );
}
