---
title: Telegraf input plugins
aliases:
  - /telegraf/v1.5/inputs/
  - /telegraf/v1.5/services/
menu:
  telegraf_1_5:
    name: Input
    identifier: inputs
    weight: 10
    parent: plugins
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.5`.
>The [Release Notes/Changelog](/telegraf/v1.5/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.

## Usage instructions

View usage instructions for each service input by running `telegraf --usage <service-input-name>`.


## Supported input plugins


### [Aerospike (aerospike)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/aerospike)

The [Aerospike (aerospike) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/aerospike) queries Aerospike servers and gets node statistics and  statistics for all configured namespaces.

### [AMQP Consumer (amqp_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/amqp_consumer)

The [AMQP Consumer (amqp_consumer) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/amqp_consumer) provides a consumer for use with AMQP 0-9-1, a prominent implementation of this protocol
being RabbitMQ.

### [Apache (apache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/apache)

The [Apache (apache) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/apache) collects server performance information using the `mod_status` module of the Apache HTTP Server.

Typically, the `mod_status` module is configured to expose a page at the `/server-status?auto` location of the Apache
server. The [ExtendedStatus](https://httpd.apache.org/docs/2.4/mod/core.html#extendedstatus) option must be enabled in order
to collect all available fields. For information about how to configure your server reference the
[module documenation](https://httpd.apache.org/docs/2.4/mod/mod_status.html#enable).

### [Bcache (bcache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bcache)

The [Bcache (bcache) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bcache) gets bcache statistics from the `stats_total` directory and `dirty_data` file.

### [Bond (bond)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bond)  -- NEW in v.1.5

The [Bond (bond) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bond) collects network bond interface status, bond's slaves interfaces status and failures count of
bond's slaves interfaces. The plugin collects these metrics from `/proc/net/bonding/*` files.

### [Cassandra (cassandra)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cassandra)

The [Cassandra (cassandra) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cassandra) collects Cassandra 3 / JVM metrics exposed as MBean attributes through the jolokia REST endpoint.
All metrics are collected for each server configured.

### [Ceph Storage (ceph)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ceph)

The [Ceph Storage (ceph) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ceph) collects performance metrics from the MON and OSD nodes in a Ceph storage cluster.

### [CGroup (cgroup)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cgroup)

The [CGroup (cgroup) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cgroup) captures specific statistics per cgroup.

### [Chrony (chrony)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/chrony)

The [Chrony (chrony) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/chrony) gets standard chrony metrics, requires chronyc executable.

### [CloudWatch (cloudwatch)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cloudwatch)

The [CloudWatch (cloudwatch) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cloudwatch) pulls metric statistics from Amazon CloudWatch.

### [Conntrack (conntrack)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/conntrack)

The [Conntrack (conntrack) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/conntrack) collects stats from Netfilter's conntrack-tools.

The conntrack-tools provide a mechanism for tracking various aspects of network connections as they are processed by
netfilter. At runtime, conntrack exposes many of those connection statistics within /proc/sys/net. Depending on your
kernel version, these files can be found in either /proc/sys/net/ipv4/netfilter or /proc/sys/net/netfilter and will be
prefixed with either ip_ or nf_. This plugin reads the files specified in its configuration and publishes each one as
a field, with the prefix normalized to ip_.

### [Consul (consul)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/consul)

The [Consul (consul) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/consul) will collect statistics about all health checks registered in the Consul. It uses Consul API
to query the data. It will not report the telemetry but Consul can report those stats already using StatsD protocol,
if needed.

### [Couchbase (couchbase)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchbase)

The [Couchbase (couchbase) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchbase) reads per-node and per-bucket metrics from Couchbase.

### [CouchDB (couchdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchdb)

The [CouchDB (couchdb) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchdb) gathers metrics of CouchDB using `_stats` endpoint.

### [Mesosphere DC/OS (dcos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dcos) -- NEW in v.1.5

The [Mesosphere DC/OS (dcos) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dcos) gathers metrics from a DC/OS cluster's [metrics component](https://docs.mesosphere.com/1.10/metrics/).

### [Disque (disque)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/disque)



### [DMCache (dmcache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dmcache)

The [DMCache (dmcache) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dmcache) provides a native collection for dmsetup-based statistics for dm-cache.

### [DNS query time (dns_query_time)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dns_query)

The [DNS query time (dns_query_time) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dns_query) gathers dns query times in milliseconds - like [Dig](https://en.wikipedia.org/wiki/Dig_(command)).

### [Docker (docker)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/docker)

The [Docker (docker) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/docker) uses the Docker Engine API to gather metrics on running Docker containers. The Docker plugin
uses the [Official Docker Client](https://github.com/moby/moby/tree/master/client) to gather stats from the
[Engine API](https://docs.docker.com/engine/api/v1.20/) library documentation.

### [Dovecot (dovecot)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dovecot)

The [Dovecot (dovecot) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dovecot) uses the dovecot Stats protocol to gather metrics on configured domains. For more information,
see the [Dovecot documentation](http://wiki2.dovecot.org/Statistics).

### [Elasticsearch (elasticsearch)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/elasticsearch)

The [Elasticsearch input plugin](https://www.elastic.co/) queries endpoints to obtain [node](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-nodes-stats.html)
and optionally [cluster-health](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-health.html)
or [cluster-stats](https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-stats.html) metrics.

### [Exec (exec)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/exec)

The [Exec (exec) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/exec) parses supported [Telegraf input data formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md) (InfluxDB Line Protocol, JSON, Graphite, Value, Nagios, Collectd, and Dropwizard into metrics. Each Telegraf metric includes the measurement name, tags, fields, and timesamp. See [Telegraf input data formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md) for details on the supported data formats.

### [Fail2ban (fail2ban)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fail2ban)

The [Fail2ban (fail2ban) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fail2ban) gathers the count of failed and banned ip addresses using [fail2ban](https://www.fail2ban.org/).

### [Filestat (filestat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/filestat)

The [Filestat (filestat) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/filestat) gathers metrics about file existence, size, and other stats.

### [Fluentd (fluentd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fluentd)

The [Fluentd (fluentd) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fluentd) gathers metrics from plugin endpoint provided by in_monitor plugin. This plugin understands
data provided by `/api/plugin.json` resource (`/api/config.json` is not covered).

### [Graylog (graylog_input)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/graylog)

The [Graylog (graylog_input) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/graylog) can collect data from remote Graylog service URLs. This plugin currently supports two
types of endpoints:

* multiple (e.g., `http://[graylog-server-ip]:12900/system/metrics/multiple`)
* namespace (e.g., `http://[graylog-server-ip]:12900/system/metrics/namespace/{namespace}`)

### [HAproxy (haproxy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/haproxy)

The [HAproxy (haproxy) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/haproxy) gathers metrics directly from any running HAproxy instance. It can do so by using CSV
generated by HAproxy status page or from admin sockets.

### [Hddtemp (hddtemp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/hddtemp)

The [Hddtemp (hddtemp) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/hddtemp) reads data from `hddtemp` daemons.

### [HTTP Listener (http_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_listener)

The [HTTP Listener (http_listener) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_listener) listens for messages sent via HTTP POST. Messages are expected in the InfluxDB
line protocol format ONLY (other Telegraf input data formats are not supported). The plugin allows Telegraf to serve
as a proxy/router for the `/write` endpoint of the InfluxDB HTTP API.

### [HTTP Response (http_response)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_response)

The [HTTP Response (http_response) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_response) gathers metrics for HTTP responses. The measurements and fields include `response_time`, `http_response_code`, and `result_type`. Tags for measurements include `server` and `method`.


### [InfluxDB (influxdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/influxdb)

The [InfluxDB (influxdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/influxdb) gathers metrics from the exposed `/debug/vars` endpoint.  Using Telegraf to extract these metrics to create a "monitor of monitors" is a best practice and allows you to reduce the overhead associated with
capturing and storing these metrics locally within the `_internal` database for production deployments.
[Read more about this approach here.](https://www.influxdata.com/blog/influxdb-debugvars-endpoint/)

### [Internal (internal)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/internal)



### [Interrupts (interrupts)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/interrupts)



### [IPMI Sensor (ipmi_sensor)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ipmi_sensor)



### [IPtables (iptables)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/iptables)



### [Jolokia2 (jolokia2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia2/README.md) -- NEW in v.1.5

The [Jolokia2 (jolokia2) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia2/README.md) collect JMX metrics from an HTTP endpoint using the
[Jolokia](https://jolokia.org/) [JSON-over-HTTP protocol](https://jolokia.org/reference/html/protocol.html).

### [Kafka Consumer (kafka_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kafka_consumer)

The [Kafka Consumer (kafka_consumer) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kafka_consumer) polls a specified Kafka topic and adds messages to InfluxDB.
Messages are expected in the line protocol format.
[Consumer Group](http://godoc.org/github.com/wvanbergen/kafka/consumergroup) is used to talk to the Kafka cluster so
multiple instances of Telegraf can read from the same topic in parallel.

### [Kapacitor (kapacitor)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kapacitor)

The [Kapacitor (kapacitor) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kapacitor) will collect metrics from the given Kapacitor instances.

### [Kubernetes (kubernetes)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kubernetes)

>***Note:*** The Kubernetes input plugin is experimental and may cause high cardinality issues with moderate to
large Kubernetes deployments.

The [Kubernetes (kubernetes) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kubernetes) talks to the kubelet API using the `/stats/summary` endpoint to gather metrics about the running pods
and containers for a single host. It is assumed that this plugin is running as part of a daemonset within a
Kubernetes installation. This means that Telegraf is running on every node within the cluster. Therefore, you
should configure this plugin to talk to its locally running kubelet.

### [Leofs (leofs)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/leofs)



### [Lustre2 (lustre2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/lustre2)

Lustre Jobstats allows for RPCs to be tagged with a value, such as a job's ID.  This allows for per job statistics.
The [Lustre2 (lustre2) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/lustre2) collects statistics and tags the data with the `jobid`.

### [Logparser (logparser)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/logparser)

The [Logparser (logparser) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/logparser) streams and parses the given logfiles. Currently, it has the capability of parsing "grok" patterns
from logfiles, which also supports regex patterns.


### [Mailchimp (mailchimp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mailchimp)



### [Memcached (memcached)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/memcached)

The [Memcached (memcached) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/memcached) gathers statistics data from a Memcached server.

### [Mesos (mesos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mesos)

The [Mesos (mesos) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mesos) gathers metrics from Mesos. For more information, please check the
[Mesos Observability Metrics](http://mesos.apache.org/documentation/latest/monitoring/) page.

### [Minecraft (minecraft)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/minecraft)

The [Minecraft (minecraft) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/minecraft) uses the RCON protocol to collect statistics from a scoreboard on a Minecraft server.

### [MongoDB (mongodb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mongodb)

The [MongoDB (mongodb) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mongodb) collects mongodb stats exposed by serverStatus and few more and create a single
measurement containing values.

### [MQTT Consumer (mqtt_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mqtt_consumer)

The [MQTT Consumer (mqtt_consumer) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mqtt_consumer) reads from specified MQTT topics and adds messages to InfluxDB. Messages are in the
Telegraf Input Data Formats.

### [MySQL (mysql)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mysql)

The [MySQL (mysql) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mysql) gathers the statistics data from MySQL servers.

### [NATS Consumer (nats_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nats_consumer)

The [NATS Consumer (nats_consumer) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nats_consumer) reads from specified NATS subjects and adds messages to InfluxDB. Messages are expected in the Telegraf Input Data Formats. A Queue Group is used when subscribing to subjects so multiple instances of Telegraf can read from a NATS cluster in parallel.

### [Network Response (net_response)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/net_response)

The [Network Response (net_response) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/net_response) tests UDP and TCP connection response time. It can also check response text.

### [NGINX (nginx)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx)

The [NGINX (nginx) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx) reads NGINX basic status information (`ngx_http_stub_status_module`).

### [NGINX Plus (nginx_plus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx_plus/README.md)  -- NEW in v.1.5

The [NGINX Plus (nginx_plus) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx_plus/README.md) is for NGINX Plus, the commercial version of the open source web server NGINX. To use this plugin you will need a license.
For more information, see [What’s the Difference between Open Source NGINX and NGINX Plus?](https://www.nginx.com/blog/whats-difference-nginx-foss-nginx-plus/).

Structures for NGINX Plus have been built based on history of [status module documentation](http://nginx.org/en/docs/http/ngx_http_status_module.html).

### [NSQ (nsq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq)


### [NSQ Consumer (nsq_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq_consumer)

The [NSQ Consumer (nsq_consumer) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq_consumer) polls a specified NSQD topic and adds messages to InfluxDB. This plugin allows a message to be in any of the supported data_format types.

### [Nstat (nstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nstat)

The [Nstat (nstat) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nstat) collects network metrics from `/proc/net/netstat`, `/proc/net/snmp`, and `/proc/net/snmp6` files.

### [NTPq (ntpq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ntpq)

The [NTPq (ntpq) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ntpq) gets standard NTP query metrics, requires ntpq executable.

### [OpenLDAP (openldap)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/openldap)

The [OpenLDAP (openldap) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/openldap) gathers metrics from OpenLDAP's `cn=Monitor` backend.

### [OpenSMTPD (opensmtpd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/opensmtpd/README.md) -- NEW in v1.5

The [OpenSMTPD (opensmtpd) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/opensmtpd/README.md) gathers stats from OpenSMTPD, a free implementation of the server-side SMTP protocol.

### [Particle.io Webhooks (particle)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks/particle/README.md) -- NEW in v1.5


### [Passenger (passenger)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/passenger)

The [Passenger (passenger) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/passenger) gets phusion passenger statistics using their command line utility `passenger-status`.

### [PF (pf)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/pf/README.md) -- NEW in v1.5

The [PF (pf) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/pf/README.md) gathers information from the FreeBSD/OpenBSD pf firewall. Currently it can retrive information about
the state table: the number of current entries in the table, and counters for the number of searches, inserts, and
removals to the table. The pf plugin retrieves this information by invoking the `pfstat` command.


### [PHP FPM (phpfpm)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/phpfpm)

The [PHP FPM (phpfpm) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/phpfpm) gets phpfpm statistics using either HTTP status page or fpm socket.

### [Ping (ping)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ping)

The [Ping (ping) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ping) measures the round-trip for ping commands, response time, and other packet statistics.

### [Postfix (postfix)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postfix/README.md) -- NEW in v1.5

The [Postfix (postfix) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postfix/README.md) reports metrics on the postfix queues. For each of the active, hold, incoming, maildrop, and
deferred [queues](http://www.postfix.org/QSHAPE_README.html#queues), it will report the queue length (number of items),
size (bytes used by items), and age (age of oldest item in seconds).

### [PostgreSQL (postgresql)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql)

The [PostgreSQL (postgresql) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql) provides metrics for your PostgreSQL database. It currently works with PostgreSQL versions 8.1+.
It uses data from the built in `pg_stat_database` and `pg_stat_bgwriter` views. The metrics recorded depend on your
version of postgres.

### [PostgreSQL Extensible (postgresql_extensible)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql_extensible)

This [PostgreSQL Extensible (postgresql_extensible) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql_extensible) provides metrics for your postgres database. It has been designed to parse
SQL queries in the plugin section of `telegraf.conf` files.

### [PowerDNS (powerdns)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/powerdns)

The [PowerDNS (powerdns) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/powerdns) gathers metrics about PowerDNS using UNIX sockets.

### [Procstat (procstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/procstat)

The [Procstat (procstat) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/procstat) can be used to monitor system resource usage by an individual process using their `/proc` data.

Processes can be specified either by `pid` file, by executable name, by command line pattern matching, by username,
by systemd unit name, or by cgroup name/path (in this order or priority). This plugin uses `pgrep` when an executable
name is provided to obtain the `pid`. The Procstat plugin transmits IO, memory, cpu, file descriptor-related
measurements for every process specified. A prefix can be set to isolate individual process specific measurements.

The plugin will tag processes according to how they are specified in the configuration. If a pid file is used, a
"pidfile" tag will be generated. On the other hand, if an executable is used an "exe" tag will be generated.

### [Prometheus (prometheus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/prometheus)

The [Prometheus (prometheus) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/prometheus) input plugin gathers metrics from HTTP servers exposing metrics in Prometheus format.

### [PuppetAgent (puppetagent)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/puppetagent)

The [PuppetAgent (puppetagent) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/puppetagent) collects variables outputted from the `last_run_summary.yaml` file usually
located in `/var/lib/puppet/state/` PuppetAgent Runs.

### [RabbitMQ (rabbitmq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rabbitmq)

The [RabbitMQ (rabbitmq) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rabbitmq) reads metrics from RabbitMQ servers via the [Management Plugin](https://www.rabbitmq.com/management.html).

### [Raindrops (raindrops)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/raindrops)

The [Raindrops (raindrops) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/raindrops) reads from specified Raindops [middleware](http://raindrops.bogomips.org/Raindrops/Middleware.html)
URI and adds the statistics to InfluxDB.

### [Redis (redis)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/redis)

The [Redis (redis) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/redis) gathers the results of the INFO Redis command. There are two separate measurements: `redis`
and `redis_keyspace`, the latter is used for gathering database-related statistics.

Additionally the plugin also calculates the hit/miss ratio (`keyspace_hitrate`) and the elapsed time since the last RDB
save (`rdb_last_save_time_elapsed`).

### [RethinkDB (rethinkdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rethinkdb)

The [RethinkDB (rethinkdb) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rethinkdb) works with RethinkDB 2.3.5+ databases that requires username, password authorization,
and Handshake protocol v1.0.

### [Riak (riak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/riak)

The [Riak (riak) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/riak) gathers metrics from one or more Riak instances.

### [Salesforce (salesforce)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/salesforce)

The [Salesforce (salesforce) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/salesforce) gathers metrics about the limits in your Salesforce organization and the remaining usage.
It fetches its data from the limits endpoint of the Salesforce REST API.

### [Sensors (sensors)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sensors)

The [Sensors (sensors) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sensors) collects collects sensor metrics with the sensors executable from the `lm-sensor` package.

### [SMART (smart)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/smart/README.md) -- NEW in v1.5

The [SMART (smart) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/smart/README.md) gets metrics using the command line utility `smartctl` for S.M.A.R.T. (Self-Monitoring, Analysis
and Reporting Technology) storage devices. SMART is a monitoring system included in computer hard disk drives (HDDs)
and solid-state drives (SSDs), which include most modern ATA/SATA, SCSI/SAS and NVMe disks. The plugin detects and
reports on various indicators of drive reliability, with the intent of enabling the anticipation of hardware failures.
See [smartmontools](https://www.smartmontools.org/).

### [SNMP (snmp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp)

The [SNMP (snmp) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp) gathers metrics from SNMP agents.

### [SNMP Legacy (snmp_legacy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp_legacy)

The SNMP Legacy input plugin gathers metrics from SNMP agents.

### [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/socket_listener)

The [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/socket_listener) listens 
for messages from streaming (tcp, unix) or datagram (UDP, unixgram) protocols. Messages are expected in the
[Telegraf Input Data Formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md).

### [Solr (solr)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/solr/README.md) -- NEW in v1.5

The [Solr (solr) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/solr/README.md) collects stats using the MBean Request Handler.

### [SQL Server (sqlserver)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sqlserver)

The [SQL Server (sqlserver) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sqlserver) provides metrics for your Microsoft SQL Server instance. It currently works with SQL Server
versions 2008+. Recorded metrics are lightweight and use Dynamic Management Views supplied by SQL Server.

### [StatsD (statsd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/statsd)

The [StatsD (statsd) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/statsd) is a special type of plugin which runs a backgrounded `stats`d listener service while Telegraf is running.
StatsD messages are formatted as described in the original [etsy statsd](https://github.com/etsy/statsd/blob/master/docs/metric_types.md) implementation.

### [Sysstat (sysstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sysstat)

The [Sysstat (sysstat) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sysstat) collects [sysstat](https://github.com/sysstat/sysstat) system metrics with the sysstat
collector utility `sadc` and parses the created binary data file with the `sadf` utility.

### [System (system)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/system)


### [Tail (tail)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tail)

The [Tail (tail) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tail) "tails" a logfile and parses each log message.

### [Teamspeak 3 (teamspeak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/teamspeak/README.md) -- NEW in v1.5

The [Teamspeak 3 (teamspeak) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/teamspeak/README.md) uses the Teamspeak 3 ServerQuery interface of the Teamspeak server to collect statistics of one or more virtual servers.

### [Tomcat (tomcat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tomcat)

The [Tomcat (tomcat) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tomcat) collects statistics available from the tomcat manager status page from
the `http://<host>/manager/status/all?XML=true` URL. (`XML=true` will return only XML data).
See the [Tomcat documentation](https://tomcat.apache.org/tomcat-9.0-doc/manager-howto.html#Server_Status) for
details of these statistics.

### [Trig (trig)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/trig)

### [Twemproxy (twemproxy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/twemproxy)

### [Unbound (unbound)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/unbound/README.md) -- NEW in v1.5

The [Unbound (unbound) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/unbound/README.md) gathers stats from [Unbound](https://www.unbound.net/), a validating, recursive, and
caching DNS resolver.

### [Varnish (varnish)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/varnish)

The [Varnish (varnish) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/varnish) gathers stats from [Varnish HTTP Cache](https://varnish-cache.org/).

### [Webhooks (webhooks)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks)

The [Webhooks (webhooks) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks) starts an HTTPS server and registers multiple webhook listeners.

### [Win_perf_counters (win_perf_counters)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_perf_counters)

The way the [Win_perf_counters (win_perf_counters) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_perf_counters) works is that on load of Telegraf, the plugin will be handed configuration
from Telegraf. This configuration is parsed and then tested for validity such as if the Object, Instance and Counter
existing. If it does not match at startup, it will not be fetched. Exceptions to this are in cases where you query for
all instances "". By default the plugin does not return `_Total` when it is querying for all () as this is redundant.

### [Win_services (win_services)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_services)

The [Win_services (win_services) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_services) reports Windows services info.

### [ZFS (zfs)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zfs)

The [ZFS (zfs) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zfs) provides metrics from your ZFS filesystems. It supports ZFS on Linux and FreeBSD.
It gets ZFS statistics from `/proc/spl/kstat/zfs` on Linux and from `sysctl` and `zpool` on FreeBSD.

### [Zipkin (zipkin)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zipkin)

The [Zipkin (zipkin) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zipkin) implements the Zipkin HTTP server to gather trace and timing data needed to troubleshoot latency problems in microservice architectures.

> ***Note:*** This plugin is experimental. Its data schema may be subject to change based on its main usage cases and the evolution of the OpenTracing standard.

### [Zookeeper (zookeeper)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zookeeper)

The [Zookeeper (zookeeper) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zookeeper) collects variables outputted from the `mntr` command [Zookeeper Admin](https://zookeeper.apache.org/doc/trunk/zookeeperAdmin.html).

## Deprecated input plugins

### [HTTP JSON (httpjson)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/httpjson)

The [HTTP JSON (httpjson) input plugin](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/httpjson)n collects data from HTTP URLs which respond with JSON. It flattens the JSON and
finds all numeric values, treating them as floats. Deprecated (1.6): use the [http input]().

### [Jolokia (jolokia)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia)

Deprecated in version 1.5: Please use the [Jolokia2](#jolokia2-jolokia2-https-github-com-influxdata-telegraf-tree-release-1-5-plugins-inputs-jolokia2-readme-md-new-in-v-1-5) plugin.

### [TCP Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tcp_listener)

DEPRECATED: As of version 1.3, the TCP listener plugin has been deprecated in favor of the [Socket Listener](#socket-listener-https-github-com-influxdata-telegraf-tree-release-1-5-plugins-inputs-socket-listener) plugin.

### [UDP Listener (udp_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/udp_listener)

DEPRECATED: As of version 1.3, the UDP listener plugin has been deprecated in favor of the [Socket Listener](#socket-listener-https-github-com-influxdata-telegraf-tree-release-1-5-plugins-inputs-socket-listener) plugin.
