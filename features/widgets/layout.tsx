import { Bulb } from "icons/bulb.tsx";
import { useEffect, useState } from "preact/hooks";
import { useTheme, View, ViewChildren } from "../theme/mod.ts";
import { Button } from "../widgets/button.tsx";

/** MAIN **/

export function Layout(props: {
  title: string;
  children: ViewChildren;
}) {
  const theme = useTheme();
  const { children } = props;

  const headerHeight = 12;

  // scroll position
  const threshold = headerHeight * 4;
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY;
      if (scroll > threshold) {
        setScroll(threshold);
      } else {
        setScroll(scroll);
      }
    };
    globalThis.addEventListener("scroll", onScroll);
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <View
      class={[
        "flex justify-center",
        "font-sans",
        "leading-relaxed",
      ]}
    >
      <View
        class={[
          "flex flex-col w-full items-center",
          `pt-${headerHeight}`,
        ]}
      >
        <View
          tag="header"
          class={[
            "fixed z-10 top-0 left-0 right-0",
            `h-${headerHeight}`,
            "bg-gradient-to-b from-gray-100 dark:from-gray-900 to-[transparent]",
          ]}
        >
          <View
            class={[
              "bg-gray-100 dark:bg-gray-900",
              !scroll && "transform -translate-y-full",
              "absolute inset-0",
              "transition-transform duration-300",
            ]}
          />
          <View
            class={[
              "absolute inset-0",
              "flex justify-between items-center",
              "p-2",
            ]}
          >
            <Button
              href="/"
              label={props.title}
              size="md"
            />
            <Button
              tag="button"
              label={theme.name === "dark" ? "Light Mode" : "Dark Mode"}
              onClick={() => theme.toggle()}
              icon={<Bulb />}
              iconPosition="right"
              size="xs"
            />
          </View>
        </View>
        <View class="flex flex-col my-32 px-4 max-w-3xl w-full gap-8">
          {children}
        </View>
      </View>
    </View>
  );
}
