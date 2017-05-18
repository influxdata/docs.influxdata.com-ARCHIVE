---
title: Web Console Features
menu:
  enterprise_influxdb_1_1:
    weight: 30
    parent: Features
---

The Web Console provides a user interface for interacting with your InfluxEnterprise Cluster. Use the Web Console to:

* View overall cluster health
* View and, if necessary, kill active queries
* Create new databases
* Create new retention policies
* Delete unwanted shards
* Explore data and create graphs with the Data Explorer

## Cluster rebalancing

The Web Console version 0.7.0+ allows users to easily rebalance data across all
data nodes in the InfluxEnterprise Cluster.
The `Rebalance` button is available on the `Tasks` page.

Performing a rebalance is useful if you've recently adjusted a retention policy's
[replication factor](/enterprise_influxdb/v1.1/concepts/glossary/#replication-factor) or if you've added a data node to a cluster.
Rebalancing a cluster:

* Allocates existing
[shards](https://docs.influxdata.com/influxdb/v1.1/concepts/glossary/#shard)
such that each data node has roughly the same number of shards.
* Ensures that all existing data adhere to the
relevant replication factor.

Note that performing a rebalance can result in temporarily inconsistent data
across data nodes.
That inconsistency is not permanent and the cluster will resolve it over time.

## Features Under Development

* Additional support for raw InfluxQL queries
* A UI for setting up monitoring and alerting rules within Kapacitor
