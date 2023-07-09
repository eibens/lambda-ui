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
        isLead ? "leading-[1.5em]" : "leading-[1.75em]",
        "text-gray-700 dark:text-gray-300",
      ]}
      viewProps={rest}
    />
  );
}
