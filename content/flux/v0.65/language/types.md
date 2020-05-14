---
title: Types
description: A type defines the set of values and operations on those values. Types are never explicitly declared as part of the syntax. Types are always inferred from the usage of the value.
menu:
  flux_0_65:
    parent: Language reference
    name: Types
    weight: 110
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

A _type_ defines the set of values and operations on those values.
Types are never explicitly declared as part of the syntax.
Types are always inferred from the usage of the value.

## Union types
A union type defines a set of types.
In the examples below, a union type is specified as follows:

```js
T = t1 | t2 | ... | tn
```

where `t1`, `t2`, ..., and `tn` are types.

In the example above a value of type `T` is either of type `t1`, type `t2`, ..., or type `tn`.

## Basic types
All Flux data types are constructed from the following types:

### Null types
The **null type** represents a missing or unknown value.
The **null type** name is `null`.
There is only one value that comprises the _null type_ and that is the _null_ value.
A type `t` is nullable if it can be expressed as follows:

```js
t = {s} | null
```

where `{s}` defines a set of values.

### Boolean types
A _boolean type_ represents a truth value, corresponding to the preassigned variables `true` and `false`.
The boolean type name is `bool`.
The boolean type is nullable and can be formally specified as follows:

```js
bool = {true, false} | null
```

### Numeric types
A _numeric type_ represents sets of integer or floating-point values.

The following numeric types exist:

```
uint    the set of all unsigned 64-bit integers | null
int     the set of all signed 64-bit integers | null
float   the set of all IEEE-754 64-bit floating-point numbers | null
```

{{% note %}}
All numeric types are nullable.
{{% /note %}}

### Time types
A _time type_ represents a single point in time with nanosecond precision.
The time type name is `time`.
The time type is nullable.

#### Timestamp format
Flux supports [RFC3639](https://tools.ietf.org/html/rfc3639#section-5.6) timestamps:

- `YYYY-MM-DD`
- `YYYY-MM-DDT00:00:00Z`
- `YYYY-MM-DDT00:00:00.000Z`

### Duration types
A _duration type_ represents a length of time with nanosecond precision.
The duration type name is `duration`.
The duration type is nullable.

Durations can be added to times to produce a new time.

##### Examples of duration types
```js
1ns // 1 nanosecond
1us // 1 microsecond
1ms // 1 millisecond
1s  // 1 second
1m  // 1 minute
1h  // 1 hour
1d  // 1 day
1w  // 1 week
1mo // 1 calendar month
1y  // 1 calendar year
3d12h4m25s // 3 days, 12 hours, 4 minutes, and 25 seconds
```

### String types
A _string type_ represents a possibly empty sequence of characters.
Strings are immutable and cannot be modified once created.
The string type name is `string`.
The string type is nullable.

{{% note %}}
An empty string is **not** a _null_ value.
{{% /note %}}

The length of a string is its size in bytes, not the number of characters, since a single character may be multiple bytes.

## Regular expression types
A _regular expression type_ represents the set of all patterns for regular expressions.
The regular expression type name is `regexp`.
The regular expression type is **not** nullable.

## Composite types
These are types constructed from basic types.
Composite types are not nullable.

### Array types
An _array type_ represents a sequence of values of any other type.
All values in the array must be of the same type.
The length of an array is the number of elements in the array.

### Object types
An _object type_ represents a set of unordered key and value pairs.
The key must always be a string.
The value may be any other type, and need not be the same as other values within the object.

### Function types
A _function type_ represents a set of all functions with the same argument and result types.

> [IMPL#249](https://github.com/influxdata/platform/issues/249) Specify type inference rules.

### Generator types
A _generator type_ represents a value that produces an unknown number of other values.
The generated values may be of any other type, but must all be the same type.

[IMPL#658](https://github.com/influxdata/platform/query/issues/658) Implement Generators types.
