import {
  getStyleTagProperties,
  virtualSheet,
} from "https://esm.sh/twind@0.16.17/sheets";
import { renderToString } from "react-dom/server";
import { TwindSheetProvider } from "../theme/twind_sheet_provider.tsx";
import { h } from "../theme/view.tsx";
import { ViewNode } from "./mod.ts";

export function render(view: ViewNode) {
  const sheet = virtualSheet();
  const root = h(TwindSheetProvider, { sheet, children: view });
  const html = "<!DOCTYPE html>" + renderToString(root);
  const { textContent: css } = getStyleTagProperties(sheet);
  return { html, css };
}
