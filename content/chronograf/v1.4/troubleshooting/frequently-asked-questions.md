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
