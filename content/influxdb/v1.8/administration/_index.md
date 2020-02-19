---
title: Administer InfluxDB
menu:
  influxdb_1_8:
    name: Administration
    weight: 50
---

The administration documentation contains all the information needed to administer a working InfluxDB installation.

## [Configuring InfluxDB](/influxdb/v1.8/administration/config/)

Information about the config file `influx.conf`

#### [Authentication and authorization](/influxdb/v1.8/administration/authentication_and_authorization/)

Covers how to
[set up authentication](/influxdb/v1.8/administration/authentication_and_authorization/#set-up-authentication)
and how to
[authenticate requests](/influxdb/v1.8/administration/authentication_and_authorization/#authenticate-requests) in InfluxDB.
This page also describes the different
[user types](/influxdb/v1.8/administration/authentication_and_authorization/#user-types-and-privileges) and the InfluxQL for
[managing database users](/influxdb/v1.8/administration/authentication_and_authorization/#user-management-commands).


## [Upgrading](/influxdb/v1.8/administration/upgrading/)

Information about upgrading from previous versions of InfluxDB

## [Enabling HTTPS](/influxdb/v1.8/administration/https_setup/)

Enabling HTTPS encrypts the communication between clients and the InfluxDB server.
HTTPS can also verify the authenticity of the InfluxDB server to connecting clients.

## [Logging in InfluxDB](/influxdb/v1.8/administration/logs/)

Information on how to direct InfluxDB log output.

## [Ports](/influxdb/v1.8/administration/ports/)

## [Backing up and restoring](/influxdb/v1.8/administration/backup_and_restore/)

Procedures to backup data created by InfluxDB and to restore from a backup.

## [Managing security](/influxdb/v1.8/administration/security/)

Overview of security options and configurations.

## [Stability and compatibility](/influxdb/v1.8/administration/stability_and_compatibility/)

Management of breaking changes, upgrades, and ongoing support.

## Downgrading

To revert to a prior version, complete the same steps as when [Upgrading to InfluxDB 1.8.x](/influxdb/v1.8/administration/upgrading/), replacing 1.8.x with the version you want to downgrade to. After downloading the release, migrating your configuration settings, and enabling TSI or TSM, make sure to [rebuild your index](/influxdb/v1.8/administration/rebuild-tsi-index/#sidebar).

>**Note:** Some versions of InfluxDB may have breaking changes that impact your ability to upgrade and downgrade. For example, you cannot downgrade from InfluxDB 1.3 or later to an earlier version. Please review the applicable version of release notes to check for compatibility issues between releases.
