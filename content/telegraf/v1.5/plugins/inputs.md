---
title: Telegraf input plugins

menu:
  telegraf_1_5:
    name: Input
    identifier: inputs
    weight: 130
    parent: plugins
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Usage instructions

View usage instructions for each service input by running `telegraf --usage <service-input-name>`.


## Supported input plugins


### [Aerospike (aerospike)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/aerospike)



### [AMQP Consumer (amqp_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/amqp_consumer)



### [Apache (apache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/apache)



### [Bcache (bcache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bcache)


### [Bond (bond)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bond)

The Bond input plugin collects network bond interface status, bond's slaves interfaces status and failures count of bond's slaves interfaces. The plugin collects these metrics from /proc/net/bonding/* files.

### [Cassandra (cassandra)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cassandra)



### [Ceph (ceph)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ceph)



### [CGroup (cgroup)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cgroup)

### [Chrony (chrony)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/chrony)



### [CloudWatch (cloudwatch)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/cloudwatch)



### [Conntrack (conntrack)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/conntrack)



### [Consul (consul)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/consul)


### [Couchbase (couchbase)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchbase)



### [CouchDB (couchdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/couchdb)


### [DC/OS (dcos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dcos)

This input plugin gathers metrics from a DC/OS cluster's [metrics component](https://docs.mesosphere.com/1.10/metrics/).

### [Disque (disque)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/disque)



### [DMCache (dmcache)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dmcache)



### [DNS query time (dns_query_time)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dns_query)



### [Docker (docker)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/docker)



### [Dovecot (dovecot)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dovecot)



### [Elasticsearch (elasticsearch)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/elasticsearch)



### [Exec (exec)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/exec)



### [Fail2ban (fail2ban)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fail2ban)

### [Filestat (filestat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/filestat)



### [Fluentd (fluentd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/fluentd)



### [Graylog (graylog_input)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/graylog)



### [HAproxy (haproxy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/haproxy)



### [Hddtemp (hddtemp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/hddtemp)



### [HTTP JSON (httpjson)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/httpjson)


### [HTTP Listener (http_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_listener)

The HTTP Listener service input plugin listens for messages sent via HTTP POST. Messages are expected in the InfluxDB line protocol format ONLY (other Telegraf input data formats are not supported). The plugin allows Telegraf to serve as a proxy/router for the `/write` endpoint of the InfluxDB HTTP API.

### [HTTP Response (http_response)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/http_response)



### [InfluxDB (influxdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/influxdb)



### [Internal (interal)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/internal)



### [Interrupts (interrupts)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/interrupts)



### [IPMI Sensor (ipmi_sensor)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ipmi_sensor)



### [IPtables (iptables)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/iptables)



### [Jolokia2 (jolokia2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia2/README.md)

The [Jolokia](https://jolokia.org/) agent and proxy input plugins collect JMX metrics from an HTTP endpoint using Jolokia's [JSON-over-HTTP protocol](https://jolokia.org/reference/html/protocol.html).

### [Kafka Consumer (kafka_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kafka_consumer)

The [Kafka](http://kafka.apache.org) Consumer plugin polls a specified Kafka topic and adds messages to InfluxDB. Messages are expected in the line protocol format. [Consumer Group](http://godoc.org/github.com/wvanbergen/kafka/consumergroup) is used to talk to the Kafka cluster so multiple instances of Telegraf can read from the same topic in parallel.

### [Kapacitor (kapacitor)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kapacitor)



### [Kubernetes (kubernetes)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/kubernetes)



### [Leofs (leofs)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/leofs)



### [Lustre2 (lustre2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/lustre2)



### [Logparser (logparser)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/logparser)

The Logparser plugin streams and parses the given logfiles. Currently, it has the capability of parsing "grok" patterns from logfiles, which also supports regex patterns.


### [Mailchimp (mailchimp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mailchimp)



### [Memcached (memcached)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/memcached)



### [Mesos (mesos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mesos)



### [Minecraft (minecraft)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/minecraft)



### [MongoDB (mongodb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mongodb)



### [MQTT Consumer (mqtt_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mqtt_consumer)

The MQTT Consumer plugin reads from specified MQTT topics and adds messages to InfluxDB. Messages are in the Telegraf Input Data Formats.

### [MySQL (mysql)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/mysql)



### [NATS Consumer (nats_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nats_consumer)

The NATS Consumer plugin reads from specified NATS subjects and adds messages to InfluxDB. Messages are expected in the Telegraf Input Data Formats. A Queue Group is used when subscribing to subjects so multiple instances of Telegraf can read from a NATS cluster in parallel.

### [Net_response (net_response)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/net_response)



### [Nginx (nginx)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx)


### [Nginx Plus (nginx_plus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx_plus/README.md)

Nginx Plus is a commercial version of the open source web server Nginx. To use this plugin you will need a license. For more information, see [What’s the Difference between Open Source NGINX and NGINX Plus?](https://www.nginx.com/blog/whats-difference-nginx-foss-nginx-plus/).

Structures for Nginx Plus have been built based on history of [status module documentation](http://nginx.org/en/docs/http/ngx_http_status_module.html).

### [NSQ (nsq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq)



### [NSQ Consumer (nsq_consumer)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nsq_consumer)

The NSQ Consumer plugin polls a specified NSQD topic and adds messages to InfluxDB. This plugin allows a message to be in any of the supported data_format types.

### [Nstat (nstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nstat)



### [NTPq (ntpq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ntpq)


### [OpenLDAP (openldap)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/openldap)



### [OpenSMTPD (opensmtpd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/opensmtpd/README.md)

This plugin gathers stats from OpenSMTPD - a FREE implementation of the server-side SMTP protocol.

### [Particle Webhooks (particle)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks/particle/README.md)




### [Passenger (passenger)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/passenger)


### [PF (pf)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/pf/README.md)

The PF plugin gathers information from the FreeBSD/OpenBSD pf firewall. Currently it can retrive information about the state table: the number of current entries in the table, and counters for the number of searches, inserts, and removals to the table. The pf plugin retrieves this information by invoking the pfstat command.


### [PHP FPM (phpfpm)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/phpfpm)



### [Ping (ping)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/ping)



### [Postfix (postfix)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postfix/README.md)

The postfix plugin reports metrics on the postfix queues. For each of the active, hold, incoming, maildrop, and deferred [queues](http://www.postfix.org/QSHAPE_README.html#queues), it will report the queue length (number of items), size (bytes used by items), and age (age of oldest item in seconds).

### [PostgreSQL (postgresql)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql)



### [PostgreSQL Extensible (postgresql_extensible)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postgresql_extensible)



### [PowerDNS (powerdns)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/powerdns)



### [Procstat (procstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/procstat)


### [Prometheus (prometheus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/prometheus)



### [Puppetagent (puppetagent)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/puppetagent)



### [Salesforce (salesforce)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/salesforce)



### [RabbitMQ (rabbitmq)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rabbitmq)

### [Raindrops (raindrops)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/raindrops)



### [Redis (redis)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/redis)



### [RethinkDB (rethinkdb)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/rethinkdb)



### [Riak (riak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/riak)



### [Sensors (sensors)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sensors)


### [SMART (smart)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/smart/README.md)

Get metrics using the command line utility smartctl for S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology) storage devices. SMART is a monitoring system included in computer hard disk drives (HDDs) and solid-state drives (SSDs)[1] that detects and reports on various indicators of drive reliability, with the intent of enabling the anticipation of hardware failures. See [smartmontools](https://www.smartmontools.org/).

### [SNMP (snmp)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp)



### [SNMP Legacy (snmp_legacy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/snmp_legacy)


### [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/socket_listener)

The Socket Listener is a service input plugin that listens for messages from streaming (tcp, unix) or datagram (udp, unixgram) protocols. Messages are expected in the [Telegraf Input Data Formats](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md).

### [Solr (solr)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/solr/README.md)

The Solr plugin collects stats via the MBean Request Handler.

### [SQL Server (sql_server)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sqlserver)



### [StatsD (statsd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/statsd)

The StatsD plugin is a special type of plugin which runs a backgrounded statsd listener service while Telegraf is running. StatsD messages are formatted as described in the original [etsy statsd](https://github.com/etsy/statsd/blob/master/docs/metric_types.md) implementation.



### [Sysstat (sysstat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/sysstat)



### [System (system)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/system)



### [Tail (tail)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tail)

The Tail plugin "tails" a logfile and parses each log message.


### [Teamspeak 3 (teamspeak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/teamspeak/README.md)

This plugin uses the Teamspeak 3 ServerQuery interface of the Teamspeak server to collect statistics of one or more virtual servers.

### [Tomcat (tomcat)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tomcat)



### [Trig (trig)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/trig)



### [Twemproxy (twemproxy)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/twemproxy)



### [Unbound (unbound)](./plugins/inputs/unbound/README.md)



### [Varnish (varnish)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/varnish)



### [Webhooks (webhooks)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks)

The Webhooks service plugin start an HTTPS server and registers multiple webhook listeners.


### [Win_perf_counters (win_perf_counters)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_perf_counters)



### [Win_services (win_services)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/win_services)


### [ZFS (zfs)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zfs)



### [Zipkin (zipkin)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zipkin)


### [Zookeeper" (zookeeper)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/zookeeper)


## Deprecated input plugins

### [Jolokia (jolokia)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia)

Deprecated in version 1.5: Please use the jolokia2 plugin.

### [TCP Listener](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/tcp_listener)

DEPRECATED: As of version 1.3 the TCP listener plugin has been deprecated in favor of the Socket Listener plugin.


### [UDP Listener (udp_listener)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/udp_listener)

DEPRECATED: As of version 1.3 the UDP listener plugin has been deprecated in favor of the Socket Listener plugin.
