import { View } from "@litdoc/ui";

export function StringValue(props: {
  value: string;
}) {
  const { value } = props;
  const maxLen = 20;
  const cutoff = value.length > maxLen;
  const postfix = cutoff ? "..." : "";
  const text = value.substring(0, maxLen);
  return (
    <View
      tag="span"
      class={[
        "color-cyan fill-0",
      ]}
    >
      "{text}
      {postfix}"
    </View>
  );
}
