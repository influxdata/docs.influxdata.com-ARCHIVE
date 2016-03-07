---
title: Getting Started with Telegraf

menu:
  telegraf_010:
    name: Getting Started
    weight: 10
    parent: introduction
---

## Getting Started with Telegraf
Telegraf is an agent written in Go for collecting metrics and writing them into InfluxDB or other possible outputs.

Returning to our [sample configuration](/telegraf/v0.10/introduction/configuration/#example), we show what the `cpu` and `mem` data look like in InfluxDB below.
Note that we used the default input and output configuration settings to get these data.

* List all [measurements](https://docs.influxdata.com/influxdb/v0.10/concepts/glossary/#measurement) in the `telegraf` [database](https://docs.influxdata.com/influxdb/v0.10/concepts/glossary/#database):

```bash
> SHOW MEASUREMENTS
name: measurements
------------------
name
cpu
mem
```

* List all [field keys](https://docs.influxdata.com/influxdb/v0.10/concepts/glossary/#field-key) by measurement:

```bash
> SHOW FIELD KEYS
name: cpu
---------
fieldKey
usage_guest
usage_guest_nice
usage_idle
usage_iowait
usage_irq
usage_nice
usage_softirq
usage_steal
usage_system
usage_user

name: mem
---------
fieldKey
available
available_percent
buffered
cached
free
total
used
used_percent
```

* Select a sample of the data in the [field](https://docs.influxdata.com/influxdb/v0.10/concepts/glossary/#field) `usage_idle` in the measurement `cpu_usage_idle`:

```bash
> SELECT usage_idle FROM cpu WHERE cpu = 'cpu-total' LIMIT 5
name: cpu
---------
time                                   usage_idle
2016-01-16T00:03:00Z     97.56189047261816
2016-01-16T00:03:10Z     97.76305923519121
2016-01-16T00:03:20Z     97.32533433320835
2016-01-16T00:03:30Z     95.68857785553611
2016-01-16T00:03:40Z     98.63715928982245
```

Notice that the timestamps occur at rounded ten second intervals (that is, `:00`, `:10`, `:20`, and so on) - this is a configurable setting.

That's it! You now have the foundation for using Telegraf to collect metrics and write them to your output of choice.

