---
title: Flux transformation functions
description: placeholder
menu:
  flux_0_7:
    parent: Functions
    name: Transformations
    weight: 3
---

Flux transformation functions transform or shape your data in specific ways.
There are different types of transformations categorized below:

## [Aggregates](./aggregates)
Aggregate functions take values from an input table and aggregate them in some way.
The output table contains is a single row with the aggregated value.

## [Selectors](./selectors)
Selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

## [Type conversions](./type-conversions)
Type conversion functions convert the `_value` column of the input table into a specific data type.

## Generic transformations
- [cumulativeSum](./cumulativesum)
- [drop](./drop)
- [duplicate](./duplicate)
- [filter](./filter)
- [group](./group)
- [histogram](./histogram)
- [join](./join)
- [keep](./keep)
- [keys](./keys)
- [keyValues](./keyvalues)
- [limit](./limit)
- [map](./map)
- [pivot](./pivot)
- [range](./range)
- [rename](./rename)
- [set](./set)
- [shift](./shift)
- [sort](./sort)
- [stateCount](./statecount)
- [stateDuration](./stateduration)
- [union](./union)
- [window](./window)
