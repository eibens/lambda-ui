# Litdoc Pipeline


```ts
import lit from "litdoc/lit.ts";
export const doc = lit();
const { md } = doc;

md`
# Example

This is a cube :icons/cube:
`;

const answer = (10 * 2 + 1) * 2;

md`
:^color/fuchsia: The answer is ${answer}
`;
```

Generate a Markdown template:

````md
# Example

This is a cube :icons/cube:

```ts
const answer = (10 * 2 + 1) * 2;
```

:^color/fuchsia: The answer is :value/0:
````

These are the extracted values:

```ts
const values = [42];
```

Expand shorthand tokens to link tokens:

~~~md
# Example

This is a cube [](token:///icons/cube)

```ts
const answer = (10 * 2 + 1) * 2;
```

[:^](token:///color/fuchsia) The answer is [](token:///value/0)
~~~

Parse markdown

~~~ts
{
  type: "Root",
  children: [{
    type: "Heading",
    depth: 1,
    children: [{
      type: "Text",
      value: "Example"
    }]
  }, {
    type: "Paragraph",
    children: [{
      type: "Text",
      value: "This is a cube "
    }, {
      type: "Link",
      url: "token:///icons/cube",
      children: [{
        type: "Text",
        value: ""
      }]
    }]
  }, {
    type: "Code",
    lang: "ts",
    meta: null,
    value: "const answer = (10 * 2 + 1) * 2;"
  }, {
    type: "Paragraph",
    tokens: [
      "token:///color/fuchsia",
    ],
    children: [{
      type: "Text",
      value: "The answer is "
    }, {
      type: "Link",
      url: "token:///value/0",
      children: [{
        type: "Text",
        value: ""
      }]
    }]
  }]
}
~~~