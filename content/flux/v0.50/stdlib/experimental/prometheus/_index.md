---
title: Flux Prometheus package
description: >
  The Flux Prometheus package provides functions for working with Prometheus-formatted metrics.
  Import the `experimental/prometheus` package.
menu:
  flux_0_50:
    name: Prometheus
    parent: Experimental
weight: 1
---

Flux Prometheus functions provide tools for working with
[Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).

{{% warn %}}
The Prometheus package is currently experimental and subject to change at any time.
By using this package, you accept the [risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

Import the `experimental/prometheus` package:

```js
import "experimental/prometheus"
```

{{< children type="functions" >}}
