---
title: Getting started with Telegraf
description: Downloading, installing, configuring and getting started with Telegraf, the plug-in driven server agent of the InfluxData time series platform.
aliases:
  - /telegraf/v1.15/introduction/getting_started/
menu:
  telegraf_1_15:
    name: Getting started
    weight: 30
    parent: Introduction
---

Use Telegraf to collect and write metrics into InfluxDB and other supported outputs.

To get up and running, do the following:

1. [Download and install Telegraf](#download-and-install-telegraf)
2. [Configure Telegraf](#configure-telegraf)
3. [Start Telegraf service](#start-telegraf-service)

## Download and install Telegraf

Follow the instructions in the Telegraf section on the [Downloads page](https://influxdata.com/downloads/).

> **Note:** Telegraf will start automatically using the default configuration when installed from a deb package.

## Configure Telegraf

### Configuration file location by installation type

* macOS [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
* Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
* Standalone Binary: see the next section for how to create a configuration file

> **Note:** You can also specify a remote URL endpoint to pull a configuration file from. See [Configuration file locations](/telegraf/v1.15/administration/configuration/#configuration-file-locations).

### Create and edit the configuration file

Before starting the Telegraf server, create or edit the initial configuration to specify your [inputs](/telegraf/v1.15/plugins/inputs/) (where the metrics come from) and [outputs](/telegraf/v1.15/plugins/outputs/) (where the metrics go). You can do this [several ways](/telegraf/v1.15/administration/configuration/).

The following example shows how to create a configuration file called `telegraf.conf` and specify two inputs (`cpu` and `mem`) with the `--input-filter` flag and specify InfluxDB as the output with the `--output-filter` flag.

```bash
telegraf -sample-config --input-filter cpu:mem --output-filter influxdb > telegraf.conf
```

`cpu` and `mem` reads metrics about the system's cpu usage and memory usage, and then output this data to InfluxDB.

## Start Telegraf service

Start the Telegraf service and direct it to the relevant configuration file or URL to pull a configuration file from a remote endpoint:

### macOS [Homebrew](http://brew.sh/)
```bash
telegraf --config telegraf.conf
```

### Linux (sysvinit and upstart installations)
```bash
sudo service telegraf start
```

### Linux (systemd installations)
```bash
systemctl start telegraf
```

## Results

Telegraf starts collecting and writing data to the specified output.

Returning to our sample configuration, we show what the `cpu` and `mem` data looks like in InfluxDB below.
Note that we used the default input and output configuration settings to get this data.

* List all [measurements](/influxdb/v1.4/concepts/glossary/#measurement) in the `telegraf` [database](/influxdb/v1.4/concepts/glossary/#database):

```
> SHOW MEASUREMENTS
name: measurements
------------------
name
cpu
mem
```

* List all [field keys](/influxdb/v1.4/concepts/glossary/#field-key) by measurement:

```
> SHOW FIELD KEYS
name: cpu
---------
fieldKey                fieldType
usage_guest             float
usage_guest_nice	       float
usage_idle		            float
usage_iowait		          float
usage_irq		             float
usage_nice		            float
usage_softirq		         float
usage_steal		           float
usage_system		          float
usage_user		            float

name: mem
---------
fieldKey                fieldType
active			               integer
available		             integer
available_percent	      float
buffered		              integer
cached			               integer
free			                 integer
inactive		              integer
total			                integer
used			                 integer
used_percent		          float
```

* Select a sample of the data in the [field](/influxdb/v1.4/concepts/glossary/#field) `usage_idle` in the measurement `cpu_usage_idle`:

```bash
> SELECT usage_idle FROM cpu WHERE cpu = 'cpu-total' LIMIT 5
name: cpu
---------
time			               usage_idle
2016-01-16T00:03:00Z	 97.56189047261816
2016-01-16T00:03:10Z	 97.76305923519121
2016-01-16T00:03:20Z	 97.32533433320835
2016-01-16T00:03:30Z	 95.68857785553611
2016-01-16T00:03:40Z	 98.63715928982245
```

Notice that the timestamps occur at rounded ten second intervals (that is, `:00`, `:10`, `:20`, and so on) - this is a configurable setting.

That's it! You ready to use Telegraf to collect metrics and write them to your output of choice.
