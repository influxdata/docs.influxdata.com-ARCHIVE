---
title: Column Indexes
menu:
  influxdb_07:
    name: Column Indexes and Tags
    weight: 20
    parent: future
---

To enable things like tags and quick lookups on specific column values, we're going to be adding support for column indexes.
Here's the [issue to track column indexes](https://github.com/influxdb/influxdb/issues/582).

Another potentially related issue is this one to have a [column type be an array of values](https://github.com/influxdb/influxdb/issues/268).
That paired with indexes would make some lookups more efficient.
