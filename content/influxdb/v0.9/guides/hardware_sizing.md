---
title: Hardware Sizing Guidelines
aliases:
  - /docs/v0.9/guides/hardware_sizing.html
---

This guide offers general hardware recommendations for InfluxDB and addresses some frequently asked questions about hardware sizing.

Single node:

* [General hardware guidelines for a single node](../guides/hardware_sizing.html#general-hardware-guidelines-for-a-single-node)
* [When do I need more RAM?](../guides/hardware_sizing.html#when-do-i-need-more-ram)
* [What kind of storage do I need?](../guides/hardware_sizing.html#what-kind-of-storage-do-i-need)
* [How much storage do I need?](../guides/hardware_sizing.html#how-much-storage-do-i-need)
* [How should I configure my hardware?](../guides/hardware_sizing.html#how-should-i-configure-my-hardware)

Clustering:

* [General hardware guidelines for clusters](../guides/hardware_sizing.html#general-hardware-guidelines-for-clusters)
* [How should I configure my hardware?](../guides/hardware_sizing.html#how-should-i-configure-my-hardware-1)

The following recommendations are for the tsm1 storage engine. Where possible, we note the relevant numbers for the b1 and bz1 storage engines.

## General hardware guidelines for a single node

We define the load that you'll be placing on InfluxDB by the number of writes per second, the number of queries per second, and the number of unique [series](../concepts/glossary.html#series). Based on your load, we make general CPU, RAM, and IOPS recommendations.

| Load         | Writes per second  | Queries per second | Unique series |
|--------------|----------------|----------------|---------------|
|  **Low**         |  < 5K         |  < 5           |  < 100K         |
|  **Moderate**    |  < 100K        |  < 25          |  < 1MM        |
|  **High**        |  > 100K        |  > 25          |  > 1MM        |
| **Probably infeasible**  |  > 500K        |  > 100         |  > 10MM       |


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

The major component that affects your RAM needs is series cardinality. Series cardinality is the total number of [series](../concepts/glossary.html#series) in a database. If you have one measurement with two tags, and each tag has 1,000 possible values then the series cardinality is 1M. A series cardinality around or above 10MM can cause OOM failures. If this is the case, you can usually address the problem by redesigning your [schema](../concepts/glossary.html#schema).

The increase in RAM needs relative to series cardinality is exponential where the exponent is between one and two:

![Series Cardinality](/img/series-cardinality.png)

## What kind of storage do I need?
InfluxDB is designed to run on SSDs.  Performance is drastically lower on spinning disk drives.

## How much storage do I need?
Database names, [measurements](../concepts/glossary.html#measurement), [tag keys](../concepts/glossary.html#tag-key), [field keys](../concepts/glossary.html#field-key), and [tag values](../concepts/glossary.html#tag-value) are stored once and as strings. Only [field values](../concepts/glossary.html#field-value) and [timestamps](../concepts/glossary.html#timestamp) are stored per-point.

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
Place the hinted-handoff directory on a separate SSD volume from the write-ahead-log directory and the data directory. For more information on setting up a cluster, see [Clustering setup](../guides/clustering.html).



