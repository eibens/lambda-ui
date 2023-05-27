import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Kbd(
  props: ViewProps<"kbd"> & {
    color?: string;
  },
) {
  const { color, ...viewProps } = props;
  return (
    <View tag="kbd">
      <View
        viewProps={viewProps}
        tag="span"
        class={[
          "flex items-center justify-center h-5 px-1 font-mono text-[0.6rem] gap-1",
          "rounded-md",
          `border-1 border-${color} text-${color} shadow-sm`,
          "border-opacity-50",
        ]}
      />
    </View>
  );
}
