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

Manually rebalance an InfluxDB Enterprise cluster to ensure:

- [Shards](/influxdb/v1.7/concepts/glossary/#shard) are evenly distributed across all data nodes in the
cluster
- Every shard is on *n* number of nodes, where *n* is the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor).

## Why rebalance?

**Rebalance a cluster any time you do one of the following:**

- Expand capacity and increase write throughput by adding a data node.
- Increase availability and query throughput, by either:
  - Adding data nodes and increasing the replication factor.
  - Adjusting fully replicated data to partially replicated data. See [Full versus partial replication](#full-versus-partial-replication).
- Add or remove a data node for any reason.
- Adjust your replication factor for any reason.

### Full versus partial replication

When replication factor equals the number of data nodes, data is fully replicated to all data nodes in a cluster. Full replication means each node can respond to queries without communicating with other data nodes. A more typical configuration is a partial replication of data; for example, a replication factor of 2 with 4, 6, or 8 data nodes. Partial replication allows more series to be stored in a database.

## Rebalance your cluster

{{% warn %}}
Before you begin, do the following:

- Stop writing data to InfluxDB. Rebalancing while writing data can lead to data loss.
- Enable anti-entropy (AE) to ensure all shard data is successfully copied. To learn more about AE, see [Use Anti-Entropy service in InfluxDB Enterprise](/enterprise_influxdb/v1.7/administration/anti-entropy).
{{% /warn %}}

After adding or removing data nodes from your cluster, complete the following steps to rebalance:

1. If applicable, [update the replication factor](#update-the-replication-factor).
2. [Truncate hot shards](#truncate-hot-shards) (shards actively receiving writes).
3. [Identify cold shards](#identify-cold-shards)
4. [Copy cold shards to new data node](#copy-cold-shards-to-new-data-node)
4. If you're expanding capacity to increase write throughput, [remove cold shards from an original data node](#remove-cold-shards-from-original-data-node).
6. [Confirm the rebalance](#confirm-the-rebalance).

> **Important:** The number of data nodes in a cluster **must be evenly divisible** by the replication factor.
For example, a replication factor of 2 works with 2, 4, 6, or 8 data nodes. A replication factor of 3 works with 3, 6, or 9 data nodes.

### Update the replication factor

The following example shows how to increase the replication factor to `3`. Adjust the replication factor as needed for your cluster, ensuring the number of data nodes is evenly divisible by the replication factor.

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

- In InfluxDB [CLI](/influxdb/v1.7/tools/shell/), run the following command:
 
    ```sh
    influxd-ctl truncate-shards
    ``` 
    A message confirms shards have been truncated. Previous writes are stored in cold shards and InfluxDB starts writing new points to a new hot shard.
    New hot shards are automatically distributed across the cluster.

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

2. For each cold shard, note the shard `ID` and `Owners` or data node TCP name (for example, `enterprise-data-01:8088`).

3. Run the following command to determine the size of the shards in your cluster:

    ```sh
       find /var/lib/influxdb/data/ -mindepth 3 -type d -exec du -h {} \;
    ```
    > To increase capacity on the original data nodes, move larger shards to the new data node. Note that moving shards impacts network traffic.

### Copy cold shards to new data node

1. In InfluxDB CLI, run the following command, specifying the `shard ID` to copy, the `source_TCP_name` of the original data node and `destination_TCP_name` of the new data node:

    ```
    influxd-ctl copy-shard <source_TCP_name> <destination_TCP_name> <shard_ID>
    ```
    A message appears confirming the shard was copied.

2. Repeat step 1 for every cold shard you want to move to the new data node.

3. Confirm copied shards display the TCP name of the new data node as an owner:

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

Copied shards appear in the new data node shard directory: `/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

### Remove cold shards from original data node

**Removing a shard is an irrecoverable, destructive action; use this command with caution.**

1. Run the following command, specifying the cold shard ID to remove and the source_TCP_name of one of the original data nodes:

    ```
    influxd-ctl remove-shard <source_TCP_name> <shard_ID>
    ```
    
    Expected output:

    ```
    Removed shard <shard_ID> from <source_TCP_name>
    ```

2. Repeat step 1 to remove all cold shards from one of the original data nodes.

### Confirm the rebalance

- For each relevant shard, confirm the TCP name is correct by running the following command.

    ```
    influxd-ctl show-shards
    ```

    For example:

    - If you're **rebalancing to expand the capacity to increase write throughput**, verify the new data node and only one of the original data nodes appears in the `Owners` column:

        Expected output shows that the copied shard now has only two owners:

        ```
        Shards
        ==========
        ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
        22   telegraf    autogen            2                  [...]   2017-01-26T18:05:36.418734949Z*   [{5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
        ```

    - If you're **rebalancing to increase data availability for queries and query throughput**, verify the TCP name of the new data node appears in the `Owners` column:
       
        Expected output shows that the copied shard now has three owners:

            ```
            Shards
            ==========
            ID   Database    Retention Policy   Desired Replicas   [...]   End                               Owners
            22   telegraf    autogen            3                  [...]   2017-01-26T18:05:36.418734949Z*   [{4 enterprise-data-01:8088} {5 enterprise-data-02:8088} {6 enterprise-data-03:8088}]
            
            In addition, verify that the copied shards appear in the new data node’s shard directory and match the shards in the source data node’s shard directory. 
            Shards are located in `/var/lib/influxdb/data/<database>/<retention_policy>/<shard_ID>`.

            Here’s an example of the correct output for shard 22:

            # On the source data node (enterprise-data-01)

            ~# ls /var/lib/influxdb/data/telegraf/autogen/22
            000000001-000000001.tsm # 

            # On the new data node (enterprise-data-03)

            ~# ls /var/lib/influxdb/data/telegraf/autogen/22
            000000001-000000001.tsm # 
