import { Button, ButtonProps } from "./Button.tsx";
import { FaIcon } from "./FaIcon.tsx";

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
