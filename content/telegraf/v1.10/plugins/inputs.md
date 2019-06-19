---
title: Telegraf input plugins
description: Telegraf input plugins are used with the InfluxData time series platform to collect metrics from the system, services, or third party APIs.
menu:
  telegraf_1_10:
    name: Input
    weight: 10
    parent: Plugins
---

Telegraf input plugins are used with the InfluxData time series platform to collect metrics from the system, services, or third party APIs. All metrics are gathered from the inputs you [enable and configure in the configuration file](/telegraf/v1.10/administration/configuration/).



## Usage instructions

View usage instructions for each service input by running `telegraf --usage <service-input-name>`.


## Supported Telegraf input plugins

### ActiveMQ

Plugin ID: `activemq`

The [ActiveMQ input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/activemq/README.md) gathers queues, topics, and subscriber metrics using the ActiveMQ Console API.

### Aerospike

Plugin ID: `aerospike`

The [Aerospike input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/aerospike/README.md) queries Aerospike servers and gets node statistics and  statistics for all configured namespaces.

### Amazon CloudWatch Statistics

Plugin ID: `cloudwatch`

The [Amazon CloudWatch Statistics input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloudwatch/README.md) pulls metric statistics from Amazon CloudWatch.

### AMQP Consumer

Plugin ID: `amqp_consumer`

The [AMQP Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/amqp_consumer/README.md) provides a consumer for use with AMQP 0-9-1, a prominent implementation of this protocol
being RabbitMQ.

### Apache HTTP Server  

Plugin ID: `apache`

The [Apache HTTP Server input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/apache/README.md) collects server performance information using the `mod_status` module of the Apache HTTP Server.

Typically, the `mod_status` module is configured to expose a page at the `/server-status?auto` location of the Apache server.
The [ExtendedStatus](https://httpd.apache.org/docs/2.4/mod/core.html#extendedstatus) option must be enabled in order to collect all available fields.
For information about how to configure your server reference, see the
[module documentation](https://httpd.apache.org/docs/2.4/mod/mod_status.html#enable).

### Apache Kafka Consumer

Plugin ID: `kafka_consumer`

The [Apache Kafka Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kafka_consumer/README.md) polls a specified Kafka topic and adds messages to InfluxDB.
Messages are expected in the line protocol format.
[Consumer Group](http://godoc.org/github.com/wvanbergen/kafka/consumergroup) is used to talk to the Kafka cluster so
multiple instances of Telegraf can read from the same topic in parallel.

### Apache Solr

Plugin ID: `solr`

The [Apache Solr (`solr`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/solr/README.md) collects stats using the MBean Request Handler.

### Apache Tomcat

Plugin ID: `tomcat`

The [Apache Tomcat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/tomcat/README.md) collects statistics available from the Apache Tomcat manager status page (`http://<host>/manager/status/all?XML=true`). Using `XML=true` returns XML data).
See the [Apache Tomcat documentation](https://tomcat.apache.org/tomcat-9.0-doc/manager-howto.html#Server_Status) for details on these statistics.

### Aurora

Plugin ID: `aurora`

The [Aurora input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/aurora/README.md) gathers metrics from [Apache Aurora](https://aurora.apache.org/) schedulers. For monitoring recommendations, see [Monitoring your Aurora cluster](https://aurora.apache.org/documentation/latest/operations/monitoring/).

### Bcache

Plugin ID: `bcache`

The [Bcache input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/bcache/README.md) gets bcache statistics from the `stats_total` directory and `dirty_data` file.

### Beanstalkd

Plugin ID: `beanstalkd`

The [Beanstalkd input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/beanstalkd/README.md) collects server stats as well as tube stats (reported by `stats` and `stats-tube` commands respectively).

### Bond

Plugin ID: `bond`

The [Bond input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/bond/README.md) collects network bond interface status, bond's slaves interfaces status and failures count of
bond's slaves interfaces. The plugin collects these metrics from `/proc/net/bonding/*` files.

### Burrow

Plugin ID: `burrow`

The [Burrow input plugin)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/burrow/README.md) collects Apache Kafka topic, consumer, and partition status using the [Burrow](https://github.com/linkedin/Burrow) HTTP [HTTP Endpoint](https://github.com/linkedin/Burrow/wiki/HTTP-Endpoint).

### Ceph Storage

Plugin ID: `ceph`

The [Ceph Storage input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ceph/README.md) collects performance metrics from the MON and OSD nodes in a Ceph storage cluster.

### CGroup

Plugin ID: `cgroup`

The [CGroup input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cgroup/README.md) captures specific statistics per cgroup.

### Chrony

Plugin ID: `chrony`

The [Chrony input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/chrony/README.md) gets standard chrony metrics, requires chronyc executable.

### Conntrack `inputs.conntrack`

The [Conntrack input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/conntrack/README.md) collects stats from Netfilter's conntrack-tools.

The conntrack-tools provide a mechanism for tracking various aspects of network connections as they are processed by netfilter.
At runtime, conntrack exposes many of those connection statistics within `/proc/sys/net`.
Depending on your kernel version, these files can be found in either `/proc/sys/net/ipv4/netfilter` or `/proc/sys/net/netfilter` and will be prefixed with either `ip_` or `nf_`.
This plugin reads the files specified in its configuration and publishes each one as a field, with the prefix normalized to `ip_`.

### Consul

Plugin ID: `consul`

The [Consul input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/consul/README.md) will collect statistics about all health checks registered in the Consul.
It uses Consul API to query the data.
It will not report the telemetry but Consul can report those stats already using StatsD protocol, if needed.

### Couchbase

Plugin ID: `couchbase`

The [Couchbase input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/couchbase/README.md) reads per-node and per-bucket metrics from Couchbase.

### CouchDB

Plugin ID: `couchdb`

The [CouchDB input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/couchdb/README.md) gathers metrics of CouchDB using `_stats` endpoint.

### CPU

Plugin ID: `cpu`

The [CPU input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cpu/README.md) gathers metrics about cpu usage.

### Disk

Plugin ID: `disk`

The [Disk input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/disk/README.md) gathers metrics about disk usage by mount point.

### DiskIO

Plugin ID: `diskio`

The [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/diskio/README.md) gathers metrics about disk IO by device.

### Disque

Plugin ID: `disque`

The [Disque input plugin](https://github.com/influxdata/plugins/inputs/disque) gathers metrics from one or more [Disque](https://github.com/antirez/disque) servers.

### DMCache

Plugin ID: `dmcache`

The [DMCache input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/dmcache/README.md) provides a native collection for dmsetup-based statistics for dm-cache.

### DNS Query

Plugin ID: `dns_query`

The [DNS Query (`dns_query`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/dns_query/README.md) gathers DNS query times in milliseconds - like [Dig](https://en.wikipedia.org/wiki/Dig_(command)).

### Docker

Plugin ID: `docker`

The [Docker input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/docker/README.md) uses the Docker Engine API to gather metrics on running Docker containers. The Docker plugin
uses the [Official Docker Client](https://github.com/moby/moby/tree/master/client) to gather stats from the
[Engine API](https://docs.docker.com/engine/api/v1.20/) library documentation.

### Dovecot

Plugin ID: `dovecot`

The [Dovecot input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/dovecot/README.md) uses the dovecot Stats protocol to gather metrics on configured domains. For more information,
see the [Dovecot documentation](http://wiki2.dovecot.org/Statistics).

### Elasticsearch

Plugin ID: `elasticsearch`

The [Elasticsearch input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/elasticsearch/README.md) queries endpoints to obtain [node](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-nodes-stats.html)
and optionally [cluster-health](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-health.html)
or [cluster-stats](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-stats.html) metrics.

### Exec

Plugin ID: `exec`

The [Exec input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/exec/README.md) parses supported [Telegraf input data formats](/telegraf/v1.10/data_formats/input/) (InfluxDB Line Protocol, JSON, Graphite, Value, Nagios, Collectd, and Dropwizard into metrics. Each Telegraf metric includes the measurement name, tags, fields, and timestamp.

### Fail2ban

Plugin ID: `fail2ban`

The [Fail2ban input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/fail2ban/README.md) gathers the count of failed and banned ip addresses using [fail2ban](https://www.fail2ban.org/).

### Fibaro

Plugin ID: `fibaro`

The [Fibaro input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/fibaro/README.md) makes HTTP calls to the Fibaro controller API to gather values of hooked devices. Those values could be true (`1`) or false (`0`) for switches, percentage for dimmers, temperature, etc.

### File

Plugin ID: `file`

The [File input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/file/README.md) updates a list of files every interval and parses the contents using the selected input data format.

Files will always be read in their entirety. If you wish to tail or follow a file, then use the [Tail input plugin](#tail).

> **Note:** To parse metrics from multiple files that are formatted in one of the supported
> [input data formats](/telegraf/v1.10/data_formats/input), use the [Multifile input plugin](#multifile).

### Filecount

Plugin ID: `filecount`

The [Filecount input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/filecount/README.md) counts files in directories that match certain criteria.

### Filestat

Plugin ID: `filestat`

The [Filestat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/filestat/README.md) gathers metrics about file existence, size, and other stats.

### Fluentd

Plugin ID: `fluentd`

The [Fluentd input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/fluentd/README.md) gathers metrics from plugin endpoint provided by in_monitor plugin. This plugin understands
data provided by `/api/plugin.json` resource (`/api/config.json` is not covered).

### Google Cloud PubSub

Plugin ID: `cloud_pubsub`

The [Google Cloud PubSub input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub/README.md) ingests metrics from [Google Cloud PubSub](https://cloud.google.com/pubsub) and creates metrics using one of the supported [input data formats](https://github.com/influxdata/telegraf/blob/release-1.10/docs/DATA_FORMATS_INPUT.md).

### Google Cloud PubSub Push

Plugin ID: `cloud_pubsub_push`

The [Google Cloud PubSub Push (`cloud_pubsub_push`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub_push/README.md) listens for messages sent using HTTP POST requests from Google Cloud PubSub. The plugin expects messages in Google's Pub/Sub JSON Format ONLY. The intent of the plugin is to allow Telegraf to serve as an endpoint of the Google Pub/Sub 'Push' service. Google's PubSub service will only send over HTTPS/TLS so this plugin must be behind a valid proxy or must be configured to use TLS.

### Graylog

Plugin ID: `graylog`

The [Graylog input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/graylog/README.md) can collect data from remote Graylog service URLs. This plugin currently supports two
types of endpoints:

* multiple (e.g., `http://[graylog-server-ip]:12900/system/metrics/multiple`)
* namespace (e.g., `http://[graylog-server-ip]:12900/system/metrics/namespace/{namespace}`)

### HAproxy

Plugin ID: `haproxy`

The [HAproxy input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/haproxy/README.md) gathers metrics directly from any running HAproxy instance. It can do so by using CSV
generated by HAproxy status page or from admin sockets.

### Hddtemp

Plugin ID: `hddtemp`

The [Hddtemp input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/hddtemp/README.md) reads data from `hddtemp` daemons.

### HTTP

Plugin ID: `http`

The [HTTP input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/http/README.md) collects metrics from one or more HTTP (or HTTPS) endpoints. The endpoint should have metrics formatted in one of the [supported input data formats](/telegraf/v1.10/data_formats/input/). Each data format has its own unique set of configuration options which can be added to the input configuration.

### HTTP Listener v2

Plugin ID: `http_listener_v2`

The [HTTP Listener v2 input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/http_listener_v2/README.md) listens for messages sent via HTTP POST. Messages are expected in the [InfluxDB
Line Protocol input data format](/telegraf/v1.10/data_formats/input/influx) ONLY (other [Telegraf input data formats](/telegraf/v1.10/data_formats/input/) are not supported).
This plugin allows Telegraf to serve as a proxy or router for the `/write` endpoint of the InfluxDB v2110 HTTP API.

### HTTP Response

Plugin ID: `http_response`

The [HTTP Response input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/http_response/README.md) gathers metrics for HTTP responses. The measurements and fields include `response_time`, `http_response_code`, and `result_type`. Tags for measurements include `server` and `method`.

### Icinga2

Plugin ID: `icinga2`

The [Icinga2 input plugin](https://github.com/influxdata/plugins/inputs/icinga2) gather status on running services and hosts using the [Icinga2 Remote API](https://docs.icinga.com/icinga2/latest/doc/module/icinga2/chapter/icinga2-api).

### InfluxDB v1.x

Plugin ID: `influxdb`

The [InfluxDB v1.x input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/influxdb/README.md) gathers metrics from the exposed InfluxDB v1.x `/debug/vars` endpoint.  Using Telegraf to extract these metrics to create a "monitor of monitors" is a best practice and allows you to reduce the overhead associated with
capturing and storing these metrics locally within the `_internal` database for production deployments.
[Read more about this approach here.](https://www.influxdata.com/blog/influxdb-debugvars-endpoint/)

### InfluxDB Listener

Plugin ID: `influxdb_listener`

The [InfluxDB Listener input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/influxdb_listener/README.md) listens for requests sent
according to the [InfluxDB HTTP API](/influxdb/latest/guides/writing_data/).  The intent of the
plugin is to allow Telegraf to serve as a proxy, or router, for the HTTP `/write`
endpoint of the InfluxDB HTTP API.

**Note:** This plugin was previously known as `http_listener`.  If you wish to
send general metrics via HTTP, use the
[HTTP Listener v2 input plugin](#http-listener-v2) instead.

The `/write` endpoint supports the `precision` query parameter and can be set
to one of `ns`, `u`, `ms`, `s`, `m`, `h`.  All other parameters are ignored and
defer to the output plugins configuration.

When chaining Telegraf instances using this plugin, `CREATE DATABASE` requests
receive a `200 OK` response with message body `{"results":[]}` but they are not
relayed. The output configuration of the Telegraf instance which ultimately
submits data to InfluxDB determines the destination database.

### Interrupts

Plugin ID: `interrupts`

The [Interrupts input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/interrupts/README.md) gathers metrics about IRQs, including `interrupts` (from `/proc/interrupts`) and `soft_interrupts` (from `/proc/softirqs`).

### IPMI Sensor

Plugin ID: `ipmi_sensor`

The [IPMI Sensor input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ipmi_sensor/README.md) queries the local machine or remote host sensor statistics using the `ipmitool` utility.

### Ipset

Plugin ID: `ipset`

The [Ipset input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ipset/README.md) gathers packets and bytes counters from Linux `ipset`. It uses the output of the command `ipset save`. Ipsets created without the `counters` option are ignored.

### IPtables

Plugin ID: `iptables`

The [IPtables input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/iptables/README.md) gathers packets and bytes counters for rules within a set of table and chain from the Linux iptables firewall.

### IPVS

Plugin ID: `ipvs`

The [IPVS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ipvs/README.md) uses the Linux kernel netlink socket interface to gather metrics about IPVS virtual and real servers.

### Jenkins

Plugin ID: `jenkins`

The [Jenkins input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/jenkins/README.md) gathers information about the nodes and jobs running in a jenkins instance.

This plugin does not require a plugin on jenkins and it makes use of Jenkins API to retrieve all the information needed.

### Jolokia2 Agent

Plugin ID: `jolokia2_agent`

The [Jolokia2 Agent input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/jolokia2/README.md) reads JMX metrics from one or more [Jolokia](https://jolokia.org/) agent REST endpoints using the
 [JSON-over-HTTP protocol](https://jolokia.org/reference/html/protocol.html).

### Jolokia2 Proxy

Plugin ID: `jolokia2_proxy`

The [Jolokia2 Proxy input plugin](https://github.com/influxdata/plugins/inputs/jolokia2/README.md) reads JMX metrics from one or more targets by interacting with a [Jolokia](https://jolokia.org/) proxy REST endpoint using the [Jolokia](https://jolokia.org/) [JSON-over-HTTP protocol](https://jolokia.org/reference/html/protocol.html).

### JTI OpenConfig Telemetry

Plugin ID: `jti_openconfig_telemetry`

The [JTI OpenConfig Telemetry input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/jti_openconfig_telemetry/README.md) reads Juniper Networks implementation of OpenConfig telemetry data from listed sensors using the Junos Telemetry Interface. Refer to
[openconfig.net](http://openconfig.net/) for more details about OpenConfig and [Junos Telemetry Interface (JTI)](https://www.juniper.net/documentation/en_US/junos/topics/concept/junos-telemetry-interface-oveview.html).

### Kapacitor

Plugin ID: `kapacitor`

The [Kapacitor input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kapacitor/README.md) will collect metrics from the given Kapacitor instances.

### Kernel

Plugin ID: `kernel`

The [Kernel input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kernel/README.md) gathers kernel statistics from `/proc/stat`.

### Kernel VMStat

Plugin ID: `kernel_vmstat`

The [Kernel VMStat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kernel_vmstat/README.md) gathers kernel statistics from `/proc/vmstat`.

### Kibana

Plugin ID: `kibana`

The [Kibana input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kibana/README.md) queries the Kibana status API to obtain the health status of Kibana and some useful metrics.

### Kinesis Consumer

Plugin ID: `kinesis_consumer`

The [Kinesis Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kinesis_consumer/README.md) reads from a Kinesis data stream and creates metrics using one of the supported [input data formats](/telegraf/v1.10/data_formats/input).

### Kubernetes

Plugin ID: `kubernetes`

>***Note:*** The Kubernetes input plugin is experimental and may cause high cardinality issues with moderate to
large Kubernetes deployments.

The [Kubernetes input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kubernetes/README.md) talks to the kubelet API using the `/stats/summary` endpoint to gather metrics about the running pods
and containers for a single host. It is assumed that this plugin is running as part of a daemonset within a
Kubernetes installation. This means that Telegraf is running on every node within the cluster. Therefore, you
should configure this plugin to talk to its locally running kubelet.

### Kubernetes Inventory

Plugin ID: `kube_inventory`

The [Kubernetes Inventory input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/kube_inventory/README.md) generates metrics derived from the state of the following Kubernetes resources:

* daemonsets
* deployments
* nodes
* persistentvolumes
* persistentvolumeclaims
* pods (containers)
* statefulsets

### LeoFS

Plugin ID: `leofs`

The [LeoFS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/leofs/README.md) gathers metrics of LeoGateway, LeoManager, and LeoStorage using SNMP. See [System monitoring](https://leo-project.net/leofs/docs/admin/system_admin/monitoring/) in the [LeoFS documentation](https://leo-project.net/leofs/docs/) for more information.

### Linux Sysctl FS

Plugin ID: `linux_sysctl_fs`

The [Linux Sysctl FS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/linux_sysctl_fs/README.md) provides Linux system level file (`sysctl fs`) metrics. The documentation on these fields can be found at https://www.kernel.org/doc/Documentation/sysctl/fs.txt.

### Logparser

Plugin ID: `logparser`

The [Logparser input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/logparser/README.md) streams and parses the given log files. Currently, it has the capability of parsing "grok" patterns
from log files, which also supports regular expression (regex) patterns.

### Lustre2

Plugin ID: `lustre2`

Lustre Jobstats allows for RPCs to be tagged with a value, such as a job's ID.  This allows for per job statistics.
The [Lustre2 input plugin](https://github.com/influxdata/plugins/inputs/lustre2) collects statistics and tags the data with the `jobid`.

### Mailchimp

Plugin ID: `mailchimp`

The [Mailchimp input plugin](https://github.com/influxdata/plugins/inputs/mailchimp) gathers metrics from the `/3.0/reports` MailChimp API.

### Mcrouter

Plugin ID: `mcrouter`

The [Mcrouter input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mcrouter/README.md) gathers statistics data from a mcrouter instance. [Mcrouter](https://github.com/facebook/mcrouter) is a memcached protocol router, developed and maintained by Facebook, for scaling memcached (http://memcached.org/) deployments. It's a core component of cache infrastructure at Facebook and Instagram where mcrouter handles almost 5 billion requests per second at peak.

### Mem

Plugin ID: `mem`

The [Mem input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mem/README.md) collects system memory metrics. For a more complete explanation of the difference between used and actual_used RAM, see [Linux ate my ram](https://www.linuxatemyram.com/).

### Memcached

Plugin ID: `memcached`

The [Memcached input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/memcached/README.md) gathers statistics data from a Memcached server.

### Mesos

Plugin ID: `mesos`

The [Mesos input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mesos/README.md) gathers metrics from Mesos. For more information, please check the
[Mesos Observability Metrics](http://mesos.apache.org/documentation/latest/monitoring/) page.

### Mesosphere DC/OS

Plugin ID: `dcos`

The [Mesosphere DC/OS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/dcos/README.md) gathers metrics from a DC/OS cluster's [metrics component](https://docs.mesosphere.com/1.10/metrics/).

### Microsoft SQL Server

Plugin ID: `sqlserver`

The [Microsoft SQL Server input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/sqlserver/README.md) provides metrics for your Microsoft SQL Server instance. It currently works with SQL Server
versions 2008+. Recorded metrics are lightweight and use Dynamic Management Views supplied by SQL Server.

### Minecraft

Plugin ID: `minecraft`

The [Minecraft input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/minecraft/README.md) uses the RCON protocol to collect statistics from a scoreboard on a Minecraft server.

### MongoDB

Plugin ID: `mongodb`

The [MongoDB input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mongodb/README.md) collects MongoDB stats exposed by `serverStatus` and few more and create a single
measurement containing values.

### MQTT Consumer

Plugin ID: `mqtt_consumer`

The [MQTT Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mqtt_consumer/README.md) reads from specified MQTT topics and adds messages to InfluxDB. Messages are in the
[Telegraf input data formats](/telegraf/v1.10/data_formats/input/).

### Multifile

Plugin ID: `multifile`

The [Multifile input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/multifile/README.md) allows Telegraf to combine data from multiple files
into a single metric, creating one field or tag per file.  
This is often useful creating custom metrics from the `/sys` or `/proc` filesystems.

> **Note:** To parse metrics from a single file formatted in one of the supported
> [input data formats](/telegraf/v1.10/data_formats/input), use the [file input plugin](#file).

### MySQL

Plugin ID: `mysql`

The [MySQL input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/mysql/README.md) gathers the statistics data from MySQL servers.

### NATS Consumer

Plugin ID: `nats_consumer`

The [NATS Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nats_consumer/README.md) reads from specified NATS subjects and adds messages to InfluxDB. Messages are expected in the [Telegraf input data formats](/telegraf/v1.10/data_formats/input/). A Queue Group is used when subscribing to subjects so multiple instances of Telegraf can read from a NATS cluster in parallel.

### NATS Server Monitoring

Plugin ID: `nats`

The [NATS Server Monitoring input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nats/README.md) gathers metrics when using the [NATS Server monitoring server](https://www.nats.io/documentation/server/gnatsd-monitoring/).

### Neptune Apex

Plugin ID: `neptune_apex`

The [Neptune Apex input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/neptune_apex/README.md) collects real-time data from the Apex `status.xml` page.
The Neptune Apex controller family allows an aquarium hobbyist to monitor and control their tanks based on various probes. The data is taken directly from the `/cgi-bin/status.xml` at the interval specified in the `telegraf.conf` configuration file.

### Net

Plugin ID: `net`

The [Net input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/net/NET_README.md) gathers metrics about network interface usage (Linux only).

### Netstat

Plugin ID: `netstat`

The [Netstat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/net/NETSTAT_README.md) gathers TCP metrics such as established, time-wait and sockets counts by using `lsof`.

### Network Response

Plugin ID: `net_response`

The [Network Response input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/net_response/README.md) tests UDP and TCP connection response time. It can also check response text.

### NGINX

Plugin ID: `nginx`

The [NGINX input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx/README.md) reads NGINX basic status information (`ngx_http_stub_status_module`).

### NGINX VTS

Plugin ID: `nginx_vts`

The [NGINX VTS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_vts/README.md) gathers NGINX status using external virtual host traffic status module -  https://github.com/vozlt/nginx-module-vts. This is an NGINX module that provides access to virtual host status information. It contains the current status such as servers, upstreams, caches. This is similar to the live activity monitoring of NGINX Plus.
For module configuration details, see the [NGINX VTS module documentation](https://github.com/vozlt/nginx-module-vts#synopsis).

### NGINX Plus

Plugin ID: `nginx_plus`

The [NGINX Plus input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_plus/README.md) is for NGINX Plus, the commercial version of the open source web server NGINX. To use this plugin you will need a license.
For more information, see [What’s the Difference between Open Source NGINX and NGINX Plus?](https://www.nginx.com/blog/whats-difference-nginx-foss-nginx-plus/).

Structures for NGINX Plus have been built based on history of [status module documentation](http://nginx.org/en/docs/http/ngx_http_status_module.html).

### NGINX Plus API

Plugin ID: `nginx_plus_api`

The [NGINX Plus API input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_plus_api/README.md) gathers advanced status information for NGINX Plus servers.

### NGINX Upstream Check

Plugin ID: `nginx_upstream_check`

The [NGINX Upstream Check input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_plus_api/README.md) reads the status output of the nginx_upstream_check (https://github.com/yaoweibin/nginx_upstream_check_module).
This module can periodically check the NGINX upstream servers using the configured request and interval to determine if the server is still available.
If checks are failed, then the server is marked as `down` and will not receive any requests until the check passes and the server will be marked as `up` again.

The status page displays the current status of all upstreams and servers as well as number of the failed and successful checks. This information can be exported in JSON format and parsed by this input.

### NSQ

Plugin ID: `nsq`

The [NSQ input plugin](https://github.com/influxdata/plugins/inputs/nsq) ...

### NSQ Consumer

Plugin ID: `nsq_consumer`

The [NSQ Consumer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nsq_consumer/README.md) polls a specified NSQD topic and adds messages to InfluxDB. This plugin allows a message to be in any of the supported data_format types.

### Nstat

Plugin ID: `nstat`

The [Nstat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nstat/README.md) collects network metrics from `/proc/net/netstat`, `/proc/net/snmp`, and `/proc/net/snmp6` files.

### NTPq

Plugin ID: `ntpq`

The [NTPq input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ntpq/README.md) gets standard NTP query metrics, requires ntpq executable.

### NVIDIA SMI

Plugin ID: `nvidia-smi`

The [NVIDIA SMI input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nvidia_smi/README.md) uses a query on the [NVIDIA System Management Interface (`nvidia-smi`)](https://developer.nvidia.com/nvidia-system-management-interface) binary to pull GPU stats including memory and GPU usage, temp and other.

### OpenLDAP

Plugin ID: `openldap`

The [OpenLDAP input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/openldap/README.md) gathers metrics from OpenLDAP's `cn=Monitor` backend.

### OpenSMTPD

Plugin ID: `opensmtpd`

The [OpenSMTPD input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/opensmtpd/README.md) gathers stats from [OpenSMTPD](https://www.opensmtpd.org/), a free implementation of the server-side SMTP protocol.

### PF

Plugin ID: `pf`

The [PF input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/pf/README.md) gathers information from the FreeBSD/OpenBSD pf firewall. Currently it can retrive information about
the state table: the number of current entries in the table, and counters for the number of searches, inserts, and
removals to the table. The pf plugin retrieves this information by invoking the `pfstat` command.

### PgBouncer

Plugin ID: `pgbouncer`

The [PgBouncer input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/pgbouncer/README.md) provides metrics for your PgBouncer load balancer. For information about the metrics, see the [PgBouncer documentation](https://pgbouncer.github.io/usage.html).

### Phfusion Passenger

Plugin ID: `passenger`

The [Phfusion 0Passenger input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/passenger/README.md) gets Phusion Passenger statistics using their command line utility `passenger-status`.

### PHP FPM

Plugin ID: `phpfpm`

The [PHP FPM input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/phpfpm/README.md) gets phpfpm statistics using either HTTP status page or fpm socket.

### Ping

Plugin ID: `ping`

The [Ping input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/ping/README.md) measures the round-trip for ping commands, response time, and other packet statistics.

### Postfix

Plugin ID: `postfix`

The [Postfix input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/postfix/README.md) reports metrics on the postfix queues. For each of the active, hold, incoming, maildrop, and
deferred [queues](http://www.postfix.org/QSHAPE_README.html#queues), it will report the queue length (number of items),
size (bytes used by items), and age (age of oldest item in seconds).

### PostgreSQL

Plugin ID: `postgresql`

The [PostgreSQL input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/postgresql/README.md) provides metrics for your PostgreSQL database. It currently works with PostgreSQL versions 8.1+.
It uses data from the built-in `pg_stat_database` and `pg_stat_bgwriter` views. The metrics recorded depend on your
version of PostgreSQL.

### PostgreSQL Extensible

Plugin ID: `postgresql_extensible`

This [PostgreSQL Extensible input plugin](https://github.com/influxdata/plugins/inputs/postgresql_extensible) provides metrics for your Postgres database. It has been designed to parse SQL queries in the plugin section of `telegraf.conf` files.

### PowerDNS

Plugin ID: `powerdns`

The [PowerDNS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/powerdns/README.md) gathers metrics about PowerDNS using UNIX sockets.

### Processes

Plugin ID: `processes`

The [Processes input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/processes/README.md)
gathers info about the total number of processes and groups them by status (zombie, sleeping, running, etc.). On Linux, this plugin requires access to `procfs` (`/proc`); on other operating systems, it requires access to execute `ps`.

### Procstat

Plugin ID: `procstat`

The [Procstat input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/procstat/README.md) can be used to monitor system resource usage by an individual process using their `/proc` data.

Processes can be specified either by `pid` file, by executable name, by command line pattern matching, by username,
by systemd unit name, or by cgroup name/path (in this order or priority). This plugin uses `pgrep` when an executable
name is provided to obtain the `pid`. The Procstat plugin transmits IO, memory, cpu, file descriptor-related
measurements for every process specified. A prefix can be set to isolate individual process specific measurements.

The Procstat input plugin will tag processes according to how they are specified in the configuration. If a pid file is used, a
"pidfile" tag will be generated. On the other hand, if an executable is used an "exe" tag will be generated.

### Prometheus Format

Plugin ID: `prometheus`

The [Prometheus Format input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/prometheus/README.md) input plugin gathers metrics from HTTP servers exposing metrics in Prometheus format.

### Puppet Agent

Plugin ID: `puppetagent`

The [Puppet Agent input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/puppetagent/README.md) collects variables outputted from the `last_run_summary.yaml` file usually
located in `/var/lib/puppet/state/` Puppet Agent Runs. For more information, see [Puppet Monitoring: How  to Monitor the Success or Failure of Puppet Runs](https://puppet.com/blog/puppet-monitoring-how-to-monitor-success-or-failure-of-puppet-runs)

### RabbitMQ

Plugin ID: `rabbitmq`

The [RabbitMQ input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/rabbitmq/README.md) reads metrics from RabbitMQ servers via the [Management Plugin](https://www.rabbitmq.com/management.html).

### Raindrops Middleware

Plugin ID: `raindrops`

The [Raindrops Middleware input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/raindrops/README.md) reads from the specified [Raindrops middleware](http://raindrops.bogomips.org/Raindrops/Middleware.html)
URI and adds the statistics to InfluxDB.

### Redis

Plugin ID: `redis`

The [Redis input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/redis/README.md) gathers the results of the INFO Redis command. There are two separate measurements: `redis`
and `redis_keyspace`, the latter is used for gathering database-related statistics.

Additionally the plugin also calculates the hit/miss ratio (`keyspace_hitrate`) and the elapsed time since the last RDB save (`rdb_last_save_time_elapsed`).

### RethinkDB

Plugin ID: `rethinkdb`

The [RethinkDB input plugin](https://github.com/influxdata/plugins/inputs/rethinkdb) works with RethinkDB 2.3.5+ databases that requires username, password authorization,
and Handshake protocol v1.0.

### Riak

Plugin ID: `riak`

The [Riak input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/riak/README.md) gathers metrics from one or more Riak instances.

### Salesforce

Plugin ID: `salesforce`

The [Salesforce input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/salesforce/README.md) gathers metrics about the limits in your Salesforce organization and the remaining usage.
It fetches its data from the limits endpoint of the Salesforce REST API.

### Sensors

Plugin ID: `sensors`

The [Sensors input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/sensors/README.md) collects collects sensor metrics with the sensors executable from the `lm-sensor` package.

### SMART

Plugin ID: `smart`

The [SMART input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/smart/README.md) gets metrics using the command line utility `smartctl` for SMART (Self-Monitoring, Analysis
and Reporting Technology) storage devices. SMART is a monitoring system included in computer hard disk drives (HDDs)
and solid-state drives (SSDs), which include most modern ATA/SATA, SCSI/SAS and NVMe disks. The plugin detects and
reports on various indicators of drive reliability, with the intent of enabling the anticipation of hardware failures.
See [smartmontools](https://www.smartmontools.org/).

### SNMP

Plugin ID: `snmp`

The [SNMP input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/snmp/README.md) gathers metrics from SNMP agents.

### Socket Listener

Plugin ID: `socket_listener`

The [Socket Listener input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/socket_listener/README.md) listens for messages from streaming (TCP, UNIX) or datagram (UDP, unixgram) protocols. Messages are expected in the
[Telegraf Input Data Formats](/telegraf/v1.10/data_formats/input/).

### Stackdriver

Plugin ID: `stackdriver`

The [Stackdriver input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/stackdriver/README.md) gathers metrics from the [Stackdriver Monitoring API](https://cloud.google.com/monitoring/api/v3/).

> **Note:** This plugin accesses APIs that are [chargeable](https://cloud.google.com/stackdriver/pricing#stackdriver_monitoring_services) -- you might incur costs.

### StatsD

Plugin ID: `statsd`

The [StatsD input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/statsd/README.md) is a special type of plugin which runs a backgrounded `statsd` listener service while Telegraf is running.
StatsD messages are formatted as described in the original [etsy statsd](https://github.com/etsy/statsd/blob/master/docs/metric_types.md) implementation.

### Swap

Plugin ID: `swap`

Supports: Linux only.

The [Swap input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/swap/README.md) gathers metrics about swap memory usage. For more information about Linux swap spaces, see [All about Linux swap space](https://www.linux.com/news/all-about-linux-swap-space)

### Syslog

Plugin ID: `syslog`

The [Syslog input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/syslog/README.md) listens for syslog messages transmitted over
[UDP](https://tools.ietf.org/html/rfc5426) or [TCP](https://tools.ietf.org/html/rfc5425). Syslog messages should be formatted according to [RFC 5424](https://tools.ietf.org/html/rfc5424).

### Sysstat

Plugin ID: `sysstat`

The [Sysstat input plugin](https://github.com/influxdata/plugins/inputs/sysstat) collects [sysstat](https://github.com/sysstat/sysstat) system metrics with the sysstat
collector utility `sadc` and parses the created binary data file with the `sadf` utility.

### System

Plugin ID: `system`

The [System input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/system/README.md) gathers general stats on system load, uptime, and number of users logged in. It is basically equivalent to the UNIX `uptime` command.

### Tail

Plugin ID: `tail`

The [Tail input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/tail/README.md) "tails" a log file and parses each log message.

### Teamspeak 3

Plugin ID: `teamspeak`

The [Teamspeak 3 input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/teamspeak/README.md) uses the Teamspeak 3 ServerQuery interface of the Teamspeak server to collect statistics of one or more virtual servers.

### Telegraf v1.x

Plugin ID: `internal`

The [Telegraf v1.x input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/internal/README.md) collects metrics about the Telegraf v1.x agent itself.
Note that some metrics are aggregates across all instances of one type of plugin.

### Temp

Plugin ID: `temp`

The [Temp input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/temp/README.md) collects temperature data from sensors.

### Tengine Web Server

Plugin ID: `tengine`

The [Tengine Web Server input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/tengine/README.md) gathers status metrics from the [Tengine Web Server](http://tengine.taobao.org/) using the [Reqstat module](http://tengine.taobao.org/document/http_reqstat.html).

### Trig

Plugin ID: `trig`

The [Trig input plugin](https://github.com/influxdata/plugins/inputs/trig) inserts sine and cosine waves for demonstration purposes.

### Twemproxy

Plugin ID: `twemproxy`

The [Twemproxy input plugin](https://github.com/influxdata/plugins/inputs/twemproxy) gathers data from Twemproxy instances, processes Twemproxy server statistics, processes pool data, and processes backend server (Redis/Memcached) statistics.

### Unbound

Plugin ID: `unbound`

The [Unbound input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/unbound/README.md) gathers statistics from [Unbound](https://www.unbound.net/), a validating, recursive, and caching DNS resolver.

### Varnish

Plugin ID: `varnish`

The [Varnish input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/varnish/README.md) gathers stats from [Varnish HTTP Cache](https://varnish-cache.org/).

### VMware vSphere

Plugin ID: `vsphere`

The [VMware vSphere input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/vsphere/README.md) uses the vSphere API to gather metrics from multiple vCenter servers (clusters, hosts, VMs, and data stores). For more information on the available performance metrics, see [Common vSphere Performance Metrics](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/vsphere/METRICS.md).

### Webhooks

Plugin ID: `webhooks`

The [Webhooks input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/README.md) starts an HTTPS server and registers multiple webhook listeners.

#### Available webhooks

* [Filestack](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/filestack/README.md)
* [GitHub](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/github/README.md)
* [Mandrill](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/mandrill/README.md)
* [Papertrail](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/papertrail/README.md)
* [Particle.io](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/webhooks/particle/README.md)
* [Rollbar](https://github.com/influxdata/plugins/inputs/webhooks/rollbar)

#### Add new webhooks
If you need a webhook that is not supported, consider [adding a new webhook](https://github.com/influxdata/plugins/inputs/webhooks#adding-new-webhooks-plugin).


### Windows Performance Counters

Plugin ID: `win_perf_counters`

Supports: Windows

The way the [Windows Performance Counters input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/win_perf_counters/README.md) works is that on load of Telegraf, the plugin will be handed configuration
from Telegraf.
This configuration is parsed and then tested for validity such as if the Object, Instance and Counter existing.
If it does not match at startup, it will not be fetched.
Exceptions to this are in cases where you query for all instances `""`.
By default the plugin does not return `_Total` when it is querying for all () as this is redundant.

### Windows Services

Plugin ID: `win_services`

Supports: Windows

The [Windows Services input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/win_services/README.md) reports Windows services info.

### Wireless

Plugin ID: `wireless`

Supports: Linux only

The [Wireless input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/wireless/README.md) gathers metrics about wireless link quality by reading the `/proc/net/wireless` file. This plugin currently supports Linux only.

### X.509 Certificate

Plugin ID: `x509_cert`

The [X.509 Certificate input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/x509_cert/README.md) provides information about X.509 certificate accessible using the local file or network connection.

### ZFS

Plugin ID: `zfs`

Supports: FreeBSD, Linux

The [ZFS input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/zfs/README.md) provides metrics from your ZFS filesystems. It supports ZFS on Linux and FreeBSD.
It gets ZFS statistics from `/proc/spl/kstat/zfs` on Linux and from `sysctl` and `zpool` on FreeBSD.

### Zipkin

Plugin ID: `zipkin`

The [Zipkin input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/zipkin/README.md) implements the Zipkin HTTP server to gather trace and timing data needed to troubleshoot latency problems in microservice architectures.

> ***Note:*** This plugin is experimental. Its data schema may be subject to change based on its main usage cases and the evolution of the OpenTracing standard.

### Zookeeper

Plugin ID: `zookeeper`

The [Zookeeper (`zookeeper`) input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/zookeeper/README.md) collects variables output from the `mntr` command [Zookeeper Admin](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html).

## Deprecated Telegraf input plugins

### Cassandra

Plugin ID: `cassandra`

> DEPRECATED as of version 1.7. The [Cassandra input plugin](https://github.com/influxdata/telegraf/tree/release-1.6/plugins/inputs/cassandra) collects Cassandra 3 / JVM metrics exposed as MBean attributes through the jolokia REST endpoint.
All metrics are collected for each server configured.

### HTTP JSON

Plugin ID: `httpjson`

> DEPRECATED as of version 1.6; use the [HTTP input plugin](#http).

The [HTTP JSON input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/httpjson/README.md) collects data from HTTP URLs which respond with JSON.
It flattens the JSON and finds all numeric values, treating them as floats.

### HTTP Listener

Plugin ID: `http_listener`

The [HTTP Listener input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/http_listener/README.md) listens for messages sent via HTTP POST. Messages are expected in the [InfluxDB
Line Protocol input data format](/telegraf/v1.10/data_formats/input/influx) ONLY (other [Telegraf input data formats](/telegraf/v1.10/data_formats/input/) are not supported).
This plugin allows Telegraf to serve as a proxy or router for the `/write` endpoint of the InfluxDB HTTP API.

> DEPRECATED as of version 1.9. Use either [HTTP Listener v2](#http-listener-v2) or the [InfluxDB Listener](#influxdb-v1-x)


### Jolokia

Plugin ID: `jolokia`

> DEPRECATED as of version 1.5; use the [Jolokia2 input plugin](#jolokia2-agent).

### SNMP Legacy

Plugin ID: `snmp_legacy`

> The [SNMP Legacy input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/snmp_legacy/README.md) is DEPRECATED. Use the [SNMP input plugin](https://github.com/influxdata/telegraf/tree/release-1.6/plugins/inputs/snmp).

The SNMP Legacy input plugin gathers metrics from SNMP agents.

### TCP Listener

Plugin ID: `tcp_listener`

> The [TCP Listener input plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/tcp_listener/README.md) is DEPRECATED as of version 1.3; use the [Socket Listener input plugin](#socket-listener).

### UDP Listener

Plugin ID: `udp_listener`

> DEPRECATED as of version 1.3; use the [Socket Listener input plugin](#socket-listener).
