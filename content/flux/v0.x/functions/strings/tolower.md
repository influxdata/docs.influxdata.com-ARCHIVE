---
title: strings.toLower() function
description: The strings.toLower() function converts a string to lower case.
menu:
  flux_0_x:
    name: strings.toLower
    parent: Strings
weight: 301
---

The `strings.toLower()` function converts a string to lower case.

_**Output data type:** String_

```js
import "strings"

strings.toLower(v: "KOALA")

// returns "koala"
```

## Paramters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to lower case
```js
import "strings"

data
  |> map(fn:(r) => strings.toLower(v: r.exclamation))
```
