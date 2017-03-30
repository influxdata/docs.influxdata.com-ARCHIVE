---
title: Upgrading from Previous Versions
menu:
  enterprise_1_2:
    weight: 0
    parent: Administration
---

## Upgrading from version 1.1 to 1.2.2

Version 1.2.2 is a drop-in replacement for version 1.1.x with no data migration required.

Version 1.2.2 introduces changes to the meta node configuration file and the data node configuration file.
Please update the configuration files prior to upgrading to avoid any unnecessary downtime.
The steps below outline the upgrade process and include a list of the required configuration changes.

### Step 1: Back up your cluster

Back up your cluster before upgrading to version 1.2.
You must have a backup to revert your cluster to an earlier version.
The following command uses the [version 1.1 backup syntax](/enterprise/v1.1/guides/backup-and-restore/#syntax) to create a backup of your cluster and it stores that backup in the current directory.

```
influxd-ctl backup .
```

### Step 2: Download the 1.2.2 packages

#### Meta node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.2.1-c1.2.2_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.2.1_c1.2.2.x86_64.rpm
```

#### Data node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.2.1-c1.2.2_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.2.1_c1.2.2.x86_64.rpm
```

### Step 3: Install the 1.2.2 packages

#### Meta node package Install

When you run the install command, your terminal asks if you'd like to keep your current configuration file or overwrite your current configuration file with the file for version 1.2.2.
Please keep your current configuration file by entering `N` or `O`;
we update the configuration file with the necessary changes for version 1.2.2 in step 3.

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-meta_1.2.1-c1.2.2_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-meta-1.2.1_c1.2.2.x86_64.rpm
```

#### Data node package install

When you run the install command, your terminal asks if you'd like to keep your current configuration file or overwrite your current configuration file with the file for version 1.2.2.
Please keep your current configuration file by entering `N` or `O`;
we update the configuration file with the necessary changes for version 1.2.2 in step 3.

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-data_1.2.1-c1.2.2_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-data-1.2.1_c1.2.2.x86_64.rpm
```

### Step 4: Update the meta node configuration file

> The configuration options in this section are not new to version 1.2.2.
They were, however, missing from the sample configuration file (`/etc/influxdb/influxdb-meta.conf`) in version 1.1.x.

In the `[meta]` section of the configuration file (`/etc/influxdb/influxdb-meta.conf`), add the following options:

* [auth-enabled = false](/enterprise/v1.2/administration/configuration/#auth-enabled-false)
* [https-private-key = ""](/enterprise/v1.2/administration/configuration/#https-private-key)
* [https-insecure-tls = false](/enterprise/v1.2/administration/configuration/#https-insecure-tls-false)
* [consensus-timeout = "30s"](/enterprise/v1.2/administration/configuration/#consensus-timeout-30s)

Those configuration options are set to their default settings.
Follow the links for more information about those options.

### Step 5: Update the data node configuration file

> Most of the configuration options in this section are not new to version 1.2.2.
They were, however, missing from the sample configuration file (`/etc/influxdb/influxdb.conf`) in version 1.1.x.
The only actual configuration change in version 1.2.2 is the removal of the `shard-writer-timeout` option in the `[cluster]` section; in version 1.2.2, the system internally sets `shard-writer-timeout`.

Uncomment all commented section headers: `[cluster]`, `[retention]`, `[shard-precreation]`, `[admin]`, `[monitor]`, `[subscriber]`, `[http]`, `[[graphite]]`, `[[collectd]]`, `[[opentsdb]]`, `[[udp]]`, and `[[continuous_queries]]`.
That change ensures that any future configuration changes to those sections will take effect upon a restart with no additional steps.

Under the `hostname` option at the top of the configuration file (`/etc/influxdb/influxdb.conf`), add [gossip-frequency = "3s"](/enterprise/v1.2/administration/configuration/#gossip-frequency-3s).

In the `[meta]` section, add:

* [meta-auth-enabled = false](/enterprise/v1.2/administration/configuration/#meta-auth-enabled-false)
* [meta-internal-shared-secret = ""](/enterprise/v1.2/administration/configuration/#meta-internal-shared-secret)

In the `[monitor]` section, add [remote-collect-interval = "10s"](/enterprise/v1.2/administration/configuration/#remote-collect-interval-10s).

In the `[[collectd]]` section, add:

* [security-level = "none"](/influxdb/v1.2/administration/config/#security-level-none)
* [auth-file = "/etc/collectd/auth_file"](/influxdb/v1.2/administration/config/#auth-file-etc-collectd-auth-file)

In the `[[udp]]` section, add [precision = ""](/influxdb/v1.2/administration/config/#precision).

In the `[cluster]` section, **remove** [shard-writer-timeout = "5s"](/enterprise/v1.2/administration/configuration/#shard-writer-timeout-5s).

The added configuration options are set to their default settings.
Follow the links for more information about those options.

### Step 6: Restart the processes

#### Meta node restart
**sysvinit systems**
```
service influxdb-meta restart
```
**systemd systems**
```
sudo systemctl restart influxdb-meta
```

#### Data node Restart
**sysvinit systems**
```
service influxdb restart
```
**systemd systems**
```
sudo systemctl restart influxdb
```

## Confirmation steps

Check your nodes' version numbers using the `influxd-ctl show` command.
The [`influxd-ctl` tool](/enterprise/v1.2/features/cluster-commands/) is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.2.1_c1.2.2   # 1.2.1_c1.2.2 = 👍
5	rk-upgrading-02:8088	1.2.1_c1.2.2
6	rk-upgrading-03:8088	1.2.1_c1.2.2

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.2.1_c1.2.2
rk-upgrading-02:8091	1.2.1_c1.2.2
rk-upgrading-03:8091	1.2.1_c1.2.2
```

If you have any issues upgrading your cluster, please do not hesitate to contact support at the email provided to you when you received your InfluxEnterprise license.
