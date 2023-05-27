import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Image(props: ViewProps<"img">) {
  return (
    <View
      tag="img"
      viewProps={props}
      class="rounded"
    />
  );
}
