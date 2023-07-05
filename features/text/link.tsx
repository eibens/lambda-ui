import { External } from "icons/external.tsx";
import { ViewChildren } from "../theme/mod.ts";
import { View } from "./view.tsx";

/** HELPERS **/

function parseUrl(str: string) {
  try {
    const url = new URL(str);

    // TODO: Check against actual host URL.
    // For SSR, there is no window.location to check against.
    // This check is really naive and assumes all local URLs are relative.
    const external = true;

    const hostname = url.hostname;
    return {
      external,
      hostname,
    };
  } catch (e) {
    // TypeError is expected if str is a local URL.
    if (!(e instanceof TypeError)) throw e;

    return {
      external: false,
      hostname: "",
      samePage: str.startsWith("#"),
    };
  }
}

/** MAIN **/

export function Link(
  props: {
    href: string;
    children: ViewChildren;
  },
) {
  const { href, children } = props;
  const { external, hostname, samePage } = parseUrl(href);

  return (
    <View tag="span">
      <View
        tag="a"
        class="color-blue fill-0 hover:underline"
        target={external ? "_blank" : undefined}
        href={href}
        onClick={(e) => {
          if (samePage) {
            e.preventDefault();
            const element = document.getElementById(href.slice(1));
            if (element) {
              const scrollLogicalPosition =
                ["H1", "H2", "H3", "H4", "H5", "H6"].includes(
                    element.tagName,
                  )
                  ? "start"
                  : "center";

              // smooth scroll to element
              element.scrollIntoView({
                behavior: "smooth",
                block: scrollLogicalPosition,
                inline: scrollLogicalPosition,
              });
            }
            // Update URL without reloading page
            history.pushState({}, "", href);
          }
        }}
      >
        {children}
      </View>
      {external && (
        <View
          tag="span"
          class="inline-block text-gray-500 cursor-help select-none"
          title={`External link to ${hostname}`}
        >
          <View tag="span" class="flex w-4 h-4">
            <External />
          </View>
        </View>
      )}
    </View>
  );
}
