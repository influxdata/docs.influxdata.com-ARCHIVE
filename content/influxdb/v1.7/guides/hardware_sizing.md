---
title: Hardware sizing guidelines
menu:
  influxdb_1_7:
    weight: 40
    parent: Guides
---

Review general hardware recommendations for InfluxDB and find answers to frequently asked questions about hardware sizing.

* [Single node or cluster](/influxdb/v1.7/guides/hardware_sizing/#single-node-or-cluster)
* [Guidelines for a single node](/influxdb/v1.7/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node)
* [Guidelines for a cluster](/influxdb/v1.7/guides/hardware_sizing/#general-hardware-guidelines-for-a-cluster)
* [When do I need more RAM?](/influxdb/v1.7/guides/hardware_sizing/#when-do-i-need-more-ram)
* [What kind of storage do I need?](/influxdb/v1.7/guides/hardware_sizing/#what-kind-of-storage-do-i-need)
* [How much storage do I need?](/influxdb/v1.7/guides/hardware_sizing/#how-much-storage-do-i-need)
* [How should I configure my hardware?](/influxdb/v1.7/guides/hardware_sizing/#how-should-i-configure-my-hardware)

## Single node or cluster

InfluxDB OSS (open source) is a single node instance that's fully open source without redundancy. If the server is unavailable, writes and queries immediately fail.

InfluxDB Enterprise offers multiple nodes (cluster) of InfluxDB with high-availability and redundancy. Multiple copies of data are distributed across multiple servers, so the loss of one server doesn't significantly impact the cluster.

If your performance requirements fall into the [moderate](#guidelines-for-a-single-node) or [low](#guidelines-for-a-single-node) load ranges, you can likely use a single node instance of InfluxDB.

If your performance requires at least one of the following:

- > 750,000 writes per second
- > 100 moderate queries
- > 10,000,000 unique series

We recommend a cluster to distribute the load among multiple servers. Performance at this scale on a single node may not be achievable. Please contact us at <sales@influxdb.com> for assistance with tuning your systems.

## Guidelines for a single node

We define the InfluxDB load by writes per second, queries per second, and number of unique [series](/influxdb/v1.7/concepts/glossary/#series). General CPU, RAM, and IOPS recommendations are based on the load.

Run InfluxDB on locally attached solid state drives (SSDs). Other storage configurations have lower performance and may not be able to recover from small interruptions in normal processing.

| Load             | Field writes per second  | Moderate queries* per second | Unique series   |
|------------------|--------------------------|-----------------------------|-----------------|
|  **Low**         |  < 5,000                 |  < 5                        |  < 100,000      |
|  **Moderate**    |  < 250,000               |  < 25                       |  < 1,000,000    |
|  **High**        |  > 250,000               |  > 25                       |  > 1,000,000    |

* Queries vary widely in their impact on the system. Recommendations are provided for moderate query loads. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

### Low load recommendations

* CPU: 2-4 cores
* RAM: 2-4 GB
* IOPS: 500

### Moderate load recommendations

* CPU: 4-6 cores
* RAM: 8-32 GB
* IOPS: 500-1000

### High load recommendations

* CPU: 8+ cores
* RAM: 32+ GB
* IOPS: 1000+

## Guidelines for a cluster

### Meta nodes

A cluster must have a minimum of three independent meta nodes to survive the loss of a server. A cluster with `2n + 1` meta nodes can tolerate the loss of `n` meta nodes. Clusters should have an odd number of meta nodes. An even number of meta nodes may cause issues in certain configurations.

Meta nodes do not need very much computing power. Regardless of the cluster load, we recommend the following for the meta nodes:

#### Meta node recommendations

* CPU: 1-2 cores
* RAM: 512 MB - 1 GB
* IOPS: 50

### Data nodes

A cluster with only one data node is valid but has no data redundancy. The redundancy is set by the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor) on the retention policy to which the data is written. A cluster can lose `n - 1` data nodes and still return complete query results, where `n` is the replication factor. For optimal data distribution within the cluster, InfluxData recommends using an even number of data nodes.

 Data nodes should have at least 4 vCPUs or CPU cores for handling read and write traffic per node and intra-cluster. Because of intra-cluster communication, data nodes in a cluster handle less throughput than a standalone instance on the same hardware.

| Load         | Writes per second per node  | Moderate queries* per second per node | Unique series per node |
|--------------|-----------------------------|---------------------------------------|------------------------|
|  **Low**     |  < 5,000                    |  < 5                                  |  < 100,000             |
|  **Moderate**|  < 100,000                  |  < 25                                 |  < 1,000,000           |
|  **High**    |  > 100,000                  |  > 25                                 |  > 1,000,000           |

* Queries vary widely in their impact on the system. Recommendations are provided for moderate query loads. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

#### Low load recommendations

* CPU: 2 cores
* RAM: 2-4 GB
* IOPS: 1000

#### Moderate load recommendations

* CPU: 4-6
* RAM: 8-32GB
* IOPS: 1000+

#### High load recommendations

* CPU: 8+
* RAM: 32+ GB
* IOPS: 1000+

### Enterprise Web Node

The Enterprise Web server is primarily an HTTP server with similar load requirements. For most applications, the server doesn'tt need to be very robust. A cluster can function with only one web server, but for redundancy, we recommend multiple web servers be connected to a single back-end Postgres database.

> **Note:** Production clusters should not use the SQLite database (lacks support for redundant web servers and handling high loads).

#### Data node recommendations

* CPU: 1-4 cores
* RAM: 1-2 GB
* IOPS: 50

##### Query guidelines

|Query complexity| Criteria|

|Simple | Have few or no functions and no regular expressions
||Are bounded in time to a few minutes, hours, or maybe a day|
||Typically execute in a few milliseconds to a few dozen milliseconds|

|Moderate queries| Have multiple functions and one or two regular expressions|
||May also have complex `GROUP BY` clauses or sample a time range of multiple weeks|
||Typically execute in a few hundred or a few thousand milliseconds|

|Complex queries| Have multiple aggregation or transformation functions or multiple regular expressions
||May sample a very large time range of months or years|
||Typically take multiple seconds to execute|

## When do I need more RAM?

In general, having more RAM helps queries return faster. There is no known downside to adding more RAM.

The major component that affects your RAM needs is [series cardinality](/influxdb/v1.7/concepts/glossary/#series-cardinality).
A series cardinality around or above 10 million can cause OOM failures even with large amounts of RAM. If this is the case, you can usually address the problem by redesigning your [schema](/influxdb/v1.7/concepts/glossary/#schema).

The increase in RAM needs relative to series cardinality is exponential where the exponent is between one and two:

![Series Cardinality](/img/influxdb/series-cardinality.png)

## What kind of storage do I need?

InfluxDB is designed to run on SSDs. InfluxData does not test on HDDs or networked storage devices, and we do not recommend them for production.  Performance is an order of magnitude lower on spinning disk drives and the system may break down under even moderate load. For best results InfluxDB servers must have at least 1000 IOPS on the storage system.

Please note that cluster data nodes have very high IOPS requirements when the cluster is recovering from downtime. It is recommended that the storage system have at least 2000 IOPS to allow for rapid recovery. Below 1000 IOPS, the cluster may not be able to recover from even a brief outage.

## How much storage do I need?

Database names, [measurements](/influxdb/v1.7/concepts/glossary/#measurement), [tag keys](/influxdb/v1.7/concepts/glossary/#tag-key), [field keys](/influxdb/v1.7/concepts/glossary/#field-key), and [tag values](/influxdb/v1.7/concepts/glossary/#tag-value) are stored only once and always as strings. Only [field values](/influxdb/v1.7/concepts/glossary/#field-value) and [timestamps](/influxdb/v1.7/concepts/glossary/#timestamp) are stored per-point.

Non-string values require approximately three bytes. String values require variable space as determined by string compression.

## How should I configure my hardware?

When running InfluxDB in a production environment the `wal` directory and the `data` directory should be on separate storage devices. This optimization significantly reduces disk contention when the system is under heavy write load. This is an important consideration if the write load is highly variable. If the write load does not vary by more than 15% the optimization is probably unneeded.
