# @lambda-ui/gpl

GPL is a graphics programming library, originally implemented in Java and
specified in the book
[The Grammar of Graphics by Leland Wilkinson](https://www.springer.com/gp/book/9780387245447).
This library provides a TypeScript implementation of a subset of this
specification.

## Example

```
SCALE: cat(dim(1), values("Rarely","Infrequently","Occasionally","Frequently","Not Sure")) 
SCALE: cat(dim(2), values("Female","Male"))
COORD: rect(dim(2), polar.theta(dim(1)))
ELEMENT: interval.stack(position(summary.proportion(response*gender)), label(response), color(response))
```
