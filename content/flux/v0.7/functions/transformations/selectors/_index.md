---
title: Flux selector functions
description: Flux selector functions return one or more records based on function logic.
menu:
  flux_0_7:
    parent: Transformations
    name: Selectors
    weight: 1
---

Flux selector functions return one or more records based on function logic.
The output table is different than the input table, but individual row values are not.

The following selector functions are available:

- [bottom](/flux/v0.7/functions/transformations/selectors/bottom)
- [distinct](/flux/v0.7/functions/transformations/selectors/distinct)
- [first](/flux/v0.7/functions/transformations/selectors/first)
- [last](/flux/v0.7/functions/transformations/selectors/last)
- [max](/flux/v0.7/functions/transformations/selectors/max)
- [min](/flux/v0.7/functions/transformations/selectors/min)
- [sample](/flux/v0.7/functions/transformations/selectors/sample)
- [top](/flux/v0.7/functions/transformations/selectors/top)
- [unique](/flux/v0.7/functions/transformations/selectors/unique)


### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as aggregate functions in this documentation:

- [median](../aggregates/median)
- [percentile](../aggregates/percentile)
