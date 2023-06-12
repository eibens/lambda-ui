import { View, ViewProps } from "./view.tsx";

/** MAIN **/

export type ListTag = "ul" | "ol";

export function List(
  props: ViewProps<ListTag> & {
    ordered?: boolean;
  },
) {
  const { ordered, ...rest } = props;
  const list = ordered ? "list-decimal" : "list-disc";
  const tag = ordered ? "ol" : "ul";
  return (
    <View
      tag={tag}
      viewProps={rest}
      class={`${list} ml-8 flex flex-col my-1`}
    />
  );
}
