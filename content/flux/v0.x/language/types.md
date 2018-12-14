---
title: Types
description: A type defines the set of values and operations on those values. Types are never explicitly declared as part of the syntax. Types are always inferred from the usage of the value.
menu:
  flux_0_x:
    parent: Language reference
    name: Types
    weight: 110
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

A _type_ defines the set of values and operations on those values.
Types are never explicitly declared as part of the syntax.
Types are always inferred from the usage of the value.

> To be implemented: [IMPL#249](https://github.com/influxdata/platform/issues/249) Specify type inference rules.

## Boolean types

A _boolean type_ represents a truth value, corresponding to the preassigned variables `true` and `false`.
The boolean type name is `bool`.

## Numeric types

A _numeric type_ represents sets of integer or floating-point values.

The following numeric types exist:

```
uint    the set of all unsigned 64-bit integers
int     the set of all signed 64-bit integers
float   the set of all IEEE-754 64-bit floating-point numbers
```

## Time types

A _time type_ represents a single point in time with nanosecond precision.
The time type name is `time`.

## Duration types

A _duration type_ represents a length of time with nanosecond precision.
The duration type name is `duration`.

Durations can be added to times to produce a new time.

##### Examples of duration types

```js
2018-07-01T00:00:00Z + 1mo // 2018-08-01T00:00:00Z
2018-07-01T00:00:00Z + 2y  // 2020-07-01T00:00:00Z
2018-07-01T00:00:00Z + 5h  // 2018-07-01T05:00:00Z
```

## String types

A _string type_ represents a possibly empty sequence of characters.
Strings are immutable and cannot be modified once created.
The string type name is `string`.

The length of a string is its size in bytes, not the number of characters, since a single character may be multiple bytes.

## Regular expression types

A _regular expression type_ represents the set of all patterns for regular expressions.
The regular expression type name is `regexp`.

## Array types

An _array type_ represents a sequence of values of any other type.
All values in the array must be of the same type.
The length of an array is the number of elements in the array.

## Object types

An _object type_ represents a set of unordered key and value pairs.
The key must always be a string.
The value may be any other type, and need not be the same as other values within the object.

## Function types

A _function type_ represents a set of all functions with the same argument and result types.


> To be implemented: [IMPL#249](https://github.com/influxdata/platform/issues/249) Specify type inference rules.

## Generator types

A _generator type_ represents a value that produces an unknown number of other values.
The generated values may be of any other type, but must all be the same type.

To be implemented: [IMPL#658](https://github.com/influxdata/platform/query/issues/658) Implement Generators types.
