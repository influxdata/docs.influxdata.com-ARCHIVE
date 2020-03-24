---
title: experimental.group() function
description: >
  The `experimental.group()` function introduces an `extend` mode to the existing
  `group()` function.
menu:
  flux_0_64:
    name: experimental.group
    parent: Experimental
weight: 2
---

The `experimental.group()` function introduces an `extend` mode to the existing
[`group()`](/flux/v0.64/stdlib/built-in/transformations/group/) function.

_**Function type:** Transformation_

{{% warn %}}
This function will be removed once the proposed `extend` mode is sufficiently vetted.
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
[group keys](/flux/v0.64/introduction/getting-started/#group-keys).

## Examples

###### Include the value column in each groups' group key
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1m)
  |> group(columns: ["_value"], mode: "extend")
```

---

### Related functions
- [group()](/flux/v0.64/stdlib/built-in/transformations/group/)
