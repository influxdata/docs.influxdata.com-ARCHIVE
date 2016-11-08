---
title: Getting Started with Telegraf
aliases:
    - telegraf/v1.1/introduction/getting-started-telegraf/
menu:
  telegraf_1_1:
    name: Getting Started
    weight: 20
    parent: introduction
---

## Getting Started with Telegraf
Telegraf is an agent written in Go for collecting metrics and writing them into InfluxDB or other possible outputs.
This guide will get you up and running with Telegraf.
It walks you through the download, installation, and configuration processes, and it shows how to use Telegraf to get data into InfluxDB.

## Download and Install Telegraf
Follow the instructions in the Telegraf section on the [Downloads page](https://influxdata.com/downloads/).

> **Note:** Telegraf will start automatically using the default configuration when installed from a deb package.

## Configuration
### Configuration file location by installation type

* OS X [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
* Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
* Standalone Binary: see the next section for how to create a configuration file

### Creating and Editing the Configuration File
Before starting the Telegraf server you need to edit and/or create an initial configuration that specifies your desired [inputs](/telegraf/v1.1/inputs/) (where the metrics come from) and [outputs](/telegraf/v1.1/outputs/) (where the metrics go). There are [several ways](/telegraf/v1.1/administration/configuration/) to create and edit the configuration file.
Here, we'll generate a configuration file and simultaneously specify the desired inputs with the `-input-filter` flag and the desired output with the `-output-filter` flag.

In the example below, we create a configuration file called `telegraf.conf` with two inputs:
one that reads metrics about the system's cpu usage (`cpu`) and one that reads metrics about the system's memory usage (`mem`). We specify InfluxDB as the desired output.

```bash
telegraf -sample-config -input-filter cpu:mem -output-filter influxdb > telegraf.conf
```

## Start the Telegraf Server
Start the Telegraf server and direct it to the relevant configuration file:
### OS X [Homebrew](http://brew.sh/)
```bash
telegraf -config telegraf.conf
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
Once Telegraf is up and running it will start collecting data and writing them to the desired output.

Returning to our sample configuration, we show what the `cpu` and `mem` data look like in InfluxDB below.
Note that we used the default input and output configuration settings to get these data.

* List all [measurements](/influxdb/v1.1/concepts/glossary/#measurement) in the `telegraf` [database](/influxdb/v1.1/concepts/glossary/#database):

```
> SHOW MEASUREMENTS
name: measurements
------------------
name
cpu
mem
```

* List all [field keys](/influxdb/v1.1/concepts/glossary/#field-key) by measurement:

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

* Select a sample of the data in the [field](/influxdb/v1.1/concepts/glossary/#field) `usage_idle` in the measurement `cpu_usage_idle`:

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


That's it! You now have the foundation for using Telegraf to collect metrics and write them to your output of choice.  
