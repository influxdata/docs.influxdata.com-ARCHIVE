---
title: Run offline series file compactions
description: >
  Use the `influx_inspect buildtsi -compact-series-file` command to compact your
  series file and reduce its size on disk.
menu:
  influxdb_1_8:
    weight: 67
    parent: Administration
    name: Compact your series file
---

Use the `influx_inspect buildtsi -compact-series-file` command to compact your
series file and reduce its size on disk.
Your series file contains a set of all series keys across your entire database.
Use cases that create and delete series frequently can cause series files to grow quickly.
The series file compaction tool allows you to reduce the size of your series file.

Use the following steps to compact your series file:

1.  **Stop InfluxDB**

    Stop InfluxDB by stopping the `influxd` process.

2.  **Compact your series file**

    Use the [`influx_inspect buildtsi` command](/influxdb/v1.8/tools/influx_inspect/#buildtsi)
    with the `-compact-series-file` flag to compact your series file.
    Provide your **data directory** and your **Write Ahead Log (WAL) directory**:

    ```sh
    # Syntax
    influx_inspect buildtsi \
      -compact-series-file \
      -datadir <data_dir> \
      -waldir <wal_dir>

    # Example
    influx_inspect buildtsi \
      -compact-series-file \
      -datadir /data \
      -waldir /wal
    ```

3. **Restart InfluxDB**

    Restart InfluxDB by starting the `influxd` process.

---

{{% note %}}
### Compact series files in an InfluxDB Enterprise cluster
To compact series files in an InfluxDB Enterprise cluster, perform the steps
above on each data node in the cluster, one after the other.
After restarting the `influxd` process on a data node, allow the
[hinted handoff queue (HHQ)](/enterprise_influxdb/latest/concepts/clustering/#hinted-handoff)
to write all missed data to the node before moving on to the next.
{{% /note %}}
