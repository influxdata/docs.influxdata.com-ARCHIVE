---
title: Telegraf plugins
description: Telegraf plugins are agents used in the InfluxData time series platform for collecting, processing, aggregating, and writing metrics from time series data on the InfluxDB time series database and other popular databases and applications.
menu:
  telegraf_1_11:
    name: Plugins
    weight: 40
---

Telegraf is an agent, written in the Go programming language, for collecting, processing, aggregating, and writing metrics. Telegraf is plugin-driven and supports four categories of plugin types, including input, output, aggregator, and processor.

## [Full Telegraf plugins list](/telegraf/v1.11/plugins/plugin-list/)
View the full list of available Telegraf plugins.

### Telegraf input plugins
The [Telegraf input plugins](/telegraf/v1.11/plugins/inputs/) collect metrics from the system, services, or third party APIs.

### Telegraf output plugins
The [Telegraf output plugins](/telegraf/v1.11/plugins/outputs/) write metrics to various destinations.

### Telegraf aggregator plugins
The [Telegraf aggregator plugins](/telegraf/v1.11/plugins/aggregators/) create aggregate metrics (for example, mean, min, max, quantiles, etc.)

### Telegraf processor plugins
The [Telegraf processor plugins](/telegraf/v1.11/plugins/processors/) transform, decorate, and filter metrics.
