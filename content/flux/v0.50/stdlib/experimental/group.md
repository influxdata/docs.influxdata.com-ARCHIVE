---
title: experimental.group() function
description: >
  The `experimental.group()` function introduces an `extend` mode to the existing
  `group()` function.
menu:
  flux_0_50:
    name: experimental.group
    parent: Experimental
weight: 1
---

The `experimental.group()` function introduces an `extend` mode to the existing
[`group()`](/flux/v0.50/stdlib/built-in/transformations/group/) function.

_**Function type:** Transformation_

{{% warn %}}
The `experimental.group()` function is subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).

This specific function will be removed once the proposed `extend` mode is sufficiently vetted.
{{% /warn %}}

```js
import "experimental"

experimental.group(columns: ["host", "_measurement"], mode:"extend")
```

## Parameters

### columns
List of columns to use in the grouping operation.
Defaults to `[]`.

_**Data type:** Array of strings_

### mode
The mode used to group columns.

_**Data type:** String_

{{% note %}}
`extend` is the only mode available to `experimental.group()`.
{{% /note %}}

#### extend
Appends columns defined in the [`columns` parameter](#columns) to all existing
[group keys](/v2.0/query-data/get-started/#group-keys).

## Examples

###### Include the value column in each groups' group key
```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> group(columns: ["_value"], mode: "extend")
```

---

### Related functions
- [group()](/flux/v0.50/stdlib/built-in/transformations/group/)
