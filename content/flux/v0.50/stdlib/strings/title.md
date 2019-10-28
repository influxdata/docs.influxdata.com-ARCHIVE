---
title: strings.title() function
description: The strings.title() function converts a string to title case.
menu:
  flux_0_50:
    name: strings.title
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.50/functions/strings/title/
---

The `strings.title()` function converts a string to title case.

_**Output data type:** String_

```js
import "strings"

strings.title(v: "a flux of foxes")

// returns "A Flux Of Foxes"
```

## Parameters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to title case
```js
import "strings"

data
  |> map(fn: (r) => ({ r with pageTitle: strings.title(v: r.pageTitle) }))
```
