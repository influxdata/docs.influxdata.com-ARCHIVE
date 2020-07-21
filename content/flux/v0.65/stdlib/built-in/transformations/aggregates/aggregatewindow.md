---
title: aggregateWindow() function
description: The aggregateWindow() function applies an aggregate function to fixed
  windows of time.
aliases:
  - /flux/v0.65/functions/transformations/aggregates/aggregatewindow
  - /flux/v0.65/functions/built-in/transformations/aggregates/aggregatewindow/
menu:
  flux_0_65:
    name: aggregateWindow
    parent: Aggregates
    weight: 1
---

The `aggregateWindow()` function applies an aggregate or selector function
(any function with a `column` parameter) to fixed windows of time.

_**Function type:** Aggregate_  

```js
aggregateWindow(
  every: 1m,
  fn: mean,
  column: "_value",
  timeColumn: "_stop",
  timeDst: "_time",
  createEmpty: true
)
```

As data is windowed into separate tables and processed, the `_time` column is dropped from each group key.
This function copies the timestamp from a remaining column into the `_time` column.
View the [function definition](#function-definition).

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.65/language/data-model/#match-parameter-names).
{{% /note %}}

### every
The duration of windows.

{{% note %}}
#### Calendar months and years
`every` supports all [valid duration units](/flux/v0.65/language/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

_**Data type:** Duration_

### fn
The aggregate function used in the operation.

_**Data type:** Function_

{{% note %}}
Only aggregate and selector functions with a `column` parameter (singular) work with `aggregateWindow()`.
{{% /note %}}

### column
Columns on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

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
The examples below use a `data` variable to represent a filtered data set.

```js
data = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
```

##### Use an aggregate function with default parameters
The following example uses the default parameters of the
[`mean()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/mean/)
to aggregate time-based windows:

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: mean
  )
```
##### Specify parameters of the aggregate function
To use functions that don't provide defaults for required parameters with `aggregateWindow()`,
define an anonymous function with `column` and `tables` parameters that pipes-forward
tables into the aggregate or selector function with all required parameters defined:

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: (column, tables=<-) => tables |> quantile(q: 0.99, column:column)
  )
```

##### Window and aggregate by calendar month
```js
data
  |> aggregateWindow(every: 1mo, fn: mean)
```

## Function definition
```js
aggregateWindow = (every, fn, columns=["_value"], timeColumn="_stop", timeDst="_time", tables=<-) =>
	tables
		|> window(every:every)
		|> fn(column:column)
		|> duplicate(column:timeColumn, as:timeDst)
		|> window(every:inf, timeColumn:timeDst)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[InfluxQL aggregate functions](/influxdb/latest/query_language/functions/#aggregations)  
[GROUP BY time()](/influxdb/latest/query_language/explore-data/#the-group-by-clause)  
