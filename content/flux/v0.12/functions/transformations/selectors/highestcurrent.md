---
title: highestCurrent() function
description: The highestCurrent() function returns the top 'n' records from all groups using the last value of each group.
menu:
  flux_0_12:
    name: highestCurrent
    parent: Selectors
    weight: 1
---

The `highestCurrent()` function returns the top `n` records from all groups using the last value of each group.

_**Function type:** Selector, Aggregate_

```js
highestCurrent(
  n:10,
  columns: ["_value"],
  groupColumns: []
)
```

## Parameters

### n
Number of records to return.

_**Data type:** Integer_

### columns
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

_**Data type:** Array of strings_

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
  |> highestCurrent(n:10, groupColumns: ["host"])
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
// lowest records based on the columns and the _sortLimit function.
// The default reducer assumes no reducing needs to be performed.
_highestOrLowest = (n, _sortLimit, reducer, columns=["_value"], groupColumns=[], tables=<-) =>
  tables
    |> group(columns:groupColumns)
    |> reducer()
    |> group(columns:[])
    |> _sortLimit(n:n, columns:columns)

highestCurrent = (n, columns=["_value"], groupColumns=[], tables=<-) =>
  tables
    |> _highestOrLowest(
        n:n,
        columns:columns,
        groupColumns:groupColumns,
        reducer: (tables=<-) => tables |> last(column:columns[0]),
        _sortLimit: top,
      )
```
