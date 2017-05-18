---
title: Monitor an InfluxEnterprise Cluster
menu:
  chronograf_1_3:
    weight: 30
    parent: Guides
---

[InfluxEnterprise](/enterprise_influxdb/v1.2/) offers high availability and a highly-scalable clustering solution for your time-series data needs.
Use Chronograf to assess your cluster's health and monitor the infrastructure behind your project.

This guides offers step-by-step instructions for using Chronograf, [InfluxDB](/influxdb/v1.2/), and [Telegraf](/telegraf/v1.3/) to monitor the data nodes in your InfluxEnteprise cluster.

## Requirements

The sections below assume you have a fully-functioning InfluxEnterprise cluster with authentication enabled.
See the InfluxEnterprise documentation for [detailed setup instructions](/enterprise_influxdb/v1.2/production_installation/).
This guide uses a cluster with three meta nodes and three data nodes; the steps are also applicable to other cluster arrangements.

We recommend having a separate server to store your monitoring data.
It is possible to store the monitoring data in your cluster and [connect the cluster to Chronograf](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#how-do-i-connect-chronograf-to-an-influxenterprise-cluster), but, in general, your monitoring data should live on a separate server.

Finally, this guide assumes that you're working on an Ubuntu 16.04 installation.
Chronograf and the other components of the TICK stack are supported on several operating systems and hardware architectures. Check out the [downloads page](https://portal.influxdata.com/downloads) for links to the binaries of your choice.

## Architecture Overview

Before we begin, here's an overview of the final monitoring setup:

![Architecture diagram](/img/chronograf/v1.3/g-cluster-diagram.png)

The diagram above shows an InfluxEnterprise cluster that consists of three meta nodes (M) and three data nodes (D).
Every data node has its own [Telegraf](/telegraf/v1.3/) instance (T).

Each Telegraf instance is configured to collect its node's CPU, disk, and memory data using Telegraf's [system stats](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugin.
The Telegraf instances are also configured to send those data to a single [OSS InfluxDB](/influxdb/v1.2/) instance that lives on a separate server.
When Telegraf sends data to InfluxDB, it automatically [tags](/influxdb/v1.2/concepts/glossary/#tag) those data with the hostname of the relevant data node.

The OSS InfluxDB instance that stores the Telegraf data is connected to Chronograf.
Chronograf uses the hostnames in the Telegraf data to populate the Host List page and provide other hostname-specific information in the user interface.

## Setup Description

### OSS InfluxDB Setup

#### Step 1: Download and install InfluxDB

On a server that's separate from your InfluxEnterprise cluster, download and install OSS InfluxDB:

```
~# wget https://dl.influxdata.com/influxdb/releases/influxdb_1.2.2_amd64.deb
~# sudo dpkg -i influxdb_1.2.2_amd64.deb
```

#### Step 2: Enable authentication

For security purposes, enable authentication in InfluxDB's [configuration file](/influxdb/v1.2/administration/config/).
The configuration file is located in `/etc/influxdb/influxdb.conf`.

In the `[http]` section, uncomment the `auth-enabled` option and set it to `true`:

```
[http]
  # Determines whether HTTP endpoint is enabled.
  # enabled = true

  # The bind address used by the HTTP service.
  # bind-address = ":8086"

  # Determines whether HTTP authentication is enabled.
  auth-enabled = true #💥
```

#### Step 3: Start InfluxDB

Next, start the InfluxDB process:

```
~# sudo systemctl start influxdb
```

#### Step 4: Create an admin user

Create an [admin user](/influxdb/v1.2/query_language/authentication_and_authorization/#user-types-and-privileges) on your InfluxDB instance.
Because you enabled authentication, you must perform this step before moving on to the next section.
Run the command below to create an admin user, replacing `chronothan` and `supersecret` with your own username and password.
Note that the password requires single quotes.

```
~# curl -XPOST "http://localhost:8086/query" --data-urlencode "q=CREATE USER chronothan WITH PASSWORD 'supersecret' WITH ALL PRIVILEGES"
```

A successful `CREATE USER` query returns a blank result:
```
{"results":[{"statement_id":0}]}   <--- Success!
```

### Telegraf Setup

Perform the following steps on each data node in your cluster.
You'll return to your OSS InfluxDB instance at the end of this section.

#### Step 1: Download and install Telegraf

```
~# wget https://dl.influxdata.com/telegraf/releases/telegraf_1.2.1_amd64.deb
~# sudo dpkg -i telegraf_1.2.1_amd64.deb
```

#### Step 2: Configure Telegraf

Configure Telegraf to write monitoring data to your OSS InfluxDB instance.
Telegraf's configuration file is located in `/etc/telegraf/telegraf.conf`.

First, in the `[[outputs.influxdb]]` section, set the `urls` option to the IP address and port of your OSS InfluxDB instance.
InfluxDB runs on port `8086` by default.
This step ensures that Telegraf writes data to your OSS InfluxDB instance.

```
[[outputs.influxdb]]
  ## The full HTTP or UDP endpoint URL for your InfluxDB instance.
  ## Multiple urls can be specified as part of the same cluster,
  ## this means that only ONE of the urls will be written to each interval.
  # urls = ["udp://localhost:8089"] # UDP endpoint example
  urls = ["http://xxx.xx.xxx.xxx:8086"] #💥
```

Next, in the same `[[outputs.influxdb]]` section, uncomment and set the `username` and `password` options to the username and password that you created in the [previous section](#step-4-create-an-admin-user).
Telegraf must be aware your username and password to successfully write data to your OSS InfluxDB instance.

```
[[outputs.influxdb]]
  ## The full HTTP or UDP endpoint URL for your InfluxDB instance.
  ## Multiple urls can be specified as part of the same cluster,
  ## this means that only ONE of the urls will be written to each interval.
  # urls = ["udp://localhost:8089"] # UDP endpoint example
  urls = ["http://xxx.xx.xxx.xxx:8086"] # required

  [...]

  ## Write timeout (for the InfluxDB client), formatted as a string.
  ## If not provided, will default to 5s. 0s means no timeout (not recommended).
  timeout = "5s"
  username = "chronothan" #💥
  password = "supersecret" #💥
```

Telegraf's [system stats](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugin is enabled by default and requires no additional configuration.
The input plugin automatically collects monitoring information about your data node, including CPU, disk, and memory usage data.
The enabled input plugins are located in the `INPUT PLUGINS` section of the configuration file; for example, here's the section that controls the CPU data collection:

```
###############################################################################
#                            INPUT PLUGINS                                    #
###############################################################################

# Read metrics about cpu usage
[[inputs.cpu]]
  ## Whether to report per-cpu stats or not
  percpu = true
  ## Whether to report total system cpu stats or not
  totalcpu = true
  ## If true, collect raw CPU time metrics.
  collect_cpu_time = false
```

#### Step 3: Restart Telegraf

Restart Telegraf for your configuration changes to take effect:
```
~# sudo systemctl restart telegraf
```

Repeat steps one through four for each data node in your cluster.

#### Step 4: Confirm the Telegraf setup

Run the following command on your OSS InfluxDB instance to see if your Telegraf instances are successfully collecting and writing data.
Replace the `chronothan` and `supersecret` values with your actual username and password.
```
~# curl -G "http://localhost:8086/query?db=telegraf&u=chronothan&p=supersecret&pretty=true" --data-urlencode "q=SHOW TAG VALUES FROM cpu WITH KEY=host"
```

The expected output is similar to the JSON in the codeblock below.
In this case, the `telegraf` database has three different [tag values](/influxdb/v1.2/concepts/glossary/#tag-value) for the `host` [tag key](/influxdb/v1.2/concepts/glossary/#tag-key): `data-node-01`, `data-node-02`, and `data-node-03`.
Those values match the hostnames of the three data nodes in the cluster; this means Telegraf is successfully writing monitoring data from those hosts to the OSS InfluxDB instance!
```
{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "cpu",
                    "columns": [
                        "key",
                        "value"
                    ],
                    "values": [
                        [
                            "host",
                            "data-node-01"
                        ],
                        [
                            "host",
                            "data-node-02"
                        ],
                        [
                            "host",
                            "data-node-03"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### Chronograf Setup

#### Step 1: Download and install Chronograf

Here, we download and install Chronograf on the same server as the OSS InfluxDB instance.
This is not a requirement; you may host Chronograf on a separate server.

```
~# wget https://dl.influxdata.com/chronograf/releases/chronograf_1.2.0~beta9_amd64.deb
~# sudo dpkg -i chronograf_1.2.0~beta9_amd64.deb
```

#### Step 2: Start Chronograf

```
~# sudo systemctl start chronograf
```

### Step 3: Connect Chronograf to the OSS InfluxDB instance

Visit `http://xxx.xx.xxx.xxx:8888` in your browser to access Chrongraf, replacing `xxx.xx.xxx.xxx` with the IP address of your OSS InfluxDB instance.
The welcome page includes instructions for connecting Chronograf to that instance.

![Connect Chronograf to InfluxDB](/img/chronograf/v1.3/g-cluster-welcome.png)

For the `Connection String`, enter the hostname or IP of your OSS InfluxDB instance, and be sure to include the default port: `8086`.
Next, name your data source; this can be anything you want.
Finally, enter your username and password and click `Add Source`.

### Step 4: Explore the monitoring data in Chronograf

Chronograf works with the Telegraf data in your OSS InfluxDB instance.
The `Host List` page, the first page that you see in Chronograf, shows your data node's hostnames, their statuses, CPU usage, load, and their configured [applications](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf).
In this case, you've only enabled the system stats input plugin so `system` is the single application that appears in the `Apps` column.

![Host List page](/img/chronograf/v1.3/g-cluster-hostlist.png)

Click on `system` to see Chronograf's pre-created dashboard for that application.
Keep an eye on your data nodes by viewing that dashboard for each hostname:

![Pre-created dashboard](/img/chronograf/v1.3/g-cluster-predash.gif)

Next, check out the Data Explorer to create a customized graph with the monitoring data.
In the image below, we use Chronograf's query editor to visualize the idle CPU usage data for each data node:

![Data Explorer](/img/chronograf/v1.3/g-cluster-de.png)

Create more customized graphs and save them to a dashboard on Chronograf's Dashboard page.
See the [Create a Dashboard](/chronograf/v1.3/guides/create-a-dashboard/) guide for more information.

That's it! You've successfully configured Telegraf to collect and write data, InfluxDB to store those data, and Chonograf to use those data for monitoring and visualization purposes.



