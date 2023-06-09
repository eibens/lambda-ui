import { View, ViewChildren, ViewProps } from "./view.tsx";

/** MAIN **/

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = ViewProps<HeadingTag> & {
  depth: number;
  id?: string;
  children: ViewChildren;
  blockIndex?: number;
};

export function Heading(props: HeadingProps) {
  const { depth, blockIndex, ...rest } = props;

  const i = depth - 1;
  const mt = [16, 12, 8, 4, 2, 0][i];
  const s = [8, 6, 4, 3, 2, 1][i] * 4 + 16;
  const h = [1, 2, 3, 4, 5, 6][i];
  const font = "font-bold";
  const H = `h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <View
      tag={H}
      viewProps={rest}
      class={[
        "font-sans",
        `text-[${s}px] ${font}`,
        `pt-${mt}`,
      ]}
    />
  );
}
