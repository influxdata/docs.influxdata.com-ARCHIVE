---
title: Hardware Sizing Guidelines
menu:
  influxdb_1:
    weight: 12
    parent: guides
---

This guide offers general hardware recommendations for InfluxDB and addresses some frequently asked questions about hardware sizing. The recommendations are only for the [Time Structured Merge](/influxdb/v1.0/concepts/storage_engine/#the-new-influxdb-storage-engine-from-lsm-tree-to-b-tree-and-back-again-to-create-the-time-structured-merge-tree) tree (`TSM`) storage engine, the only storage engine available with InfluxDB 1.0. Users running older versions of InfluxDB with [unconverted](/influxdb/v0.10/administration/upgrading/#convert-b1-and-bz1-shards-to-tsm1) `b1` or `bz1` shards may have different performance characteristics. See the [InfluxDB 0.9 sizing guide](/influxdb/v0.9/guides/hardware_sizing/) for more detail.

* [General hardware guidelines for a single node](/influxdb/v1.0/guides/hardware_sizing/#general-hardware-guidelines-for-a-single-node)
* [When do I need more RAM?](/influxdb/v1.0/guides/hardware_sizing/#when-do-i-need-more-ram)
* [What kind of storage do I need?](/influxdb/v1.0/guides/hardware_sizing/#what-kind-of-storage-do-i-need)
* [How much storage do I need?](/influxdb/v1.0/guides/hardware_sizing/#how-much-storage-do-i-need)
* [How should I configure my hardware?](/influxdb/v1.0/guides/hardware_sizing/#how-should-i-configure-my-hardware)

## General hardware guidelines for a single node

We define the load that you'll be placing on InfluxDB by the number of writes per second, the number of queries per second, and the number of unique [series](/influxdb/v1.0/concepts/glossary/#series). Based on your load, we make general CPU, RAM, and IOPS recommendations.

| Load         | Writes per second  | Queries per second | Unique series |
|--------------|----------------|----------------|---------------|
|  **Low**         |  < 5 thousand         |  < 5           |  < 100 thousand         |
|  **Moderate**    |  < 100 thousand        |  < 25          |  < 1 million        |
|  **High**        |  > 100 thousand        |  > 25          |  > 1 million        |
| **Probably infeasible**  |  > 500 thousand        |  > 100         |  > 10 million       |


#### Low load recommendations
* CPU: 2-4   
* RAM: 2-4 GB   
* IOPS: 500   

#### Moderate load recommendations
* CPU: 4-6  
* RAM: 8-32GB  
* IOPS: 500-1000  

#### High load recommendations
* CPU: 8+  
* RAM: 32+ GB  
* IOPS: 1000+  

#### Probably infeasible load
Performance at this scale is a significant challenge and may not be achievable. Please contact us at <sales@influxdb.com> for assistance with tuning your systems.

## When do I need more RAM?
In general, having more RAM helps queries return faster. There is no known downside to adding more RAM.

The major component that affects your RAM needs is series cardinality. Series cardinality is the total number of [series](/influxdb/v1.0/concepts/glossary/#series) in a database. If you have one measurement with two tags, and each tag has 1,000 possible values then the series cardinality is 1 million. A series cardinality around or above 10 million can cause OOM failures even with large amounts of RAM. If this is the case, you can usually address the problem by redesigning your [schema](/influxdb/v1.0/concepts/glossary/#schema).

The increase in RAM needs relative to series cardinality is exponential where the exponent is between one and two:

![Series Cardinality](/img/influxdb/series-cardinality.png)

## What kind of storage do I need?
InfluxDB is designed to run on SSDs.  Performance is lower on spinning disk drives and may not function properly under increasing loads.

## How much storage do I need?
Database names, [measurements](/influxdb/v1.0/concepts/glossary/#measurement), [tag keys](/influxdb/v1.0/concepts/glossary/#tag-key), [field keys](/influxdb/v1.0/concepts/glossary/#field-key), and [tag values](/influxdb/v1.0/concepts/glossary/#tag-value) are stored only once and always as strings. Only [field values](/influxdb/v1.0/concepts/glossary/#field-value) and [timestamps](/influxdb/v1.0/concepts/glossary/#timestamp) are stored per-point.

Non-string values require approximately three bytes. String values require variable space as determined by string compression.

## How should I configure my hardware?
When running InfluxDB in a production environment the `wal` directory and the `data` directory should be on separate storage devices. This optimization significantly reduces disk contention when the system is under heavy write load. This is an important consideration if the write load is highly variable. If the write load does not vary by more than 15% the optimization is probably unneeded.
