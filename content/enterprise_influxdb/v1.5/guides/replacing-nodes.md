---
title: Replacing nodes in a cluster

menu:
  enterprise_influxdb_1_5:
    weight: 10
    parent: Guides
---

## Introduction

- identify the need to replace both data and meta nodes in a cluster
This guide outlines processes for replacing both meta nodes and data nodes in an InfluxDB cluster.

## Concepts
- role of meta nodes, anti-entropy, etc.

Meta nodes manage and monitor both the uptime of nodes in the cluster as well as distribution of [shards](/influxdb/v1.5/concepts/glossary/#shard) among nodes in the cluster.
Meta nodes also handle the [anti-entropy](/enterprise_influxdb/v1.5/guides/anti-entropy/) (AE) process that ensures data nodes have the shards they need.

## Replacing Meta Nodes

### 1. Identify the leader node
SSH into any meta node

```bash
curl localhost:8091/status | jq
```

> Piping the output into `jq` is optional, but does make JSON easier to read.

This will output a list of the machines in the raft cluster and it should also list the leader of the existing meta cluster.

### 2. Replace all non-leader nodes
### 3. Replace leader node

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
