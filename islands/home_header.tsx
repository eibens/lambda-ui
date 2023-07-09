import { Header } from "@/features/widgets/header.tsx";
import { Link } from "../features/text/mod.ts";
import { View } from "../features/theme/mod.ts";
import { ThemeToggle } from "../features/widgets/theme_toggle.tsx";

/** MAIN **/

export default function HomeHeader() {
  return (
    <Header
      size="md"
      renderTopLeft={({ size, scroll }) => (
        <View
          class={[
            "flex gap-2 rounded-full p-1",
            "bg-gray-100 dark:bg-gray-900 shadow-lg",
            "transition-all duration-200",
            scroll > 0 ? "opacity-100" : "opacity-0",
            scroll > 0 ? "pointer-events-auto" : "pointer-events-none",
          ]}
        >
          <View class={[`pill-${size}`, "font-sans"]}>
            <Link href="#top" class="mx-2">
              Lambda UI
            </Link>
          </View>
        </View>
      )}
      renderTopRight={({ size }) => <ThemeToggle size={size} />}
    />
  );
}
