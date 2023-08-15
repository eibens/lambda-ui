import * as Dark from "@litdoc/dark";
import { Button, ButtonProps } from "./button.tsx";
import { FaIcon } from "./fa_icon.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  return (
    <Button
      tag="button"
      onClick={() => Dark.store.value = !Dark.store.value}
      icon={<FaIcon name="circle-half-stroke" />}
      iconPosition="right"
      size={props.size}
    />
  );
}
