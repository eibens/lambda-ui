import * as Dark from "@litdoc/dark";
import { Button, ButtonProps } from "./button.tsx";
import { MdIcon } from "./md_icon.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  return (
    <Button
      tag="button"
      onClick={() => Dark.store.value = !Dark.store.value}
      icon={Dark.store.value
        ? <MdIcon>light_mode</MdIcon>
        : <MdIcon>dark_mode</MdIcon>}
      iconPosition="right"
      size={props.size}
    />
  );
}
