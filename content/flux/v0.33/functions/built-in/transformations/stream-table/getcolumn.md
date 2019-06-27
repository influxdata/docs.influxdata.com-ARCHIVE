---
title: getColumn() function
description: >
  The `getColumn()` function extracts a column from a table given its label.
  If the label is not present in the set of columns, the function errors.
menu:
  flux_0_33:
    name: getColumn
    parent: Stream & table
weight: 1
---

The `getColumn()` function extracts a column from a table given its label.
If the label is not present in the set of columns, the function errors.

_**Function type:** Stream and table_  

```js
getColumn(column: "_value")
```

## Parameters

### column
The name of the column to extract.

_**Data type:** String_

## Example
```js
vs = from(bucket:"telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind(fn: (key) => key._field == "usage_idle")
    |> getColumn(column: "_value")

// Use column values
x = vs[0] + vs[1]
```
