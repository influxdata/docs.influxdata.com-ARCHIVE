---
title: Merging many series into one
---

```sql
select * from merge (/stats.*/)
```

The above query would merge all of the stats time series into one. As in [issue #72](https://github.com/influxdb/influxdb/issues/72)
