---
title: InfluxDB inch tool
description: Use the InfluxDB inch tool to test InfluxDB performance. Adjust the number of points and tag values to test ingesting different tag cardinalities.
menu:
  influxdb_1_7:
    weight: 50
    parent: Tools
---

Use the InfluxDB inch tool to simulate streaming data to InfluxDB and measure your performance (for example, the impact of cardinality on write throughput). To do this, complete the following tasks:

- [Install InfluxDB inch](#install-influxdb-inch)
- [Use InfluxDB inch](#use-influxdb-inch)

## Install InfluxDB inch

1. To install `inch`, run the following command in your terminal:

    ```bash
    $ go get github.com/influxdata/inch/cmd/inch
    ```

2. Verify `inch` is successfully installed in your `GOPATH/bin` (default on Unix `$HOME/go/bin`; default on Windows `%USERPROFILE%\go\bin`).

## Use InfluxDB inch

1. Log into the InfluxDB instance you want to test (for InfluxDB Enterprise, log into the data nodes to test).
2. Run `inch`, specifying [`options`](#options) (metrics) to test (see [Options](#options) table below). For example, your syntax may look like this:

    ```bash
    inch -v -c 8 -b 10000 -t 2,5000,1 -p 100000 -consistency any
    ```
  This example starts generating a workload with:
  - 8 concurrent write streams
  - batch size of 10000 points
  - tag cardinality of 10000 unique series (2x5000x1=10000)
  - 10000 points per series
  - any write consistency

3. By default, `inch` writes generated test results to a database named `stress`. To view the last 50 results of data generated from `inch`, run the following query:

    ```bash
        > select * from stress limit 50
    ```

### Options

`inch` options listed in alphabetical order.

|Option                      | Description                                                                                                  | Example                             |
|------------                | ----------                                                                                                   | -------                             |
| `-b int`                   |  batch size (default 5000; recommend between 5000-10000 points)                                             | `-b 10000`                          |
| `-c int`                   |  number of streams writing concurrently (default 1)                                                 | `-c 8`                              |
| `-consistency string`      |  write consistency (default "any")                                                                        | `-consistency any`                  |
| `-db string`               |  name of the database to write to (default "stress")                                                      | `-db stress`                        |
| `-delay duration`          |  delay between writes (in seconds `s`, minutes `m`, or hours `h`)                                              | `-delay 1s`                         |
| `-dry`                     |  dry run (maximum write performance `perf` on the database)                                         | `-dry ?`                            |
| `-f int`                   |  total fields per point (default 1)                                                                              | `-f 1`                              |
|`-host string`              |  host (default "http://localhost:8086")                                                                          | `-host http://localhost:8086`       |
| `-m int`                   |  the number of measurements (default 1)                                                                            | `-m 1`                              |
| `-max-errors int`          |  the number of errors required to terminate the process                                                            | `-max-errors 5`                     |
| `-p int`                   |  points per series (default 100)                                                                                   | `-p 100`                            |
| `-report-host string`      |  host to send metrics to                                                                                           | `report-host http://localhost:8086` |
| `-report-tags string`      |  comma separated k=v (key-value?) tags to report alongside metrics                                                 | `-report-tags cpu=cpu1`|
| `-shard-duration string`   |  shard duration (default 7d)                                                                                       |`-shard-duration 7d`   |
| `-t [string]`              |  Comma-separated list of integers (tags) and how many unique values to generate for each tag (default [10,10,10]). Multiply each integer to calculate the tag cardinality 10x10x10.     |`-t [100,20,4` |
| `-target-latency duration` |  if specified, **inch** attempts to adapt write delay to meet target. | |
| `-time duration`           |  time span to spread writes over.| |
|  `-v`                      |  verbose; prints out details as you're running the test.|  |
