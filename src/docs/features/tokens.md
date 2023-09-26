# :^icons/tag: Litdoc Markdown Tokens

This is the specification and implementation of the Litdoc Markdown tokens,
hereafter referred to just as _tokens_. Tokens allow authors to add custom nodes
and metadata to their documents. The tokens are designed to be easily parsed and
processed by machines, while still being human-readable and easy to write.

## Examples

This

```md
:icon/info:
```

```md
![](token:///icon/info)
```

## Basic Concept

The text representation of a token resembles that of a standard Markdown link,
both in syntax and semantics. It contains a URL as well as some content. For
example, the following Markdown snippet shows a token in link form:

```md
[This is some _green_ text](token:///color/green)
```

As you can see, the token looks just like a link. It has a text content in
square brackets, as well as a URL in parentheses. The URL is prefixed with
`token://`, which is used to identify token links in a document. The schema is
followed by a pathname and optional query parameters.

> :icon/info: The choice of the custom `token://` URL scheme is made quite
> arbitrarily. The scheme is used to differentiate token links from other links
> in a document, while still remaining compatible with standard Markdown
> parsers.

## Limitations
