---
title: Use the SHOW DIAGNOSTICS statement to monitoring InfluxDB diagnostic information
description: Use the SHOW DIAGNOSTICS statement to monitor InfluxDB instances.
aliases:
  - /platform/monitoring/tools/show-diagnostics/
menu:
  platform:
    name: SHOW DIAGNOSTICS
    parent: Other monitoring tools
    weight: 3
---

Diagnostic information includes mostly information about your InfluxDB server that is not necessarily numerical in format. This diagnostic information is not stored in the [`_internal`](/platform/monitoring/influxdata-platform/tools/measurements-internal/) database.

To see InfluxDB server or node diagnostic information, you can use the [`SHOW DIAGNOSTICS`](/influxdb/latest/query_language/spec#show-diagnostics) statement. This statement returns InfluxDB instance information, including build details, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics. This information is particularly useful to InfluxData Support, so be sure to include the output of this query anytime you file a support ticket or GitHub issue.


## `SHOW DIAGNOSTICS` measurement details

The `SHOW DIAGNOSTICS` statement returns the following information.

#### build
- Branch
- Build Time
- Commit

#### config
- bind-address
- reporting-disabled

#### config-coordinator
- log-queries-after
- max-concurrent-queries
- max-select-buckets
- max-select-point
- max-select-series
- query-timeout
- write-timeout

#### config-cqs
- enabled
- query-stats-enabled
- run-interval

#### config-data
- cache-max-memory-size
- cache-snapshot-memory-size
- cache-snapshot-write-cold-duration
- compact-full-write-cold-duration
- dir                          
- max-concurrent-compactions
- max-series-per-database
- max-values-per-tag
- wal-dir
- wal-fsync-delay


#### config-httpd
- access-log-path
- bind-address
- enabled
- https-enabled
- max-connection-limit
- max-row-limit

#### config-meta
- dir

#### config-monitor
- store-database
- store-enabled
- store-interval

#### config-precreator
- advance-period
- check-interval
- enabled

#### config-retention
- check-interval
- enabled

#### config-subscriber
- enabled
- http-timeout
- write-buffer-size
- write-concurrency

#### network
- hostname

#### runtime
- GOARCH
- GOMAXPROCS
- GOOS
- version

#### system
- PID currentTime
- started
- uptime


## Example of `SHOW DIAGNOSTICS` output

Here is an example of the output returned when running the `SHOW DIAGNOSTICS` statement on an InfluxDB OSS server.

```
> show diagnostics
name: build
Branch Build Time Commit                                   Version
------ ---------- ------                                   -------
master            389de31c961831de0a9f4172173337d4a6193909 v1.6.3

name: config
bind-address   reporting-disabled
------------   ------------------
127.0.0.1:8088 false

name: config-coordinator
log-queries-after max-concurrent-queries max-select-buckets max-select-point max-select-series query-timeout write-timeout
----------------- ---------------------- ------------------ ---------------- ----------------- ------------- -------------
0s                0                      0                  0                0                 0s            10s

name: config-cqs
enabled query-stats-enabled run-interval
------- ------------------- ------------
true    false               1s

name: config-data
cache-max-memory-size cache-snapshot-memory-size cache-snapshot-write-cold-duration compact-full-write-cold-duration dir                          max-concurrent-compactions max-series-per-database max-values-per-tag wal-dir                     wal-fsync-delay
--------------------- -------------------------- ---------------------------------- -------------------------------- ---                          -------------------------- ----------------------- ------------------ -------                     ---------------
1073741824            26214400                   10m0s                              4h0m0s                           /usr/local/var/influxdb/data 0                          1000000                 100000             /usr/local/var/influxdb/wal 0s

name: config-httpd
access-log-path bind-address enabled https-enabled max-connection-limit max-row-limit
--------------- ------------ ------- ------------- -------------------- -------------
                :8086        true    false         0                    0

name: config-meta
dir
---
/usr/local/var/influxdb/meta

name: config-monitor
store-database store-enabled store-interval
-------------- ------------- --------------
_internal      true          10s

name: config-precreator
advance-period check-interval enabled
-------------- -------------- -------
30m0s          10m0s          true

name: config-retention
check-interval enabled
-------------- -------
30m0s          true

name: config-subscriber
enabled http-timeout write-buffer-size write-concurrency
------- ------------ ----------------- -----------------
true    30s          1000              40

name: network
hostname
--------
influxdb-1.local

name: runtime
GOARCH GOMAXPROCS GOOS   version
------ ---------- ----   -------
amd64  8          darwin go1.11

name: system
PID currentTime                 started                     uptime
--- -----------                 -------                     ------
940 2018-10-15T15:07:47.435739Z 2018-10-15T06:03:34.002126Z 9h4m13.433613s
```
