---
title: Getting Started

menu:
  kapacitor_1_1:
    weight: 20
    parent: introduction
---

Kapacitor is a data processing engine.
It can process both stream and batch data.
This guide will walk you through both workflows and teach you the basics of using
and running a Kapacitor daemon.

What you will need
------------------

Don't worry about installing anything yet, instructions are found below.

* [InfluxDB](/docs/v0.9/introduction/installation.html)  - While Kapacitor does not require InfluxDB it is the easiest to setup and so we will use it in this guide.
You will need InfluxDB >= 0.13
* [Telegraf](https://github.com/influxdb/telegraf#installation) - We will use a specific Telegraf config to send data to InfluxDB so that the examples Kapacitor tasks have context.
You will need Telegraf >= 0.13
* [Kapacitor](https://github.com/influxdb/kapacitor) - You can get the latest Kapacitor binaries for your OS at the [downloads](https://influxdata.com/downloads/#kapacitor) page.
* Terminal - Kapacitor's interface is via a CLI and so you will need a basic terminal to issue commands.

The Use Case
------------

For this guide we will follow the classic use case of triggering an alert for high cpu usage on a server.

The Process
-----------

1. Install everything we need.
2. Start InfluxDB and send it data from Telegraf.
3. Configure Kapacitor.
4. Start Kapacitor.
5. Define and run a streaming task to trigger cpu alerts.
6. Define and run a batching task to trigger cpu alerts.

Installation
------------

Install [Kapacitor](/kapacitor/v1.1/introduction/installation/),
[InfluxDB](/docs/v0.9/introduction/installation.html)
and [Telegraf](https://github.com/influxdb/telegraf#installation) on the same host.

All examples will assume that Kapacitor is running on `http://localhost:9092` and InfluxDB on `http://localhost:8086`.

InfluxDB + Telegraf
-------------------

Start InfluxDB:

```bash
influxd run
```

The following is a simple Telegraf configuration file that will send just cpu metrics to InfluxDB:

```
[agent]
    interval = "1s"

[outputs]

# Configuration to send data to InfluxDB.
[outputs.influxdb]
    urls = ["http://localhost:8086"]
    database = "kapacitor_example"
    user_agent = "telegraf"

# Collect metrics about cpu usage
[cpu]
    percpu = false
    totalcpu = true
    drop = ["cpu_time"]

```

Put the above configuration in a file called `telegraf.conf` and start telegraf:

```bash
telegraf -config telegraf.conf
```

OK, at this point we should have a running InfluxDB + Telegraf setup.
There should be some cpu metrics in a database called `kapacitor_example`.
Confirm this with this query:

```bash
curl -G 'http://localhost:8086/query?db=kapacitor_example' --data-urlencode 'q=SELECT count(usage_idle) FROM cpu'
```

Starting Kapacitor
------------------

First we need a valid configuration file.
Run the following command to create a default configuration file:

```bash
kapacitord config > kapacitor.conf
```

The configuration is a [toml](https://github.com/toml-lang/toml) file and is very similar to the InfluxDB configuration.
That is because any input that you can configure for InfluxDB also works for Kapacitor.

Let's start the Kapacitor server:

```bash
kapacitord -config kapacitor.conf
```

Since InfluxDB is running on `http://localhost:8086` Kapacitor finds it during start up and creates several [subscriptions](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#create-subscription) on InfluxDB.
These subscriptions tell InfluxDB to send all the data it receives to Kapacitor.
You should see some basic start up messages and something about listening on UDP port and starting subscriptions.
At this point InfluxDB is streaming the data it is receiving from Telegraf to Kapacitor.

Trigger Alert from Stream data
------------------------------

That was a bit of setup, but at this point it should be smooth sailing and we can get to the fun stuff of actually using Kapacitor.

A `task` in Kapacitor represents an amount of work to do on a set of data.
There are two types of tasks, `stream` and `batch` tasks.
We will be using a `stream` task first, and next we will do the same thing with a `batch` task.

Kapacitor uses a DSL called [TICKscript](/kapacitor/v1.1/tick/) to define tasks.
Each TICKscript defines a pipeline that tells Kapacitor which data to process and how.

So what do we want to tell Kapacitor to do?
As an example, we will trigger an alert on high cpu usage.
What is high cpu usage?
Let's say when idle cpu drops below 70% we should trigger an alert.

Now that we know what we want to do, let's write it in a way the Kapacitor understands.
Put the script below into a file called `cpu_alert.tick` in your working directory:

```javascript
stream
    // Select just the cpu measurement from our example database.
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" <  70)
        // Whenever we get an alert write it to a file.
        .log('/tmp/alerts.log')
```

Kapacitor has an HTTP API with which all communication happens.
The binary `kapacitor` exposes the API over the command line.
Now use the CLI tool to define the `task` and the databases and retention policies it can access:

```bash
kapacitor define cpu_alert \
    -type stream \
    -tick cpu_alert.tick \
    -dbrp kapacitor_example.autogen
```

That's it, Kapacitor now knows how to trigger our alert.


However nothing is going to happen until we enable the task.
Before we enable the task, we should test it first so we do not spam ourselves with alerts.
Record the current data stream for a bit so we can use it to test our task with:

```bash
kapacitor record stream -task cpu_alert -duration 20s
```

Since we defined the task with a database and retention policy pair, the recording knows to
only record data from that database and retention policy.

Now grab that ID that was returned and let's put it in a bash variable for easy use later (your ID will be different):

```bash
rid=cd158f21-02e6-405c-8527-261ae6f26153
```

Let's confirm that the recording captured some data. Run

```bash
kapacitor list recordings $rid
```

You should see some output like:

```
ID                                      Type    Status    Size      Date
cd158f21-02e6-405c-8527-261ae6f26153    stream  finished  1.6 MB    04 May 16 11:44 MDT
```

As long as the size is more than a few bytes we know we captured data.
If Kapacitor is not receiving data yet, check each layer: Telegraf -> InfluxDB -> Kapacitor.
Telegraf will log errors if it cannot communicate to InfluxDB.
InfluxDB will log an error about `connection refused` if it cannot send data to Kapacitor.
Run the query `SHOW SUBSCRIPTIONS` to find the endpoint that InfluxDB is using to send data to Kapacitor.

OK, we have a snapshot of data recorded from the stream, so we can now replay that data to our task.
The `replay` action replays data only to a specific task.
This way we can test the task in complete isolation:

```bash
kapacitor replay -recording $rid -task cpu_alert
```

Since we already have the data recorded, we can just replay the data as fast as possible instead of waiting for real time to pass.
If `-real` was set, then the data would be replayed by waiting for the deltas between the timestamps to pass, though the result is identical whether real time passes or not.
This is because time is measured on each node by the data points it receives.

Check the log using the command below, did we get any alerts?
The file should contain lines of JSON, where each line represents one alert.
The JSON contains the alert level and the data that triggered the alert.

```bash
cat /tmp/alerts.log
```

Depending on how busy the server was, maybe not.
Let's modify the task to be really sensitive so that we know the alerts are working.
Change the `.crit(lambda: "value" < 70)` line in the TICKscript to `.crit(lambda: "value" < 100)`.
Now every data point that was received during
the recording will trigger an alert.

Let's replay it again and verify the results.
Any time you want to update a task change the TICKscript and then run the `define` command again with just the `TASK_NAME` and `-tick` arguments:

```bash
# edit threshold in cpu_alert.tick and redefine the task.
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor replay -recording $rid -task cpu_alert
```

Now that we know it's working, let's change it back to a more reasonable threshold.
Are you happy with the threshold?
If so, let's `enable` the task so it can start processing the live data stream with:

```bash
kapacitor enable cpu_alert
```

Now you can see alerts in the log in real time.

To see that the task is receiving data and behaving as expected run the `show` command to get more information about a task:

```bash
$ kapacitor show cpu_alert
ID: cpu_alert
Error:
Type: stream
Status: Enabled
Executing: true
Created: 04 May 16 21:01 MDT
Modified: 04 May 16 21:04 MDT
LastEnabled: 04 May 16 21:03 MDT
Databases Retention Policies: ["kapacitor_example"."autogen"]
TICKscript:
stream
    // Select just the cpu measurement from our example database.
    |from()
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

The first part has information about the state of the task and any error it may have encounted.
The `TICKscript` section displays the version of the TICKscript that Kapacitor has stored in its local db.

The last section `DOT` is a [graphviz dot](http://www.graphviz.org) formatted string that contains information about the data processing pipeline defined by the TICKscript.
The *key=value* pairs are stats about each node or edge. The *processed* key indicates the number of data points that have passed along the specified edge of the graph.
For example in the above the `stream0` node (aka the `stream` var from the TICKscript) has sent 12 points to the `from1` node.
The `from1` node has also sent 12 points on to the `alert2` node.
Since Telegraf is configured to only send `cpu` data all 12 points match the from/measurement criteria of the `from1` node and are passed on.

Well now that we can see the task is running with live data, here is a quick hack to use 100% of one core so you can get some cpu activity:

```bash
while true; do i=0; done
```

Well, that was cool and all, but, just to get a simple threshold alert, there are plenty of ways to do that.
Why all this pipeline TICKscript stuff?
Well, it can quickly be extended to become *much* more powerful.

### Keep the quotes in mind

Single quotes and double quotes in kapacitor do very different things:

Note the following example:

```javascript
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Double quotes on server1
        .where(lambda: "host" == "server1")
```

Result of this search will always be empty, because we used double quotes around server1.
This means that we are searching for series where field "host" is equal to field "server1".
This is probably not what we were planning to do.
We were probably searching for series where tag "host" has value "server1", so we should use single quotes for that and our tick script should look like this:

```javascript
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Single quotes on server1
        .where(lambda: "host" == 'server1')
```

### Extending Your TICKscripts

The TICKscript below will compute the running mean and compare current values to it.
It will then trigger an alert if the values are more than 3 standard deviations away from the mean.
Replace the `cpu_alert.tick` script with the TICKscript below:

```javascript
stream
    |from()
        .measurement('cpu')
    |alert()
        // Compare values to running mean and standard deviation
        .crit(lambda: sigma("usage_idle") > 3)
        .log('/tmp/alerts.log')
```

Just like that, we have a dynamic threshold, and, if cpu usage drops in the day or spikes at night, we will get an alert!
Let's try it out.
Use `define` to update the task TICKscript.

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
```

>NOTE: If a task is already enabled `define`ing the task again will automatically `reload` it.
To define a task without reloading it use `-no-reload`

Now tail the alert log:

```bash
tail -f /tmp/alerts.log
```

There shouldn't be any alerts triggering just yet.
Next, start a few while loops to add some load:

```bash
while true; do i=0; done
```

You should see an alert trigger in the log once you create enough load.
Leave the loops running for a few minutes.
After canceling the loops, you should get another alert that cpu usage has again changed.
Using this technique you can get alerts for the raising and falling edges of cpu usage, as well as any outliers.

### A Real-World Example

Now that we understand the basics, here is a more real world example.
Once you get metrics from all your hosts streaming to Kapacitor, you can do something like: Aggregate and group
the cpu usage for each service running in each datacenter, and then trigger an alert
based off the 95th percentile.
In addition to just writing the alert to a log, Kapacitor can
integrate with third-party utilities: currently Slack, PagerDuty and VictorOps are supported, as well as
posting the alert to a custom endpoint or executing a custom script.
You can also define a custom message format so that alerts have the right context and meaning.
The TICKscript for this would look like:

```javascript
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
With the above script, you will be alerted if any service in any datacenter deviates more than 3
standard deviations away from normal behavior as defined by the historical 95th percentile of cpu usage, within 1 minute!

For more information on how the alerting works, see the [AlertNode](/kapacitor/v1.1/nodes/alert_node/) docs.

Trigger Alert from Batch data
------------------------------

Instead of just processing the data in streams, you can also tell Kapacitor to periodically query
InfluxDB and then process that data in batches.
While triggering an alert based off cpu usage is more suited for the streaming case, you can get the basic idea
of how `batch` tasks work by following the same use case.

This TICKscript does the same thing as the earlier stream task, but as a batch task:

```javascript
batch
    |query('''
        SELECT mean(usage_idle)
        FROM "kapacitor_example"."autogen"."cpu"
    ''')
        .period(5m)
        .every(5m)
        .groupBy(time(1m))
    |alert()
        .crit(lambda: "mean" < 70)
        .log('/tmp/alerts.log')
```

To define this task do:

```bash
kapacitor define batch_cpu_alert -type batch -tick batch_cpu_alert.tick -dbrp kapacitor_example.autogen
```

You can record the result of the query in the task like so (again, your ID will differ):

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

Check the alert log to make sure you received alerts to fire when you expected them to.
You can also go back and use the `sigma` based alert for the batch data as well.
Play around until you are comfortable updating, testing, and running tasks in Kapacitor.

### What's next?

Take a look at the [examples](/kapacitor/v1.1/examples/) page for more guides on how to use Kapacitor.
These use cases demonstrate some of the more rich features of Kapacitor.
