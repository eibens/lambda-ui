import { Fragment } from "react";
import { ViewNode } from "../theme/view.tsx";
import { $, Element } from "./core.ts";

export function Chart(props: {
  root: Element;
  renderElement: (props: {
    geometry: Element;
    aesthetics: Record<string, Element>;
  }) => ViewNode;
}) {
  const { root, renderElement } = props;

  const elements = root
    .children
    .filter($.name("ELEMENT"))
    .map((element) => {
      const [geometry] = element
        .children
        .filter($.element);

      if (!geometry) {
        throw new Error("No geometry found");
      }

      const aesthetics = geometry
        .children
        .filter($.element)
        .reduce((acc, aesthetic) => {
          const { name } = aesthetic;
          return {
            ...acc,
            [name]: aesthetic,
          };
        }, {} as Record<string, Element>);

      return renderElement({
        geometry,
        aesthetics,
      });
    });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      width="500"
      height="500"
    >
      {elements.map((element, index) => (
        <Fragment key={index}>
          {element}
        </Fragment>
      ))}
    </svg>
  );
}
