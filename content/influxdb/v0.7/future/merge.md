---
title: Merging many series into one
menu:
  influxdb_07:
    name: Merging Many Series
    weight: 60
    parent: future
---

```sql
select * from merge (/stats.*/)
```

The above query would merge all of the stats time series into one.
As in [issue #72](https://github.com/influxdb/influxdb/issues/72)
