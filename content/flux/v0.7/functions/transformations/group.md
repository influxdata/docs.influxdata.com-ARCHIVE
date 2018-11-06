---
title: group() function
description: The group() function groups records based on their values for specific columns.
menu:
  flux_0_7:
    name: group
    parent: Transformations
    weight: 1
---

The `group()` function groups records based on their values for specific columns.
It produces tables with new group keys based on provided properties.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
group(by: ["host", "_measurement"])
group(except: ["_time"])
group(none: true)
```

## Parameters

### by
List of columns by which to group.
_Cannot be used with `except`._

_**Data type:** Array of strings_

## except
List of columns by which to **not** group.
All other columns are used to group records.
_Cannot be used with `by`._

_**Data type:** Array of strings_

## none
Remove existing groups as well as partitions created by the [`window()` function](../window).

_**Data type:** Boolean_

## Examples

###### Group by host and measurement
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> group(by: ["host", "_measurement"])
```

###### Group by everything except time
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> group(except: ["_time"])
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[GROUP BY](/influxdb/latest/query_language/data_exploration/#the-group-by-clause) _(similar but different)_
