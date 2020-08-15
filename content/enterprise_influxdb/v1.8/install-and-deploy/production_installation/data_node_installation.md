---
title: Step 2 - Install InfluxDB Enterprise data nodes
aliases:
    - /enterprise_influxdb/v1.8/production_installation/data_node_installation/
menu:
  enterprise_influxdb_1_8:
    name: Step 2 - Install data nodes
    weight: 20
    parent: Install in your environment
---

InfluxDB Enterprise offers highly scalable clusters on your infrastructure
and a management UI for working with clusters.
The next steps will get you up and running with the second essential component of
your InfluxDB Enterprise cluster: the data nodes.

If you have not set up your meta nodes, please visit
[Installing meta nodes](/enterprise_influxdb/v1.8/install-and-deploy/production_installation/meta_node_installation/).
Bad things can happen if you complete the following steps without meta nodes.

<br>
# Data node setup description and requirements

The Production Installation process sets up two [data nodes](/enterprise_influxdb/v1.8/concepts/glossary#data-node)
and each data node runs on its own server.
You **must** have a minimum of two data nodes in a cluster.
InfluxDB Enterprise clusters require at least two data nodes for high availability and redundancy.
<br>
Note: that there is no requirement for each data node to run on its own
server.  However, best practices are to deploy each data node on a dedicated server.

See the
[Clustering guide](/enterprise_influxdb/v1.8/concepts/clustering/#optimal-server-counts)
for more on cluster architecture.

### Other requirements

#### License key or file

InfluxDB Enterprise requires a license key **OR** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

#### Networking

Data nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, data nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the data nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the data node configuration file.

#### Load balancer

InfluxDB Enterprise does not function as a load balancer.
You will need to configure your own load balancer to send client traffic to the
data nodes on port `8086` (the default port for the [HTTP API](/influxdb/v1.8/tools/api/)).

#### User account

The installation package creates user `influxdb` that is used to run the influxdb data service.  `influxdb` user also owns  certain files that are needed for the service to start successfully.  In some cases, local policies may prevent the local user account from being created and the service fails to start.  Contact your systems administrator for assistance with this requirement.

# Data node setup
## Step 1: Add appropriate DNS entries for each of your servers

Ensure that your servers' hostnames and IP addresses are added to your network's DNS environment.
The addition of DNS entries and IP assignment is usually site and policy specific; contact your DNS administrator for assistance as necessary.
Ultimately, use entries similar to the following (hostnames and domain IP addresses are representative).

| Record Type |               Hostname                |                IP |
|:------------|:-------------------------------------:|------------------:|
| A           | ```enterprise-data-01.mydomain.com``` | ```<Data_1_IP>``` |
| A           | ```enterprise-data-02.mydomain.com``` | ```<Data_2_IP>``` |
```

> **Verification steps:**
>
Before proceeding with the installation, verify on each meta and data server that the other
servers are resolvable. Here is an example set of shell commands using `ping`:
>
    ping -qc 1 enterprise-meta-01
    ping -qc 1 enterprise-meta-02
    ping -qc 1 enterprise-meta-03
    ping -qc 1 enterprise-data-01
    ping -qc 1 enterprise-data-02

We highly recommend that each server be able to resolve the IP from the hostname alone as shown here.
Resolve any connectivity issues before proceeding with the installation.
A healthy cluster requires that every meta node and data node in a cluster be able to communicate.

## Step 2: Set up, configure, and start the data node services

Perform the following steps on each data node.

### I. Download and install the data service

#### Ubuntu and Debian (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.8.0-c1.8.0_amd64.deb
sudo dpkg -i influxdb-data_1.8.0-c1.8.0_amd64.deb
```

#### RedHat and CentOS (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.8.0_c1.8.0.x86_64.rpm
sudo yum localinstall influxdb-data-1.8.0_c1.8.0.x86_64.rpm
```

#### Verify the authenticity of release download (recommended)

For added security, follow these steps to verify the signature of your InfluxDB download with `gpg`.

1. Download and import InfluxData's public key:

    ```
    curl -sL https://repos.influxdata.com/influxdb.key | gpg --import
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```
    wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.8.0_c1.8.0.x86_64.rpm.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb-data-1.8.0_c1.8.0.x86_64.rpm.asc influxdb-data-1.8.0_c1.8.0.x86_64.rpm
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxDB Packaging Service <support@influxdb.com>" [unknown]
    ```

### II. Edit the data node configuration files

First, in `/etc/influxdb/influxdb.conf`:

* Uncomment `hostname` at the top of the file and set it to the full hostname of the data node.
* Uncomment `auth-enabled` in the `[http]` section and set it to `true`.
* Uncomment `meta-auth-enabled` in the `[meta]` section and set it to `true`.
* Uncomment `meta-internal-shared-secret` in the `[meta]` section and set it to a long pass phrase. The internal shared secret is used in JWT authentication for intra-node communication. This value must be same for all of your data nodes and match the `[meta] internal-shared-secret` value in the configuration files of your meta nodes.

Second, in `/etc/influxdb/influxdb.conf`, set:

`license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.

{{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

```toml
# Change this option to true to disable reporting.
# reporting-disabled = false
# bind-address = ":8088"
hostname="<enterprise-data-0x>"

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" # Mutually exclusive with license-path

  # The path to a valid license file.  license-key and license-path are mutually exclusive,
  # use only one and leave the other blank.
  license-path = "/path/to/readable/JSON.license.file" # Mutually exclusive with license-key

[meta]
  # Where the cluster metadata is stored
  dir = "/var/lib/influxdb/meta" # data nodes do require a local meta directory
...
  # This setting must have the same value as the meta nodes' meta.auth-enabled configuration.
  meta-auth-enabled = true

[...]

[http]
  # Determines whether HTTP endpoint is enabled.
  # enabled = true

  # The bind address used by the HTTP service.
  # bind-address = ":8086"

  # Determines whether HTTP authentication is enabled.
  auth-enabled = true # Recommended, but not required

[...]

  # The JWT auth shared secret to validate requests using JSON web tokens.
  shared-secret = "long pass phrase used for signing tokens"
```

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


If you do not see the expected output, the process is either not launching or is exiting prematurely. Check the [logs](/enterprise_influxdb/v1.8/administration/logs/) for error messages and verify the previous setup steps are complete.

If you see the expected output, repeat for the remaining data nodes.
Once all data nodes have been installed, configured, and launched, move on to the next section to join the data nodes to the cluster.

## Join the data nodes to the cluster

{{% warn %}}You should join your data nodes to the cluster only when you are adding a brand new node,
either during the initial creation of your cluster or when growing the number of data nodes.
If you are replacing an existing data node with `influxd-ctl update-data`, skip the rest of this guide.
{{% /warn %}}

On one and only one of the meta nodes that you set up in the
[previous document](/enterprise_influxdb/v1.8/introduction/meta_node_installation/), run:

```bash
influxd-ctl add-data enterprise-data-01:8088

influxd-ctl add-data enterprise-data-02:8088
```

The expected output is:

```bash
Added data node y at enterprise-data-0x:8088
```

Run the `add-data` command once and only once for each data node you are joining
to the cluster.

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
    ID   TCP Address               Version
    4    enterprise-data-01:8088   1.8.0-c1.8.0
    5    enterprise-data-02:8088   1.8.0-c1.8.0

>
    Meta Nodes
    ==========
    TCP Address               Version
    enterprise-meta-01:8091   1.8.0-c1.8.0
    enterprise-meta-02:8091   1.8.0-c1.8.0
    enterprise-meta-03:8091   1.8.0-c1.8.0


The output should include every data node that was added to the cluster.
The first data node added should have `ID=N`, where `N` is equal to one plus the number of meta nodes.
In a standard three meta node cluster, the first data node should have `ID=4`
Subsequently added data nodes should have monotonically increasing IDs.
If not, there may be artifacts of a previous cluster in the metastore.

If you do not see your data nodes in the output, please retry adding them
to the cluster.

Once your data nodes are part of your cluster move on to [the final step
to set up Chronograf](/enterprise_influxdb/v1.8/install-and-deploy/production_installation/chrono_install).
