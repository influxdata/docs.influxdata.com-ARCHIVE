---
title: v1.databases() function
description: The v1.databases() function returns a list of databases in an InfluxDB 1.7+ instance.
menu:
  flux_0_50:
    name: v1.databases
    parent: InfluxDB v1
weight: 1
---

The `v1.databases()` function returns a list of databases in an **InfluxDB 1.7+ instance**.

```js
import "influxdata/influxdb/v1"

v1.databases()
```

Output includes the following columns:

- **databaseName:** Database name _(string)_
- **retentionPolicy:** Retention policy name _(string)_
- **retentionPeriod:** Retention period in nanoseconds _(integer)_
- **default:** Default retention policy for database _(boolean)_

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW DATABASES](/influxdb/latest/query_language/schema_exploration#show-databases)
