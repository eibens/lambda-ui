import { App } from "./app.tsx";
import { Page } from "./page.tsx";

/** MAIN **/

export function render() {
  return (
    <Page
      title="Lambda UI"
      script="index.js"
      style="index.css"
    >
      <App />
    </Page>
  );
}
