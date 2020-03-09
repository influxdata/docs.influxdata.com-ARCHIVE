---
title: join() function
description: The join() function merges two or more input streams whose values are
  equal on a set of common columns into a single output stream.
aliases:
  - /flux/v0.x/functions/transformations/join
  - /flux/v0.x/functions/built-in/transformations/join/
menu:
  flux_0_x:
    name: join
    parent: Transformations
    weight: 1
---

The `join()` function merges two or more input streams whose values are equal on
a set of common columns into a single output stream.
Null values are not considered equal when comparing column values.
The resulting schema is the union of the input schemas.
The resulting group key is the union of the input group keys.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
join(tables: {key1: table1, key2: table2}, on: ["_time", "_field"], method: "inner")
```

#### Output schema
The column schema of the output stream is the union of the input schemas.
It is also the same for the output group key.
Columns are renamed using the pattern `<column>_<table>` to prevent ambiguity in joined tables.

##### Example:
If you have two streams of data, **data_1** and **data_2**, with the following group keys:

**data_1**: `[_time, _field]`  
**data_2**: `[_time, _field]`

And join them with:

```js
join(tables: {d1: data_1, d2: data_2}, on: ["_time"])
```

The resulting group keys for all tables will be: `[_time, _field_d1, _field_d2]`


## Parameters

### tables
The map of streams to be joined. <span style="color:#FF8564; font-weight:700;">Required</span>.

_**Data type:** Object_

> `join()` currently only supports two input streams.

### on
The list of columns on which to join. <span style="color:#FF8564; font-weight:700;">Required</span>.

_**Data type:** Array of strings_

### method
The method used to join. Defaults to `"inner"`.

_**Data type:** String_

###### Possible Values:
- `inner`

<!--
- `cross`
- `left`
- `right`
- `full`

> The `on` parameter and the cross method are mutually exclusive.
-->

## Examples

#### Example join with sample data

Given the following two streams of data:

##### SF_Temp**  

| _time  | _field | _value  |
| ------ |:------:| -------:|
| 0001	 | "temp" | 70      |
| 0002	 | "temp" | 75      |
| 0003	 | "temp" | 72      |

##### NY_Temp**  

| _time  | _field | _value  |
| ------ |:------:| -------:|
| 0001	 | "temp" | 55      |
| 0002	 | "temp" | 56      |
| 0003	 | "temp" | 55      |

And the following join query:

```js
join(
  tables: {sf: SF_Temp, ny: NY_Temp},
  on: ["_time", "_field"]
)
```

The output will be:

| _time | _field | _value_ny | _value_sf |
| ----- | ------ | ---------:| ---------:|
| 0001  | "temp" | 55        | 70        |
| 0002  | "temp" | 56        | 75        |
| 0003  | "temp" | 55        | 72        |

#### Cross-measurement join
```js
data_1 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )

data_2 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )

join(
  tables: {d1: data_1, d2: data_2},
  on: ["_time", "host"]
)
```

## join() versus union()
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.
`union()` does not modify data in rows, but unifies separate streams of tables
into a single stream of tables and groups rows of data based on existing
[group keys](/flux/v0.x/introduction/getting-started/#group-keys).
