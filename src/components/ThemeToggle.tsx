import { Button, ButtonProps } from "litdoc/components/Button.tsx";
import { FaIcon } from "litdoc/components/FaIcon.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
  onClick?: () => void;
}) {
  return (
    <Button
      tag="button"
      onClick={props.onClick}
      icon={<FaIcon name="circle-half-stroke" />}
      iconPosition="right"
      size={props.size}
    />
  );
}
