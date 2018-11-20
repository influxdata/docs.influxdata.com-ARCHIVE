---
title: Flux aggregate functions
description: Flux aggregate functions take values from an input table and aggregate them in some way.
menu:
  flux_0_7:
    parent: Transformations
    name: Aggregates
    weight: 1
---

Flux aggregate functions take values from an input table and aggregate them in some way.
The output table contains is a single row with the aggregated value.

### aggregateWindow helper function
The `aggregateWindow()` function does most of the work needed when aggregating data.
It windows and aggregates the data, then combines windowed tables into a single output table.

- [aggregateWindow](/flux/v0.7/functions/transformations/aggregates/aggregatewindow)

### Aggregate functions
The following aggregate functions are available:

- [count](/flux/v0.7/functions/transformations/aggregates/count)
- [cov](/flux/v0.7/functions/transformations/aggregates/cov)
- [covariance](/flux/v0.7/functions/transformations/aggregates/covariance)
- [derivative](/flux/v0.7/functions/transformations/aggregates/derivative)
- [difference](/flux/v0.7/functions/transformations/aggregates/difference)
- [histogramQuantile](/flux/v0.7/functions/transformations/aggregates/histogramquantile)
- [increase](/flux/v0.7/functions/transformations/aggregates/increase)
- [integral](/flux/v0.7/functions/transformations/aggregates/integral)
- [mean](/flux/v0.7/functions/transformations/aggregates/mean)
- [median](/flux/v0.7/functions/transformations/aggregates/median)
- [pearsonr](/flux/v0.7/functions/transformations/aggregates/pearsonr)
- [percentile](/flux/v0.7/functions/transformations/aggregates/percentile)
- [skew](/flux/v0.7/functions/transformations/aggregates/skew)
- [spread](/flux/v0.7/functions/transformations/aggregates/spread)
- [stddev](/flux/v0.7/functions/transformations/aggregates/stddev)
- [sum](/flux/v0.7/functions/transformations/aggregates/sum)
