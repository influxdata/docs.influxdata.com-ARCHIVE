---
title: Supported outputs

menu:
  telegraf_02:
    name: Supported outputs
    identifier: supported outputs
    weight: 0
---

## Supported outputs

Telegraf allows users to specify multiple output sinks in the configuration file.

Telegraf currently supports sending metrics to:

* [influxdb](https://github.com/influxdb/telegraf/tree/master/outputs/influxdb)
* [nsq](https://github.com/influxdb/telegraf/tree/master/outputs/nsq)
* [kafka](https://github.com/influxdb/telegraf/tree/master/outputs/kafka)
* [datadog](https://github.com/influxdb/telegraf/tree/master/outputs/datadog)
* [opentsdb](https://github.com/influxdb/telegraf/tree/master/outputs/opentsdb)
* [amqp](https://github.com/influxdb/telegraf/tree/master/outputs/amqp) (rabbitmq)
* [mqtt](https://github.com/influxdb/telegraf/tree/master/outputs/mqtt)
* [librato](https://github.com/influxdb/telegraf/tree/master/outputs/librato)
* [prometheus](https://github.com/influxdb/telegraf/tree/master/outputs/prometheus)
* [amon](https://github.com/influxdb/telegraf/tree/master/outputs/amon)
* [riemann](https://github.com/influxdb/telegraf/tree/master/outputs/riemann)

The configuration file contains sample configurations for each output.