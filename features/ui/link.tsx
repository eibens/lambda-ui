import { MdIcon } from "./md_icon.tsx";
import { View, ViewChildren, ViewProps } from "./view.tsx";

/** HELPERS **/

function getTarget(str: string): LinkTarget {
  try {
    const url = new URL(str);
    return "external";
  } catch (e) {
    // TypeError is expected if str is a local URL.
    if (!(e instanceof TypeError)) throw e;

    if (str === "/") {
      return "home";
    }

    if (str === "#top") {
      return "top";
    }

    if (str.startsWith("#")) {
      return "local";
    }

    return "internal";
  }
}

function getHostname(str: string): string {
  try {
    const url = new URL(str);
    return url.hostname;
  } catch (e) {
    // TypeError is expected if str is a local URL.
    if (!(e instanceof TypeError)) throw e;

    return "";
  }
}

function getByTarget<T>(
  options: Partial<Record<LinkTarget, T>> & {
    default: T;
  },
  target: LinkTarget,
): T {
  return options[target] ?? options["default"];
}

/** MAIN **/

export type LinkTarget =
  | "external"
  | "internal"
  | "local"
  | "home"
  | "top";

export function Link(
  props: ViewProps<"a"> & {
    href: string;
    children: ViewChildren;
  },
) {
  const { href, children, ...rest } = props;
  const target = getTarget(href);

  const hostname = getHostname(href);

  const icon = getByTarget({
    external: <MdIcon>open_in_new</MdIcon>,
    internal: <MdIcon>arrow_forward</MdIcon>,
    local: <MdIcon>tag</MdIcon>,
    home: <MdIcon>home</MdIcon>,
    top: <MdIcon>arrow_upward</MdIcon>,
    default: <MdIcon>link</MdIcon>,
  }, target);

  const title = getByTarget({
    external: `External link to ${hostname}`,
    internal: `Internal link`,
    local: `Local link`,
    home: `Homepage`,
    default: "Unknown link type",
  }, target);

  const color = getByTarget({
    external: "sky",
    internal: "blue",
    default: undefined,
  }, target);

  const handleClick = (e: Event) => {
    const isSamePage = ["local", "top"].includes(target);
    if (isSamePage) {
      e.preventDefault();
      const element = document.getElementById(href.slice(1));
      if (element) {
        const scrollStart = target === "top" ||
          ["H1", "H2", "H3", "H4", "H5", "H6"].includes(
            element.tagName,
          );

        const scrollLogicalPosition = scrollStart ? "start" : "center";

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
  };

  const opacity = [
    "border-opacity-0",
    "hover:border-opacity-50",
    "focus:border-opacity-50",
  ].join(" ");

  return (
    <View {...rest} tag="span">
      <View
        tag="a"
        class={[
          color
            ? `border-${color}-600 dark:border-${color}-400`
            : "border-black dark:border-white",
          color
            ? `text-${color}-600 dark:text-${color}-400`
            : "text-black dark:text-white",
          `${opacity} dark:(${opacity})`,
          "outline-none focus:outline-none",
          "border-b-[0.125em]",
        ]}
        target={target === "external" ? "_blank" : undefined}
        href={href}
        onClick={handleClick}
      >
        {children}
      </View>
      <span>{" "}</span>
      <View
        tag="span"
        class={[
          "inline-block opacity-30 cursor-help select-none hover:opacity-70",
          "transition-opacity",
        ]}
        title={title}
      >
        <View
          tag="span"
          class={[
            "w-[0.75lh] h-[0.75lh]",
          ]}
        >
          {icon}
        </View>
      </View>
    </View>
  );
}
