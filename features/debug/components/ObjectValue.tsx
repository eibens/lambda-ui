import { View } from "@litdoc/ui";
import { Value } from "./Value.tsx";

function DebuggerProp(props: {
  name: string;
  value: unknown;
}) {
  const { name, value } = props;

  return (
    <View tag="span" class="text-xs font-mono">
      <View tag="span" class="color-gray fill-0">
        -{" "}
      </View>
      <View tag="span" class="font-mono color-teal fill-0">
        {name}
      </View>
      <View tag="span" class="font-mono color-gray fill-0">
        :{" "}
      </View>
      <View tag="span">
        <Value value={value} />
      </View>
    </View>
  );
}

export function ObjectValue(props: {
  value: Record<never, unknown>;
}) {
  const { value } = props;
  const keys = Object.keys(value)
    .filter((key) => !["children", "type", "key"].includes(key))
    .sort((a, b) => a.localeCompare(b));

  return (
    <View class="flex flex-col gap-1">
      {keys.map((name) => (
        <DebuggerProp
          name={name}
          value={Reflect.get(value, name)}
        />
      ))}
    </View>
  );
}
