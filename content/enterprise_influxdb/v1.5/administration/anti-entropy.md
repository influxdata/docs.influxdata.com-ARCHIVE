---
title: Anti-entropy
aliases:
  - /enterprise_influxdb/v1.5/guides/anti-entropy/
menu:
  enterprise_influxdb_1_5:
    weight: 40
    parent: Administration
---

## Introduction

The anti-entropy service tries to ensure that each data node has all the shards that it needs according to the meta store.
This guide covers some of the basic situations where the anti-entropy service takes effect.

## Concepts

The anti-entropy service examines each node to see whether it has all the shards that the meta store says it should have,
and if any shards are missing, the service will copy existing shards from owners to the node that is missing the shard.

By default, the service checks every 30 seconds, as configured in the [`anti-entropy.check-interval`](/enterprise_influxdb/v1.5/administration/configuration/#check-interval-30s) setting.

The anti-entropy service can only address missing shards when there is at least one copy of the shard available.
In other words, so long as new and healthy nodes are introduced, a replication factor of 2 can recover from one missing node, a replication factor of 3 can recover from two missing nodes, and so on.
A replication factor of 1 cannot be recovered by the anti-entropy service if the shard goes missing.

## Configuration

Anti-entropy configuration options are available in [`[anti-entropy]`](/enterprise_influxdb/v1.5/administration/configuration/#anti-entropy) section of your `influxdb-conf`.

## Scenarios

This section covers some of the common use cases for the anti-entropy service.

### Scenario 1: Replacing an unresponsive data node

If a data node suddenly disappears, e.g. due to a catastrophic hardware failure, as soon as a new data node is online, the anti-entropy service will copy the correct shards to the new replacement node. The time it takes for the copying to complete is determined by the number of shards to be copied and how much data is stored in each.

*View the [Replacing Data Nodes](/enterprise_influxdb/v1.5/guides/replacing-nodes/#replacing-data-nodes) documentation for instructions on replacing data nodes in your InfluxDB Enterprise cluster.*

### Scenario 2: Replacing a machine that is running a data node

Perhaps you are replacing a machine that is being decommissioned, upgrading hardware, or something else entirely.
The anti-entropy service will automatically copy shards to the new machines.

Once you have successfully run the `influxd-ctl update-data` command, you are free to shut down the retired node without causing any interruption to the cluster.
The anti-entropy process will continue copying the appropriate shards from the remaining replicate in the cluster.
