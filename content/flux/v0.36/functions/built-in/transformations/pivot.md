---
title: pivot() function
description: The pivot() function collects values stored vertically (column-wise) in a table and aligns them horizontally (row-wise) into logical sets.
aliases:
  - /flux/v0.36/functions/transformations/pivot
menu:
  flux_0_36:
    name: pivot
    parent: Transformations
    weight: 1
---

The `pivot()` function collects values stored vertically (column-wise) in a table
and aligns them horizontally (row-wise) into logical sets.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
```

The group key of the resulting table is the same as the input tables, excluding columns found in the [`columnKey`](#columnkey) and [`valueColumn`](#valuecolumn) parameters.
This is because these columns are not part of the resulting output table.  

Every input row should have a 1:1 mapping to a particular row + column in the output table, determined by its values for the [`rowKey`](#rowkey) and [`columnKey`](#columnkey) parameters.
In cases where more than one value is identified for the same row + column pair, the last value
encountered in the set of table rows is used as the result.

Every input row should have a 1:1 mapping to a particular row/column pair in the output table,
determined by its values for the `rowKey` and `columnKey`.
In cases where more than one value is identified for the same row/column pair in the output,
the last value encountered in the set of table rows is used as the result.

The output is constructed as follows:

- The set of columns for the new table is the `rowKey` unioned with the group key,
  but excluding the columns indicated by the `columnKey` and the `valueColumn`.
- A new column is added to the set of columns for each unique value identified
  in the input by the `columnKey` parameter.
- The label of a new column is the concatenation of the values of `columnKey` using `_` as a separator.
  If the value is `null`, `"null"` is used.
- A new row is created for each unique value identified in the input by the `rowKey` parameter.
- For each new row, values for group key columns stay the same, while values for new columns are
  determined from the input tables by the value in `valueColumn` at the row identified by the
  `rowKey` values and the new column's label.
  If no value is found, the value is set to `null`.


## Parameters

### rowKey
List of columns used to uniquely identify a row for the output.

_**Data type:** Array of strings_

### columnKey
List of columns used to pivot values onto each row identified by the rowKey.

_**Data type:** Array of strings_

### valueColumn
The single column that contains the value to be moved around the pivot.

_**Data type:** String_

## Examples

### Align fields within each measurement that have the same timestamp

```js
from(bucket:"test")
  |> range(start: 1970-01-01T00:00:00.000000000Z)
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```

###### Input
|              _time             | _value | _measurement | _field |
|:------------------------------:|:------:|:------------:|:------:|
| 1970-01-01T00:00:00.000000001Z |   1.0  |     "m1"     |  "f1"  |
| 1970-01-01T00:00:00.000000001Z |   2.0  |     "m1"     |  "f2"  |
| 1970-01-01T00:00:00.000000001Z |  null  |     "m1"     |  "f3"  |
| 1970-01-01T00:00:00.000000001Z |   3.0  |     "m1"     |  null  |
| 1970-01-01T00:00:00.000000002Z |   4.0  |     "m1"     |  "f1"  |
| 1970-01-01T00:00:00.000000002Z |   5.0  |     "m1"     |  "f2"  |
|              null              |   6.0  |     "m1"     |  "f2"  |
| 1970-01-01T00:00:00.000000002Z |  null  |     "m1"     |  "f3"  |
| 1970-01-01T00:00:00.000000003Z |  null  |     "m1"     |  "f1"  |
| 1970-01-01T00:00:00.000000003Z |   7.0  |     "m1"     |  null  |
| 1970-01-01T00:00:00.000000004Z |   8.0  |     "m1"     |  "f3"  |

###### Output
|              _time             | _measurement |  f1  |  f2  |  f3  | null |
|:------------------------------:|:------------:|:----:|:----:|:----:|:----:|
| 1970-01-01T00:00:00.000000001Z |     "m1"     |  1.0 |  2.0 | null |  3.0 |
| 1970-01-01T00:00:00.000000002Z |     "m1"     |  4.0 |  5.0 | null | null |
|               null             |     "m1"     | null |  6.0 | null | null |
| 1970-01-01T00:00:00.000000003Z |     "m1"     | null | null | null |  7.0 |
| 1970-01-01T00:00:00.000000004Z |     "m1"     | null | null |  8.0 | null |

### Align fields and measurements that have the same timestamp  
> Note the effects of:
>
> - Having null values in some `columnKey` value;
> - Having more values for the same `rowKey` and `columnKey` value
    (the 11th row overrides the 10th, and so does the 15th with the 14th).

```js
from(bucket:"test")
  |> range(start: 1970-01-01T00:00:00.000000000Z)
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_measurement", "_field"],
    valueColumn: "_value"
  )
```

###### Input
|              _time             | _value | _measurement | _field |
|:------------------------------:|:------:|:------------:|:------:|
| 1970-01-01T00:00:00.000000001Z |   1.0  |     "m1"     |  "f1"  |
| 1970-01-01T00:00:00.000000001Z |   2.0  |     "m1"     |  "f2"  |
| 1970-01-01T00:00:00.000000001Z |   3.0  |     null     |  "f3"  |
| 1970-01-01T00:00:00.000000001Z |   4.0  |     null     |  null  |
| 1970-01-01T00:00:00.000000002Z |   5.0  |     "m1"     |  "f1"  |
| 1970-01-01T00:00:00.000000002Z |   6.0  |     "m1"     |  "f2"  |
| 1970-01-01T00:00:00.000000002Z |   7.0  |     "m1"     |  "f3"  |
| 1970-01-01T00:00:00.000000002Z |   8.0  |     null     |  null  |
|              null              |   9.0  |     "m1"     |  "f3"  |
| 1970-01-01T00:00:00.000000003Z |  10.0  |     "m1"     |  null  |
| 1970-01-01T00:00:00.000000003Z |  11.0  |     "m1"     |  null  |
| 1970-01-01T00:00:00.000000003Z |  12.0  |     "m1"     |  "f3"  |
| 1970-01-01T00:00:00.000000003Z |  13.0  |     null     |  null  |
|              null              |  14.0  |     "m1"     |  null  |
|              null              |  15.0  |     "m1"     |  null  |

###### Output
|              _time             | m1_f1 | m1_f2 |  null_f3  | null_null | m1_f3 | m1_null |
|:------------------------------:|:-----:|:-----:|:---------:|:---------:|:-----:|:-------:|
| 1970-01-01T00:00:00.000000001Z |  1.0  |  2.0  |    3.0    |    4.0    |  null |  null   |
| 1970-01-01T00:00:00.000000002Z |  5.0  |  6.0  |   null    |    8.0    |  7.0  |  null   |
|              null              |  null |  null |   null    |    null   |  9.0  |  15.0   |
| 1970-01-01T00:00:00.000000003Z |  null |  null |   null    |   13.0    |  12.0 |  11.0   |
