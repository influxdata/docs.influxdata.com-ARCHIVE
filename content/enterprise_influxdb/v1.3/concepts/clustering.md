---
title: Clustering
aliases:
    - /enterprise/v1.3/concepts/clustering/
menu:
  enterprise_influxdb_1_3:
    weight: 0
    parent: Concepts
---

This document describes in detail how clustering works in InfluxEnterprise. It starts with a high level description of the different components of a cluster and then delves into the implementation details.

## Architectural Overview

An InfluxEnterprise installation consists of three separate software processes: Data nodes, Meta nodes, and the Enterprise Web server. To run an InfluxDB cluster, only the meta and data nodes are required. Communication within a cluster looks like this:

```text
    ┌───────┐     ┌───────┐      
    │       │     │       │      
    │ Meta1 │◀───▶│ Meta2 │      
    │       │     │       │      
    └───────┘     └───────┘      
        ▲             ▲          
        │             │          
        │  ┌───────┐  │          
        │  │       │  │          
        └─▶│ Meta3 │◀─┘          
           │       │             
           └───────┘             
                                 
─────────────────────────────────
          ╲│╱    ╲│╱             
      ┌────┘      └──────┐       
      │                  │       
  ┌───────┐          ┌───────┐   
  │       │          │       │   
  │ Data1 │◀────────▶│ Data2 │   
  │       │          │       │   
  └───────┘          └───────┘   
```

The meta nodes communicate with each other via a TCP protocol and the Raft consensus protocol that all use port `8089` by default. This port must be reachable between the meta nodes. The meta nodes also expose an HTTP API bound to port `8091` by default that the `influxd-ctl` command uses.

Data nodes communicate with each other through a TCP protocol that is bound to port `8088`. Data nodes communicate with the meta nodes through their HTTP API bound to `8091`. These ports must be reachable between the meta and data nodes.

Within a cluster, all meta nodes must communicate with all other meta nodes. All data nodes must communicate with all other data nodes and all meta nodes.

The meta nodes keep a consistent view of the metadata that describes the cluster. The meta cluster uses the [HashiCorp implementation of Raft](https://github.com/hashicorp/raft) as the underlying consensus protocol. This is the same implementation that they use in Consul.

The data nodes replicate data and query each other via a Protobuf protocol over TCP. Details on replication and querying are covered later in this document.

## Where Data Lives

The meta and data nodes are each responsible for different parts of the database. 

### Meta nodes 

Meta nodes hold all of the following meta data:

* all nodes in the cluster and their role
* all databases and retention policies that exist in the cluster
* all shards and shard groups, and on what nodes they exist
* cluster users and their permissions
* all continuous queries 

The meta nodes keep this data in the Raft database on disk, backed by BoltDB. By default the Raft database is  `/var/lib/influxdb/meta/raft.db`.

### Data nodes

Data nodes hold all of the raw time series data and metadata, including:

* measurements
* tag keys and values
* field keys and values

On disk, the data is always organized by `<database>/<retention_policy>/<shard_id>`. By default the parent directory is `/var/lib/influxdb/data`.

> **Note:** Meta nodes only require the `/meta` directory, but Data nodes require all four subdirectories of `/var/lib/influxdb/`: `/meta`, `/data`, `/wal`, and `/hh`.

## Optimal Server Counts

When creating a cluster you'll need to choose how meta and data nodes to configure and connect. You can think of InfluxEnterprise as two separate clusters that communicate with each other: a cluster of meta nodes and one of data nodes. The number of meta nodes is driven by the number of meta node failures they need to be able to handle, while the number of data nodes scales based on your storage and query needs.

The consensus protocol requires a quorum to perform any operation, so there should always be an odd number of meta nodes. For almost all use cases, 3 meta nodes is the correct number, and such a cluster operates normally even with the permanant loss of 1 meta node.  

If you were to create a cluster with 4 meta nodes, it can still only survive the loss of 1 node. Losing a second node means the remaining two nodes can only gather two votes out of a possible four, which does not achieve a majority consensus. Since a cluster of 3 meta nodes can also survive the loss of a single meta node, adding the fourth node achieves no extra redundancy and only complicates cluster maintenance. At higher numbers of meta nodes the communication overhead increases exponentially, so configurations of 5 or more are not recommended unless the cluster will frequently lose meta nodes.

Data nodes hold the actual time series data. The minimum number of data nodes to run is 1 and can scale up from there. **Generally, you'll want to run a number of data nodes that is evenly divisible by your replication factor.** For instance, if you have a replication factor of 2, you'll want to run 2, 4, 6, 8, 10, etc. data nodes. 

## Chronograf

[Chronograf](/chronograf/latest/introduction/getting-started/) is the user interface component of InfluxData’s TICK stack. 
It makes owning the monitoring and alerting for your infrastructure easy to setup and maintain. 
It talks directly to the data and meta nodes over their HTTP protocols, which are bound by default to ports `8086` for data nodes and port `8091` for meta nodes.

## Writes in a Cluster

This section describes how writes in a cluster work. We'll work through some examples using a cluster of four data nodes: `A`, `B`, `C`, and `D`. Assume that we have a retention policy with a replication factor of 2 with shard durations of 1 day.

### Shard Groups

The cluster creates shards within a shard group to maximize the number of data nodes utilized. If there are N data nodes in the cluster and the replication factor is X, then N/X shards are created in each shard group, discarding any fractions.

This means that a new shard group gets created for each day of data that gets written in. Within each shard group 2 shards are created. Because of the replication factor of 2, each of those two shards are copied on 2 servers. For example we have a shard group for `2016-09-19` that has two shards `1` and `2`. Shard `1` is replicated to servers `A` and `B` while shard `2` is copied to servers `C` and `D`.

When a write comes in with values that have a timestamp in `2016-09-19` the cluster must first determine which shard within the shard group should receive the write. This is done by taking a hash of the `measurement` + sorted `tagset` (the [metaseries](/influxdb/v1.3/concepts/glossary/#metaseries)) and bucketing into the correct shard. In Go this looks like:

```go
// key is measurement + tagset
// shardGroup is the group for the values based on timestamp
// hash with fnv and then bucket
shard := shardGroup.shards[fnv.New64a(key) % len(shardGroup.Shards)]
```

There are multiple implications to this scheme for determining where data lives in a cluster. First, for any given metaseries all data on any given day exists in a single shard, and thus only on those servers hosting a copy of that shard. Second, once a shard group is created, adding new servers to the cluster won't scale out write capacity for that shard group. The replication is fixed when the shard group is created. 

However, there is a method for expanding writes in the current shard group (i.e. today) when growing a cluster. The current shard group can be truncated to stop at the current time using `influxd-ctl truncate-shards`. This immediately closes the current shard group, forcing a new shard group to be created. That new shard group inherits the latest retention policy and data node changes and then copies itself appropriately to the newly available data nodes. Run `influxd-ctl truncate-shards help` for more information on the command.

### Write Consistency

Each request to the HTTP API can specify the consistency level via the `consistency` query parameter. For this example let's assume that an HTTP write is being sent to server `D` and the data belongs in shard `1`. The write needs to be replicated to the owners of shard `1`: data nodes `A` and `B`. When the write comes into `D`, that node determines from its local cache of the metastore that the write needs to be replicated to the `A` and `B`, and it immediately tries to write to both. The subsequent behavior depends on the consistency level chosen:

* `any` - return success to the client as soon as any node has responded with a write success, or the receiving node has written the data to its hinted handoff queue. In our example, if `A` or `B` return a successful write response to `D`, or if `D` has cached the write in its local hinted handoff, `D` returns a write success to the client.
* `one` - return success to the client as soon as any node has responded with a write success, but not if the write is only in hinted handoff. In our example, if `A` or `B` return a successful write response to `D`, `D` returns a write success to the client. If `D` could not send the data to either `A` or `B` but instead put the data in hinted handoff, `D` returns a write failure to the client. Note that this means writes may return a failure and yet the data may eventually persist successfully when hinted handoff drains.
* `quorum` - return success when a majority of nodes return success. This option is only useful if the replication factor is greater than 2, otherwise it is equivalent to `all`. In our example, if both `A` and `B` return a successful write response to `D`, `D` returns a write success to the client. If either `A` or `B` does not return success, then a majority of nodes have not successfully persisted the write and `D` returns a write failure to the client. If we assume for a moment the data were bound for three nodes, `A`, `B`, and `C`, then if any two of those nodes respond with a write success, `D` returns a write success to the client. If one or fewer nodes respond with a success, `D` returns a write failure to the client. Note that this means writes may return a failure and yet the data may eventually persist successfully when hinted handoff drains.
* `all` - return success only when all nodes return success. In our example, if both `A` and `B` return a successful write response to `D`, `D` returns a write success to the client. If either `A` or `B` does not return success, then `D` returns a write failure to the client. If we again assume three destination nodes `A`, `B`, and `C`, then all if three nodes respond with a write success, `D` returns a write success to the client. Otherwise, `D` returns a write failure to the client. Note that this means writes may return a failure and yet the data may eventually persist successfully when hinted handoff drains.

The important thing to note is how failures are handled. In the case of failures, the database uses the hinted handoff system.

### Hinted Handoff

Hinted handoff is how InfluxEnterprise deals with data node outages while writes are happening. Hinted handoff is essentially a durable disk based queue. When writing at `any`, `one` or `quorum` consistency, hinted handoff is used when one or more replicas return an error after a success has already been returned to the client. When writing at `all` consistency, writes cannot return success unless all nodes return success. Temporarily stalled or failed writes may still go to the hinted handoff queues but the cluster would have already returned a failure response to the write. The receiving node creates a separate queue on disk for each data node (and shard) it cannot reach.

Let's again use the example of a write coming to `D` that should go to shard `1` on `A` and `B`. If we specified a consistency level of `one` and node `A` returns success, `D` immediately returns success to the client even though the write to `B` is still in progress.

Now let's assume that `B` returns an error. Node `D` then puts the write into its hinted handoff queue for shard `1` on node `B`. In the background, node `D` continues to attempt to empty the hinted handoff queue by writing the data to node `B`. The configuration file has settings for the maximum size and age of data in hinted handoff queues.

If a data node is restarted it checks for pending writes in the hinted handoff queues and resume attempts to replicate the writes. The important thing to note is that the hinted handoff queue is durable and does survive a process restart.

When restarting nodes within an active cluster, during upgrades or maintenance, for example, other nodes in the cluster store hinted handoff writes to the offline node and replicates them when the node is again available. Thus, a healthy cluster should have enough resource headroom on each data node to handle the burst of hinted handoff writes following a node outage. The returning node needs to handle both the steady state traffic and the queued hinted handoff writes from other nodes, meaning its write traffic will have a significant spike following any outage of more than a few seconds, until the hinted handoff queue drains.

If a node with pending hinted handoff writes for another data node receives a write destined for that node, it adds the write to the end of the hinted handoff queue rather than attempt a direct write. This ensures that data nodes receive data in mostly chronological order, as well as preventing unnecessary connection attempts while the other node is offline. 

## Queries in a Cluster

Queries in a cluster are distributed based on the time range being queried and the replication factor of the data. For example if the retention policy has a replication factor of 4, the coordinating data node receiving the query randomly picks any of the 4 data nodes that store a replica of the shard(s) to receive the query. If we assume that the system has shard durations of one day, then for each day of time covered by a query the coordinating node selects one data node to receive the query for that day.

The coordinating node executes and fulfill the query locally whenever possible. If a query must scan multiple shard groups (multiple days in our example above), the coordinating node forwards queries to other nodes for shard(s) it does not have locally. The queries are forwarded in parallel to scanning its own local data. The queries are distributed to as many nodes as required to query each shard group once. As the results come back from each data node, the coordinating data node combines them into the final result that gets returned to the user.
