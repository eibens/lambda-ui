import { View } from "@/features/theme/view.tsx";
import { Info } from "icons/info.tsx";
import { SpinnerTwo } from "icons/spinner_two.tsx";
import { useEffect, useState } from "preact/hooks";

const icons: Record<string, Promise<string>> = {};

export function Icon(props: {
  name: string;
}) {
  const { name } = props;

  const [svg, setSvg] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  const icon = (() => {
    if (status === "loading") return <SpinnerTwo />;
    if (status === "error") return <Info />;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  })();

  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/astrit/css.gg/master/icons/svg/" +
      name + ".svg";

    if (!icons[name]) {
      icons[name] = fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Icon not found: " + name);
          }
          return res.text();
        });
    }

    icons[name]
      .then((svg) => {
        setStatus("success");
        setSvg(svg);
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, []);

  return (
    <View tag="span" class="inline-flex mx-1">
      <View
        tag="span"
        class={[
          "flex w-[0.8lh] h-[0.8lh] relative top-[0.125lh]",
          status === "loading" && "animate-spin",
          status === "error" && "color-red fill-0",
          status === "loading" && "opacity-50",
          status === "error" && "opacity-25",
        ]}
      >
        {icon}
      </View>
    </View>
  );
}
