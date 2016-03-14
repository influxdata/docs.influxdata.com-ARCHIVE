## TICK
*(Prettier formatting)*

### <font color="#F95F53">**Telegraf**</font>
Telegraf is an open source agent for collecting metrics from the system it's running on, or from other services, and writing them into InfluxDB or other outputs.

* [Getting Started](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs)
* [All Documentation](/telegraf/v0.10/)

### <font color="#4591ED">**InfluxDB**</font>
InfluxDB is an open source database designed to handle time series data with high availability and high performance requirements.

* [Getting Started](/influxdb/v0.10/getting_started_tick/getting_started/#influxdb-gs)
* [All Documentation](/influxdb/v0.10/)

### <font color="#8050EA">**Chronograf**</font>
Chronograf is a data visualization application for InfluxDB.

* [Getting Started](/influxdb/v0.10/getting_started_tick/getting_started/#chronograf-gs)
* [All Documentation](/chronograf/v0.10/)

### <font color="#4ED8A0">**Kapacitor**</font>
Kapacitor is an open source framework for processing, monitoring, and alerting on time series data.

* [Getting Started](/influxdb/v0.10/getting_started_tick/getting_started/#kapacitor-gs)
* [All Documentation](/kapacitor/v0.10/)

## Getting Started
The following sections introduce each element of the TICK stack.
By the end of this guide you will know how to:

* Send data to InfluxDB with <font color="#F95F53">Telegraf</font>
* Write and query data with <font color="#4591ED">InfluxDB</font>
* Visualize data and create a dashboard with <font color="#8050EA">Chronograf</font>
* Create an alert with <font color="#4ED8A0">Kapacitor</font>

We recommend moving through the next sections chronologically to follow along with the sample data and get acquainted with each element of the TICK stack.
If you're only interested in certain parts of the TICK stack, feel free to treat each section as a standalone guide but note that the experience will not be as interactive.

*(Include how long this should take)*

### <font id="telegraf-gs" color="#F95F53">**Telegraf**</font>

The first element of the TICK stack is Telegraf.
Telegraf is an open source agent for collecting metrics from the system it's running on, or from other services, and writing those metrics to InfluxDB or other outputs.

##### Objective
<br>
Download, install, and configure Telegraf to collect CPU usage data and output those data to InfluxDB.

##### What you need
<br>
A basic terminal to issue commands

You don't need InfluxDB, yet. We'll get to that in the [InfluxDB](/influxdb/v0.10/getting_started_tick/getting_started/#influxdb-gs) section.

#### <font color="#F95F53">1. Download and Install Telegraf</font>

Follow the instructions on the [Downloads page](https://influxdata.com/downloads/#telegraf).

#### <font color="#F95F53">2. Configure Telegraf</font>

Here, we'll create a configuration file that tells Telegraf to collect information about your system's CPU usage (the input) and to write those data to InfluxDB (the output).

Run the following command from your terminal to output the [relevant configuration](/influxdb/v0.10/getting_started_tick/telegraf/) to `telegraf.conf`:

*(Dropdown for each system)*

##### Linux debian and RPM packages
```
telegraf -sample-config -input-filter cpu -output-filter influxdb > /etc/telegraf/telegraf.conf
```

##### OS X
```
telegraf -sample-config -input-filter cpu -output-filter influxdb > /usr/local/etc/telegraf.conf
```

Telegraf has over 60 input and output plugins.
For a complete list see [inputs](/telegraf/v0.10/inputs/) and [outputs](/telegraf/v0.10/outputs/).  

#### <font id="telegraf-start" color="#F95F53">3. Start Telegraf</font>

From your terminal, enter:

*(Dropdown for each system)*

##### Linux debian and RPM packages
```
sudo service telegraf start
```

##### OS X
```
telegraf -config /usr/local/etc/telegraf.conf
```

##### Ubuntu 15+
```
systemctl start telegraf
```

Telegraf is now collecting data about your system's CPU usage!
You can't see or access those data because Telegraf is trying to output the data to InfluxDB - which you don't have.

Move on to the next section to install InfluxDB and access your Telegraf data.
We recommend allowing Telegraf to run while you work.

#### <font color="#F95F53">More Telegraf features</font>

* Gather metrics from several [supported inputs](/telegraf/v0.10/inputs/).
* Gather metrics from several [supported service inputs](/telegraf/v0.10/services/).
* Send metrics to several [supported outputs](/telegraf/v0.10/outputs/).
* Create your own inputs and outputs by following the [Contributing Guide](https://github.com/influxdata/telegraf/blob/master/CONTRIBUTING.md) on GitHub.

Check out the full [Telegraf documentation](/telegraf/v0.10/) for more information.

### <font id="influxdb-gs" color="#4591ED">**InfluxDB**</font>

The second element of the TICK stack is InfluxDB.
InfluxDB is an open source database designed to handle time series data with high availability and high performance requirements.

##### Objective
<br>
Download, install, and start running InfluxDB. Connect to InfluxDB's Command Line Interface (CLI) to create, populate, and query your own database. Lastly, query the data that Telegraf is writing to InfluxDB.

##### What you need
<br>
A basic terminal to issue commands.

Optional:
If you'd like to follow along you'll need Telegraf up and running on your system.
You're all set if you worked through the [Telegraf](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) section of this guide.

#### <font color="#4591ED">1. Download and Install InfluxDB</font>

Follow the instructions on the [Downloads page](https://influxdata.com/downloads/#influxdb).

In the next sections you'll be working with a single instance of InfluxDB.
If you're interested in working with an InfluxDB cluster, we recommend going through the next steps to get familiar with InfluxDB and then moving on to the [Clustering Documentation](/influxdb/v0.10/guides/clustering/).

#### <font color="#4591ED">2. Start InfluxDB</font>

From your terminal, enter:

*(Dropdown for each system)*

##### FreeBSD/PC-BSD
```
sudo service influxd onestart
```

##### Linux debian and RPM packages
```
sudo service influxdb start
```

##### OS X
```
influxd
```

By default, InfluxDB connects to port `8086` and `localhost`. For details on how to configure your instance see [Database Configuration](/influxdb/v0.10/administration/config/).

#### <font color="#4591ED">3. Connect to InfluxDB's Command Line Interface</font>
There are several ways to interact with InfluxDB, including the [HTTP API](/influxdb/v0.10/concepts/api/), [client libraries](/influxdb/v0.10/clients/api/), and [plugins](/influxdb/v0.10/write_protocols/) for common data formats such as [Graphite](/influxdb/v0.10/write_protocols/graphite/). Here, we'll be working with InfluxDB's Command Line Interface (CLI):

Enter the following command from your terminal to launch the CLI:  
```
influx -precision 'rfc3339'
```

> **Note:** By specifying `-precision 'rfc3339'` we ask the CLI to format timestamps as `YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`.
For more CLI configurations, see [InfluxDB CLI/Shell](/influxdb/v0.10/tools/shell/).

Once you're connected to the CLI, you'll see the following:
```
Connected to http://localhost:8086 version 0.10.3
InfluxDB shell 0.10.3
>
```

If you're having trouble connecting to the CLI try stopping and restarting InfluxDB.

#### <font color="#4591ED">4. Create, write to, and query your own database</font>
I. Create a database
<br>
<br>
We do this in the CLI using InfluxQL (InfluxDB's SQL-like query language).
Here, we create a database called `telegraf`:
```
> CREATE DATABASE telegraf
```

II. Use the database
<br>
<br>
To write or query data in `telegraf` we need to tell the CLI to use that database:
```
> USE telegraf
Using database telegraf
```

III. Write a couple data points
<br>
<br>
```
> INSERT census,location=south_pond mosquitos=200 1455739264000000000
> INSERT census,location=south_pond mosquitos=110 1455739265000000000
> INSERT census,location=north_pond mosquitos=300,honeybees=50 1455739264000000000
```

> ###### Line Protocol and the InfluxDB data structure
> <br>
> Data must be in a specific format for InfluxDB to understand them and write them to the database.
We call that format [Line Protocol](/influxdb/v0.10/write_protocols/write_syntax/).
Line Protocol takes the following form:
```
<measurement_name>[,<tag_key1>=<tag_value1>,<tag_key2=tag_value2>,...] <field_key1>=<field_value1>[,<field_key2>=<field_value2>,...] [unix-epoch-timestamp]
```

> The components of the Line Protocol statement form the building blocks of InfluxDB's data structure:

> * **Measurement**: For now, think of these as buckets that store tags and fields.
> * **Tags**: Optional key-value pairs that store meta data about the data in the fields.
> * **Fields**: Key-value pairs that store the actual time series data points.
> * **Unix epoch timestamp**: Optional timestamp.
Every data point in InfluxDB is associated with a timestamp (it is a time series database!).
If you don't specify a timestamp in your Line Protocol, InfluxDB assigns the server's current time to the data point.

> Check out [Key Concepts](/influxdb/v0.10/concepts/key_concepts/) to get more familiar with InfluxDB's terminology.

IV. Query your data

* Display everything in the measurement `census`:

    ```
    > SELECT * FROM census WHERE time >= '2016-02-17T20:01:04Z' and time <= '2016-02-17T20:01:05Z'
    name: census
    ------------
    time			         honeybees	location	 mosquitos
    2016-02-17T20:01:04Z			    south_pond	 200
    2016-02-17T20:01:04Z	 50		    north_pond	 300
    2016-02-17T20:01:05Z			    south_pond	 110
    ```
* Calculate the average number of mosquitos at each pond:
    ```
    > SELECT mean(mosquitos) FROM census GROUP BY location
    name: census
    tags: location=north_pond
    time			        mean
    ----			        ----
    1970-01-01T00:00:00Z	300


    name: census
    tags: location=south_pond
    time			        mean
    ----			        ----
    1970-01-01T00:00:00Z	155
    ```

InfluxQL is a SQL-like query language that provides features specific to storing and analyzing time series data.
For users who haven't worked with a SQL-like language we recommend starting out with [Data Exploration](/influxdb/v0.10/query_language/data_exploration/).
For users with SQL experience who are looking for reference documentation, see [InfluxDB Query Language Reference](/influxdb/v0.10/query_language/spec/).

#### <font color="#4591ED">5. Query the Telegraf Data</font>
If you followed the steps in the [Telegraf section](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) and left Telegraf running, Telegraf has been busy writing data to InfluxDB since you created the `telegraf` database.
If you stopped Telegraf, [restart it](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-start).
If you didn't run through the [Telegraf section](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) of this guide, feel free to skip this step or, even better, go back and set up Telegraf!

I. Display every measurement in the `telegraf` database with `SHOW MEASUREMENTS`
```
> SHOW MEASUREMENTS
name: measurements
------------------
name
census
cpu
```
In addition to the `census` measurement that you created above, you should also see a measurement called `cpu`. That's the measurement that Telegraf is writing to!

II. Display every field key in the measurement `cpu` with `SHOW FIELD KEYS FROM cpu`
```
> SHOW FIELD KEYS FROM cpu
name: cpu
---------
fieldKey
usage_guest
usage_guest_nice
usage_idle
usage_iowait
usage_irq
usage_nice
usage_softirq
usage_steal
usage_system
usage_user
```

III. View a sample of the data in the field `usage_idle` in the measurement `cpu` with a `SELECT` statement
```
> SELECT usage_idle FROM cpu WHERE cpu = 'cpu-total' LIMIT 5
name: cpu
---------
time			               usage_idle
2016-02-04T17:47:30Z	 89.32366545818228
2016-02-04T17:47:40Z	 91.71664167916042
2016-02-04T17:47:50Z	 98.9252686828293
2016-02-04T17:48:00Z	 95.67229518449031
2016-02-04T17:48:10Z	 96.5034965034965
```

And that's it!
While Telegraf is running it will continue to write data about your system's CPU usage to InfluxDB.

#### <font color="#4591ED">More InfluxDB features</font>
We've covered the basics here, but InfluxDB offers much more:

* Automatically clear out old data with InfluxDB's [Retention Policies](/influxdb/v0.10/concepts/glossary/#retention-policy-rp)
* Execute queries periodically and automatically, and store the results with InfluxDB's [Continuous Queries](/influxdb/v0.10/query_language/continuous_queries/)
* Control user privileges with InfluxDB's [Authentication and Authorization](/influxdb/v0.10/administration/authentication_and_authorization/)
* Safeguard your data with InfluxDB's [Backup and Restore](/influxdb/v0.10/administration/backup_and_restore/)
* Horizontally scale with InfluxDB's [Clustering](/influxdb/v0.10/guides/clustering/)

Now that you know how to write and query data in InfluxDB, it's time to start visualizing your data. Move on to the next section to get started with the TICK stack's data visualization tool.

Check out the full [InfluxDB documentation](/influxdb/v0.10/) for more information.

### <font id="chronograf-gs" color="#8050EA">**Chronograf**</font>

The third element of the TICK stack is Chronograf.
Chronograf is a data visualization application for InfluxDB.

##### Objective
<br>
Download, install, and start running Chronograf. Create your first dashboard and add a visualization to it.

##### What you need
<br>

* A basic terminal to issue commands
* A working InfluxDB instance (you're all set if you've worked through the [InfluxDB](/influxdb/v0.10/getting_started_tick/getting_started/#influxdb-gs) section of this guide)

Optional: If you'd like to follow along you'll need Telegraf up and running on your system.
You're all set if you worked through the [Telegraf](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) section of this guide.

#### <font color="#8050EA">1. Download and Install Chronograf</font>

Follow the instructions on the [Downloads page](https://influxdata.com/downloads/#chronograf).

#### <font color="#8050EA">2. Start the Chronograf server</font>

From your terminal, enter:

*(Dropdown for each system)*

##### Debian or RPM package
```
sudo service chronograf start
```

##### OS X via Homebrew
```
chronograf
```

##### Standalone OS X binary
Assuming you're working with Chronograf version 0.10, from the `chronograf-0.10/` directory:
```
./chronograf-0.10-darwin_amd64
```

By default, Chronograf runs on localhost port `10000`.
Check to see if Chronograf is running at http://127.0.0.1:10000.
If this is the first time you’ve started Chronograf, you’ll see:

![Add new server](/img/chronograf/add-new-server.png)

#### <font color="#8050EA">3. Add an InfluxDB Server</font>

Direct Chronograf to your InfluxDB data by adding a server:

I. Click the `Add new server` button at http://127.0.0.1:10000.

II. Fill out the form with the relevant information.
The only required fields are `NICKNAME`, `HOST`, and `PORT`.

In the example below, we’ve called our server `InfluxDB-1` and it’s running on `localhost` on port `8086` (the default `HOST` and `PORT` for InfluxDB).
<br>
<br>
![Add server](/img/chronograf/add-server.png)

III. Click the `Add` button.

In the image below, notice that Chronograf is now aware of the InfluxDB server `InfluxDB-1`.
<br>
<br>
![Servers](/img/chronograf/servers.png)

IV. Click `Done` in the top left corner and move on to the next section to create your first dashboard. You can always return to the `Servers` page by clicking on the gear in the top right corner.

#### <font color="#8050EA">4. Create a visualization on a Chronograf Dashboard</font>

In the next steps we'll create a visualization that shows the average idle CPU percentage grouped by the `cpu` tag and by one minute time intervals.
To follow along you will need data from Telegraf.
See the [Telegraf section](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) of this guide if you haven't already set up Telegraf to send data to InfluxDB.

##### Create a dashboard.
<br>
I. Move to the `DASHBOARDS` tab at the top of your screen.

II. Click `+` and name your dashboard in the `New Dashboard` window. We call our dashboard `CPU Usage`.

Because our dashboard has no visualizations, it looks like this:
<br>
<br>
![Blank Dashboard](/img/chronograf/tick-blank-dashboard.png)

III. Click the `Add Visualization` button, name your new visualization (we call our visualization `Idle CPU Usage`), and click `Save`.

IV. Click the `+ Add Query` button and choose the server, [database](/influxdb/v0.10/concepts/glossary/#database), and [retention policy](/influxdb/v0.10/concepts/glossary/#retention-policy-rp) that you want to work with.
In this example, we’re working with the the server `InfluxDB-1`, the database `telegraf`, and the retention policy `default`.

![SDR Chooser](/img/chronograf/tick-sdr-chooser.png)

V. Create your query.

To create a [query](/influxdb/v0.10/concepts/glossary/#query), you can either use the Query Builder or, if you're already familiar with InfluxQL, you can manually enter the query in the text input.
In this step, we manually enter the following query:

```
SELECT usage_idle FROM cpu WHERE time > now() - 1h GROUP BY cpu
```

The query selects all values in the `usage_idle` field that occur in the last hour, and it groups the output by the `cpu` tag.

![Visualization](/img/chronograf/tick-vis.png)

VI. Click `Done` in the top right corner to add the visualization to your dashboard.
Feel free to move around your visualization to discover what Chronograf can do for you:

![Visualization on Dashboard](/img/chronograf/tick-vis-on-dash.gif)

#### <font color="#8050EA">More Chronograf features</font>
Chronograf also features [template variables](/chronograf/v0.10/introduction/templating/) that allow users to easily modify a visualization's time range and tag values.

Check out the full [Chronograf documentation](/chronograf/v0.10/) for more information.

### <font id="kapacitor-gs" color="#4ED8A0">**Kapacitor**</font>

The final element of the TICK stack is Kapacitor.
Kapacitor is an open source framework for processing, monitoring, and alerting on time series data.

##### Objective
Download, install, and start Kapacitor. Set up an alert for high CPU usage.

##### What you need
A basic terminal to issue commands

Optional: If you'd like to follow along you'll need Telegraf and InfluxDB up and running on your system. You're all set if you worked through the [Telegraf](/influxdb/v0.10/getting_started_tick/getting_started/#telegraf-gs) and [InfluxDB](/influxdb/v0.10/getting_started_tick/getting_started/#influxdb-gs) sections of this guide.

#### <font color="#4ED8A0">1. Download and Install Kapacitor</font>

Follow the instructions on the [Downloads page](https://influxdata.com/downloads/#kapacitor).

#### <font color="#4ED8A0">2. Start Kapacitor</font>

Once you start Kapacitor, Kapacitor finds InfluxDB on `http://localhost:8086` and tells InfluxDB to send all of its data to Kapacitor. By default, Kapacitor runs on `http://localhost:9092`.

From your terminal, enter:

*(Dropdown for each system)*

##### Linux debian and RPM packages
```
sudo service kapacitor start
```

##### OS X
```
kapacitord
```

#### <font color="#4ED8A0">3. Set up an alert for high CPU usage</font>

The following steps create an alert on your streaming Telegraf data; when idle CPU usage drops below 70% (so you have less than 30% available CPU) Kapacitor writes an alert to a file.

> **Note:** This example works with streaming data. Kapacitor can also process data in batches - for a batch use case example, see [Trigger Alert from Batch Data](/kapacitor/v0.10/introduction/getting_started/#trigger-alert-from-batch-data).

I. Create a task

Kapacitor defines a task in a TICKscript.
TICKscripts tell Kapacitor which data to process and how to process them.
The following TICKscript processes InfluxDB data in the measurement `cpu` and field `usage_idle`.
When `usage_idle` is less than 70%, the TICKscript tells Kapacitor to write the alert to the file `/tmp/alerts.log`.

Save this TICKscript in your working directory as `cpu_alert.tick`.

```javascript
stream
    // Select just the cpu measurement from our example database.
    .from().measurement('cpu')
    .alert()
        .crit(lambda: "usage_idle" <  70)
        // Whenever we get an alert write it to a file.
        .log('/tmp/alerts.log')
```

For more on Kapacitor's TICKscripts, see [TICKscript Language Reference](/kapacitor/v0.10/tick/).

II. Define the task

Enter the following text in your terminal. The command informs Kapacitor how to trigger the alert; it includes information about the name of the alert, the type of alert, the location of the tick script, and the relevant database and retention policy in InfluxDB.

```
kapacitor define \
    -name cpu_alert \
    -type stream \
    -tick cpu_alert.tick \
    -dbrp telegraf.default
```

III. Enable the task

Tell Kapacitor to start processing the live data stream with:
```
kapacitor enable cpu_alert
```

IV. Create some alerts

Here's a quick hack to use 100% percent of one core:
```
while true; do i=0; done
```

Let that run for a bit and then check out `/tmp/alerts.log`.
Kapacitor writes alerts to that file once idle CPU usage is below 70% for one core.

Example:
```
cat "/tmp/alerts.log"
{"id":"cpu:nil","message":"cpu:nil is CRITICAL","details":"{\u0026#34;Name\u0026#34;:\u0026#34;cpu\u0026#34;,\u0026#34;TaskName\u0026#34;:\u0026#34;cpu_alert\u0026#34;,\u0026#34;Group\u0026#34;:\u0026#34;nil\u0026#34;,\u0026#34;Tags\u0026#34;:{\u0026#34;cpu\u0026#34;:\u0026#34;cpu0\u0026#34;,\u0026#34;host\u0026#34;:\u0026#34;Regans-MacBook-Pro-2.local\u0026#34;},\u0026#34;ID\u0026#34;:\u0026#34;cpu:nil\u0026#34;,\u0026#34;Fields\u0026#34;:{\u0026#34;usage_guest\u0026#34;:0,\u0026#34;usage_guest_nice\u0026#34;:0,\u0026#34;usage_idle\u0026#34;:69.9,\u0026#34;usage_iowait\u0026#34;:0,\u0026#34;usage_irq\u0026#34;:0,\u0026#34;usage_nice\u0026#34;:0,\u0026#34;usage_softirq\u0026#34;:0,\u0026#34;usage_steal\u0026#34;:0,\u0026#34;usage_system\u0026#34;:2.2,\u0026#34;usage_user\u0026#34;:27.9},\u0026#34;Level\u0026#34;:\u0026#34;CRITICAL\u0026#34;,\u0026#34;Message\u0026#34;:\u0026#34;cpu:nil is CRITICAL\u0026#34;}","time":"2016-03-14T23:08:40Z","level":"CRITICAL","data":{"series":[{"name":"cpu","tags":{"cpu":"cpu0","host":"Regans-MacBook-Pro-2.local"},"columns":["time","usage_guest","usage_guest_nice","usage_idle","usage_iowait","usage_irq","usage_nice","usage_softirq","usage_steal","usage_system","usage_user"],"values":[["2016-03-14T23:08:40Z",0,0,69.9,0,0,0,0,0,2.2,27.9]]}]}}
{"id":"cpu:nil","message":"cpu:nil is OK","details":"{\u0026#34;Name\u0026#34;:\u0026#34;cpu\u0026#34;,\u0026#34;TaskName\u0026#34;:\u0026#34;cpu_alert\u0026#34;,\u0026#34;Group\u0026#34;:\u0026#34;nil\u0026#34;,\u0026#34;Tags\u0026#34;:{\u0026#34;cpu\u0026#34;:\u0026#34;cpu1\u0026#34;,\u0026#34;host\u0026#34;:\u0026#34;Regans-MacBook-Pro-2.local\u0026#34;},\u0026#34;ID\u0026#34;:\u0026#34;cpu:nil\u0026#34;,\u0026#34;Fields\u0026#34;:{\u0026#34;usage_guest\u0026#34;:0,\u0026#34;usage_guest_nice\u0026#34;:0,\u0026#34;usage_idle\u0026#34;:100,\u0026#34;usage_iowait\u0026#34;:0,\u0026#34;usage_irq\u0026#34;:0,\u0026#34;usage_nice\u0026#34;:0,\u0026#34;usage_softirq\u0026#34;:0,\u0026#34;usage_steal\u0026#34;:0,\u0026#34;usage_system\u0026#34;:0,\u0026#34;usage_user\u0026#34;:0},\u0026#34;Level\u0026#34;:\u0026#34;OK\u0026#34;,\u0026#34;Message\u0026#34;:\u0026#34;cpu:nil is OK\u0026#34;}","time":"2016-03-14T23:08:40Z","level":"OK","data":{"series":[{"name":"cpu","tags":{"cpu":"cpu1","host":"Regans-MacBook-Pro-2.local"},"columns":["time","usage_guest","usage_guest_nice","usage_idle","usage_iowait","usage_irq","usage_nice","usage_softirq","usage_steal","usage_system","usage_user"],"values":[["2016-03-14T23:08:40Z",0,0,100,0,0,0,0,0,0,0]]}]}}
```

*(Briefly describe what appears in `alerts.log`)*

And that's it! Now you'll receive an alert whenever your idle CPU usage falls below 70%.
That was just a simple threshold alert.
TICKscripts can much more powerful.
Check out [Extending your TICKscripts](/kapacitor/v0.10/introduction/getting_started/#extending-your-tickscripts).

#### <font color="#4ED8A0">More Kapacitor Features</font>

* Get more familiar with [TICKscripts](/kapacitor/v0.10/tick/)
* See examples of what Kapacitor can do:
    * [Calculate Rates Across Joined Series and Backfill](/kapacitor/v0.10/examples/join_backfill/)
    * [Live Leaderboard of Game Scores](/kapacitor/v0.10/examples/live_leaderboard/)
    * [Custom Anomaly Detection](/kapacitor/v0.10/examples/anomaly_detection/)

Check out the full [Kapacitor documentation](/kapacitor/v0.10/) for more information.

### You're done!

If you've worked through this entire guide you're now a master of the TICK stack. The links below will take you to further documentation for each part of the TICK stack. Now go forth and conquer your time series data!

* [Telegraf](/telegraf/v0.10/)
* [InfluxDB](/influxdb/v0.10/)
* [Chronograf](/chronograf/v0.10/)
* [Kapactor](/kapacitor/v0.10/)
