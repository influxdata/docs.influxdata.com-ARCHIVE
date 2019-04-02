---
title: aggregateWindow() function
description: The aggregateWindow() function applies an aggregate function to fixed windows of time.
aliases:
  - /flux/v0.x/functions/transformations/aggregates/aggregatewindow
menu:
  flux_0_x:
    name: aggregateWindow
    parent: Aggregates
    weight: 1
---

The `aggregateWindow()` function applies an aggregate function to fixed windows of time.

_**Function type:** Aggregate_  

```js
aggregateWindow(
  every: 1m,
  fn: mean,
  columns: ["_value"],
  timeColumn: "_stop",
  timeDst: "_time",
  createEmpty: true
)
```

As data is windowed into separate tables and aggregated, the `_time` column is dropped from each group key.
This helper copies the timestamp from a remaining column into the `_time` column.
View the [function definition](#function-definition).

## Parameters

### every
The duration of windows.

_**Data type:** Duration_

### fn
The aggregate function used in the operation.

_**Data type:** Function_

### columns
List of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

### timeColumn
The time column from which time is copied for the aggregate record.
Defaults to `"_stop"`.

_**Data type:** String_

### timeDst
The "time destination" column to which time is copied for the aggregate record.
Defaults to `"_time"`.

_**Data type:** String_

### createEmpty
For windows without data, this will create an empty window and fill
it with a `null` aggregate value.
Defaults to `true`.

_**Data type:** Boolean_

## Examples

###### Using an aggregate function with default parameters
```js
from(bucket: "telegraf/autogen")
  |> range(start: 1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```
####### Specifying parameters of the aggregate function
To use `aggregateWindow()` aggregate functions that don't provide defaults for required parameters,
for the `fn` parameter, define an anonymous function with `columns` and `tables` parameters
that pipe-forwards tables into the aggregate function with all required parameters defined:

```js
from(bucket: "telegraf/autogen")
  |> range(start: 1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> aggregateWindow(
    every: 5m,
    fn: (columns, tables=<-) => tables |> quantile(q: 0.99, columns:columns)
  )
```

## Function definition
```js
aggregateWindow = (every, fn, columns=["_value"], timeColumn="_stop", timeDst="_time", tables=<-) =>
	tables
		|> window(every:every)
		|> fn(columns:columns)
		|> duplicate(column:timeColumn, as:timeDst)
		|> window(every:inf, timeColumn:timeDst)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[InfluxQL aggregate functions](/influxdb/latest/query_language/functions/#aggregations)  
[GROUP BY time()](/influxdb/latest/query_language/data_exploration/#the-group-by-clause)  
