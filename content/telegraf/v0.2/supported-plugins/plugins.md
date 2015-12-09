---
title: Plugins

menu:
  telegraf_02:
    name: Plugins
    weight: 0
    parent: Supported Plugins and Service Plugins
---

## Supported Plugins

Telegraf currently supports collecting metrics from:

* [aerospike](https://github.com/influxdb/telegraf/tree/master/plugins/aerospike)
* [apache](https://github.com/influxdb/telegraf/tree/master/plugins/apache)
* [bcache](https://github.com/influxdb/telegraf/tree/master/plugins/bcache)
* [disque](https://github.com/influxdb/telegraf/tree/master/plugins/disque)
* [elasticsearch](https://github.com/influxdb/telegraf/tree/master/plugins/elasticsearch)
* [exec](https://github.com/influxdb/telegraf/tree/master/plugins/exec) (generic JSON-emitting executable plugin)
* [haproxy](https://github.com/influxdb/telegraf/tree/master/plugins/haproxy)
* [httpjson](https://github.com/influxdb/telegraf/tree/master/plugins/httpjson) (generic JSON-emitting http service plugin)
* [jolokia](https://github.com/influxdb/telegraf/tree/master/plugins/jolokia) (remote JMX with JSON over HTTP)
* [leofs](https://github.com/influxdb/telegraf/tree/master/plugins/leofs)
* [lustre2](https://github.com/influxdb/telegraf/tree/master/plugins/lustre2)
* [mailchimp](https://github.com/influxdb/telegraf/tree/master/plugins/mailchimp)
* [memcached](https://github.com/influxdb/telegraf/tree/master/plugins/memcached)
* [mongodb](https://github.com/influxdb/telegraf/tree/master/plugins/mongodb)
* [mysql](https://github.com/influxdb/telegraf/tree/master/plugins/mysql)
* [nginx](https://github.com/influxdb/telegraf/tree/master/plugins/nginx)
* [phpfpm](https://github.com/influxdb/telegraf/tree/master/plugins/phpfpm)
* [ping](https://github.com/influxdb/telegraf/tree/master/plugins/ping)
* [postgresql](https://github.com/influxdb/telegraf/tree/master/plugins/postgresql)
* [procstat](https://github.com/influxdb/telegraf/tree/master/plugins/procstat)
* [prometheus](https://github.com/influxdb/telegraf/tree/master/plugins/prometheus)
* [puppetagent](https://github.com/influxdb/telegraf/tree/master/plugins/puppetagent)
* [rabbitmq](https://github.com/influxdb/telegraf/tree/master/plugins/rabbitmq)
* [redis](https://github.com/influxdb/telegraf/tree/master/plugins/redis)
* [rethinkdb](https://github.com/influxdb/telegraf/tree/master/plugins/rethinkdb)
* [twemproxy](https://github.com/influxdb/telegraf/tree/master/plugins/twemproxy)
* [zfs](https://github.com/influxdb/telegraf/tree/master/plugins/zfs)
* [zookeeper](https://github.com/influxdb/telegraf/tree/master/plugins/zookeeper)
* [system](https://github.com/influxdb/telegraf/tree/master/plugins/system)
	* cpu
    * mem
    * io
    * net
    * netstat
    * disk
    * swap

## Usage Instructions

View usage instructions for each plugin by running `telegraf -usage <pluginname>`.




