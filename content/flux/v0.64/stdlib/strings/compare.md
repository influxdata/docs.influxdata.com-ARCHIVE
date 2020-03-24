---
title: strings.compare() function
description: The strings.compare() function compares the lexicographical order of
  two strings.
menu:
  flux_0_64:
    name: strings.compare
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.64/functions/strings/compare/
---

The `strings.compare()` function compares the lexicographical order of two strings.

_**Output data type:** Integer_

```js
import "strings"

strings.compare(v: "a", t: "b")

// returns -1
```

#### Return values
| Comparison | Return value |
|:----------:|:------------:|
| `v < t`    | `-1`         |
| `v == t`   | `0`          |
| `v > t`    | `1`          |

## Parameters

### v
The string value to compare.

_**Data type:** String_

### t
The string value to compare against.

_**Data type:** String_

## Examples

###### Compare the lexicographical order of column values
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.compare(v: r.tag1, t: r.tag2)
    })
  )  
```
