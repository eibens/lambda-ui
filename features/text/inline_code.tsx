import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export function InlineCode(props: ViewProps<"code">) {
  return (
    <View
      tag="code"
      viewProps={props}
      class={[
        "font-mono",
        "text-black dark:text-white",
        "border-b-[0.08em] border-dashed",
        "color-gray fill-0 stroke-0 hover:stroke-30 focus:stroke-50",
        "hover:border-black dark:hover:border-white",
        "transition-colors duration-200 ease-in-out",
      ]}
    />
  );
}
