


# Weaver

A [weaver] is a unit of logic that transforms a [document] into another, for
example a conversion between [schema]s.

# Document

Documents are trees that represent a self-contained structure . A document
object is the abstract syntax tree that contains all the information necessary
to render the document or process it further.

Documents are ideally serializable in order to implement snapshotting for
caching or testing. Documents where only the root node is not serializable also
have better compatibility with SlateJS.

# Schema

Schemas define the structure for a document by specifying the types of nodes
that can occur. For example, a Markdown schema would define a `paragraph` node.

# Markdown

LitDoc provides a Markdown-like language that has extensions for LitDoc specific
features. Some of these features, such as icons and colors, are not backwards
compatible with Markdown. However, the extended markdown should still render
nicely in plain Markdown viewers.

# Template

The user generates a document from a tree of templates. Each template has a
language and holds an unprocessed representation of a syntax tree as a mixture
of code fragments, raw AST nodes, and opaque values.

Templates can be nested. For example, a markdown template can contain multiple
TypeScript code blocks. While the code block itself is part of the Markdown
language, the content would be parsed as TypeScript. This facilitate high
quality syntax highlighting, type checking, reference resolution, or even
building editors for custom languages inside your documentation.

In lit-doc, documentation is not written in a Markdown file, but as TypeScript
modules. This allows the documentation to be type-checked and dynamically
generated. It also allows the documentation to be imported and used in other
modules. This is useful for example to write tests for documentation or for
implementing advanced search and navigation functionality.

Note, that a template is as unprocessed as possible in order to require as
little logic as possible to be generated at runtime.

# Manifest

A manifest document describes the structure of a project. It can be used to
generate sitemaps, navigation, or search indexes. Manifests can be printed as
TypeScript (for including runtime values such as functions), or serializable
formats such as JSON, with less capabilities. 

## Collector

A [reader] is a unit of logic that generates a [manifest] from a source, for
example, reading all files in a directory. Some readers can be customized to
filter certain files, or include additional information such as raw file
contents.

## Router

A [router] is a unit of logic that retrieves a [document] from a [manifest]. A
basic router could be used to look up documents by their file name. A web router
could additionally map the empty "/" path to a document in a file called
`index.tsx` or remove the need for extensions.

# Renderers

Renderers are responsible for converting a document into external
representations. For example, a Markdown renderer would convert a document into
a Markdown string.