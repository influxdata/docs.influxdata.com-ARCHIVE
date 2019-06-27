---
title: regexp.quoteMeta() function
description: >
  The `regexp.quoteMeta()` function escapes all regular expression metacharacters inside of a string.
menu:
  flux_0_x:
    name: regexp.quoteMeta
    parent: regexp-package
    weight: 1
---

The `regexp.quoteMeta()` function escapes all regular expression metacharacters inside of a string.

_**Output data type:** String_

```js
import "regexp"

regexp.quoteMeta(v: ".+*?()|[]{}^$")

// Returns "\.\+\*\?\(\)\|\[\]\{\}\^\$"
```

## Parameters

### v
The string that contains regular expression metacharacters to escape.

_**Data type:** String_

## Examples

###### Escape regular expression meta characters in column values
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      notes: r.notes,
      notes_escaped: regexp.quoteMeta(v: r.notes)
    })
  )
```
