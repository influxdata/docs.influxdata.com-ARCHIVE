---
title: Upgrading to InfluxDB 1.5

menu:
  influxdb_1_5:
    weight: 60
    parent: administration
---

This page outlines process for upgrading from:

<table style="width:100%">
  <tr>
    <td><a href="#upgrade-from-0-12-1-2-to-1-3">Version 1.4 to 1.5</a></td>
    <td><a href="#upgrade-from-0-10-or-0-11-to-1-3">Version 0.10 or 0.11 to 1.4</a></td>
  </tr>
</table>

## Upgrading from 1.4 to 1.5

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update the configuration file

    Migrate any customizations in the 1.4 configuration file to the [1.5 configuration file](/influxdb/v1.5/administration/config/).


    **Enable TSI (Time Series Index) (recommended):**

     1. Uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set it to `tsi1`.
    The `index-version` setting is in the `[data]` section of the configuration file.

    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```

3. Restart the process

4. Check out the new features outlined in
[Differences between InfluxDB 1.4 and 1.5](/influxdb/v1.5/administration/differences/)
