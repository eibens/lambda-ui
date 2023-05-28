# Lambda UI

My personal web UI library.

- [Docs](https://eibens.github.io/lambda-ui/)

## Structure

The library is split into sub-libraries inside the `features` folder. Each
feature folder has a `mod.ts` that exports the public API of the feature. The
TypeScript modules in the feature folders can also be imported directly to
save on bundle size:

```ts
import { Paragraph } from "./features/text/paragraphs.tsx";
```
