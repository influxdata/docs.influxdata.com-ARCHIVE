---
title: Telegraf output plugins

menu:
  telegraf_1_5:
    name: Output
    identifier: outputs
    weight: 20
    parent: plugins
---

Telegraf allows users to specify multiple output sinks in the configuration file.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.5`.
>The [Release Notes/Changelog](/telegraf/v1.5/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.

## Supported output plugins

### [Amon (amon_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/amon)

The [Amon (amon_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/amon) writes to [Amon](https://www.amon.cx) and requires a serverkey and amoninstance URL which can be obtained [here](https://www.amon.cx/docs/monitoring/) for the account.

If the point value being sent cannot be converted to a float64, the metric is skipped.

Metrics are grouped by converting any `_` characters to `.` in the Point Name.

### [AMQP (amqp_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/amqp)

The [AMQP (amqp_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/amqp) writes to a AMQP 0-9-1 Exchange, a prominent implementation of this protocol being [RabbitMQ](https://www.rabbitmq.com/).

Metrics are written to a topic exchange using `tag`, defined in configuration file as `RoutingTag`, as a routing key.

### [CloudWatch (cloudwatch_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/cloudwatch)

The [CloudWatch (cloudwatch_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/cloudwatch) send metrics to Amazon CloudWatch.

### [CrateDB (cratedb)](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/cratedb) -- NEW in v1.5

The [CrateDB (cratedb) output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/cratedb) writes to [CrateDB](https://crate.io/) using its [PostgreSQL protocol](https://crate.io/docs/crate/reference/protocols/postgres.html).

### [Datadog (datadog_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/datadog)

The [Datadog (datadog_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/datadog) writes to the [Datadog Metrics API](http://docs.datadoghq.com/api/#metrics) and requires an `apikey` which can be obtained [here](https://app.datadoghq.com/account/settings#api) for the account.

### [Discard (discard)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/discard)

The [Discard (discard) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/discard) simply drops all metrics that are sent to it. It is only meant to be used for testing purposes.

### [Elasticsearch (elasticsearch_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/elasticsearch)

The [Elasticsearch (elasticsearch_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/elasticsearch) writes to Elasticsearch via HTTP using [Elastic](http://olivere.github.io/elastic/). Currently it only supports Elasticsearch 5.x series.

### [File (file)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/file)

The [File (file) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/file) writes Telegraf metrics to files.

### [Graphite (graphite_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/graphite)

The [Graphite (graphite_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/graphite) writes to [Graphite](http://graphite.readthedocs.org/en/latest/index.html) via raw TCP.

### [Graylog (graylog_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/graylog)

The  [Graylog (graylog_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/graylog) writes to a Graylog instance using the `gelf` format.

### [InfluxDB (influxdb_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/influxdb)

The [InfluxDB (influxdb_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/influxdb) writes to InfluxDB using HTTP or UDP.

### [Instrumental (instrumental_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/instrumental)

The [Instrumental (instrumental_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/instrumental) writes to the [Instrumental Collector API](https://instrumentalapp.com/docs/tcp-collector) and requires a Project-specific API token.

Instrumental accepts stats in a format very close to Graphite, with the only difference being that the type of stat (gauge, increment) is the first token, separated from the metric itself by whitespace. The increment type is only used if the metric comes in as a counter through [[input.statsd]].

### [Kafka (kafka_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/kafka)

The [Kafka (kafka_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/kafka) writes to a [Kafka Broker](http://kafka.apache.org/07/quickstart.html) acting a Kafka Producer.

### [Kinesis (kinesis_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/kinesis)

The [Kinesis (kinesis_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/kinesis) is an experimental plugin that is still in the early stages of development. It will batch up all of the Points in one Put request to Kinesis. This should save the number of API requests by a considerable level.

### [Librato (librato_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/librato)

The [Librato (librato_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/librato) writes to the [Librato Metrics API](http://dev.librato.com/v1/metrics#metrics) and requires an `api_user` and `api_token` which can be obtained [here](https://metrics.librato.com/account/api_tokens) for the account.

### [MQTT (mqtt_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/mqtt)

The [MQTT (mqtt_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/mqtt) writes to the MQTT server using [supported output data formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md).

### [NATS Output (nats_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/nats)

The [NATS Output (nats_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/nats) writes to a (list of) specified NATS instance(s).

### [NSQ (nsq_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/nsq)

The [NSQ (nsq_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/nsq) writes to a specified NSQD instance, usually local to the producer. It requires a server name and a topic name.

### [OpenTSDB (opentsdb_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/opentsdb)

The [OpenTSDB (opentsdb_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/opentsdb) writes to an OpenTSDB instance using either the telnet or HTTP mode.

Using the HTTP API is the recommended way of writing metrics since OpenTSDB 2.0 To use HTTP mode, set `useHttp` to true in config. You can also control how many metrics are sent in each HTTP request by setting `batchSize` in config. See http://opentsdb.net/docs/build/html/api_http/put.html for details.

### [Prometheus Client (prometheus_client_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/prometheus_client)

The [Prometheus Client (prometheus_client_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/prometheus_client) starts a [Prometheus](https://prometheus.io/) Client, it exposes all metrics on `/metrics` (default) to be polled by a Prometheus server.

### [Riemann (riemann_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/riemann)

The [Riemann (riemann_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/riemann) writes to [Riemann](http://riemann.io/) using TCP or UDP.

### [Riemann Legacy (riemann_legacy_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/riemann_legacy)

The [Riemann Legacy (riemann_legacy_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/riemann_legacy) will be deprecated in a future release, see https://github.com/influxdata/telegraf/issues/1878 for more details & discussion.

### [Socket Writer (socket_writer_output)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/socket_writer)

The [Socket Writer (socket_writer_output) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/socket_writer) writes to a UDP, TCP, or UNIX socket. It can output data in any of the [supported output formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md).

### [Wavefront (wavefront)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/wavefront/README.md) -- NEW in v1.5

The [Wavefront (wavefront) output plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/wavefront/README.md) writes to a Wavefront proxy, in Wavefront data format over TCP.
