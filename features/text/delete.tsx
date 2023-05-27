import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Delete(props: ViewProps<"del">) {
  return (
    <View
      tag="del"
      viewProps={props}
      class="opacity-50"
    />
  );
}
