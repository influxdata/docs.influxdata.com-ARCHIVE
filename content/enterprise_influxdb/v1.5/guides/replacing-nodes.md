---
title: Replacing nodes in a cluster

menu:
  enterprise_influxdb_1_5:
    weight: 10
    parent: Guides
---

## Introduction

Nodes in an InfluxDB cluster, at some point, may need to be replaced, whether due to hardware issues, the need for new servers, - identify the need to replace both data and meta nodes in a cluster

This guide outlines processes for replacing both meta nodes and data nodes in an InfluxDB cluster.

## Concepts
Meta nodes manage and monitor both the uptime of nodes in the cluster as well as distribution of [shards](/influxdb/v1.5/concepts/glossary/#shard) among nodes in the cluster.
Meta nodes also handle the [anti-entropy](/enterprise_influxdb/v1.5/guides/anti-entropy/) (AE) process that ensures data nodes have the shards they need.

`influxd-ctl` is a CLI included in each meta node and can be used to manage your cluster.

## Replacing Meta Nodes

### 1. Identify the leader node

SSH into any of your meta nodes and run the following:

```bash
curl localhost:8091/status | jq
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

#### 2.1 - Provision a new meta node
[Provision and start a new meta node](/enterprise_influxdb/v1.5/production_installation/meta_node_installation/), but **do not** add it to the cluster yet.
For this guide, the new meta node's hostname will be `enterprise-meta-04`.

#### 2.2 - Remove the non-leader meta node
Now remove the non-leader node you are replacing by using the `influxd-ctl remove-meta` command and the TCP address of the meta node (ex. `enterprise-meta-02:8091`):

```bash
influxd-ctl remove-meta enterprise-meta-02:8091
```

> Only use `remove-meta` if you want to permanently remove a meta node from a cluster.

> If the meta process is not running on the node you are trying to remove or the node is neither reachable nor recoverable, use the `-force` flag. More information is available [below](#).

#### 2.3 - Add the new meta node
Once the non-leader meta node has been removed, use `influx-ctl add-meta` to replace it with the new meta node:

```bash
influxd-ctl add-meta enterprise-meta-04:8091
```

You can also add a meta node remotely through another meta node:

```bash
influxd-ctl -bind cluster-meta-node-01:8091 add-meta cluster-meta-node-04:8091
```

>This command contacts the meta node running at `cluster-meta-node-01:8091` and adds a meta node to that meta node’s cluster. The added meta node has the hostname `cluster-meta-node-04` and runs on port `8091`.

#### 2.4 - Confirm the meta node was added
Confirm the new meta-node has been added by running:

```bash
influxd-ctl show
```

The new meta node should appear in the output:

```bash
Data Nodes
==========
ID	TCP Address	Version
4	data1:8088	1.5.2-c1.5.2
5	data2:8088	1.5.2-c1.5.2

Meta Nodes
==========
TCP Address	Version
enterprise-meta-01:8091	1.5.2-c1.5.2
enterprise-meta-03:8091	1.5.2-c1.5.2
enterprise-meta-04:8091	1.5.2-c1.5.2 # <-- The newly added meta node
```

#### 2.5 - Remove and replace all other non-leader meta nodes
Repeat steps [2.1-2.4](#2-1-provision-a-new-meta-node) for all non-leader meta nodes one at a time.


### 3. Replace the leader node
As non-leader meta nodes are removed and replaced, the leader node oversees the replication of data to each of the new meta nodes.
Leave the leader up and running until at least two of the new meta nodes are up, running and healthy.

#### 3.1 - Kill the meta process on the leader node
SSH into the leader meta node and kill the meta process.

```bash
# List the running processes and get the
# PID of the 'influx-meta' process
ps aux

# Kill the 'influx-meta' process
kill <PID>
```

Once killed, the meta cluster will elect a new leader using the [raft consensus algorithm](https://raft.github.io/). Confirm the new leader by running:

```bash
curl localhost:8091/status | jq
```

#### 3.2 Remove and replace the old leader node
Remove the old leader node and replace it by following steps [2.1-2.4](#2-1-provision-a-new-meta-node). The minimum number of meta nodes you should have in your cluster is 3.

## Replacing Data Nodes

## Scenarios
  - Data Nodes
      - In a functional cluster
      - In a cluster with an unresponsive node
      - With security
  - Meta Nodes
      - In a functional cluster
      - In a cluster with an unresponsive node
      - With Security
