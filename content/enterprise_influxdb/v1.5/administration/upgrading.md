---
title: Upgrading InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.5/administration/upgrading/
menu:
  enterprise_influxdb_1_5:
    weight: 0
    parent: Administration
---

## Upgrading to InfluxDB Enterprise 1.5 (with TSI enabled)

Version 1.5 includes the first official Time Series Index (TSI) release. Although you can install without enabling TSI, you are encouraged to begin leveraging the advantages the TSI disk-based indexing offers.

For upgrading steps, see [Upgrading to InfluxDB 1.5](/influxdb/v1.5/administration/upgrading/).

## Upgrading from version 1.2.5 to 1.5.0

Version 1.3.x introduced changes to the data node configuration file and changes to the underlying communication protocols between the nodes used for hinted handoff.

The impact of the hinted handoff protocol change means that you will be unable to perform a `downgrade` if there are
points contained within the hinted handoff queue of the upgraded nodes.  
The recommendations below describe how to avoid building up hinted handoff queue points while upgrading.

Please update that configuration file to avoid any unnecessary downtime.
The steps below outline the upgrade process and include a list of the required configuration changes.

### Step 0: Back up your cluster before upgrading to version 1.3.

It is recommended that you create a full backup of your InfluxDB Enterprise cluster before performing the upgrade.
If you already have incremental backups created as part of your standard operating procedures, make sure that you
trigger a final incremental backup before proceeding with the upgrade.

<dt>
**NOTE:** Ensure you have sufficient disk space before triggering the backup!
</dt>
The following command uses the [version 1.2 backup syntax](https://docs.influxdata.com/enterprise_influxdb/v1.2/guides/backup-and-restore/#syntax)
to create an incremental backup of your cluster and stores that backup in the current directory.

```
influxd-ctl backup .
```

Otherwise, create a full backup before proceeding.
The following command uses the [backup syntax originally introduced in version 1.2](https://docs.influxdata.com/enterprise_influxdb/v1.4/guides/backup-and-restore/#syntax)
to create a full backup of your cluster and to store that backup in the current directory.

```
influxd-ctl backup -full .
```


## Upgrading meta nodes

Follow these steps to upgrade all meta nodes in your InfluxDB Enterprise cluster. Ensure that the meta cluster is healthy before proceeding to the data nodes.

### Step 1: Download the 1.5.0 meta node packages

#### Meta node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.5.0-c1.5.0_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.5.0_c1.5.0.x86_64.rpm
```

### Step 2: Install the 1.5.0 meta nodes package.

#### Meta node package install

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-meta_1.5.0-c1.5.0_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-meta-1.5.0_c1.5.0.x86_64.rpm
```

### Step 3: Restart the influxdb-meta process

#### Meta node restart

**sysvinit systems**
```
service influxdb-meta restart
```
**systemd systems**
```
sudo systemctl restart influxdb-meta
```

### Step 4: Confirm the upgrade

After performing the upgrade on ALL meta nodes, check your node version numbers using the
`influxd-ctl show` command.
The [`influxd-ctl` tool](/enterprise_influxdb/v1.4/features/cluster-commands/) is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.2.x_c1.2.y
5	rk-upgrading-02:8088	1.2.x_c1.2.y
6	rk-upgrading-03:8088	1.2.x_c1.2.y

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.5.0_c1.5.0   # 1.5.0_c1.5.0 = 👍
rk-upgrading-02:8091	1.5.0_c1.5.0
rk-upgrading-03:8091	1.5.0_c1.5.0
```

## Upgrading data nodes

Repeat the following steps for each data node in your InfluxDB Enterprise cluster.

### Step 1: Download the 1.5.0 data node package.

#### Data node package download

**Ubuntu & Debian (64-bit)**

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.5.0-c1.5.0_amd64.deb
```

**RedHat & CentOS (64-bit)**

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.5.0_c1.5.0.x86_64.rpm
```

### Step 2: Remove the data node from the load balancer

In order to avoid downtime and allow for a smooth transition, remove the data node that you plan to upgrade from your
load balancer **before** performing the remaining steps.

### Step 3: Install the 1.5.0 data node packages

#### Data node package install

When you run the install command, your terminal asks if you want to keep your
current configuration file or overwrite your current configuration file with the file for version 1.5.0.

Please keep your current configuration file by entering `N` or `O`;
we update the configuration file with the necessary changes for version 1.5.0 in the next step.

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-data_1.5.0-c1.5.0_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-data-1.5.0_c1.5.0.x86_64.rpm
```

### Step 4: Update the data node configuration file.

**Add:**

* [index-version = "tsi1"](/enterprise_influxdb/v1.4/administration/configuration/#index-version-inmem) to the `[data]` section
  - Use 'tsi1' for the Time Series Index (TSI); set the value to `inmem` to use the TSM in-memory index.
* [wal-fsync-delay = "0s"](/enterprise_influxdb/v1.4/administration/configuration/#wal-fsync-delay-0s) to the `[data]` section
* [max-concurrent-compactions = 0](/enterprise_influxdb/v1.4/administration/configuration/#max-concurrent-compactions-0) to the `[data]` section
* [pool-max-idle-streams = 100](/enterprise_influxdb/v1.4/administration/configuration/#pool-max-idle-streams-100) to the `[cluster]` section
* [pool-max-idle-time = "1m0s"](/enterprise_influxdb/v1.4/administration/configuration/#pool-max-idle-time-1m0s) to the `[cluster]` section
* the [[anti-entropy]](/enterprise_influxdb/v1.4/administration/configuration/#anti-entropy) section:
```
[anti-entropy]
  enabled = true
  check-interval = "30s"
  max-fetch = 10
```

**Remove:**

* the `max-remote-write-connections` from the `[cluster]` section
* the [[admin]](/enterprise_influxdb/v1.4/administration/configuration/#admin) section

**Update:**

* [cache-max-memory-size](/enterprise_influxdb/v1.4/administration/configuration/#cache-max-memory-size-1073741824) to `1073741824` in the `[data]` section

The new configuration options are set to the default settings.
Follow the links for more information about those options.

### Step 5: Restart the `influxdb` service.

<dt>
**NOTE:** As part of changes made in InfluxDB Enterprise 1.3, the hinted handoff queue is now segmented by node and
shard. See
[Release Notes/Change Log](https://docs.influxdata.com/enterprise_influxdb/v1.5/about-the-project/release-notes-changelog/#v1-3-0-2017-06-21).
As a result, when you restart data nodes, you will see log messages indicating that there is a "protocol" issue writing points
from the hinted handoff queue between 1.2 and 1.3 nodes. Ignore these messages -- these will resolve themselves after all of the data nodes have been
upgraded.

As a result of this change, if you need to downgrade to 1.2 for any reason, you must halt inbound writes while you downgrade
the data nodes because the hinted handoff segmentation is not compatible from 1.3 to 1.2.  You can stop write traffic at the
load balancer by removing ALL data nodes temporarily while you downgrade the binaries and configuration files.  See Step 3
above.
</dt>

#### Restart data node
**sysvinit systems**
```
service influxdb restart
```
**systemd systems**
```
sudo systemctl restart influxdb
```

### Step 6: Add the data node back into the load balancer.

Re-add the data node back into the load balancer to allow it to serve reads and writes.
If this is the last data node to be upgraded, proceed to step 7.

Otherwise, return to Step 1 for upgrading data nodes and repeat the process for the remaining data nodes.

### Step 7: Confirm the upgrade
Check your node version numbers using the `influxd-ctl show` command.
The [`influxd-ctl`](/enterprise_influxdb/v1.4/features/cluster-commands/) utility is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.5.0_c1.5.0   # 1.5.0_c1.5.0 = 👍
5	rk-upgrading-02:8088	1.5.0_c1.5.0
6	rk-upgrading-03:8088	1.5.0_c1.5.0

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.5.0_c1.5.0
rk-upgrading-02:8091	1.5.0_c1.5.0
rk-upgrading-03:8091	1.5.0_c1.5.0
```

If you have any issues upgrading your cluster, please do not hesitate to contact support at the email address
provided to you when you received your InfluxEnterprise license.
