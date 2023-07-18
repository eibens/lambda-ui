import { useThemeSignal } from "@/features/theme/signals.ts";
import { DarkMode } from "icons/dark_mode.tsx";
import { useEnv } from "../client/mod.ts";
import { Button, ButtonProps } from "../widgets/button.tsx";

export function ThemeToggle(props: {
  size?: ButtonProps["size"];
}) {
  const isDark = useThemeSignal();
  const { isBrowser } = useEnv();
  return (
    <Button
      tag="button"
      onClick={() => {
        isDark.value = !isDark.value;
      }}
      icon={<DarkMode />}
      iconPosition="right"
      disabled={!isBrowser}
      size={props.size}
    />
  );
}
