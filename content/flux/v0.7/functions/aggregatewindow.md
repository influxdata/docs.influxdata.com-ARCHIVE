---
title: aggregateWindow() function
description: placeholder
menu:
  flux_0_7:
    name: aggregateWindow
    parent: Functions
    weight: 1
---

The `aggregateWindow()` function applies an aggregate function to fixed windows of time.

_**Function type:** Aggregate_  

```js
aggregateWindow(every: 1m, fn: mean, columns: ["_value"], timeSrc: "_stop", timeDst: "_time")
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
The following values can be used:

- `count`
- `mean`
- `skew`
- `spread`
- `stddev`
- `sum`

_**Data type:** String (unquoted)_

### columns
List of columns on which to operate.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

### timeSrc
The "time source" column from which time is copied for the aggregate record.
Defaults to `"_stop"`.

_**Data type:** String_

### timeDst
The "time destination" column to which time is copied for the aggregate record.
Defaults to `"_time"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: 1h)
  |> filter(fn: (r) => r._measurement == "mem" AND r._field == "used_percent")
  |> aggregateWindow(every: 5m, fn: mean)
```

## Function definition
```js
aggregateWindow = (every, fn, columns=["_value"], timeSrc="_stop", timeDst="_time", table=<-) =>
	table
		|> window(every:every)
		|> fn(columns:columns)
		|> duplicate(column:timeSrc, as:timeDst)
		|> window(every:inf, timeCol:timeDst)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[InfluxQL aggregate functions](/influxdb/latest/query_language/functions/#aggregations)  
[GROUP BY time()](/influxdb/latest/query_language/data_exploration/#the-group-by-clause)  
