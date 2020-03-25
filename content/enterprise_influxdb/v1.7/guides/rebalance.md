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

- Any time you add or remove a data node.
- Any time you adjust your replication factor.
- To expand capacity and increase write throughput, add a data node and rebalance.
- To increase availability and improve query throughput, either:
  - Increase the replication factor and rebalance.
  - Adjust fully replicated data
- To improve bandwidth. Adjust a cluster with fully replicated data (replication factor equals number of nodes) to partially replicated data.

## Requirements

{{% warn %}}
Before you begin, stop writing historical data (timestamps occur in the past) to InfluxDB. Historical data has timestamps that occur in the past. Rebalancing while writing historical data can lead to data loss.
{{% /warn %}}

## Rebalance your cluster

Complete the following steps to rebalance your cluster:

1. If applicable, [update the retention policy](#update-the-retention-policy).
2. Truncate hot shards (shards actively receiving writes).
3. Identify cold shards
4. If applicable, copy cold shards to new data node and remove from original data node
6. Confirm rebalance

> **Important:** The number of data nodes in a cluster **must be** evenly divisible by the replication factor.
For example, a replication factor of 2 works with 2, 4, 6, or 8 data nodes. A replication factor of 3 works with 3, 6, or 9 data nodes.

### Update the retention policy

The following example shows how to increase the replication factor to `3`. Adjust the replication factor as needed for your cluster.

**Important:** To successfully replicate data across a cluster, the number of data nodes **must be evenly divisible** by the replication factor.

1. In InfluxDB [CLI](/influxdb/v1.7/tools/shell/), run the following query on any data node for each retention policy and database:

    ```
    > ALTER RETENTION POLICY "<retention_policy_name>" ON "<database_name>" REPLICATION 3
    >
    ```
If successful, no query results are returned. At this point, InfluxDB automatically distributes all new shards across the data nodes in the cluster with the correct number of replicas.

2. To verify the new replication factor, run the [`SHOW RETENTION POLICIES` query](/influxdb/v1.7/query_language/schema_exploration/#show-retention-policies):

    ```
    > SHOW RETENTION POLICIES ON "telegraf"

    name     duration  shardGroupDuration  replicaN  default
    ----     --------  ------------------  --------  -------
    autogen  0s        1h0m0s              3 #       true
    ```

### Truncate hot shards

1. In InfluxDB [CLI](/influxdb/v1.7/tools/shell/), run the following command:
 
    ```sh
    influxd-ctl truncate-shards
    ``` 
A message confirms shards have been truncated. Previous writes are stored in cold shards and InfluxDB starts writing new points to a new hot shard. New hot shards are automatically distributed across the cluster.

### Identify cold shards

1. In InfluxDB CLI, run following command to view every shard in the cluster:

        ```
        influxd-ctl show-shards
       
    
        Shards
        ==========
        ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
        21   telegraf    autogen            2                  [...]   2020-01-26T18:00:00Z              [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
        22   telegraf    autogen            2                  [...]   2020-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088}]
        24   telegraf    autogen            2                  [...]   2020-01-26T19:00:00Z              [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
        ```

This example shows three shards:

- Shards are cold if their `End` timestamp occurs in the past. In this example, the current time is `2020-01-26T18:05:36.418734949Z`, so the first two shards are cold.
- Shard owners identify data nodes in a cluster. In this example, cold shards are on two data nodes: `enterprise-data-01:8088` and `enterprise-data-02:8088`.
- Truncated shards have an asterix (`*`) after timestamp. In this example, the second shard is truncated.
- Shards with an `End` timestamp in the future are hot shards. In this example, the third shard is the newly-created hot shard. The host shard owner includes one of the original data nodes (`enterprise-data-02:8088`) and the new data node
(`enterprise-data-03:8088`).

2. For each cold shard, note the shard `ID` and `Owners` or data node TCP address (for example, `enterprise-data-01:8088`).

3. Run the following command to determine the size of the shards in your cluster:

    ```sh
       find /var/lib/influxdb/data/ -mindepth 3 -type d -exec du -h {} \;
    ```
> To increase capacity on the original data nodes, move larger shards to the new data node. Note that moving shards impacts network traffic.

### Copy cold shards to new data node

1. In InfluxDB CLI, run the following command, specifying the <source TCP address> of the original data node and <destination_TCP_address> of the new data node:

    ```
    influxd-ctl copy-shard <source_TCP_address> <destination_TCP_address> <shard_ID>

    ...
    Copied shard <shard_ID> from <source_TCP_address> to <destination_TCP_address>
    ```

2. Repeat step 1 for every cold shard you want to move to the new data node. Update the following:
    - `source_TCP_address` TCP address of cold shard owner
    - `destination_TCP_address` TCP address of the new data node
    - `shard_ID` identified cold shard ID

3. Confirm copied shards display the TCP address of the new data node:

    ```
    influxd-ctl show-shards
    ```

    Expected output shows copied shard now has three owners:
    ```
    Shards
    ==========
    ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
    22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
    ```

4. Verify copied shards appear in the new data node shard directory and match the original data node shard directory.
Shards are located in `/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

    For example, for shard ID 22:
    ```
    # On the source data node (enterprise-data-01)

    ~# ls /var/lib/influxdb/data/telegraf/autogen/22
    000000001-000000001.tsm #

    # On the new data node (enterprise-data-03)

    ~# ls /var/lib/influxdb/data/telegraf/autogen/22
    000000001-000000001.tsm # 
    ```

### Remove cold shards from original data node

Remove cold shards from one of the original two data nodes.

**Removing a shard is an irrecoverable, destructive action; use this command with caution.**

1. Run the following command, specifying the cold shard ID to remove and the source_TCP_address of one of the original data nodes:

    ```
    influxd-ctl remove-shard <source_TCP_address> <shard_ID>
    ```
    
    Expected output:

    ```
    Removed shard <shard_ID> from <source_TCP_address>
    ```

2. Repeat step 1 to remove all cold shards from one of the original data nodes.

### Confirm the rebalance

1. For each relevant shard, confirm the TCP address is correct by running the following command.

    ```
    influxd-ctl show-shards
    ```

    For example:

    - If you're rebalancing to expand the capacity to increase write throughput, verify the new data node and only one of the original data nodes appears in the `Owners` column: 

        Expected output shows that the copied shard now has only two owners:

        ```
        Shards
        ==========
        ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
        22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
        ```

    - If you're rebalancing to increase data availability for queries and query throughput, verify the TCP address of the new data node appears in the Owners column:
       
       Expected output shows that the copied shard now has three owners:

        ```
        Shards
        ==========
        ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
        22   telegraf    autogen            3                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
        
        In addition, verify that the copied shards appear in the new data node’s shard directory and match the shards in the source data node’s shard directory. 
        Shards are located in /var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>.

        Here’s an example of the correct output for shard 22:

        # On the source data node (enterprise-data-01)

        ~# ls /var/lib/influxdb/data/telegraf/autogen/22
        000000001-000000001.tsm # 

        # On the new data node (enterprise-data-03)

        ~# ls /var/lib/influxdb/data/telegraf/autogen/22
        000000001-000000001.tsm # 