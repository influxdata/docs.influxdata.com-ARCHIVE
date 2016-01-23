---
title: Supported Service Inputs

menu:
  telegraf_010:
    name: Service Inputs
    identifier: services
    weight: 30
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Usage Instructions

View usage instructions for each service input by running `telegraf -usage <service-input-name>`.

## Supported Service Plugin List

* [StatsD](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd)
* [Kafka Consumer](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kafka_consumer)
