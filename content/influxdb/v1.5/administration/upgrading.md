---
title: Upgrading to InfluxDB 1.5

menu:
  influxdb_1_5:
    name: Upgrading
    weight: 20
    parent: administration
---

This page includes the steps required for upgrading InfluxDB OSS and InfluxDB Enterprise from earlier versions.

* [Upgrading from 1.3 - 1.4 (no TSI Preview) to 1.5 (TSI enabled)](#upgrading-from-13-14-no-tsi-preview-to-15-tsi-enabled)
* [Upgrading from 1.4 (TSI Preview enabled) to 1.5 (TSI enabled)](#upgrading-from-13-14-tsi-preview-enabled-to-15-tsi-enabled)
* [Upgrading from 1.3 to 1.5 (TSI enabled)](#upgrading-from-13-to-15-tsi-enabled)
* [Upgrading InfluxDB Enterprise clusters](#upgrading-influxdb-enterprise-clusters)

## Upgrading from 1.3 - 1.4 (no TSI Preview) to 1.5 (TSI enabled)

> ***Note:*** The steps below assume that you are upgrading from InfluxDB 1.3 or 1.4 using the default in-memory indexing to enabling TSI for the first time.

**To upgrade from 1.4 (no TSI Preview) to 1.5 (TSI enabled):**

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update your InfluxDB configuration

* Migrate configuration file customizations in your InfluxDB 1.4 configuration file to the InfluxDB 1.5 [configuration file](/influxdb/v1.5/administration/config/)
* Add environment variables, if desired.

3. **Enable TSI (Time Series Index):**

     1. In the `[data]` section of the configuration file, uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set the value to `tsi1`.

    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```
4. Run the [influx_inspect buildtsi utility](/influxdb/v1.5/tools/influx_inspect/#influx_inspect-buildtsi) to convert existing TSM-based shards to shards that support TSI (time series index) disk-based index files.
When TSI is enabled, new shards use the disk-based indexing. Existing shards must be converted to use TSI.

5. Restart the InfluxDB service

6. Check out the new features highlighted in
[What's new in InfluxDB 1.5](/influxdb/v1.5/administration/differences/) and the [Release Notes/Changelog](/influxdb/v1.5/about_the_project/releasenotes-changelog/).

## Upgrading from 1.3 - 1.4 (TSI Preview enabled) to 1.5 (TSI enabled)

The steps below assume that your InfluxDB instance was using the TSI Preview.

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update your InfluxDB configuration settings

* Migrate configuration file customizations in your InfluxDB 1.4 configuration file to the InfluxDB 1.5 [configuration file](/influxdb/v1.5/administration/config/)
* Add environment variables, if desired.

3. **Enable TSI (Time Series Index):**

     1. In the `[data]` section of the configuration file, uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set the value to `tsi1`.

    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```

4. Delete all `index` directories for all shards. This  in order to remove the incompatible index files.

5. Run the [influx_inspect buildtsi utility](/influxdb/v1.5/tools/influx_inspect/#influx_inspect-buildtsi) to convert TSM-based shards to shards supporting TSI (time series index) disk-based index files.
When TSI is enabled, new shards use the disk-based indexing. Existing shards must be converted to use TSI.

5. Restart the InfluxDB service.

6. Check out the new features highlighted in
[What's new in InfluxDB 1.5](/influxdb/v1.5/administration/differences/) and the [Release Notes/Changelog](/influxdb/v1.5/about_the_project/releasenotes-changelog/).

## Upgrading from 1.3 to 1.5 (TSI enabled)

> ***Note:*** The steps below assume that you are upgrading from InfluxDB 1.3 using the default in-memory indexing to enabling TSI for the first time.

**To upgrade from 1.3 to 1.5 (TSI enabled):**

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update your InfluxDB configuration

* Migrate configuration file customizations in your InfluxDB 1.3 configuration file to the InfluxDB 1.5 [configuration file](/influxdb/v1.5/administration/config/)
* Add environment variables, if desired.

3. **Enable TSI (Time Series Index):**

     1. In the `[data]` section of the configuration file, uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set the value to `tsi1`.

    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```
4. Run the [influx_inspect buildtsi utility](/influxdb/v1.5/tools/influx_inspect/#influx_inspect-buildtsi) to convert existing TSM-based shards to shards that support TSI (time series index) disk-based index files.
When TSI is enabled, new shards use the disk-based indexing. Existing shards must be converted to use TSI.

5. Restart the InfluxDB service.

6. Check out the new features highlighted in
[What's new in InfluxDB 1.5](/influxdb/v1.5/administration/differences/) and the [Release Notes/Changelog](/influxdb/v1.5/about_the_project/releasenotes-changelog/).

## Upgrading InfluxDB Enterprise clusters

To upgrade InfluxDB Enterprise clusters, all nodes must be upgraded to the InfluxDB Enterprise 1.5. You can either stop all nodes and upgrade each of the nodes while offline or perform a rolling upgrade on a live cluster.

To perform a rolling upgrade on a live InfluxDB Enterprise cluster, perform the upgrade (following the steps above) for each InfluxDB Enterprise cluster node as follows:

1. For each meta node, stop the node service, perform the upgrade steps, and then restart the node.
2. For each data node, stop the node service, perform the upgrade steps, and then restart the node.

If you have any issues upgrading your cluster, please do not hesitate to contact support at the email address
provided to you when you received your InfluxDB Enterprise license.
