import type { ViewChildren } from "../theme/mod.ts";

/** MAIN **/

export function Page(props: {
  title: string;
  script?: string;
  style?: string;
  head?: ViewChildren;
  children?: ViewChildren;
}) {
  const { title, script, style, head, children } = props;
  return (
    <html className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {style && <link rel="stylesheet" href="index.css" />}
        {head}
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        {script && <script src="index.js"></script>}
      </body>
    </html>
  );
}
