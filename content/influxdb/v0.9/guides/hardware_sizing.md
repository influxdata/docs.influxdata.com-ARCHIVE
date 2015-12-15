---
title: Hardware Sizing Guidelines
menu:
  influxdb_09:
    weight: 12
    parent: guides
---

This guide offers general hardware recommendations for InfluxDB and addresses some frequently asked questions about hardware sizing. The recommendations are for the tsm1 storage engine. Where possible, we note the relevant numbers for the b1 and bz1 storage engines.

Single node:

* [General hardware guidelines for a single node](/influxdb/v0.9/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node)
* [When do I need more RAM?](/influxdb/v0.9/guides/hardware_sizing/#when-do-i-need-more-ram)
* [What kind of storage do I need?](/influxdb/v0.9/guides/hardware_sizing/#what-kind-of-storage-do-i-need)
* [How much storage do I need?](/influxdb/v0.9/guides/hardware_sizing/#how-much-storage-do-i-need)
* [How should I configure my hardware?](/influxdb/v0.9/guides/hardware_sizing/#how-should-i-configure-my-hardware)

Clustering:

* [General hardware guidelines for clusters](/influxdb/v0.9/guides/hardware_sizing/#general-hardware-guidelines-for-clusters)
* [How should I configure my hardware?](/influxdb/v0.9/guides/hardware_sizing/#how-should-i-configure-my-hardware-1)

## General hardware guidelines for a single node

We define the load that you'll be placing on InfluxDB by the number of writes per second, the number of queries per second, and the number of unique [series](/influxdb/v0.9/concepts/glossary/#series). Based on your load, we make general CPU, RAM, and IOPS recommendations.

| Load         | Writes per second  | Queries per second | Unique series |
|--------------|----------------|----------------|---------------|
|  **Low**         |  < 5 thousand         |  < 5           |  < 100 thousand         |
|  **Moderate**    |  < 100 thousand        |  < 25          |  < 1 million        |
|  **High**        |  > 100 thousand        |  > 25          |  > 1 million        |
| **Probably infeasible**  |  > 500 thousand        |  > 100         |  > 10 million       |


#### Low load recommendations
* CPU: 1-2   
* RAM: 1-2 GB   
* IOPS: 500   

#### Moderate load recommendations
* CPU: 4-6  
* RAM: 8-16GB  
* IOPS: 500-1000  

#### High load recommendations
* CPU: 8+  
* RAM: 16+ GB  
* IOPS: 500-1000  

#### Probably infeasible load
Performance at this scale is a significant challenge and may not be achievable. Please contact InfluxDB for assistance with tuning your systems. (link?)

> **Note:** For the b1 and bz1 storage engines, we recommend having > 15,000 IOPS. The CPU and RAM guidelines are the same.

## When do I need more RAM?
In general, having more RAM helps queries return faster. There is no known downside to adding more RAM.

The major component that affects your RAM needs is series cardinality. Series cardinality is the total number of [series](/influxdb/v0.9/concepts/glossary/#series) in a database. If you have one measurement with two tags, and each tag has 1,000 possible values then the series cardinality is 1 million. A series cardinality around or above 10 million can cause OOM failures. If this is the case, you can usually address the problem by redesigning your [schema](/influxdb/v0.9/concepts/glossary/#schema).

The increase in RAM needs relative to series cardinality is exponential where the exponent is between one and two:

![Series Cardinality](/img/series-cardinality.png)

## What kind of storage do I need?
InfluxDB is designed to run on SSDs.  Performance is drastically lower on spinning disk drives.

## How much storage do I need?
Database names, [measurements](/influxdb/v0.9/concepts/glossary/#measurement), [tag keys](/influxdb/v0.9/concepts/glossary/#tag-key), [field keys](/influxdb/v0.9/concepts/glossary/#field-key), and [tag values](/influxdb/v0.9/concepts/glossary/#tag-value) are stored once and as strings. Only [field values](/influxdb/v0.9/concepts/glossary/#field-value) and [timestamps](/influxdb/v0.9/concepts/glossary/#timestamp) are stored per-point.

Non-string values require about three bytes. String values require variable space as determined by string compression.

> **Note:** With the b1 storage engine, non-string values require about 50 bytes. With the bz1 storage engine, non-string values require about 20 bytes.

## How should I configure my hardware?
When running InfluxDB in a production environment the write-ahead-log directory the data directory should be housed on separate mounted volumes. This prevents disk contention when the system is under heavy write load.

Note that the WAL directory can be on a spinning disk and that IOPS are most important for the data directory.

## General hardware guidelines for clusters

Minimum hardware requirements:

* CPU: 2
* RAM: 4 GB
* IOPS: 1000+

When running a cluster every member should have at least two cores.

For better performance, we recommend having 8 GB RAM and 4 CPUs or more.

## How should I configure my hardware?
Place the hinted-handoff directory on a separate SSD volume from the write-ahead-log directory and the data directory. For more information on setting up a cluster, see [Clustering setup](/influxdb/v0.9/guides/clustering/).
