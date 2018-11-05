---
title: Group
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Group
    weight:
---

Group groups records based on their values for specific columns.
It produces tables with new group keys based on the provided properties.

Group has the following properties:

*  `by` list of strings
  * Group by these specific columns.
  * Cannot be used with `except`.
*  `except` list of strings
  * Group by all other columns except this list.
  * Cannot be used with `by`.

**Examples:**

```
group(by:["host"]) // group records by their "host" value
group(except:["_time", "region", "_value"]) // group records by all other columns except for _time, region, and _value
group(by:[]) // group all records into a single group
group(except:[]) // group records into all unique groups
```

```
from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> group(by: ["host", "_measurement"])
```
All records are grouped by the `host` and `_measurement` columns. The resulting group key would be `["host, "_measurement"]`

```
from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> group(except: ["_time"])
```
All records are grouped by the set of all columns in the table, excluding `_time`.
For example, if the table has columns `["_time", "host", "_measurement", "_field", "_value"]`, then the group key would be `["host", "_measurement", "_field", "_value"]`.
