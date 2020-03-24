---
title: Flux Query package
list_title: Query package
description: >
  The Flux Query package provides functions meant to simplify common InfluxDB queries.
  Import the `experimental/query` package.
menu:
  flux_0_64:
    name: Query
    parent: Experimental
weight: 1
---

Flux Query functions provide functions meant to simplify common InfluxDB queries.
Import the `experimental/query` package:

```js
import "experimental/query"
```

{{< function-list >}}

## inBucket()
The primary function in this package is [`query.inBucket()`](/flux/v0.64/stdlib/experimental/query/inbucket/),
which uses all other functions in this package.

```js
import "experimental/query"

query.inBucket(
  bucket: "telegraf/autogen",
  start: -1h,
  stop: now(),
  measurement: "mem",
  fields: ["used_percent", "available_percent"],
  predicate: (r) => r.tagA == "foo" and r.tagB != "bar"
)
```
