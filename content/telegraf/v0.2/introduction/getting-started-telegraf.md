---
title: Getting Started with Telegraf

menu:
  telegraf_02:
    name: Getting Started
    weight: 0
    parent: introduction
---

## Getting Started with Telegraf
Telegraf is an agent written in Go for collecting metrics and writing them into InfluxDB or other possible outputs.
This guide will get you up and running with Telegraf.
It walks you through the download, installation, and configuration processes, and it shows how to use Telegraf to get data into InfluxDB.

## Download and Install Telegraf
Follow the instructions in the Telegraf section on the [Downloads page](https://influxdata.com/downloads/).

## Configuration
### Configuration file location by installation type

* OS X [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
* Linux debian and RPM packages: `/etc/opt/telegraf/telegraf.conf`
* Standalone Binary: see the next section for how to create a configuration file

### Creating and Editing the Configuration File
Before starting the Telegraf server you need to edit and/or create an initial configuration that specifies your desired [plugins](/telegraf/v0.2/plugins/) (where the metrics come from) and [outputs](/telegraf/v0.2/outputs/) (where the metrics go).
There are [several ways](../configuration/) to create and edit the configuration file.
Here, we'll generate a configuration file and simultaneously specify the desired plugins with the `-filter` flag and the desired output with the `-outputfilter` flag.


In the example below, we create a configuration file called `telegraf.conf` with two plugins: one that reads metrics about the system's cpu usage (`cpu`) and one that reads metrics about the system's memory usage (`mem`).
`telegraf.conf` specifies InfluxDB as the desired ouput.

```shell
telegraf -sample-config -filter cpu:mem -outputfilter influxdb > telegraf.conf
```

## Start the Telegraf Server
Start the Telegraf server and direct it to the relevant configuration file:
### OS X [Homebrew](http://brew.sh/)
```shell
telegraf -config telegraf.conf
```

### Linux debian and RPM packages
```shell
sudo service telegraf start
```

### Ubuntu 15+
```shell
systemctl start telegraf
```

## Results
Once Telegraf is up and running it'll start collecting data and writing them to the desired output.

Returning to our sample configuration, we show what the `cpu` and `mem` data look like in InfluxDB below.
Note that we used the default plugin and output configuration settings to get these data.

* List all [measurements](https://docs.influxdata.com/influxdb/v0.9/concepts/glossary/#measurement) in the `telegraf` [database](https://docs.influxdata.com/influxdb/v0.9/concepts/glossary/#database):

```shell
> SHOW MEASUREMENTS
name: measurements
------------------
name
cpu_usage_guest
cpu_usage_guest_nice
cpu_usage_idle
cpu_usage_iowait
cpu_usage_irq
cpu_usage_nice
cpu_usage_softirq
cpu_usage_steal
cpu_usage_system
cpu_usage_user
mem_available
mem_available_percent
mem_buffered
mem_cached
mem_free
mem_total
mem_used
mem_used_percent
```

Notice that each measurement has the name of the plugin prepended to it.

* Select a sample of the data in the measurement `cpu_usage_idle`:

```shell
> SELECT value FROM cpu_usage_idle WHERE cpu='cpu-total' LIMIT 5
name: cpu_usage_idle
--------------------
time			                value
2015-12-08T21:39:20Z	  98.04902451225612
2015-12-08T21:39:30Z	  97.70028746406699
2015-12-08T21:39:40Z	  98.37520309961255
2015-12-08T21:39:50Z	  98.17522809648794
2015-12-08T21:40:00Z	  96.84881830686507
```

Notice that the timestamps occur at rounded ten second intervals (that is, `:00`, `:10`, `:20`, and so on) - this is a configurable setting.

That's it!
You now have the foundation for using Telegraf to collect metrics and write them to your output of choice.
