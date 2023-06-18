import { DarkMode } from "icons/dark_mode.tsx";
import { useTheme } from "../theme/use_theme.ts";
import { Button, ButtonProps } from "../widgets/button.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  const theme = useTheme();
  return (
    <Button
      tag="button"
      onClick={() => theme.toggle()}
      icon={<DarkMode />}
      iconPosition="right"
      size={props.size}
    />
  );
}
