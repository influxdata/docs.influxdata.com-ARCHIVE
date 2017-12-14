---
title: Input plugins

menu:
  telegraf_1_5:
    name: Input plugins
    identifier: inputs
    weight: 30
---
# Service plugins supported for Telegraf 1.5

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Usage instructions

View usage instructions for each service input by running `telegraf --usage <service-input-name>`.


## Supported service plugins

### [HTTP Listener (http_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_listener)

The HTTP Listener service input plugin listens for messages sent via HTTP POST. Messages are expected in the InfluxDB line protocol format ONLY (other Telegraf input data formats are not supported). The plugin allows Telegraf to serve as a proxy/router for the `/write` endpoint of the InfluxDB HTTP API.

### [Kafka Consumer (kafka_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kafka_consumer)

The [Kafka](http://kafka.apache.org) Consumer plugin polls a specified Kafka topic and adds messages to InfluxDB. Messages are expected in the line protocol format. [Consumer Group](http://godoc.org/github.com/wvanbergen/kafka/consumergroup) is used to talk to the Kafka cluster so multiple instances of Telegraf can read from the same topic in parallel.

### [Logparser (logparser)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/logparser)

The Logparser plugin streams and parses the given logfiles. Currently, it has the capability of parsing "grok" patterns from logfiles, which also supports regex patterns.

### [MQTT Consumer (mqtt_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mqtt_consumer)

The MQTT Consumer plugin reads from specified MQTT topics and adds messages to InfluxDB. Messages are in the Telegraf Input Data Formats.

### [NATS Consumer (nats_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nats_consumer)

The NATS Consumer plugin reads from specified NATS subjects and adds messages to InfluxDB. Messages are expected in the Telegraf Input Data Formats. A Queue Group is used when subscribing to subjects so multiple instances of Telegraf can read from a NATS cluster in parallel.

### [NSQ Consumer (nsq_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq_consumer)

The NSQ Consumer plugin polls a specified NSQD topic and adds messages to InfluxDB. This plugin allows a message to be in any of the supported data_format types.

### [StatsD (statsd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/statsd)

The StatsD plugin is a special type of plugin which runs a backgrounded statsd listener service while Telegraf is running. StatsD messages are formatted as described in the original [etsy statsd](https://github.com/etsy/statsd/blob/master/docs/metric_types.md) implementation.

### [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/socket_listener)

The Socket Listener is a service input plugin that listens for messages from streaming (tcp, unix) or datagram (udp, unixgram) protocols. Messages are expected in the [Telegraf Input Data Formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md).

### [Tail (tail)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tail)

The Tail plugin "tails" a logfile and parses each log message.

### [Webhooks (webhooks)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks)

The Webhooks service plugin start an HTTPS server and registers multiple webhook listeners.

## Deprecated service plugins

### [TCP Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tcp_listener)

DEPRECATED: As of version 1.3 the TCP listener plugin has been deprecated in favor of the Socket Listener plugin.


### [UDP Listener (udp_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/udp_listener)

DEPRECATED: As of version 1.3 the UDP listener plugin has been deprecated in favor of the Socket Listener plugin.
