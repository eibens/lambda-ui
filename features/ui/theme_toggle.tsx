import * as Dark from "@litdoc/dark";
import { DarkMode } from "icons/dark_mode.tsx";
import { Button, ButtonProps } from "./button.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  return (
    <Button
      tag="button"
      onClick={() => Dark.store.value = !Dark.store.value}
      icon={<DarkMode />}
      iconPosition="right"
      size={props.size}
    />
  );
}
