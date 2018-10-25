---
title: distinct() function
description: placeholder
menu:
  flux_0_7:
    name: distinct
    parent: Functions
    weight: 1
---

The `distinct()` function returns the unique values for a given column.

_**Function type:** aggregate_  
_**Output data type:** inherited from [column](#column) data type_

```js
distinct(column: "host")
```

## Parameters

### column
Column on which to track unique values.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```
