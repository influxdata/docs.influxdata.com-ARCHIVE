---
title: Kapacitor command line client
description: Overview of the Kapacitor command line client, commands, data sampling, and working with topics and tasks
menu:
  kapacitor_1_4:
    name: Kapacitor command line client
    weight: 30
    parent: Working with Kapacitor
---

# Contents
* [General options](#general-options)
* [Core commands](#core-commands)
* [Server management](#server-management)
   * [Services](#services)
   * [Logging](#logging)
* [Data sampling](#data-sampling)
* [Topics and topic handlers](#topics-and-topic-handlers)
* [Tasks and task templates](#tasks-and-task-templates)

## Overview

Two key executables are packaged as a part of Kapacitor.  The daemon `kapacitord`
runs the server, including its HTTP interface.  The command line client
`kapacitor` leverages the HTTP interface and other resources, to provide access
to many Kapacitor features.

A general introduction to the `kapacitor` client is presented in the
[Getting started with Kapacitor](/kapacitor/v1.4/introduction/getting-started/).

When executed the client can take two options and one command followed by
arguments applicable to that command.

```
kapacitor [options] [command] [args]
```

This document provides an overview of all the commands that can be undertaken with
`kapacitor` grouped by topical areas of interest.  These include general options,
core commands, server management, data sampling, working with topics and topic
handlers, and working with tasks and task templates.

## General options

By default the client attempts HTTP communication with the server running on
localhost at port 9092.  The server can also be deployed with SSL enabled.  Two
command line options make it possible to override the default communication
settings and to use the client against any Kapacitor server.

* `-url` This option supplies an HTTP url string (`http(s)://host:port`) to the Kapacitor server. When not set on the command line the value of the environment variable `KAPACITOR_URL` is used.
* `-skipVerify`  This option disables SSL verification.  When not set on the command line the value of the environment variable `KAPACITOR_UNSAFE_SSL` is used.

**Example 1: Using command line options**

```
$ kapacitor -skipVerify -url https://192.168.67.88:9092 list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
cpu_alert_topic                                    stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

## Core commands

Core commands are those most common in a command line application or are those
which are the most commonly used.

**`help`** This command brings up the help message.  To get more detailed help on any command type `kapacitor help <command>`.

**`version` Use this command to print out the release version of the `kapacitor` client.

**`list`**  This command can be used to print out lists of different Kapacitor artifacts.

**`delete`**  This command can be used to remove different Kapacitor artifacts.

The commands `list` and `delete` are presented in more detail in the following sections.

## Server management

The `kapacitor` client can be used to investigate aspects of the server,
to backup its data and to work with logs.  One planned feature will be the
ability to push task definitions to other servers.

**`backup`**  Use this command to back up the Kapacitor database.  It takes the following form:

```
kapacitor backup [PATH_TO_BACKUP_FILE]
```

**Example 2:  Backup**
```
$ kapacitor backup ~/bak/kapacitor-20180101.db
$
```

Note that this command will succeed silently.  No status message is returned to
the console.  Errors such as insufficient permissions, or non-existent directories
will be reported. To verify the results check the file system.

**`stats`**  This command displays statistics about the server.  Takes the following form.

```
kapacitor stats [general|ingress]
```

* **`stats general`**  Use this command to view values such as the server ID or hostname and to view counts such as the number of tasks and subscriptions used by Kapacitor.

   **Example 3: General statistics**
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

* **`stats ingress`**   Use this command to view InfluxDB measurements and the number of data points that pass through the Kapacitor server.

   **Example 4: Ingress statistics**
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
**`vars`**  This command displays a wide range of variables associated with the kapacitor server.  Results are written to the console in JSON format.  To make the results more readable on a linux system, they can be piped to python `json.tool` or another JSON formatter.

**Example 5: Kapacitor vars (partial results)**

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

**`push`**  This command is reserved for a planned feature, which will allow tasks to be pushed from one Kapacitor server to another.

### Services

Services are functional modules of the Kapacitor server that handle
communications with third party applications, server configuration, and
discovery and scraping of data.  For more information about services see the
[Configuration](/kapacitor/v1.4/administration/configuration/) document. The
current status of a service can be checked with the command line tool.

**`list service-tests`**  The universal `list` command makes it possible to list all
of the service tests currently available on the server.  It takes the following form:

```
kapacitor list service-tests (ID | Pattern)
```

To list all services starting with the letter `a`, the pattern `a*` could be used.

**Example 6: Listing service tests**
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

**`service-tests`**  The `service-tests` command executes one or more of the
available service tests.  It takes the following form:

```
kapacitor service-tests [ <SERVICE_NAME>... | <PATTERN> ]
```

`PATTERN` can be a grep-like pattern.  For example, to run tests of all services
beginning with the letter 'a' use the string 'a*'.

**Example 7: Service test execution**
```
$ kapacitor service-tests slack talk smtp
Service             Success   Message
slack               true
talk                false     service is not enabled
smtp                false     service is not enabled
```

Combining the `list service-tests` and `service-tests` commands, it is possible
on a Linux system to test all services with the command: `kapacitor list service-tests |xargs kapacitor service-tests`

### Logging

Kapacitor records a wealth of information about itself, its services and its tasks.
Information about configuring logging is available in the [Configuration](/kapacitor/v1.4/administration/configuration/#logging)
document.

**`logs`**  The `logs` command makes it possible to monitor log messages for
a service from the console, or to monitor the entire kapacitor log stream.  The
log level can also be set.  The command takes the following form:

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

**Example 8: Monitoring log messages of level DEBUG and above for the HTTP service**

```
$ kapacitor logs service=http lvl=debug+
ts=2018-01-15T10:47:10.017+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.014048161+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e3c47c4-f9d9-11e7-85c5-000000000000 duration=3.234836ms
ts=2018-01-15T10:47:10.020+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.013091282+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e3c2267-f9d9-11e7-85c4-000000000000 duration=7.555256ms
ts=2018-01-15T10:47:10.301+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.301315013+01:00 method=POST uri=/write?consistency=&db=telegraf&precision=ns&rp=autogen protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e681d20-f9d9-11e7-85c7-000000000000 duration=306.967µs
ts=2018-01-15T10:47:10.301+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:47:10.301249656+01:00 method=POST uri=/write?consistency=&db=telegraf&precision=ns&rp=autogen protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0e681a95-f9d9-11e7-85c6-000000000000 duration=387.042µs
...
```

To tail all Kapacitor logs, run the command without the `service` and `level`
arguments.

**Example 9:  Tailing all Kapacitor logs**

```
$ kapacitor logs
ts=2018-01-15T10:54:07.884+01:00 lvl=info msg="created log session" service=sessions id=33a21e96-49d5-4891-aad8-0bc96099d148 content-type=
ts=2018-01-15T10:54:10.017+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:54:10.014885535+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0893527c-f9da-11e7-8672-000000000000 duration=2.870539ms
ts=2018-01-15T10:54:10.020+01:00 lvl=info msg="http request" service=http host=127.0.0.1 username=- start=2018-01-15T10:54:10.017509083+01:00 method=POST uri=/write?consistency=&db=_internal&precision=ns&rp=monitor protocol=HTTP/1.1 status=204 referer=- user-agent=InfluxDBClient request-id=0893b8f6-f9da-11e7-8673-000000000000 duration=2.920775ms
...
```

**`level`**  This command sets the log level for the Kapacitor log stream written to the log file from the Kapacitor server.
On Linux systems this file is located by default at `/var/log/kapacitor/kapacitor.log`.
The form it takes is as follows:

```
kapacitor level <LEVEL>
```

The value for `LEVEL` can be one of the following:

1. `debug`
1. `info`
1. `error`

To see the command take effect, tail the log file (e.g., `$sudo tail -f -n 128 /var/log/kapacitor/kapacitor.log`) and then set the log level to error.

**Example 10: Setting the log level to ERROR**

```
kapacitor level error
```

The stream to the Kapacitor log should appear to stop.  To activate it again,
reset the log level to `debug`.

**Example 11: Setting the log level to DEBUG**

```
kapacitor level debug
```

The tailed stream should become active again.

**`watch`**  This command allows logs associated with a task to be followed. Note that this is different from the `logs` command, which allows tracking logs associated with a service. The form it takes is as follows:

```
kapacitor watch <TASK_ID> [<TAGS> ...]
```

**Example 12: Watching the `cpu_alert` tasks**

```
$ kapacitor watch cpu_alert
ts=2018-01-15T11:31:30.301+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=CRITICAL id=cpu:nil event_message="cpu:nil is CRITICAL" data="&{cpu map[cpu:cpu6 host:algonquin] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 0 0 0 0 0 0 0 100.00000000000199]]}"
ts=2018-01-15T11:31:30.315+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=OK id=cpu:nil event_message="cpu:nil is OK" data="&{cpu map[cpu:cpu7 host:algonquin] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 99.89989989990681 0 0 0 0 0 0 0.1001001001001535]]}"
ts=2018-01-15T11:31:30.325+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=CRITICAL id=cpu:nil event_message="cpu:nil is CRITICAL" data="&{cpu map[host:algonquin cpu:cpu6] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 0 0 0 0 0 0 0 100.00000000000199]]}"
ts=2018-01-15T11:31:30.335+01:00 lvl=debug msg="alert triggered" service=kapacitor task_master=main task=cpu_alert node=alert2 level=OK id=cpu:nil event_message="cpu:nil is OK" data="&{cpu map[host:algonquin cpu:cpu7] [time usage_guest usage_guest_nice usage_idle usage_iowait usage_irq usage_nice usage_softirq usage_steal usage_system usage_user] [[2018-01-15 10:31:30 +0000 UTC 0 0 99.89989989990681 0 0 0 0 0 0 0.1001001001001535]]}"
...
```

## Data sampling

At times it can be useful to record a sample of data or a query to troubleshoot
tasks before they are enabled.  The Kapacitor command line client includes a
number of useful commands for managing data sampling.

**`record`**  This command can be used to record
either a snapshot of data or the result of an InfluxDB query into the Kapacitor
database.  The data snapshot is later accessible using its `recording-id`.
Three types of recording are available: `batch`, `stream` and `query`.

* **`record batch`**   Records the result of an InfluxDB query used in a batch type task. It takes the following form:

```
kapacitor record batch (-no-wait) [-past <WINDOW_IN_PAST> | -start <START_TIME> -stop <STOP_TIME>] [-recording-id <ID>] -task <TASK_ID>
```

This command requires either a time value for a window of past data from `now`,
defined by the argument `-past` or a past interval defined by the arguments `-start`
and `-stop`.  A `-recording-id` is optional and will be generated if not provided.
The `-task` argument with its `TASK_ID` is also required.  The optional Boolean
argument `-no-wait` will spawn the replay into a separate process and exit leaving
it to run in the background.


**Example 13: Record batch**

```
$ kapacitor record batch -past 5m -recording-id BlueJaySilverTree -task batch_load_test
BlueJaySilverTree
```

* **`record stream`**  Records a live stream of data. It takes the following form.

```
kapacitor record stream -duration <DURATION> (-no-wait) (-recording-id <ID> ) -task <TASK_ID>
```

This command requires a `-duration` value to determine how long the recording
will run.  The `-task` argument identifying the target task is also required. A
`-recording-id` value is optional and when not provided will be generated. The optional
Boolean argument `-no-wait` will spawn the replay into a separate process and exit
leaving it to run in the background.

Note that this command in combination with the `stream` option will run until
the time duration has expired.  It returns the recording ID in the console.

**Example 14: Record stream**

```
$ kapacitor record stream -duration 1m -task cpu_alert
4e0f09c5-1426-4778-8f9b-c4a88f5c2b66
```

* **`record query`**  Records an InfluxDB query.  It takes the following form:

```
kapacitor record query (-cluster <INFLUXDB_CLUSTER_NAME> ) (-no-wait) -query <QUERY> (-recording-id <RECORDING_ID>) -type <stream|batch>
```

This command requires an InfluxDB query provided through the `-query` argument.
It also requires a `-type` value of either `batch` or `stream`.  A `-recording-id`
can also be provided and when not provided will be generated. The optional Boolean
argument `-no-wait` will spawn the replay into a separate process and exit leaving
it to run in the background.

**Example 15: Record query**

```
$ kapacitor record query -query 'SELECT cpu, usage_idle from "telegraf"."autogen"."cpu" where time > now() - 5m' -type stream
0970bcb5-685c-48cc-9a92-741633633f1f
```

**`replay`**  This command can be used to replay a recording to a task to verify how the task will behave.  It takes the following form:

```
kapacitor replay (-no-wait) (-real-clock) (-rec-time) -recording <ID> (-replay-id <REPLAY_ID>) -task <TASK_ID>
```

This command requires a recording ID provided through the argument `-recording`
and a task ID provided through the argument `-task`.  The optional Boolean argument
`-real-clock` will toggle replaying the data according to the intervals between
the timestamps contained within.  The optional Boolean argument `-rec-time` will
toggle using the actual recorded times instead of present times.  Use of present
times is the default behavior.  An optional `-replay-id` can also be provided and
when not provided will be generated. The optional Boolean argument `-no-wait` will
spawn the replay into a separate process and exit leaving it to run in the background.

**Example 16: Replaying a recording**

```
$ kapacitor replay -recording 4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 -task cpu_alert
bbe8567c-a642-4da9-83ef-2a7d32ad5eb1
```

**`replay-live`**  This command allows for data to be played on the fly against tasks, to verify task behavior.  It can be executed against either a `batch` or a `query`.  Kapacitor neither saves nor records the data in its database.

* **`replay-live query`**  With the query argument the replay executes an InfluxDB query against the task.  The query should include the database, retention policy and measurement string. It takes the following form:

```
kapacitor replay-live query (-cluster <CLUSTER_URL>) (-no-wait) -query <QUERY> (-real-clock) (-rec-time) (-replay-id <REPLAY_ID>) -task <TASK_ID>
```

This command requires an InfluxDB query provided through the `-query` argument.
It also requires a task identified by the argument `-task`.  A `-replay-id`
can also be provided and when not provided will be generated. The optional Boolean
argument `-no-wait` will spawn the replay into a separate process and exit leaving
it to run in the background. The optional Boolean argument
`-real-clock` will toggle replaying the data according to the intervals between
the timestamps contained within.  The optional Boolean argument `-rec-time` will
toggle using the actual recorded times instead of present times.  Use of present
times is the default behavior.


**Example 17: Replay live query**

```
$ kapacitor replay-live query -task cpu_alert -query 'select cpu, usage_idle from "telegraf"."autogen"."cpu" where time > now() - 5m'
2d9be22c-647a-425e-89fb-40543bdd3670
```

* **`replay-live batch`**  With the batch argument the replay executes the task with batch data already stored to InfluxDB. It takes the following form:

```
kapacitor replay-live batch (-no-wait) ( -past <TIME_WINDOW> | -start <START_TIME> -stop <STOP_TIME> ) (-real-clock) (-rec-time) (-replay-id <REPLAY_ID>) -task <TASK_ID>
```

This command requires either a time value for a window of past data from `now`,
defined by the argument `-past` or a past interval defined by the arguments `-start`
and `-stop`.  A `-replay-id` is optional and will be generated if not provided.
The `-task` argument with its `TASK_ID` is also required.  The optional Boolean
argument `-no-wait` will spawn the replay into a separate process and exit leaving
it to run in the background. The optional Boolean argument
`-real-clock` will toggle replaying the data according to the intervals between
the timestamps contained within.  The optional Boolean argument `-rec-time` will
toggle using the actual recorded times instead of present times.  Use of present
times is the default behavior.


**Example 18: Replay live batch**

```
$ kapacitor replay-live batch -start 2018-01-16T00:00:00Z -stop 2018-01-16T12:00:00Z -replay-id GoldRoosterColdBridge180116 -task batch_load_test
GoldRoosterColdBridge180116
```

**`list`**  The universal `list` command can be used to list existing recordings and replays.

* **`list recordings`**  Use the `recordings` argument to list recordings.

**Example 19: List recordings**

```
$ kapacitor list recordings
ID                                   Type    Status    Size      Date
0970bcb5-685c-48cc-9a92-741633633f1f stream  finished  3.2 kB    15 Jan 18 16:37 CET
78d3a26e-ea1f-4c52-bd56-2016997313fe stream  finished  23 B      15 Jan 18 15:33 CET
4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 stream  finished  2.2 kB    15 Jan 18 15:25 CET
BlueJaySilverTree                    batch   finished  1.0 kB    15 Jan 18 15:18 CET
7d30caff-e443-4d5f-a0f2-6a933ea35284 batch   finished  998 B     15 Jan 18 15:17 CET
```

* **`list replays`**  Use the `replays` argument to list replays.

**Example 20: List replays**

```
$ kapacitor list replays
ID                                   Task            Recording                            Status   Clock   Date
d861ee94-aec1-43b8-b362-5c3d9a036aff cpu_alert       4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 running  real    16 Jan 18 11:02 CET
GoldRoosterColdBridge180116          batch_load_test                                      finished fast    16 Jan 18 10:23 CET
2d9be22c-647a-425e-89fb-40543bdd3670 cpu_alert                                            finished fast    16 Jan 18 10:12 CET
b972582b-5be9-4626-87b7-c3d9bfc67981 batch_load_test                                      finished fast    15 Jan 18 17:26 CET
c060f960-6b02-49a7-9376-0ee55952a7f0 cpu_alert                                            finished fast    15 Jan 18 17:25 CET
4a43565c-4678-4c98-94b7-e534efdff860 cpu_alert       4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 finished fast    15 Jan 18 16:52 CET
31f8ea34-455b-4eee-abf2-ed1eb60166a5 cpu_alert       4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 finished real    15 Jan 18 16:50 CET
bbe8567c-a642-4da9-83ef-2a7d32ad5eb1 cpu_alert       4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 finished fast    15 Jan 18 16:49 CET
```

**`delete`**  The universal `delete` command can be used to remove existing recordings and replays.

* **`delete recordings`**  use the recordings argument to delete one or more recordings. It takes the following form.

```
kapacitor delete recordings [ID | Pattern]
```

`ID` needs to be the full ID of the recording, preferably copied and pasted from
the results of the `list recordings` command.

`Pattern` can be a grep-like pattern used to identify a set of recordings.  For
example, if the value `test0<N>` was assigned to multiple `recording-id`s, (e.g.
`test01`, `test02`, `test03`) then all `test` recordings could be removed with
the pattern `"test*"`.

**Example 21: Delete recordings**

```
$ kapacitor delete recordings "test*"
$
```

Note that this command returns no status or additional messages.  It fails or
succeeds silently.  To verify results use the `list recordings` command.

* **`delete replays`**  use the replays argument to delete one or more replays. It takes the following form.

```
kapacitor delete replays [ID | Pattern]
```

`ID` needs to be the full ID of the replay, preferably copied and pasted from
the results of the `list replays` command.

`Pattern` can be a grep-like pattern used to identify a set of replays.  For
example, if the value `test0<N>` was assigned to multiple `replay-id`s, (e.g.
`jan-run01`, `jan-run02`, `jan-run03`) then all `run` replays could be removed with
the pattern `"jan-run*"`.

**Example 22: Delete replays**

```
$ kapacitor delete replays "jan-run*"
$
```

Note that this command returns no status or additional messages.  It fails or
succeeds silently.  To verify the results, use the `list replays` command.

## Topics and topic handlers

Topics are classes of subjects to which alerts can publish messages and to which
other services can subscribe in order to receive those messages.  Topic handlers
bind topics to services, allowing messages to be forwarded by various means.

Working with topics and topic handlers is introduced in the section [Alerts: Using topics](/kapacitor/v1.4/working/using_alert_topics/).
Note that topics are created through the `topic` method of the `alert` node in
TICKscripts.

**`define-topic-handler`**  This command defines or redefines a topic handler based on the contents of a topic handler script.
It takes the following form:

```
kapacitor define-topic-handler <PATH_TO_HANDLER_SCRIPT>
```

**Example 23: Defining a topic handler**

```
$ kapacitor define-topic-handler ./slack_cpu_handler.yaml
$
```

Note that this command returns no status or additional messages.
It fails or succeeds silently.
To verify the results, use the `list topic-handlers` command.

**`list`**  The universal `list` command can be used to list both topics and topic handlers.

* **`list topics`**  Use the `list topics` command to display all topics currently stored by Kapacitor. This command requires no further arguments.

**Example 24: Listing topics**

```
$ kapacitor list topics
ID                                                             Level     Collected
1252f40d-c998-430d-abaf-277c43d390e1:cpu_alert:alert2          OK                0
32fdb276-4d60-42bc-8f5d-c093e97bd3d0:batch_cpu_alert:alert2    OK                0
666c444c-a33e-42b5-af4d-732311b0e148:batch_cpu_alert:alert2    CRITICAL          0
cpu                                                            OK                0
main:batch_load_test:alert2                                    OK                7
main:chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54:alert3 OK             1028
main:chronograf-v1-e77137c5-dcce-4fd5-a612-3cdaa5f98ef9:alert7 OK                0
main:cpu-alert-test:alert3                                     OK                0
```

* **`list topic-handlers`**  Use the `list topic-handlers` command to display handlers stored by Kapacitor.  This command requires no further arguments.

**Example 25: Listing topic handlers**

```
$ kapacitor list topic-handlers
Topic      ID         Kind
cpu        slack      slack
```

**`show-topic`**  Use this command to see the details of a topic.  It takes the following form:

```
kapacitor show-topic [TOPIC_ID]
```
**Example 26: Showing a topic**

```
$ kapacitor show-topic 1252f40d-c998-430d-abaf-277c43d390e1:cpu_alert:alert2
ID: 1252f40d-c998-430d-abaf-277c43d390e1:cpu_alert:alert2
Level: OK
Collected: 0
Handlers: []
Events:
Event   Level    Message       Date
cpu:nil OK       cpu:nil is OK 13 Nov 17 13:34 CET
```

**`show-topic-handler`**  This command writes out the topic-handler contents to the console. It takes the following form:

```
kapacitor show-topic-handler [TOPIC_ID] [HANDLER_ID]
```

**Example 27: Showing a topic handler**

```
$ kapacitor show-topic-handler cpu slack
ID: slack
Topic: cpu
Kind: slack
Match:
Options: {"channel":"#kapacitor"}
```

**`delete`**  The universal `delete` command can be used to remove topics and topic handlers.

* **`delete topics`** Use the `topics` argument to remove one or more topics.  It takes the following form:

```
kapacitor delete topics [ID | Pattern]
```

`Pattern` can be a grep-like pattern used to identify a set of topics.  For
example, if the value `cluster0<N>` was assigned to multiple `topic`s, (e.g.
`cluster01`, `cluster02`, `cluster03`), then all `cluster` topics could be removed with
the pattern `"cluster*"`.


**Example 28: Deleting a topic**

```
$ kapacitor delete topics 1252f40d-c998-430d-abaf-277c43d390e1:cpu_alert:alert2
$
```

Note that this command returns no status or additional messages.
It fails or succeeds silently.
To verify the results use the `list topics` command.

* **`delete topic-handlers`**  Use the `topic-handlers` argument to remove a topic handler.  It takes the following form:

```
kapacitor delete topic-handler [TOPIC_ID] [HANDLER_ID]
```

The values for `TOPIC_ID` and `HANDLER_ID` can be determined using the `list`
command.
See Example 25 above.

**Example 29: Deleting a topic handler**
```
$ kapacitor delete topic-handlers cpu slack
$
```

Note that this command returns no status or additional messages.
It fails or succeeds silently.
To verify the results, use the `list topics` command.

## Tasks and task templates

Tasks and task definitions comprise the core Kapacitor functionality.  Tasks are
introduced in the [Getting Started](/kapacitor/v1.4/introduction/getting-started/) guide
and are explored in detail along side the [TICKscript](/kapacitor/v1.4/tick/).

Task templates make it easy to reuse generic task structures to create a suite
of similar tasks.
They are introduced in the [Template Tasks](/kapacitor/v1.4/working/template_tasks/) document.

**`define`** The `define` command is used to create a new task from a TICKscript.
It takes one of the following three forms:

1. As a straight-forward task.
1. From a template.
1. From a template with a descriptor file.


**As a straight-forward task**

```
kapacitor define <TASK_ID> -tick <PATH_TO_TICKSCRIPT> -type <stream|batch> (-no-reload) -dbrp <DATABASE>.<RETENTION_POLICY>
```

This form of the `define` command requires a new or existing task identifier
provided immediately after the `define` token.
If the identifier does not yet exist in Kapacitor, a new task will be created.  If the identifier already exists, the existing task will be updated.
A required path to a TICKscript is provided through the argument `tick`.
The `-type` of task is also required, as is the target database and retention policy identified by the argument `-dbrp`.
The optional Boolean argument `-no-reload` will prevent reloading the task into
memory.
The default behavior is to reload an updated task.

**Example 30: Defining a new task - standard**

```
$ kapacitor define sandbox -tick sandbox.tick -type stream -dbrp "telegraf"."autogen"
$
```

Note that this task on success returns no status or additional messages.
Some error messages associated with malformed or invalid TICKscripts may be returned.
To verify the results, use the `list tasks` command.

**From a template**
```
kapacitor define <TASK_ID> -template <TEMPLATE_ID> -vars <PATH_TO_VARS_FILE> (-no-reload) -dbrp <DATABASE>.<RETENTION_POLICY>
```

This form of the `define` command requires a new or existing task identifier
provided immediately after the `define` token.
If the identifier does not yet exist in Kapacitor, a new task will be created.  If the identifier already exists, the existing task will be updated.
The required template to be used is identified with the `-template` argument.  The target database and retention policy identified by the argument `-dbrp` is also required as is a path to the file containing variable definitions identified by the `-var` argument.
The optional Boolean argument `-no-reload` will prevent reloading the task into
memory.
The default behavior is to reload an updated task.

**Example 31: Defining a new task - from template**

```
$ kapacitor define cpu_idle -template generic_mean_alert -vars cpu_vars.json -dbrp "telegraf"."autogen"
$
```

Note that this task on success returns no status or additional messages.
To verify the results use the `list tasks` command.

**From a template with a descriptor file**

```
kapacitor define <TASK_ID> -file <PATH_TO_TEMPLATE_FILE> (-no-reload)
```

This form of the `define` command requires a new or existing task identifier
provided immediately after the `define` token.  If the identifier does not yet
exist in Kapacitor a new task will be created.  If the identifier already exists
the existing task will be updated.  A path to the file defining the template,
database and retention policy and variables is required and provided through the
`-file` argument. The optional Boolean argument `-no-reload` will prevent
reloading the task into memory.  The default behavior is to reload an updated
task.

**Example 32: Defining a new task - with a descriptor file**

```
$ kapacitor define mem_alert -file mem_alert_from_template.json
$
```

Note that this task on success returns no status or additional messages.
To verify the results use the `list tasks` command.

**`define-template`** Use this command to load a task template to Kapacitor.  It takes the following form:

```
kapacitor define-template <TEMPLATE_ID> -tick <PATH_TO_TICKSCRIPT> -type <string|batch>
```

This command requires a new or existing template identifier provided immediately
after the `define-template` token.  If the identifier does not yet
exist in Kapacitor a new template will be created.  If the identifier already exists
the existing template will be updated. The path to a TICKscript defining the
template is also required and is provided through the argument `-tick`.  Finally
the `-type` of task must also be defined.

**Example 33: Defining a new task template**

```
$ kapacitor define-template generic_mean_alert -tick template-task.tick -type stream
$
```

Note that this task on success returns no status or additional messages.
To verify the results use the `list templates` command.

**`enable`** When tasks are first created they are in a `disabled` state.  Use this command to enable one or more tasks.  It takes the following form:


```
kapacitor enable <TASK_ID>...
```

**Example 34: Enabling a task**

```
$ kapacitor enable cpu_alert
$
```

Note that this task on success or failure returns no status or additional messages.
To verify the results use the `list tasks` command.

**`disable`**  Use this command to disable one or more active tasks.  It takes the following form:

```
kapacitor disable <TASK_ID>...
```

**Example 35: Disabling a task**

```
$ kapacitor disable cpu_alert cpu_alert_topic sandbox
$
```
Note that this task on success or failure returns no status or additional messages.
To verify the result use the `list tasks` command.

**`reload`**  When troubleshooting a task it may be useful to stop it and then start it again.  This command will disable and then enable one or more tasks.  It takes the following form:


```
kapacitor reload <TASK_ID>...
```

Note that to redefine a task simply run the `define` command with an updated TICKscript, template or template file.

**Example 36:  Reloading a task**

```
$ kapacitor reload cpu_alert
$
```
Note that this task on success or failure returns no status or additional messages.
To verify the result use the `list tasks` command.

**`list`**  The universal `list` command can be used to list tasks and task templates.

* **`list tasks`**  Use the `list tasks` command to display all tasks currently stored by Kapacitor.  This command requires no further arguments.

**Example 37: Listing tasks**

```
$ kapacitor list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
8405b862-e488-447d-a021-b1b7fe0d7194               stream    disabled  false     ["telegraf"."autogen"]
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    enabled   true      ["telegraf"."autogen"]
cpu_idle                                           stream    disabled  false     ["telegraf"."autogen"]
sandbox                                            stream    disabled  false     ["blabla"."autogen"]
```

* **`list templates`**  Use the `list templates` command to display all templates currently stored by Kapacitor.  This command requires no further arguments.

**Example 38: Listing templates**

```
$ kapacitor list templates
ID                 Type      Vars
generic_mean_alert stream    crit,field,groups,measurement,slack_channel,warn,where_filter,window
```

**`show`**  Use this command to see the details of a task.  It takes the following form:

```
kapacitor show (-replay <REPLAY_ID>) [TASK_ID]
```
`REPLAY_ID` is the identifier of a currently running replay.

**Example 39: Showing a task**

```
$ kapacitor show cpu_alert
ID: cpu_alert
Error:
Template:
Type: stream
Status: enabled
Executing: true
Created: 13 Nov 17 13:38 CET
Modified: 16 Jan 18 17:11 CET
LastEnabled: 16 Jan 18 17:11 CET
Databases Retention Policies: ["telegraf"."autogen"]
TICKscript:
stream
    // Select just the cpu measurement from our example database.
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: int("usage_idle") < 70)
        // Whenever we get an alert write it to a file.
        .log('/tmp/alerts.log')

DOT:
digraph cpu_alert {
graph [throughput="0.00 points/s"];

stream0 [avg_exec_time_ns="0s" errors="0" working_cardinality="0" ];
stream0 -> from1 [processed="2574"];

from1 [avg_exec_time_ns="1.92µs" errors="0" working_cardinality="0" ];
from1 -> alert2 [processed="2574"];

alert2 [alerts_triggered="147" avg_exec_time_ns="1.665189ms" crits_triggered="104" errors="0" infos_triggered="0" oks_triggered="43" warns_triggered="0" working_cardinality="1" ];
}
```

**`show-template`**  Use this command to see the details of a task template.  It takes the following form:

```
kapacitor show-template [TEMPLATE_ID]
```

**Example 40: Showing a task template**

```
$ kapacitor show-template generic_mean_alert
ID: generic_mean_alert
Error:
Type: stream
Created: 25 Oct 17 10:12 CEST
Modified: 16 Jan 18 16:52 CET
TICKscript:
// Which measurement to consume
var measurement string

// Optional where filter
var where_filter = lambda: TRUE

// Optional list of group by dimensions
var groups = [*]

// Which field to process
var field string

// Warning criteria, has access to 'mean' field
var warn lambda

// Critical criteria, has access to 'mean' field
var crit lambda

// How much data to window
var window = 5m

// The slack channel for alerts
var slack_channel = '#kapacitor'

stream
    |from()
        .measurement(measurement)
        .where(where_filter)
        .groupBy(groups)
    |window()
        .period(window)
        .every(window)
    |mean(field)
    |alert()
        .warn(warn)
        .crit(crit)
        .slack()
        .channel(slack_channel)

Vars:
Name                          Type      Default Value                           Description
crit                          lambda    <required>                              Critical criteria, has access to 'mean' field
field                         string    <required>                              Which field to process
groups                        list      [*]                                     Optional list of group by dimensions
measurement                   string    <required>                              Which measurement to consume
slack_channel                 string    #kapacitor                              The slack channel for alerts
warn                          lambda    <required>                              Warning criteria, has access to 'mean' field
where_filter                  lambda    TRUE                                    Optional where filter
window                        duration  5m0s                                    How much data to window
DOT:
digraph generic_mean_alert {
stream0 -> from1;
from1 -> window2;
window2 -> mean3;
mean3 -> alert4;
}
```

**`delete`** The universal `delete` command can be used to remove tasks and task templates.

* **`delete tasks`**`  Use the `tasks` argument to remove one or more tasks.  It takes the following form:

```
kapacitor delete tasks [ID | Pattern]
```

`Pattern` can be a GREP like pattern used to identify a set of tasks.  For
example if the value `cpu0<N>` was assigned to multiple `task`s, (e.g.
`cpu01`, `cpu02`, `cpu03`) then all `cpu` tests could be removed with
the pattern `"cpu*"`.


**Example 41: Deleting a task**

```
$ kapacitor delete tasks 8405b862-e488-447d-a021-b1b7fe0d7194
$
```

Note that this command returns no status or additional messages.  It fails or
succeeds silently.  To verify the results use the `list tasks` command.

* **`delete templates`**  Use the `templates` argument to remove one or more templates.  It takes the following form:

```
kapacitor delete templates [ID | Pattern]
```

`Pattern` can be a GREP like pattern used to identify a set of task templates.  For
example if the value `generic0<N>` was assigned to multiple `template`s, (e.g.
`generic01`, `generic02`, `generic03`) then all `generic` templates could be removed with
the pattern `"generic*"`.


**Example 42: Deleting a template**

```
$ kapacitor delete templates generic_mean_alert
$
```

Note that this command returns no status or additional messages.  It fails or
succeeds silently.  To verify the results use the `list templates` command.
