---
title: Installing Chronograf
menu:
  chronograf_1_6:
    name: Installing
    weight: 20
    parent: Introduction
---

This page describes how to download and install Chronograf.

### Content

* [TICK overview](#tick-overview)
* [Download and install](#download-and-install)
* [Connect to your InfluxDB instance or InfluxDB Enterprise cluster](#connect-chronograf-to-your-influxdb-instance-or-influxdb-enterprise-cluster)
* [Connect to Kapacitor](#connect-chronograf-to-kapacitor)


## TICK overview
Chronograf is the user interface for InfluxData's [TICK stack](https://www.influxdata.com/time-series-platform/).

## Download and install

The latest Chronograf builds are available on InfluxData's [Downloads page](https://portal.influxdata.com/downloads).

1. Choose the download link for your operating system.
  * Note that if your download includes a TAR package, we recommend specifying a location for the underlying datastore, `chronograf-v1.db`, outside of the directory from which you start Chronograf. This allows you to preserve and reference your existing datastore, including configurations and dashboards, when you download future versions.
2. Install Chronograf:
  * MacOS: `tar zxvf chronograf-1.6.2_darwin_amd64.tar.gz`
  * Ubuntu & Debian: `sudo dpkg -i chronograf_1.6.2_amd64.deb`
  * RedHat and CentOS: `sudo yum localinstall chronograf-1.6.2.x86_64.rpm`
3. Start Chronograf:
  * MacOS: `tar zxvf chronograf-1.6.2_darwin_amd64.tar.gz`
  * Ubuntu & Debian: `sudo dpkg -i chronograf_1.6.2_amd64.deb`


## Connect Chronograf to your InfluxDB instance or InfluxDB Enterprise cluster

1. Point your web browser to [localhost:8888](http://localhost:8888).
2. Fill out the form with the following details:
  * **Connection String**: Enter the hostname or IP of the machine that InfluxDB is running on, and be sure to include InfluxDB's default port `8086`.
  * **Connection Name**: Enter a name for your connection string.
  * **Username** and **Password**: These fields can remain blank unless you've [enabled authorization](/influxdb/v1.6/administration/config/#auth-enabled-false) in InfluxDB.
  * **Telegraf Database Name**: Optionally, enter a name for your Telegraf database. The default name is Telegraf.
3. Click **Add Source**.

## Connect Chronograf to Kapacitor

1. In Chronograf, click the configuration (wrench) icon in the sidebar menu, then select **Add Config** in the **Active Kapacitator** column.
2. In the **Kapacitor URL** field, enter the hostname or IP of the machine that Kapacitor is running on. Be sure to include Kapacitor's default port: `9092`.
3. Enter a name for your connection.
4. Leave the **Username** and **Password** fields blank unless you've specifically enabled authorization in Kapacitor.
5. Click **Connect**.
