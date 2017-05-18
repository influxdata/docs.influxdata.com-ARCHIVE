---
title: Frequently Asked Questions (FAQ)
menu:
  chronograf_1_3:
    weight: 0
    parent: Troubleshooting
---

* [What Kapacitor event handlers are supported in Chronograf?](#what-kapacitor-event-handlers-are-supported-in-chronograf)
* [What applications are supported in Chronograf?](#what-applications-are-supported-in-chronograf)
* [How do I connect Chronograf to an InfluxEnterprise cluster?](#how-do-i-connect-chronograf-to-an-influxenterprise-cluster)
* [What visualization types does Chronograf support?](#what-visualization-types-does-chronograf-support)
* [What does the status column indicate on the Host List page?](#what-does-the-status-column-indicate-on-the-host-list-page)
* [Why is my host's status red when data are still arriving?](#why-is-my-host-s-status-red-when-data-are-still-arriving)

### Known Issues

* [Why is my query's field key order inconsistent?](#why-is-my-query-s-field-key-order-inconsistent)
* [Why does the query builder break after I add my template variable to a query?](#why-does-the-query-builder-break-after-i-add-my-template-variable-to-a-query)

## What Kapacitor event handlers are supported in Chronograf?

Chronograf integrates with [Kapacitor](/kapacitor/v1.2/), InfluxData's data processing platform, to send alert messages to event handlers.
Chronograf supports the following event handlers:

* Alerta
* Exec
* HipChat
* HTTP/Post
* OpsGenie
* PagerDuty
* Sensu
* Slack
* SMTP/Email
* Talk
* Telegram
* TCP
* VictorOps

To configure a Kapacitor event handler in Chronograf, [install Kapacitor](/chronograf/v1.3/introduction/getting-started/#kapacitor-setup) and [connect it to Chronograf](/chronograf/v1.3/introduction/getting-started/#4-connect-chronograf-to-kapacitor).
The Configure Kapacitor page includes the event handler configuration options; see the [Configure Kapacitor Event Handlers](/chronograf/v1.3/guides/configure-kapacitor-event-handlers/) guide for more information.

## What applications are supported in Chronograf?

Chronograf offers pre-created dashboards for several [Telegraf](/telegraf/v1.3/) input plugins/applications.
We list those applications below and link to their Telegraf documentation:

* [Apache](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/apache)
* [Consul](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/consul)
* [Docker](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/docker)
* [Elastic](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/elasticsearch)
* etcd
* [HAProxy](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/haproxy)
* IIS
* [InfluxDB](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/influxdb)
* [Kubernetes](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/kubernetes)
* [Memcached](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/memcached)
* [Mesos](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mesos)
* [MongoDB](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mongodb)
* [MySQL](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/mysql)
* Network
* [NGINX](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/nginx)
* [NSQ](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/nsq)
* [PHPfpm](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/phpfpm)
* [Ping](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/ping)
* [PostgreSQL](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/postgresql)
* Processes
* [RabbitMQ](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/rabbitmq)
* [Redis](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/redis)
* [Riak](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/riak)
* [System](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/SYSTEM_README.md)
    * [CPU](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/CPU_README.md)
    * [Disk](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/DISK_README.md)
    * [DiskIO](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/disk.go#L136)
    * [Memory](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/MEM_README.md)
    * [Net](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/net.go)
    * [Netstat](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/NETSTAT_README.md)
    * [Processes](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/PROCESSES_README.md)
    * [Procstat](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/procstat/README.md)
* [Varnish](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/varnish)
* [Windows Performance Counters](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/win_perf_counters)

Enable and disable applications in your [Telegraf configuration file](https://github.com/influxdata/telegraf/blob/master/etc/telegraf.conf).
See the [Telegraf Configuration](https://github.com/influxdata/telegraf/blob/master/docs/CONFIGURATION.md) documentation for more information.

## How do I connect Chronograf to an InfluxEnterprise cluster?

The connection details form requires additional information when connecting Chronograf to an [InfluxEnterprise cluster](https://docs.influxdata.com/enterprise_influxdb/v1.2/).

When you enter InfluxDB's HTTP bind address in the `Connection String` input, Chronograf automatically checks if that InfluxDB instance is a data node.
If it is a data node, Chronograf automatically adds the `Meta Service Connection URL` input to the connection details form.
Enter the HTTP bind address of one of your cluster's meta nodes into that input and Chronograf takes care of the rest.

![Cluster connection details](/img/chronograf/v1.3/faq-cluster-connection.png)

Note that the example above assumes that you do not have authentication enabled.
If you have authentication enabled, the form requires username and password information.
For more details about monitoring an InfluxEnterprise cluster, see the [Monitor an InfluxEnterprise Cluster](/chronograf/v1.3/guides/monitor-an-influxenterprise-cluster/) guide.

## What visualization types does Chronograf support?

Chronograf's dashboards support five visualization types.

### Line
Show time-series in a line graph.

![Cluster connection details](/img/chronograf/v1.3/faq-viz-line.png)

### Stacked
Show time-series arranged on top of each other.

![Cluster connection details](/img/chronograf/v1.3/faq-viz-stacked.png)

### Step-Plot
Show time-series in a staircase graph.

![Cluster connection details](/img/chronograf/v1.3/faq-viz-step.png)
 
### SingleStat
Show the time-series' single most recent value.

![Cluster connection details](/img/chronograf/v1.3/faq-viz-single.png)

If a cell's query includes a [`GROUP BY` tag](/influxdb/v1.2/query_language/data_exploration/#group-by-tags) clause, Chronograf sorts the different [series](/influxdb/v1.2/concepts/glossary/#series) lexicographically and shows the most recent [field value](/influxdb/v1.2/concepts/glossary/#field-value) associated with the first series.
For example, if a query groups by the `name` [tag key](/influxdb/v1.2/concepts/glossary/#tag-key) and `name` has two [tag values](/influxdb/v1.2/concepts/glossary/#tag-value) (`chronelda` and `chronz`), Chronograf shows the most recent field value associated with the `chronelda` series.

If a cell's query includes more than one [field key](/influxdb/v1.2/concepts/glossary/#field-key) in the [`SELECT` clause](/influxdb/v1.2/query_language/data_exploration/#select-clause), Chronograf returns the most recent field value associated with the first field key in the `SELECT` clause.
For example, if a query's `SELECT` clause is `SELECT "chronogiraffe","chronelda"`, Chronograf shows the most recent field value associated with the `chronogiraffe` field key.

### Line+Stat
Show time-series in a line graph and overlay the time-series' single most recent value.

![Cluster connection details](/img/chronograf/v1.3/faq-viz-linesingle.png)


## What does the status column indicate on the Host List page?

The status icon is a high-level measure of your host's health.
If Chronograf has not received data from a host for the past minute, the status icon is red.
If Chronograf has received data from a host within the past minute, the status icon is green.

## Why is my host's status red when data are still arriving?

There are several possible explanations for an inaccurate red status icon:

The status icon depends on your host's local time in UTC.
Use the Network Time Protocol (NTP) to synchronize time between hosts; if hosts’ clocks aren’t synchronized with NTP, the status icon can be inaccurate.

The status icon turns red when Chronograf has not received data from a host for the past minute.
Chronograf uses data from Telegraf to perform that calculation.
By default, Telegraf sends data in ten-second intervals; you can change that interval setting in Telegraf's [configuration file](/telegraf/v1.3/administration/configuration/).
If you configure the setting to an interval that's greater than one minute, Chronograf assumes that the host is not reporting data and changes the status icon to red.

## Why is my query's field key order inconsistent?

In query editor mode, Chronograf doesn't preserve the order of the items in the [`SELECT` clause](/influxdb/v1.2/query_language/data_exploration/#the-basic-select-statement).
Chronograf may change the order of the items in the `SELECT` clause after it executes the query and populates the cell with the query results.

This issue affects the [SingleStat](#singlestat) and [Line+Stat](#line-stat) graph types.
If a cell's query includes more than one [field key](/influxdb/v1.2/concepts/glossary/#field-key) in the `SELECT` clause, Chronograf returns the most recent stat associated with the first field key in the `SELECT` clause.
If you sorted the field keys in your query to rely on that behavior, it is important to note that Chronograf may change that order when it executes your query.

This is a [known issue](https://github.com/influxdata/chronograf/issues/1158) and it will be fixed in a future release.

## Why does the query builder break after I add my template variable to a query?

Currently, adding a [template variable](/chronograf/v1.3/guides/dashboard-template-variables/) to a cell's query renders the query builder unusable.
If you click on a database in the builder's `Databases` column after adding a template variable to your query, Chronograf simply overwrites your existing query.
Note that this behavior does not apply to Chronograf's pre-created template variable: `:dashboardTime:`.

This is a known issue and it will be fixed in a future release.
