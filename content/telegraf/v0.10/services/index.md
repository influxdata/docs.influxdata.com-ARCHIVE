---
title: Supported Service Inputs

menu:
  telegraf_10:
    name: Service Inputs
    identifier: services
    weight: 30
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Usage Instructions

View usage instructions for each service input by running `telegraf -usage <service-input-name>`.

## Supported Service Plugin List

* [statsd](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/statsd)
* [kafka_consumer](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/kafka_consumer)
