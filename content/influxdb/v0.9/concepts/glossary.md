---
title: Glossary of Terms
---

## Series
A **series** is a collection of data points along a timeline that share a common key, expressed as a **measurement** and **tag set** pairing, grouped under a **retention policy**.

```
<measurement>,<tag set>
```

> **Note:** The [field set](/docs/v0.9/concepts/glossary.html#field) is not part of the series identification.

## Measurement
A **measurement** is the name of the value that is recorded in the **series**, and can be shared amongst many **series**.

The **measurement** should describe the metric(s) recorded in the associated **series** and should not explicitly include information about the source of or the metadata associated with what is being measured. Metadata should be recorded in **tags**.

All **series** under a given **measurement** have the same **field keys** and differ only in their **tag set**.

The **measurement** is what appears in the SELECT clause of query statements, and is thus similar to a table name in traditional SQL databases.

#### Example:

The metrics `cpu_load`, `energy_generated`, and `bikes_present` would be reasonable **measurements** for a server, a photovoltaic array, and a bike-sharing station, respectively.

The `cpu_load` measurement would likely have tags for hostname, server region, server function, and OS. The `energy_generated` measurement might have tags for pv_installation_id, outside_temperature, and weather. The `bikes_present` measurement might only have a tag for station_id.

## Point
A **point** is a single collection of **fields** in a **series**. Each **point** is uniquely identified by its **series** and **timestamp**.

It is not possible to store two **points** in the same **series** with the same timestamp. The most recently written version of the **point** will silently overwrite the previous **field set** with its **field set**.

## Tag
A **tag** is a key-value pair that provides metadata about the **point**. A **tag** is made up of the **tag key** and the **tag value**.

**Tags** are indexed, meaning queries on **tag keys** or **tag values** are highly performant.

**Tags** are not required.

#### Example
The following are all valid **tags**: `hostname=server01`, `station_id=84`, and `weather='partial sun'`.

## Tag Key
The **tag key** is the key part of the key-value pair that makes up a **tag** and is always stored as a string.

**Tag keys** are unique per **measurement**.

## Tag Value
A **tag value** is the value part of the key-value pair that makes up a **tag** and is always stored as a string.

**Tag values** must be unique per **tag key**.

InfluxDB will not allow assignment of `weather='partly sunny'` and `weather='partly cloudy'` to the same **point**.

If you write multiple **tag values** for the same **tag key** on a given **point**, one of the **tag values** will be assigned to the **tag key** and all other **tag values** will be silently dropped.

## Tag Set
The **tag set** is the combination of all **tags** on the **point**, including all **tag keys** and their corresponding **tag values**.

The **tag set** and **measurement** fully describe a **series**.

The **tag set**, **measurement**, and **timestamp** fully describe a **point**.

The total number of **series** under a given **measurement** is thus identical to the number of distinct **tag sets** applied to **points** within that **measurement**.

## Field
A **field** is a key-value pair that records an actual metric for a given **point**.

A **field** is made up of the **field key** and the **field value**.

**Fields** are not indexed, meaning queries on **field keys** or **field values** must scan all points matching the time range of the query. Queries on **fields** are thus not performant, but are assumed to be infrequent for typical use cases.

If you find yourself querying **fields** consider whether the key-value pair is better stored as a **tag**.

Regular expressions are not supported when querying against **fields** or **field values**.

Every point must have at least one **Field** or it will be rejected as invalid.

#### Example

The pairs `load=0.64`, `event="panels cleaned"`, and `bikes_present=15i` are all valid **Fields**.

## Field Key
The **field key** is the key part of the key-value pair that makes up a **field** and is always stored as a string.

**Field keys** are unique per **point**.

## Field Value
A **field value** is the value part of the key-value pair that makes up a **field**.

**Field value** data may be stored as a string, boolean, int64, or float64.

If the **field value** is number it may contain one decimal point.

Scientific notation is a valid numerical representation.

**Field values** must be unique per **field key**, meaning you cannot assign `load=0.64` and `load=1.5` to the same **point**.

There is no error if you write multiple **field values** for the same **field key** on a given **point**. One of the **field values** will be assigned to the **field key** and all other **field values** will be silently dropped.

## Field Set
The **field set** is the combination of all **fields** on the **point**, including all **field keys** and their corresponding **field values**.

## Database
A **database** is a logical container for **users**, **retention policies**, and **continuous queries** which must be unique per **database**.

**Databases** are unique per **cluster**.

Typical use cases for multiple **databases** are to separate development and production metrics or for multi-tenant systems where distinct authentication to the **database** is desirable.

## Retention Policy
A **retention policy** is a collection of **measurements**, which must be unique within the **retention policy**.

**Retention policies** are unique per **database**.

**Retention policies** are frequently abbreviated as **RPs**.

A **retention policy** has a **duration** and a **replication factor**.

All **databases** must have a default **retention policy**, although any **retention policy** may be declared the default.

When a **database** is created a **Retention Policy** named “default” is automatically created with an infinite **duration** and a **replication factor** of 1.

## Duration
The **duration** determines how long data within the **retention policy** must be kept.

Data older than the **duration** may be automatically dropped by the **database** at any time.

**Durations** may be given in terms of minutes, hours, days, or weeks, with INF meaning retain all data forever.

**Durations** may not be shorter than one hour.

## Replication Factor
The **replication factor** determines how many independent copies of each **point** are stored within the **cluster**.

**Points** will be duplicated across N **data nodes**, where N is the **replication factor**.

Data availability is maintained when the number of unavailable **data nodes** in the **cluster** is less than the **replication factor**.

Once the number of unavailable **data nodes** equals or exceeds the **replication factor** some data may be unavailable for queries.

Replication is used to ensure data availability in the event a **data node** or nodes are unavailable. There are no query performance benefits from replication.

The **replication factor** should be less than or equal to the number of **data nodes** in the **cluster**.

## Continuous Query
A **continuous query** is a special type of query that is run internally by the database.

**Continuous queries** automatically aggregate or downsample data from one **series** into another **series**.

**Continuous queries** are unique per **database**.

**Continuous queries** are frequently abbreviated as **CQs**.

**Continuous queries** must contain at least one **aggregation** in the SELECT clause.

It is not currently possible to copy unaggregated **points** from one **series** to another.

**CQs** must not contain a time restriction in the WHERE clause. The database will interpolate an absolute time restriction for the query at runtime.

For example, suppose a database has a **CQ** like `SELECT MEAN(value) INTO new_measurement FROM old_measurement GROUP BY time(5m)` and the time is currently 10:04:59 (we will omit the date for clarity.) Shortly after 10:05 the database will execute the **continuous query**.

The exact timing is not guaranteed, but **CQs** run once for each interval in the GROUP BY statement, meaning this **CQ** will run once every five minutes. When it runs it will calculate the mean for the **Field** “value” on the **Measurement** “old_measurement” over the interval from 10:00:00 to 10:04:59.999999999 and insert that into the **Measurement** “new_measurement”. Again shortly after 10:10 the database will calculate the mean of the value for the interval from 10:05:00 to 10:09:59.999999999 and insert that into “new_measurement”.

## Aggregation
An **aggregation** is a function that takes a collection of **points** and produces a summary value over a particular time period.

**Aggregations** supported include COUNT, MEAN, SUM, MEDIAN, PERCENTILE, MIN, MAX, SPREAD, STDDEV, DERIVATIVE, NON_NEGATIVE_DERIVATIVE, DISTINCT, FIRST, and LAST.

**Aggregations** may be run on intervals as short as 1 second and the intervals may be specified in seconds, minutes, hours, days, or weeks.

## Selector
Functions with Single-value return.

## Transformation
Functions that transform the data but are neither a **selector** nor an **aggregation**. DERIVATIVE is a good example, as would be HISTOGRAM if implemented.

## Function
**Aggregations**, **selectors**, and **transformations**, and eventually custom functions.

## Timestamp
A **timestamp** is the date and time associated with a particular **point**.

All **points** must have one and only one **timestamp**.

The **timestamp** may be specified in UNIX epoch or a datetime string valid under RFC 3339.

For either method precision may be given in seconds, milliseconds, microseconds, or nanoseconds. If precision is not provided it is assumed to be seconds.

If a **timestamp** is not specified at write time the **Node** receiving the write will insert its current system time as the timestamp, using nanosecond precision.

## Cluster
A **cluster** is a collection of **servers** running InfluxDB **nodes**.

**Clusters** may have 1 or 3 nodes in InfluxDB 0.9.

## User
A **user** is required when authentication is enabled for the database.

## Node
A **node** is a logical concept in the clustering setup. **Nodes** belong to **servers** (one node per server.)

## Server
A **server** is a machine, virtual or physical, running InfluxDB. There should only be one InfluxDB process per **server**.

<!--
## Column

## Identifier

## Batch

## Shard

## Shard File
-->
