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

* [TICK overview](#tick)
* [Networking](#networking)
* [Configuration and security](#configuration-and-security)
* [Downloading and installing](#builds)

## TICK overview
Chronograf is the user interface component of InfluxData's [TICK stack](https://www.influxdata.com/products/). The TICK stack also includes the following components:

* [InfluxDB](/influxdb/latest/) or [InfluxDB Enterprise](/enterprise_influxdb/latest/) (required): Stores the time series data that populates the Chronograf interface.
* [Telegraf](/telegraf/latest/) (recommended): Collects and writes data to an InfluxDB instance or InfluxDB Enterprise cluster.
* [Kapacitor](/kapacitor/latest/) (optional): Responsible for creating and sending alerts in Chronograf.

## Networking

Chronograf runs on `localhost:8888` by default.
Those settings are [configurable](/chronograf/latest/administration/config-options).

## Configuration and security

* See [Configuring Chronograf](/chronograf/latest/administration/configuration/) for a description of the available configuration options.
* See [Managing security](/chronograf/latest/administration/managing-security/) for TLS and OAuth 2.0 setup instructions.

## Downloading and installing

The latest Chronograf builds are available on InfluxData's [Downloads page](https://influxdata.com/downloads).
1. Choose the download link for your operating system.
2. Note that if your download includes a TAR package, we recommend specifying a location for the underlying datastore, `chronograf-v1.db` outside of the directory from which you start Chronograf. This allows you to preserve and reference your existing datastore, including configurations and dashboards, when you download future versions.
3. Install Chronograf:
  * Mac OSX: `tar zxvf chronograf-1.6.2_darwin_amd64.tar.gz`
  * Ubuntu & Debian: `sudo dpkg -i chronograf_1.6.2_amd64.deb`
  * RedHat and CentOS: `sudo yum localinstall chronograf-1.6.2.x86_64.rpm`

For instructions on building from source, see Chronograf's [README](https://github.com/influxdata/chronograf/blob/master/README.md#from-source) on GitHub.
