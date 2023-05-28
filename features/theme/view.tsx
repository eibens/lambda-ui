import { Fragment, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import type { Twind } from "./deps.ts";
import type { ReactNode } from "./react.ts";
import { useTwind } from "./use_twind.ts";

/** MAIN **/

export type ViewNode = ReactNode;

export type ViewChildren = ReactNode | undefined;

export type ViewTag = keyof JSX.IntrinsicElements;

export type ViewProps<Tag extends ViewTag = ViewTag> =
  & Omit<JSX.IntrinsicElements[Tag], "class">
  & {
    tag?: Tag;
    class?: Twind.Token;
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
    ...rest
  } = { ...props.viewProps, ...props };

  const twind = useTwind();
  const tw = twind?.tw ?? ((x) => x);

  const {
    style: viewStyle,
    class: viewClassName,
    ...viewRest
  } = viewProps ?? {};

  const ref = useRef<HTMLElement>(null);

  if (style && typeof style !== "object") {
    throw new Error("style must be an object");
  }

  if (viewStyle && typeof viewStyle !== "object") {
    throw new Error("viewStyle must be an object");
  }

  const mergedProps = {
    ...rest,
    ...viewRest,
    ref,
    class: tw([
      className,
      viewClassName,
    ]),
    style: {
      ...(style ?? {}),
      ...(viewStyle ?? {}),
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
