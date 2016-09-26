---
title: Step 1 - Meta Node Installation
menu:
  enterprise_1_0:
    weight: 10
    parent: Introduction
---

InfluxEnterprise offers highly scalable clusters on your infrastructure
and a management UI for working with clusters.
The next steps will get you up and running with the first essential component of
your InfluxEnterprise cluster: the meta nodes.

### Requirements

To get started, you'll need the license key that you received at
[InfluxPortal](https://portal.influxdata.com/) as well as several servers.
The steps below set up three
[meta nodes](/enterprise/v1.0/concepts/glossary/#meta-node) with each meta node
on its own server.

Please note that there is no requirement to use that number of servers.
The meta process can run on the same or different servers.
For high availability and redundancy your cluster should have at least three
meta nodes and an odd number of meta nodes.

> **Note:** By default, data and meta nodes communicate with each other on
ports `8091` and `8088`.

## Meta Node Setup

### Modify the /etc/hosts file

Add your servers' hostnames and IP addresses to **each** cluster server's `/etc/hosts`
file (the hostnames are representative):

```
<Meta_1_IP> enterprise-meta-01
<Meta_2_IP> enterprise-meta-02
<Meta_3_IP> enterprise-meta-03
```

> **Verification steps:**
>
Before proceeding with the installation, verify on each server that the other
servers are resolvable. Here is an example set of shell commands using `ping`:
>
    ping -qc 1 enterprise-meta-01
    ping -qc 1 enterprise-meta-02
    ping -qc 1 enterprise-meta-03


If there are any connectivity issues resolve them before proceeding with the
installation.
A healthy cluster requires that every meta node can communicate with every other
meta node.

### Set up, configure, and start the meta servers

On all three meta servers:

#### 1. Download and install the meta server package

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta_1.0.0-c1.0.0_amd64.deb
sudo dpkg -i influxdb-meta_1.0.0-c1.0.0_amd64.deb
```

##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta-1.0.0_c1.0.0.x86_64.rpm
sudo yum localinstall influxdb-meta-1.0.0_c1.0.0.x86_64.rpm
```

#### 2. Edit the configuration file

In `/etc/influxdb/influxdb-meta.conf`, set:

* `hostname` to the meta node’s hostname
* `registration-enabled` to `true`
* `registration-server-url` to the full URL of the server that will run the InfluxEnterprise web console.
You must fully specify the protocol, IP or hostname, and port.
Entering the IP or hostname alone will lead to errors.
* `license-key` to the license key you received on [InfluxPortal](https://portal.influxdata.com/)

```
reporting-disabled = false
bind-address = ""
hostname = "<enterprise-meta-0x>" #✨

[enterprise]
 registration-enabled = true #✨
 registration-server-url = "http://<web-console-server-IP>:3000" #✨
 license-key = "<your_license_key>" #✨
 license-path = ""

[meta]
 dir = "/var/lib/influxdb/meta"
 bind-address = ":8089"
 [...]
 pprof-enabled = false
 lease-duration = "1m0s"
```

> **Note:** If you’re using a license file instead of a license key, set the
`license-path` setting to the path of the license file.

#### 3. Start the meta node

On sysvinit systems, enter:
```
service influxdb-meta start
```

On systemd systems, enter:
```
sudo systemctl start influxdb-meta
```

> **Verification steps:**
>
Check to see that the process is running by entering:
>
    ps aux | grep -v grep | grep influxdb-meta
>
You should see output similar to:
>
    influxdb  3207  0.8  4.4 483000 22168 ?        Ssl  17:05   0:08 /usr/bin/influxd-meta -config /etc/influxdb/influxdb-meta.conf

<br>


> **Note:** It is possible to start the cluster with a single meta node but you
must pass the `-single-server flag` when starting the single meta node.
Please note that a cluster with only one meta node is **not** recommended for
production environments.

### Join the meta nodes to the cluster

From `enterprise-meta-01`, enter:
```
influxd-ctl join enterprise-meta-01:8091

influxd-ctl join enterprise-meta-02:8091

influxd-ctl join enterprise-meta-03:8091
```

> **Note:** Please make sure that you specify the fully qualified host name of
the meta node during the join process.
Please do not specify `localhost` as this can cause cluster connection issues.

The expected output is:
```
Added meta node x at enterprise-meta-0x:8091
```

> **Verification steps:**
>
Issue the following command on any meta node:
>
    influxd-ctl show
>
The expected output is:
>
    Meta Nodes
    ==========
    TCP Address
    enterprise-meta-01:8091
    enterprise-meta-02:8091
    enterprise-meta-03:8091

Note that your cluster must have at least three meta nodes.
If you do not see your meta nodes in the output, please retry adding them to
the cluster.

Once your meta nodes are part of your cluster move on to [the next steps to
set up your data nodes](/enterprise/v1.0/introduction/data_node_installation/).
Please do not continue to the next steps if your meta nodes are not part of the
cluster.
