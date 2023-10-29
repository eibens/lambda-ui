import { h } from "preact";
import { renderToString } from "preact-render-to-string";

/** HELPERS **/

function Slot() {
  return h("meta", { name: "litdoc" }, []);
}

function Page(props: {
  data: unknown;
  dark?: boolean;
}) {
  const { dark, data } = props;
  return h("html", {
    lang: "en",
    class: dark ? "dark" : "",
  }, [
    h("head", {}, [
      h("title", {}, "Hello World"),
      h(Slot, {}, []),
      h("script", {
        type: "application/json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify(data),
        },
      }, []),
    ]),
    h("body", {}, [
      h("h1", {}, "Hello, world!"),
    ]),
  ]);
}

function handleHtml(req: Request) {
  const dark = getCookie(req, "dark") === "true";

  const data = { answer: 42 };
  const css = ".dark body { background: black; color: white; }";

  const slot = h(Slot, {}, []);
  const dom = h(Page, { dark, data }, [slot]);
  const template = renderToString(dom);
  const placeholder = renderToString(slot);

  const style = h("style", {
    dangerouslySetInnerHTML: {
      __html: css,
    },
  });

  const replacement = renderToString(style);
  const html = template.replace(placeholder, replacement);

  return html;
}

function getCookie(req: Request, name: string) {
  return req.headers
    .get("Cookie")
    ?.split(";")
    .map((cookie) => cookie.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

/** MAIN **/

export type Instance = {
  start: () => Promise<void>;
};

export function create(): Instance {
  return {
    start: async () => {
      const server = Deno.serve({
        hostname: "localhost",
        port: 8000,
      }, (req) => {
        const url = new URL(req.url);
        const params = url.searchParams;
        const path = url.pathname;
        const type = params.get("type") ?? "html";
        console.log(type, path);

        const html = handleHtml(req);
        return new Response(html, {
          headers: {
            "Content-Type": "text/html",
            "Set-Cookie": "hello=world",
          },
        });
      });

      await server.finished;
    },
  };
}
