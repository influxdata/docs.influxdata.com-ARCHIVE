---
title: reduce() function
description: >
  The `reduce()` function aggregates records in each table according to the reducer,
  `fn`, providing a way to create custom table aggregations.
menu:
  flux_0_x:
    name: reduce
    parent: Aggregates
weight: 1
---

The `reduce()` function aggregates records in each table according to the reducer,
`fn`, providing a way to create custom aggregations.
The output for each table is the group key of the table with columns corresponding
to each field in the reducer object.

_**Function type:** Transformation_

```js
reduce(
  fn: (r, accumulator) => ({ sum: r._value + accumulator.sum }),
  identity: {sum: 0.0}
)
```

If the reducer record contains a column with the same name as a group key column,
the group key column's value is overwritten, and the outgoing group key is changed.
However, if two reduced tables write to the same destination group key, the function will error.

## Parameters

### fn
Function to apply to each record with a reducer object ([`identity`](#identity)).

_**Data type:** Function_

###### fn syntax
```js
// Pattern
fn: (r, accumulator) => ({ identityKey: r.column + accumulator.identityKey })

// Example
fn: (r, accumulator) => ({ sum: r._value + accumulator.sum })
```

{{% note %}}
#### Matching output object keys and types
The output object from `fn` must have the same key names and value types as the [`identity`](#identity).
After operating on a record, the output object is given back to `fn` as the input accumulator.
If the output object keys and value types do not match the `identity` keys and value types,
it will return a type error.
{{% /note %}}

#### r
Object representing each row or record.

#### accumulator
Reducer object defined by [`identity`](#identity).

### identity
Defines the reducer object and provides initial values to use when creating a reducer.
May be used more than once in asynchronous processing use cases.
_The data type of values in the `identity` object determine the data type of output values._

_**Data type:** Object_

###### identity object syntax
```js
// Pattern
identity: {identityKey1: value1, identityKey2: value2}

// Example
identity: {sum: 0.0, count: 0.0}
```

## Important notes

#### Preserve columns
By default, `reduce()` drops any columns that:

1. Are not part of the input table's group key.
2. Are not explicitly mapped in the `reduce()` function.

This often results in the `_time` column being dropped.
To preserve the `_time` column and other columns that do not meet the criteria above,
use the `with` operator to map values in the `r` object.
The `with` operator updates a column if it already exists,
creates a new column if it doesn't exist, and includes all existing columns in
the output table.

```js
recduce(fn: (r) => ({ r with newColumn: r._value * 2 }))
```

## Examples

##### Compute the sum of the value column
```js
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) =>
        r._measurement == "cpu" and
        r._field == "usage_system" and
        r.service == "app-server"
    )
    |> range(start:-12h)
    |> reduce(
        fn: (r, accumulator) => ({
            sum: r._value + accumulator.sum
        }),
        identity: {sum: 0.0}
    )
```

##### Compute the sum and count in a single reducer
```js
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) =>
        r._measurement == "cpu" and
        r._field == "usage_system" and
        r.service == "app-server"
    )
    |> range(start:-12h)
    |> reduce(
        fn: (r, accumulator) => ({
          sum: r._value + accumulator.sum,
          count: accumulator.count + 1.0
        }),
        identity: {sum: 0.0, count: 0.0}
    )
```

##### Compute the product of all values
```js
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) =>
        r._measurement == "cpu" and
        r._field == "usage_system" and
        r.service == "app-server")
    |> range(start:-12h)
    |> reduce(
        fn: (r, accumulator) => ({
            prod: r._value * accumulator.prod
        }),
        identity: {prod: 1.0}        
    )
```

##### Calculate the average and preserve existing columns
```js
from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
  |> window(every: 5m)
  |> reduce(fn: (r, accumulator) => ({
      r with
      count: accumulator.count + 1,
      total: accumulator.total + r._value,
      avg: (accumulator.total + r._value) / float(v: accumulator.count)
    }),
    identity: {count: 1, total: 0.0, avg: 0.0}
  )
```
