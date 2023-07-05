import { View } from "../theme/mod.ts";

/** MAIN **/

export function TextSkeleton(props: {
  placeholder?: string;
  value?: string;
}) {
  const { placeholder, value } = props;
  const isSkeleton = !value;

  return (
    <View
      tag="span"
      class={[
        "rounded-full",
        "transition-colors",
        isSkeleton ? "text-transparent animate-pulse" : "",
        isSkeleton ? "bg-gray-300 dark:bg-gray-700" : "bg-transparent",
      ]}
    >
      {value ?? placeholder}
    </View>
  );
}
