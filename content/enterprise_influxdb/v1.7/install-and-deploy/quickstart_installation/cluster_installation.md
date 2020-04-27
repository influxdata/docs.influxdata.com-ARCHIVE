---
title: Step 1 - Installing an InfluxDB Enterprise cluster
aliases:
    - /enterprise_influxdb/v1.7/quickstart_installation/cluster_installation/
menu:
  enterprise_influxdb_1_7:
    name: Step 1 - Install InfluxDB Enterprise cluster
    weight: 10
    parent: Install for evaluation
---

InfluxDB Enterprise offers highly scalable clusters on your infrastructure
and a management UI for working with clusters.
The quickstart installation process will get you up and running with your
InfluxDB Enterprise cluster.


>The quickstart installation process **is not** designed for use in a production environment.
>
>To use InfluxDB Enterprise in a production environment,
>follow the [production installation](/enterprise_influxdb/v1.7/install-and-deploy/production_installation/) instructions.
>
>Please note that if you install InfluxDB Enterprise with the quickstart installation process you
>will need to reinstall InfluxDB Enterprise with the production installation
>process before using the product in a production environment.

## Setup description and requirements

### Setup description

The QuickStart installation process sets up an InfluxDB Enterprise cluster on three servers.
Each server is a [meta node](/enterprise_influxdb/v1.7/concepts/glossary/#meta-node) and
a [data node](/enterprise_influxdb/v1.7/concepts/glossary/#data-node), that is, each server
runs both the [meta service](/enterprise_influxdb/v1.7/concepts/glossary/#meta-service)
and the [data service](/enterprise_influxdb/v1.7/concepts/glossary/#data-service).

### Requirements

#### License key or file

InfluxDB Enterprise requires a license key **OR** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

#### Networking

Meta nodes and data nodes communicate over ports `8088`,
`8089`, and `8091`.

For licensing purposes, meta nodes and data nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the meta node and data node configuration files.

#### Load balancer

InfluxDB Enterprise does not function as a load balancer.
You will need to configure your own load balancer to send client traffic to the
data nodes on port `8086` (the default port for the [HTTP API](/influxdb/v1.7/tools/api/)).

## Step 1: Modify the `/etc/hosts` file in each of your servers

Add your three servers' hostnames and IP addresses to **each** of your server's `/etc/hosts`
file.

The hostnames below are representative:

```
<Server_1_IP_Address> quickstart-cluster-01
<Server_2_IP_Address> quickstart-cluster-02
<Server_3_IP_Address> quickstart-cluster-03
```

> **Verification steps:**
>
Before proceeding with the installation, verify on each server that the other
servers are resolvable. Here is an example set of shell commands using `ping` and the
output for `quickstart-cluster-01`:
>

```
    ping -qc 1 quickstart-cluster-01
    ping -qc 1 quickstart-cluster-02
    ping -qc 1 quickstart-cluster-03

    > ping -qc 1 quickstart-cluster-01
    PING quickstart-cluster-01 (Server_1_IP_Address) 56(84) bytes of data.

    --- quickstart-cluster-01 ping statistics ---
    1 packets transmitted, 1 received, 0% packet loss, time 0ms
    rtt min/avg/max/mdev = 0.064/0.064/0.064/0.000 ms
```

If there are any connectivity issues please resolve them before proceeding with the
installation.
A healthy cluster requires that every meta node and data node can communicate with every other
meta node and data node.

## Step 2: Set up the meta nodes

Perform the following steps on all three servers.

### I. Download and install the meta service


#### Ubuntu and Debian (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.7.10-c1.7.10_amd64.deb
sudo dpkg -i influxdb-meta_1.7.10-c1.7.10_amd64.deb
```

#### RedHat and CentOS (64-bit)]

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.7.10_c1.7.10.x86_64.rpm
sudo yum localinstall influxdb-meta-1.7.10_c1.7.10.x86_64.rpm
```

### II. Edit the meta service configuration file

In `/etc/influxdb/influxdb-meta.conf`:

* uncomment and set `hostname` to the full hostname of the meta node
* set `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.

{{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

```toml
# Hostname advertised by this host for remote addresses.  This must be resolvable by all
# other nodes in the cluster
hostname="<quickstart-cluster-0x>" #✨

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" #✨ mutually exclusive with license-path

  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-path = "/path/to/readable/JSON.license.file" #✨ mutually exclusive with license-key
```

> **Note:** The `hostname` in the configuration file must match the `hostname` in your server's `/etc/hosts` file.

### III. Start the meta service

On sysvinit systems, enter:

```bash
service influxdb-meta start
```

On systemd systems, enter:

```bash
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

## Step 3: Set up the data nodes

Perform the following steps on all three servers.

### I. Download and install the data service

#### Ubuntu and Debian (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.7.10-c1.7.10_amd64.deb
sudo dpkg -i influxdb-data_1.7.10-c1.7.10_amd64.deb
```

#### RedHat and CentOS (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.7.10_c1.7.10.x86_64.rpm
sudo yum localinstall influxdb-data-1.7.10_c1.7.10.x86_64.rpm
```

### II. Edit the data service configuration file

First, in `/etc/influxdb/influxdb.conf`, uncomment:

* `hostname` at the top of the file and set it to the full hostname of the data node
* `auth-enabled` in the `[http]` section and set it to `true`
* `shared-secret` in the `[http]` section and set it to a long pass phrase that will be used to sign tokens for intra-cluster communication. This value needs to be consistent across all data nodes.

> **Note:** When you enable authentication, InfluxDB only executes HTTP requests that are sent with valid credentials.
See the [authentication section](/influxdb/latest/administration/authentication_and_authorization/#authentication) for more information.

Second, in `/etc/influxdb/influxdb.conf`, set:

`license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.

{{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

```toml
# Change this option to true to disable reporting.
# reporting-disabled = false
# bind-address = ":8088"
hostname="<quickstart-cluster-0x>" #✨

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" #✨ mutually exclusive with license-path

  # The path to a valid license file.  license-key and license-path are mutually exclusive,
  # use only one and leave the other blank.
  license-path = "/path/to/readable/JSON.license.file" #✨ mutually exclusive with license-key

[meta]
  # Where the cluster metadata is stored
  dir = "/var/lib/influxdb/meta" # data nodes do require a local meta directory

[...]

[http]
  # Determines whether HTTP endpoint is enabled.
  # enabled = true

  # The bind address used by the HTTP service.
  # bind-address = ":8086"

  # Determines whether HTTP authentication is enabled.
  auth-enabled = true #✨ this is recommended but not required

[...]

  # The JWT auth shared secret to validate requests using JSON web tokens.
  shared-secret = "long pass phrase used for signing tokens" #✨
```

> **Note:** The `hostname` in the configuration file must match the `hostname` in your server's `/etc/hosts` file.

### III. Start the data service

On sysvinit systems, enter:

```bash
service influxdb start
```

On systemd systems, enter:

```bash
sudo systemctl start influxdb
```

> **Verification steps:**
>
Check to see that the process is running by entering:
>
    ps aux | grep -v grep | grep influxdb
>
You should see output similar to:
>
    influxdb  2706  0.2  7.0 571008 35376 ?        Sl   15:37   0:16 /usr/bin/influxd -config /etc/influxdb/influxdb.conf
>
If you do not see the expected output, the process is either not launching or is exiting prematurely. Check the [logs](/enterprise_influxdb/v1.7/administration/logs/) for error messages and verify the previous setup steps are complete.

## Step 4: Join the nodes to the cluster

### I. Create the cluster

From the command line of the first server (`quickstart-cluster-01`), run the following commands to add the meta node service to all servers in your cluster:

```bash
$ influxd-ctl add-meta quickstart-cluster-01:8091
Added meta node 1 at quickstart-cluster-01:8091
$ influxd-ctl add-meta quickstart-cluster-02:8091
Added meta node 2 at quickstart-cluster-02:8091
$ influxd-ctl add-meta quickstart-cluster-03:8091
Added meta node 3 at quickstart-cluster-03:8091
```

From the same `quickstart-cluster-01` host, run the following commands to add the data nodes:

```bash
$ influxd-ctl add-data quickstart-cluster-02:8088
Added data node 4 at quickstart-cluster-02:8088
$ influxd-ctl add-data quickstart-cluster-03:8088
Added data node 5 at quickstart-cluster-03:8088
```

### II. Verify your cluster

On the same server, verify the cluster members using `influxd-ctl show`.

The expected output is:

```bash
Data Nodes
==========
ID	TCP Address		Version
4	quickstart-cluster-02:8088	1.7.10-c1.7.10
5	quickstart-cluster-03:8088	1.7.10-c1.7.10

Meta Nodes
==========
TCP Address		Version
quickstart-cluster-01:8091		1.7.10-c1.7.10
quickstart-cluster-02:8091	    1.7.10-c1.7.10
quickstart-cluster-03:8091	    1.7.10-c1.7.10
```

Your InfluxDB Enterprise cluster should now have three meta nodes and two data nodes.
If you do not see your meta or data nodes in the output, please retry adding them to the cluster.

Once all of your nodes are joined to the cluster, move on to the [next step](/enterprise_influxdb/v1.7/install-and-deploy/quickstart_installation/chrono_install)
in the QuickStart installation to set up Chronograf.
