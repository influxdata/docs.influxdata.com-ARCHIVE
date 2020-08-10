---
title: Get started with Flux
description: Get started with Flux, InfluxData's new functional data scripting language. This step-by-step guide will walk you through the basics and get you on your way.
menu:
  flux_0_65:
    name: Get started with Flux
    identifier: get-started
    parent: Introduction
    weight: 2
---

Flux is InfluxData's new functional data scripting language designed for querying,
analyzing, and acting on data.

This multi-part getting started guide walks through important concepts related to Flux.
It covers querying time series data from InfluxDB using Flux, and introduces Flux syntax and functions.

## What you will need

##### InfluxDB v1.8+
Flux v0.65 is built into InfluxDB v1.8 and can be used to query data stored in InfluxDB.
InfluxDB v1.8's `influx` CLI also includes a `-type=` option that, when set to `flux`, will start an
interactive Flux Read-Eval-Print-Loop (REPL) allowing you to write and run Flux queries from the command line.

---

_For information about downloading and installing InfluxDB, see [InfluxDB installation](/influxdb/latest/introduction/installation)._

---

##### Chronograf v1.8+
**Not required but strongly recommended**.
Chronograf v1.8's Data Explorer provides a user interface (UI) for writing Flux scripts and visualizing results.
Dashboards in Chronograf v1.8+ also support Flux queries.

---

_For information about downloading and installing Chronograf, see [Chronograf installation](/chronograf/latest/introduction/installation)._

---

_If your are using Docker, the [InfluxData Sandbox](/platform/install-and-deploy/deploying/sandbox-install)
will install the latest version of each component of the TICK stack._

---


## Key concepts
Flux introduces important new concepts you should understand as you get started.

### Buckets
Flux introduces "buckets," a new data storage concept for InfluxDB.
A **bucket** is a named location where data is stored that has a retention policy.
It's similar to an InfluxDB v1.x "database," but is a combination of both a database and a retention policy.
When using multiple retention policies, each retention policy is treated as is its own bucket.

Flux's [`from()` function](/flux/v0.65/stdlib/built-in/inputs/from), which defines an InfluxDB data source, requires a `bucket` parameter.
When using Flux with InfluxDB v1.x, use the following bucket naming convention which combines
the database name and retention policy into a single bucket name:

###### InfluxDB v1.x bucket naming convention
```js
// Pattern
from(bucket:"<database>/<retention-policy>")

// Example
from(bucket:"telegraf/autogen")
```

### Pipe-forward operator
Flux uses pipe-forward operators (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
they are further processed or manipulated.

### Tables
Flux structures all data in tables.
When data is streamed from data sources, Flux formats it as annotated comma-separated values (CSV), representing tables.
Functions then manipulate or process them and output new tables.
This makes it easy to chain together functions to build sophisticated queries.

#### Group keys
Every table has a **group key** which describes the contents of the table.
It's a list of columns for which every row in the table will have the same value.
Columns with unique values in each row are **not** part of the group key.

As functions process and transform data, each modifies the group keys of output tables.
Understanding how tables and group keys are modified by functions is key to properly
shaping your data for the desired output.

###### Example group key
```js
[_start, _stop, _field, _measurement, host]
```

Note that `_time` and `_value` are excluded from the example group key because they
are unique to each row.

## Tools for working with Flux

You have multiple [options for writing and running Flux queries](/flux/v0.65/guides/executing-queries),
but as you're getting started, we recommend using the following:

### 1. Chronograf's Data Explorer
Chronograf's Data Explorer makes it easy to write your first Flux script and visualize the results.
To use Chronograf's Flux UI, open the **Data Explorer**.
Select **Flux** as the source type to the right of the source dropdown.

This will provide **Schema**, **Script**, and **Functions** panes.
The Schema pane allows you to explore your data.
The Script pane is where you write your Flux script.
The Functions pane provides a list of functions available in your Flux queries.

### 2. influx CLI
The `influx` CLI is an interactive shell for querying InfluxDB.
With InfluxDB v1.7+, use the `-type=flux` option to open a Flux REPL where you write and run Flux queries.

```bash
influx -type=flux
```

<div class="page-nav-btns">
  <a class="btn next" href="/flux/v0.65/introduction/getting-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
