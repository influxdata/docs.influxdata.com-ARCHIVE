---
title: Telegraf output plugins
descriptions: Use Telegraf output plugins to transform, decorate, and filter metrics. Supported output plugins include Datadog, Elasticsearch, Graphite, InfluxDB, Kafka, MQTT, Prometheus Client, Riemann, and Wavefront.
menu:
  telegraf_1_10:
    name: Output
    weight: 20
    parent: Plugins
---
Telegraf allows users to specify multiple output sinks in the configuration file.

## Supported Telegraf output plugins

### Amazon CloudWatch

Plugin ID: `cloudwatch`

The [Amazon CloudWatch output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/cloudwatch/README.md) send metrics to Amazon CloudWatch.

### Amazon Kinesis

Plugin ID: `kinesis`

The [Amazon Kinesis output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/kinesis/README.md) is an experimental plugin that is still in the early stages of development. It will batch up all of the points into one `PUT` request to Kinesis. This should save the number of API requests by a considerable level.

### Amon

Plugin ID: `amon`

The [Amon output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/amon/README.md) writes metrics to an [Amon server](https://github.com/amonapp/amon). For details on the Amon Agent, see [Monitoring Agent](https://docs.amon.cx/agent/) and requires a `apikey` and `amoninstance` URL.

If the point value being sent cannot be converted to a float64 value, the metric is skipped.

Metrics are grouped by converting any `_` characters to `.` in the Point Name.

### AMQP  

Plugin ID: `amqp`

The [AMQP output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/amqp/README.md) writes to an AMQP 0-9-1 exchange, a prominent implementation of the Advanced Message Queuing Protocol (AMQP) protocol being [RabbitMQ](https://www.rabbitmq.com/).

Metrics are written to a topic exchange using `tag`, defined in configuration file as `RoutingTag`, as a routing key.

### Apache Kafka

Plugin ID: `kafka`

The [Apache Kafka output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/kafka/README.md) writes to a [Kafka Broker](http://kafka.apache.org/07/quickstart.html) acting a Kafka Producer.

### CrateDB

Plugin ID: `cratedb`

The [CrateDB output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/cratedb/README.md) writes to [CrateDB](https://crate.io/), a real-time SQL database for machine data and IoT, using its [PostgreSQL protocol](https://crate.io/docs/crate/reference/protocols/postgres.html).

### Datadog

Plugin ID: `datadog`

The [Datadog output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/datadog/README.md) writes to the [Datadog Metrics API](http://docs.datadoghq.com/api/#metrics) and requires an `apikey` which can be obtained [here](https://app.datadoghq.com/account/settings#api) for the account.

### Discard

Plugin ID: `discard`

The [Discard output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/discard/README.md) simply drops all metrics that are sent to it. It is only meant to be used for testing purposes.

### Elasticsearch

Plugin ID: `elasticsearch`

The [Elasticsearch output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/elasticsearch/README.md) writes to Elasticsearch via HTTP using [Elastic](http://olivere.github.io/elastic/). Currently it only supports Elasticsearch 5.x series.

### File

Plugin ID: `file`

The [File output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/file/README.md) writes Telegraf metrics to files.

### Google Cloud PubSub

Plugin ID: `cloud_pubsub`

The [Google PubSub output plugin]() publishes metrics to a [Google Cloud PubSub](https://cloud.google.com/pubsub) topic
as one of the supported [output data formats](/telegraf/data_formats/output).

### Graphite

Plugin ID: `graphite`

The [Graphite output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/graphite/README.md) writes to [Graphite](http://graphite.readthedocs.org/en/latest/index.html) via raw TCP.

### Graylog

Plugin ID: `graylog`

The  [Graylog output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/graylog/README.md) writes to a Graylog instance using the `gelf` format.

### HTTP

Plugin ID: `http`

The [HTTP output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/http/README.md) sends metrics in a HTTP message encoded using one of the output data formats. For `data_formats` that support batching, metrics are sent in batch format.

### InfluxDB v1.x

Plugin ID: `influxdb`

The [InfluxDB v1.x output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/influxdb/README.md) writes to InfluxDB using HTTP or UDP.

### InfluxDB v2

Plugin ID: `influxdb_v2`

The [InfluxDB v2 output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/influxdb_v2/README.md) writes metrics to the [InfluxDB 2.0](https://github.com/influxdata/platform) HTTP service.

### Instrumental

Plugin ID: `instrumental`

The [Instrumental output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/instrumental/README.md) writes to the [Instrumental Collector API](https://instrumentalapp.com/docs/tcp-collector) and requires a Project-specific API token.

Instrumental accepts stats in a format very close to Graphite, with the only difference being that the type of stat (gauge, increment) is the first token, separated from the metric itself by whitespace. The increment type is only used if the metric comes in as a counter through [[input.statsd]].

### Librato

Plugin ID: `librato`

The [Librato output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/librato/README.md) writes to the [Librato Metrics API](http://dev.librato.com/v1/metrics#metrics) and requires an `api_user` and `api_token` which can be obtained [here](https://metrics.librato.com/account/api_tokens) for the account.

### Microsoft Azure Application Insights

Plugin ID: `application_insights`

The [Microsoft Azure Application Insights output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/application_insights/README.md) writes Telegraf metrics to [Application Insights (Microsoft Azure)](https://azure.microsoft.com/en-us/services/application-insights/).

### Microsoft Azure Monitor

Plugin ID: `azure_monitor`

>**Note:** The Azure Monitor custom metrics service is currently in preview and not available in a subset of Azure regions.

The [Microsoft Azure Monitor output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/azure_monitor/README.md) sends custom metrics to [Microsoft Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/). Azure Monitor has a metric resolution of one minute. To handle this in Telegraf, the Azure Monitor output plugin automatically aggregates metrics into one minute buckets, which are then sent to Azure Monitor on every flush interval.

For a Microsoft blog posting on using Telegraf with Microsoft Azure Monitor, see [Collect custom metrics for a Linux VM with the InfluxData Telegraf Agent](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/metrics-store-custom-linux-telegraf).

The metrics from each input plugin will be written to a separate Azure Monitor namespace, prefixed with `Telegraf/` by default. The field name for each metric is written as the Azure Monitor metric name. All field values are written as a summarized set that includes `min`, `max`, `sum`, and `count`. Tags are written as a dimension on each Azure Monitor metric.

### MQTT Producer  

Plugin ID: `mqtt`

The [MQTT Producer output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/mqtt/README.md) writes to the MQTT server using [supported output data formats](/telegraf/v1.8/data_formats/output/).

### NATS Output

Plugin ID: `nats`

The [NATS Output output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/nats/README.md) writes to a (list of) specified NATS instance(s).

### NSQ

Plugin ID: `nsq`

The [NSQ output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/nsq/README.md) writes to a specified NSQD instance, usually local to the producer. It requires a server name and a topic name.

### OpenTSDB

Plugin ID: `opentsdb`

The [OpenTSDB output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/opentsdb/README.md) writes to an OpenTSDB instance using either the telnet or HTTP mode.

Using the HTTP API is the recommended way of writing metrics since OpenTSDB 2.0 To use HTTP mode, set `useHttp` to true in config. You can also control how many metrics are sent in each HTTP request by setting `batchSize` in config. See http://opentsdb.net/docs/build/html/api_http/put.html for details.

### Prometheus Client

Plugin ID: `prometheus_client`

The [Prometheus Client output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/prometheus_client/README.md) starts a [Prometheus](https://prometheus.io/) Client, it exposes all metrics on `/metrics` (default) to be polled by a Prometheus server.

### Riemann

Plugin ID: `riemann`

The [Riemann output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/riemann/README.md) writes to [Riemann](http://riemann.io/) using TCP or UDP.

### Socket Writer

Plugin ID: `socket_writer`

The [Socket Writer output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/socket_writer/README.md) writes to a UDP, TCP, or UNIX socket. It can output data in any of the [supported output formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md).

### Stackdriver

Plugin ID: `stackdriver`

The [Stackdriver output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/stackdriver/README.md) writes to the [Google Cloud Stackdriver API](https://cloud.google.com/monitoring/api/v3/)
and requires [Google Cloud authentication](https://cloud.google.com/docs/authentication/getting-started) with Google Cloud using either a service account or user credentials. For details on pricing, see the [Stackdriver documentation](https://cloud.google.com/stackdriver/pricing).

Requires `project` to specify where Stackdriver metrics will be delivered to.

Metrics are grouped by the `namespace` variable and metric key, for example `custom.googleapis.com/telegraf/system/load5`.

### Wavefront

Plugin ID: `wavefront`

The [Wavefront output plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/wavefront/README.md) writes to a Wavefront proxy, in Wavefront data format over TCP.

## Deprecated Telegraf output plugins

### Riemann Legacy

Plugin ID: `riemann_legacy`

The [Riemann Legacy output plugin](https://github.com/influxdata/telegraf/tree/release-1.10/plugins/outputs/riemann_legacy) will be deprecated in a future release, see https://github.com/influxdata/telegraf/issues/1878 for more details & discussion.
