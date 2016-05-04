---
title: Telegraf Version 0.10 Documentation

menu:
  telegraf:
    name: v0.10
    identifier: telegraf_010
    weight: 30
---

Telegraf is a plugin-driven server agent for collecting & reporting metrics. Telegraf has plugins to source a variety of metrics directly from the system it's running on, pull metrics from third party APIs, or even listen for metrics via a statsd and Kafka consumer services. It also has output plugins to send metrics to a variety of other datastores, services, and message queues, including InfluxDB, Graphite, OpenTSDB, Datadog, Librato, Kafka, MQTT, NSQ, and many others.

## Key Features

Here are some of the features that Telegraf currently supports and make it a great choice for metrics collection.

* Written entirely in Go.
It compiles into a single binary with no external dependencies.
* Minimal memory footprint.
* Plugin system allows new inputs and outputs to be easily added.
* A wide number of plugins for many popular services already exist for well known services and APIs.
