---
title: Getting started with Chronograf
aliases:
    - /chronograf/latest/introduction/getting-started/
    - /chronograf/v1.6/introduction/getting_started/
menu:
  chronograf_1_6:
    name: Getting started
    weight: 30
    parent: Introduction
---

On this page

* [Getting started overview](#getting-started-overview)
* [Requirements](#requirements)
  - [InfluxDB setup](#influxdb-setup)
  - [Kapacitor setup](#kapacitor-setup)
  - [Telegraf setup](#telegraf-setup)
  - [Chronograf setup](#chronograf-setup)

## Getting started overview

Chronograf is the user interface component of InfluxData's [TICK stack](https://www.influxdata.com/products/). The TICK stack also includes the following components:

* [InfluxDB](/influxdb/latest/) or [InfluxDB Enterprise](/enterprise_influxdb/latest/) (required): Stores the time series data that populates the Chronograf interface.
* [Telegraf](/telegraf/latest/) (recommended): Collects and writes data to an InfluxDB instance or InfluxDB Enterprise cluster.
* [Kapacitor](/kapacitor/latest/) (optional): Responsible for creating and sending alerts in Chronograf.

![Getting started setup](/img/chronograf/latest/intro-gs-diagram.png)

Before following the steps below, make sure you've [installed Chronograf](/chronograf/installation).


## Step One: Start Chronograf

Ubuntu, RedHat:
```
sudo systemctl start chronograf
```
MacOS X:
```
sudo launchctl start chronograf
```

## Step Two: Point your web browser to `http://localhost:8888`.

## Step Three: Connect Chronograf to your InfluxDB instance or InfluxDB Enterprise cluster.
Fill out the form  that appears with the following details:
* _Connection String_: Enter the host name or IP of the machine that InfluxDB is running on, and be sure to include InfluxDB's default port `8086`.
* _Connection Name_: Enter a name for your connection string.
* _Username_ and _Password_: These fields can remain blank unless you've [enabled authorization](influxdb/v1.6/administration/config/#auth-enabled-false) in InfluxDB.
* _Telegraf Database Name_: Optionally, enter a name for your Telegraf database. The default name is Telegraf.

After you've completed the form, click _Add Source_.

## Step Four (optional): Connect Chronograf to Kapacitor

1. In Chronograf, select the configuration icon in the sidebar menu, then select _Add Config_ in the _Active Kapacitator_ column.
2. In the _Kapacitor URL_ field, enter the hostname or IP of the machine that Kapacitor is running on, and be sure to include Kapacitor's default port: `9092`.
3. Enter a name for your connection.
4. Leave the _Username_ and _Password_ fields blank unless you've specifically enabled authorization in Kapacitor.
5. Click _Connect_.


That's it! You've successfully downloaded, installed, and configured each component of the TICK stack.
Next, check out [our guides](/chronograf/latest/guides/) to become familiar with Chronograf and see all that you can do with it!
