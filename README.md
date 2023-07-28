# Litdoc

Litdoc is a library for writing TypeScript documentation.

## Structure

The library is split into sub-libraries inside the `features` folder. Each
feature folder has a `mod.ts` that exports the public API of the feature. The
TypeScript modules in the feature folders can also be imported directly to save
on bundle size:

```ts
import { Paragraph } from "./features/text/paragraphs.tsx";
```
