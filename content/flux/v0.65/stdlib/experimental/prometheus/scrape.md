---
title: prometheus.scrape() function
description: >
  The `prometheus.scrape()` function retrieves Prometheus-formatted metrics
  from a specified URL.
menu:
  flux_0_65:
    name: prometheus.scrape
    parent: Prometheus
weight: 1
---

The `prometheus.scrape()` function retrieves [Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/)
from a specified URL.
The function groups metrics (including histogram and summary values) into individual tables.

_**Function type:** Input_

```js
import "experimental/prometheus"

prometheus.scrape(
  url: "http://localhost:9999/metrics"
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
