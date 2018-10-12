---
title: Troubleshooting out-of-memory loops
description: How to identify and troubleshoot out-of-memory (OOM) loops when using InfluxData's TICK stack.
menu:
  platform:
    name: Out-of-memory loops
    parent: Troubleshooting issues
    weight: 1
---

Out-of-memory (OOM) loops occur when a running process consumes an increasing amount
of memory until the operating system is forced to kill and restart the process.
When the process is killed, memory allocated to the process is released, but after
restarting, it continues to use more and more RAM until the cycle repeats.

In a [monitoring dashboard](/platform/monitoring/monitoring-dashboards), an OOM loop
will appear in the **Memory Usage %** metric and look similar to the following:

![OOM Loop](/img/platform/troubleshooting-oom-loop.png)

## Potential causes
The causes of OOM loops can vary widely and depend on your specific use case of
the TICK stack, but the following is the most common:

### Unoptimized queries
What is queried and how it's queried can drastically affect the memory usage and
performance of InfluxDB.

#### Selecting a measurement without specifying a time range
When selecting from a measurement without specifying a time range, InfluxDB attempts
to pull data points from the beginning of UNIX epoch time (00:00:00 UTC on 1 January 1970),
storing the returned data in memory until it's ready for output.
The operating system will eventually kill the process due to high memory usage.

###### Example of selecting a measurement without a time range
```sql
SELECT * FROM "telegraf"."autogen"."cpu"
```

## Solutions

### Identify the processes at fault
Solutions to OOM loops depend on the nature of the process consuming the memory.
The first step is to identify which process is at fault.

If using Linux machine, the `top` command streams the resource usage for running processes.
Most distributions of `top` include a `-o` option that sorts the output by a given key.
By logging into the machine affected by the OOM loop and using this command,
you can see all the running process sorted by their memory usage.

```
$ top -o %MEM

top - 20:59:34 up 525 days,  4:53,  1 user,  load average: 0.59, 0.53, 0.50
Tasks: 115 total,   3 running, 112 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.2 us,  0.0 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem:   4046872 total,  3445308 used,   601564 free,   164220 buffers
KiB Swap:        0 total,        0 used,        0 free.  2783464 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
    1 root      20   0   36952   6320   1508 S   0.0  0.2   0:25.73 init
    2 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kthreadd
    3 root      20   0       0      0      0 S   0.0  0.0   0:33.22 ksoftirqd/0
    4 root      20   0       0      0      0 S   0.0  0.0  15:05.50 kworker/0:0
    5 root       0 -20       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0H
    6 root      20   0       0      0      0 S   0.0  0.0  12:29.14 kworker/u30:0
    7 root      20   0       0      0      0 R   0.0  0.0 186:58.33 rcu_sched
    8 root      20   0       0      0      0 S   0.0  0.0 546:06.54 rcuos/0
    9 root      20   0       0      0      0 S   0.0  0.0 547:13.28 rcuos/1
   10 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcuos/2
   11 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcuos/3
```

> In order to correctly identify the culprit, run this command while memory usage is high.

<!-- -->

> `top` and other process monitoring tools vary by operating system.
> The above example may not work for your specific operating system or distribution,
> but you should have access to something similar.

Identifying the memory-consuming process will narrow the list of [potential causes](#potential-causes)
and allow you to address it in the way most appropriate to your use case.

### Identify and update unoptimized queries
The most common cause of OOM loops in InfluxDB is unoptimized queries, but it can
be challenging to identify what queries could be better optimized.
InfluxQL includes tools to help identify the "cost" of queries and gain insight
into what queries have room for optimization.

#### Estimate query cost
InfluxQL's [`EXPLAIN` statement](/influxdb/latest/query_language/spec#explain)
parses and plans a query, then outputs a summary of estimated costs.
This allows you to estimate how resource-intensive a query may be before having to
run the actual query.

###### Example EXPLAIN statement
```
> EXPLAIN SELECT * FROM "telegraf"."autogen"."cpu"

QUERY PLAN
----------
EXPRESSION: <nil>
AUXILIARY FIELDS: cpu::tag, host::tag, usage_guest::float, usage_guest_nice::float, usage_idle::float, usage_iowait::float, usage_irq::float, usage_nice::float, usage_softirq::float, usage_steal::float, usage_system::float, usage_user::float
NUMBER OF SHARDS: 12
NUMBER OF SERIES: 108
CACHED VALUES: 38250
NUMBER OF FILES: 1080
NUMBER OF BLOCKS: 10440
SIZE OF BLOCKS: 23252999
```

> `EXPLAIN` will only output what iterators are created by the query engine.
> It does not capture any other information within the query engine such as how many points will actually be processed.

#### Analyze actual query cost
InfluxQL's [`EXPLAIN ANALYZE` statement](/influxdb/latest/query_language/spec/#explain-analyze)
actually executes a query and counts the costs during runtime.

###### Example EXPLAIN ANALYZE statement
```
> EXPLAIN ANALYZE SELECT * FROM "telegraf"."autogen"."cpu" WHERE time > now() - 1d

EXPLAIN ANALYZE
---------------
.
└── select
    ├── execution_time: 104.608549ms
    ├── planning_time: 5.08487ms
    ├── total_time: 109.693419ms
    └── build_cursor
        ├── labels
        │   └── statement: SELECT cpu::tag, host::tag, usage_guest::float, usage_guest_nice::float, usage_idle::float, usage_iowait::float, usage_irq::float, usage_nice::float, usage_softirq::float, usage_steal::float, usage_system::float, usage_user::float FROM telegraf.autogen.cpu
        └── iterator_scanner
            ├── labels
            │   └── auxiliary_fields: cpu::tag, host::tag, usage_guest::float, usage_guest_nice::float, usage_idle::float, usage_iowait::float, usage_irq::float, usage_nice::float, usage_softirq::float, usage_steal::float, usage_system::float, usage_user::float
            └── create_iterator
                ├── labels
                │   ├── measurement: cpu
                │   └── shard_id: 317
                ├── cursors_ref: 0
                ├── cursors_aux: 90
                ├── cursors_cond: 0
                ├── float_blocks_decoded: 450
                ├── float_blocks_size_bytes: 960943
                ├── integer_blocks_decoded: 0
                ├── integer_blocks_size_bytes: 0
                ├── unsigned_blocks_decoded: 0
                ├── unsigned_blocks_size_bytes: 0
                ├── string_blocks_decoded: 0
                ├── string_blocks_size_bytes: 0
                ├── boolean_blocks_decoded: 0
                ├── boolean_blocks_size_bytes: 0
                └── planning_time: 4.523978ms
```
