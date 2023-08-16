import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

md`
# :list: [Lists](#lists)

These are examples of lists in Litdoc.

## [Unordered List](#unordered-list)

> - List item
> - List item
> - List item

## [Ordered List](#ordered-list)

> 1. List item
> 2. List item
> 3. List item

## [Icon List](#icon-list)

> - :circle-info: List item
> - :warning: List item
> - :tree: List item

## [Task List](#task-list)

> - [ ] List item
> - [x] List item
> - [ ] List item

## [Nested List](#nested-list)

> - List item
>   - List item 
>   - List item
> - List item
>   - List item
>   - List item

## [Hierarchical List](#hierarchical-list)

> - ## :star: Heading 2
>   - Paragraph
>   - Paragraph
> - ## :star: Heading 2
>   - Paragraphs
>   - Paragraph


> - :chevron-right: **Chapters**
>   - #### Chapter 1
>   - #### Chapter 2
>   - #### Chapter 3
> - :chevron-right: **Appendix**
>   - #### Code Samples
>   - #### Glossary
`;
