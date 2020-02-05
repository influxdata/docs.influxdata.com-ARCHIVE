---
title: Kapacitor frequently asked questions

menu:
  kapacitor_1_5:
    name: Frequently asked questions (FAQ)
    weight: 10
    parent: Troubleshooting
---

This page addresses frequent sources of confusion or important things to know related to Kapacitor.
Where applicable, it links to outstanding issues on Github.

**Administration**  

- [Is the alert state and alert data lost happen updating a script?](#is-the-alert-state-and-alert-data-lost-happen-when-updating-a-script)  
- [How do I verify that Kapacitor is receiving data from InfluxDB?](#how-do-i-verify-that-kapacitor-is-receiving-data-from-influxdb)

**TICKscript**  

- [Batches work but streams do not. Why?](#batches-work-but-streams-do-not-why)  
- [Is there a limit on the number of scripts Kapacitor can handle?](#is-there-a-limit-on-the-number-of-scripts-kapacitor-can-handle)
- [What causes unexpected or additional values with same timestamp??](#what-causes-unexpected-or-additional-values-with-same-timestamp)

**Performance**  

- [Do you get better performance with running one complex script or having multiple scripts running in parallel?](#do-you-get-better-performance-with-running-one-complex-script-or-having-multiple-scripts-running-in-parallel)  
- [Do template-based scripts use less resources or are they just an ease-of-use tool?](#do-template-based-scripts-use-less-resources-r-are-they-just-an-ease-of-use-tool)  
- [How does Kapacitor handle high load?](#how-does-kapacitor-handle-high-load)
- [How can I optimize Kapacitor tasks?](#how-can-i-optimize-kapacitor-tasks)

## Administration

### Is the alert state and alert data lost happen when updating a script?

Kapacitor will remember the last level of an alert, but other state-like data, such as data buffered in a window, will be lost.

### How do I verify that Kapacitor is receiving data from InfluxDB?

There are a few ways to determine whether or not Kapacitor is receiving data from InfluxDB.
The [`kapacitor stats ingress`](/kapacitor/v1.5/working/cli_client/#stats-ingress) command
outputs InfluxDB measurements stored in the Kapacitor database as well as the number
of data points that pass through the Kapacitor server.

```bash
$ kapacitor stats ingress
Database   Retention Policy Measurement    Points Received
_internal  monitor          cq                        5274
_internal  monitor          database                 52740
_internal  monitor          httpd                     5274
_internal  monitor          queryExecutor             5274
_internal  monitor          runtime                   5274
_internal  monitor          shard                   300976
# ...
```

You can also use Kapacitor's [`/debug/vars` API endpoint](/kapacitor/v1.5/working/api/#debug-vars-http-endpoint)
to view and monitor ingest rates.
Using this endpoint and [Telegraf's Kapacitor input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kapacitor),
you can create visualizations to monitor Kapacitor ingest rates.
Below are example queries that use Kapacitor data written into InfluxDB using
Telegraf's Kapacitor input plugin:

_**Kapacitor ingest rate (points/sec)**_
```sql
SELECT sum(points_received_rate) FROM (SELECT non_negative_derivative(first("points_received"),1s) as points_received_rate FROM "_kapacitor"."autogen"."ingress" WHERE time > :dashboardTime: GROUP BY "database", "retention_policy", "measurement", time(1m)) WHERE time > :dashboardTime: GROUP BY time(1m)
```

_**Kapacitor ingest by task (points/sec)**_
```sql
SELECT non_negative_derivative("collected",1s) FROM "_kapacitor"."autogen"."edges" WHERE time > now() - 15m AND ("parent"='stream' OR "parent"='batch') GROUP BY task
```

## TICKscript

### Batches work but streams do not. Why?

Make sure port `9092` is open to inbound connections.
Streams are a `PUSH`'d to port `9092` so it must be allowed through the firewall.

### Is there a limit on the number of scripts Kapacitor can handle?

There is no software limit, but it will be limited by available server resources.

### What causes unexpected or additional values with same timestamp?

If data is ingested at irregular intervals and you see unexpected results with the same timestamp, use the [`log node`](/kapacitor/v1.5/nodes/log_node) when ingesting data in your TICKscript to debug issues. This surfaces issues, for example, duplicate data hidden by httpOut.

## Performance

### Do you get better performance with running one complex script or having multiple scripts running in parallel?

Taking things to the extreme, best-case is one task that consumes all the data and does all the work since there is added overhead when managing multiple tasks.
However, significant effort has gone into reducing the overhead of each task.
Use tasks in a way that makes logical sense for your project and organization.
If you run into performance issues with multiple tasks, [let us know](https://github.com/influxdata/kapacitor/issues/new).
_**As a last resort**_, merge tasks into more complex tasks.

### Do template-based scripts use less resources or are they just an ease-of-use tool?

Templates are just an ease-of-use tool and make no difference in regards to performance.

### How does Kapacitor handle high load?

If Kapacitor is unable to ingest and process incoming data before it receives new data,
Kapacitor queues incoming data in memory and processes it when able.
Memory requirements of queued data depend on the ingest rate and shape of the incoming data.
Once Kapacitor is able to process all queued data, it slowly releases memory
as the internal garbage collector reclaims memory.

Extended periods of high data ingestion can overwhelm available system resources
forcing the operating system to stop the `kapacitord` process.
The primary means for avoiding this issue are:

- Ensure your hardware provides enough system resources to handle additional load.
- Optimize your Kapacitor tasks. _[See below](#how-can-i-optimize-kapacitor-tasks)_.

{{% note %}}
As Kapacitor processes data in the queue, it may consume other system resources such as
CPU, disk and network IO, etc., which will affect the overall performance of your Kapacitor server.
{{% /note %}}

### How can I optimize Kapacitor tasks?

As you optimize Kapacitor tasks, consider the following:

#### "Batch" incoming data

[`batch`](/kapacitor/v1.5/nodes/batch_node/) queries data from InfluxDB in batches.
As long as Kapacitor is able to process a batch before the next batch is queried,
it won't need to queue anything.

[`stream`](/kapacitor/v1.5/nodes/stream_node/) mirrors all InfluxDB writes to
Kapacitor in real time and is more prone to queueing.
If using `stream`, segment incoming data into time-based batches using
[`window`](/kapacitor/v1.5/nodes/window_node/).
