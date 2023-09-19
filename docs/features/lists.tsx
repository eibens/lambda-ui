import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# :icons/list: [Lists](#lists)

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

> - :^icons/circle-info: *List item*
> - :^icons/warning: List item
> - :^icons/tree: List item

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

> - ## :^icons/star: Heading 2
>   - Paragraph
>   - Paragraph
> - ## :^icons/star: Heading 2
>   - Paragraphs
>   - Paragraph


> - :^icons/chevron-right: **Chapters**
>   - #### Chapter 1
>   - #### Chapter 2
>   - #### Chapter 3
> - :^icons/chevron-right: **Appendix**
>   - #### Code Samples
>   - #### Glossary

## [Icon sizes](#icon-sizes)

> - # :^icons/smile: Heading 1
> - ## :^icons/smile: Heading 2
> - ### :^icons/smile: Heading 3
> - #### :^icons/smile: Heading 4
> - ##### :^icons/smile: Heading 5
> - ###### :^icons/smile: Heading 6
> - :^icons/smile: Paragraph

## [Icons alignment](#icon-alignment)

> - # :^icons/minus: :icons/minus: Heading 1
> - ## :^icons/minus: :icons/minus: Heading 2
> - ### :^icons/minus: :icons/minus: Heading 3
> - #### :^icons/minus: :icons/minus: Heading 4
> - ##### :^icons/minus: :icons/minus: Heading 5
> - ###### :^icons/minus: :icons/minus: Heading 6
> - :^icons/minus: :icons/minus: Paragraph

`;
