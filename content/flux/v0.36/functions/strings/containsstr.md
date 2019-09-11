---
title: strings.containsStr() function
description: The strings.containsStr() function reports whether a string contains a specified substring.
menu:
  flux_0_36:
    name: strings.containsStr
    parent: Strings
    weight: 1
---

The `strings.containsStr()` function reports whether a string contains a specified substring.

_**Output data type:** Boolean_

```js
import "strings"

strings.containsStr(v: "This and that", substr: "and")

// returns true
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring value to search for.

_**Data type:** String_

## Examples

###### Report if a string contains a specific substring
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      _value: strings.containsStr(v: r.author, substr: "John")
    })
  )
```
