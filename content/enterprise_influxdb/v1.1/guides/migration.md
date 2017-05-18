---
title: OSS to Cluster Migration
menu:
  enterprise_influxdb_1_1:
    weight: 10
    parent: Guides
---

The following guide has step-by-step instructions for migrating an OSS InfluxDB
instance into and InfluxEnterprise cluster.

The process assumes that you already have a fully configured InfluxEnterprise cluster
of three or more meta nodes and zero or more data nodes.

Please note that this migration process:

* Deletes all data from any data nodes that are already part of the InfluxEnterprise Cluster
* Will transfer all users from the OSS instance to the InfluxEnterprise Cluster*
* Will **not** transfer any users from the OSS instance to the InfluxEnterprise Web Console
* Requires downtime for writes and reads for the OSS instance

<dt>
\* If you're using an InfluxEnterprise cluster version prior to 0.7.4, the
following steps will **not** transfer users from the OSS instance to the
InfluxEnterprise Cluster.
</dt>

In addition, please refrain from creating a Global Admin user in the InfluxEnterprise Web Console before implementing these steps. If you’ve already created a Global Admin user, contact support.

## Modify the /etc/hosts file

Add the IP and hostname of the OSS instance to the
`/etc/hosts` file on all nodes in the InfluxEnterprise Cluster.
Ensure that all cluster IPs and hostnames are also in the OSS
instance’s `/etc/hosts` file.

**Note:** All node hostnames must be completely resolvable by all
other nodes in the cluster. If you have DNS already setup in your
environment, then this step can be skipped.

## For all existing InfluxEnterprise data nodes:

### 1. Remove the node from the InfluxEnterprise Cluster

From a **meta** node in your InfluxEnterprise Cluster, enter:
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

## For the OSS Instance:

### 1. Stop all writes to the OSS Instance

### 2. Stop the influxdb service on the OSS Instance

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

### 3. Remove the OSS package

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
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.1.5-c1.1.5_amd64.deb
sudo dpkg -i influxdb-data_1.1.5-c1.1.5_amd64.deb
```

#### RedHat & CentOS (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.1.5_c1.1.5.x86_64.rpm
sudo yum localinstall influxdb-data-1.1.5_c1.1.5.x86_64.rpm
```

### 5. Update the configuration file

In `/etc/influxdb/influxdb-meta.conf`, set:

* `hostname` to the full hostname of the meta node
* `registration-enabled` in the `[enterprise]` section to `true`
* `registration-server-url` in the `[enterprise]` section to the full URL of the server that will run the InfluxEnterprise web console.
You must fully specify the protocol, IP or hostname, and port.
Entering the IP or hostname alone will lead to errors.
* `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local path to the JSON license file you received from InfluxData. The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.


```
# Hostname advertised by this host for remote addresses.  This must be resolvable by all
# other nodes in the cluster
hostname="<enterprise-meta-0x>" #✨

[enterprise]
  # Must be set to true to use the Enterprise Web UI
  registration-enabled = true #✨

  # Must include the protocol (http://)
  registration-server-url = "http://<web-console-server-IP>:3000" #✨

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

Increase the [replication factor](/enterprise_influxdb/v1.1/concepts/glossary/#replication-factor) on all existing retention polices to the number of data nodes in your cluster.
You can do this with [ALTER RETENTION POLICY](https://docs.influxdata.com/influxdb/v1.1/query_language/database_management/#modify-retention-policies-with-alter-retention-policy).

Next, [rebalance](/enterprise_influxdb/v1.1/features/web-console-features/#cluster-rebalancing) your cluster using the `Rebalance` button on the `Tasks` page.
