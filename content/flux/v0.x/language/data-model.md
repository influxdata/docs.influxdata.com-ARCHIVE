---
title: Flux data model
description: Flux employs a basic data model built from basic data types. The data model consists of tables, records, columns and streams.
menu:
  flux_0_x:
    name: Data model
    parent: Language
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

## Missing values
A record may be missing a value for a specific column.
Missing values are represented with a special `null` value.
The `null` value can be of any data type.

>[IMPL#723](https://github.com/influxdata/platform/issues/723) Design how nulls behave

## Transformations
Transformations define a change to a stream.
Transformations may consume an input stream and always produce a new output stream.
The output stream group keys have a stable output order based on the input stream.
Specific ordering may change between releases, but is not considered a breaking change.

Most transformations output one table for every table they receive from the input stream.
Transformations that modify group keys or values regroup the tables in the output stream.
A transformation produces side effects when constructed from a function that produces side effects.

Transformations are represented using function types.
