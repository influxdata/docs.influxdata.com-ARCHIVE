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

```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time           _field:string     _measurement:string               host:string                      le:float                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  ----------------------------  ----------------------------
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            65                             1
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          65.5                             1
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            66                             2
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          66.5                            11
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            67                            21
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          67.5                            29
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            68                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          68.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            69                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          69.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            70                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          70.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            71                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          71.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            72                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          72.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            73                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          73.5                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                            74                            30
2018-11-07T00:51:18.731928000Z  2018-11-07T00:56:18.731928000Z            used_percent                     mem               host1.local                          74.5                            30
```
