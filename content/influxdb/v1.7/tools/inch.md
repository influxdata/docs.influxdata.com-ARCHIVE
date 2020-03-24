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

2. Verify `inch` is successfully installed in your `GOPATH/bin` (default on Unix `$HOME/go/bin`).

## Use InfluxDB inch

1. Log into the InfluxDB instance you want to test (for InfluxDB Enterprise, log into the data node(s) to test).
2. Run `inch`, specifying [`options`](#options) (metrics) to test (see [Options](#options) table below). For example, your syntax may look like this:

    ```bash
    inch -v -c 8 -b 10000 -t 2,5000,1 -p 100000 -consistency any
    ```

    This example starts generating a workload with:
  
    - 8 concurrent (`-c`) write streams
    - 10000 points per batch (`-b`)
    - tag cardinality (`-t`) of 10000 unique series (2x5000x1)
    - 10000 points (`-p`) per series
    - any write `-consistency`

    > **Note:** By default, `inch` writes generated test results to a database named `stress`. To change the name of the inch database, include the `-db string` option, for example, `inch -db test`.

3. To view the last 50 `inch` results, run the following query against the inch database:

    ```bash
     > select * from stress limit 50
   ```

### Options

`inch` options listed in alphabetical order.

|Option                      | Description                                                                                                    |Example                              |
|------------                | ----------                                                                                                     | -------                             |
| `-b int`                   |  batch size (default 5000; recommend between 5000-10000 points)                                                | `-b 10000`                          |
| `-c int`                   |  number of streams writing concurrently (default 1)                                                            | `-c 8`                              |
| `-consistency string`      |  write consistency (default "any"); values supported by the Influxdb API include "all", "quorum", or "one".    | `-consistency any`                  |
| `-db string`               |  name of the database to write to (default "stress")                                                           | `-db stress`                        |
| `-delay duration`          |  delay between writes (in seconds `s`, minutes `m`, or hours `h`)                                              | `-delay 1s`                         |
| `-dry`                     |  dry run (maximum write performance `perf` possible on the specified database)                                 | `-dry`                            |
| `-f int`                   |  total unique field key-value pairs per point (default 1)                                                      | `-f 1`                              |
|`-host string`              |  host (default http<nolink>://localhost:8086")                                                                 | `-host http://localhost:8086`       |
| `-m int`                   |  the number of measurements (default 1)                                                                        | `-m 1`                              |
| `-max-errors int`          |  the number of InfluxDB errors that can occur before terminating the `inch` command                            | `-max-errors 5`                     |
| `-p int`                   |  points per series (default 100)                                                                               | `-p 100`                            |
| `-report-host string`      |  host to send metrics to                                                                                       | `report-host http://localhost:8086` |
| `-report-tags string`      |  comma-separated k=v (key-value?) tags to report alongside metrics                                             | `-report-tags cpu=cpu1`             |
| `-shard-duration string`   |  shard duration (default 7d)                                                                                   |`-shard-duration 7d`                 |
| `-t [string]`&ast;&ast;    |  comma-separated integers that represent tags.                                                                 | `-t [100,20,4]`                     |
| `-target-latency duration` |  if specified, attempt to adapt write delay to meet target.                                                    |                                     |
| `-time duration`           |  time span to spread writes over.                                                                              | `-time 1h`                          |
|  `-v`                      |  verbose; prints out details as you're running the test.                                                       | `-v`                                |

&ast;&ast; `-t [string]` each integer represents a **tag key** and the number of **tag values** to generate for the key (default [10,10,10]). Multiply each integer to calculate the tag cardinality. For example, `-t [100,20,4]` has a tag cardinality of 8000 unique series.
