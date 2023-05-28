import {
  getStyleTagProperties,
  virtualSheet,
} from "https://esm.sh/twind@0.16.17/sheets";
import { renderToString } from "react-dom/server";
import type { ViewNode } from "../theme/mod.ts";
import { TwindSheetProvider } from "../theme/twind_sheet_provider.tsx";

export function render(view: ViewNode) {
  const sheet = virtualSheet();
  const root = <TwindSheetProvider sheet={sheet}>{view}</TwindSheetProvider>;
  const html = "<!DOCTYPE html>" + renderToString(root);
  const { textContent: css } = getStyleTagProperties(sheet);
  return { html, css };
}
