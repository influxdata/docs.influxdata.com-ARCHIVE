---
title: Hardware sizing guidelines
menu:
  influxdb_1_7:
    weight: 40
    parent: Guides
---

Review configuration and hardware guidelines for InfluxDB OSS (open source) and InfluxDB Enterprise:

* [Single node or cluster?](/influxdb/v1.7/guides/hardware_sizing/#single-node-or-cluster?)
* [Queries guidelines](#queries-guidelines)
* [Single node guidelines](/influxdb/v1.7/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node)
* [Cluster guidelines](/influxdb/v1.7/guides/hardware_sizing/#general-hardware-guidelines-for-a-cluster)
* [When do I need more RAM?](/influxdb/v1.7/guides/hardware_sizing/#when-do-i-need-more-ram)
* [Storage: type, amount, and configuration](/influxdb/v1.7/guides/hardware_sizing/#storage:-type-,-amount-,-and-configuration)

## Single node or cluster?

If you need a single node instance of InfluxDB that's fully open source without redundancy, InfluxDB OSS works. (Without redundancy means if the server is unavailable, writes and queries immediately fail.)

If you need high-availability and redundancy, InfluxDB Enterprise offers multiple nodes (called a cluster). Multiple copies of data are distributed across multiple servers, so the loss of one server doesn't significantly impact the cluster.

If your performance requires at least one of the following:

- > 750,000 writes per second
- > 100 moderate queries
- > 10,000,000 unique series

We recommend a cluster to distribute the load among multiple servers. Performance at this scale on a single node may not be achievable. Please contact us at <sales@influxdb.com> for assistance tuning your systems.

### Queries guidelines

Queries complexity varies widely on system impact. Recommendations for both single nodes and clusters are based on **moderate** query loads. For **simple** or **complex** queries, we recommend testing and adjusting the suggested requirements as needed. Query complexity is defined by the following criteria:

|Query complexity| Criteria|
|----------------|----------|
|Simple          | Have few or no functions and no regular expressions|
|                | Are bounded in time to a few minutes, hours, or maybe a day|
|                | Typically execute in a few milliseconds to a few dozen milliseconds|
|Moderate queries| Have multiple functions and one or two regular expressions|
|                | May also have complex `GROUP BY` clauses or sample a time range of multiple weeks|
|                | Typically execute in a few hundred or a few thousand milliseconds|
|Complex queries | Have multiple aggregation or transformation functions or multiple regular expressions
|                | May sample a very large time range of months or years|
|                | Typically take multiple seconds to execute|

If your performance requirements fall into the **moderate** or **low** [load ranges](#load-ranges), you can likely use a single node instance of InfluxDB.

## Single node guidelines

Run InfluxDB on locally attached solid state drives (SSDs). Other storage configurations have lower performance and may not be able to recover from small interruptions in normal processing.

InfluxDB loads are estimated by writes per second, queries per second, and number of unique [series](/influxdb/v1.7/concepts/glossary/#series). General CPU, RAM, and IOPS recommendations are based on the load.

### Load ranges

| Load             | Field writes per second  | Moderate queries* per second | Unique series   |
|------------------|--------------------------|------------------------------|-----------------|
|  **Low**         |  < 5,000                 |  < 5                         |  < 100,000      |
|  **Moderate**    |  < 250,000               |  < 25                        |  < 1,000,000    |
|  **High**        |  > 250,000               |  > 25                        |  > 1,000,000    |

* Queries vary widely in their impact on the system. Recommendations are provided for moderate query loads. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

### Low load

* CPU: 2-4 cores
* RAM: 2-4 GB
* IOPS: 500

### Moderate load

* CPU: 4-6 cores
* RAM: 8-32 GB
* IOPS: 500-1000

### High load

* CPU: 8+ cores
* RAM: 32+ GB
* IOPS: 1000+

## Cluster guidelines

### Meta nodes

A cluster must have a minimum of three independent meta nodes to survive the loss of a server. A cluster with `2n + 1` meta nodes can tolerate the loss of `n` meta nodes. Set up clusters with an odd number of meta nodes──an even number may cause issues in certain configurations. Meta nodes do not need very much computing power. Regardless of the cluster load, we recommend the following for the meta nodes:

* vCPU or CPU: 1-2 cores
* RAM: 512 MB - 1 GB
* IOPS: 50

### Data nodes

A cluster with one data node is valid but has no data redundancy. Redundancy is set by the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor) on the retention policy the data is written to. Where `n` is the replication factor, a cluster can lose `n - 1` data nodes and return complete query results. For optimal data distribution within the cluster, use an even number of data nodes.

 Data nodes guidelines vary by estimated load on each node in the cluster.

| Load         | Writes per second per node  | Moderate queries* per second per node | Unique series per node |
|--------------|-----------------------------|---------------------------------------|------------------------|
|  **Low**     |  < 5,000                    |  < 5                                  |  < 100,000             |
|  **Moderate**|  < 100,000                  |  < 25                                 |  < 1,000,000           |
|  **High**    |  > 100,000                  |  > 25                                 |  > 1,000,000           |

* Queries vary widely in their impact on the system. Recommendations are provided for moderate query loads. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

#### Low load

* vCPU or CPU: 2 cores
* RAM: 4-8 GB
* IOPS: 1000

#### Moderate load

* vCPU or CPU: 4-6 cores
* RAM: 16-32 GB
* IOPS: 1000+

#### High load

* vCPU or CPU: 8+ cores
* RAM: 32+ GB
* IOPS: 1000+

### Enterprise web node

The Enterprise web server is primarily an HTTP server with similar load requirements. For most applications, the server doesn't need to be very robust. A cluster can function with only one web server, but for redundancy, we recommend connecting multiple web servers to a single back-end Postgres database.

> **Note:** Production clusters should not use the SQLite database (lacks support for redundant web servers and handling high loads).

* vCPU CPU: 2-4 cores
* RAM: 2-4 GB
* IOPS: 100

## When do I need more RAM?

In general, more RAM helps queries return faster. Your RAM requirements are primarily determined by [series cardinality](/influxdb/v1.7/concepts/glossary/#series-cardinality). Higher cardinality requires more RAM. Regardless of RAM, a series cardinality of 10 million or more can cause OOM failures. You can usually resolve OOM issues by redesigning your [schema](/influxdb/v1.7/concepts/glossary/#schema).

## Additional cluster sizing guidelines

The following InfluxDB Enterprise guidelines consider criteria, such as infrastructure (in this case, AWS EC2 R4 instances), replication factor, cardinality, and write loads, query loads, and write/query loads combined.

> These guidelines stem from a DevOps monitoring use case, maintaining a group of computers, monitoring server metrics, such as CPU, kernel, memory, disk space, disk I/O, network, and so on. Nine measurements have 10 tags, from 6-20 values, totaling 101 values written during each simulated data collection cycle of 10 seconds. Data is generated randomly to ensure real-life, varied data.

### Infrastructure

For the following AWS EC2 memory optimized instances:

- R4.xlarge (4 cores)
- R4.2xlarge (8 cores)
- R4.4xlarge (16 cores)
- R4.8xlarge (32 cores)

|Writes|	Query|	Node|	Combined writes and queries
|296922	|16	2N4C|	151547|	16|
560403	30	2N8C	290768	26
972759	54	2N16C	456255	50
1860063	84	2N32C	881730	74

### Guidelines by cardinality (number of series)

#### 10,000

|Nodes x Core | Writes per second | Queries per second | Queries and writes per second |
|2x4          | 296,922           | 16                 | 151547       |
|2x8          | 560,403           | 30                 | 290768
|2x16         | 972,759           | 54                 | 456255
|2x32         | 1,860,063         | 84                 | 881730
|4x8          | 1,781,458         | 100                | 682098
|4x16         | 3,430,677         | 192                | 1732683
|4x32         | 6,351,300         | 432                | 3283359
|6x8          | 2,923,294         | 216                | 1049786
|6x16         | 5,650,887         | 498                | 2246123
|6x32         | 9,842,464         | 1248               | 5229244
|8x8          | 3,987,819         | 632                | 1722621
|8x16         | 7,798,848         | 1384               | 3911525
|8x32         | 13,189,694        | 3648               | 7891207

#### 100,000

#### 1,000,000

#### 10,000,000

## Storage: type, amount, and configuration

### Storage volume and IOPS

Consider the type of storage you'll need and the amount. InfluxDB is designed to run on solid state drives (SSDs) and memory-optimized cloud instances, for example, AWS EC2 R5 or R4 instances. InfluxDB isn't tested on hard disk drives (HDDs) and we don't recommend HDDs for production. For best results, InfluxDB servers must have a minimum of 1000 IOPS on the storage to ensure recovery and availability. We recommend at least 2000 IOPS for rapid recovery of cluster data nodes after downtime.

See your cloud provider documentation for IOPS detail on your storage volumes.

### Bytes and compression

Database names, [measurements](/influxdb/v1.7/concepts/glossary/#measurement), [tag keys](/influxdb/v1.7/concepts/glossary/#tag-key), [field keys](/influxdb/v1.7/concepts/glossary/#field-key), and [tag values](/influxdb/v1.7/concepts/glossary/#tag-value) are stored only once and always as strings. Only [field values](/influxdb/v1.7/concepts/glossary/#field-value) and [timestamps](/influxdb/v1.7/concepts/glossary/#timestamp) are stored per-point.

Non-string values require approximately three bytes. String values require variable space as determined by string compression.

### Separate `wal` and `data` directories

When running InfluxDB in a production environment, store the `wal` directory and the `data` directory on separate storage devices. This optimization significantly reduces disk contention under heavy write load──an important consideration if the write load is highly variable. If the write load does not vary by more than 15%, the optimization is probably not necessary.
