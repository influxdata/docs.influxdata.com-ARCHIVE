---
title: Cluster Rebalance
menu:
  enterprise_1_2:
    weight: 19
    parent: Guides
---

This guide describes how to manually rebalance an InfluxEnterprise cluster.
Rebalancing a cluster involves two primary goals:

* Evenly distribute
[shards](/influxdb/v1.2/concepts/glossary/#shard) across all data
nodes in the cluster and second
* Ensure that every
[shard](/influxdb/v1.2/concepts/glossary/#shard) is on N number of nodes, where N is determined by the retention policy's
[replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor)

Rebalancing a cluster is essential for cluster health.
You will need to perform a rebalance if you add a new data node to the cluster
or if you add a new data node to the cluster AND increase the retention policy's
replication factor.
The rebalance path is different for each situation;
the sections below offer step-by-step rebalance instructions for each scenario.

### Requirements

The following sections use the [`influx-ctl` tool](/enterprise/v1.2/features/cluster-commands/)
available on all meta nodes.

You will need to stop writing data to InfluxDB if you are writing historical data
to the database.
Performing a rebalance while writing historical data can lead to data loss.

## Scenario 1: Rebalance after adding a new data node to the cluster

For the purpose of demonstrating the rebalance steps, we assume that
you've added a third data node to a cluster that previously consisted of two
data nodes.
The steps below are applicable for any cluster size.

By the end of this section you will have a fully balanced cluster with
the relevant historical shards moved from one of the old data nodes to the
new data node.

#### Step 1: Truncate Hot Shards

Hot shards are shards that are currently receiving writes.
Performing any action on a hot shard can lead to data inconsistency within the cluster which you would need to manually recover later.

The command below truncates all hot shards; the system creates a new
hot shard which is automatically distributed across all data nodes in the cluster.
InfluxDB writes all new points to that new shard.
All previous writes are now stored in cold shards.

```
influxd-ctl truncate-shards
```

Now we can work with the cold shards without the risk of missing any writes.

#### Step 2: Identify Cold Shards

Now we can work with all of the cold shards that are only on two of the three data nodes.
In this step, we identify all of the cold shards that will need to be copied to the new data node and removed from an old data node.
List every shard with the following command:

```
influxd-ctl show-shards
```

Example output:

```
Shards
==========
ID  Database    Retention Policy   Desired Replicas   [...]   End                    Owners
3   _internal   monitor            2                  [...]   2017-01-24T00:00:00Z   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
```

Identify any cold shards that you'd like to move from one of the old data nodes
to the new data node.
Cold shards have an `End` timestamp that occurs in the past.
Take note of the relevant cold shards' `ID` and the TCP address of one of its
owners in the `Owners` column.
The output above has a single cold shard with an `ID` of `3` and an owner with the TCP address `enterprise-data-01:8088`.

#### Step 3: Copy Cold Shards

Copy the relevant cold shards to the new data node with the following syntax.
Repeat this command for every cold shard that you'd like to move to the new data node.

```
copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>
```

Where the `source_TCP_address` is the address that you noted in step 2,
and the `destination_TCP_address` is the TCP address of the new data node.

> **Note** Find the TCP address of the new data node with the `influxd-ctl show`
command.

#### Step 4: Check for the Copied Shards

Check the `Owners` column in the output from the following command and ensure that the cold shards are copied to the new data node.

```
influxd-ctl show-shards
```

In addition verify that the copied shard appears in the
shard directory of the new owner and very if that it matches up with the old owner.
Shards are located in the following directory:

```
/var/lib/influxdb/data/<database>/<retention_policy>/
```

#### Step 5: Remove Unnecessary Cold Shards

Once the relevant cold shards are copied to the new data node, remove
the shard from the old data node with the command below.
Removing a shard is an irrecoverable, destructive action; please be
cautious with this command.

```
remove-shard <source_TCP_address> <shard_ID>
```

Where `source_TCP_address` is the address that you noted in step 2.

#### Step 6: Confirm the Rebalance

Check the `Owners` column in the output from the following command.
If you successfully rebalanced the cluster, the new data node will own several shards and the old data nodes will no longer own as many shards.

```
influxd-ctl show-shards
```

## Scenario 2: Rebalance after adding a new data node to the cluster and increasing the replication factor

For the purpose of demonstrating the rebalance steps, we assume that
you've added a third data node to a cluster that previously consisted of two
data nodes.
The steps below are applicable for any cluster size.

By the end of this section you will have a fully balanced cluster with:

* all historical shards copied and distributed to the new data node
* all new shards automatically appearing on all data nodes in the cluster

#### Step 1: Update the Retention Policy

[Update](/influxdb/v1.2/query_language/database_management/#modify-retention-policies-with-alter-retention-policy)
the replication factor of every retention policy from two to three.
This step ensures that all newly-created shard groups will automatically consist of three
shards and that those shards will be evenly distributed across the cluster.

Run the following query on any data node for each retention policy and database.
Here, we use InfluxDB's [CLI](/influxdb/v1.2/tools/shell/) to execute the query:

```
ALTER RETENTION POLICY <retention_policy_name> ON <database_name> REPLICATION 3
```

#### Step 2: Truncate Hot Shards

Hot shards are shards that are currently receiving writes.
Performing any action on a hot shard can lead to data inconsistency within the cluster which you would need to manually recover later.

The command below truncates all hot shards; the system creates a new
hot shard which automatically adheres to the retention policy that you updated in step 1.
InfluxDB writes all new points to that new shard.
All previous writes are now stored in cold shards.

```
influxd-ctl truncate-shards
```

Now we can work with all shards with the old RF without the risk of missing any writes.

#### Step 3: Identify Cold Shards

Now we can work with all of the cold shards that adhere to the old replication factor.
In this step, we identify all of the cold shards that will need to be copied to the new data node.
List every shard with the following command:

```
influxd-ctl show-shards
```

Example output:

```
Shards
==========
ID  Database    Retention Policy   Desired Replicas   [...]   Owners
3   _internal   monitor            2                  [...]  [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
```

Identify cold shards from the output in the `Desired Replicas` column.
If the number of desired replicas is two - that shard is cold and you
will need to take note of its `ID` and the TCP address of one of its
owners in the `Owners` column.
The output above has a single cold shard with an `ID` of `3` and an owner with the TCP address `enterprise-data-01:8088`.

#### Step 4: Copy Cold Shards

Copy all cold shards to the new data node with the following syntax.
Repeat this command for every cold shard in your database.

```
copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>
```

Where the `source_TCP_address` is the address that you noted in step 3,
and the `destination_TCP_address` is the TCP address of the new data node.

> **Note** Find the TCP address of the new data node with the `influxd-ctl show`
command.

#### Step 5: Confirm the Rebalance

Check the `Owners` column in the output from the following command.
If you successfully rebalanced the cluster, every shard will have three owners.

```
influxd-ctl show-shards
```
