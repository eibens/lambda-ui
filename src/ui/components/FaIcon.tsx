import { View, ViewProps } from "./View.tsx";

export function FaIcon(
  props: ViewProps & {
    name: string;
    scale?: number;
    children?: never;
  },
) {
  const { name, scale = 1, ...rest } = props;
  return (
    <View
      viewProps={rest}
      // use class name to prevent weird icon duplication bug
      className={`fa fa-${name}`}
      style={{
        display: "inline-flex",
        userSelect: "all",

        // Icons naturally have varying width causing them to be misaligned.
        width: "1.2em",
        justifyContent: "center",
        alignItems: "center",

        // Scale the icon to the desired size.
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    />
  );
}
