---
title: Upgrading from Previous Versions
aliases:
    - /enterprise/v1.3/administration/upgrading/
menu:
  enterprise_influxdb_1_3:
    weight: 0
    parent: Administration
---

## Upgrading from version 1.3.x to 1.3.8
Version 1.3.8 is a drop-in replacement for earlier releases of 1.3.x with no data migration required, unless you have been using the TSI preview with 1.3.6 or earlier releases.

### For users of the TSI preview
If you have been using the TSI preview with 1.3.6 or earlier 1.3.x releases, you will need to follow the upgrade steps to 
continue using the TSI preview.  Unfortunately, these steps cannot be executed while the cluster is operating -- so it will 
result in downtime.  

1. Stop the meta and data node processes
1. Download and update bits to 1.3.8
1. Delete all /index directories contained with the data nodes (default configuration is [data] dir = /var/lib/influxdb/data) 
1. Rebuild the TSI indexes using the `influx_inspect` utility with the new `inmem2tsi` parameter.  More documentation
describing this new parameter with `influx_inspect` [can be found here](link to inmem2tsi with influx_inspect).
1. Restart meta nodes
1. Restart data nodes

The 1.3.7 release resolved a defect that created duplicate tag values in TSI indexes.
See Issues [#8995](https://github.com/influxdata/influxdb/pull/8995), and [#8998](https://github.com/influxdata/influxdb/pull/8998). 
However, upgrading to 1.3.7 with the TSI preview on will cause compactions to fail, 
see [Issue #9025](https://github.com/influxdata/influxdb/issues/9025). 

If you are using the TSI preview, **you should not upgrade to 1.3.7** from any other 1.3.x release. 
Instead, you should upgrade to 1.3.8 and execute the index rebuild process as described above using `influx_inspect` 
utility with the new `inmem2tsi` parameter.

## Upgrading from version 1.2.5 to 1.3.x

Version 1.3.x introduces changes to the data node configuration file.
Please update that configuration file to avoid any unnecessary downtime.
The steps below outline the upgrade process and include a list of the required configuration changes.

### Step 0: Back up your cluster before upgrading to version 1.3.
It is recommended to create a full backup of your cluster prior to executing the upgrade. If you are 
already have incremental backups being created as part of your standard operating procedures, you should 
trigger a final incremental backup before proceeding with the upgrade.
<dt>
Note that you need to ensure you have sufficient disk space before triggering the backup.
</dt>
The following command uses the [version 1.2 backup syntax](https://docs.influxdata.com/enterprise_influxdb/v1.2/guides/backup-and-restore/#syntax) 
to create an incremental backup of your cluster and it stores that backup in the current directory.

```
influxd-ctl backup .
```

Otherwise, you should create a full backup before proceeding. 
The following command uses the [backup syntax originally introduced in version 1.2](https://docs.influxdata.com/enterprise_influxdb/v1.3/guides/backup-and-restore/#syntax) 
to create a full backup of your cluster and it stores that backup in the current directory. 

```
influxd-ctl backup -full .
```

### Step 1: Download the 1.3.8 packages

#### Meta node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.3.8-c1.3.8_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.3.8_c1.3.8.x86_64.rpm
```

#### Data node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.3.8-c1.3.8_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.3.8_c1.3.8.x86_64.rpm
```

### Step 2: Install the 1.3.8 packages

#### Meta node package Install

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-meta_1.3.8-c1.3.8_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-meta-1.3.8_c1.3.8.x86_64.rpm
```

#### Data node package install

When you run the install command, your terminal asks if you'd like to keep your current configuration file or overwrite your current configuration file with the file for version 1.3.8.
Please keep your current configuration file by entering `N` or `O`;
we update the configuration file with the necessary changes for version 1.3.8 in step 3.

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-data_1.3.8-c1.3.8_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-data-1.3.8_c1.3.8.x86_64.rpm
```

### Step 3: Update the data node configuration file

Add:

* [index-version = "inmem"](/enterprise_influxdb/v1.3/administration/configuration/#index-version-inmem) to the `[data]` section
* [wal-fsync-delay = "0s"](/enterprise_influxdb/v1.3/administration/configuration/#wal-fsync-delay-0s) to the `[data]` section
* [max-concurrent-compactions = 0](/enterprise_influxdb/v1.3/administration/configuration/#max-concurrent-compactions-0) to the `[data]` section
* [pool-max-idle-streams = 100](/enterprise_influxdb/v1.3/administration/configuration/#pool-max-idle-streams-100) to the `[cluster]` section
* [pool-max-idle-time = "1m0s"](/enterprise_influxdb/v1.3/administration/configuration/#pool-max-idle-time-1m0s) to the `[cluster]` section
* the [[anti-entropy]](/enterprise_influxdb/v1.3/administration/configuration/#anti-entropy) section:
```
[anti-entropy]
  enabled = true
  check-interval = "30s"
  max-fetch = 10
```

Remove:

* `max-remote-write-connections` from the `[cluster]` section
* the [[admin]](/enterprise_influxdb/v1.3/administration/configuration/#admin) section

Update:

* [cache-max-memory-size](/enterprise_influxdb/v1.3/administration/configuration/#cache-max-memory-size-1073741824) to `1073741824` in the `[data]` section

The new configuration options are set to their default settings.
Follow the links for more information about those options.

### Step 4: Restart the processes

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

### Step 5: Confirm the upgrade

Check your nodes' version numbers using the `influxd-ctl show` command.
The [`influxd-ctl` tool](/enterprise_influxdb/v1.3/features/cluster-commands/) is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.3.8_c1.3.8   # 1.3.8_c1.3.8 = 👍
5	rk-upgrading-02:8088	1.3.8_c1.3.8
6	rk-upgrading-03:8088	1.3.8_c1.3.8

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.3.8_c1.3.8
rk-upgrading-02:8091	1.3.8_c1.3.8
rk-upgrading-03:8091	1.3.8_c1.3.8
```

If you have any issues upgrading your cluster, please do not hesitate to contact support at the email 
provided to you when you received your InfluxEnterprise license.
