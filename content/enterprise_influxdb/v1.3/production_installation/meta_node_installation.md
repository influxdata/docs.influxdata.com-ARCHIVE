---
title: Step 1 - Meta Node Installation
aliases:
    - /enterprise/v1.3/production_installation/meta_node_installation/

menu:
  enterprise_influxdb_1_3:
    weight: 10
    parent: production_installation
    identifier: meta_production
---

InfluxEnterprise offers highly scalable clusters on your infrastructure
and a management UI ([via Chronograf](https://docs.influxdata.com/chronograf/latest) for working with clusters.
The Production Installation process is designed for users looking to
deploy InfluxEnterprise in a production environment.
The following steps will get you up and running with the first essential component of
your InfluxEnterprise cluster: the meta nodes.

> If you wish to evaluate InfluxEnterprise in a non-production
environment, feel free to follow the instructions outlined in the
[QuickStart Installation](/enterprise_influxdb/v1.3/quickstart_installation) section.
Please note that if you install InfluxEnterprise with the QuickStart Installation process you
will need to reinstall InfluxEnterprise with the Production Installation
process before using the product in a production environment.

<br>
# Meta Node Setup Description and Requirements

The Production Installation process sets up three [meta nodes](/enterprise_influxdb/v1.3/concepts/glossary/#meta-node)
and each meta node runs on its own server.
<br>
You **must** have a minimum of three meta nodes in a cluster.
InfluxEnterprise clusters require at least three meta nodes and an __**odd number**__
of meta nodes for high availability and redundancy.
We do not recommend having more than three meta nodes unless your servers
and/or the communication between the servers have chronic reliability issues.
<br>
Note: that there is no requirement for each meta node to run on its own server.  But, obviously, deploying 
multiple meta nodes on the same server creates a larger point of potential failure if that particular node is unresponsive.
Best practice is to deploy the meta nodes on relatively small footprint servers.

See the
[Clustering Guide](/enterprise_influxdb/v1.3/concepts/clustering#optimal-server-counts)
for more on cluster architecture.

### Other Requirements

#### License Key or File

InfluxEnterprise requires a license key **OR** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

#### Ports

Meta nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, meta nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the meta nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the meta node configuration file.

<br>
# Meta Node Setup
## Step 1: Modify the /etc/hosts File

Add your servers' hostnames and IP addresses to **each** cluster server's `/etc/hosts`
file (the hostnames below are representative).


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

## Step 2: Set up, Configure, and Start the Meta Services

Perform the following steps on each meta server.

### I. Download and Install the Meta Service

#### Ubuntu & Debian (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.3.6-c1.3.6_amd64.deb
sudo dpkg -i influxdb-meta_1.3.6-c1.3.6_amd64.deb
```

#### RedHat & CentOS (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.3.6_c1.3.6.x86_64.rpm
sudo yum localinstall influxdb-meta-1.3.6_c1.3.6.x86_64.rpm
```

### II. Edit the Configuration File

In `/etc/influxdb/influxdb-meta.conf`:

* uncomment and set `hostname` to the full hostname of the meta node
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

### III. Start the Meta Service

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

## Step 3: Join the Meta Nodes to the Cluster

From one and only one meta node, join all meta nodes including itself.
In our example, from `enterprise-meta-01`, run:
```
influxd-ctl add-meta enterprise-meta-01:8091

influxd-ctl add-meta enterprise-meta-02:8091

influxd-ctl add-meta enterprise-meta-03:8091
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
    Data Nodes
    ==========
    ID      TCP Address      Version
>
    Meta Nodes
    ==========
    TCP Address               Version
    enterprise-meta-01:8091   1.3.6-c1.3.6
    enterprise-meta-02:8091   1.3.6-c1.3.6
    enterprise-meta-03:8091   1.3.6-c1.3.6

Note that your cluster must have at least three meta nodes.
If you do not see your meta nodes in the output, please retry adding them to
the cluster.

Once your meta nodes are part of your cluster move on to [the next steps to
set up your data nodes](/enterprise_influxdb/v1.3/production_installation/data_node_installation/).
Please do not continue to the next steps if your meta nodes are not part of the
cluster.
    
