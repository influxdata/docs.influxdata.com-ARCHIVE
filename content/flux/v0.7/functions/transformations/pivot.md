---
title: pivot() function
description: The pivot() function collects values stored vertically (column-wise) in a table and aligns them horizontally (row-wise) into logical sets.
menu:
  flux_0_7:
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

The output table will have columns based on the row key plus the group key, excluding any group key columns in the column key,
plus new columns for each unique tuple of values identified by the column key.  
Any columns in the original table not referenced in the `rowKey` or the original table's group key are dropped.  

The output is constructed as follows:

1.  A new row is created for each unique value identified in the input by the `rowKey` parameter.
2.  The initial set of columns for the new row is the row key unioned with the group key,
    but excluding columns indicated by the `columnKey` and `valueColumn` parameters.
3.  A set of value columns are added to the row for each unique value identified in the input by the `columnKey` parameter.
    The label is a concatenation of the `valueColumn` string and the `columnKey` values using `_` as a separator.
4.  For each row key + column key pair, the appropriate value is determined from the input table by the `valueColumn`.
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
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "cpu-total")
  |> pivot(
    rowKey:["_time"],
    columnKey: ["_field"],
    valueColumn: "_value"
  )
```
