---
title: Frequently asked questions (FAQ)
menu:
  chronograf_1_4:
    weight: 20
    parent: Troubleshooting
---

* [How do I connect Chronograf to an InfluxEnterprise cluster?](#how-do-i-connect-chronograf-to-an-influxenterprise-cluster)
* 
### Known Issues

* [Why does the query builder break after I add my template variable to a query?](#why-does-the-query-builder-break-after-i-add-my-template-variable-to-a-query)


## How do I connect Chronograf to an InfluxEnterprise cluster?

The connection details form requires additional information when connecting Chronograf to an [InfluxEnterprise cluster](https://docs.influxdata.com/enterprise_influxdb/latest/).

When you enter the InfluxDB HTTP bind address in the `Connection String` input, Chronograf automatically checks if that InfluxDB instance is a data node.
If it is a data node, Chronograf automatically adds the `Meta Service Connection URL` input to the connection details form.
Enter the HTTP bind address of one of your cluster's meta nodes into that input and Chronograf takes care of the rest.

![Cluster connection details](/img/chronograf/v1.4/faq-cluster-connection.png)

Note that the example above assumes that you do not have authentication enabled.
If you have authentication enabled, the form requires username and password information.
For more details about monitoring an InfluxEnterprise cluster, see the [Monitor an InfluxEnterprise Cluster](/chronograf/latest/guides/monitoring-influxenterprise-clusters/) guide.


## What does the status column indicate on the Host List page?

The status icon is a high-level measure of your host's health.
If Chronograf has not received data from a host for the past minute,
the status icon is red.
If Chronograf has received data from a host within the past minute,
the status icon is green.

## Why is my host's status red when data are still arriving?

There are several possible explanations for an inaccurate red status icon:

The status icon depends on your host's local time in UTC.
Use the Network Time Protocol (NTP) to synchronize time between hosts;
if the hosts’ clocks aren’t synchronized with NTP, the status icon can be inaccurate.

The status icon turns red when Chronograf has not received data from a host for the past minute.
Chronograf uses data from Telegraf to perform that calculation.
By default, Telegraf sends data in ten-second intervals; you can change that interval setting in Telegraf's [configuration file](/telegraf/latest/administration/configuration/).
If you configure the setting to an interval that's greater than one minute, Chronograf assumes that the host is not reporting data and changes the status icon to red.

## Why does the query builder break after I add my template variable to a query?

Currently, adding a [template variable](/chronograf/latest/guides/dashboard-template-variables/) to a cell's query renders the query builder unusable.
If you click on a database in the builder's **Databases** column after adding a template variable to your query, Chronograf simply overwrites your existing query.
Note that this behavior does not apply to Chronograf's pre-created template variable: `:dashboardTime:`.

This is a known issue and it will be fixed in a future release.
