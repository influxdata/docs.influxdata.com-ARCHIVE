---
title: Supported Collection Plugins

menu:
  telegraf_02:
    name: Collection Plugins
    identifier: plugins
    weight: 20
---

Telegraf is entirely plugin driven. It gathers all metrics from the plugins specified in the configuration file.

## Usage Instructions

View usage instructions for each collection plugin by running `telegraf -usage <pluginname>`.

## Supported Collection Plugin List

* [aerospike](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/aerospike)
* [apache](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/apache)
* [bcache](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/bcache)
* [disque](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/disque)
* [elasticsearch](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/elasticsearch)
* [exec](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/exec) (generic JSON-emitting executable plugin)
* [haproxy](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/haproxy)
* [httpjson](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/httpjson) (generic JSON-emitting http service plugin)
* [jolokia](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/jolokia) (remote JMX with JSON over HTTP)
* [leofs](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/leofs)
* [lustre2](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/lustre2)
* [mailchimp](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/mailchimp)
* [memcached](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/memcached)
* [mongodb](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/mongodb)
* [mysql](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/mysql)
* [nginx](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/nginx)
* [phpfpm](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/phpfpm)
* [ping](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/ping)
* [postgresql](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/postgresql)
* [procstat](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/procstat)
* [prometheus](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/prometheus)
* [puppetagent](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/puppetagent)
* [rabbitmq](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/rabbitmq)
* [redis](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/redis)
* [rethinkdb](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/rethinkdb)
* [twemproxy](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/twemproxy)
* [zfs](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/zfs)
* [zookeeper](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/zookeeper)
* [system](https://github.com/influxdb/telegraf/tree/master/plugins/inputs/system)
    * cpu
    * mem
    * io
    * net
    * netstat
    * disk
    * swap
