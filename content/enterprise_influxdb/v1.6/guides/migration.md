---
title: Migrating InfluxDB OSS instances to InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.5/guides/migration/
menu:
  enterprise_influxdb_1_6:
    name: Migrating InfluxDB OSS to clusters
    weight: 10
    parent: Guides
---

The following guide has step-by-step instructions for migrating an InfluxDB OSS
instance into an InfluxDB Enterprise cluster.

<dt>
The process assumes that you already have a fully configured InfluxDB Enterprise cluster
of three or more meta nodes and zero or more data nodes. If you need instructions for meta node installation:
- [Production installation of meta nodes](/enterprise_influxdb/v1.6/production_installation/meta_node_installation/)
</dt>

Please note that this migration process:

* Deletes all data from any data nodes that are already part of the InfluxDB Enterprise cluster
* Will transfer all users from the OSS instance to the InfluxEnterprise Cluster*
* Requires downtime for writes and reads for the OSS instance

<dt>
If you're using an InfluxDB Enterprise cluster version prior to 0.7.4, the
following steps will **not** transfer users from the OSS instance to the
InfluxEnterprise Cluster.
</dt>

In addition, please refrain from creating a Global Admin user in the InfluxEnterprise Web Console before implementing these steps. If you’ve already created a Global Admin user, contact support.

## Modify the `/etc/hosts` file

Add the IP and hostname of the InfluxDB OSS instance to the
`/etc/hosts` file on all nodes in the InfluxDB Enterprise cluster.
Ensure that all cluster IPs and hostnames are also in the OSS
instance’s `/etc/hosts` file.

**Note:** All node hostnames must be completely resolvable by all
other nodes in the cluster. If you have DNS already setup in your
environment, then this step can be skipped.

## For all existing InfluxDB Enterprise data nodes:

### 1. Remove the node from the InfluxDB Enterprise cluster

From a **meta** node in your InfluxDB Enterprise cluster, enter:
```
influxd-ctl remove-data <data_node_hostname>:8088
```
### 2. Delete any existing data

On each **data** node that you dropped from the cluster, enter:
```
sudo rm -rf /var/lib/influxdb/{meta,data,hh}
```

### 3. Create new directories

On each data node that you dropped from the cluster, enter:
```
sudo mkdir /var/lib/influxdb/{data,hh,meta}
```
To ensure the file permissions are correct please run:
```
sudo chown -R influxdb:influxdb /var/lib/influxdb
```

## For the InfluxDB OSS Instance:

### 1. Stop all writes to the InfluxDB OSS instance

### 2. Stop the influxdb service on the InfluxDB OSS instance

On sysvinit systems, use the `service` command:
```
sudo service influxdb stop
```

On systemd systems, use the `systemctl` command:
```
sudo systemctl stop influxdb
```

Double check that the service is stopped (the following should return nothing):
```
ps ax | grep influxd
```

### 3. Remove the InfluxDB OSS package

On Debian/Ubuntu systems:
```
sudo apt-get remove influxdb
```

On RHEL/CentOS systems:
```
sudo yum remove influxdb
```

### 4. Update the binary

> **Note:** This step will overwrite your current configuration file.
If you have settings that you’d like to keep, please make a copy of your config file before running the following command.

#### Ubuntu & Debian (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.3.8-c1.3.8_amd64.deb
sudo dpkg -i influxdb-data_1.3.8-c1.3.8_amd64.deb
```

#### RedHat & CentOS (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.3.8_c1.3.8.x86_64.rpm
sudo yum localinstall influxdb-data-1.3.8_c1.3.8.x86_64.rpm
```

### 5. Update the configuration file

In `/etc/influxdb/influxdb.conf`, set:

* `hostname` to the full hostname of the data node
* `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path`
in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData.

<dt>
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
</dt>

```
# Hostname advertised by this host for remote addresses.  This must be resolvable by all
# other nodes in the cluster
hostname="<data-node-hostname>" #✨

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" #✨ mutually exclusive with license-path

  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-path = "/path/to/readable/JSON.license.file" #✨ mutually exclusive with license-key
```

### 6. Start the data node

On sysvinit systems, use the `service` command:
```
sudo service influxdb start
```

On systemd systems, use the `systemctl` command:
```
sudo systemctl start influxdb
```

### 7. Add the node to the cluster

From a **meta** node in the cluster, run:
```
influxd-ctl add-data <data-node-hostname>:8088
```
You should see:
```
Added data node y at data-node-hostname:8088
```

Note: it may take a few minutes before the existing data become available in the cluster.

## Final steps

### 1. Add any data nodes that you removed from cluster back into the cluster

From a **meta** node in the InfluxEnterprise Cluster, run:
```
influxd-ctl add-data <the-hostname>:8088
```
Output:
```
Added data node y at the-hostname:8088
```

Finally verify that all nodes are now members of the cluster as expected:

```
influxd-ctl show
```

### 2. Rebalance the cluster

Increase the [replication factor](/enterprise_influxdb/v1.6/concepts/glossary/#replication-factor)
on all existing retention polices to the number of data nodes in your cluster.
You can do this with [ALTER RETENTION POLICY](/influxdb/v1.6/query_language/database_management/#modify-retention-policies-with-alter-retention-policy).

Next, [rebalance](/enterprise_influxdb/v1.6/guides/rebalance/) your cluster manually to meet the desired
replication factor for existing shards.

Finally, if you were using [Chronograf](/chronograf/latest/), you can
add your Enterprise instance as a new data source.  If you were not using
[Chronograf](/chronograf/latest/introduction/installation/), we recommend going through
the installation instructions and using it as your primary management UI for the instance.
