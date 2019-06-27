---
title: strings.containsAny() function
description: >
  The strings.containsAny() function reports whether a specified string contains
  any characters from from another string.
menu:
  flux_0_33:
    name: strings.containsAny
    parent: Strings
    weight: 1
---

The `strings.containsAny()` function reports whether a specified string contains
characters from another string.

_**Output data type:** Boolean_

```js
import "strings"

strings.containsAny(v: "abc", chars: "and")

// returns true
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### chars
Characters to search for.

_**Data type:** String_

## Examples

###### Report if a string contains specific characters
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.containsAny(v: r.price, chars: "£$¢")
    })
  )
```
