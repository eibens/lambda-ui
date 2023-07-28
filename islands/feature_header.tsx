import { Header, Link, ThemeToggle, View } from "@litdoc/ui";

/** MAIN **/

export default function FeatureHeader(props: {
  name: string;
}) {
  const { name } = props;
  return (
    <Header
      size="md"
      renderTopLeft={({ size, scroll }) => (
        <View
          class={[
            "flex gap-2 rounded-full p-1",
            "font-sans",
            scroll > 10 && "bg-gray-100 dark:bg-gray-900 shadow-lg",
            "transition-all duration-200",
          ]}
        >
          <View class={[`pill-${size}`]}>
            <Link href="/" class="mx-2">
              Litdoc
            </Link>
          </View>

          <View
            class={[
              `pill-${size}`,
              scroll > 10 ? "opacity-100" : "opacity-0",
              scroll > 10 ? "pointer-events-auto" : "pointer-events-none",
              "transition-all duration-200",
            ]}
          >
            <Link href="#top" class="mx-2">
              {name.substring("./features/".length)}
            </Link>
          </View>
        </View>
      )}
      renderTopRight={({ size }) => <ThemeToggle size={size} />}
    />
  );
}
