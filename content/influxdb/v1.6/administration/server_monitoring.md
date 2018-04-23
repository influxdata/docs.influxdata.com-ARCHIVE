---
title: InfluxDB server monitoring
aliases:
    - /influxdb/v1.6/administration/statistics/
    - /influxdb/v1.6/troubleshooting/statistics/
menu:
  influxdb_1_6:
    name: Server monitoring
    weight: 80
    parent: administration
---

**On this page**

* [SHOW STATS](#show-stats)
* [SHOW DIAGNOSTICS](#show-diagnostics)
* I[nternal monitoring](#internal-monitoring)
* [Useful performance metrics commands](#useful-performance-metrics-commands)
* [InfluxDB `/metrics` HTTP endpoint](#influxdb-metrics-http-endpoint)


InfluxDB can display statistical and diagnostic information about each node.
This information can be very useful for troubleshooting and performance monitoring.

## SHOW STATS
To see node statistics, execute the command `SHOW STATS`.

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

## SHOW DIAGNOSTICS
To see node diagnostics, execute the command `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

## Internal monitoring
InfluxDB also writes statistical and diagnostic information to database named `_internal`, which records metrics on the internal runtime and service performance.
The `_internal` database can be queried and manipulated like any other InfluxDB database.
Check out the [monitor service README](https://github.com/influxdb/influxdb/blob/master/monitor/README.md) and the [internal monitoring blog post](https://influxdb.com/blog/2015/09/22/monitoring_internal_show_stats.html) for more detail.

## Useful performance metrics commands

Below are a collection of commands to find useful performance metrics about your InfluxDB instance.

To find the number of points per second being written to the instance. Must have the `monitor` service enabled:
```bash
$ influx -execute 'select derivative(pointReq, 1s) from "write" where time > now() - 5m' -database '_internal' -precision 'rfc3339'
```

To find the number of writes separated by database since the beginnning of the log file:

```bash
grep 'POST' /var/log/influxdb/influxd.log | awk '{ print $10 }' | sort | uniq -c
```

Or, for systemd systems logging to journald:

```bash
journalctl -u influxdb.service | awk '/POST/ { print $10 }' | sort | uniq -c
```

### InfluxDB `/metrics` HTTP endpoint

> ***Note:*** There are no outstanding PRs for improvements to the `/metrics` endpoint, but we’ll add them to the CHANGELOG as they occur.

The InfluxDB `/metrics` endpoint is configured to produce the default Go metrics in Prometheus metrics format.


#### Example using InfluxDB `/metrics' endpoint

Below is an example of the output generated using the `/metrics` endpoint. Note that HELP is available to explain the Go statistics.

```
# HELP go_gc_duration_seconds A summary of the GC invocation durations.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 6.4134e-05
go_gc_duration_seconds{quantile="0.25"} 8.8391e-05
go_gc_duration_seconds{quantile="0.5"} 0.000131335
go_gc_duration_seconds{quantile="0.75"} 0.000169204
go_gc_duration_seconds{quantile="1"} 0.000544705
go_gc_duration_seconds_sum 0.004619405
go_gc_duration_seconds_count 27
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 29
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.10"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 1.581062048e+09
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 2.808293616e+09
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.494326e+06
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 1.1279913e+07
# HELP go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started.
# TYPE go_memstats_gc_cpu_fraction gauge
go_memstats_gc_cpu_fraction -0.00014404354379774563
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 6.0936192e+07
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 1.581062048e+09
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 3.8551552e+07
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use.
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 1.590673408e+09
# HELP go_memstats_heap_objects Number of allocated objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 1.6924595e+07
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 0
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 1.62922496e+09
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.520291233297057e+09
# HELP go_memstats_lookups_total Total number of pointer lookups.
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 397
# HELP go_memstats_mallocs_total Total number of mallocs.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 2.8204508e+07
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 13888
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 16384
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 1.4781696e+07
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 1.4893056e+07
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 2.38107752e+09
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 4.366786e+06
# HELP go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 983040
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 983040
# HELP go_memstats_sys_bytes Number of bytes obtained from system.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 1.711914744e+09
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 16
```
