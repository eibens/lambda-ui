import { View, ViewProps } from "./view.tsx";

export function Span(
  props: ViewProps<"span">,
) {
  return (
    <View
      tag="span"
      viewProps={props}
    />
  );
}
