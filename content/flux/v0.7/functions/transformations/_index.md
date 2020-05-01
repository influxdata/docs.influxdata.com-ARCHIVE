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

{{< children type="functions" >}}
