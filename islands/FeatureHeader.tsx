import { Header, Link, Span, ThemeToggle, View } from "@litdoc/ui";

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
            scroll > 10 &&
            "shadow-lg bg-white bg-opacity-30 dark:(bg-black bg-opacity-30)",
            "transition-colors",
          ]}
          style={{
            backdropFilter: "blur(10px)",
          }}
        >
          <View class={[`pill-${size}`]}>
            <Link href="/" class="mx-2">
              <Span>Litdoc</Span>
            </Link>
          </View>

          <View
            class={[
              `pill-${size}`,
              scroll > 10 ? "opacity-100" : "opacity-0",
              scroll > 10 ? "pointer-events-auto" : "pointer-events-none",
              "transition-opacity",
            ]}
          >
            <Link href="#top" class="mx-2">
              <Span>{name.substring("./features/".length)}</Span>
            </Link>
          </View>
        </View>
      )}
      renderTopRight={({ size }) => <ThemeToggle size={size} />}
    />
  );
}
