---
title: Step 1 - Installing InfluxDB Enterprise meta nodes
aliases:
    - /enterprise/v1.5/production_installation/meta_node_installation/

menu:
  enterprise_influxdb_1_5:
    weight: 10
    parent: Production installation
---

InfluxDB Enterprise offers highly scalable clusters on your infrastructure
and a management user interface ([using Chronograf](https://docs.influxdata.com/chronograf/latest) for working with clusters.
The Production Installation process is designed for users looking to
deploy InfluxDB Enterprise in a production environment.
The following steps will get you up and running with the first essential component of
your InfluxDB Enterprise cluster: the meta nodes.

> If you wish to evaluate InfluxDB Enterprise in a non-production
environment, feel free to follow the instructions outlined in the
[QuickStart installation](/enterprise_influxdb/v1.5/quickstart_installation) section.
Please note that if you install InfluxDB Enterprise with the QuickStart Installation process you
will need to reinstall InfluxDB Enterprise with the Production Installation
process before using the product in a production environment.


## Meta node setup description and requirements

The Production Installation process sets up three [meta nodes](/enterprise_influxdb/v1.5/concepts/glossary/#meta-node)
with each meta node service runs on an independent server.

You **must** have a minimum of three meta nodes in a cluster.
InfluxDB Enterprise clusters require at least three meta nodes and an __**odd number**__
of meta nodes for high availability and redundancy.
We do not recommend having more than three meta nodes unless your servers,
or the communication between the servers, have chronic reliability issues.

> **Note:** While there is no requirement for each meta node to run on its own server, deploying
multiple meta nodes on the same server creates a larger point of potential failure if that node is unresponsive. InfluxData recommends that you deploy the meta nodes on relatively small footprint servers.

See [Clustering in InfluxDB Enterprise](/enterprise_influxdb/v1.5/concepts/clustering#optimal-server-counts)
for more on cluster architecture.

## Other requirements

### License key or file

InfluxDB Enterprise requires a license key **OR** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

### Ports

Meta nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, meta nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the meta nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the meta node configuration file.


## Meta node setup

### Step 1: Modify the `/etc/hosts` file

Add your servers' hostnames and IP addresses to **each** of the cluster server's `/etc/hosts`
file (the hostnames below are representative).

```
<Meta_1_IP> enterprise-meta-01
<Meta_2_IP> enterprise-meta-02
<Meta_3_IP> enterprise-meta-03
```

#### Verify the meta nodes are resolvable

Before proceeding with the installation, verify on each server that the other
servers are resolvable. Here is an example set of shell commands using `ping`:

```
    ping -qc 1 enterprise-meta-01
    ping -qc 1 enterprise-meta-02
    ping -qc 1 enterprise-meta-03
```

If there are any connectivity issues resolve them before proceeding with the
installation.
A healthy cluster requires that every meta node can communicate with every other
meta node.

### Step 2: Set up, configure, and start the meta node services

Complete the following steps for each meta node server.

#### 2A: Download and install the meta node services

##### Ubuntu & Debian (64-bit)

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.5.3-c1.5.3_amd64.deb
sudo dpkg -i influxdb-meta_1.5.3-c1.5.3_amd64.deb
```

##### RedHat and CentOS (64-bit)

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.5.3_c1.5.3.x86_64.rpm
sudo yum localinstall influxdb-meta-1.5.3_c1.5.3.x86_64.rpm
```

#### 2B: Edit the configuration file

In `/etc/influxdb/influxdb-meta.conf`:

* uncomment and set `hostname` to the hostname of the meta node.
* set `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.

<dt>
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
</dt>

```
# Hostname advertised by this host for remote addresses.  This must be resolvable by all
# other nodes in the cluster
hostname="<enterprise-meta-0x>" #✨

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" #✨ mutually exclusive with license-path

  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-path = "/path/to/readable/JSON.license.file" #✨ mutually exclusive with license-key
```

#### 2C: Start the meta service

On `sysvinit` systems, run:

```
service influxdb-meta start
```

On `systemd` systems, run:

```
sudo systemctl start influxdb-meta
```

##### Verify the meta node service started

Check to see that the service is running by entering:

```
ps aux | grep -v grep | grep influxdb-meta
```

You should see output similar to:

```
    influxdb  3207  0.8  4.4 483000 22168 ?        Ssl  17:05   0:08 /usr/bin/influxd-meta -config /etc/influxdb/influxdb-meta.conf
```

> **Note:** A cluster with only one meta node is **not recommended** for
production environments.
You can start the cluster with a single meta node using the `-single-server` flag when starting the single meta node.

### Join the meta nodes to the cluster

Using only one meta node, join all meta nodes.
In our example, from `enterprise-meta-01`, run:

```
influxd-ctl add-meta enterprise-meta-01:8091

influxd-ctl add-meta enterprise-meta-02:8091

influxd-ctl add-meta enterprise-meta-03:8091
```

> **Note:** Specify the hostname of the meta node during the join process.
Do not specify `localhost`, which can cause cluster connection issues.

The expected output is:

```
Added meta node x at enterprise-meta-0x:8091
```

## Verify your meta nodes installation

Issue the following command on any meta node:

```
influxd-ctl show
```

The expected output is:

```
    Data Nodes
    ==========
    ID      TCP Address      Version

    Meta Nodes
    ==========
    TCP Address               Version
    enterprise-meta-01:8091   1.5.3-c1.5.3
    enterprise-meta-02:8091   1.5.3-c1.5.3
    enterprise-meta-03:8091   1.5.3-c1.5.3
```

Your cluster must have at least three meta nodes.
If you do not see your meta nodes in the output, retry adding them to
the cluster.

Once your meta nodes are part of your cluster, you can proceed to [installing your data nodes](/enterprise_influxdb/v1.5/production_installation/data_node_installation/).
