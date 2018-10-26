---
title: yield() function
description: placeholder
menu:
  flux_0_7:
    name: yield
    parent: Functions
    weight: 1
---

The `yield()` function indicates the input tables received should be delivered as a result of the query.
Yield outputs the input stream unmodified.
A query may have multiple results, each identified by the name provided to the `yield()` function.

_**Function type:** output_  
_**Output data type:** table(s)_

```js
yield(name: "custom-name")
```

## Parameters

### name
A unique name for the yielded results.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> yield(name: "1")
```
