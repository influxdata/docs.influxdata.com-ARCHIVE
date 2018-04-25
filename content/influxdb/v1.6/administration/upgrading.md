---
title: Upgrading to InfluxDB 1.5.x

menu:
  influxdb_1_6:
    name: Upgrading
    weight: 20
    parent: Administration
---

* [Upgrading from 1.3 / 1.4 (no TSI Preview) to 1.5.x (TSI enabled)](#upgrading-from-13-14-no-tsi-preview-to-15-tsi-enabled)
* [Upgrading from 1.4 (TSI Preview enabled) to 1.5.x (TSI enabled)](#upgrading-from-13-14-tsi-preview-enabled-to-15-tsi-enabled)
* [Upgrading from 1.3 to 1.5.x (TSI enabled)](#upgrading-from-13-to-15-tsi-enabled)
* [Upgrading InfluxDB Enterprise clusters](#upgrading-influxdb-enterprise-clusters)

## Upgrading from 1.3 / 1.4 (no TSI Preview) to 1.5.x (TSI enabled)

Starting with the InfluxDB 1.5 release, enabling Time Series Index (TSI) is recommended for all customers. To learn more about TSI, see:

  * [Time Series Index (TSI) overview](/influxdb/v1.6/concepts/time-series-index/)
  * [Time Series Index (TSI) details](/influxdb/v1.6/concepts/tsi-details/)

The upgrade steps below guide you in upgrading InfluxDB OSS and InfluxDB Enterprise, enabling TSI functionality.

> ***Note:*** For the InfluxDB 1.5 release, the default continues to use TSM-based shards as in earlier versions, with in-memory indexes.

**To upgrade from 1.4 (no TSI Preview) to 1.5.x (TSI enabled):**

Follow these steps to upgrade an earlier InfluxDB instance (versions 1.0 to 1.4) that did not enable the TSI Preview to an InfluxDB 1.5 instance with Time Series Index (TSI) enabled.

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version 1.5.x and install the upgrade.

2. Update your InfluxDB configuration.

  - If using the InfluxDB configuration file, migrate your InfluxDB configuration file customizations to the InfluxDB 1.5 [configuration file](/influxdb/v1.6/administration/config/).
  - Add, or modify, your environment variables.

* Migrate configuration file customizations in your InfluxDB 1.4 configuration file to the InfluxDB 1.5.x [configuration file](/influxdb/v1.6/administration/config/)
* Add environment variables, if desired.

3. Enable the Time Series Index (TSI).

  -  If using the InfluxDB configuration file, find the `[data]` section, uncomment `index-version = "inmem"'  and change the value to `tsi1`.
      - Example: `index-version = "tsi1"'

  - If using environment variables, set `INFLUXDB_DATA_INDEX_VERSION` to `tsi1`.
      - Example: `export INFLUXDB_DATA_INDEX_VERSION="tsi1"`

4. Convert existing TSM-based shards to TSI-supported shards.

  - Use [influx_inspect buildtsi](/influxdb/v1.6/tools/influx_inspect/#influx-inspect-buildtsi) for converting your TSM-based shards to TSI-based shards.


5. Restart the `influxdb` service.

## Upgrading InfluxDB 1.3 - 1.4 (TSI Preview enabled) to 1.5.x (TSI enabled)

Follow these steps to upgrade an earlier InfluxDB instance (versions 1.3 and 1.4) that had the TSI Preview enabled to an InfluxDB 1.5 instance with Time Series Index (TSI) enabled.

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5 and install the upgrade.

2. Update your InfluxDB configuration.

- If using the InfluxDB configuration file, migrate your InfluxDB configuration file customizations to the InfluxDB 1.5 [configuration file](/influxdb/v1.6/administration/config/).
- Add, or modify, your environment variables.

3. Enable the Time Series Index (TSI).

-  If using the InfluxDB configuration file, find the `[data]` section, uncomment `index-version = "inmem"`,  and change the value to `tsi1`.
    - Example: `index-version = "tsi1"`

- If using an environment variable, set `INFLUXDB_DATA_INDEX_VERSION` to `tsi1`.
    - Example: `export INFLUXDB_DATA_INDEX_VERSION=tsi1`

4. Delete all existing TSM-based shard `index` directories.

  - Removing the existing index directories ensures there are no incompatible index files.
  - By default, the index directories are located at `/<shard_ID>/index`.
    - Example: `/2/index`

5. Convert existing shards to support TSI.

  - When Time Series Index (TSI) is enabled, new shards use the TSI disk-based indexing. Existing shards must be converted to support TSI.
  - Run the [influx_inspect buildtsi](/influxdb/v1.6/tools/influx_inspect/#influx-inspect-buildtsi) command to convert existing TSM-based shards to TSI-based shards.

5. Restart the `influxdb` service.

## Upgrading InfluxDB 1.0 - 1.4 to 1.5.x

Follow these steps to upgrade an earlier InfluxDB instance (versions 1.0 to 1.4) using the default TSM in-memory indexing to an InfluxDB 1.5 instance.

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB 1.5.

2. [Install](/influxdb/v1.6/introduction/installation) InfluxDB 1.5.

2. Update your InfluxDB configuration.

- If using the InfluxDB configuration file, migrate your InfluxDB configuration file customizations to the InfluxDB 1.5 [configuration file](/influxdb/v1.6/administration/config/).
- Add, or modify, your environment variables.

5. Restart the `influxdb` service.


## Switching between TSM in-memory and TSI disk-based indexes

After installing and upgrading to InfluxDB 1.5, you can switch between using the TSM in-memory index and the TSI disk-based index if needed.

### Switching from in-memory (TSM-based) index to disk (TSI-based) index:

1. Enable TSI.
2. Convert TSM-based shards to TSI-based shards.
3. Restart the `influxdb` service.

### Switching from disk (TSI-based) index to in-memory (TSM-based) index:

1. Enable `inmem`.
2. Delete all shard `index` directories.
3. Restart the `influxdb` service.

## Upgrading InfluxDB Enterprise clusters

See [Upgrading InfluxDB Enterprise clusters](/enterprise_influxdb/v1.6/administration/upgrading/).
