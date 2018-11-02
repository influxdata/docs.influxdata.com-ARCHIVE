---
title: Flux aggregate functions
description: placeholder
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

- [aggregateWindow](./aggregatewindow)

### Aggregate functions
The following aggregate functions are available:

- [count](./count)
- [cov](./cov)
- [covariance](./covariance)
- [derivative](./derivative)
- [difference](./difference)
- [histogramQuantile](./histogramquantile)
- [increase](./increase)
- [integral](./integral)
- [mean](./mean)
- [median](./median)
- [pearsonr](./pearsonr)
- [percentile](./percentile)
- [skew](./skew)
- [spread](./spread)
- [stddev](./stddev)
- [sum](./sum)
