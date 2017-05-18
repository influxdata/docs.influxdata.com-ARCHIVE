---
title: Cluster Features
menu:
  enterprise_influxdb_1_2:
    weight: 20
    parent: Features
---

## Entitlements

A valid license key is required in order to start `influxd-meta` or `influxd`.
License keys restrict the number of data nodes that can be added to a cluster as well as the number of CPU cores a data node can use.
Without a valid license, the process will abort startup.

## Query Management

Query management works cluster wide. Specifically, `SHOW QUERIES` and `KILL QUERY <ID>` on `"<host>"` can be run on any data node. `SHOW QUERIES` will report all queries running across the cluster and the node which is running the query.
`KILL QUERY` can abort queries running on the local node or any other remote data node.

## Subscriptions

Subscriptions used by Kapacitor work in a cluster. Writes to any node will be forwarded to subscribers across all supported subscription protocols.

## PProf Endpoints

Meta nodes expose the /debug/pprof endpoints for profiling and troubleshooting.

## Shard Movement

* [Copy Shard](/enterprise_influxdb/v1.2/features/cluster-commands/#copy-shard) support - copy a shard from one node to another
* [Copy Shard Status](/enterprise_influxdb/v1.2/features/cluster-commands/#copy-shard-status) - query the status of a copy shard request
* [Kill Copy Shard](/enterprise_influxdb/v1.2/features/cluster-commands/#kill-copy-shard) - kill a running shard copy
* [Remove Shard](/enterprise_influxdb/v1.2/features/cluster-commands/#remove-shard) - remove a shard from a node (this deletes data)
* [Truncate Shards](/enterprise_influxdb/v1.2/features/cluster-commands/#truncate-shards) - truncate all active shard groups and start new shards immediately (This is useful when adding nodes or changing replication factors.)

This functionality is exposed via an API on the meta service and through [`influxd-ctl` sub-commands](/enterprise_influxdb/v1.2/features/cluster-commands/).

## OSS Conversion

Importing a OSS single server as the first data node is supported.

See [OSS to Cluster Migration](/enterprise_influxdb/v1.2/guides/migration/) for
step-by-step instructions.

## Query Routing

The query engine skips failed nodes that hold a shard needed for queries.
If there is a replica on another node, it will retry on that node.

## Backup and Restore

InfluxEnterprise clusters support backup and restore functionality starting with
version 0.7.1.
See [Backup and Restore](/enterprise_influxdb/v1.2/guides/backup-and-restore/) for
more information.
