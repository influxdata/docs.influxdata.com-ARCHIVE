---
title: Flux aggregate functions
description: Flux aggregate functions take values from an input table and aggregate them in some way.
menu:
  flux_0_x:
    parent: Transformations
    name: Aggregates
    weight: 1
---

Flux aggregate functions take values from an input table and aggregate them in some way.
The output table contains is a single row with the aggregated value.

### aggregateWindow helper function
The [`aggregateWindow()` function](/flux/v0.x/functions/transformations/aggregates/aggregatewindow)
does most of the work needed when aggregating data.
It windows and aggregates the data, then combines windowed tables into a single output table.

### Aggregate functions
The following aggregate functions are available:

{{< function-list category="Aggregates" menu="flux_0_x" >}}
