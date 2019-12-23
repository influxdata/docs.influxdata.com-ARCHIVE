---
title: Getting started with Kapacitor
menu:
  kapacitor_1_5:
    weight: 20
    parent: introduction
---

Learn how to use Kapacitor to stream and batch your time series data.

## Get started

1. If you haven't already, [download and install the InfluxData TICK stack (OSS)](/platform/install-and-deploy/install/oss-install). (Necessary to say?: use the Linux system packages (`.deb`,`.rpm`) if available.? If yes, why?)
2. Start InfluxDB and collect Telegraf data. By default, Telegraf starts sending system metrics to InfluxDB and creates a 'telegraf' database.
3. Start Kapacitor.

## Start InfluxDB and collect Telegraf data

1. Start InfluxDB using systemctl:

    ```bash
    $ sudo systemctl start influxdb
    ```

2. Verify InfluxDB startup:

```bash
$ sudo journalctl -f -n 128 -u influxdb
zář 01 14:47:43 algonquin systemd[1]: Started InfluxDB is an open-source, distributed, time series database.
...
```

2. In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), configure the following values to send CPU metrics to InfluxDB:

   - `[agent].interval` - frequency to send system metrics to InfluxDB
   - `[[outputs.influxd]]` - declares how to connect to InfluxDB and the destination database, which is the default 'telegraf' database. (so at least one URL and one database must be defined?)
   - `[[inputs.cpu]]` - declares how to collect the system cpu metrics to be sent to InfluxDB.

*Example - relevant sections of `/etc/telegraf/telegraf.conf`*
```
[agent]
  ## Default data collection interval for all inputs
  interval = "10s"

...
[[outputs.influxdb]]
  ## InfluxDB url is required and must be in the following form: http/udp "://" host [ ":" port]
  ## Multiple urls can be specified as part of the same cluster; only ONE url is written to each interval.
  ## InfluxDB URL
  urls = ["http://localhost:8086"]

  ## The target database for metrics is required (Telegraf creates if one doesn't exist).
  database = "telegraf"
...
[[inputs.cpu]]
  ## true reports per-cpu stats
  percpu = true
  ## true reports total system cpu stats
  totalcpu = true
  ## true collects raw CPU time metrics
  collect_cpu_time = false

```

3. Verify Telegraf is running:

 ```
 $ sudo systemctl status telegraf

If Telegraf is inactive, run the following command to start Telegraf:

```
$ sudo systemctl start telegraf
```

 Once Telegraf is running, run the following command to check the system journal to ensure no connection errors to InfluxDB exist:

 ```
 $ sudo journalctl -f -n 128 -u telegraf
-- Logs begin at Pá 2017-09-01 09:59:06 CEST. --
zář 01 15:15:42 algonquin systemd[1]: Started The plugin-driven server agent for reporting metrics into InfluxDB.
zář 01 15:15:43 algonquin telegraf[16968]: 2017-09-01T13:15:43Z I! Starting Telegraf (version 1.3.3)
zář 01 15:15:43 algonquin telegraf[16968]: 2017-09-01T13:15:43Z I! Loaded outputs: influxdb
zář 01 15:15:43 algonquin telegraf[16968]: 2017-09-01T13:15:43Z I! Loaded inputs: inputs.disk inputs.diskio inputs.kernel inputs.mem inputs.processes inputs.swap inputs.system inputs.cpu
zář 01 15:15:43 algonquin telegraf[16968]: 2017-09-01T13:15:43Z I! Tags enabled: host=algonquin
zář 01 15:15:43 algonquin telegraf[16968]: 2017-09-01T13:15:43Z I! Agent Config: Interval:10s, Quiet:false, Hostname:"algonquin", Flush Interval:10s

 ```

InfluxDB and Telegraf are now running and listening on localhost.

4. Wait a minute for Telegraf to supply a small amount of system metric data to InfluxDB. Then, run the following command to confirm that InfluxDB has the data for Kapacitor:

```bash
$ curl -G 'http://localhost:8086/query?db=telegraf' --data-urlencode 'q=SELECT mean(usage_idle) FROM cpu'
```

Results similar to the following appear:

```
{"results":[{"statement_id":0,"series":[{"name":"cpu","columns":["time","mean"],"values":[["1970-01-01T00:00:00Z",91.82304336748372]]}]}]}
```

## Start Kapacitor

By default, the Kapacitor configuration file is saved in `/etc/kapacitor/kapacitor.conf`.

1. Extract a copy of the current configuration from the Kapacitor daemon:

```bash
kapacitord config > kapacitor.conf
```

> The Kapacitor configuration is a [toml](https://github.com/toml-lang/toml) file. Inputs configured for InfluxDB also work for Kapacitor.

2. Start the Kapacitor service:

```bash
$ sudo systemctl start kapacitor
```

3. Verify the status of the Kapacitor service:

```bash
$ sudo systemctl status kapacitor
● kapacitor.service - Time series data processing engine.
   Loaded: loaded (/lib/systemd/system/kapacitor.service; enabled; vendor preset: enabled)
   Active: active (running) since Pá 2017-09-01 15:34:16 CEST; 3s ago
     Docs: https://github.com/influxdb/kapacitor
 Main PID: 18526 (kapacitord)
    Tasks: 13
   Memory: 9.3M
      CPU: 122ms
   CGroup: /system.slice/kapacitor.service
           └─18526 /usr/bin/kapacitord -config /etc/kapacitor/kapacitor.conf

zář 01 15:34:16 algonquin systemd[1]: Started Time series data processing engine..

```

Because InfluxDB is running on `http://localhost:8086`, Kapacitor finds it during start up and creates several [subscriptions](https://github.com/influxdata/influxql/blob/master/README.md#create-subscription) on InfluxDB.
Subscriptions tell InfluxDB to send data to Kapacitor.

4. For more log data, run the following command to check the log file in the `/var/log/kapacitor` directory.

```
$ sudo tail -f -n 128 /var/log/kapacitor/kapacitor.log

```

Kapacitor listens on an HTTP port and posts data to InfluxDB. Now, InfluxDB streams data from Telegraf to Kapacitor.

## Kapacitor tasks
A Kapacitor `task` defines work to do on a set of data.
There are two types of tasks: `stream` and `batch`.

A `stream` task mirrors all data written from InfluxDB to Kapacitor.
This offloads the query overhead from InfluxDB to Kapacitor, but requires Kapacitor to store the data on disk.

A `batch` task queries data from InfluxDB at a set interval and processes the data as it's queried.

Kapacitor tasks define data processing pipelines using [TICKscript](/kapacitor/v1.5/tick/) syntax.
Task files are commonly referred to as "TICKscripts."

### Task execution
At the beginning of each TICKscript, you specify the database and retention policy
that contain data the TICKscript should act on using the `dbrp` keyword.

```js
dbrp "telegraf"."autogen"

// ...
```

When Kapacitor receives data from a database and retention policy that matches those
specified, it executes the TICKscript.

{{% note %}}
You can only execute Kapacitor tasks based on database and retention policy.
Kapacitor does not support task execution based on other conditions.
{{% /note %}}

## Triggering alerts from stream data

The TICKStack is now setup (excluding Chronograf, which is not covered here).  This guide will now introduce the fundamentals of actually working with Kapacitor.

So what should Kapacitor be instructed to do?

The most common Kapacitor use case is triggering alerts. The example that follows will set up an alert on high cpu usage.
How to define high cpu usage?  Telegraf writes to InfluxDB a cpu metric on the percentage of time a cpu spent in an idle state. For demonstration purposes assume that when idle usage drops below 70% a critical alert should be triggered.

A TICKscript can now be written to cover these criteria.  Copy the script below into a file called `cpu_alert.tick`:

```js
dbrp "telegraf"."autogen"

stream
    // Select just the cpu measurement from our example database.
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: int("usage_idle") <  70)
        // Whenever we get an alert write it to a file.
        .log('/tmp/alerts.log')
```

Kapacitor has an HTTP API with which all communication happens.
The `kapacitor` client application exposes the API over the command line.
Now use this CLI tool to define the `task` and the database&mdash;including retention policy&mdash;that it can access:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
```

> Note on declaring Database and Retention policy:  As of Kapacitor 1.4 the database and retention policy to which the TICKscript will be applied can be declared using an optional statement in the script: e.g. `dbrp "telegraf"."autogen"`.  If not declared in the script, then it must be defined when the task is defined using the kapacitor flag `-dbrp` followed by the argument "&lt;DBNAME&gt;"."&lt;RETENTION_POLICY&gt;".

Verify that the alert has been created using the `list` command.

```
$ kapacitor list tasks
ID        Type      Status    Executing Databases and Retention Policies
cpu_alert stream    disabled  false     ["telegraf"."autogen"]
```

View details about the task using the `show` command.

```
$ kapacitor show cpu_alert
ID: cpu_alert
Error:
Template:
Type: stream
Status: disabled
Executing: false
...
```
This command will be covered in more detail below.

Kapacitor now knows how to trigger the alert.

However, nothing is going to happen until the task has been enabled.
Before being enabled, the task should first be tested to ensure it does not spam the log files or communication channels with alerts.
Record the current data stream for a bit and use it to test the new task:

```bash
kapacitor record stream -task cpu_alert -duration 60s
```

Since the task was defined with a database and retention policy pair, the recording knows to
only record data from that database and retention policy.

   * **NOTE – troubleshooting connection refused –** If, when running the record command, an error is returned of the type `getsockopt: connection refused` (Linux) or `connectex: No connection could be made...` (Windows), please ensure that the Kapacitor service is running.  See the section above [Installing and Starting Kapacitor](#installing-and-starting-kapacitor).  If Kapacitor is started and this error is still encountered, check the firewall settings of the host machine and ensure that port `9092` is accessible.  Check as well the messages in `/var/log/kapacitor/kapacitor.log`.  There may be an issue with the `http` or other configuration in `/etc/kapacitor/kapacitor.conf` and this will appear in the log.  If the Kapacitor service is running on another host machine, set the `KAPACITOR_URL` environment variable in the local shell to the Kapacitor endpoint on the remote machine.


Now grab the ID that was returned and put it in a bash variable for easy use later on (the actual UUID returned will be different):

```bash
rid=cd158f21-02e6-405c-8527-261ae6f26153
```

Confirm that the recording captured some data. Run

```bash
kapacitor list recordings $rid
```

The output should appear like:

```
ID                                      Type    Status    Size      Date
cd158f21-02e6-405c-8527-261ae6f26153    stream  finished  2.2 kB    04 May 16 11:44 MDT
```

As long as the size is more than a few bytes it is certain that some data was captured.
If Kapacitor is not receiving data yet, check each layer: Telegraf &rarr; InfluxDB &rarr; Kapacitor.
Telegraf will log errors if it cannot communicate to InfluxDB.
InfluxDB will log an error about `connection refused` if it cannot send data to Kapacitor.
Run the query `SHOW SUBSCRIPTIONS` to find the endpoint that InfluxDB is using to send data to Kapacitor.

```
$ curl -G 'http://localhost:8086/query?db=telegraf' --data-urlencode 'q=SHOW SUBSCRIPTIONS'

{"results":[{"statement_id":0,"series":[{"name":"_internal","columns":["retention_policy","name","mode","destinations"],"values":[["monitor","kapacitor-ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509","ANY",["http://localhost:9092"]]]},{"name":"telegraf","columns":["retention_policy","name","mode","destinations"],"values":[["autogen","kapacitor-ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509","ANY",["http://localhost:9092"]]]}]}]}
```

With a snapshot of data recorded from the stream, that data can then be replayed to the new task.
The `replay` action replays data only to a specific task.
This way the task can be tested in complete isolation:

```bash
kapacitor replay -recording $rid -task cpu_alert
```

Since the data has already been recorded, it can be replayed as fast as possible instead of waiting for real time to pass.
When the flag `-real-clock` is set, the data will be replayed by waiting for the deltas between the timestamps to pass, though the result is identical whether real time passes or not. This is because time is measured on each node by the data points it receives.

Check the log using the command below.

```bash
sudo cat /tmp/alerts.log
```
Were any alerts received?
The file should contain lines of JSON, where each line represents one alert.
The JSON line contains the alert level and the data that triggered the alert.

Depending on how busy the host machine was, maybe not.

The task can be modified to be really sensitive to ensure the alerts are working.
In the TICKscript change the lamda function `.crit(lambda: "usage_idle" < 70)` to `.crit(lambda: "usage_idle" < 100)`, and define the task once more.

Any time you want to update a task change the TICKscript and then run the `define` command again with just the `TASK_NAME` and `-tick` arguments:

Now every data point that was received during the recording will trigger an alert.

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
```

Replay it again and verify the results.

```bash
kapacitor replay -recording $rid -task cpu_alert
```

Once the `alerts.log` results verify that it is working, change the `usage_idle` threshold back to a more reasonable level and redefine the task once more using the `define` command as shown above.

Enable the task, so it can start processing the live data stream, with:

```bash
kapacitor enable cpu_alert
```

Now alerts will be written to the log in real time.

To see that the task is receiving data and behaving as expected run the `show` command once again to get more information about it:

```bash
$ kapacitor show cpu_alert
|from()
ID: cpu_alert
Error:
Type: stream
Status: Enabled
Executing: true
Created: 04 May 16 21:01 MDT
Modified: 04 May 16 21:04 MDT
LastEnabled: 04 May 16 21:03 MDT
Databases Retention Policies: [""."autogen"]
TICKscript:
stream
    // Select just the cpu me
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" <  70)
        // Whenever we get an alert write it to a file.
        .log('/tmp/alerts.log')

DOT:
digraph asdf {
graph [throughput="0.00 points/s"];

stream0 [avg_exec_time_ns="0" ];
stream0 -> from1 [processed="12"];

from1 [avg_exec_time_ns="0" ];
from1 -> alert2 [processed="12"];

alert2 [alerts_triggered="0" avg_exec_time_ns="0" ];
}
```

The first part has information about the state of the task and any error it may have encountered.
The `TICKscript` section displays the version of the TICKscript that Kapacitor has stored in its local database.

The last section, `DOT`, is a [graphviz dot](http://www.graphviz.org) formatted tree that contains information about the data processing pipeline defined by the TICKscript.  Its members are key-value associative array entries containing statistics about each node and links along an edge to the next node also including associative array statistical information.  The *processed* key in the link/edge members indicates the number of data points that have passed along the specified edge of the graph.
For example in the above the `stream0` node (aka the `stream` var from the TICKscript) has sent 12 points to the `from1` node.
The `from1` node has also sent 12 points on to the `alert2` node.  Since Telegraf is configured to send `cpu` data, all 12 points match the from/measurement criteria of the `from1` node and are passed on.

>NOTE: When installing graphviz on Debian or RedHat (if not already installed) use the package provided by the OS provider.  The packages offered in the download section of the graphviz site are not up-to-date.

Now that the task is running with live data, here is a quick hack to use 100% of one core to generate some artificial cpu activity:

```bash
while true; do i=0; done
```

There are plenty of ways to get a threshold alert.  So, why all this pipeline TICKscript stuff?
In short because TICKscripts can quickly be extended to become *much* more powerful.

### Gotcha - single versus double quotes

Single quotes and double quotes in TICKscripts do very different things:

Note the following example:

```js
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Double quotes on server1
        .where(lambda: "host" == "server1")
```

The result of this search will always be empty, because double quotes were used around "server1". This means that Kapacitor will search for a series where the field "host" is equal to the value held in _the field_ "server1". This is probably not what was intended. More likely the intention was to search for a series where tag "host" has _the value_ 'server1', so single quotes should be used. Double quotes denote data fields, single quotes string values.  To match the _value_, the tick script above should look like this:

```js
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Single quotes on server1
        .where(lambda: "host" == 'server1')
```

### Extending TICKscripts

The TICKscript below will compute the running mean and compare current values to it.
It will then trigger an alert if the values are more than 3 standard deviations away from the mean.
Replace the `cpu_alert.tick` script with the TICKscript below:

```js
stream
    |from()
        .measurement('cpu')
    |alert()
        // Compare values to running mean and standard deviation
        .crit(lambda: sigma("usage_idle") > 3)
        .log('/tmp/alerts.log')
```

Just like that, a dynamic threshold can be created, and, if cpu usage drops in the day or spikes at night, an alert will be issued.
Try it out.
Use `define` to update the task TICKscript.

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
```

>NOTE: If a task is already enabled, redefining the task with the `define` command will automatically `reload` it.
To define a task without reloading it use `-no-reload`

Now tail the alert log:

```bash
sudo tail -f /tmp/alerts.log
```

There should not be any alerts triggering just yet.
Next, start a while loop to add some load:

```bash
while true; do i=0; done
```

An alert trigger should be written to the log shortly, once enough artificial load has been created.
Leave the loop running for a few minutes.
After canceling the loop, another alert should be issued indicating that cpu usage has again changed.
Using this technique, alerts can be generated for the raising and falling edges of cpu usage, as well as any outliers.

### A real world example

Now that the basics have been covered, here is a more real world example.
Once the metrics from several hosts are streaming to Kapacitor, it is possible to do something like: Aggregate and group
the cpu usage for each service running in each datacenter, and then trigger an alert
based off the 95th percentile.
In addition to just writing the alert to a log, Kapacitor can
integrate with  third party utilities: currently Slack, PagerDuty, HipChat, VictorOps and more are supported. The alert can also be sent by email, be posted to a custom endpoint or can trigger the execution of a custom script.
Custom message formats can also be defined so that alerts have the right context and meaning.
The TICKscript for this would look like the following example.

*Example - TICKscript for stream on multiple service cpus and alert on 95th percentile*
```js
stream
    |from()
        .measurement('cpu')
    // create a new field called 'used' which inverts the idle cpu.
    |eval(lambda: 100.0 - "usage_idle")
        .as('used')
    |groupBy('service', 'datacenter')
    |window()
        .period(1m)
        .every(1m)
    // calculate the 95th percentile of the used cpu.
    |percentile('used', 95.0)
    |eval(lambda: sigma("percentile"))
        .as('sigma')
        .keep('percentile', 'sigma')
    |alert()
        .id('{{ .Name }}/{{ index .Tags "service" }}/{{ index .Tags "datacenter"}}')
        .message('{{ .ID }} is {{ .Level }} cpu-95th:{{ index .Fields "percentile" }}')
        // Compare values to running mean and standard deviation
        .warn(lambda: "sigma" > 2.5)
        .crit(lambda: "sigma" > 3.0)
        .log('/tmp/alerts.log')

        // Post data to custom endpoint
        .post('https://alerthandler.example.com')

        // Execute custom alert handler script
        .exec('/bin/custom_alert_handler.sh')

        // Send alerts to slack
        .slack()
        .channel('#alerts')

        // Sends alerts to PagerDuty
        .pagerDuty()

        // Send alerts to VictorOps
        .victorOps()
        .routingKey('team_rocket')
```

Something so simple as defining an alert can quickly be extended to apply to a much larger scope.
With the above script, an alert will be triggered if any service in any datacenter deviates more than 3
standard deviations away from normal behavior as defined by the historical 95th percentile of cpu usage, and will do so within 1 minute!

For more information on how alerting works, see the [AlertNode](/kapacitor/v1.5/nodes/alert_node/) docs.

## Triggering alerts from batch data

Instead of just processing the data in streams, Kapacitor can also periodically query
InfluxDB and then process that data in batches.
While triggering an alert based off cpu usage is more suited for the streaming case, the basic idea
of how `batch` tasks work is demonstrated here by following the same use case.

This TICKscript does roughly the same thing as the earlier stream task, but as a batch task:

```js
dbrp "telegraf"."autogen"

batch
    |query('''
        SELECT mean(usage_idle)
        FROM "telegraf"."autogen"."cpu"
    ''')
        .period(5m)
        .every(5m)
        .groupBy(time(1m), 'cpu')
    |alert()
        .crit(lambda: "mean" < 70)
        .log('/tmp/batch_alerts.log')
```
Copy the script above into the file `batch_cpu_alert.tick`.

Define this task:

```bash
kapacitor define batch_cpu_alert -tick batch_cpu_alert.tick
```
Verify its creation:

```bash
$ kapacitor list tasks
ID              Type      Status    Executing Databases and Retention Policies
batch_cpu_alert batch     disabled  false     ["telegraf"."autogen"]
cpu_alert       stream    enabled   true      ["telegraf"."autogen"]
```

The result of the query in the task can be recorded like so (again, the actual UUID will differ):

```bash
kapacitor record batch -task batch_cpu_alert -past 20m
# Save the id again
rid=b82d4034-7d5c-4d59-a252-16604f902832
```

This will record the last 20 minutes of batches using the query in the `batch_cpu_alert` task.
In this case, since the `period` is 5 minutes, the last 4 batches will be saved in the recording.

The batch recording can be replayed in the same way:

```bash
kapacitor replay -recording $rid -task batch_cpu_alert
```

Check the alert log to make sure alerts were generated as expected.
The `sigma` based alert above can also be adapted for working with batch data.
Play around and get comfortable with updating, testing, and running tasks in Kapacitor.

## Loading Tasks with the Kapacitor daemon

It is also possible to save TICKscripts in a _load_ directory declared in
`kapacitor.conf`.  In this way tasks and task templates can be loaded and
enabled directly with the Kapacitor daemon, when it boots.  Such scripts must
include the database and retention policy declaration `dbrp`.

For more information see the [Load Directory](/kapacitor/v1.5/guides/load_directory/) guide.

### What's next?

Take a look at the [example guides](/kapacitor/v1.5/guides/) for how to use Kapacitor.
The use cases demonstrated there explore some of the richer features of Kapacitor.
