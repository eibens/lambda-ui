import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function ListItem(props: ViewProps<"li">) {
  return (
    <View
      tag="li"
      viewProps={props}
    />
  );
}
