# How it works


- Provide a general purpose, extensible, and well-documented template language that is compatible with TypeScript. 
  - Allows embedding of type-checked TypeScript code snippets.

- Provide a serializable data format for querying and manipulating documentation content. This can be used to implement navigation, search, and debugging tools.
- Provide a TypeScript compatible template language

Imagine you want to create a documentation website for a project. You want to write the documentation in markdown, but you also want to include some non-markdown content, like a table of contents, a search bar,  

A basic template is markdown source code with 'holes' for non-markdown content, and a list of 


> The Markdown code block has special purpose in [lit-doc]. It is possible to define custom parsing and rendering logic for code blocks. 



[lit-doc]: #

```ts


// 
type Template = {

}

// tree representation of content (compatible with Slate)
// slots are represented as nodes with a special type
type Doc = {

}

type SlateDoc = {

}

function generate<Props>(props: Props, template: Template): Doc {

}

function createSlateDoc(middleware: (doc: SlateDoc) => SlateDoc): SlateDoc {

}

type Options = {

}

|> props
|> LitDoc.generate(template)
|> LitDoc.render(options)

```

## 
// lowercase lambda character: λ