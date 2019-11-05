---
title: InfluxDB inch tool
description: Use the InfluxDB inch tool to adjust the number of points and tag values for testing different tag cardinalities.
menu:
  influxdb_1_7:
    weight: 50
    parent: Tools
---

Simulate streaming data and measure your InfluxDB performance (with varying tag cardinalities) using the InfluxDB inch tool. To do this, complete the following tasks:

- [Install InfluxDB inch](#install-influxdb-inch)
- [Use InfluxDB inch](#use-influxdb-inch)

## Install InfluxDB inch

Run the following command in your terminal:

```bash
$ go get github.com/influxdata/inch/cmd/inch
```

## Use InfluxDB inch

1. Log into the InfluxDB instance you want to test (for InfluxDB Enterprise, log into a data node).
2. Run `inch`, specifying [`options`](#options) (metrics) to test (from the [Options](#options) list below). Example syntax:

    ```bash
    inch -v -c 8 -b 10000 -t 1,5000,1 -p 100000 -consistency any
    inch -v -c 8 -b 10000 -t 1,1,5000 -p 100000 -consistency any
    ```

### Options

Options available for `inch` listed in alphabetical order.

- `-b int`: batch size (default 5000; recommend between 5000-10000 points), for example, `-b 10000`.
- `-c int`: the number or write streams to run concurrently (default 1), for example, `-c 8`.
- `-consistency string`: the write consistency (default "any"), for example, `-consistency any`.
- `-db string`: the name of the database to write to (default "stress"), for example, `-db stress`.
- `-delay duration`: delay between writes (in seconds `s`, minutes `m`, or hours `h`), for example, `-delay 1s`.
- `-dry`: dry run (maximum write performance `perf` of **inch** on the database), for example, `-dry ?`.
- `-f int`: total fields per point (default 1), for example, `-f 1`.
- `-host string`: host (default "http://localhost:8086"), for example, `-host http://localhost:8086`.
- `-m int`: the number of measurements (default 1), for example, `-m 1`.
- `-max-errors int`: the number of errors required to terminate the process, for example, `-max-errors 5`.
- `-p int`: points per series (default 100), for example, `-p 100`.
- `-report-host string`: host to send metrics to, for example `report-host http://localhost:8086`.
- `-report-tags string`: comma separated k=v (key-value?) tags to report alongside metrics, for example, `-report-tags cpu=cpu1`.
- `-shard-duration string`: shard duration (default 7d), for example, `-shard-duration 7d`.
- `-[t string]`: tag cardinality (default "10,10,10"). Comma-separated list of integers used to calculate the tag cardinality. For example, the value "100,20,4" means that 3 tag keys should be used. The first one has 100 values, the second one has 20 values, and the last one has 4 values. **inch** inserts a series for each combination of these values so the total number of series is computed by multiplying the values: 100 * 20 * 4.
- `-target-latency duration`: if specified, **inch** attempts to adapt write delay to meet target.
- `-time duration`: time span to spread writes over.
- `-v`: verbose; prints out details as you're running the test.
