---
title: Installation
menu:
  chronograf_1_3:
    weight: 10
    parent: Introduction
---

This page provides the requirements for installing, starting, and configuring Chronograf.
For the fastest way to get up and running with Chronograf, see the [Getting Started](/chronograf/v1.3/introduction/getting-started/) guide.

### Content

* [Requirements](#requirements)
  * [TICK](#tick)
  * [Networking](#networking)
* [Builds](#builds)
* [Configuration and Security](#configuration-and-security)

## Requirements

Installation of the Chronograf package may require `root` or administrator privileges to complete successfully.

### TICK
Chronograf is the UI for the other components of the [TICK stack](https://www.influxdata.com/products/): Telegraf, InfluxDB/InfluxEnterprise Clustering, and Kapacitor.
You do not need to install every component of the TICK stack to use Chronograf.
The following sections give a brief description of the other TICK stack components, how they fit within Chronograf, and if they are necessary for your setup.

#### Telegraf (required)
[Telegraf](/telegraf/v1.3/) is InfluxData's plugin-driven server agent for collecting & reporting metrics.
Telegraf collects data and writes data to the InfluxDB instance or InfluxEnterprise cluster that's connected to Chronograf.
Chronograf is designed to work with Telegraf data and offers [pre-created dashboards](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf) for several Telegraf input plugins.

Chronograf requires at least one Telegraf instance that collects data and writes the data to an InfluxDB instance or InfluxEnterprise cluster.
At a minimum, the Telegraf instance must have enabled the [system statistics](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugin; that input plugin provides the system-level data necessary for the Chronograf interface. 

**Installation Resources:**

* [Getting Started](/chronograf/v1.3/introduction/getting-started/) offers setup instructions for using Chronograf and InfluxDB with one Telegraf instance
* [Monitor an InfluxEnterprise Cluster](/chronograf/v1.3/guides/monitor-an-influxenterprise-cluster/) offers setup instructions for using Chronograf and an InfluxEnterprise Cluster with several Telegraf instances
* [Telegraf Documentation](/telegraf/v1.3/) 

#### InfluxDB/InfluxEnterprise cluster (required)
[InfluxDB](/influxdb/v1.2/) is InfluxData's open source time-series database built from the ground up to handle high write and query loads.
[InfluxEnterprise](/enterprise/v1.2/) is InfluxData's closed source time-series database with clustering.
InfluxDB instances and InfluxEnterprise clusters store the time-series data that populate the Chronograf interface.

Chronograf requires at least one InfluxDB instance or one InfluxEnterprise cluster to serve as its data storage component.
A single Chronograf instance can support several InfluxDB instances or InfluxEnterprise clusters.

**Installation Resources:**

* [Getting Started](/chronograf/v1.3/introduction/getting-started/) offers setup instructions for using Chronograf with an InfluxDB instance
* [Monitor an InfluxEnterprise Cluster](/chronograf/v1.3/guides/monitor-an-influxenterprise-cluster/) offers setup instructions for using Chronograf with an InfluxEnterprise Cluster
* [InfluxDB Documentation](/influxdb/v1.2/) 
* [InfluxEnterprise Documentation](/enterprise/v1.2/) 

#### Kapacitor (optional)
[Kapacitor](/kapacitor/v1.3/) is InfluxData’s processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.
Kapacitor is responsible for creating and sending alerts in Chronograf.

Chronograf requires at least one Kapacitor instance if you plan on using Chronograf for creating, sending, and managing alerts.
Kapacitor instances are scoped to the InfluxDB instance or InfluxEnterprise cluster that connects to Chronograf.
An InfluxDB instance or InfluxEnterprise cluster can support more than one Kapacitor instance.

You do not need a Kapacitor instance if you plan on only using Chronograf's host list, data explorer, dashboard, and admin pages.

**Installation Resources:**

* [Getting Started](/chronograf/v1.3/introduction/getting-started/) offers setup instructions for using Chronograf with a Kapacitor instance
* [Configure Kapacitor Event Handlers](/chronograf/v1.3/guides/configure-kapacitor-event-handlers/) offers setup instructions for Kapacitor event handlers in Chronograf
* [Kapacitor Documentation](/kapacitor/v1.3/) 

### Networking

Chronograf runs on `localhost` port `8888` by default.
Those settings are [configurable](/chronograf/v1.3/administration/configuration/#application-options).

## Builds

The latest Chronograf builds are available on InfluxData's [Downloads page](https://influxdata.com/downloads).
See Chronograf's [README](https://github.com/influxdata/chronograf/blob/master/README.md#from-source) on GitHub for instructions on building from source.

### Using TAR packages
If you choose to use the TAR packages, as opposed to the operating system package management tools (such as `yum`, `wget`, etc.), there are a couple of things that you should be aware of.

First, when you start-up Chronograf, we recommend that you specify a location for the underlying datastore as a default location is not specified.  
If you do NOT specify a location for the underlying datastore, a datastore named `chronograf-v1.db` will be created in the directory from which you start Chronograf.

Second, specifying the location of the underlying datastore is important because as you take advantage of future release of Chronograf (maintenance releases or feature bearing), you will want to refer to this underlying datastore to preserve your dashboards and datasource configuration.  

If you simply un-TAR the downloaded package and restart Chronograf, you will reinitalize the local datastore -- and it will appear as though all of your previous configurations and dashboards have disappeared.  

The package management tools provided by the operating system deal with the version changes in the underlying software, but when using TAR, the version number is embedded in the directory structure and you end up with multiple side-by-side versions of the software.

The recommended way to address this issue when using the TAR package is to do the following:

In your home directory, create a sub-directory called `.chronograf`:
```
mkdir ~/.chronograf
```

When starting up Chronograf use the `-b` option to specify the location of this directory for the local datastore:
```
./chronograf-<version>/usr/bin/chronograf -b ~/.chronograf/chronograf-v1.db
```

The next time you un-TAR a new version of Chronograf, simply change the `<version>` portion of the command string and specify your existing `chronograf-v1.db` datastore.

## Configuration and Security

See the [Configuration](/chronograf/v1.3/administration/configuration/) document for a description of the available configuration options.
See [Security Best Practices](/chronograf/v1.3/administration/security-best-practices/) for TLS and OAUTH 2.0 setup instructions.

