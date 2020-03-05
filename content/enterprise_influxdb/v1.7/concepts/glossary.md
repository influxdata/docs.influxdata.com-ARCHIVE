---
title: Glossary
aliases:
    - /enterprise/v1.7/concepts/glossary/
menu:
  enterprise_influxdb_1_7:
    weight: 20
    parent: Concepts
---

## data node

A node that runs the data service.

For high availability, installations must have at least two data nodes.
The number of data nodes in your cluster must be the same as your highest
replication factor.
Any replication factor greater than two gives you additional fault tolerance and
query capacity within the cluster.

Data node sizes will depend on your needs.
The Amazon EC2 m4.large or m4.xlarge are good starting points.

Related entries: [data service](#data-service), [replication factor](#replication-factor)

## data service

Stores all time series data and handles all writes and queries.

Related entries: [data node](#data-node)

## meta node

A node that runs the meta service.

For high availability, installations must have three meta nodes.
Meta nodes can be very modestly sized instances like an EC2 t2.micro or even a
nano.
For additional fault tolerance installations may use five meta nodes; the
number of meta nodes must be an odd number.

Related entries: [meta service](#meta-service)

## meta service

The consistent data store that keeps state about the cluster, including which
servers, databases, users, continuous queries, retention policies, subscriptions,
and blocks of time exist.

Related entries: [meta node](#meta-node)

## replication factor

The attribute of the retention policy that determines how many copies of the
data are stored in the cluster.

If replication factor is set to 2, each series is stored on 2 separate nodes. If the replication factor is equal to the number of data nodes, data is replicated on each node in the cluster.
Replication ensures data is available on multiple nodes and more likely available when a data node (or more) is unavailable.

The number of data nodes in a cluster **must be evenly divisible by the replication factor**. For example, a replication factor of 2 works with 2, 4, 6, or 8 data nodes, and so on. A replication factor of 3 works with 3, 6, or 9 data nodes, and so on. To increase the read or write capacity of a cluster, add a number of data nodes by a multiple of the replication factor. For example, to increase the capacity of a 6 node cluster with an RF=3, add 3 additional nodes. To further increase the capacity, continue to add nodes in groups of 3.

> **Important:** If the replication factor isn't evenly divisible into the number of data nodes, data may be distributed unevenly across the cluster and cause poor performance. Likewise, decreasing the replication factor (fewer copies of data in a cluster) may reduce performance.

Related entries: [cluster](/influxdb/v0.10/concepts/glossary/#cluster), [duration](/influxdb/v1.7/concepts/glossary/#duration), [node](/influxdb/v1.7/concepts/glossary/#node),
[retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp)

## web console

Legacy user interface for the InfluxDB Enterprise.

This has been deprecated and the suggestion is to use [Chronograf](/chronograf/latest/introduction/).

If you are transitioning from the Enterprise Web Console to Chronograf and helpful [transition guide](/chronograf/latest/guides/transition-web-admin-interface/) is available.
