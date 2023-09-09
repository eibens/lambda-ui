import { RenderNodeProps, View } from "./deps.ts";

export function Delete(props: RenderNodeProps<"Delete">) {
  const { attributes, children } = props;
  return (
    <View
      {...attributes}
      tag="del"
      class="opacity-50"
    >
      {children}
    </View>
  );
}
