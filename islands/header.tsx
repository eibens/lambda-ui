import {
  Header as HeaderBase,
  HeaderProps,
} from "@/features/widgets/header.tsx";
import { InlineCode } from "../features/text/inline_code.tsx";
import { Link } from "../features/text/mod.ts";
import { View } from "../features/theme/mod.ts";
import { ThemeToggle } from "../features/widgets/theme_toggle.tsx";

/** MAIN **/

export default function Header(props: HeaderProps) {
  const { size } = props;
  return (
    <HeaderBase
      size={size}
      renderTopLeft={({ size }) => (
        <View class={[`pill-${size}`]}>
          <Link href="/" class="mx-2">
            <InlineCode>@lambda-ui</InlineCode>
          </Link>
        </View>
      )}
      renderTopRight={({ size }) => <ThemeToggle size={size} />}
    />
  );
}
