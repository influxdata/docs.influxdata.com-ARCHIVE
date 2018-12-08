---
title: Set up an external monitor
description: How to set up an external InfluxData TICK stack that monitors another Enterprise or OSS TICK stack.
menu:
  platform:
    name: Set up an external monitor
    parent: Monitoring InfluxData Platform
    weight: 2
---

The flexibility and portability of InfluxData's TICK stack make it easy to use in different
monitoring solutions, including monitoring the TICK stack with another TICK stack.
This guide walks through setting up an external TICK stack monitor to which important
metrics are sent and monitored.

The following terms are used throughout this guide:

- **Primary** - The _monitored_ TICK stack or cluster for which uptime is most important.
- **Monitor** - The _monitoring_ TICK stack to which monitoring data is sent and processed.

_This guide assumes a primary node or cluster is already running._

## Install a monitor
Install a separate TICK stack to act as your monitor.
Your monitor should be on hardware separate from your primary cluster.
Installation instructions for the TICK stack are provided in the [installation guides](/platform/installation).

> In order for your monitor to receive data from your primary cluster, the primary
> must be able to connect to InfluxDB's API endpoint in your monitor via HTTP or UDP.

## Install Telegraf on each primary node
[Install the `telegraf` agent](/telegraf/latest/introduction/installation/#installation)
on each node in your primary cluster you would like to monitor.

### Send Telegraf data to your monitor
[Generate a telegraf configuration file](/telegraf/latest/introduction/installation/#configuration)
and modify the InfluxDB output to send data to your monitor's InfluxDB API endpoint.
This is done using the `urls` option under `[[outputs.influxdb]]` in your `telegraf.conf`.

_**telegraf.conf**_
```toml
# ...

[[outputs.influxdb]]
  ## The full HTTP or UDP URL for your InfluxDB instance.
  urls = ["http://monitor-url.com:8086"]

# ...
```

### Configure monitored metrics
By default, Telegraf is configured to collect the following metrics from the host machine:

- CPU
- Disk
- Disk IO
- Memory
- Processes
- Swap
- System (load, number of CPUs, number of users, uptime, etc.)

[Telegraf input plugins](/telegraf/latest/plugins/inputs/) can be used to collect
other metrics as well.

### Namespace monitoring data (optional)
If Telegraf is running on your monitor, it will store your monitor's own metrics in the `telegraf` database by default.
To keep your monitor's internal data separate from your primary monitoring data,
configure your Telegraf agents to write to a database other than `telegraf` using
the `database` setting under `[[outputs.influxdb]]` in your `telelgraf.conf`.

```toml
# ...

[[outputs.influxdb]]

  # ...

  ## The target database for metrics; will be created as needed.
  database = "primary-telegraf"

  # ...
```

### Update primary hostnames (optional)
Telegraf's default behavior is to include a `host` tag on each data point
using the `os.hostname` provided by the host machine.
You can customize the hostname by updating the `hostname` setting under the `[agent]`
section in your `telegraf.conf`.

_**Example custom hostname in telegraf.conf**_
```toml
[agent]

  # ...

  ## Override default hostname, if empty use os.Hostname()
  hostname = "primary_influxdb_1"

  # ...
```

## Start Telegraf
With Telegraf installed and configured on each of your primary nodes, start Telegraf
using your custom configuration file.

```bash
telegraf -config path/to/telegraf.conf
```

## Create Kapacitor monitoring alerts
Monitoring data should now be flowing from your primary cluster to your monitor
where it can be processed by your monitor's Kapacitor component.
[Create Kapacitor alerts](/kapacitor/latest/working/alerts/) that alert you of issues
detected in any of the monitored metrics.
