---
title: strings.title() function
description: The strings.title() function converts a string to title case.
menu:
  flux_0_x:
    name: strings.title
    parent: Strings
weight: 1
---

The `strings.title()` function converts a string to title case.

_**Output data type:** String_

```js
import "strings"

strings.title(v: "a flux of foxes")

// returns "A Flux Of Foxes"
```

## Paramters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to title case
```js
import "strings"

data
  |> map(fn:(r) => strings.title(v: r.pageTitle))
```
