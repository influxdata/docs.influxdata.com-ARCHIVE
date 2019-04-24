---
title: strings.trimPrefix() function
description: >
  The `strings.trimPrefix()` function removes a prefix from a string.
  Strings that do not start with the prefix are returned unchanged.
menu:
  flux_0_x:
    name: strings.trimPrefix
    parent: Strings
weight: 1
---

The `strings.trimPrefix()` function removes a prefix from a string.
Strings that do not start with the prefix are returned unchanged.

_**Output data type:** String_

```js
import "strings"

strings.trimPrefix(v: "123_abc", prefix: "123")

// returns "_abc"
```

## Paramters

### v
The string value to trim.

_**Data type:** String_

### prefix
The prefix to remove.

_**Data type:** String_

## Examples

###### Remove a prefix from all values in a column
```js
import "strings"

data
  |> map(fn:(r) => strings.trimPrefix(v: r.sensorId, prefix: "s12_"))
```
