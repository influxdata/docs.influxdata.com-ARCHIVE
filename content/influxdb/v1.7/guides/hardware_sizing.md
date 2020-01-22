---
title: Hardware sizing guidelines
menu:
  influxdb_1_7:
    weight: 40
    parent: Guides
---

Review configuration and hardware guidelines for InfluxDB OSS (open source) and InfluxDB Enterprise:

* [Single node or cluster?](#single-node-or-cluster)
* [Query guidelines](#query-guidelines)
* [Single node guidelines](#single-node-guidelines)
* [Cluster guidelines](#cluster-guidelines)
* [When do I need more RAM?](#when-do-i-need-more-ram)
* [Recommended cluster configurations](#recommended-cluster-configurations)
* [Storage: type, amount, and configuration](#storage-type-amount-and-configuration)

## Single node or cluster?

If your InfluxDB performance requires at least one of the following:

- more than 750,000 writes per second
- more than 100 moderate* queries ([see Query guides](#query-guidelines))
- more than 10,000,000 [series cardinality](/influxdb/v1.7/concepts/glossary/#series-cardinality)

A single node may not support performance at this scale. We recommend InfluxDB Enterprise, which supports multiple data nodes (a cluster) across multiple server cores. InfluxDB Enterprise distributes multiple copies of your data across a cluster, providing high-availability and redundancy, so an unavailable node doesn't significantly impact the cluster. Please contact us at <sales@influxdb.com> for assistance tuning your system.

If you want a single node instance of InfluxDB that's fully open source, requires fewer writes, queries, and unique series than listed above, and do **not require** redundancy, we recommend InfluxDB OSS (open source).

> **Note:** Without the redundancy of a cluster, writes and queries fail immediately when a server is unavailable.

## Query guidelines

> Query complexity varies widely on system impact. Recommendations for both single nodes and clusters are based on **moderate** query loads.

For **simple** or **complex** queries, we recommend testing and adjusting the suggested requirements as needed. Query complexity is defined by the following criteria:

| Query complexity | Criteria                                                                              |
|------------------|---------------------------------------------------------------------------------------|
| Simple           | Have few or no functions and no regular expressions                                   |
|                  | Are bounded in time to a few minutes, hours, or maybe a day                           |
|                  | Typically execute in a few milliseconds to a few dozen milliseconds                   |
| Moderate         | Have multiple functions and one or two regular expressions                            |
|                  | May also have complex `GROUP BY` clauses or sample a time range of multiple weeks     |
|                  | Typically execute in a few hundred or a few thousand milliseconds                     |
| Complex          | Have multiple aggregation or transformation functions or multiple regular expressions |
|                  | May sample a very large time range of months or years                                 |
|                  | Typically take multiple seconds to execute                                            |

## Single node guidelines

Run InfluxDB on locally attached solid state drives (SSDs). Other storage configurations have lower performance and may not be able to recover from small interruptions in normal processing.

Estimated guidelines include writes per second, queries per second, and number of unique [series](/influxdb/v1.7/concepts/glossary/#series), CPU, RAM, and IOPS.

| vCPU or CPU |   RAM   |   IOPS   | Writes per second | Queries* per second | Unique series |
| ----------: | ------: | -------: | ----------------: | ------------------: | ------------: |
|   2-4 cores |  2-4 GB |      500 |           < 5,000 |                 < 5 |     < 100,000 |
|   4-6 cores | 8-32 GB | 500-1000 |         < 250,000 |                < 25 |   < 1,000,000 |
|    8+ cores |  32+ GB |    1000+ |         > 250,000 |                > 25 |   > 1,000,000 |

* **Queries per second for moderate queries.** Queries vary widely in their impact on the system. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

## Cluster guidelines

### Meta nodes

> Set up clusters with an odd number of meta nodes──an even number may cause issues in certain configurations.

A cluster must have a **minimum of three** independent meta nodes for data redundancy and availability. A cluster with `2n + 1` meta nodes can tolerate the loss of `n` meta nodes.

Meta nodes do not need very much computing power. Regardless of the cluster load, we recommend the following guidelines for the meta nodes:

* vCPU or CPU: 1-2 cores
* RAM: 512 MB - 1 GB
* IOPS: 50

### Enterprise web node

The Enterprise web server is primarily an HTTP server with similar load requirements. For most applications, the server doesn't need to be very robust. A cluster can function with only one web server, but for redundancy, we recommend connecting multiple web servers to a single back-end Postgres database.

> **Note:** Production clusters should not use the SQLite database (lacks support for redundant web servers and handling high loads).

* vCPU or CPU: 2-4 cores
* RAM: 2-4 GB
* IOPS: 100

### Data nodes

A cluster with one data node is valid but has no data redundancy. Redundancy is set by the [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor) on the retention policy the data is written to. Where `n` is the replication factor, a cluster can lose `n - 1` data nodes and return complete query results. 

>**Note:** For optimal data distribution within the cluster, use an even number of data nodes.

Guidelines vary by writes per second per node, moderate* queries per second per node, and unique series per node.

 #### Guidelines per node

| vCPU or CPU |   RAM    | IOPS  | Writes per second | Queries* per second | Unique series |
| ----------: | -------: | ----: | ----------------: | ------------------: | ------------: |
|     2 cores |   4-8 GB |  1000 |           < 5,000 |                 < 5 |     < 100,000 |
|   4-6 cores | 16-32 GB | 1000+ |         < 100,000 |                < 25 |   < 1,000,000 |
|    8+ cores |   32+ GB | 1000+ |         > 100,000 |                > 25 |   > 1,000,000 |

* Guidelines are provided for moderate queries. Queries vary widely in their impact on the system. For simple or complex queries, we recommend testing and adjusting the suggested requirements as needed. See [query guidelines](#query-guidelines) for detail.

## When do I need more RAM?

In general, more RAM helps queries return faster. Your RAM requirements are primarily determined by [series cardinality](/influxdb/v1.7/concepts/glossary/#series-cardinality). Higher cardinality requires more RAM. Regardless of RAM, a series cardinality of 10 million or more can cause OOM failures. You can usually resolve OOM issues by redesigning your [schema](/influxdb/v1.7/concepts/glossary/#schema).

## Guidelines per cluster

InfluxDB Enterprise guidelines vary by writes and queries per second (both isolated and combined), series cardinality, replication factor, and infrastructure-AWS EC2 R4 instances or equivalent:
- R4.xlarge (4 cores)
- R4.2xlarge (8 cores)
- R4.4xlarge (16 cores)
- R4.8xlarge (32 cores)

> Guidelines stem from a DevOps monitoring use case: maintaining a group of computers and monitoring server metrics (such as CPU, kernel, memory, disk space, disk I/O, network, and so on).

### Recommended cluster configurations

Cluster configurations guidelines are organized by:

- Series cardinality in your data set: 10,000, 100,000, 1,000,000, or 10,000,000
- Number of data nodes
- Number of server cores

For each cluster configuration, you'll find guidelines for the following:

- **maximum writes per second only** (no dashboard queries are running)
- **maximum queries per second only** (no data is being written)
- **maximum simultaneous queries and writes per second, combined**

#### Review cluster configuration tables

1. Select the series cardinality tab below, and then click to expand a replication factor.
2. In the **Nodes x Core** column, find the number of data nodes and server cores in your configuration, and then review the recommended **maximum** guidelines.

{{< tab-labels >}}
{{% tabs %}}
[10,000 series](#)
[100,000 series](#)
[1,000,000 series](#)
[10,000,000 series](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 10,000 series:
{{%expand "> Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + Writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           296,922 |                 16 |      16 + 151,547           |
|     2 x 8    |           560,403 |                 30 |      26 + 290,768           |
|     2 x 16   |           972,759 |                 54 |      50 + 456,255           |
|     2 x 32   |         1,860,063 |                 84 |      74 + 881,730           |
|     4 x 8    |         1,781,458 |                100 |      64 + 682,098           |
|     4 x 16   |         3,430,677 |                192 |     104 + 1,732,683         |
|     4 x 32   |         6,351,300 |                432 |     188 + 3,283,359         |
|     6 x 8    |         2,923,294 |                216 |     138 + 1,049,786         |
|     6 x 16   |         5,650,887 |                498 |     246 + 2,246,123         |
|     6 x 32   |         9,842,464 |               1248 |     528 + 5,229,244         |
|     8 x 8    |         3,987,819 |                632 |     336 + 1,722,621         |
|     8 x 16   |         7,798,848 |               1384 |     544 + 3,911,525         |
|     8 x 32   |        13,189,694 |               3648 |   1,152 + 7,891,207         |

{{% /expand%}}

{{%expand "> Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |          815,309  |                  63 |       54 + 335,764         |
|     3 x 16   |        1,688,952  |                 120 |       87 + 705,324         |
|     3 x 32   |        3,164,758  |                 255 |      132 + 1,626,721       |
|     6 x 8    |        2,269,541  |                 252 |      168 + 838,749         |
|     6 x 16   |        4,593,947  |                 624 |      336 + 2,019,668       |
|     6 x 32   |        7,776,913  |                1340 |      576 + 3,624,521       |

{{% /expand%}}

{{%expand "> Replication factor, 4" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     4 x 8    |         1,028,170 |                116 |      98 + 365,649           |
|     4 x 16   |         2,067,895 |                208 |     140 + 8,056,164         |
|     4 x 32   |         3,290,281 |                428 |     228 + 1,892,755         |
|     8 x 8    |         2,813,425 |                928 |     496 + 1,225,033         |
|     8 x 16   |         5,225,548 |               2176 |     800 + 2,799,548         |
|     8 x 32   |         8,555,405 |               5184 |    1088 + 6,055,367         |

{{% /expand%}}

{{%expand "> Replication factor, 6" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     6 x 8    |         1,261,017 |                288 |     192 + 522,202           |
|     6 x 16   |         2,370,669 |                576 |     288 + 1,275,668         |
|     6 x 32   |         3,601,554 |               1056 |     336 + 2,390,880         |

{{% /expand%}}

{{%expand "> Replication factor, 8" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| ----------------: | -----------------: |:---------------------------:|
|     8 x 8    |         1,382,653 |               1184 |     416 + 915,295           |
|     8 x 16   |         2,658,546 |               2504 |     448 + 2,204,466         |
|     8 x 32   |         3,887,155 |               5184 |     602 + 4,120,379         |

{{% /expand%}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 100,000 series:

{{%expand "> Replication factor, 1" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     1 x 4    |           143,702 |                 5 |        4 + 77,813            |
|     1 x 8    |           322,201 |                 9 |        8 + 167,637           |
|     1 x 16   |           624,857 |                17 |       12 + 337,656           |
|     1 x 32   |         1,114,863 |                26 |       18 + 657,277           | 
|     2 x 4    |           265,238 |                14 |       12 + 115,911           |
|     2 x 8    |           573,734 |                30 |       22 + 269,489           |
|     2 x 16   |         1,261,033 |                52 |       38 + 679,540           |
|     2 x 32   |         2,335,352 |                90 |       66 + 1,510,895         |

{{% /expand%}}

{{%expand "> Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           196,454 |                 16 |      14 + 77,006            |
|     2 x 8    |           482,774 |                 30 |      24 + 203,599           |
|     2 x 16   |         1,060,909 |                 60 |      42 + 415,314           |
|     2 x 32   |         1,958,268 |                 94 |      64 + 984,983           |
|     4 x 8    |         1,144,717 |                108 |      68 + 406,542           |
|     4 x 16   |         2,512,352 |                228 |     148 + 866,786           |
|     4 x 32   |         4,346,070 |                564 |     320 + 1,886,596         |
|     6 x 8    |         1,802,258 |                252 |     156 + 618,193           |
|     6 x 16   |         3,924,065 |                562 |     384 + 1,068,244         |
|     6 x 32   |         6,533,499 |               1340 |     912 + 2,083,936         |
|     8 x 8    |         2,516,332 |                712 |     360 + 1,020,254         |
|     8 x 16   |         5,478,839 |               1632 |   1,024 + 1,843,951         |
|     8 x 32   |        1,0527,091 |               3392 |   1,792 + 4,998,321         |

{{% /expand%}}

{{%expand "> Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           616,519 |                 72 |      51 + 218140            |
|     3 x 16   |         1,268,834 |                117 |      84 + 438559            |
|     3 x 32   |         2,260,622 |                189 |     114 + 984229            |
|     6 x 8    |         1,393,119 |                294 |     192 + 421103            |
|     6 x 16   |         3,056,539 |                726 |     456 + 893575            |
|     6 x 32   |         5,017,489 |               1584 |     798 + 1098231           |

{{% /expand%}}

{{%expand "> Replication factor, 4" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     4 x 8    |           635,865 |                112 |      80 + 207,642           |
|     4 x 16   |         1,359,532 |                188 |     124 + 461,782           |
|     4 x 32   |         2,320,623 |                416 |     192 + 1,102,067         |
|     8 x 8    |         1,570,072 |               1360 |     816 + 572,576           |
|     8 x 16   |         3,205,883 |               2720 |     832 + 2,053,965         |
|     8 x 32   |         3,294,152 |               2592 |     804 + 2,174,578         |

{{% /expand%}}

{{%expand "> Replication factor, 6" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     6 x 8    |           694,904 |                302 |     198 + 204,487           |
|     6 x 16   |         1,397,898 |                552 |     360 + 450,489           |
|     6 x 32   |         2,298,177 |               1248 |     384 + 1,261,676         |

{{% /expand%}}

{{%expand "> Replication factor, 8" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| ----------------: | -----------------: |:---------------------------:|
|     8 x 8    |           739,140 |               1296 |     480 + 371,331           |
|     8 x 16   |         1,396,492 |               2592 |     672 + 843,223           |
|     8 x 32   |         2,614,848 |               2496 |     960 + 1,371,593         |

{{% /expand%}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 1,000,000 series:

{{%expand "> Replication factor, 2" %}}

| Nodes x Core  | Writes per second | Queries per second | Queries + writes per second |
|:-------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4     |           104,805 |                 18 |      12 + 54,797            |
|     2 x 8     |           195,341 |                 36 |      24 + 99,180            |
|     2 x 16    |           498,786 |                 70 |      44 + 145,538           |
|     2 x 32    |         1,195,548 |                102 |      84 + 232,423           |
|     4 x 8     |           488,460 |                120 |      56 + 222,041           |
|     4 x 16    |         1,023,072 |                244 |     112 + 428,140           |
|     4 x 32    |         2,686,660 |                468 |     208 + 729,019           |
|     6 x 8     |           845,439 |                270 |     126 + 356,401           |
|     6 x 16    |         1,780,407 |                606 |     288 + 663,920           |
|     6 x 32    |          430,5148 |              1,488 |     624 + 1,209,530         |
|     8 x 8     |         1,831,287 |                808 |     296 + 778,020           |
|     8 x 16    |         4,167,813 |              1,856 |     640 + 2,031,420         |
|     8 x 32    |         7,813,034 |              3,201 |     896 + 4,897,955         |

{{% /expand%}}

{{%expand "> Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           234,426 |                 72 |      42 + 87,774            |
|     3 x 16   |           613,164 |                120 |      75 + 166,895           |
|     3 x 32   |         1,365,334 |                141 |     114 + 984,229           |
|     6 x 8    |           593,633 |                318 |     144 + 288,052           |
|     6 x 16   |         1,545,710 |                744 |     384 + 407,015           |
|     6 x 32   |         3,204,075 |               1632 |     912 + 505,843           |

{{% /expand%}}

{{%expand "> Replication factor, 4" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     4 x 8    |           258,809 |                116 |      68 + 73,493            |
|     4 x 16   |           675,731 |                196 |     132 + 140,070           |
|     4 x 32   |         1,513,044 |                244 |     176 + 476,899           |
|     8 x 8    |           614,866 |               1096 |     400 + 258,640           |
|     8 x 16   |         1,557,602 |               2496 |    1152 + 436,918           |
|     8 x 32   |         3,265,858 |               4288 |    2240 + 820,347           |

{{% /expand%}}

{{%expand "> Replication factor, 6" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     6 x 8    |           694,904 |                302 |     198 + 204,487           |
|     6 x 16   |         1,397,898 |                552 |     360 + 450,489           |
|     6 x 32   |         2,298,177 |               1248 |     384 + 1,261,676         |

{{% /expand%}}

{{%expand "> Replication factor, 8" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| ----------------: | -----------------: |:---------------------------:|
|     8 x 8    |           739,140 |               1296 |     480 + 371,331           |
|     8 x 16   |         1,396,492 |               2592 |     672 + 843,223           |
|     8 x 32   |         2,614,848 |               2496 |     960 + 1,371,593         |

{{% /expand%}}

{{% /tab-content %}}

{{% tab-content %}}

Select one of the following replication factors to see the recommended cluster configuration for 10,000,000 series:

{{%expand "> Replication factor, 1" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     2 x 4    |           122,864 |                 16 |      12 + 81,266            |
|     2 x 8    |           259,319 |                 36 |      24 + 143,151           |
|     2 x 16   |           501,640 |                 66 |      44 + 290,394           |
|     2 x 32   |           646,226 |                142 |      54 + 400,368           |

{{% /expand%}}

{{%expand "> Replication factor, 2" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + Writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|    2 x 4     |            87,602 |                 18 |        14 +  56,551         |
|    2 x 8     |           169,039 |                 38 |        24 +  98,770         |
|    2 x 16    |           334,739 |                 76 |        46 +  224,522        |
|    2 x 32    |           534,453 |                136 |        58 +  388,904        |
|    4 x 8     |           335,241 |                120 |        60 +  204,849        |
|    4 x 16    |           643,198 |                256 |       112 +  395,343        |
|    4 x 32    |           967,191 |                560 |       158 +  806,351        |
|    6 x 8     |           521,205 |                378 |       144 +  319,264        |
|    6 x 16    |           890,659 |                582 |       186 +  513,838        |
|    6 x 32    |         1,364,496 |                990 |           -                 |
|    8 x 8     |           699,042 |              1,032 |       256 +  477,887        |
|    8 x 16    |         1,345,521 |              2,048 |       544 +  741,416        |
|    8 x 32    |         1,768,748 |              4,608 |           -                 |

{{% /expand%}}

{{%expand "> Replication factor, 3" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:|------------------:|-------------------:|:---------------------------:|
|     3 x 8    |           170,897 |                 60 |      42 + 98,538            |
|     3 x 16   |           333,665 |                129 |      76 + 206,306           |
|     3 x 32   |           609,223 |                178 |     60? + 162,897?          |
|     6 x 8    |           395,645 |                402 |     132 + 247,952           |
|     6 x 16   |           679,169 |                894 |     150 + 527,783           |
|     6 x 32   |           937,314 |               1248 |         -                   |

{{% /expand%}}

{{%expand "> Replication factor, 4" %}}

| Nodes x Core | Writes per second | Queries per second | Queries + writes per second |
|:------------:| -----------------:| ------------------:|:---------------------------:|
|     4 x 8    |            183365 |                132 |      52 + 100359            |
|     4 x 16   |                 - |                  - |         -                   |
|     4 x 32   |                 - |                  - |         -                   |

{{% /expand%}}

{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /tab-labels >}}

## Storage: type, amount, and configuration

### Storage volume and IOPS

Consider the type of storage you need and the amount. InfluxDB is designed to run on solid state drives (SSDs) and memory-optimized cloud instances, for example, AWS EC2 R5 or R4 instances. InfluxDB isn't tested on hard disk drives (HDDs) and we don't recommend HDDs for production. For best results, InfluxDB servers must have a minimum of 1000 IOPS on storage to ensure recovery and availability. We recommend at least 2000 IOPS for rapid recovery of cluster data nodes after downtime.

See your cloud provider documentation for IOPS detail on your storage volumes.

### Bytes and compression

Database names, [measurements](/influxdb/v1.7/concepts/glossary/#measurement), [tag keys](/influxdb/v1.7/concepts/glossary/#tag-key), [field keys](/influxdb/v1.7/concepts/glossary/#field-key), and [tag values](/influxdb/v1.7/concepts/glossary/#tag-value) are stored only once and always as strings. [Field values](/influxdb/v1.7/concepts/glossary/#field-value) and [timestamps](/influxdb/v1.7/concepts/glossary/#timestamp) are stored for every point.

Non-string values require approximately three bytes. String values require variable space, determined by string compression.

### Separate `wal` and `data` directories

When running InfluxDB in a production environment, store the `wal` directory and the `data` directory on separate storage devices. This optimization significantly reduces disk contention under heavy write load──an important consideration if the write load is highly variable. If the write load does not vary by more than 15%, the optimization is probably not necessary.