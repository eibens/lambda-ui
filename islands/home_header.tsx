import { Header, Link, ThemeToggle, View } from "@litdoc/ui";

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
              Litdoc
            </Link>
          </View>
        </View>
      )}
      renderTopRight={({ size }) => <ThemeToggle size={size} />}
    />
  );
}
