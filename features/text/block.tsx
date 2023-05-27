import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Block(props: ViewProps<"div">) {
  return (
    <View
      tag="div"
      viewProps={props}
      class="w-full lg:max-w-4xl px-4"
    />
  );
}
