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

## Upgrading from 1.4 to 1.5 (and enabling TSI)


**To upgrade from 1.4 to 1.5:**

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update the InfluxDB 1.5 configuration file

    Migrate any customizations in the 1.4 configuration file to the [1.5 configuration file](/influxdb/v1.5/administration/config/).


3. **Enable TSI (Time Series Index) (recommended):**

> ***Note:*** Starting with InfluxDB 1.5, TSI (Time Series Index) support exits preview and is ready to support your demanding high series cardinality needs.


     1. In the `[data]` section of the configuration file, uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set it to `tsi1`.

    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```

3. Restart the service

4. Check out the new features outlined in
[Differences between InfluxDB 1.4 and 1.5](/influxdb/v1.5/administration/differences/)

To upgrade from 1.4 to 1.5 (if you used TSI Preview on this InfluxDB instance)

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

3. Delete the existing TSI index files that were created using the TSI Preview.




4. Restart the service

4. Check out the new features outlined in
[Differences between InfluxDB 1.4 and 1.5](/influxdb/v1.5/administration/differences/)
