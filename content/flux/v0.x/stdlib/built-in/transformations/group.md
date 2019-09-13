---
title: group() function
description: The group() function groups records based on their values for specific
  columns.
aliases:
  - /flux/v0.x/functions/transformations/group
  - /flux/v0.x/functions/built-in/transformations/group/
menu:
  flux_0_x:
    name: group
    parent: Transformations
    weight: 1
---

The `group()` function groups records based on their values for specific columns.
It produces tables with new group keys based on provided properties.

_**Function type:** Transformation_

```js
group(columns: ["host", "_measurement"], mode:"by")

// OR

group(columns: ["_time"], mode:"except")

// OR

group()
```

## Parameters

### columns
List of columns to use in the grouping operation.
Defaults to `[]`.

_**Data type:** Array of strings_

### mode
The mode used to group columns.

_**Data type:** String_

The following options are available:

- by
- except

Defaults to `"by"`.

#### by
Groups records by columns defined in the [`columns`](#columns) parameter.

#### except
Groups records by all columns **except** those defined in the [`columns`](#columns) parameter.

## Examples

###### Group by host and measurement
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> group(columns: ["host", "_measurement"])
```

###### Group by everything except time
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> group(columns: ["_time"], mode: "except")
```

###### Remove all grouping
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> group()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[GROUP BY](/influxdb/latest/query_language/data_exploration/#the-group-by-clause) _(similar but different)_
