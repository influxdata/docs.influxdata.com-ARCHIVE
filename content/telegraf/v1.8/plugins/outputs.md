---
title: Telegraf output plugins
descriptions: Use Telegraf output plugins to transform, decorate, and filter metrics. Supported output plugins include Datadog, Elasticsearch, Graphite, InfluxDB, Kafka, MQTT, Prometheus Client, Riemann, and Wavefront.
menu:
  telegraf_1_8:
    name: Output
    weight: 20
    parent: Plugins
---

Telegraf allows users to specify multiple output sinks in the configuration file.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.8`.
>The [Release notes and changelog](/telegraf/v1.8/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.

## Supported Telegraf output plugins

### [Amazon CloudWatch (`cloudwatch`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/cloudwatch/README.md)

The [Amazon CloudWatch (`cloudwatch`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/cloudwatch/README.md) send metrics to Amazon CloudWatch.

### [Amazon Kinesis (`kinesis`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/kinesis/README.md)

The [Amazon Kinesis (`kinesis`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/kinesis/README.md) is an experimental plugin that is still in the early stages of development. It will batch up all of the Points in one Put request to Kinesis. This should save the number of API requests by a considerable level.

### [Amon (`amon`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/amon/README.md)

The [Amon (`amon`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/amon/README.md) writes metrics to an  [Amon server](https://github.com/amonapp/amon). For details on the Amon Agent, see [Monitoring Agent](https://docs.amon.cx/agent/) and requires a `apikey` and `amoninstance` URL.

If the point value being sent cannot be converted to a float64 value, the metric is skipped.

Metrics are grouped by converting any `_` characters to `.` in the Point Name.

### [AMQP (`amqp`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/amqp/README.md)

The [AMQP (`amqp`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/amqp/README.md) writes to a AMQP 0-9-1 Exchange, a prominent implementation of this protocol being [RabbitMQ](https://www.rabbitmq.com/).

Metrics are written to a topic exchange using `tag`, defined in configuration file as `RoutingTag`, as a routing key.

### [Apache Kafka (`kafka`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/kafka/README.md)

The [Apache Kafka (`kafka`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/kafka/README.md) writes to a [Kafka Broker](http://kafka.apache.org/07/quickstart.html) acting a Kafka Producer.

### [Application Insights (`application_insights`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/application_insights/README.md)

The [Application Insights (`application_insights`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/application_insights/README.md) writes Telegraf metrics to [Application Insights (Microsoft Azure)](https://azure.microsoft.com/en-us/services/application-insights/).

### [Azure Monitor (`azure_monitor`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/azure_monitor/README.md) -- NEW in v.1.8

>**Note:** The Azure Monitor custom metrics service is currently in preview and not available in a subset of Azure regions.

The [Azure Monitor (`azure_monitor`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/azure_monitor/README.md) sends custom metrics to [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/). Azure Monitor has a metric resolution of one minute. To handle this in Telegraf, the Azure Monitor output plugin automatically aggregates metrics into one minute buckets, which are then sent to Azure Monitor on every flush interval.

The metrics from each input plugin will be written to a separate Azure Monitor namespace, prefixed with `Telegraf/` by default. The field name for each metric is written as the Azure Monitor metric name. All field values are written as a summarized set that includes `min`, `max`, `sum`, and `count`. Tags are written as a dimension on each Azure Monitor metric.

### [CrateDB (`cratedb`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/cratedb/README.md)

The [CrateDB (`cratedb`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/cratedb/README.md) writes to [CrateDB](https://crate.io/) using its [PostgreSQL protocol](https://crate.io/docs/crate/reference/protocols/postgres.html).

### [Datadog (`datadog`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/datadog/README.md)

The [Datadog (`datadog`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/datadog/README.md) writes to the [Datadog Metrics API](http://docs.datadoghq.com/api/#metrics) and requires an `apikey` which can be obtained [here](https://app.datadoghq.com/account/settings#api) for the account.

### [Discard (`discard`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/discard/README.md)

The [Discard (`discard`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/discard/README.md) simply drops all metrics that are sent to it. It is only meant to be used for testing purposes.

### [Elasticsearch (`elasticsearch`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/elasticsearch/README.md)

The [Elasticsearch (`elasticsearch`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/elasticsearch/README.md) writes to Elasticsearch via HTTP using [Elastic](http://olivere.github.io/elastic/). Currently it only supports Elasticsearch 5.x series.

### [File (`file`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/file/README.md)

The [File (`file`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/file/README.md) writes Telegraf metrics to files.

### [Graphite (`graphite`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/graphite/README.md)

The [Graphite (`graphite`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/graphite/README.md) writes to [Graphite](http://graphite.readthedocs.org/en/latest/index.html) via raw TCP.

### [Graylog (`graylog`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/graylog/README.md)

The  [Graylog (`graylog`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/graylog/README.md) writes to a Graylog instance using the `gelf` format.

### [HTTP (`http`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/http/README.md)

The [HTTP (`http`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/http/README.md) sends metrics in a HTTP message encoded using one of the output data formats. For `data_formats` that support batching, metrics are sent in batch format.

### [InfluxDB v1.x (`influxdb`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb/README.md)

The [InfluxDB v1.x (`influxdb`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb/README.md) writes to InfluxDB using HTTP or UDP.

### [InfluxDB v2 (`influxdb_v2`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb_v2/README.md)-- NEW in v.1.8

The [InfluxDB v2 (`influxdb_v2`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb_v2/README.md) writes metrics to the [InfluxDB 2.0](https://github.com/influxdata/platform) HTTP service.

### [Instrumental (`instrumental`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/instrumental/README.md)

The [Instrumental (`instrumental`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/instrumental/README.md) writes to the [Instrumental Collector API](https://instrumentalapp.com/docs/tcp-collector) and requires a Project-specific API token.

Instrumental accepts stats in a format very close to Graphite, with the only difference being that the type of stat (gauge, increment) is the first token, separated from the metric itself by whitespace. The increment type is only used if the metric comes in as a counter through [[input.statsd]].

### [Librato (`librato`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/librato/README.md)

The [Librato (`librato`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/librato/README.md) writes to the [Librato Metrics API](http://dev.librato.com/v1/metrics#metrics) and requires an `api_user` and `api_token` which can be obtained [here](https://metrics.librato.com/account/api_tokens) for the account.

### [MQTT Producer  (`mqtt`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/mqtt/README.md)

The [MQTT Producer (`mqtt`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/mqtt/README.md) writes to the MQTT server using [supported output data formats](/telegraf/v1.8/data_formats/output/).

### [NATS Output (`nats`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/nats/README.md)

The [NATS Output (`nats`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/nats/README.md) writes to a (list of) specified NATS instance(s).

### [NSQ (`nsq`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/nsq/README.md)

The [NSQ (`nsq`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/nsq/README.md) writes to a specified NSQD instance, usually local to the producer. It requires a server name and a topic name.

### [OpenTSDB (`opentsdb`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/opentsdb/README.md)

The [OpenTSDB (`opentsdb`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/opentsdb/README.md) writes to an OpenTSDB instance using either the telnet or HTTP mode.

Using the HTTP API is the recommended way of writing metrics since OpenTSDB 2.0 To use HTTP mode, set `useHttp` to true in config. You can also control how many metrics are sent in each HTTP request by setting `batchSize` in config. See http://opentsdb.net/docs/build/html/api_http/put.html for details.

### [Prometheus Client (`prometheus_client`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/prometheus_client/README.md)

The [Prometheus Client (`prometheus_client`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/prometheus_client/README.md) starts a [Prometheus](https://prometheus.io/) Client, it exposes all metrics on `/metrics` (default) to be polled by a Prometheus server.

### [Riemann (`riemann`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/riemann/README.md)

The [Riemann (`riemann`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/riemann/README.md) writes to [Riemann](http://riemann.io/) using TCP or UDP.

### [Socket Writer (`socket_writer`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/socket_writer/README.md)

The [Socket Writer (`socket_writer`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/socket_writer/README.md) writes to a UDP, TCP, or UNIX socket. It can output data in any of the [supported output formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md).

### [Wavefront (`wavefront`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/wavefront/README.md)

The [Wavefront (`wavefront`) output plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/wavefront/README.md) writes to a Wavefront proxy, in Wavefront data format over TCP.

## Deprecated Telegraf output plugins

### [Riemann Legacy (`riemann_legacy`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann_legacy)

The [Riemann Legacy (`riemann_legacy`) output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann_legacy) will be deprecated in a future release, see https://github.com/influxdata/telegraf/issues/1878 for more details & discussion.
