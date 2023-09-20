# Litdoc Annotations

Annotations define custom content and metadata for parts of a document. They can
be used to implement icons, colors, and other decorations.

## Basic Concept

A token is a light piece of data that can be added easily and unobtrusively to a
standard Markdown document.

The logic for resolving a token in the final document is customizable, and can
therefore be extended to support a wide range of use cases. There are two basic
use cases for tokens:

1. Inserting custom content into a document.
2. Attaching custom metadata to nodes in a document.

### Token Annotation

```md
Plus icon: :icon/plus:
```

### Text Annotation

```md
[yellow text](@:///color/yellow)
```

### Sticky Annotation

```md
yellow text :^color/yellow: :color/yellow^: yellow text
```

### Upward Sticky

```md
- :^color/yellow: yellow item
```

### Downward Sticky

```md
- normal item :icon/plus^:
  - yellow subitem
  - normal subitem
```

### Link Form

```md
:^color/yellow: --> [:^](@:///color/yellow) :color/yellow^: -->
[^:](@:///color/yellow)
```

### Use case: GitHub Emojis

In GitHub flavored Markdown, you can use emojis by typing `:smile:`. This is
converted to an image tag with the correct URL. The syntax for Litdoc
Annotations is a superset of GitHub's emoji syntax.

```tsx
<Litdoc library={library}>
  <Doc path/>
</Litdoc>;
```
