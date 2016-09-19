---
title: Clustering
menu:
  enterprise_1_0:
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

The meta nodes communicate with each other via a TCP protocol and the Raft consensus protocol that all use port `8089` by default. This port should be reachable between the meta nodes. The meta nodes also expose an HTTP API bound to port `8091` by default that the `influxd-ctl` command uses.

Data nodes communicate with each other through a TCP protocol that is bound to port `8088`. Data nodes communicate with the meta nodes through their HTTP API bound to `8091`.

Within a cluster, all meta nodes communicate with all other meta nodes. All data nodes communicate with each other and all other meta nodes.

The meta nodes keep a consistent view of the metadata that describes the cluster. The meta cluster uses the [HashiCorp implementation of Raft](https://github.com/hashicorp/raft) as the underlying consensus protocol. This is the same implementation that they use in Consul.

The data nodes replicate data and query each other via a Protobuf protocol over TCP. Details on replication and querying are covered later in this document.

## Where Data Lives

The meta and data nodes are each responsible for different parts of the database. Meta nodes hold all of the following meta data:

* What servers exist in the cluster and their role
* What databases exist in the cluster
* What retention policies exist in the cluster
* What Shard Groups & Shards exist in the cluster
* Users
* Continuous Queries

The meta nodes keep this data in the Raft database on disk, backed by BoltDB.

Data nodes hold all of the raw time series data and metadata about what measurements, tags, and fields exist in each database. On disk, the data is organized by `<database>/<retention_policy>/<shard_id>`.

## Optimal Server Counts

When creating and configuring a cluster you'll need to decide how many of each kind of server you should have. You can think of InfluxEnterprise as two separate clusters that communicate with each other: one of meta nodes and one of data nodes. The meta nodes scale up based on the number of failures they need to be able to handle, while the data nodes scale based on your storage and query needs.

The number of meta nodes should be either 3, 5, or 7. The consensus protocol requires quorums to perform any operations, so the correct number of nodes is always odd. These configurations will operate after the failure of 1, 2, or 3 meta nodes respectively.

Data nodes hold the actual time series data. The minimum number of data nodes to run is 1 and can scale up from there. Generally, you'll want to run a number of data nodes that is evenly divisible by your replication factor. For instance, if you have a replication factor of 2, you'll want to run 2, 4, 6, 8, 10, etc. data nodes. However, that's not a rule, particularly because you can have different replication factors in different retention policies.

## Enterprise Web Server

The Enterprise Web Server serves the UI web application for managing and working with the InfluxDB cluster. It talks directly to the data and meta nodes over their HTTP protocols, which are bound by default to port 8086 for data nodes and 8088 for meta nodes.

The web server isn't required to run and operate an InfluxDB cluster.

## Writes in a Cluster

This section describes how writes in a cluster work. We'll work through some examples using a cluster of four data nodes: `A`, `B`, `C`, and `D`. Assume that we have a retention policy with a replication factor of 2 with shard durations of 1 day.

This means that a new shard group will get created for each day of data that gets written in. Within each shard group 2 shards will be created. Because of the replication factor of 2, each of those two shards will be copied on 2 servers. For example we have a shard group for `2016-09-19` that has two shards `1` and `2`. Shard `1` will be replicated to servers `A` and `B` while shard `2` will be copied to servers `C` and `D`.

When a write comes in with values that have a timestamp in `2016-09-19` we must first determine which shard within the shard group should receive the write. This is done by taking a hash of the `measurement` + `tagset` and bucketing into the correct shard. In Go this looks like:

```go
// key is measurement + tagset
// shardGroup is the group for the values based on timestamp
// hash with fnv and then bucket
shard := shardGroup.shards[fnv.New64a(key) % len(shardGroup.Shards)]
```

There are multiple implications to this scheme for determining where data lives in a cluster. First, the data for any given measurement + tagset key for a given day will exist in a single shard (and thus only those servers that keep a copy of it). Second, once a shard group is created, adding new servers to the cluster won't scale out write capacity.

However, there is a method for expanding writes in the current shard group (i.e. today) when growing a cluster. The current shard group can be truncated to stop at the current time, forcing a new shard group to get created, which will fan out to all available data nodes. The command `influxd-ctl truncate-shards help` will show how to use it.

Each request to the HTTP API can specify the consistency level via the `consistency` query parameter. For this example let's assume that we're writing to server `D` to shard `1` so the data would need to be replicated to shard one's owners: `A` and `B`. When a write comes into `D` it will see that the write needs to be replicated to the other two servers and it will immediately try to write to both. Depending on the consistency level chosen, here will be the behavior:

* `any` - return success to the client as soon as any server has responded or server D has written to the local disk queue
* `one` - return success to the client when either server A or B has accepted the write
* `quorum` - return success when both A and B return success. This option only useful is replication factors that are greater than 2.
* `all` - return success only when both A and B return success.

The important thing to note is how failures are handled. In the case of failures, the database will use the hinted handoff system.

### Hinted Handoff

Hinted handoff is how InfluxEnterprise deals with data node failures while writes are happening. Hinted handoff is essentially a durable disk based queue. In the case of `any`, `one` or `quorum` writes, hinted handoff will be used if one or more replicas return an error after a success has already been returned to the client.

Let's use the previous example of writing to D something that should go to shard 1 owned by `A` and `B`. If we specified a consistency level of `one` and server A returned success, we'll immediately return success to the client even though the write to `B` is still in progress.

Now let's assume that `B` returns an error. Server `D` will then put the write in its hinted handoff queue for shard `1` to go to server `B`. In the background server `D` will continue to attempt to empty the hinted handoff queue by writing the data to server `B`.

If server D is restarted it will check if there are any writes sitting in hinted handoff and continue to attempt to replicate those. The important thing to note is that the hinted handoff queue is durable and will survive server restarts.

When doing restarts of servers within an active cluster it's expected that other servers will store hinted handoff writes and replicate them when the server comes back up. Because of this, it's best to operate a cluster at less than full 100% utilization. A healthy cluster should have headroom to handle burst write and query traffic or recovery from temporary outages in any part of the cluster.

## Queries in a Cluster

Queries in a cluster are distributed based on the time range being queried and replication factor. For example if we have a replication factor of 4 and shard durations of one day, for each day the query hits, any one of the 4 servers that stores a replica of that shard can be queried.

A query that hits multiple shard groups (i.e. days) will run those individual shard queries in parallel while fanning out to the other servers in the cluster that must be hit. As the results come in from each shard, they will be combined together to form the final result that gets returned to the user.