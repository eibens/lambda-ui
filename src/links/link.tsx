import { View, ViewChildren, ViewProps } from "litdoc/view/mod.ts";
import { FaIcon } from "litdoc/fontawesome/mod.ts";

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

function getIcon(target: LinkTarget) {
  return {
    external: "arrow-up-right-from-square",
    internal: "arrow-right",
    local: "hashtag",
    home: "house",
    top: "arrow-up",
  }[target] ?? "link";
}

function getTitle(target: LinkTarget, href: string) {
  const hostname = getHostname(href);

  return getByTarget({
    external: `External link to ${hostname}`,
    internal: `Internal link`,
    local: `Local link`,
    home: `Homepage`,
    default: "Unknown link type",
  }, target);
}

function getColor(target: LinkTarget) {
  return getByTarget({
    external: "sky",
    internal: "blue",
    default: undefined,
  }, target);
}

function handle(e: Event) {
  const element = e.currentTarget as HTMLAnchorElement;
  const { target, href } = element;

  // Update URL without reloading page
  history.pushState({}, "", href);

  // Handle links to other pages by doing nothing.
  const isSamePage = ["local", "top"].includes(target);
  if (!isSamePage) return;

  e.preventDefault();
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
  const title = getTitle(target, href);
  const color = getColor(target);

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
          "text-black dark:text-white",
          `${opacity} dark:(${opacity})`,
          "outline-none focus:outline-none",
          "border-b-[0.125em]",
          "transition-colors",
        ]}
        target={target === "external" ? "_blank" : undefined}
        href={href}
        onClick={handle}
      >
        {children}
      </View>
      <span>{" "}</span>
      <View
        tag="span"
        title={title}
        class={[
          "opacity-30 cursor-help select-none hover:opacity-70",
          "transition-opacity",
        ]}
      >
        <FaIcon
          name={getIcon(target)}
          scale={0.9}
        />
      </View>
    </View>
  );
}
