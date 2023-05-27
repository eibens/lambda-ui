import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Emphasis(props: ViewProps<"em">) {
  return (
    <View
      tag="em"
      viewProps={props}
      class="font-serif text-black dark:text-white"
    />
  );
}
