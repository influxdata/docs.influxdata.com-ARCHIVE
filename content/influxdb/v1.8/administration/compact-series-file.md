---
title: Compact a series file offline
description: >
  Use the `influx_inspect buildtsi -compact-series-file` command to compact your
  series file and reduce its size on disk.
menu:
  influxdb_1_8:
    weight: 67
    parent: Administration
    name: Compact a series file
---

Use the **Series File Compaction tool** to compact your series file and reduce its size on disk.
This is useful for series files that grow quickly, for example, when series are frequently created and deleted.

**To compact a series file:**

1.  Stop the `influxd` process.

2.  Run the following command, including your **data directory** and **WAL directory**:

    ```sh
    # Syntax
    influx_inspect buildtsi -compact-series-file -datadir <data_dir> -waldir <wal_dir>

    # Example
    influx_inspect buildtsi -compact-series-file -datadir /data -waldir /wal
    ```

3. Restart the `influxd` process.

4. **_(InfluxDB Enterprise only)_** On each data node:
    1. Complete steps 1-3.
    2. Wait for the [hinted handoff queue (HHQ)](/enterprise_influxdb/latest/concepts/clustering/#hinted-handoff)
       to write all missed data to the node.
    3. Continue to the next data node.
