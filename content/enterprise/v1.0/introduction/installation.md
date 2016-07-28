---
title: Installation
menu:
  enterprise_1_0:
    weight: 10
    parent: Introduction
---

## Introduction

InfluxEnterprise offers highly scalable clusters on your infrastructure
and a management UI for working with clusters.
This guide will get you up and running with an InfluxEnterprise cluster and
[web console](/enterprise/v1.0/concepts/glossary/#web-console).

### Requirements

To get started, you'll need the license key that you received at
[InfluxPortal](https://portal.influxdata.com/) as well as several servers.
The steps below set up a five server cluster; three servers are
[meta nodes](/enterprise/v1.0/concepts/glossary/#meta-node) and
two serve as [data nodes](/enterprise/v1.0/concepts/glossary#data-node).

Please note that there is no requirement to use that number of servers.
The meta and data processes can run on the same or different servers.
Your cluster **must** have:

* at least three meta nodes
* an odd number of meta nodes
* at least two data nodes

> **Note:** By default, data and meta nodes communicate with each other on
ports `8091` and `8088`.
In a clustered setup you’ll want to configure a load balancer to point to the
data nodes on port `8086`, the default port for the
[HTTP API](https://docs.influxdata.com/influxdb/v1.0/tools/api/) for writing and
querying data.

## Cluster setup

### Modify the /etc/hosts file

Add your servers' hostnames and IP addresses to **each** server's `/etc/hosts`
file (the hostnames are representative):

```
<Meta_1_IP> enterprise-beta-meta-01
<Meta_2_IP> enterprise-beta-meta-02
<Meta_3_IP> enterprise-beta-meta-03
<Data_1_IP> enterprise-beta-data-01
<Data_2_IP> enterprise-beta-data-02
```

### Set up, configure, and start the meta servers

On all three meta servers:

#### 1. Download and install the meta server package

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta_1.0.0-beta2-c0.7.1_amd64.deb
sudo dpkg -i influxdb-meta_1.0.0-beta2-c0.7.1_amd64.deb
```

##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta-1.0.0_beta2_c0.7.1.x86_64.rpm
sudo yum localinstall influxdb-meta-1.0.0_beta2_c0.7.1.x86_64.rpm
```

#### 2. Edit the configuration file

In `/etc/influxdb/influxdb-meta.conf`, set:

* `hostname` to the meta node’s hostname
* `registration-enabled` to `true`
* `registration-server-url` to the IP address of the server that will run the InfluxEnterprise web console
* `license-key` to the license key you received on [InfluxPortal](https://portal.influxdata.com/)

```
reporting-disabled = false
bind-address = ""
hostname = "<enterprise-beta-meta-0x>" #✨

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

```
/etc/init.d/influxdb-meta start
```
or
```
$ service influxdb-meta start
```

The expected output of this command is:
```
Starting the process influxdb-meta [ OK ]
influxdb-meta process was started [ OK ]
```

> **Note:** It is possible to start the cluster with a single meta node but you
must pass the `-single-server flag` when starting the single meta node.
A cluster with only one meta node is not recommended for production
environments.

Move on to the next section to set up the data servers.

### Set up, configure, and start the data servers

On each data server:

#### 1. Download and install the data server package

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data_1.0.0-beta2-c0.7.1_amd64.deb
sudo dpkg -i influxdb-data_1.0.0-beta2-c0.7.1_amd64.deb
```

##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data-1.0.0_beta2_c0.7.1.x86_64.rpm
sudo yum localinstall influxdb-data-1.0.0_beta2_c0.7.1.x86_64.rpm
```

#### 2. Edit the configuration file

In `/etc/influxdb/influxdb.conf`, set:

* `hostname` to the data nodes’s hostname (you must manually add this setting)
* `license-key` to the license key you received on InfluxPortal
* `auth-enabled` to `true` in the `[http]` section
* `shared-secret` in the `[http]` section to a long pass phrase that will be used to sign tokens (you must manually add this setting for the web console to function with your cluster)

```
# Change this option to true to disable reporting.
reporting-disabled = false
hostname="enterprise-beta-data-0x" #✨
meta-tls-enabled = false

[enterprise]

registration-enabled = false
registration-server-url = ""
license-key = "<your_license_key>" #✨
license-path = ""

[meta]
enabled = false
dir = "/var/lib/influxdb/meta"

[data]
enabled = true
dir = "/var/lib/influxdb/data"

[...]

[http]
 enabled = true
 bind-address = ":8086"
 auth-enabled = true #✨
 log-enabled = true
 write-tracing = false
 pprof-enabled = false
 https-enabled = false
 https-certificate = "/etc/ssl/influxdb.pem"
 shared-secret = "long pass phrase used for signing tokens" #✨

[...]

retry-max-interval = "1m0s"
purge-interval = "1h0m0s"
```

> **Note:** If you’re using a license file instead of a license key, set the
`license-path` setting to the path of the license file.

#### 3. Start the data node
```
/etc/init.d/influxdb start
```
or
```
service influxdb start
```
The expected output of the command is:
```
Starting the process influxdb [ OK ]
influxdb process was started [ OK ]
```

Move on to the next section to join all servers to a cluster.

### Join the nodes to the cluster

#### 1. Connect the meta nodes to the cluster

From `enterprise-beta-meta-01`, enter:
```
influxd-ctl join enterprise-beta-meta-01:8091

influxd-ctl join enterprise-beta-meta-02:8091

influxd-ctl join enterprise-beta-meta-03:8091
```

The expected output of those commands is:
```
Added meta node x at enterprise-beta-meta-0x:8091
```

> **Note:** Please make sure that you specify the fully qualified host name of
the meta node during the join process.
Please do not specify `localhost` as this can cause cluster connection issues.

#### 2. Verify that the meta nodes are part of the cluster
Issue the following command on any meta node:
```
influxd-ctl show
```

The expected output is:
```
Meta Nodes
==========
TCP Address
enterprise-beta-meta-01:8091
enterprise-beta-meta-02:8091
enterprise-beta-meta-03:8091
```

Note that your cluster must have at least three meta nodes.
If you do not see your meta nodes in the output, please retry adding them to
the cluster.

#### 3. Connect the data nodes to the cluster

From `enterprise-beta-meta-01`, enter:
```
influxd-ctl add-data enterprise-beta-data-01:8088

influxd-ctl add-data enterprise-beta-data-02:8088
```

The expected output of those commands is:
```
Added data node y at enterprise-beta-data-0x:8088
```

#### 4. Verify that the data nodes are part of the cluster

Issue the following command on any meta node:
```
influxd-ctl show
```

The expected output is:
```
Data Nodes
==========
ID   TCP Address
4    enterprise-beta-data-01:8088
5    enterprise-beta-data-02:8088

Meta Nodes
==========
TCP Address
enterprise-beta-meta-01:8091
enterprise-beta-meta-02:8091
enterprise-beta-meta-03:8091
```

Note that your cluster must have at least two data nodes.
If you do not see your data nodes in the output, please retry adding them
to the cluster.

## Web Console setup

<dt> Please set up the web console **after** you've set up your cluster.
Installing the web console before your cluster can cause unexpected behaviors.
</dt>

### Install PostgreSQL and the InfluxEnterprise web console

Install the InfluxEnterprise web console on one of your cluster's servers or on
a separate server.

#### PostgreSQL
```
sudo apt-get update
sudo apt-get -y install postgresql postgresql-contrib
```

#### InfluxEnterprise web console

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise_0.7.0_amd64.deb
sudo dpkg -i influx-enterprise_0.7.0_amd64.deb
```
##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise-0.7.0.x86_64.rpm
sudo yum localinstall influx-enterprise-0.7.0.x86_64.rpm
```
> **Note:** For other distributions, visit
[InfluxPortal](https://portal.influxdata.com/licenses) and click `View License`.

#### Set the password for the system's local postgres user

##### Login to PostgreSQL:
```
sudo -u postgres psql
```

Output:
```
-> psql (9.3.12)
-> Type "help" for help.
```

##### Set the password, replacing `<your_password>` with your password:
```
ALTER USER postgres PASSWORD '<your_password>';
```

Output:
```
-> ALTER ROLE
```

##### Exit PostgreSQL:
```
\q
```

### Setup Steps

#### 1. Edit the configuration file

In `/etc/influx-enterprise/influx-enterprise.conf`, set:

* the first `url` setting to your server’s IP address
* `license_key` to the license key you received on [InfluxPortal](https://portal.influxdata.com/)
* `shared-secret` in the `[influxdb]` section to the same pass phrase that you used in your data servers' configuration files
* the `url` setting in the `[database]` section to the password for the system’s local postgres user

```
url = "http://<your_server's_IP_address>:3000" #✨

hostname = "localhost"
port = "3000"

license-key = "<your_license_key>" #✨
license-file = "/path/to/license"

[influxdb]
shared-secret = "long pass phrase used for signing tokens" #✨

[smtp]
host = "localhost"
port = "25"
username = ""
password = ""
from_email = "donotreply@example.com"

[database]
url = "postgres://postgres:<your_password>@localhost:5432/enterprise" #✨
```

>**Notes:**
>
* If you're using a license file instead of a license key, set the
`license-file` setting to the path of the license file.
* If you're using a non-SSL version of Postgres, add the `?sslmode=disable` option to the `url` setting in the `[database]` section:
>
```
url = "postgres://postgres:<your_password>@localhost:5432/enterprise?sslmode=disable"
```

#### 2. Migrate the configuration file
Run the following command and enter your postgres Admin User's password when
prompted:
```
influx-enterprise migrate --config /etc/influx-enterprise/influx-enterprise.conf
```

Output:
```
2016/06/15 17:16:15 Loading config at /etc/influx-enterprise/influx-enterprise.conf
CREATE DATABASE enterprise;
> 0001_create_users.up.sql
> 0002_create_products.up.sql
> 0003_create_authentications.up.sql
> 0004_create_clusters_view.up.sql
> 0005_add_password.up.sql
> 0006_add_invite_nonce.up.sql
> 0007_drop_token_from_products.up.sql
> 0008_rename_product_id_to_node_id.up.sql
> 0009_create_explorers.up.sql
> 0010_add_name_to_explorers.up.sql
> 0011_add_name_to_products.up.sql
```

#### 3. Start the InfluxEnterprise web console
```
service influx-enterprise start
```

Output:
```
[OK] Service successfully started.
```

You're all set!
Visit `http://<your_web_console_server's_IP_address>:3000` to access your
InfluxEnterprise web console and check out the
next section to [get started](/enterprise/v1.0/introduction/getting-started/).
