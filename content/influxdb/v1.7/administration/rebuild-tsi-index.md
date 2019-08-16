---
title: Rebuild the TSI index
description: >
  Rebuild your InfluxDB TSI index using the `influxd_inspect buildtsi` command.
menu:
  influxdb_1_7:
    weight: 60
    parent: Administration
---

The InfluxDB [Time Series Index (TSI)](/influxdb/v1.7/concepts/tsi-details/)
indexes or caches measurement and tag data to ensure queries are performant.
In some cases, it may be necessary to flush and rebuild the TSI Index.
Use the following steps to rebuild your InfluxDB TSI index:

## 1. Stop InfluxDB
Stop InfluxDB by stopping the `influxd` process.

## 2. Remove all `_series` directories
Remove all `_series` directories.
By default, `_series` directories are are stored at `/data/<dbName>/_series`,
however you should check for and remove `_series` files throughout the `/data` directory.

## 3. Remove all index directories
Remove all index directories.
By default, index directories are stored at `/data/<dbName/<rpName>/<shardID>/index`.

## 4. Rebuild the TSI index
Use the [`influx_inspect` command line client (CLI)](/influxdb/v1.7/tools/influx_inspect)
to rebuild the TSI index:

```sh
# Pattern
influx_inspect buildtsi -datadir <data_dir> -waldir <wal_dir>

# Example
influx_inspect buildtsi -datadir /data -waldir /wal
```

## 5. Restart InfluxDB
Restart InfluxDB by starting the `influxd` process.

---

{{% note %}}
## Rebuilding the TSI index in an InfluxDB Enterprise cluster
To rebuild the TSI index in an InfluxDB Enterprise cluster, perform the steps
above on each data node in the cluster one after the other.
After restarting the `influxd` process on a data node, allow the
[hinted handoff queue (HHQ)](/enterprise_influxdb/latest/concepts/clustering/#hinted-handoff)
to write all missed data to the updated node before moving on to the next node.
{{% /note %}}
