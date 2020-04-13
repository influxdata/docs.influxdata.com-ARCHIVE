---
title: prometheus.scrape() function
description: >
  The `prometheus.scrape()` function retrieves Prometheus-formatted metrics
  from a specified URL.
menu:
  flux_0_50:
    name: prometheus.scrape
    parent: Prometheus
weight: 301
related:
  - /v2.0/write-data/scrape-data/scrapable-endpoints/
---

The `prometheus.scrape()` function retrieves [Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/)
from a specified URL.
The function groups metrics (including histogram and summary values) into individual tables.

_**Function type:** Input_

{{% warn %}}
The `prometheus.scrape()` function is currently experimental and subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental/prometheus"

prometheus.scrape(
  url: "http://localhost:8086/metrics"
)
```

## Parameters

### url
The URL to scrape Prometheus-formatted metrics from.

_**Data type:** String_

## Examples

### Scrape Prometheus metrics and write them to InfluxDB
```js
import "experimental/prometheus"

prometheus.scrape(url: "https://example-url.com/metrics")
  |> to(
    org: "example-org",
    bucket: "telegraf/autogen"
  )
```
