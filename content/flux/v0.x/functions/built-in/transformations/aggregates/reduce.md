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
the group key column's value is overwritten and the resulting record is regrouped
into the appropriate table.

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
