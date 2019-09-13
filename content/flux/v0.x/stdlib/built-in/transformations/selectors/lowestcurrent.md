---
title: lowestCurrent() function
description: The lowestCurrent() function returns the bottom 'n' records from all
  groups using the last value of each group.
aliases:
  - /flux/v0.x/functions/transformations/selectors/lowestcurrent
  - /flux/v0.x/functions/built-in/transformations/selectors/lowestcurrent/
menu:
  flux_0_x:
    name: lowestCurrent
    parent: Selectors
    weight: 1
---

The `lowestCurrent()` function returns the bottom `n` records from all groups using the last value of each group.

_**Function type:** Selector, Aggregate_

```js
lowestCurrent(
  n:10,
  column: "_value",
  groupColumns: []
)
```

## Parameters

### n
Number of records to return.

_**Data type:** Integer_

### column
Column by which to sort.
Default is `"_value"`.

_**Data type:** String_

### groupColumns
The columns on which to group before performing the aggregation.
Default is `[]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> lowestCurrent(n:10, groupColumns: ["host"])
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

// _highestOrLowest is a helper function which reduces all groups into a single
// group by specific tags and a reducer function. It then selects the highest or
// lowest records based on the column and the _sortLimit function.
// The default reducer assumes no reducing needs to be performed.
_highestOrLowest = (n, _sortLimit, reducer, column="_value", groupColumns=[], tables=<-) =>
  tables
    |> group(columns:groupColumns)
    |> reducer()
    |> group(columns:[])
    |> _sortLimit(n:n, columns:[column])

lowestCurrent = (n, column="_value", groupColumns=[], tables=<-) =>
  tables
    |> _highestOrLowest(
        n:n,
        column:column,
        groupColumns:groupColumns,
        reducer: (tables=<-) => tables |> last(column:column),
        _sortLimit: bottom,
      )
```
