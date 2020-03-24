---
title: Flux data model
description: Flux employs a basic data model built from basic data types. The data model consists of tables, records, columns and streams.
menu:
  flux_0_64:
    name: Data model
    parent: Language reference
    weight: 1
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
> Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX`
> is an issue number tracking discussion and progress towards implementation.

Flux employs a basic data model built from basic data types.
The data model consists of tables, records, columns and streams.

## Record
A **record** is a tuple of named values and is represented using an object type.

## Column
A **column** has a label and a data type.
The available data types for a column are:

| Data type | Description                               |
| --------- |:-----------                               |
| bool      | A boolean value, true or false.           |
| uint      | An unsigned 64-bit integer.               |
| int       | A signed 64-bit integer.                  |
| float     | An IEEE-754 64-bit floating-point number. |
| string    | A sequence of unicode characters.         |
| bytes     | A sequence of byte values.                |
| time      | A nanosecond precision instant in time.   |
| duration  | A nanosecond precision duration of time.  |

## Table
A **table** is set of records with a common set of columns and a group key.

The group key is a list of columns.
A table's group key denotes which subset of the entire dataset is assigned to the table.
All records within a table will have the same values for each column that is part of the group key.
These common values are referred to as the "group key value" and can be represented as a set of key value pairs.

A tables schema consists of its group key and its columns' labels and types.


> [IMPL#463](https://github.com/influxdata/flux/issues/463) Specify the primitive types that make up stream and table types

## Stream of tables
A **stream** represents a potentially unbounded set of tables.
A stream is grouped into individual tables using their respective group keys.
Tables within a stream each have a unique group key value.


> [IMPL#463](https://github.com/influxdata/flux/issues/463) Specify the primitive types that make up stream and table types

## Missing values (null)
`null` is a predeclared identifier representing a missing or unknown value.
`null` is the only value comprising the _null type_.
Any non-boolean operator that operates on basic types returns _null_ when at least one of its operands is _null_.

Think of _null_ as an unknown value.
The following table explains how _null_ values behave in expressions:

| Expression       | Evaluates To | Because                                                                             |
| ---------------- | ------------ | ----------------------------------------------------------------------------------- |
| `null + 5`       | `null`       | Adding 5 to an unknown value is still unknown                                       |
| `null * 5`       | `null`       | Multiplying an unknown value by 5 is still unknown                                  |
| `null == 5`      | `null`       | We don't know if an unknown value is equal to 5                                     |
| `null < 5`       | `null`       | We don't know if an unknown value is less than 5                                    |
| `null == null`   | `null`       | We don't know if something unknown is equal to something else that is also unknown  |

Operating on something unknown produces something that is still unknown.
The only place where this is not the case is in boolean logic.
Because boolean types are nullable, Flux implements ternary logic as a way of handling boolean operators with _null_ operands.
By interpreting a _null_ operand as an unknown value, we have the following definitions:

- not _null_ = _null_
- _null_ or false = _null_
- _null_ or true = true
- _null_ or _null_ = _null_
- _null_ and false = false
- _null_ and true = _null_
- _null_ and _null_ = _null_

Because records are represented using object types, attempting to access a column
whose value is unknown or missing from a record will also return _null_.

{{% note %}}
[IMPL#723](https://github.com/influxdata/platform/issues/723) Design how nulls behave
According to the definitions above, it is not possible to check if an expression is _null_ using the `==` and `!=` operators.
These operators will return _null_ if any of their operands are _null_.
In order to perform such a check, Flux provides a built-in `exists` operator:

- `exists x` returns false if `x` is _null_
- `exists x` returns true if `x` is not _null_
{{% /note %}}

## Transformations
Transformations define a change to a stream.
Transformations may consume an input stream and always produce a new output stream.
The output stream group keys have a stable output order based on the input stream.
Specific ordering may change between releases, but is not considered a breaking change.

Most transformations output one table for every table they receive from the input stream.
Transformations that modify group keys or values regroup the tables in the output stream.
A transformation produces side effects when constructed from a function that produces side effects.

Transformations are represented using function types.

### Match parameter names

Some transformations (for example, `map` and `filter`) are represented using higher-order functions (functions that accept other functions).
Each argument passed into a function must match the parameter name defined for the function.

For example, `filter` accepts `fn`, which takes one argument named `r`:

 ```js
from(bucket: "db")
  |> filter(fn: (r) => ...)
```

 If a parameter is renamed from `r` to `v`, the script fails:

```js
from(bucket: "db")
  |> filter(fn: (v) => ...)
 // FAILS!: 'v' != 'r'.
```

Because Flux does not support positional arguments, parameter names matter. The transformation (in this case, `filter`) must know `r` is the parameter name to successfully invoke the function.
