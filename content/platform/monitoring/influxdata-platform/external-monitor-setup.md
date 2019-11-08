---
title: Configure a watcher of watchers system to monitor InfluxDB servers
description: How to set up an external InfluxData TICK stack that monitors another Enterprise or OSS TICK stack.
aliases:
  - /platform/monitoring/external-monitor-setup/
menu:
  platform:
    name: Configure a watcher of watchers
    parent: monitor-platform
    weight: 4
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
Installation instructions for the TICK stack are provided in the [installation guides](/platform/install-and-deploy/).

> In order for your monitor to receive data from your primary cluster, the primary
> must be able to connect to your monitor's API endpoint via HTTP or UDP.

## Install Telegraf on each node
[Install the `telegraf` agent](/telegraf/latest/introduction/installation/#installation)
on each node in your primary InfluxDB cluster you would like to monitor.

### Send data collected by Telegraf to your monitor
[Generate a Telegraf configuration file](/telegraf/latest/introduction/installation/#configuration)
and modify the InfluxDB output `url` setting to include the URL of your monitor's
InfluxDB API endpoint.

_**telegraf.conf**_
```toml
# ...

[[outputs.influxdb]]
  ## The full HTTP or UDP URL for your InfluxDB instance.
  urls = ["http://monitor-url.com:8086"]

# ...
```

### Configure Telegraf input plugins
By default, Telegraf is configured to collect the following system metrics from
the host machine:

- CPU
- Disk
- Disk IO
- Memory
- Processes
- Swap
- System (load, number of CPUs, number of users, uptime, etc.)

Use other [Telegraf input plugins](/telegraf/latest/plugins/inputs/) to collect
a variety of metrics.

#### Monitor InfluxDB performance metrics
To monitor the internal performance of InfluxDB, enable the InfluxDB input plugin
in the Telegraf configuration files used to run Telegraf **on InfluxDB instances**.
The InfluxDB input plugin pulls [InfluxDB internal metrics](/platform/monitoring/influxdata-platform/tools/measurements-internal/)
from the local InfluxDB `/debug/vars` endpoint.

```toml
# ...

[[inputs.influxdb]]
  # ...
  ## Multiple URLs from which to read InfluxDB-formatted JSON
  ## Default is "http://localhost:8086/debug/vars".
  urls = [
    "http://localhost:8086/debug/vars"
  ]

# ...
```



#### Monitor Kapacitor performance metrics
To monitor the internal performance of Kapacitor, enable the Kapacitor input plugin
in the Telegraf configuration files used to run Telegraf **on Kapacaitor instances**.
The Kapacitor input plugin pulls [Kapactor internal metrics](/platform/monitoring/influxdata-platform/tools/kapacitor-measurements/)
from the local Kapacitor `/debug/vars` endpoint.

```toml
# ...

[[inputs.influxdb]]
  # ...
  ## Multiple URLs from which to read Kapacitor-formatted JSON
  ## Default is "http://localhost:9092/kapacitor/v1/debug/vars".
  urls = [
    "http://localhost:9092/kapacitor/v1/debug/vars"
  ]

# ...
```

### (Optional) Namespace monitoring data
If Telegraf is running on your monitor instance, it will store your monitor's own
metrics in the `telegraf` database by default.
To keep your monitor's internal data separate from your other monitoring data,
configure your local Telegraf agent to write to a database other than `telegraf` using
the `database` setting under `[[outputs.influxdb]]` in your `telelgraf.conf`.

```toml
# ...

[[outputs.influxdb]]
  # ...
  ## The target database for metrics; will be created as needed.
  database = "monitor_local"

  # ...
```

### (Optional) Update primary hostnames
Telegraf's default behavior is to include a `host` tag on each data point
using the `os.hostname` provided by the host machine.
Customize the hostname by updating the `hostname` setting under the `[agent]`
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
