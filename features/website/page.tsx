import type { ViewChildren } from "../theme/mod.ts";

/** HELPERS **/

const CSS = `
html {
  background: rgba(229, 231, 235);
  color: rgba(55, 65, 81);
}

html.dark {
  background: rgba(31, 41, 55);
  color: rgba(229, 231, 235);
}
`;

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
        <style>{CSS}</style>
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
