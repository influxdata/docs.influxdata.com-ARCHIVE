---
title: Rebalancing InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.7/guides/rebalance/
menu:
  enterprise_influxdb_1_7:
    name: Rebalancing clusters
    weight: 19
    parent: Guides
---

## Introduction

Rebalancing an InfluxDB Enterprise cluster is essential for cluster health. Rebalancing a cluster ensures:

- [Shards](/influxdb/v1.7/concepts/glossary/#shard) are evenly distributed across all data nodes in the
cluster
- Every shard is on *n* number of nodes, where *n* is the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor). 

Rebalance your cluster in the following cases:

- To expand capacity and increase write throughput, add a data node and rebalance.
- To increase availability and improve query throughput, either:
  - Increase the replication factor and rebalance.
  - Adjust fully replicated data
- To improve bandwidth. Adjust a cluster with fully replicated data (replication factor equals number of nodes) to partially replicated data.
- Any time you add or remove a data node.
- Any time you adjust your replication factor.

## Requirements

{{% warn %}}
Before you begin, stop writing historical data (timestamps occur in the past) to InfluxDB. Historical data has timestamps that occur in the past. Rebalancing while writing historical data can lead to data loss.
{{% /warn %}}

## Rebalance your cluster

Complete the following steps to rebalance your cluster:

1. To expand cluster capacity or write throughput, [update the retention policy](#update-the-retention-policy).
2. Truncate hot shards
3. Identify cold shards
4. Confirm copied shards and remove obsolete cold shards (complete this step if you want to improve availability and query throughput)
5. Confirm rebalance

> **Important:** The number of data nodes in a cluster **must be** evenly divisible by the replication factor.
For example, a replication factor of 2 works with 2, 4, 6, or 8 data nodes. A replication factor of 3 works with 3, 6, or 9 data nodes.

### Update the retention policy

The following example shows how to update the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor) to
`3`. Adjust the replication factor and data nodes as needed for your cluster.

**Important:** To successfully replicate data across a cluster, the number of data nodes **must be evenly divisible** by the replication factor.

1. Increase the replication factor to three by running the following query on any data node for each retention policy and database.
Use InfluxDB's [CLI](/influxdb/v1.7/tools/shell/) to execute the query:

    ```
    > ALTER RETENTION POLICY "<retention_policy_name>" ON "<database_name>" REPLICATION 3
    >
    ```
If successful, no query results are returned. InfluxDB automatically distributes all newly-created shards across the data nodes in the cluster with the correct number of replicas.

2. To verify the new replication factor, use the [`SHOW RETENTION POLICIES` query](/influxdb/v1.7/query_language/schema_exploration/#show-retention-policies).

    Example:
    ```
    > SHOW RETENTION POLICIES ON "telegraf"

    name     duration  shardGroupDuration  replicaN  default
    ----     --------  ------------------  --------  -------
    autogen  0s        1h0m0s              3 #👍     true
    ```

### Truncate hot shards

Hot shards actively receive writes. Avoid performing any action on hot shards.
To prevent data inconsistency, truncate hot shards before copying any shards
to the new data node.

1. Use the following command to truncate hot shards and create a new hot shard distributed across all data nodes in the cluster:
 
    ```sh
    influxd-ctl truncate-shards
    ```
    
A message confirms shards have been truncated. All previous writes are stored in cold shards and InfluxDB starts writing new points to the new hot shard.

> Now you can distribute cold shards without the threat of data inconsistency in the cluster. Hot or new shards are automatically distributed across the cluster.


### Identify cold shards

1. Identify the cold shards to copy to the new data node and remove from one of the original two data nodes.
   a. Use the following command to view every shard in the cluster:

        ```
        influxd-ctl show-shards
        ```

    The expected output is similar to the following:

        ```
        Shards
        ==========
        ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
        21   telegraf    autogen            2                  [...]   2017-01-26T18:00:00Z              [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
        22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
        24   telegraf    autogen            2                  [...]   2017-01-26T19:00:00Z              [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
        ```

The sample output includes three shards. The first two shards are cold shards.
The timestamp in the `End` column occurs in the past (assume that the current time is just after `2017-01-26T18:05:36.418734949Z`), and the shards' owners
are the two original data nodes: `enterprise-data-01:8088` and `enterprise-data-02:8088`.
The second shard is the truncated shard; truncated shards have an asterix (`*`) on the timestamp in the `End` column.

The third shard is the newly-created hot shard; the timestamp in the `End` column is in the future (again, assume that the current time is just after
`2017-01-26T18:05:36.418734949Z`), and the shard's owners include one of the original data nodes (`enterprise-data-02:8088`) and the new data node
(`enterprise-data-03:8088`).
That hot shard and any subsequent shards require no attention during the rebalance process.

Identify the cold shards that you'd like to move from one of the original two
data nodes to the new data node.
Take note of the cold shard's `ID` (for example: `22`) and the TCP address of
one of its owners in the `Owners` column (for example: `enterprise-data-01:8088`).

> **Note:** Use the following command to determine the size of the shards in your cluster:
>
    find /var/lib/influxdb/data/ -mindepth 3 -type d -exec du -h {} \;
>
In general, we recommend moving larger shards to the new data node to increase the available disk space on the original data nodes.
Note that moving shards impacts network traffic.

### Copy cold shards

1. Use the following command to copy the relevant cold shards to the new data node:

    ```
    influxd-ctl copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>
    ```

    Expected output:

    ```
    Copied shard <shard_ID> from <source_TCP_address> to <destination_TCP_address>
    ```

2. Repeat step 1 for every cold shard you want to move to the new data node. Update the following:
    - `source_TCP_address` TCP address of cold shard owner
    - `destination_TCP_address` TCP address of the new data node
    - `shard_ID` identified cold shard ID

### Confirm the copied shards

1. Use the following command to confirm that copied shards display the TCP address of the new data node in the `Owners` column:

    ```
    influxd-ctl show-shards
    ```

    Expected output shows that the copied shard now has three owners:
    ```
    Shards
    ==========
    ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
    22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
    ```

2. Verify every copied shard appear in the new data node's shard directory and match the shards in the source data node's shard directory.
Shards are located in `/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

Here's an example of the correct output for shard `22`:
```
# On the source data node (enterprise-data-01)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍

# On the new data node (enterprise-data-03)

~# ls /var/lib/influxdb/data/telegraf/autogen/22
000000001-000000001.tsm # 👍
```

### Remove obsolete cold shards

**Removing a shard is an irrecoverable, destructive action; use this command with caution.**

1. Use the following command to remove copied shards from the original data node:

    ```
    influxd-ctl remove-shard <source_TCP_address> <shard_ID>
    ```

2. Repeat this command for to remove all cold shards from one of the original data nodes:
    - `source_TCP_address` TCP address of the original data node
    - `shard_ID` identified cold shard ID

    Expected output:

    ```
    Removed shard <shard_ID> from <source_TCP_address>
    ```

### Confirm the rebalance

1. For every relevant shard, confirm the TCP address of the new data node and only one of the original data nodes appears in the `Owners` column:

    ```
    influxd-ctl show-shards
    ```

    Expected output shows that the copied shard now has only two owners:

    ```
    Shards
    ==========
    ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
    22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
    ```


You've successfully rebalanced your cluster, expanded the available disk size on the original data nodes, and increased the cluster's write throughput.