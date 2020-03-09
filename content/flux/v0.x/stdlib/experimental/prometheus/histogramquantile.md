---
title: prometheus.histogramQuantile() function
description: >
  The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
  assuming the given histogram data is scraped or read from a Prometheus data source.
menu:
  flux_0_x:
    name: prometheus.histogramQuantile
    parent: Prometheus
weight: 301
---

The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
assuming the given histogram data is scraped or read from a Prometheus data source.

_**Function type:** Aggregate_

{{% warn %}}
The `prometheus.histogramQuantile()` function is currently experimental and subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.x/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental/prometheus"

prometheus.histogramQuantile(
  quantile: 0.99
)
```

## Parameters

### quantile
A value between 0.0 and 1.0 indicating the desired quantile.

_**Data type:** Float_

## Examples

### Calculate the 99th quantile in Prometheus data
```js
import "experimental/prometheus"

prometheus.scrape(url: "https://example-url.com/metrics")
  |> prometheus.histogramQuantile(quantile: 0.99)
```
