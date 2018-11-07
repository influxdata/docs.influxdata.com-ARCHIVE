---
title: How to create histograms with Flux
description: This guide walks through using the histogram() function to create histograms with Flux.
menu:
  flux_0_7:
    name: Create histograms
    parent: Guides
    weight: 7
---


- Intro to the histogram function

## histgram() function
The [`histogram()` function](/flux/v0.7/functions/transformations/histogram)

## Helper functions

### linearBuckets()

### logarithmicBuckets()

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r._field == "used_percent" AND
  )
  |> histogram(buckets: linearBuckets(start:65.5, width: 0.5, count: 20, infinity:false))
```
