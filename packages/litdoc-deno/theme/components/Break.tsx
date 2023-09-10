import { RenderNodeProps, View } from "./deps.ts";

export function Break(props: RenderNodeProps<"Break">) {
  const { attributes, children } = props;
  return <View tag="br" {...attributes} class="my-4" />;
}
