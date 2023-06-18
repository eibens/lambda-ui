import { View, ViewNode, ViewProps } from "../theme/view.tsx";

export type ButtonProps = Omit<ViewProps<"a" | "button">, "size" | "icon"> & {
  label?: ViewNode;
  icon?: ViewNode;
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  iconPosition?: "left" | "right";
  color?: string;
  tint?: boolean;
  href?: string;
};

export function Button(props: ButtonProps) {
  const {
    label,
    icon,
    size = "md",
    disabled,
    href,
    color = "gray",
    iconPosition = "left",
    tint,
    ...rest
  } = props;

  const tag = href ? "a" : "button";
  return (
    <View
      tag={tag}
      // @ts-ignore checking on tag
      href={href}
      disabled={disabled}
      viewProps={rest}
      class={[
        "font-sans",
        `pill-${size} rounded-full gap-1`,
        "transition-all duration-300",
        disabled ? "fill-20 opacity-50" : `hover:fill-20`,
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        "border-1 stroke-0",
        !disabled && "focus:(not-active:stroke-50)",
        !disabled && "active:(transform scale-95)",
        !label && "hover:(scale-105)",
        "outline-none focus:outline-none",
        `color-${color}`,
        tint ? "fill-10" : "fill-0",
        iconPosition === "left" ? "flex-row" : "flex-row-reverse",
      ]}
    >
      {icon && (
        <View class={`icon-${size}`}>
          {icon}
        </View>
      )}
      {label && (
        <View class={`label-${size}`}>
          {label}
        </View>
      )}
    </View>
  );
}
