---
title: Anti-Entropy
alias:
  -/docs/v1.3/administration/anti-entropy
menu:
  enterprise_influxdb_1_3:
    weight: 10
    parent: Guides
---

## Introduction

The anti-entropy service tries to ensure that the replication factor of a shard is respected as new data nodes are introduced to a cluster.
This guide covers some of the basic situations where the anti-entropy service takes effect.

## Concepts

The anti-entropy service examines whether existing nodes are present on as many nodes as required by their replication factor,
and if the actual number of copies is less than indicated by the replication factor, the service will copy existing shards from shard owner nodes to nodes that do not have a copy of the shard.

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
5	stable.example:8088	1.3.0-c1.3.0
4	offline.example:8088

Meta Nodes
==========
TCP Address		Version
meta-0.example:8091		1.3.0-c1.3.0
meta-1.example:8091		1.3.0-c1.3.0
meta-2.example:8091		1.3.0-c1.3.0
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

Although you could remove the offline data node first, it is better to bring the new node online first in case any new shards must be created.
Follow the [Data Node Installation Guide](/enterprise_influxdb/v1.3/production_installation/data_node_installation/) to completion, and verify that the new node is listed in `influxd-ctl show`:

```
$ influxd-ctl show
Data Nodes
==========
ID	TCP Address		Version
5	stable.example:8088	1.3.0-c1.3.0
4	offline.example:8088
6	new.example:8088		1.3.0-c1.3.0

Meta Nodes
==========
TCP Address		Version
meta-0.example:8091		1.3.0-c1.3.0
meta-1.example:8091		1.3.0-c1.3.0
meta-2.example:8091		1.3.0-c1.3.0
```

If you check the output of `influxd-ctl show-shards` now, you will see that the new node doesn't own any of the shards that existed before
(but if a new shard was created, the new node may be an owner).
We need to instruct the meta service to remove the offline node.
The data node is no longer present to communicate with the meta servers, so we must use `influxd-ctl remove-data -force`:

```
$ influxd-ctl remove-data -force offline.example:8088
Removed data node at offline.example:8088
```

The next anti-entropy service check will see that some of the shards with replication factor of 2 only have one owner, and it will begin copying shards to the new node.
This should happen fairly quickly, but depending on many shards need to be copied and how large they are, it may take a while.

```
$ influxd-ctl show-shards
Shards
==========
ID  Database   Retention Policy  Desired Replicas  Shard Group  Start                 End                   Expires               Owners
3   telegraf   autogen           2                 2            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{5 stable.example:8088} {6 new.example:8088}]
1   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{5 stable.example:8088}]
2   _internal  monitor           2                 1            2017-06-22T00:00:00Z  2017-06-23T00:00:00Z  2017-06-30T00:00:00Z  [{6 new.example:8088}]
4   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{5 stable.example:8088}]
5   _internal  monitor           2                 3            2017-06-23T00:00:00Z  2017-06-24T00:00:00Z  2017-07-01T00:00:00Z  [{6 new.example:8088}]
6   foo        autogen           2                 4            2017-06-19T00:00:00Z  2017-06-26T00:00:00Z                        [{5 stable.example:8088} {6 new.example:8088}]
```

Once you see that the old data node ID doesn't own any more shards, the anti-entropy job is complete.

### Scenario 2: Replacing a machine that is running a data node

Perhaps you're replacing a machine that's being decommissioned, upgrading hardware, or something else entirely.
The anti-entropy service will automatically copy shards to the new machines.

The procedure is nearly identical to previous scenario.

We'll start by bringing the new node online, following the instructions in the [Data Node Installation Guide](/enterprise_influxdb/v1.3/production_installation/data_node_installation/) to completion.

Then we will log on to a meta node and confirm that the new node is part of the cluster by checking the output of `influxd-ctl show`.
Next, remove the node that we no longer want to be part of the cluster:

```
$ influxd-ctl remove-data retired-data.example:8088
[I] 2017-06-22T21:33:19Z Error: dial tcp retired-data.example:8088: getsockopt: connection refused. Retrying after 20ms
[I] 2017-06-22T21:33:19Z Error: dial tcp retired-data.example:8088: getsockopt: connection refused. Retrying after 400ms
Removed data node at retired-data.example:8088
```

It's common to see some intermittent network errors when removing a data node.
However, if the command only prints errors and doesn't say that it removed the data node, use `influxd-ctl remove-data -force ADDRESS` to ensure that the node is removed from the cluster.

Finally, the anti-entropy service will begin to copy shards to the new owner within the configured `anti-entropy.check-interval` duration.
