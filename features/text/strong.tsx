import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Strong(props: ViewProps<"strong">) {
  return (
    <View
      tag="strong"
      viewProps={props}
      class="font-serif text-black dark:text-white"
    />
  );
}
