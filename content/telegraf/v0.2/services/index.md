---
title: Supported Service Plugins

menu:
  telegraf_02:
    name: Service Plugins
    identifier: services
    weight: 30
---

Telegraf is entirely plugin driven. It gathers all metrics from the plugins specified in the configuration file.

## Usage Instructions

View usage instructions for each service plugin by running `telegraf -usage <servicepluginname>`.

## Supported Service Plugin List

* [statsd](https://github.com/influxdb/telegraf/tree/master/plugins/statsd)
* [kafka_consumer](https://github.com/influxdb/telegraf/tree/master/plugins/kafka_consumer)
