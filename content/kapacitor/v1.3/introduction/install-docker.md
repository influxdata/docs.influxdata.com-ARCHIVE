## Getting Started with TICK and Docker Compose

This short tutorial will demonstrate starting TICK stack components (InfluxDB, Telegraf, Kapacitor) with Docker Compose and then using that stack to learn the rudiments of working with Kapacitor and the [TICKscript](/kapacitor/v1.3/tick/) domain specific language (DSL).  The following discussion is based on the tutorial project package (named tik-docker-tutorial.zip) that can be downloaded from [this location](/downloads/tik-docker-tutorial.zip). It will create a running deployment of these applications that can be used for an initial evaluation and testing of Kapacitor.  Chronograf is currently not included in the package.

This tutorial depends on Docker Compose 3.0 to deploy the latest Docker 17.0+ compatible images of InfluxDB, Telegraf and Kapacitor.

To use this package Docker and Docker Compose should be installed on the host machine where it will run.  

Docker installation is covered at the [Docker website](https://docs.docker.com/engine/installation/).

Docker Compose installation is also covered at the [Docker website](https://docs.docker.com/compose/install/).

In order to keep an eye on the log files, this document will describe running the reference package in two separate consoles. In the first console Docker Compose will be run.  The second will be used to issue commands to demonstrate basic Kapacitor functionality.

As of this writing, the package has only been tested on Linux(Ubuntu 16.04).  It contains a `docker-compose.yml` and directories for configuration a test files.

*Demo Package Contents*
```
.
├── docker-compose.yml
├── etc
│   ├── kapacitor
│   │   └── kapacitor.conf
│   └── telegraf
│       └── telegraf.conf
├── home
│   └── kapacitor
│       ├── cpu_alert_batch.tick
│       └── cpu_alert_stream.tick
├── README.md
└── var
    └── log
        └── kapacitor
            └── README.md

```  

Please clone or copy the package to the host machine and open two consoles to its install location before continuing.

### Loading the stack with Docker Compose

The core of the package is the `docker-compose.yml` file, which Docker Compose uses to pull the Docker images and then create and run the Docker containers.  

Standard Unix style directories have also been prepared.  These are mapped into the docker containers to make it easy to access scripts and logs in the demonstrations that follow.  One important directory is the volume `var/log/kapacitor`.  Here the `kapacitor.log` and later the `alert-*.log` files will be made available for inspection.

 In the first console, in the root directory of the package, to start the stack and leave the logs visible run the following:

 ```
 $ docker-compose up
 ```
*Logs in standard console streams*
```
Starting tik_influxdb_1 ...
Starting tik_telegraf_1 ...
Starting tik_telegraf_1
Starting tik_influxdb_1
Starting tik_kapacitor_1 ...
Starting tik_influxdb_1 ... done
Attaching to tik_telegraf_1, tik_kapacitor_1, tik_influxdb_1
kapacitor_1  |
kapacitor_1  | '##:::'##::::'###::::'########:::::'###:::::'######::'####:'########::'#######::'########::
kapacitor_1  |  ##::'##::::'## ##::: ##.... ##:::'## ##:::'##... ##:. ##::... ##..::'##.... ##: ##.... ##:
kapacitor_1  |  ##:'##::::'##:. ##:: ##:::: ##::'##:. ##:: ##:::..::: ##::::: ##:::: ##:::: ##: ##:::: ##:
kapacitor_1  |  #####::::'##:::. ##: ########::'##:::. ##: ##:::::::: ##::::: ##:::: ##:::: ##: ########::
kapacitor_1  |  ##. ##::: #########: ##.....::: #########: ##:::::::: ##::::: ##:::: ##:::: ##: ##.. ##:::
kapacitor_1  |  ##:. ##:: ##.... ##: ##:::::::: ##.... ##: ##::: ##:: ##::::: ##:::: ##:::: ##: ##::. ##::
kapacitor_1  |  ##::. ##: ##:::: ##: ##:::::::: ##:::: ##:. ######::'####:::: ##::::. #######:: ##:::. ##:
kapacitor_1  | ..::::..::..:::::..::..:::::::::..:::::..:::......:::....:::::..::::::.......:::..:::::..::
kapacitor_1  |
kapacitor_1  | 2017/08/17 08:46:55 Using configuration at: /etc/kapacitor/kapacitor.conf
influxdb_1   |
influxdb_1   |  8888888           .d888 888                   8888888b.  888888b.
influxdb_1   |    888            d88P"  888                   888  "Y88b 888  "88b
influxdb_1   |    888            888    888                   888    888 888  .88P
influxdb_1   |    888   88888b.  888888 888 888  888 888  888 888    888 8888888K.
influxdb_1   |    888   888 "88b 888    888 888  888  Y8bd8P' 888    888 888  "Y88b
influxdb_1   |    888   888  888 888    888 888  888   X88K   888    888 888    888
influxdb_1   |    888   888  888 888    888 Y88b 888 .d8""8b. 888  .d88P 888   d88P
influxdb_1   |  8888888 888  888 888    888  "Y88888 888  888 8888888P"  8888888P"
influxdb_1   |
influxdb_1   | [I] 2017-08-17T08:46:55Z InfluxDB starting, version 1.3.3, branch HEAD, commit e37afaf09bdd91fab4713536c7bdbdc549ee7dc6
influxdb_1   | [I] 2017-08-17T08:46:55Z Go version go1.8.3, GOMAXPROCS set to 8
influxdb_1   | [I] 2017-08-17T08:46:55Z Using configuration at: /etc/influxdb/influxdb.conf
influxdb_1   | [I] 2017-08-17T08:46:55Z Using data dir: /var/lib/influxdb/data service=store
influxdb_1   | [I] 2017-08-17T08:46:56Z reading file /var/lib/influxdb/wal/_internal/monitor/1/_00001.wal, size 235747 engine=tsm1 service=cacheloader
influxdb_1   | [I] 2017-08-17T08:46:56Z reading file /var/lib/influxdb/wal/telegraf/autogen/2/_00001.wal, size 225647 engine=tsm1 service=cacheloader
telegraf_1   | 2017/08/17 08:46:55 I! Using config file: /etc/telegraf/telegraf.conf
telegraf_1   | 2017-08-17T08:46:56Z I! Starting Telegraf (version 1.3.3)
telegraf_1   | 2017-08-17T08:46:56Z I! Loaded outputs: influxdb
telegraf_1   | 2017-08-17T08:46:56Z I! Loaded inputs: inputs.kernel inputs.mem inputs.processes inputs.swap inputs.system inputs.cpu inputs.disk inputs.diskio
telegraf_1   | 2017-08-17T08:46:56Z I! Tags enabled: host=f1ba76bcbbcc
telegraf_1   | 2017-08-17T08:46:56Z I! Agent Config: Interval:10s, Quiet:false, Hostname:"f1ba76bcbbcc", Flush Interval:10s
influxdb_1   | [I] 2017-08-17T08:46:56Z reading file /var/lib/influxdb/wal/_internal/monitor/1/_00002.wal, size 0 engine=tsm1 service=cacheloader
influxdb_1   | [I] 2017-08-17T08:46:56Z /var/lib/influxdb/data/_internal/monitor/1 opened in 228.044556ms service=store

...

```
### Verifying the stack

The console logs should be similar to the above sample. In the second console the status can be confirmed by using docker directly.

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                          NAMES
f1ba76bcbbcc        telegraf:latest     "/entrypoint.sh te..."   43 minutes ago      Up 2 minutes        8092/udp, 8125/udp, 8094/tcp   tik_telegraf_1
432ce34e3b00        kapacitor:latest    "/entrypoint.sh ka..."   43 minutes ago      Up 2 minutes        9092/tcp                       tik_kapacitor_1
2060eca01bb7        influxdb:latest     "/entrypoint.sh in..."   43 minutes ago      Up 2 minutes        8086/tcp                       tik_influxdb_1

```
Take note of the container names, especially for Kapacitor.  If the Kapacitor container name in the current deployment is not the same(i.e. `tik_kapacitor_1`), be sure to replace it in the Docker command line examples below.  This also applies to the InfluxDB container name (`tik_influxdb_1`) which is used in the next example.  

### What is running?

At this point there should be running on the host machine: InfluxDB, Telegraf and Kapacitor.  Telegraf is configured using the configuration file `etc/telegraf/telegraf.conf`.  Kapacitor is configured using the file `etc/kapacitor/kapacitor.conf`.  A bridge network has been defined in the `docker-compose.yml` file.  This bridge network features a simple name resolution service, that allows the container names to be used as the server names in the configuration files just mentioned.

The running configuration can be further inspected by using the `influx` command line client directly from the InfluxDB Container.

```
$ docker exec -it tik_influxdb_1 influx --precision rfc3339
Connected to http://localhost:8086 version 1.3.3
InfluxDB shell version: 1.3.3
> show databases
name: databases
name
----
_internal
telegraf
> use telegraf
Using database telegraf
> show subscriptions
name: telegraf
retention_policy name                                           mode destinations
---------------- ----                                           ---- ------------
autogen          kapacitor-dc455e9d-b306-4687-aa39-f146a250dd76 ANY  [http://kapacitor:9092]

name: _internal
retention_policy name                                           mode destinations
---------------- ----                                           ---- ------------
monitor          kapacitor-dc455e9d-b306-4687-aa39-f146a250dd76 ANY  [http://kapacitor:9092]
> exit
```
## Kapacitor Alerts and the TICKscript

The top level nodes of a TICKscript define the mode by which the underlying node chain is to be executed.  They can be setup so that Kapacitor receives processed data in a steady stream, or so that it triggers the processing of a batch of data points, from which it will receive the results.

### Setting up a live stream CPU alert

To create an alert stream it is necessary to:

   * declare the desired functionality in a TICKscript
   * define the actual alert task in Kapacitor  
   * test the alert task by recording a sample of stream activity and then playing it back
   * enable the alert

An initial script has been prepared in the `home/kapacitor` directory, which is mapped as a volume into the Kapacitor container (`home/kapacitor/cpu_alert_stream.tick`).

This simple script touches upon just the basics of the rich domain specific TICKscript language.  It is self-descriptive and should be easily understood.

*cpu_alert_stream.tick*
```
stream
    // Select just the cpu measurement from our example database.
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" <  70)
        // Whenever we get an alert write it to a file
        .log('/var/log/kapacitor/alerts-stream.log')

```
Note that the `alerts-stream.log` file is written to a volume mapped back to the package directory tree `./var/log/kapacitor`.  This will simplify log inspection.

The TICKscript can then be used over Docker to define a new alert in the Kapacitor container.
```
$ docker exec tik_kapacitor_1 sh -c "cd /home/kapacitor && kapacitor define cpu_alert_stream -type stream -tick ./cpu_alert_stream.tick -dbrp telegraf.autogen"
```

Verify that the alert has been created with the following.

```
$ docker exec tik_kapacitor_1 kapacitor show cpu_alert_stream
ID: cpu_alert_stream
Error:
Template:
Type: stream
Status: disabled
Executing: false
Created: 17 Aug 17 09:30 UTC
Modified: 17 Aug 17 09:30 UTC
LastEnabled: 01 Jan 01 00:00 UTC
Databases Retention Policies: ["telegraf"."autogen"]
TICKscript:
stream
    // Select just the cpu measurement from our example database.
    |from()
        .measurement('cpu')
    |alert()
        .crit(lambda: "usage_idle" < 70)
        // Whenever we get an alert write it to a file.
        .log('/var/log/kapacitor/alerts-stream.log')

DOT:
digraph cpu_alert_stream {
stream0 -> from1;
from1 -> alert2;
}
```
#### Test the stream alert using 'record'

Before an alert is enabled, it is prudent to check its behavior.  A test run of how the alert stream will behave can be done using the Kapacitor 'record' command.  This will return a UUID that can then be used as a reference to list and replay what was captured in the test run.

```
$ docker exec tik_kapacitor_1 kapacitor record stream -task cpu_alert_stream -duration 60s
fd7d7081-c985-433e-87df-97ab0c267161
```

During the minute that this test run is being recorded, in order to force one or more CPUs to have a low idle measurement, which will trigger an alert, it will be useful to execute a process that will generate some artificial load.  For example in a third console, the following might be executed.

```shell
while true; do i=0; done;
```

List the recording with the following command:

```
$ docker exec tik_kapacitor_1 kapacitor list recordings fd7d7081-c985-433e-87df-97ab0c267161
ID                                   Type    Status    Size      Date                   
fd7d7081-c985-433e-87df-97ab0c267161 stream  finished  1.9 kB    17 Aug 17 09:34 UTC

```
#### Rerunning a recording of a stream alert

When a recording is rerun, alerts are written to the `alerts-stream.log` as they will occur when the alert will be enabled.  Replay the recording as follows:

```
docker exec tik_kapacitor_1 kapacitor replay -recording fd7d7081-c985-433e-87df-97ab0c267161  -task cpu_alert_stream
c8cd033f-a79e-46a6-bb5d-81d2f56722b2
```
Check the contents of the local `var/log/kapacitor` directory.

```
$ ls -1 var/log/kapacitor/
alerts-stream.log
kapacitor.log
README.md
```

Check the contents of the `alerts-stream.log`.

```
$ sudo less -X var/log/kapacitor/alerts-stream.log
{"id":"cpu:nil","message":"cpu:nil is CRITICAL","details":"{...}\n","time":"2017-08-17T09:36:09.693216014Z","duration":0,"level":"CRITICAL","data":{...
```
#### Enable the alert stream

Once it is clear that the new alert will not be generating spam, and that it will actually catch meaningful information, it can be enabled in Kapacitor.

```
$ docker exec tik_kapacitor_1 kapacitor enable cpu_alert_stream
```
Verify that it has been enabled by once again showing the task.
```
$ docker exec tik_kapacitor_1 kapacitor show cpu_alert_stream
ID: cpu_alert_stream
Error:
Template:
Type: stream
Status: enabled
Executing: true
...
```
If the alert stream will no longer be needed it can likewise be disabled.
```
$ docker exec tik_kapacitor_1 kapacitor disable cpu_alert_stream
```

### Setting up a batch CPU alert

The second mode for setting up a TICKscript node chain is batch processing.  A batch process can be executed periodically over a window of time series data points.

To create a batch process it is necessary to:

   * declare the desired functionality, window or time period to be sampled, and run frequency in a TICKscript
   * define the actual alert task in Kapacitor  
   * test the alert task by recording a data point sample and then playing it back
   * enable the alert

It may have already been noted that an example batch TICKscript has been created in the directory `home/kapacitor`.

As with the stream based TICKscript, the contents are self-descriptive and should be easily understood.

*cpu_alert_batch.tick*
```
batch
    |query('''
        SELECT usage_idle
        FROM "telegraf"."autogen"."cpu"
    ''')
        .period(5m)
        .every(5m)
    |alert()
        .crit(lambda: "usage_idle" < 70)
        .log('/var/log/kapacitor/alerts-batch.log')
```
Here again the `alerts-batch.log` will be written to a directory mapped as a volume into the Kapacitor container.

The TICKscript can then be used over Docker to define a new alert in the Kapacitor container.

```
$ docker exec tik_kapacitor_1 sh -c "cd /home/kapacitor && kapacitor define cpu_alert_batch -type batch -tick ./cpu_alert_batch.tick -dbrp telegraf.autogen"
```
Verify that the task has been created.

```
$ docker exec tik_kapacitor_1 kapacitor show cpu_alert_batch
ID: cpu_alert_batch
Error:
Template:
Type: batch
Status: disabled
Executing: false
Created: 17 Aug 17 12:41 UTC
Modified: 17 Aug 17 13:06 UTC
LastEnabled: 01 Jan 01 00:00 UTC
Databases Retention Policies: ["telegraf"."autogen"]
TICKscript:
batch
    |query('''
        SELECT usage_idle
        FROM "telegraf"."autogen"."cpu"
    ''')
        .period(5m)
        .every(5m)
    |alert()
        .crit(lambda: "usage_idle" < 70)
        .log('/var/log/kapacitor/alerts-batch.log')

DOT:
digraph cpu_alert_batch {
query1 -> alert2;
}
```

#### Test the batch alert using 'record'

As with the stream alert, it would be advisable to test the alert task before enabling it.

Prepare some alert triggering data points by creating artificial CPU load.  For example in a third console the following might be run for a minute or two.

```shell
while true; do i=0; done;
```
A test run of how the alert batch will behave can be generated using the Kapacitor 'record' command.

```
docker exec tik_kapacitor_1 kapacitor record batch -task cpu_alert_batch -past 5m
b2c46972-8d01-4fab-8088-56fd51fa577c
```  
List the recording with the following command.
```
$ docker exec tik_kapacitor_1 kapacitor list recordings b2c46972-8d01-4fab-8088-56fd51fa577c
ID                                   Type    Status    Size      Date                   
b2c46972-8d01-4fab-8088-56fd51fa577c batch   finished  2.4 kB    17 Aug 17 13:06 UTC  
```

#### Rerunning a recording of a batch alert

When the recording is rerun, alerts are written to the `alerts-batch.log` as they occurred when uncovered during batch processing.  Replay the recording as follows:

```
$ docker exec tik_kapacitor_1 kapacitor replay -recording b2c46972-8d01-4fab-8088-56fd51fa577c -task cpu_alert_batch
0cc65a9f-7dba-4a02-a118-e95b4fccf123
```
Check the contents of the local `var/log/kapacitor` directory.

```
$ ls -1 var/log/kapacitor/
alerts-batch.log
alerts-stream.log
kapacitor.log
README.md
README.md
```
Check the contents of the `alerts-batch.log`.

```
$ sudo less -X var/log/kapacitor/alerts-batch.log
{"id":"cpu:nil","message":"cpu:nil is CRITICAL","details":"{...}\n","time":"2017-08-17T13:07:00.156730835Z","duration":0,"level":"CRITICAL","data":{...

```
#### Enable the batch alert

Once it is clear that the new alert will not be generating spam, and that it will actually catch meaningful information, it can be enabled in Kapacitor.

```
$ docker exec tik_kapacitor_1 kapacitor enable cpu_alert_batch
```
Verify that it has been enabled by once again showing the task.
```
$ docker exec tik_kapacitor_1 kapacitor show cpu_alert_batch
ID: cpu_alert_batch
Error:
Template:
Type: batch
Status: enabled
Executing: true
Created: 17 Aug 17 12:41 UTC
...
```
If the alert stream will no longer be needed it can likewise be disabled.
```
$ docker exec tik_kapacitor_1 kapacitor disable cpu_alert_batch
```

### Summary

This short tutorial has covered the most basic steps in starting up the TICK stack with Docker and checking the most elementary feature of Kapacitor: configuring and testing alerts triggered by changes in data written to InfluxDB.  This installation can be used to further explore Kapacitor and its integration with InfluxDB and Telegraf.

### Shutting down the stack

There are two ways in which the stack can be taken down.
   * Either, in the first console hit CTRL + C
   * Or, in the second console run `$ docker-compose down --volumes`
