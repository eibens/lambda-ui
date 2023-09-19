# Linking

Linking in Litdoc can be done by importing the module and passing it to the
template literal as a value.

## Example

Consider a simple homepage, with a contact page and sitemap. These pages are
interlinked in the following way:

- The homepage links to the contact page, so that a user can find the authors,
  and it links to the sitemap, so that a user can find pages.
- The contact page links to the homepage, so that a user can find information
  online.
- The sitemap links to all of the above, as well as itself, in order to provide
  the user with a complete overview of the website.

:file/homepage.ts^:

```ts
import lit from "litdoc/lit.ts"
import * as contact from "./contact.ts";
import * as sitemap from "./sitemap.ts";

export const doc = lit();
const { md } = doc;

md`
# Homepage

> Find stuff: [${sitemap}]

> Find us: [${contact}]
```

:file/contact.ts^:

```ts
import lit from "litdoc/lit.ts"
import * as homepage from "./index.ts";

export const doc = lit();
const { md } = doc;

md`
# Contact

> Visit the homepage: [${homepage}]
```

:file/sitemap.ts^:

```ts
import lit from "litdoc/lit.ts";
import * as contact from "./contact.ts";
import * as homepage from "./index.ts";
import * as sitemap from "./sitemap.ts";

export const doc = lit();
const { md } = doc;

md`
# Sitemap

- [${homepage}]
- [${contact}]
- [${sitemap}]
`;
```

The above files can be rendered as a homepage, by

:file/routes/[...path].ts^:

```tsx
import LitdocPreact from "litdoc-preact/mod.ts";
import Litdoc from "litdoc/preact.ts";
import * as contact from "./contact.ts";
import * as homepage from "./index.ts";
import * as sitemap from "./sitemap.ts";

export default function render(ctx: RouteContext) {
  return (
    <Litdoc
      url={request.url}
      routing={{
        routes: {
          "/": "./index.ts",
          "/contact": "./contact.ts",
          "/sitemap": "./sitemap.ts",
        },
      }}
      manifest={{
        url: new URL(import.meta.url),
        files: {
          "./contact.ts": contact,
          "./index.ts": homepage,
          "./sitemap.ts": sitemap,
        },
      }}
    />
  );
}
```

This is the output:

It may surprise you, that this works. You might wonder if this is even valid use
of TypeScript. Or you might not see

> This is wrinkling my brain.
>
> --- Troy Barnes (Community, portrayed by Donald Glover)
