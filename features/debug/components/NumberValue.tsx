import { View } from "@litdoc/ui";

export function NumberValue(props: {
  value: number;
}) {
  const { value } = props;
  return (
    <View
      tag="span"
      class={[
        "color-amber fill-0",
      ]}
    >
      {value}
    </View>
  );
}
