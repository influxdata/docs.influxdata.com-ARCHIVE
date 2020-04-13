---
title: Flux selector functions
description: Flux selector functions return one or more records based on function
  logic.
aliases:
  - /flux/v0.65/functions/transformations/selectors
  - /flux/v0.65/functions/built-in/transformations/selectors/
menu:
  flux_0_65:
    parent: Transformations
    name: Selectors
    weight: 1
---

Flux selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

{{< function-list >}}


### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as aggregate functions in this documentation:

- [median()](/flux/v0.65/stdlib/built-in/transformations/aggregates/median)
- [quantile()](/flux/v0.65/stdlib/built-in/transformations/aggregates/quantile)
