---
title: Anti-Entropy
alias:
  -/docs/v1.4/administration/anti-entropy
menu:
  enterprise_influxdb_1_4:
    weight: 10
    parent: Guides
---

## Introduction

The anti-entropy service tries to ensure that each data node has all the shards that it needs according to the meta store.
This guide covers some of the basic situations where the anti-entropy service takes effect.

## Concepts

The anti-entropy service examines each node to see whether it has all the shards that the meta store says it should have,
and if any shards are missing, the service will copy existing shards from owners to the node that is missing the shard.

By default, the service checks every 30 seconds, as configured in the `anti-entropy.check-interval` setting.

The anti-entropy service can only address missing shards when there is at least one copy of the shard available.
In other words, so long as new and healthy nodes are introduced, a replication factor of 2 can recover from one missing node, a replication factor of 3 can recover from two missing nodes, and so on.
A replication factor of 1 cannot be recovered by the anti-entropy service if the shard goes missing.

## Scenarios

This section covers some of the common use cases for the anti-entropy service.

### Scenario 1: Replacing a data node that is permanently offline

If a data node suddenly disappears, e.g. due to a catastrophic hardware failure, the anti-entropy service will copy the correct shards to the new replacement node.

When a data node is offline and you run `influxd-ctl show`, you will see the version missing:

```
$ influxd-ctl show
Data Nodes
==========
ID	TCP Address		Version
5	stable.example:8088	1.3.x-c1.3.x
4	offline.example:8088

Meta Nodes
==========
TCP Address		Version
meta-0.example:8091		1.3.x-c1.3.x
meta-1.example:8091		1.3.x-c1.3.x
meta-2.example:8091		1.3.x-c1.3.x
```

However, there will still be shards listed with 4 (the ID of the missing node) as the owner, when you run `influxd-ctl show-shards`:

```
$ influxd-ctl show-shards
Shards
==========
ID  Database   Retention Policy  Desired Replicas  Shard Group  Start                 End                   Expires               Owners
3   telegraf   autogen           2                 2            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{4 offline.example:8088} {5 stable.example:8088}]
1   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{5 stable.example:8088}]
2   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{4 offline.example:8088}]
4   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{5 stable.example:8088}]
5   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{4 offline.example:8088}]
6   foo        autogen           2                 4            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{5 stable.example:8088} {4 offline.example:8088}]
```

We will replace the offline node with a new data node.
Follow the [Data Node Installation Guide](/enterprise_influxdb/v1.4/production_installation/data_node_installation/) to start the new data node's `influxdb` service, but **do not join the data node to the cluster**.
Then use `influxd-ctl update-data` to tell the meta service that we're replacing the offline node with the new node:

```
$ influxd-ctl update-data offline.example:8088 new.example:8088
updated data node 4 to new.example:8088
```

The output of `influxd-ctl show-shards` will immediately reflect the new address of the node:

```
$ influxd-ctl show-shards
Shards
==========
ID  Database   Retention Policy  Desired Replicas  Shard Group  Start                 End                   Expires               Owners
3   telegraf   autogen           2                 2            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{5 stable.example:8088} {4 new.example:8088}]
1   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{5 stable.example:8088}]
2   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{4 new.example:8088}]
4   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{5 stable.example:8088}]
5   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{4 new.example:8088}]
6   foo        autogen           2                 4            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{5 stable.example:8088} {4 new.example:8088}]
```

Within the duration defined by `anti-entropy.check-interval`, the anti-entropy service will begin copying the shards from the other shard owners to the new node.
The time it takes for the copying to complete is determined by the number of shards to be copied and how much data is stored in the shards.

### Scenario 2: Replacing a machine that is running a data node

Perhaps you're replacing a machine that's being decommissioned, upgrading hardware, or something else entirely.
The anti-entropy service will automatically copy shards to the new machines.

The steps to replace a live node are identical to replacing an offline node, demonstrated in the previous scenario.

We'll start by running the `influxdb` service on the new node without yet joining the cluster.
Follow the instructions in the [Data Node Installation Guide](/enterprise_influxdb/v1.4/production_installation/data_node_installation/), but **do not join the data node to the cluster**.

Then we will log on to a meta node and change the address with `influxd-ctl update-data`.

```
$ influxd-ctl update-data retired-data.example:8088 new-data.example:8088
updated data node 4 to new-data.example:8088
```

Once you have successfully run the `influxd-ctl update-data` command, you are free to shut down the retired node without causing any interruption to the cluster.
