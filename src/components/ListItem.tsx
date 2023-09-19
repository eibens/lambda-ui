import { FaIcon } from "litdoc/components/FaIcon.tsx";
import { View, ViewProps } from "litdoc/components/View.tsx";

export function ListItem(
  props: ViewProps<"li"> & {
    icon?: string;
    indent: number;
    lineHeight: number;
    size: number;
  },
) {
  const { children, icon, indent, size, lineHeight, ...rest } = props;

  return (
    <View
      tag="li"
      viewProps={rest}
      class={[
        "flex flex-row",
      ]}
    >
      <View
        style={{
          display: "flex",
          flexShrink: 0,
          flexDirection: "column",
          width: indent + "px",
        }}
      >
        <View
          style={{
            lineHeight: lineHeight + "px",
            fontSize: size + "px",
            // NOTE: For some reason, the icon would not be aligned
            // with an icon in the body of the list item.
            // e.g. using something like: - :minus: :minus: item
            transform: "translateY(-0.053em)",
          }}
        >
          {<FaIcon tag="span" name={icon ?? "minus"} />}
        </View>
      </View>
      <View
        class={[
          "flex flex-col",
        ]}
      >
        {children}
      </View>
    </View>
  );
}
