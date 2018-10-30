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

This multi-part getting started guide walks through important concepts related to Flux,
how to query time series data from InfluxDB using Flux, and an introduction to Flux syntax and functions.

## What you will need

##### InfluxDB v1.7+
Flux v0.7 (technical preview) is built into InfluxDB v1.7 and can be used to query data stored in InfluxDB.
InfluxDB v1.7's `influx` CLI also includes a new `-type=` option that, when set to `flux`, will start an
interactive Flux Read-Eval-Print-Loop (REPL) allowing you to write and run Flux queries from the command line.
_See the [InfluxDB installation instructions](/influxdb/v1.7/introduction/installation)._

##### Chronograf v1.7+
**Not required but strongly recommended**.
Chronograf v1.7's Data Explorer provides a user-interface (UI) for writing Flux scripts and visualizing results.
Dashboards in Chronograf v1.7+ also support Flux queries.
_See the [Chronograf installation instructions](/chronograf/v1.7/introduction/installation)._

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
When using multiple retention policies, each gets its own bucket.

Flux's `from()` function, which defines an InfluxDB data source, requires a `bucket` parameter.
With InfluxDB v1.x, the following bucket naming convention combines the database name
and the retention policy into a single bucket name:

_**InfluxDB v1.x bucket naming convention**_
```js
// Pattern
from(bucket:"<database>/<retention-policy>")

// Example
from(bucket:"telegraf/autogen")
```

### The pipe-forward operator
Flux uses the pipe-forward operator (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
it is further processed or manipulated.

### Flat schemas
As mentioned before, Flux is designed for InfluxDB v2.0, but is available for use with v1.x.
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

## Tools for working with Flux

You have two options for writing and running Flux queries:

### 1. Chronograf's Data Explorer
Chronograf's Data Explorer makes it easy to write your first Flux script and visualize the results.
To use Chronograf's Flux UI, open the Data Explorer and click **Add a Query**.
To the right of the source dropdown above the graph placeholder, select **Flux** as the source type.

![Flux in the Data Explorer](/img/flux/flux-builder-start.gif)

This will provide **Script** and **Explore** panes.
The Script pane is where you write your Flux script.
The Explore pane allows you to explore your data.

### 2. The influx CLI
The `influx` CLI is an interactive shell for querying InfluxDB.
With InfluxDB v1.7+, use the `-type=flux` option to open a Flux REPL where you write and run Flux queries.

```bash
influx -type=flux
```

---

**As you're working through the getting started guides, use either Chronograf's
Flux UI or the `influx` CLI's Flux option to write and run Flux scripts.**

---

<div class="page-nav-btns">
  <a class="btn next" href="/flux/v0.7/introduction/getting-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
