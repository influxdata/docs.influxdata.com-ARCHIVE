---
title: Get started with Flux
description: placeholder
menu:
  flux_0_7:
    name: Get started with Flux
    identifier: get-started
    parent: Introduction
    weight: 2
---

Flux is InfluxData's new functional data scripting language designed for querying,
analyzing, and acting on time series data.

This multi-part guide walks through important concepts related to Flux,
how to query time series data from InfluxDB using Flux,
and an introduction to Flux syntax and functions.

## What you will need

##### InfluxDB v1.7+
Flux is included in InfluxDB v1.7's `influxd` deamon and can be used to query data stored in InfluxDB.
_See the [InfluxDB installation instructions](/influxdb/v1.7/introduction/installation)._

##### Chronograf v1.7+
Chronograf v1.7's Data Explorer supports Flux queries and provides a user-interface for
writing Flux and visualizing results.
Dashboards in Chronograf v1.7+ also support Flux queries.
_See the [Chronograf installation instructions](/chronograf/v1.7/introduction/installation)._

_**Use the Data Explorer to build your Flux queries as you follow this guide.**_

![Flux Builder](/img/flux/flux-builder.png)

---

_If using Docker, the [InfluxData Sandbox](/platform/installation/sandbox-install)
will install the latest version of each component of the TICK stack._

---

## Key concepts
Flux introduces important new concepts you should understand going in.

### Buckets
Flux is designed around querying data from InfluxDB v2.0 which will change the way data
is stored by introducing "buckets."

A **bucket** is a named location where data is stored that has a retention policy.
It's similar to an InfluxDB v1.x "database," but is a combination of both a database and a retention policy.
If using multiple retention policies, each belongs to an individual bucket.

Flux's `from()` function requires a `bucket` parameter.
When using an InfluxDB v1.x datasource, use following naming convention that combines
the database name and the retention policy into a single bucket name:

_**InfluxDB v1.x bucket naming convention**_
```js
// Pattern
from(bucket:"<database>/<retention-policy>")

// Example
from(bucket:"telegraf/autogen")
```

> If no retention policy is included in the bucket name, Flux will query the default retention policy.

### The pipe-forward operator
Flux uses the pipe-forward operator (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
it will be further processed or manipulated.

### Flat schemas
As meantioned before, Flux is designed for InfluxDB v2.0, but is available for use with v1.x.
Data schemas in InfluxDB v2.0 are not hierarchical, meaning fields and tags and not children of a measurement.
Measurements, fields, and tags all still exist in v2.0 schemas, but are each treated as "attributes."
Each row of data has a set of attributes that include the following:

- `_measurement`
- `_field`
- `_value`
- `_start`
- `_stop`
- `_time`
- Tag keys

> Attributes in the `_` namespace are reserved by InfluxData.

This flat data structure allows you to perform cross-measurement joins, query or
filter by tags without being limited to a measurement, etc.

Something also important to note is that when multiple fields are returned,
Flux will split each field into a separate tables by default.

<div class="page-nav-btns">
  <a class="btn next" href="/flux/v0.7/introduction/getting-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
