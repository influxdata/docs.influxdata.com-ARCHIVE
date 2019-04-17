---
title: strings.toUpper() function
description: The strings.toUpper() function converts a string to upper case.
menu:
  flux_0_x:
    name: strings.toUpper
    parent: Strings
weight: 1
---

The `strings.toUpper()` function converts a string to upper case.

_**Output data type:** String_

```js
import "strings"

strings.toUpper(v: "koala")

// returns "KOALA"
```

## Paramters

### v
The string value to convert.

_**Data type:** String_

## Examples

###### Convert all values of a column to upper case
```js
import "strings"

data
  |> map(fn:(r) => strings.toUpper(v: r.envVars))
```
