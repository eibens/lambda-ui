import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function Paragraph(
  props: ViewProps<"p"> & {
    isLead?: boolean;
  },
) {
  const { isLead } = props;
  return (
    <View
      tag="p"
      class={[
        "text-gray-700 dark:text-gray-300",
        isLead ? "text-2xl" : "text-base",
        isLead ? "leading-[1.5em]" : "leading-[1.75em]",
      ]}
      viewProps={props}
    />
  );
}
