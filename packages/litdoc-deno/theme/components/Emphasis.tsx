import { RenderNodeProps, View } from "./deps.ts";

export function Emphasis(props: RenderNodeProps<"Emphasis">) {
  const { attributes, children } = props;
  return (
    <View
      {...attributes}
      tag="em"
      class="font-serif text-black dark:text-white"
    >
      {children}
    </View>
  );
}
