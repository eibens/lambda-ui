import { Bulb } from "icons/bulb.tsx";
import { useEffect, useState } from "preact/hooks";
import { Markdown, MarkdownProvider, MarkdownRoot } from "../markdown/mod.ts";
import { useTheme, View } from "../theme/mod.ts";

/** MAIN **/

export function Layout(props: {
  root: MarkdownRoot;
}) {
  const theme = useTheme();
  const { root } = props;

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
      ]}
    >
      <MarkdownProvider>
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
                "flex justify-end items-center",
                "p-2",
              ]}
            >
              <View
                tag="button"
                onClick={() => theme.toggle()}
                class={[
                  "flex",
                  "button-xs",
                  "surface",
                  "rounded-full",
                  "button-interactive",
                ]}
              >
                <View class="mx-1">Toggle Theme</View>
                <View class="icon-xs">
                  <Bulb />
                </View>
              </View>
            </View>
          </View>
          <View class="flex flex-col my-32 max-w-3xl w-full gap-8">
            <Markdown
              root={root}
            />
          </View>
        </View>
      </MarkdownProvider>
    </View>
  );
}
