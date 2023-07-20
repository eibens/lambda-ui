import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Paragraph(
  props: ViewProps<"p"> & {
    isLead?: boolean;
  },
) {
  const { isLead, ...rest } = props;
  return (
    <View
      tag="p"
      class={[
        isLead ? "text-2xl" : "",
        "text-gray-700 dark:text-gray-300",
      ]}
      viewProps={rest}
    />
  );
}
