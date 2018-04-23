---
title: Replacing InfluxDB Enterprise cluster meta nodes and data nodes

menu:
  enterprise_influxdb_1_6:
    name: Replacing cluster nodes
    weight: 10
    parent: Guides
---

## Introduction

Nodes in an InfluxDB Enterprise cluster may need to be replaced at some point due to hardware needs, hardware issues, or something else entirely.
This guide outlines processes for replacing both meta nodes and data nodes in an InfluxDB Enterprise cluster.

## Concepts
Meta nodes manage and monitor both the uptime of nodes in the cluster as well as distribution of [shards](/influxdb/v1.6/concepts/glossary/#shard) among nodes in the cluster.
Meta nodes also handle the [anti-entropy](/enterprise_influxdb/v1.6/administration/anti-entropy/) (AE) process that ensures data nodes have the shards they need.

Data nodes hold raw time-series data and metadata. Data shards are both distributed and replicated across data nodes in the cluster.

`influxd-ctl` is a CLI included in each meta node and is used to manage your InfluxDB Enterprise cluster.

## Scenarios

### Replacing nodes in clusters with security enabled
Many InfluxDB Enterprise clusters are configured with security enabled, forcing secure TLS encryption between all nodes in the cluster.
Both `influxd-ctl` and `curl`, the command line tools used when replacing nodes, have options that facilitate the use of TLS.

#### `influxd-ctl -bind-tls`
In order manage your cluster over TLS, pass the `-bind-tls` flag with any `influxd-ctl` commmand.

> If using a self-signed certificate, pass the `-k` flag to skip certificate verification.

```bash
# Pattern
influxd-ctl -bind-tls [-k] <command>

# Example
influxd-ctl -bind-tls remove-meta enterprise-meta-02:8091
```

#### `curl -k`
`curl` natively supports TLS/SSL connections, but if using a self-signed certificate, pass the `-k`/`--insecure` flag to allow for "insecure" SSL connections.

> Self-signed certificates are considered "insecure" due to their lack of a valid chain of authority. However, data is still encrypted when using self-signed certificates.

```bash
# Pattern
curl [-k, --insecure] <url>

# Example
curl -k https://localhost:8091/status
```

### Replacing meta nodes in a functional cluster
If all meta nodes in the cluster are fully functional, simply follow the steps for [replacing meta nodes](#replacing-meta-nodes-in-an-influxdb-enterprise-cluster).

### Replacing an unresponsive meta node
If replacing a meta node that is either unreachable or unrecoverable, you need to forcefully remove it from the meta cluster. Instructions for forcefully removing meta nodes are provided in the [step 2.2](#2-2-remove-the-non-leader-meta-node) of the [replacing meta nodes](#replacing-meta-nodes-in-an-influxdb-enterprise-cluster) process.

### Replacing responsive and unresponsive data nodes in a cluster
The process of replacing both responsive and unresponsive data nodes is the same. Simply follow the instructions for [replacing data nodes](#replacing-data-nodes-in-an-influxdb-enterprise-cluster).


## Replacing meta nodes in an InfluxDB Enterprise cluster

[Meta nodes](/enterprise_influxdb/v1.6/concepts/clustering/#meta-nodes) together form a [Raft](https://raft.github.io/) cluster in which nodes elect a leader through consensus vote.
The leader oversees the management of the meta cluster, so it is important to replace non-leader nodes before the leader node.
The process for replacing meta nodes is as follows:

1. [Identify the leader node](#1-identify-the-leader-node)  
2. [Replace all non-leader nodes](#2-replace-all-non-leader-nodes)  
    2.1.  [Provision a new meta node](#2-1-provision-a-new-meta-node)  
    2.2.  [Remove the non-leader meta node](#2-2-remove-the-non-leader-meta-node)  
    2.3.  [Add the new meta node](#2-3-add-the-new-meta-node)  
    2.4.  [Confirm the meta node was added](#2-4-confirm-the-meta-node-was-added)  
    2.5.  [Remove and replace all other non-leader meta nodes](#2-5-remove-and-replace-all-other-non-leader-meta-nodes)
3. [Replace the leader node](#3-replace-the-leader-node)  
    3.1.  [Kill the meta process on the leader node](#3-1-kill-the-meta-process-on-the-leader-node)  
    3.2.  [Remove and replace the old leader node](#3-2-remove-and-replace-the-old-leader-node)  

### 1. Identify the leader node

Log into any of your meta nodes and run the following:

```bash
curl -s localhost:8091/status | jq
```

> Piping the command into `jq` is optional, but does make the JSON output easier to read.

The output will include information about the current meta node, the leader of the meta cluster, and a list of "peers" in the meta cluster.

```json
{
  "nodeType": "meta",
  "leader": "enterprise-meta-01:8089",
  "httpAddr": "enterprise-meta-01:8091",
  "raftAddr": "enterprise-meta-01:8089",
  "peers": [
    "enterprise-meta-01:8089",
    "enterprise-meta-02:8089",
    "enterprise-meta-03:8089"
  ]
}
```

Identify the `leader` of the cluster. When replacing nodes in a cluster, non-leader nodes should be replaced _before_ the leader node.

### 2. Replace all non-leader nodes

#### 2.1. Provision a new meta node
[Provision and start a new meta node](/enterprise_influxdb/v1.6/production_installation/meta_node_installation/), but **do not** add it to the cluster yet.
For this guide, the new meta node's hostname will be `enterprise-meta-04`.

#### 2.2. Remove the non-leader meta node
Now remove the non-leader node you are replacing by using the `influxd-ctl remove-meta` command and the TCP address of the meta node (ex. `enterprise-meta-02:8091`):

```bash
# Pattern
influxd-ctl remove-meta <meta-node-tcp-bind-address>

# Example
influxd-ctl remove-meta enterprise-meta-02:8091
```

> Only use `remove-meta` if you want to permanently remove a meta node from a cluster.

<!--  -->

> **For unresponsive or unrecoverable meta nodes:**

>If the meta process is not running on the node you are trying to remove or the node is neither reachable nor recoverable, use the `-force` flag.
When forcefully removing a meta node, you must also pass the `-tcpAddr` flag with the TCP and HTTP bind addresses of the node you are removing.

>```bash
# Pattern
influxd-ctl remove-meta -force -tcpAddr <meta-node-tcp-bind-address> <meta-node-http-bind-address>

# Example
influxd-ctl remove-meta -force -tcpAddr enterprise-meta-02:8089 enterprise-meta-02:8091
```

#### 2.3. Add the new meta node
Once the non-leader meta node has been removed, use `influx-ctl add-meta` to replace it with the new meta node:

```bash
# Pattern
influxd-ctl add-meta <meta-node-tcp-bind-address>

# Example
influxd-ctl add-meta enterprise-meta-04:8091
```

You can also add a meta node remotely through another meta node:

```bash
# Pattern
influxd-ctl -bind <remote-meta-node-bind-address> add-meta <meta-node-tcp-bind-address>

# Example
influxd-ctl -bind enterprise-meta-node-01:8091 add-meta enterprise-meta-node-04:8091
```

>This command contacts the meta node running at `cluster-meta-node-01:8091` and adds a meta node to that meta node’s cluster.
The added meta node has the hostname `cluster-meta-node-04` and runs on port `8091`.

#### 2.4. Confirm the meta node was added
Confirm the new meta-node has been added by running:

```bash
influxd-ctl show
```

The new meta node should appear in the output:

```bash
Data Nodes
==========
ID	TCP Address	Version
4	enterprise-data-01:8088	1.5.2-c1.5.2
5	enterprise-data-02:8088	1.5.2-c1.5.2

Meta Nodes
==========
TCP Address	Version
enterprise-meta-01:8091	1.5.2-c1.5.2
enterprise-meta-03:8091	1.5.2-c1.5.2
enterprise-meta-04:8091	1.5.2-c1.5.2 # <-- The newly added meta node
```

#### 2.5. Remove and replace all other non-leader meta nodes
**If replacing only one meta node, no further action is required.**
If replacing others, repeat steps [2.1-2.4](#2-1-provision-a-new-meta-node) for all non-leader meta nodes one at a time.

### 3. Replace the leader node
As non-leader meta nodes are removed and replaced, the leader node oversees the replication of data to each of the new meta nodes.
Leave the leader up and running until at least two of the new meta nodes are up, running and healthy.

#### 3.1 - Kill the meta process on the leader node
Log into the leader meta node and kill the meta process.

```bash
# List the running processes and get the
# PID of the 'influx-meta' process
ps aux

# Kill the 'influx-meta' process
kill <PID>
```

Once killed, the meta cluster will elect a new leader using the [raft consensus algorithm](https://raft.github.io/).
Confirm the new leader by running:

```bash
curl localhost:8091/status | jq
```

#### 3.2 - Remove and replace the old leader node
Remove the old leader node and replace it by following steps [2.1-2.4](#2-1-provision-a-new-meta-node).
The minimum number of meta nodes you should have in your cluster is 3.

## Replacing data nodes in an InfluxDB Enterprise cluster

[Data nodes](/enterprise_influxdb/v1.6/concepts/clustering/#data-nodes) house all raw time series data and metadata.
The process of replacing data nodes is as follows:

1. [Provision a new data node](#1-provision-a-new-data-node)
2. [Replace the old data node with the new data node](#2-replace-the-old-data-node-with-the-new-data-node)
3. [Confirm the data node was added](#3-confirm-the-data-node-was-added)
4. [Check the copy-shard-status](#4-check-the-copy-shard-status)

### 1. Provision a new data node

[Provision and start a new data node](/enterprise_influxdb/v1.6/production_installation/data_node_installation/), but **do not** add it to your cluster yet.

### 2. Replace the old data node with the new data node
Log into any of your cluster's meta nodes and use `influxd-ctl update-data` to replace the old data node with the new data node:

```bash
# Pattern
influxd-ctl update-data <old-node-tcp-bind-address> <new-node-tcp-bind-address>

# Example
influxd-ctl update-data enterprise-data-01:8088 enterprise-data-03:8088
```

### 3. Confirm the data node was added

Confirm the new meta-node has been added by running:

```bash
influxd-ctl show
```

The new meta node should appear in the output:

```bash
Data Nodes
==========
ID	TCP Address	Version
4	enterprise-data-03:8088	1.5.2-c1.5.2 # <-- The newly added data node
5	enterprise-data-02:8088	1.5.2-c1.5.2

Meta Nodes
==========
TCP Address	Version
enterprise-meta-01:8091	1.5.2-c1.5.2
enterprise-meta-02:8091	1.5.2-c1.5.2
enterprise-meta-03:8091	1.5.2-c1.5.2
```

Inspect your cluster's shard distribution with `influxd-ctl show-shards`.
Shards will immediately reflect the new address of the node.

```bash
influxd-ctl show-shards

Shards
==========
ID  Database   Retention Policy  Desired Replicas  Shard Group  Start                 End                   Expires               Owners
3   telegraf   autogen           2                 2            2018-03-19T00:00:00Z  2018-03-26T00:00:00Z                        [{5 enterprise-data-02:8088} {4 enterprise-data-03:8088}]
1   _internal  monitor           2                 1            2018-03-22T00:00:00Z  2018-03-23T00:00:00Z  2018-03-30T00:00:00Z  [{5 enterprise-data-02:8088}]
2   _internal  monitor           2                 1            2018-03-22T00:00:00Z  2018-03-23T00:00:00Z  2018-03-30T00:00:00Z  [{4 enterprise-data-03:8088}]
4   _internal  monitor           2                 3            2018-03-23T00:00:00Z  2018-03-24T00:00:00Z  2018-03-01T00:00:00Z  [{5 enterprise-data-02:8088}]
5   _internal  monitor           2                 3            2018-03-23T00:00:00Z  2018-03-24T00:00:00Z  2018-03-01T00:00:00Z  [{4 enterprise-data-03:8088}]
6   foo        autogen           2                 4            2018-03-19T00:00:00Z  2018-03-26T00:00:00Z                        [{5 enterprise-data-02:8088} {4 enterprise-data-03:8088}]
```

Within the duration defined by [`anti-entropy.check-interval`](/enterprise_influxdb/v1.6/administration/configuration/#check-interval-30s),
the AE service will begin copying shards from other shard owners to the new node.
The time it takes for copying to complete is determined by the number of shards copied and how much data is stored in each.

### 4. Check the `copy-shard-status`
Check on the status of the copy-shard process with:

```bash
influx-ctl copy-shard-status
```

The output will show all currently running copy-shard processes.

```
Source                   Dest                     Database  Policy   ShardID  TotalSize  CurrentSize  StartedAt
enterprise-data-02:8088  enterprise-data-03:8088  telegraf  autogen  3        119624324  119624324    2018-04-17 23:45:09.470696179 +0000 UTC
```

> **Important:** If replacing other data nodes in the cluster, make sure shards are completely copied from nodes in the same replica set before replacing the other nodes.
View the [Anti-entropy](/enterprise_influxdb/v1.6/administration/anti-entropy/#concepts) documentation for important information regarding anti-entropy and your database's replication factor.
