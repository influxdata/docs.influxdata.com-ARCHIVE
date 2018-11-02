---
title: increase() function
description: placeholder
menu:
  flux_0_7:
    name: increase
    parent: Functions
    weight: 1
---

The `increase()` function returns the total non-negative difference between values in a table.
A main use case is tracking changes in counter values which may wrap over time when they hit a threshold or are reset.
In the case of a wrap/reset, the function assumes the absolute delta between two points is at least their non-negative difference.

_**Function type:** transformation_  
_**Output data type:** float_

```js
increase(columns: ["_values"])
```

## Parameters

### columns
The list of columns for which the increase is calculated.

_**Data type:** array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "system" AND r._field == "n_users")
  |> increase()
```

## Function definition
```js
increase = (table=<-, columns=["_value"]) =>
	table
		|> difference(nonNegative: true, columns:columns)
		|> cumulativeSum()
```
