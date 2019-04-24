---
title: Using pre-created dashboards in Chronograf
description: Preconfigured dashboards can quickly be used to display metrics for popular applications, including Apache, Consul, Docker, Elasticsearch, InfluxDB, Mesos, MySQL, NGINX, PostgreSQL, RabbitMQ, Redis, and more
menu:
  chronograf_1_7:
    name: Using pre-created dashboards
    weight: 10
    parent: Guides
---


## Overview

Pre-created dashboards are delivered with Chronograf depending on which Telegraf input plugins you have enabled and are available from the Host List page. These dashboards, which are built in and not editable, include cells with data visualizations for metrics that are relevant to data sources you are likely to be using.

> Note that these pre-created dashboards cannot be cloned or customized. They appear only  as part of the Host List view and are associated with metrics gathered from a single host. Dashboard templates are also available and deliver a solid starting point for customizing your own unique dashboards based on the Telegraf plugins enabled and operate across one or more hosts.  For details, see [Dashboard templates](/chronograf/latest/guides/create-a-dashboard/#dashboard-templates).

## Requirements

The pre-created dashboards automatically appear in the Host List page to the right of hosts based on which Telegraf input plugins you have enabled. Check the list below for applications that you are interested in using and make sure that you have the required Telegraf input plugins enabled.

## Using pre-created dashboards

Pre-created dashboards are delivered in Chronograf installations and are ready to be used when you have the required Telegraf input plugins enabled.

**To view a pre-created dashboard:**

1. Open Chronograf in your web browser and click **Host List** in the navigation bar.
2. Select an application listed under **Apps**. By default, the system `app` should be listed next to a host listing. Other apps appear depending on the Telegraf input plugins that you have enabled.
3. The selected application appears in a page showing all of the pre-created cells, based on the measurements that are available.

## Creating or editing dashboards

The pre-created dashboards available for use with Chronograf are listed below as Apps and appear in the Apps listing for hosts in the Host List page.  The listings for apps (pre-created dashboards) on this page include information about the required Telegraf input plugins, JSON files included in the apps, and listings of the cell titles that are included in each of the JSON files.

The JSON files for the precreated dashboards are delivered on installation in the `/usr/share/chronograf/canned` directory. Information about the  configuration option `--canned-path` can be found in the [Chronograf configuration options](/chronograf/latest/administration/config-options/#) page.

You can enable and disable applications in your [Telegraf configuration file](https://github.com/influxdata/telegraf/blob/master/etc/telegraf.conf).
See [Telegraf configuration](https://github.com/influxdata/telegraf/blob/master/docs/CONFIGURATION.md) for details.

## Apps (pre-created dashboards):

* [apache](#apache)
* [consul](#consul)
* [docker](#docker)
* [elasticsearch](#elasticsearch)
* [haproxy](#haproxy)
* [iis](#iis)
* [influxdb](#influxdb)
* [kubernetes](#kubernetes)
* [memcached](#memcached-memcached)
* [mesos](#mesos)
* [mysql](#mysql)
* [nginx](#nginx)
* [nsq](#nsq)
* [phpfpm](#phpfpm)
* [ping](#ping)
* [postgresql](#postgresql)
* [rabbitmq](#rabbitmq)
* [redis](#redis)
* [riak](#riak)
* [system](#system)
* [varnish](#varnish)
* [win_system](#win-system)

## apache

**Required Telegraf plugin:** [Apache input plugin](/telegraf/latest/plugins/inputs/#apache-http-server)

`apache.json`

* "Apache Bytes/Second"
* "Apache - Requests/Second"
* "Apache - Total Accesses"

## consul

**Required Telegraf plugin:** [Consul input plugin](/telegraf/latest/plugins/inputs/#consul)

`consul_http.json`

* "Consul - HTTP Request Time (ms)"

`consul_election.json`

* "Consul - Leadership Election"

`consul_cluster.json`

* "Consul - Number of Agents"

`consul_serf_events.json`

* "Consul - Number of serf events"

## docker

**Required Telegraf plugin:** [Docker input plugin](/telegraf/latest/plugins/inputs/#docker)

`docker.json`

* "Docker - Container CPU %"
* "Docker - Container Memory (MB)"
* "Docker - Containers"
* "Docker - Images"
* "Docker - Container State"

`docker_blkio.json`

* "Docker - Container Block IO"

`docker_net.json`

* "Docker - Container Network"

## elasticsearch

**Required Telegraf plugin:** [Elasticsearch input plugin](/telegraf/latest/plugins/inputs/#elasticsearch)

`elasticsearch.json`

* "ElasticSearch - Query Throughput"
* "ElasticSearch - Open Connections"
* "ElasticSearch - Query Latency"
* "ElasticSearch - Fetch Latency"
* "ElasticSearch - Suggest Latency"
* "ElasticSearch - Scroll Latency"
* "ElasticSearch - Indexing Latency"
* "ElasticSearch - JVM GC Collection Counts"
* "ElasticSearch - JVM GC Latency"
* "ElasticSearch - JVM Heap Usage"

## haproxy

**Required Telegraf plugin:** [HAProxy input plugin](/telegraf/latest/plugins/inputs/#haproxy)

`haproxy.json`

  * "HAProxy - Number of Servers"
  * "HAProxy - Sum HTTP 2xx"
  * "HAProxy - Sum HTTP 4xx"
  * "HAProxy - Sum HTTP 5xx"
  * "HAProxy - Frontend HTTP Requests/Second"
  * "HAProxy - Frontend Sessions/Second"
  * "HAProxy - Frontend Session Usage %"
  * "HAProxy - Frontend Security Denials/Second"
  * "HAProxy - Frontend Request Errors/Second"
  * "HAProxy - Frontend Bytes/Second"
  * "HAProxy - Backend Average Response Time (ms)"
  * "HAProxy - Backend Connection Errors/Second"
  * "HAProxy - Backend Queued Requests/Second"
  * "HAProxy - Backend Average Request Queue Time (ms)"
  * "HAProxy - Backend Error Responses/Second"

## iis

**Required Telegraf plugin:** [Windows Performance Counters input plugin](/telegraf/v1.8/plugins/inputs/#windows-performance-counters)

`win_websvc.json`

  * "IIS - Service"

## influxdb

**Required Telegraf plugin:** [InfluxDB input plugin](/telegraf/latest/plugins/inputs/#influxdb-v-1)

`influxdb_database.json`

  * "InfluxDB - Cardinality"

`influxdb_httpd.json`

  * "InfluxDB - Write HTTP Requests"
  * "InfluxDB - Query Requests"
  * "InfluxDB - Client Failures"

`influxdb_queryExecutor.json`

  * "InfluxDB - Query Performance"

`influxdb_write.json`

  * "InfluxDB - Write Points"
  * "InfluxDB - Write Errors"

## kubernetes

`kubernetes_node.json`

* "K8s - Node Millicores"
* "K8s - Node Memory Bytes"

`kubernetes_pod_container.json`

* "K8s - Pod Millicores"
* "K8s - Pod Memory Bytes"

`kubernetes_pod_network.json`

* "K8s - Pod TX Bytes/Second"
* "K8s - Pod RX Bytes/Second "

`kubernetes_system_container.json`

* "K8s - Kubelet Millicores"
* "K8s - Kubelet Memory Bytes"

## Memcached (`memcached`)

**Required Telegraf plugin:** [Memcached input plugin](/telegraf/latest/plugins/inputs/#memcached)

`memcached.json`

  * "Memcached - Current Connections"
  * "Memcached - Get Hits/Second"
  * "Memcached - Get Misses/Second"
  * "Memcached - Delete Hits/Second"
  * "Memcached - Delete Misses/Second"
  * "Memcached - Incr Hits/Second"
  * "Memcached - Incr Misses/Second"
  * "Memcached - Current Items"
  * "Memcached - Total Items"
  * "Memcached - Bytes Stored"
  * "Memcached - Bytes Written/Sec"
  * "Memcached - Evictions/10 Seconds"


## mesos

**Required Telegraf plugin:** [Mesos input plugin](/telegraf/latest/plugins/inputs/#mesos)

`mesos.json`

  * "Mesos Active Slaves"
  * "Mesos Tasks Active"
  * "Mesos Tasks"
  * "Mesos Outstanding offers"
  * "Mesos Available/Used CPUs"
  * "Mesos Available/Used Memory"
  * "Mesos Master Uptime"


## mongodb

**Required Telegraf plugin:** [MongoDB input plugin](/telegraf/latest/plugins/inputs/#mongodb)

`mongodb.json`

  * "MongoDB - Read/Second"
  * "MongoDB - Writes/Second"
  * "MongoDB - Active Connections"
  * "MongoDB - Reds/Writes Waiting in Queue"
  * "MongoDB - Network Bytes/Second"

## mysql

**Required Telegraf plugin:** [MySQL input plugin](/telegraf/latest/plugins/inputs/#mysql)

`mysql.json`

  * "MySQL - Reads/Second"
  * "MySQL - Writes/Second"
  * "MySQL - Connections/Second"
  * "MySQL - Connection Errors/Second"

## nginx

**Required Telegraf plugin:** [NGINX input plugin](/telegraf/latest/plugins/inputs/#nginx)

`nginx.json`

  * "NGINX - Client Connections"
  * "NGINX - Client Errors"
  * "NGINX - Client Requests"
  * "NGINX - Active Client State"

## nsq

**Required Telegraf plugin:** [NSQ input plugin](/telegraf/latest/plugins/inputs/#nsq)

`nsq_channel.json`

  * "NSQ - Channel Client Count"
  * "NSQ - Channel Messages Count"

`nsq_server.json`

  * "NSQ - Topic Count"
  * "NSQ - Server Count"

`nsq_topic.json`

  * "NSQ - Topic Messages"
  * "NSQ - Topic Messages on Disk"
  * "NSQ - Topic Ingress"
  * "NSQ topic egress"

## phpfpm

**Required Telegraf plugin:** [PHPfpm input plugin](/telegraf/latest/plugins/inputs/#php-fpm)

`phpfpm.json`

  * "phpfpm - Accepted Connections"
  * "phpfpm - Processes"
  * "phpfpm - Slow Requests"
  * "phpfpm - Max Children Reached"


## ping

**Required Telegraf plugin:** [Ping input plugin](/telegraf/latest/plugins/inputs/#ping)

`ping.json`

  * "Ping - Packet Loss Percent"
  * "Ping - Response Times (ms)"

## postgresql

**Required Telegraf plugin:** [PostgreSQL input plugin](/telegraf/latest/plugins/inputs/#postgresql)

`postgresql.json`

  * "PostgreSQL - Rows"
  * "PostgreSQL - QPS"
  * "PostgreSQL - Buffers"
  * "PostgreSQL - Conflicts/Deadlocks"

## rabbitmq

**Required Telegraf plugin:** [RabbitMQ input plugin](/telegraf/latest/plugins/inputs/#rabbitmq)

`rabbitmq.json`

  * "RabbitMQ - Overview"
  * "RabbitMQ - Published/Delivered per second"
  * "RabbitMQ - Acked/Unacked per second"


## redis

**Required Telegraf plugin:** [Redis input plugin](/telegraf/latest/plugins/inputs/#redis)


`redis.json`

  * "Redis - Connected Clients"
  * "Redis - Blocked Clients"
  * "Redis - CPU"
  * "Redis - Memory"

## riak

**Required Telegraf plugin:** [Riak input plugin](/telegraf/latest/plugins/inputs/#riak)


`riak.json`

  * "Riak - Toal Memory Bytes"
  * "Riak - Object Byte Size"
  * "Riak - Number of Siblings/Minute"
  * "Riak - Latency (ms)"
  * "Riak - Reads and Writes/Minute"
  * "Riak - Active Connections"
  * "Riak - Read Repairs/Minute"

## system

 The `system` application includes metrics that require all of the listed plugins. If any of the following plugins aren't enabled, the metrics associated with the plugins will not display data.

### cpu

**Required Telegraf plugin:** [CPU input plugin](/telegraf/latest/plugins/inputs/#cpu)

`cpu.json`

  * "CPU Usage"

### disk

`disk.json`

**Required Telegraf plugin:** [Disk input plugin](/telegraf/latest/plugins/inputs/#disk)

  * "System - Disk used %"

### diskio

**Required Telegraf plugin:** [DiskIO input plugin](/telegraf/latest/plugins/inputs/#diskio)

`diskio.json`

  * "System - Disk MB/s"
*

### mem

**Required Telegraf plugin:** [Mem input plugin](/telegraf/latest/plugins/inputs/#mem)

`mem.json`

  * "System - Memory Gigabytes Used"

### net

**Required Telegraf plugin:** [Net input plugin](/telegraf/latest/plugins/inputs/#net)

`net.json`

  * "System - Network Mb/s"
  * "System - Network Error Rate"

### netstat

**Required Telegraf plugin:** [Netstat input plugin](/telegraf/latest/plugins/inputs/#netstat)

`netstat.json`

  * "System - Open Sockets"
  * "System - Sockets Created/Second"

### processes

**Required Telegraf plugin:** [Processes input plugin](/telegraf/latest/plugins/inputs/#processes)

`processes.json`

  * "System - Total Processes"

### procstat

**Required Telegraf plugin:** [Procstat input plugin](/telegraf/latest/plugins/inputs/#procstat)

`procstat.json`

  * "Processes - Resident Memory (MB)"
  * "Processes – CPU Usage %"

### system

**Required Telegraf plugin:** [Procstat input plugin](/telegraf/latest/plugins/inputs/#procstat)

`load.json`

  * "System Load"

## varnish

**Required Telegraf plugin:** [Varnish](/telegraf/latest/plugins/inputs/#varnish)

`varnish.json`

  * "Varnish - Cache Hits/Misses"


## win_system

**Required Telegraf plugin:** [Windows Performance Counters input plugin](/telegraf/latest/plugins/inputs/#windows-performance-counters)

`win_cpu.json`

  * "System - CPU Usage"

`win_mem.json`

  * "System - Available Bytes"

`win_net.json`

  * "System - TX Bytes/Second"
  * "RX Bytes/Second"

`win_system.json`

  * "System - Load"
