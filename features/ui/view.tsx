import {
  ComponentChild,
  ComponentChildren,
  Fragment,
  JSX,
  VNode,
} from "preact";
import { useEffect, useRef } from "preact/hooks";
import * as twind from "twind";

/** MAIN **/

export type ViewNode = VNode;

export type ViewChild = ComponentChild;

export type ViewChildren = ComponentChildren;

export type ViewTag = keyof JSX.IntrinsicElements;

export type ViewProps<Tag extends ViewTag = ViewTag> =
  & Omit<JSX.IntrinsicElements[Tag], "class">
  & {
    tag?: Tag;
    class?: twind.Token;
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
    class: twind.apply([
      className,
      viewClassName,
    ]),
    style: {
      // @ts-ignore TODO: figure out how to type this
      ...(style ?? {}),
      // @ts-ignore TODO: figure out how to type this
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
