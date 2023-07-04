import { DarkMode } from "icons/dark_mode.tsx";
import { useEnv } from "../client/mod.ts";
import { useTheme } from "../theme/use_theme.ts";
import { Button, ButtonProps } from "../widgets/button.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  const theme = useTheme();
  const { isBrowser } = useEnv();
  return (
    <Button
      tag="button"
      onClick={() => theme.toggle()}
      icon={<DarkMode />}
      iconPosition="right"
      disabled={!isBrowser}
      size={props.size}
    />
  );
}
