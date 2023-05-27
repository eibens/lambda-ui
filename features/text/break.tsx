import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Break(props: ViewProps<"br">) {
  return (
    <View
      tag="br"
      viewProps={props}
    />
  );
}
