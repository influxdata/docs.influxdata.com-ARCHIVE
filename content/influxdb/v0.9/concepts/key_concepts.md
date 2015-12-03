---
title: Key Concepts
---

To understand InfluxDB, it is necessary to understand some key concepts. These concepts are outlined below.

## Time-Series Data

InfluxDB uses particular terms to describe the various components of time-series data, and the techniques used to categorize that data.

Every data point within InfluxDB has a **timestamp**. When a point is written to InfluxDB it is either accompanied by a timestamp or, if it has no associated timestamp, InfluxDB uses its local clock to assign a timestamp to the point. It is important to note that InfluxDB does not differentiate between points that came with a timestamp versus points that were assigned a timestamp at reception time. 

A **series** is defined as a combination of a _measurement_ and set of _tag_ key-values. Combined with _fields_ (columns) and the fields' _values_, these make up series _data_.

A **measurement** is the value being recorded in the series. For example `cpu_load` or `sensor_temperature`.

InfluxDB also allows you to associate **tags** with measurements. Tags are arbitrary key-value pairs associated with a single time-series data point. Series data are indexed by tags, allowing efficient and fast look-up of series data that match a given set of tags. Finally a **field** is the part of a time-series data point that is not indexed by the system.

## Storing Data

A **database** is quite similar to that of a traditional relational database, and is an organized collection of time-series data and retention policies. User privileges are also set on a per-database level.

A **retention policy** is a logical namespace which maps to one or more shards, and has a _replication factor_. The replication factor must be at least 1. An integral part of a retention policy is the _retention period_ – the time after which data is automatically deleted within the InfluxDB system. Every database must also have at least one retention policy.

It is important to understand that **retention policy enforcement depends on the timestamp associated with the point** -- the time the data was received has no bearing on retention policy enforcement. For example if an InfluxDB system has a retention policy with a period of 1 day, and data with timestamps more than 1 day in the past is written to that retention policy, that data will be scheduled for immediate deletion.

