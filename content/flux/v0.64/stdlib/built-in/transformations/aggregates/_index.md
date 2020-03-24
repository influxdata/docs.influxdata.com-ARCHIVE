---
title: Flux aggregate functions
description: Flux aggregate functions take values from an input table and aggregate
  them in some way.
aliases:
  - /flux/v0.64/functions/transformations/aggregates
  - /flux/v0.64/functions/built-in/transformations/aggregates/
menu:
  flux_0_64:
    parent: Transformations
    name: Aggregates
    weight: 1
---

Flux aggregate functions take values from an input table and aggregate them in some way.
The output table contains is a single row with the aggregated value.

Aggregate operations output a table for every input table they receive.
A column to aggregate must be provided to the operation.
Any output table will have the following properties:

- It always contains a single record.
- It will have the same group key as the input table.
- It will contain a column for the provided aggregate column.
  The column label will be the same as the input table.
  The type of the column depends on the specific aggregate operation.
  The value of the column will be `null` if the input table is empty or the input column has only `null` values.
- It will not have a `_time` column.

### aggregateWindow helper function
The [`aggregateWindow()` function](/flux/v0.64/stdlib/built-in/transformations/aggregates/aggregatewindow)
does most of the work needed when aggregating data.
It windows and aggregates the data, then combines windowed tables into a single output table.

### Aggregate functions
The following aggregate functions are available:

{{< function-list >}}

### Aggregate selectors
The following functions are both aggregates and selectors.
Each returns `n` values after performing an aggregate operation.
They are categorized as selector functions in this documentation:

- [highestAverage()](/flux/v0.64/stdlib/built-in/transformations/selectors/highestaverage)
- [highestCurrent()](/flux/v0.64/stdlib/built-in/transformations/selectors/highestcurrent)
- [highestMax()](/flux/v0.64/stdlib/built-in/transformations/selectors/highestmax)
- [lowestAverage()](/flux/v0.64/stdlib/built-in/transformations/selectors/lowestaverage)
- [lowestCurrent()](/flux/v0.64/stdlib/built-in/transformations/selectors/lowestcurrent)
- [lowestMin()](/flux/v0.64/stdlib/built-in/transformations/selectors/lowestmin)
