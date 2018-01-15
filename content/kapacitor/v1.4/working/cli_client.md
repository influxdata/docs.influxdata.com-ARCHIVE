---
title: Command Line Client

menu:
  kapacitor_1_4:
    name: Command Line - Overview
    weight: 12
    parent: work-w-kapacitor
---

# Contents
* [General Options](#general-options)
* [Core Commands](#core-commands)
* [Server Management](#server-management)
   * [Services](#services)
   * [Logging](#logging)
* [Data Sampling](#data-sampling)
* [Topics and Topic Handlers](#topics-and-topic-handlers)
* [Tasks and Task Templates](#tasks-and-task-templates)   

## Overview

Two key executables are packaged as a part of Kapacitor.  The daemon `kapacitord`
runs the server, including its HTTP interface.  The command line client
`kapacitor` leverages the HTTP interface and other resources, to provide access
to many Kapacitor features.

A general introduction to the `kapacitor` client is presented in the
[Getting Started](/kapacitor/v1.4/introduction/getting_started/) Guide.

When executed the client can take two options and one command followed by
arguments applicable to that command.  

```
kapacitor [options] [command] [args]
```

This document provides an overview of all the commands that can be undertaken with
`kapacitor` grouped by topical areas of interest.  These include general options,
core commands, server management, data sampling, working with topics and topic
handlers, and working with tasks and task templates.

## General Options

By default the client attempts HTTP communication with the server running on
localhost at port 9092.  The server can also be deployed with SSL enabled.  Two
command line options make it possible to override the default communication
settings and to use the client against any Kapacitor server.  

* `-url` &ndash; This option supplies an HTTP url string (`http(s)://host:port`) to the Kapacitor server. When not set on the command line the value of the environment variable `KAPACITOR_URL` is used.
* `-skipVerify` &ndash; This option disables SSL verification.  When not set on the command line the value of the environment variable `KAPACITOR_UNSAFE_SSL` is used.

**Example 1 &ndash; Using command line options**

```
$ kapacitor -skipVerify -url https://192.168.67.88:9093 list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
cpu_alert_topic                                    stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

## Core Commands

Core commands are those most common in a command line application or are those
which are the most commonly used.

**[help](javascript:void())** &ndash; brings up the help message.  To get more detailed help on any command type `kapacitor help <command>`.

**[version](javascript:void())** &ndash; prints the release version of the `kapacitor` client.

**[list](javascript:void())** &ndash; can be used to print out lists of different Kapacitor artifacts.  This command is presented in more detail in the following sections.

**[delete](javascript:void())** &ndash; can be used to remove different Kapacitor arrtifacts.  This command is presented in more detail in the following sections.

## Server Management

The `kapacitor` client can be used to investigate aspects of the server,
to backup its data and to work with logs.  One planned feature will be the
ability to push task definitions to other servers.

**[backup](javascript:void())** &ndash; to back up the Kapacitor database.

**Example 2 &ndash; Backup**
```
$ sudo kapacitor backup /mnt/datastore/kapacitor/bak/kapacitor-20180101.db
```
**[stats](javascript:void())** &ndash; displays statistics about the server.  Takes the following form.

```
kapacitor stats [general|ingress]
```

* `stats general` &ndash; To view values such as the server ID or hostname and to view counts such as the number of tasks and subscriptions.

   **Example 3 &ndash; General Statistics**
   ```
   $ kapacitor stats general
   ClusterID:                    ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509
   ServerID:                     90582c9c-2e25-4654-903e-0acfc48fb5da
   Host:                         localhost                     
   Tasks:                        8                             
   Enabled Tasks:                2                             
   Subscriptions:                12                            
   Version:                      1.5.0~n201711280812     
   ```

* `stats ingress` &ndash;  To view InfluxDB measurements and the number of datapoints that pass through the Kapacitor server.

   **Example 4 &ndash; Ingress Statistics**
   ```
   $ kapacitor stats ingress
    Database   Retention Policy Measurement    Points Received
    _internal  monitor          cq                        5274
    _internal  monitor          database                 52740
    _internal  monitor          httpd                     5274
    _internal  monitor          queryExecutor             5274
    _internal  monitor          runtime                   5274
    _internal  monitor          shard                   300976
    _internal  monitor          subscriber              126576
    _internal  monitor          tsm1_cache              300976
    _internal  monitor          tsm1_engine             300976
    _internal  monitor          tsm1_filestore          300976
    _internal  monitor          tsm1_wal                300976
    _internal  monitor          write                     5274
    _kapacitor autogen          edges                    26370
    _kapacitor autogen          ingress                  73817
    _kapacitor autogen          kapacitor                 2637
    _kapacitor autogen          load                      2637
    _kapacitor autogen          nodes                    23733
    _kapacitor autogen          runtime                   2637
    _kapacitor autogen          topics                   73836
    chronograf autogen          alerts                    1560
    telegraf   autogen          cpu                      47502
    telegraf   autogen          disk                     31676
    telegraf   autogen          diskio                   52800
    telegraf   autogen          kernel                    5280
    telegraf   autogen          mem                       5280
    telegraf   autogen          processes                 5280
    telegraf   autogen          swap                     10560
    telegraf   autogen          system                   15840
   ```
**[vars](javascript:void())** &ndash; Displays a wide range of variables associated with the kapacitor server.  Results are written to the console in JSON format.  To make the results more readable on a linux system, they can be piped to python `json.tool` or another JSON formatter.

**Example 5 &ndash; Kapacitor vars (partial results)**

```
$ kapacitor vars | python -m json.tool
{
    "cluster_id": "ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509",
    "cmdline": [
        "/usr/bin/kapacitord",
        "-config",
        "/etc/kapacitor/kapacitor.conf"
    ],
    "host": "localhost",
    "kapacitor": {
        "04d05f33-3811-4a19-bfea-ee260372ba54": {
            "name": "topics",
            "tags": {
                "cluster_id": "ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509",
                "host": "localhost",
                "id": "c0c740e5-0480-4b34-9cb2-c01ed45f8d70:cpu_alert:alert2",
                "server_id": "90582c9c-2e25-4654-903e-0acfc48fb5da"
            },
            "values": {
                "collected": 0
            }
        },
        "06523946-cda3-40eb-85b0-5294d6319ea5": {
            "name": "ingress",
            "tags": {
                "cluster_id": "ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509",
                "database": "_kapacitor",
                "host": "localhost",
                "measurement": "kapacitor",
                "retention_policy": "autogen",
                "server_id": "90582c9c-2e25-4654-903e-0acfc48fb5da",
                "task_master": "main"
            },
            "values": {
                "points_received": 307
            }
        },
        "074bb9e1-e617-4443-8b2f-697d60f05e54": {
            "name": "edges",
...
```

**[push](javascript:void())** &ndash; This command is reserved for a planned feature, which will allow tasks to be pushed from one Kapacitor server to another.

### Services

Services are functional modules of the Kapacitor server that handle
communications with third party applications, server configuration, and
discovery and scraping of data.  The current status of a service can be checked
with the command line tool.   

**[list service-tests](javascript:void())** &ndash; the `list` command makes it possible to list all
of the service tests currently available on the server.

**Example 6 &ndash; Listing service tests**
```
$ kapacitor list service-tests
Service Name
alerta
azure
consul
dns
ec2
file-discovery
gce
hipchat
httppost
influxdb
kubernetes
marathon
mqtt
nerve
opsgenie
pagerduty
pushover
scraper
sensu
serverset
slack
smtp
snmptrap
static-discovery
swarm
talk
telegram
triton
victorops
```

**[service-tests](javascript:void())** &ndash; The service-tests command executes one or more of the
available service tests.  Its arguments are one or more of the service names
returned by `list service-tests`.

**Example 7 &ndash; Service test execution**
```
$ kapacitor service-tests slack talk smtp
Service             Success   Message
slack               true      
talk                false     service is not enabled
smtp                false     service is not enabled
```

### Logging

**[logs](javascript:void())** &ndash; The logs command makes it possible to monitor log messages for
a service from the console, or to monitor the entire kapacitor log stream.  The
log level can also be set.  The command takes the following form.

```
kapacitor logs [service=<SERVICE_ID>] [lvl=<LEVEL>]
```

The value for `lvl` can be one of the following:

1. `debug`
1. `info`
1. `error`

Note that by default this will return messages only for the selected level.  To
view messages for the selected level and higher add a `+` character to the end
of the string.

**Example 8 &ndash; Monitoring log messages of level DEBUG and above for the http Service**

```
$ kapacitor logs service=http lvl=debug+
ts=2018-01-15T10:47:10.017+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.014048161+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e3c47c4-f9d9-11e7-85c5-000000000000 duration=3.234836ms
ts=2018-01-15T10:47:10.020+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.013091282+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e3c2267-f9d9-11e7-85c4-000000000000 duration=7.555256ms
ts=2018-01-15T10:47:10.301+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.301315013+01:00 method=POST uri=/write?consistency=&db=telegraf&precision=ns&rp=autogen protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e681d20-f9d9-11e7-85c7-000000000000 duration=306.967µs
ts=2018-01-15T10:47:10.301+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.301249656+01:00 method=POST uri=/write?consistency=&db=telegraf&precision=ns&rp=autogen protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e681a95-f9d9-11e7-85c6-000000000000 duration=387.042µs
...
```

To tail all Kapacitor logs run the command without the `service` and `level`
arguments.

**Example 9 &ndash; Tailing all Kapacitor logs**

```
$ kapacitor logs
ts=2018-01-15T10:54:07.884+01:00 lvl=info msg="created log session" service=sessions id=33a21e96-49d5-4891-aad8-0bc96099d148 content-type=
ts=2018-01-15T10:54:10.017+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:54:10.014885535+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0893527c-f9da-11e7-8672-000000000000 duration=2.870539ms
ts=2018-01-15T10:54:10.020+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:54:10.017509083+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0893b8f6-f9da-11e7-8673-000000000000 duration=2.920775ms
...
```

**[level](javascript:void())** &ndash; Sets the log level for the Kapacitor log stream written to the
log file from the Kapacitor server.  On Linux systems this file is located by
default at `/var/log/kapacitor/kapacitor.log`.  The form it takes is as follows:

```
kapacitor level <LEVEL>
```

The value for `LEVEL` can be one of the following:

1. `debug`
1. `info`
1. `error`

To see the command take effect tail the log file (e.g. `$sudo tail -f -n 128 /var/log/kapacitor/kapacitor.log`)
and then set the log level to error.

**Example 10 &ndash; Setting the log level to ERROR**

```
kapacitor level error
```

The stream to the Kapacitor log should appear to stop.  To activate it again,
reset the log level to `debug`.

**Example 11 &ndash; Setting the log level to DEBUG**

```
kapacitor level debug
```

The tailed stream should become active again.  

**[watch](javascript:void())** &ndash; This command allows logs associated with a task to be followed. Note that this is different from the `logs` command, which allows tracking logs associated with a service. The form it takes is as follows:

```
kapacitor watch <TASK_ID> [<TAGS> ...]
```

**Example 12 &ndash; Watching the cpu_alert tasks**

```
$ kapacitor watch cpu_alert
ts=2018-01-15T11:31:30.301+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=CRITICAL id=cpu:nil event_message="cpu:nil is CRITICAL" data="&{cpu map[cpu:cpu6 host:algonquin] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 0 0 0 0 0 0 0 100.00000000000199]]}"
ts=2018-01-15T11:31:30.315+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=OK id=cpu:nil event_message="cpu:nil is OK" data="&{cpu map[cpu:cpu7 host:algonquin] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 99.89989989990681 0 0 0 0 0 0 0.1001001001001535]]}"
ts=2018-01-15T11:31:30.325+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=CRITICAL id=cpu:nil event_message="cpu:nil is CRITICAL" data="&{cpu map[host:algonquin cpu:cpu6] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 0 0 0 0 0 0 0 100.00000000000199]]}"
ts=2018-01-15T11:31:30.335+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=OK id=cpu:nil event_message="cpu:nil is OK" data="&{cpu map[host:algonquin cpu:cpu7] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 99.89989989990681 0 0 0 0 0 0 0.1001001001001535]]}"
...
```

## Data Sampling

At times it can be useful to record a sample of data or a query to troubleshoot
tasks before they are enabled.  The Kapacitor command line client includes a
number of useful commands for managing data sampling.

**[record](javascript:void())** &ndash; This command can be used to record
either a snapshot of data or the result of an InfluxDB query into the Kapacitor
database.  The data snapshot is later accessible using its `recording-id`.
Three types of recording are available: `batch`, `stream` and `query`.

* `record batch` &ndash; Records the result of an InfluxDB query used in a batch type task. It takes the following form:

```
kapacitor record batch -no-wait (-past <WINDOW_IN_PAST> | -start <START_TIME> -stop <STOP_TIME> ) [-recording-id <ID> ] -task <TASK_ID>  
```

**Example 13 &ndash; Record Batch**

```
$ kapacitor record batch -past 5m -recording-id BlueJaySilverTree -task batch_load_test
BlueJaySilverTree
```

* `record stream` &ndash; Records a live stream of data. It takes the following form.

```
kapacitor record stream -duration <DURATION> (-no-wait) (-recording-id <ID> ) -task <TASK_ID>
```

Note that the `stream` option will run until the time duration has expired, before
returning the recording ID in the console.  

**Example 14 &ndash; Record Stream**

```
$ kapacitor record stream -duration 1m -task cpu_alert
4e0f09c5-1426-4778-8f9b-c4a88f5c2b66
```

* `record query` &ndash; Records an InfluxDB query.  It takes the following form:

```
kapacitor record query (-cluster <INFLUXDB_CLUSTER_NAME> ) (-no-wait) -query <QUERY> (-recording-id <RECORDING_ID>) -type <stream|batch>
```

**Example 15 &ndash; Record Query**

```
$ kapacitor record query -query 'SELECT cpu, usage_idle from "telegraf"."autogen"."cpu" where time > now() - 5m' -type stream  
0970bcb5-685c-48cc-9a92-741633633f1f
```

**[replay](javascript:void())** &ndash; This command can be used to replay a recording to a task to verify how the task will behave.  It takes the following form:

```
kapacitor replay (-no-wait) (-real-clock) (-rec-time) -recording <ID> (-replay-id <REPLAY_ID>) -task <TASK_ID>
```

**Example 16 &ndash; Replaying a recording**

```
$ kapacitor replay -recording 4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 -task cpu_alert
bbe8567c-a642-4da9-83ef-2a7d32ad5eb1
```

**[replay-live](javascript:void())** &ndash; This command allows for actual data to be replayed against tasks, to verify task behavior.  It can be executed against either a `batch` or a `query`.

* `replay-live query` &ndash;
* `replay-live batch` &ndash;

* **[list](javascript:void())**
   * recordings
   * replays
* **[delete](javascript:void())**
   * recordings
   * replays

## Topics and Topic Handlers

(n.b. topics are created by the topic node)

TBD

* **[define-topic-handler](javascript:void())**
* **[delete](javascript:void())**
   * topics
   * topic-handlers  
* **[list](javascript:void())**
   * topics
   * topic-handlers
* **[show-topic-handler](javascript:void())**
* **[show-topic](javascript:void())**    

## Tasks and Task Templates

TBD

* **[define](javascript:void())**
* **[define-template](javascript:void())**
* **[enable](javascript:void())**
* **[disable](javascript:void())**
* **[reload](javascript:void())**
* **[list](javascript:void())**
   * tasks
   * templates
* **[delete](javascript:void())**
   * tasks
   * templates
