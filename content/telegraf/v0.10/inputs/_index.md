---
title: Supported Input Plugins

menu:
  telegraf_010:
    name: Input Plugins
    identifier: inputs
    weight: 20
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Usage Instructions

View usage instructions for each input by running `telegraf -usage <input-name>`.

## Supported Input Plugins

* [Aerospike](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/aerospike)
* [Apache](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/apache)
* [bcache](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/bcache)
* [CouchDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/couchdb)
* [Disque](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/disque)
* [Docker](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/docker)
* [Dovecot](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/dovecot)
* [Elasticsearch](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/elasticsearch)
* [exec](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/exec) (generic JSON-emitting executable plugin)
* [HAProxy](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/haproxy)
* [HTTPJSON](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/httpjson) (generic JSON-emitting http service plugin)
* [InfluxDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/influxdb)
* [Jolokia](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/jolokia) (remote JMX with JSON over HTTP)
* [LeoFS](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/leofs)
* [Lustre2](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/lustre2)
* [Mailchimp](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mailchimp)
* [Memcached](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/memcached)
* [MongoDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mongodb)
* [MySQL](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mysql)
* [NGINX](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nginx)
* [NSQ](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nsq)
* [PHP-FPM](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/phpfpm)
* [Phusion Passenger](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/passenger)
* [ping](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ping)
* [PostgreSQL](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/postgresql)
* [procstat](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/procstat)
* [Prometheus](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/prometheus)
* [Puppet Agent](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/puppetagent)
* [RabbitMQ](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/rabbitmq)
* [raindrops](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/raindrops)
* [Redis](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/redis)
* [RethinkDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/rethinkdb)
* [sensors](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/sensors)
* [snmp](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/snmp)
* [SQL server (Microsoft)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/sqlserver)
* [system](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) (cpu, mem, net, netstat, disk, diskio, swap)
* [trig](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/trig)
* [twemproxy (nutcracker)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/twemproxy)
* [Windows performance counters](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/win_perf_counters)
* [ZFS](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/zfs)
* [Zookeeper](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/zookeeper)
