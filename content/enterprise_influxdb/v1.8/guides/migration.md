---
title: Migrate InfluxDB OSS instances to InfluxDB Enterprise clusters
description: >
  Migrate a running instance of InfluxDB open source (OSS) to an InfluxDB Enterprise cluster.
aliases:
  - /enterprise/v1.8/guides/migration/
menu:
  enterprise_influxdb_1_8:
    name: Migrate InfluxDB OSS to Enterprise
    weight: 10
    parent: Guides
---

Migrate a running instance of InfluxDB open source (OSS) to an InfluxDB Enterprise cluster.

## Prerequisites

- An InfluxDB OSS instance running **InfluxDB 1.7.10 or later**.
- An InfluxDB Enterprise cluster running **InfluxDB Enterprise 1.7.10 or later**
- Network accessibility between the OSS instances and all data and meta nodes.

{{% warn %}}
**Migrating does the following:**

- Deletes data in existing InfluxDB Enterprise data nodes
- Transfers all users from the OSS instance to the InfluxDB Enterprise cluster

{{% /warn %}}

## Migrate to InfluxDB Enterprise

Complete the following tasks:

1. [Upgrade InfluxDB to the latest version](#upgrade-influxdb-to-the-latest-version)
2. [Set up InfluxDB Enterprise meta nodes](#set-up-influxdb-enterprise-meta-nodes)
3. [Set up InfluxDB Enterprise data nodes](#set-up-influxdb-enterprise-data-nodes)
4. Do one of the following:
   - [Migrate a data set with zero downtime](#migrate-a-data-set-with-zero-downtime). This method lets you move data between OSS to Enterprise as you're testing the migration.
   - [Migrate a data set with downtime](#migrate-a-data-set-with-downtime). This method is useful if you're not able to run a portable backup, for example, for any of the following reasons:
     - Data set exceeds a certain size (roughly 10 databases or more, or more than 500 shards per database)
     - Hardware requirements aren't available
     - Time constraints

     {{% note %}}
     With this method, you cannot move data from Enterprise back to OSS.
     {{% /note %}}

### Upgrade InfluxDB to the latest version

Upgrade InfluxDB to the latest stable version.

- [Upgrade InfluxDB OSS](/influxdb/latest/administration/upgrading/)
- [Upgrade InfluxDB Enterprise](/enterprise_influxdb/latest/administration/upgrading/)

### Set up InfluxDB Enterprise meta nodes

Set up all meta nodes in your InfluxDB Enterprise cluster.
For information about installing and setting up meta nodes, see
[Install meta nodes](/enterprise_influxdb/v1.8/install-and-deploy/production_installation/meta_node_installation/).

{{% note %}}

#### Add the OSS instance to the meta /etc/hosts files

When [modifying the `/etc/hosts` file](/enterprise_influxdb/v1.8/install-and-deploy/production_installation/meta_node_installation/#step-1-modify-the-etc-hosts-file)
on each meta node, include the IP and host name of your InfluxDB OSS instance so
meta nodes can communicate with the OSS instance.
{{% /note %}}

### Set up InfluxDB Enterprise data nodes

If you don't have any existing data nodes in your InfluxDB Enterprise cluster,
[skip to the next step](#upgrade-the-influxdb-oss-instance-to-influxdb-enterprise).

#### For each existing data node:

1. **Remove the data node from the InfluxDB Enterprise cluster**

    From a **meta** node in your InfluxDB Enterprise cluster, run:

    ```bash
    influxd-ctl remove-data <data_node_hostname>:8088
    ```

2. **Delete existing data**

    On each **data** node dropped from the cluster, run:

    ```bash
    sudo rm -rf /var/lib/influxdb/{meta,data,hh}
    ```

3. **Recreate data directories**

    On each **data** node dropped from the cluster, run:

    ```bash
    sudo mkdir /var/lib/influxdb/{data,hh,meta}
    ```

4. **Ensure file permissions are correct**

    On each **data** node dropped from the cluster, run:

    ```bash
    sudo chown -R influxdb:influxdb /var/lib/influxdb
    ```

5. **Update the `/etc/hosts` file**

    On each **data** node, add the IP and hostname of the OSS instance to the
    `/etc/hosts` file to allow the data node to communicate with the OSS instance.

### Migrate a data set with zero downtime

1. Take a portable backup from OSS:

    ```sh
     influxd backup -portable -host <IP address>:8088 /tmp/mysnapshot
    ```

    For more information, see [`-backup`](/influxdb/v1.8/administration/backup_and_restore/#backup)
2. Restore on the cluster by running the following:

    ```sh
    influxd restore -portable  [ -host <host:port> ] <path-to-backup-files>
    ```

    For more information, see [`-restore`](/influxdb/v1.8/administration/backup_and_restore/#restore)
3. Dual write to both OSS and Enterprise. See [Write data with the InfluxDB API] (https://docs.influxdata.com/influxdb/v1.8/guides/write_data/). This keeps the OSS and cluster active for testing and acceptance work.
4. [Export data from OSS](/enterprise_influxdb/v1.8/administration/backup-and-restore/#exporting-data) from the time the backup was taken to the time the dual write started.
For example, if you take the backup on 2020-07-19T00:00:00.000Z, and started writing data to Enterprise at 2020-07-19T23:59:59.999Z, you could run the following command:

    ```sh
    influx_inspect export -compress -start 2020-07-19T00:00:00.000Z -end 2020-07-19T23:59:59.999Z`
    ```
    
    For more information, see [`-export`](/influxdb/v1.8/tools/influx_inspect#export).
5. [Import data into Enterprise](/enterprise_influxdb/v1.8/administration/backup-and-restore/#importing-data).
6. Verify data is successfully migrated. To review your data, see how to:
   - [Query data with the InfluxDB API](https://docs.influxdata.com/influxdb/v1.8/guides/query_data/#sidebar)
   - [View data in Chronograf](https://docs.influxdata.com/chronograf/v1.8/)
7. Stop writing data to OSS.

### Migrate a data set with downtime

1. [Upgrade the InfluxDB binary on your OSS instance](#upgrade-the-influxdb-oss-instance-to-influxdb-enterprise)
2. [Add the upgraded OSS instance to the InfluxDB Enterprise cluster](#add-the-new-data-node-to-the-cluster)
3. [Add existing data nodes back to the cluster](#add-existing-data-nodes-back-to-the-cluster)
4. [Rebalance the cluster](#rebalance-the-cluster)

#### Upgrade the InfluxDB OSS instance to InfluxDB Enterprise

1. **Stop all writes to the InfluxDB OSS instance**
2. **Stop the `influxdb` service on the InfluxDB OSS instance**

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[sysvinit](#)
[systemd](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo service influxdb stop
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo systemctl stop influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    Double check that the service is stopped. The following command should return nothing:

    ```bash
    ps ax | grep influxd
    ```

3. **Remove the InfluxDB OSS package**

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[Debian & Ubuntu](#)
[RHEL & CentOS](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo apt-get remove influxdb
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo yum remove influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

4. **Back up your InfluxDB OSS configuration file**

    If you have custom configuration settings for InfluxDB OSS, back up and save your configuration file.
    **Without a backup, you'll lose custom configuration settings when updating the InfluxDB binary.**

5. **Update the InfluxDB binary**

    > Updating the InfluxDB binary overwrites the existing configuration file.
    > To keep custom settings, back up your configuration file.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[Debian & Ubuntu](#)
[RHEL & CentOS](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.8.0-c1.8.0_amd64.deb
sudo dpkg -i influxdb-data_1.8.0-c1.8.0_amd64.deb
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.8.0_c1.8.0.x86_64.rpm
sudo yum localinstall influxdb-data-1.8.0_c1.8.0.x86_64.rpm
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

6. **Update the configuration file**

    In `/etc/influxdb/influxdb.conf`, set:

    - `hostname` to the full hostname of the data node
    - `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path`
    in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.  

        {{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to an empty string.
        {{% /warn %}}

    <!-- -->
    ```toml
    # Hostname advertised by this host for remote addresses.
    # This must be accessible to all nodes in the cluster.
    hostname="<data-node-hostname>"

    [enterprise]
      # license-key and license-path are mutually exclusive,
      # use only one and leave the other blank
      license-key = "<your_license_key>"
      license-path = "/path/to/readable/JSON.license.file"
    ```

    {{% note %}}
Transfer any custom settings from the backup of your OSS configuration file
to the new Enterprise configuration file.
    {{% /note %}}

7. **Update the `/etc/hosts` file**

    Add all meta and data nodes to the `/etc/hosts` file to allow the OSS instance
    to communicate with other nodes in the InfluxDB Enterprise cluster.

8. **Start the data node**

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[sysvinit](#)
[systemd](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo service influxdb start
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo systemctl start influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

#### Add the new data node to the cluster

After you upgrade your OSS instance to InfluxDB Enterprise, add the node to your Enterprise cluster.

From a **meta** node in the cluster, run:

```bash
influxd-ctl add-data <new-data-node-hostname>:8088
```

It should output:

```bash
Added data node y at new-data-node-hostname:8088
```

#### Add existing data nodes back to the cluster

If you removed any existing data nodes from your InfluxDB Enterprise cluster,
add them back to the cluster.

From a **meta** node in the InfluxDB Enterprise cluster, run the following for
**each data node**:

```bash
influxd-ctl add-data <the-hostname>:8088
```

It should output:

```bash
Added data node y at the-hostname:8088
```

Verify that all nodes are now members of the cluster as expected:

```bash
influxd-ctl show
```

Once added to the cluster, InfluxDB synchronizes data stored on the upgraded OSS
node with other data nodes in the cluster.
It may take a few minutes before the existing data is available.

#### Rebalance the cluster

1. Use the [ALTER RETENTION POLICY](/influxdb/v1.8/query_language/database_management/#modify-retention-policies-with-alter-retention-policy)
   statement to increase the [replication factor](/enterprise_influxdb/v1.8/concepts/glossary/#replication-factor)
   on all existing retention polices to the number of data nodes in your cluster.
2. [Rebalance your cluster manually](/enterprise_influxdb/v1.8/guides/rebalance/)
   to meet the desired replication factor for existing shards.
3. If you were using [Chronograf](/chronograf/latest/), add your Enterprise instance as a new data source.
