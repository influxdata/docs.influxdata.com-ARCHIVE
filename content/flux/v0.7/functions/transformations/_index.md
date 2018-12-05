---
title: Flux transformation functions
description: Flux transformation functions transform and shape your data in specific ways.
menu:
  flux_0_7:
    parent: Functions
    name: Transformations
    weight: 3
---

Flux transformation functions transform or shape your data in specific ways.
There are different types of transformations categorized below:

## [Aggregates](/flux/v0.7/functions/transformations/aggregates)
Aggregate functions take values from an input table and aggregate them in some way.
The output table contains is a single row with the aggregated value.

## [Selectors](/flux/v0.7/functions/transformations/selectors)
Selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

## [Type conversions](/flux/v0.7/functions/transformations/type-conversions)
Type conversion functions convert the `_value` column of the input table into a specific data type.

## Generic transformations
- [cumulativeSum](/flux/v0.7/functions/transformations/cumulativesum)
- [drop](/flux/v0.7/functions/transformations/drop)
- [duplicate](/flux/v0.7/functions/transformations/duplicate)
- [filter](/flux/v0.7/functions/transformations/filter)
- [group](/flux/v0.7/functions/transformations/group)
- [histogram](/flux/v0.7/functions/transformations/histogram)
- [join](/flux/v0.7/functions/transformations/join)
- [keep](/flux/v0.7/functions/transformations/keep)
- [keys](/flux/v0.7/functions/transformations/keys)
- [keyValues](/flux/v0.7/functions/transformations/keyvalues)
- [limit](/flux/v0.7/functions/transformations/limit)
- [map](/flux/v0.7/functions/transformations/map)
- [pivot](/flux/v0.7/functions/transformations/pivot)
- [range](/flux/v0.7/functions/transformations/range)
- [rename](/flux/v0.7/functions/transformations/rename)
- [set](/flux/v0.7/functions/transformations/set)
- [shift](/flux/v0.7/functions/transformations/shift)
- [sort](/flux/v0.7/functions/transformations/sort)
- [stateCount](/flux/v0.7/functions/transformations/statecount)
- [stateDuration](/flux/v0.7/functions/transformations/stateduration)
- [union](/flux/v0.7/functions/transformations/union)
- [window](/flux/v0.7/functions/transformations/window)
