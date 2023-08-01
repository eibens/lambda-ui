import { View } from "@litdoc/ui";
import { NumberValue } from "./NumberValue.tsx";
import { StringValue } from "./StringValue.tsx";

export function Value(props: {
  value: unknown;
}) {
  const { value } = props;
  const type = typeof value;

  if (typeof value === "string") {
    return <StringValue value={value} />;
  }
  if (typeof value === "number") {
    return <NumberValue value={value} />;
  }

  return (
    <View tag="span" class="color-teal fill-0 font-italic">
      {type}
    </View>
  );
}
