---
title: Cluster Rebalance
menu:
  enterprise_1_2:
    weight: 19
    parent: Guides
---

## Introduction

This guide describes how to manually rebalance an InfluxEnterprise cluster.
Rebalancing a cluster involves two primary goals:

* Evenly distribute
[shards](/influxdb/v1.2/concepts/glossary/#shard) across all data nodes in the
cluster
* Ensure that every
shard is on N number of nodes, where N is determined by the retention policy's
[replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor)

Rebalancing a cluster is essential for cluster health.
Perform a rebalance if you add a new data node to your cluster.
The proper rebalance path depends on the purpose of the new data node.
If you added a data node to expand the disk size of the cluster or increase
write throughput, follow the steps in
[Rebalance Procedure 1](#rebalance-procedure-1-rebalance-a-cluster-to-create-space).
If you added a data node to increase data availability for queries and query
throughput, follow the steps in
[Rebalance Procedure 2](#rebalance-procedure-2-rebalance-a-cluster-to-increase-availability).

### Requirements

The following sections assume that you already added a new data node to the
cluster, and they use the
[`influx-ctl` tool](/enterprise/v1.2/features/cluster-commands/) available on
all meta nodes.

Before you begin, stop writing historical data to InfluxDB.
Historical data are data with timestamps that occur in the past, that is, they're
data that aren't real-time data.
Performing a rebalance while writing historical data can lead to data loss.

## Rebalance Procedure 1: Rebalance a cluster to create space

For demonstration purposes, the next steps assume that you added a third
data node to a previously two-data-node cluster that has a
[replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor) of
two.
This rebalance procedure is applicable for different cluster sizes and
replication factors, but some of the specific, user-provided values will depend
on that cluster size.

Rebalance Procedure 1 focuses on how to rebalance a cluster after adding a
data node to expand the total disk capacity of the cluster.
In the next steps, you will safely move shards from one of the two original data
nodes to the new data node.

### Step 1: Truncate Hot Shards

Hot shards are shards that are currently receiving writes.
Performing any action on a hot shard can lead to data inconsistency within the
cluster which requires manual intervention from the user.

To prevent data inconsistency, truncate hot shards before moving any shards
across data nodes.
The command below creates a new hot shard which is automatically distributed
across all data nodes in the cluster, and the system writes all new points to
that shard.
All previous writes are now stored in cold shards.

```
influxd-ctl truncate-shards
```

The expected ouput of this command is:

```
Truncated shards.
```

Once you truncate the shards, you can work on redistributing the cold shards
without the threat of data inconsistency in the cluster.
Any hot or new shards are now evenly distributed across the cluster and require
no further intervention.

### Step 2: Identify Cold Shards

In this step, you identify the cold shards that you will copy to the new data node
and remove from one of the original two data nodes.

The following command lists every shard in our cluster:

```
influxd-ctl show-shards
```

The expected output is similar to the items in the codeblock below:

```
Shards
==========
ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
21   telegraf    autogen            2                  [...]   2017-01-26T18:00:00Z              [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
24   telegraf    autogen            2                  [...]   2017-01-26T19:00:00Z              [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
```

The sample output includes three shards.
The first two shards are cold shards.
The timestamp in the `End` column occurs in the past (assume that the current
time is just after `2017-01-26T18:05:36.418734949Z`), and the shards' owners
are the two original data nodes: `enterprise-data-01:8088` and
`enterprise-data-02:8088`.
The second shard is the truncated shard; truncated shards have an asterix (`*`)
on the timestamp in the `End` column.

The third shard is the newly-created hot shard; the timestamp in the `End`
column is in the future (again, assume that the current time is just after
`2017-01-26T18:05:36.418734949Z`), and the shard's owners include one of the
original data nodes (`enterprise-data-02:8088`) and the new data node
(`enterprise-data-03:8088`).
That hot shard and any subsequent shards require no attention during
the rebalance process.

Identify the cold shards that you'd like to move from one of the original two
data nodes to the new data node.
Take note of the cold shard's `ID` (for example: `22`) and the TCP address of
one of its owners in the `Owners` column (for example:
`enterprise-data-01:8088`).

> **Note:**
>
Use the following command string to determine the size of the shards in
your cluster:
>
    find /var/lib/influxdb/data/ -mindepth 3 -type d -exec du -h {} \;
>
In general, we recommend moving larger shards to the new data node to increase the
available disk space on the original data nodes.
Users should note that moving shards will impact network traffic.

### Step 3: Copy Cold Shards

Next, copy the relevant cold shards to the new data node with the syntax below.
Repeat this command for every cold shard that you'd like to move to the
new data node.

```
influxd-ctl copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>
```

Where `source_TCP_address` is the address that you noted in step 2,
`destination_TCP_address` is the TCP address of the new data node, and `shard_ID`
is the ID of the shard that you noted in step 2.

The expected output of the command is:
```
Copied shard <shard_ID> from <source_TCP_address> to <destination_TCP_address>
```

### Step 4: Confirm the Copied Shards

Confirm that the TCP address of the new data node appears in the `Owners` column
for every copied shard:

```
influxd-ctl show-shards
```

The expected output shows that the copied shard now has three owners:
```
Shards
==========
ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
```

In addition, verify that the copied shards appear in the new data node's shard
directory and match the shards in the source data node's shard directory.
Shards are located in
`/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

Here's an example of the correct output for shard `22`:
```
# On the source data node (enterprise-data-01)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍

# On the new data node (enterprise-data-03)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍
```

It is essential that every copied shard appears on the new data node both
in the `influxd-ctl show-shards` output and in the shard directory.
If a shard does not pass both of the tests above, please repeat step 3.

### Step 5: Remove Unnecessary Cold Shards

Next, remove the copied shard from the original data node with the command below.
Repeat this command for every cold shard that you'd like to remove from one of
the original data nodes.
**Removing a shard is an irrecoverable, destructive action; please be
cautious with this command.**

```
influxd-ctl remove-shard <source_TCP_address> <shard_ID>
```

Where `source_TCP_address` is the TCP address of the original data node and
`shard_ID` is the ID of the shard that you noted in step 2.

The expected output of the command is:
```
Removed shard <shard_ID> from <source_TCP_address>
```

### Step 6: Confirm the Rebalance

For every relevant shard, confirm that the TCP address of the new data node and
only one of the original data nodes appears in the `Owners` column:

```
influxd-ctl show-shards
```

The expected output shows that the copied shard now has only two owners:
```
Shards
==========
ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
```

That's it.
You've successfully rebalanced your cluster; you expanded the available disk
size on the original data nodes and increased the cluster's write throughput.

## Rebalance Procedure 2: Rebalance a cluster to increase availability

For demonstration purposes, the next steps assume that you added a third
data node to a previously two-data-node cluster that has a
[replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor) of
two.
This rebalance procedure is applicable for different cluster sizes and
replication factors, but some of the specific, user-provided values will depend
on that cluster size.

Rebalance Procedure 2 focuses on how to rebalance a cluster to improve availability
and query throughput.
In the next steps, you will increase the retention policy's replication factor and
safely copy shards from one of the two original data nodes to the new data node.

### Step 1: Update the Retention Policy

[Update](/influxdb/v1.2/query_language/database_management/#modify-retention-policies-with-alter-retention-policy)
every retention policy to have a replication factor of three.
This step ensures that the system automatically distributes all newly-created
shards across the three data nodes in the cluster.

The following query increases the replication factor to three.
Run the query on any data node for each retention policy and database.
Here, we use InfluxDB's [CLI](/influxdb/v1.2/tools/shell/) to execute the query:

```
> ALTER RETENTION POLICY "<retention_policy_name>" ON "<database_name>" REPLICATION 3
>
```

A successful `ALTER RETENTION POLICY` query returns no results.
Use the
[`SHOW RETENTION POLICIES` query](/influxdb/v1.2/query_language/schema_exploration/#show-retention-policies)
to verify the new replication factor.

Example:
```
> SHOW RETENTION POLICIES ON "telegraf"

name     duration  shardGroupDuration  replicaN  default
----     --------  ------------------  --------  -------
autogen  0s        1h0m0s              3 #👍     true                                        
```

### Step 2: Truncate Hot Shards

Hot shards are shards that are currently receiving writes.
Performing any action on a hot shard can lead to data inconsistency within the
cluster which requires manual intervention from the user.

To prevent data inconsistency, truncate hot shards before copying any shards
to the new data node.
The command below creates a new hot shard which is automatically distributed
across the three data nodes in the cluster, and the system writes all new points
to that shard.
All previous writes are now stored in cold shards.

```
influxd-ctl truncate-shards
```

The expected ouput of this command is:

```
Truncated shards.
```

Once you truncate the shards, you can work on distributing the cold shards
without the threat of data inconsistency in the cluster.
Any hot or new shards are now automatically distributed across the cluster and
require no further intervention.

### Step 3: Identify Cold Shards

In this step, you identify the cold shards that you will copy to the new data node.

The following command lists every shard in your cluster:

```
influxd-ctl show-shards
```

The expected output is similar to the items in the codeblock below:

```
Shards
==========
ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
21   telegraf    autogen            3                  [...]   2017-01-26T18:00:00Z              [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
22   telegraf    autogen            3                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
24   telegraf    autogen            3                  [...]   2017-01-26T19:00:00Z              [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
```

The sample output includes three shards.
The first two shards are cold shards.
The timestamp in the `End` column occurs in the past (assume that the current
time is just after `2017-01-26T18:05:36.418734949Z`), and the shards' owners
are the two original data nodes: `enterprise-data-01:8088` and
`enterprise-data-02:8088`.
The second shard is the truncated shard; truncated shards have an asterix (`*`)
on the timestamp in the `End` column.

The third shard is the newly-created hot shard; the timestamp in the `End`
column is in the future (again, assume that the current time is just after
`2017-01-26T18:05:36.418734949Z`), and the shard's owners include all three
data nodes: `enterprise-data-01:8088`, `enterprise-data-02:8088`, and
`enterprise-data-03:8088`.
That hot shard and any subsequent shards require no attention during
the rebalance process.

Identify the cold shards that you'd like to copy from one of the original two
data nodes to the new data node.
Take note of the cold shard's `ID` (for example: `22`) and the TCP address of
one of its owners in the `Owners` column (for example:
`enterprise-data-01:8088`).

### Step 4: Copy Cold Shards

Next, copy the relevant cold shards to the new data node with the syntax below.
Repeat this command for every cold shard that you'd like to move to the
new data node.

```
influxd-ctl copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>
```

Where `source_TCP_address` is the address that you noted in step 3,
`destination_TCP_address` is the TCP address of the new data node, and `shard_ID`
is the ID of the shard that you noted in step 3.

The expected output of the command is:
```
Copied shard <shard_ID> from <source_TCP_address> to <destination_TCP_address>
```

### Step 5: Confirm the Rebalance

Confirm that the TCP address of the new data node appears in the `Owners` column
for every copied shard:

```
influxd-ctl show-shards
```

The expected output shows that the copied shard now has three owners:
```
Shards
==========
ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
22   telegraf    autogen            3                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
```

In addition, verify that the copied shards appear in the new data node's shard
directory and match the shards in the source data node's shard directory.
Shards are located in
`/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

Here's an example of the correct output for shard `22`:
```
# On the source data node (enterprise-data-01)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍

# On the new data node (enterprise-data-03)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍
```

That's it.
You've successfully rebalanced your cluster and increased data availability for
queries and query throughput.
