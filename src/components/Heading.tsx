import { FaIcon } from "./FaIcon.tsx";
import { View, ViewProps } from "./View.tsx";

export function Heading(
  props: ViewProps & {
    depth: number;
    icon?: string;
  },
) {
  const { icon, children, depth, ...rest } = props;

  const i = depth - 1;
  const h = [1, 2, 3, 4, 5, 6][i] ?? 6;
  const H = `h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <View
      tag={H}
      viewProps={rest}
      class={[
        "font-sans font-bold",
      ]}
    >
      {icon && <FaIcon name={icon} />}
      {icon && " "}
      {children}
    </View>
  );
}
