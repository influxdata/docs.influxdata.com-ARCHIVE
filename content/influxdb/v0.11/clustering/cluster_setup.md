---
title: Cluster Setup
menu:
  influxdb_011:
    weight: 10
    parent: Clustering
---

> **NOTE:** InfluxDB 0.11 is the last open source version that includes clustering.
For more information, please see Paul Dix's blog post on [InfluxDB Clustering, High-Availability, and Monetization](https://influxdata.com/blog/update-on-influxdb-clustering-high-availability-and-monetization/).
Please note that the 0.11 version of clustering is still considered experimental, and there are still quite a few rough edges.

This guide briefly introduces the InfluxDB cluster model and provides step-by-step instructions for setting up a cluster.

## InfluxDB cluster model

InfluxDB supports arbitrarily sized clusters and any [replication factor](/influxdb/v0.11/concepts/glossary/#replication-factor) from 1 to the number of nodes in the cluster.

There are three types of nodes in an InfluxDB cluster: [consensus nodes](/influxdb/v0.11/concepts/glossary/#consensus-node), [data nodes](/influxdb/v0.11/concepts/glossary/#data-node), and [hybrid nodes](/influxdb/v0.11/concepts/glossary/#hybrid-node).
A cluster must have an odd number of nodes running the [consensus service](/influxdb/v0.11/concepts/glossary/#consensus-service) to form a Raft consensus group and remain in a healthy state.


Hardware requirements vary for the different node types. See [Hardware Sizing](/influxdb/v0.11/guides/hardware_sizing/#general-hardware-guidelines-for-clusters) for cluster hardware requirements.

## Cluster setup

The following steps configure and start up an InfluxDB cluster with three [hybrid nodes](/influxdb/v0.11/concepts/glossary/#hybrid-node).
If you're interested in having any of the different node types, see [Cluster Node Configuration](/influxdb/v0.11/clustering/cluster_node_config/) for their configuration details.
Note that your first three nodes must be either hybrid nodes or consensus nodes.


We assume that you are running some version of Linux, and, while it is possible to build a cluster on a single server, it is not recommended.

**<font color=white size=4>1</font>**&nbsp;&nbsp; [Install](/influxdb/v0.11/introduction/installation/) InfluxDB on three machines.
Do not start the daemon on any of the machines.

**<font color=white size=4>2</font>**&nbsp;&nbsp;Configure the three nodes.

Where `IP` is the node's IP address *or* hostname, each node's `/etc/influxdb/influxdb.conf` file should have the following settings:
```
[meta]
  enabled = true
  ...
  bind-address = "<IP>:8088"
  ...
  http-bind-address = "<IP>:8091"

...

[data]
  enabled = true

...

[http]
  ...
  bind-address = "<IP>:8086"
```

* Setting `[meta] enabled = true` and `[data] enabled = true` makes the node a hybrid node.
* The `[meta] bind-address` is the address for cluster wide communication.
* The `[meta] http-bind-address` is the address for meta node communication.
* The `[http] bind-address` is the address for the HTTP API.

> **NOTE:** The hostnames for each machine must be resolvable by all members of the cluster.

**<font color=white size=4>3</font>**&nbsp;&nbsp;Point all nodes to each other.

On all three nodes, set `INFLUXD_OPTS` in `/etc/default/influxdb`:
```
INFLUXD_OPTS="-join <IP1>:8091,<IP2>:8091,<IP3>:8091"
```
where `IP1` is the first node's IP address *or* hostname, `IP2` is the second nodes's IP address *or* hostname, and `IP3` is the third node's IP address *or* hostname.

If the `/etc/default/influxdb` file does not exist, create it.

**<font color=white size=4>4</font>**&nbsp;&nbsp;Start InfluxDB on each node:
```
sudo service influxdb start
```

**<font color=white size=4>5</font>**&nbsp;&nbsp;Verify that the cluster is healthy.

Issue a `SHOW SERVERS` query to each node in your cluster using the [`influx` CLI](/influxdb/v0.11/tools/shell/).
The output should show that your cluster is made up of three hybrid nodes (hybrid nodes appear as both `data_nodes` and `meta_nodes` in the `SHOW SERVERS` query results):

```
> SHOW SERVERS
name: data_nodes
----------------
id	 http_addr		  tcp_addr
1	  <IP1>:8086	  <IP1>:8088
2	  <IP2>:8086	  <IP2>:8088
3	  <IP3>:8086	  <IP3>:8088


name: meta_nodes
----------------
id	 http_addr		  tcp_addr
1	  <IP1>:8091	  <IP1>:8088
2	  <IP2>:8091	  <IP2>:8088
3	  <IP3>:8091	  <IP3>:8088
```

> **Note:**
The `SHOW SERVERS` query groups results into `data_nodes` and `meta_nodes`. The term `meta_nodes` is outdated and refers to a node that runs the consensus service.

And that's your three node cluster!

If you believe that you did the above steps correctly, but are still experiencing problems, try restarting each node in your cluster.

### Adding nodes to your cluster

Once your initial cluster is healthy and running appropriately, you can start adding nodes to the cluster.
Additional nodes can be consensus nodes, data nodes, or hybrid nodes.
See [Cluster Node Configuration](/influxdb/v0.11/clustering/cluster_node_config/) for how to configure the different node types.

Adding a node to your cluster follows the same procedure that we outlined above.
Note that in step 4, when you point your new node to the cluster, you must set `INFLUXD_OPTS` to every node in the cluster, including itself.
