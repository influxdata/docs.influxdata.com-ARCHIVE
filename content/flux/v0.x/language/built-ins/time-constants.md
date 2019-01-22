---
title: Time constants
description: >
  Flux provides built-in time constants for days of the week and months of the year.
menu:
  flux_0_x:
    name: Time constants
    parent: Built-ins
    weight: 80
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
> Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is
> an issue number tracking discussion and progress towards implementation.

## Days of the week
Days of the week are represented as integers in the range `[0-6]`.
The following builtin values are defined:

```js
Sunday    = 0
Monday    = 1
Tuesday   = 2
Wednesday = 3
Thursday  = 4
Friday    = 5
Saturday  = 6
```

> To be implemented: [IMPL#153](https://github.com/influxdata/flux/issues/153) Add Days of the Week constants

## Months of the year
Months are represented as integers in the range `[1-12]`.
The following builtin values are defined:
```js
January   = 1
February  = 2
March     = 3
April     = 4
May       = 5
June      = 6
July      = 7
August    = 8
September = 9
October   = 10
November  = 11
December  = 12
```

> To be implemented: IMPL#154](https://github.com/influxdata/flux/issues/154) Add Months of the Year constants
