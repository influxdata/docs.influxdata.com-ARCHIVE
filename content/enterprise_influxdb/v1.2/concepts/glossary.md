---
title: Glossary
menu:
  enterprise_influxdb_1_2:
    weight: 0
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
InfluxDB replicates data across `N` data nodes, where `N` is the replication
factor.

To maintain data availability for queries, the replication factor should be less
than or equal to the number of data nodes in the cluster:

* Data are fully available when the replication factor is greater than the
number of unavailable data nodes.
* Data may be unavailable when the replication factor is less than the number of
unavailable data nodes.

Any replication factor greater than two gives you additional fault tolerance and
query capacity within the cluster.

## web console

The user interface for the InfluxEnterprise cluster.
Use the web console to:

* monitor clusters
* manage databases, retention policies, queries, users, and user
permissions/roles
* rebalance your cluster
* explore and visualize your data
