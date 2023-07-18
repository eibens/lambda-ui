import { Anchor } from "icons/anchor.tsx";
import { ArrowRight } from "icons/arrow_right.tsx";
import { ArrowUp } from "icons/arrow_up.tsx";
import { External } from "icons/external.tsx";
import { Home } from "icons/home.tsx";
import { Link as LinkIcon } from "icons/link.tsx";
import { ViewChildren, ViewProps } from "../theme/mod.ts";
import { View } from "./view.tsx";

/** HELPERS **/

function parseUrl(str: string) {
  try {
    const url = new URL(str);

    const hostname = url.hostname;
    return {
      target: "external",
      hostname,
    };
  } catch (e) {
    // TypeError is expected if str is a local URL.
    if (!(e instanceof TypeError)) throw e;

    if (str === "/") {
      return {
        target: "home",
        hostname: "",
      };
    }

    if (str === "#top") {
      return {
        target: "top",
        hostname: "",
      };
    }

    if (str.startsWith("#")) {
      return {
        target: "local",
        hostname: "",
      };
    }

    return {
      target: "internal",
      hostname: "",
    };
  }
}

/** MAIN **/

export function Link(
  props: ViewProps<"a"> & {
    href: string;
    children: ViewChildren;
  },
) {
  const { href, children, ...rest } = props;
  const { target, hostname } = parseUrl(href);

  const icon = (function () {
    if (target === "external") return <External />;
    if (target === "internal") return <ArrowRight />;
    if (target === "local") return <Anchor />;
    if (target === "home") return <Home />;
    if (target === "top") return <ArrowUp />;
    return <LinkIcon />;
  })();

  const title = (function () {
    if (target === "external") return `External link to ${hostname}`;
    if (target === "internal") return `Internal link`;
    if (target === "local") return `Local link`;
    if (target === "home") return `Homepage`;
    return "Unknown link type";
  })();

  return (
    <View {...rest} tag="span">
      <View
        tag="a"
        class={[
          "color-sky fill-0 stroke-0 hover:stroke-30 focus:stroke-50 border-b-[0.125em]",
          "transition-colors duration-200 ease-in-out focus:outline-none",
        ]}
        target={target === "external" ? "_blank" : undefined}
        href={href}
        onClick={(e) => {
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
        }}
      >
        {children}
      </View>
      <View
        tag="span"
        class={[
          "inline-block text-gray-500 cursor-help select-none",
          `pl-[${0.25}rem]`,
        ]}
        title={title}
      >
        <View
          tag="span"
          class={[
            "relative flex w-[0.75lh] h-[0.75lh]",
            `top-[${0.125}lh]`,
          ]}
        >
          {icon}
        </View>
      </View>
    </View>
  );
}
