---
title: Upgrading InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.6/administration/upgrading/
menu:
  enterprise_influxdb_1_6:
    weight: 20
    parent: Administration
---

## Upgrading InfluxDB Enterprise 1.3.x-1.5.x clusters to 1.6.6 (rolling upgrade)

### Step 0: Back up your cluster before upgrading to version 1.6.6.

Create a full backup of your InfluxDB Enterprise cluster before performing an upgrade.
If you have incremental backups created as part of your standard operating procedures, make sure to
trigger a final incremental backup before proceeding with the upgrade.

> ***Note:*** For information on performing a final incremental backup or a full backup,
> see the InfluxDB Enterprise [Backup and restore](/enterprise_influxdb/v1.6/administration/backup-and-restore/) documentation.

## Upgrading meta nodes

Follow these steps to upgrade all meta nodes in your InfluxDB Enterprise cluster. Ensure that the meta cluster is healthy before proceeding to the data nodes.

### Step 1: Download the 1.6.6 meta node package.

#### Meta node package download
**Ubuntu & Debian (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.6.6-c1.6.6_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.6.6_c1.6.6.x86_64.rpm
```

### Step 2: Install the 1.6.6 meta nodes package.

#### Meta node package install

##### Ubuntu & Debian (64-bit)

```
sudo dpkg -i influxdb-meta_1.6.6-c1.6.6_amd64.deb
```

##### RedHat & CentOS (64-bit)

```
sudo yum localinstall influxdb-meta-1.6.6_c1.6.6.x86_64.rpm
```

### Step 3: Restart the `influxdb-meta` service.

#### Meta node restart

##### sysvinit systems

```
service influxdb-meta restart
```
##### systemd systems

```
sudo systemctl restart influxdb-meta
```

### Step 4: Confirm the upgrade.

After performing the upgrade on ALL meta nodes, check your node version numbers using the
`influxd-ctl show` command.
The [`influxd-ctl` utility](/enterprise_influxdb/v1.6/administration/cluster-commands/) is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.5.x_c1.5.y
5	rk-upgrading-02:8088	1.5.x_c1.5.y
6	rk-upgrading-03:8088	1.5.x_c1.5.y

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.6.6_c1.6.6   # 1.6.6_c1.6.6 = 👍
rk-upgrading-02:8091	1.6.6_c1.6.6
rk-upgrading-03:8091	1.6.6_c1.6.6
```

## Upgrading data nodes

Repeat the following steps for each data node in your InfluxDB Enterprise cluster.

### Step 1: Download the 1.6.6 data node package.

#### Data node package download

##### Ubuntu & Debian (64-bit)

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.6.6-c1.6.6_amd64.deb
```

##### RedHat & CentOS (64-bit)

```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.6.6_c1.6.6.x86_64.rpm
```

### Step 2: Stop traffic to the data node

Your cluster's load balancer distributes read and write requests among data nodes in the cluster. If you have access to the load balancer configuration, stop routing read/write requests to the data node server (port 8086) via your load balancer **before** performing the remaining steps.

If you cannot access the load balancer configuration, we recommend working with your networking team to prevent traffic to the data node server before continuing to upgrade.

### Step 3: Install the 1.6.6 data node packages.

#### Data node package install

When you run the install command, your terminal asks if you want to keep your
current configuration file or overwrite your current configuration file with the file for version 1.6.6.

Keep your current configuration file by entering `N` or `O`.
The configuration file will be updated with the necessary changes for version 1.6.6 in the next step.

**Ubuntu & Debian (64-bit)**
```
sudo dpkg -i influxdb-data_1.6.6-c1.6.6_amd64.deb
```

**RedHat & CentOS (64-bit)**
```
sudo yum localinstall influxdb-data-1.6.6_c1.6.6.x86_64.rpm
```

### Step 4: Update the data node configuration file.

> The first official Time Series Index (TSI) was released with InfluxDB v1.5.
> Although you can install without enabling TSI, you are encouraged to begin leveraging the advantages the TSI indexing offers.

**Add:**

* If enabling TSI: [index-version = "tsi1"](/enterprise_influxdb/v1.6/administration/config-data-nodes#index-version-inmem) to the `[data]` section.
* If not enabling TSI: [index-version = "inmem"](/enterprise_influxdb/v1.6/administration/config-data-nodes#index-version-inmem) to the `[data]` section.
  - Use 'tsi1' for the Time Series Index (TSI); set the value to `inmem` to use the TSM in-memory index.
* [wal-fsync-delay = "0s"](/enterprise_influxdb/v1.6/administration/config-data-nodes#wal-fsync-delay-0s) to the `[data]` section
* [max-concurrent-compactions = 0](/enterprise_influxdb/v1.6/administration/config-data-nodes#max-concurrent-compactions-0) to the `[data]` section
* [pool-max-idle-streams = 100](/enterprise_influxdb/v1.6/administration/config-data-nodes#pool-max-idle-streams-100) to the `[cluster]` section
* [pool-max-idle-time = "1m0s"](/enterprise_influxdb/v1.6/administration/config-data-nodes#pool-max-idle-time-60s) to the `[cluster]` section
* the [[anti-entropy]](/enterprise_influxdb/v1.6/administration/config-data-nodes#anti-entropy) section:

```
[anti-entropy]
  enabled = true
  check-interval = "30s"
  max-fetch = 10
```

{{% warn %}}
The [anti-entropy service](/enterprise_influxdb/v1.6/administration/anti-entropy/) can initially be CPU intensive
if you have very large shards (>50GB) and/or a large number of shards (>500) associated
with your database. This can result in the cluster appearing to be unresponsive upon startup while shard digests are
calculated. Once the shard digests are calculated, the overall CPU utilization should return to a lower level.

To check the number of shards within your cluster, use the
[SHOW SHARDS](/enterprise_influxdb/v1.6/administration/cluster-commands/#show-shards) command.  
Use your operating system tools to check the shard sizes.

You may wish to test this configuration setting in a non-production environment to observe
the system resource requirements prior to activating this service in production.     
{{% /warn %}}

**Remove:**

* `max-remote-write-connections` from the `[cluster]` section
* `[admin]` section

**Update:**

* [cache-max-memory-size](/enterprise_influxdb/v1.6/administration/config-data-nodes#cache-max-memory-size-1g) to `1073741824` in the `[data]` section

The new configuration options are set to the default settings.

### Step 5: [For TSI Preview instances only] Prepare your node to support Time Series Index (TSI).

1. Delete all existing TSM-based shard `index` directories.

- Remove the existing `index` directories to ensure there are no incompatible index files.
- By default, the `index` directories are located at `/<shard_ID>/index` (e.g., `/2/index`).

2. Convert existing TSM-based shards (or rebuild TSI Preview shards) to support TSI.

  - When TSI is enabled, new shards use the TSI index. Existing shards must be converted to support TSI.
  - Run the [`influx_inspect buildtsi`](/influxdb/v1.6/tools/influx_inspect#buildtsi) command to convert existing TSM-based shards (or rebuild TSI Preview shards) to support TSI.

> **Note:** Run the `buildtsi` command using the user account that you are going to run the database as,
> or ensure that the permissions match afterward.

### Step 6: Restart the `influxdb` service.

#### Restart data node

##### sysvinit systems

```
service influxdb restart
```
##### systemd systems

```
sudo systemctl restart influxdb
```

### Step 7: Restart traffic to data node

Restart routing read/write requests to the data node server (port 8086) via your load balancer.

If this is the last data node to be upgraded, proceed to step 7.
Otherwise, return to Step 1 of [Upgrading data nodes](#upgrading-data-nodes) and repeat the process for the remaining data nodes.

### Step 8: Confirm the upgrade.

Your cluster is now upgraded to InfluxDB Enterprise 1.6.
Check your node version numbers using the `influxd-ctl show` command.
The [`influxd-ctl`](/enterprise_influxdb/v1.6/administration/cluster-commands/) utility is available on all meta nodes.

```
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.6.6_c1.6.6   # 1.6.6_c1.6.6 = 👍
5	rk-upgrading-02:8088	1.6.6_c1.6.6
6	rk-upgrading-03:8088	1.6.6_c1.6.6

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	1.6.6_c1.6.6
rk-upgrading-02:8091	1.6.6_c1.6.6
rk-upgrading-03:8091	1.6.6_c1.6.6
```

If you have any issues upgrading your cluster, please do not hesitate to contact support at the email address
provided to you when you received your InfluxDB Enterprise license.
