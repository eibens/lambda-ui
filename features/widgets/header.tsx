import { useEffect, useState } from "preact/hooks";
import { View, ViewChildren } from "../theme/mod.ts";

/** MAIN **/

export type HeaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  renderTopLeft?: (props: {
    size: HeaderProps["size"];
    scroll: number;
  }) => ViewChildren;
  renderTopRight?: (props: {
    size: HeaderProps["size"];
    scroll: number;
  }) => ViewChildren;
};

export function useScrollOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY;
      setOffset(offset);
    };
    addEventListener("scroll", onScroll);
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return offset;
}

export function Header(props: HeaderProps) {
  const { size = "md", renderTopLeft, renderTopRight } = props;
  const height = 4 * { xs: 8, sm: 12, md: 16, lg: 20 }[size];
  const padding = 4 * { xs: 1, sm: 2, md: 3, lg: 4 }[size];
  const scroll = useScrollOffset();

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
      {renderTopLeft?.({
        size,
        scroll,
      })}
      {renderTopRight?.({
        size,
        scroll,
      })}
    </View>
  );
}
