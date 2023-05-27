import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Paragraph(props: ViewProps<"p">) {
  return (
    <View
      tag="p"
      class="text-gray-700 dark:text-gray-300"
      viewProps={props}
    />
  );
}
