import type { CSSProperties, JSX, ReactNode } from "react";
import { Fragment, useEffect, useRef } from "react";
import type { Twind } from "./deps.ts";
import { useTwind } from "./use_twind.ts";

/** MAIN **/

export { createElement as h } from "react";

export type ViewNode = ReactNode;

export type ViewChildren = ReactNode | undefined;

export type ViewTag = keyof JSX.IntrinsicElements;

export type ViewProps<Tag extends ViewTag = ViewTag> =
  & Omit<JSX.IntrinsicElements[Tag], "class" | "style">
  & {
    tag?: Tag;
    style?: CSSProperties;
    class?: Twind.Token;
    rawClass?: string;
    viewProps?: ViewProps<Tag>;
    onElement?: (el: HTMLElement) => void;
  };

export const ViewFragment = Fragment;

export function View<Tag extends ViewTag = "div">(props: ViewProps<Tag>) {
  const {
    tag,
    style,
    viewProps,
    onElement,
    class: className,
    rawClass = "",
    ...rest
  } = { ...props.viewProps, ...props };

  const { tw } = useTwind();

  const {
    style: viewStyle,
    class: viewClassName,
    rawClass: viewRawClass = "",
    ...viewRest
  } = viewProps ?? {};

  const ref = useRef<HTMLElement>(null);

  const mergedProps = {
    ...rest,
    ...viewRest,
    ref,
    class: rawClass + " " + viewRawClass + " " + tw([
      className,
      viewClassName,
    ]),
    style: {
      ...style,
      ...viewStyle,
    },
  };

  useEffect(() => {
    if (!globalThis.document) return;

    const el = ref.current;
    if (!el) return;

    if (onElement) {
      onElement(el);
    }
  }, [ref.current]);

  const Tag = tag ?? "div";
  return (
    // @ts-ignore TODO: figure out how to type this
    <Tag {...mergedProps} />
  );
}
