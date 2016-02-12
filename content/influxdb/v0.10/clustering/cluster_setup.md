---
title: Cluster Setup
aliases:
  - /influxdb/v0.10/guides/clustering/
menu:
  influxdb_010:
    weight: 10
    parent: Clustering
---

> **NOTE:** Clustering is still considered _experimental_, and there are still quite a few rough edges.
If you encounter any issues, please [report them](https://github.com/influxdata/influxdb/issues/new).

This guide briefly introduces the InfluxDB cluster model and provides step-by-step instructions for setting up a cluster.

## InfluxDB cluster model

InfluxDB supports arbitrarily sized clusters and any [replication factor](/influxdb/v0.10/concepts/glossary/#replication-factor) from 1 to the number of nodes in the cluster.

There are three types of nodes in an InfluxDB cluster: [consensus nodes](/influxdb/v0.10/concepts/glossary/#consensus-node), [data nodes](/influxdb/v0.10/concepts/glossary/#data-node), and [hybrid nodes](/influxdb/v0.10/concepts/glossary/#hybrid-node).
A cluster must have an odd number of consensus and/or hybrid nodes to form a Raft consensus and remain in a healthy state.
Any InfluxDB cluster must have _at least_ three consensus and/or hybrid nodes.


Hardware requirements vary for the different node types. See [Hardware Sizing](/influxdb/v0.10/guides/hardware_sizing/#general-hardware-guidelines-for-clusters) for cluster hardware requirements.

## Cluster setup

The following steps configure and start up an InfluxDB cluster with three [hybrid nodes](/influxdb/v0.10/concepts/glossary/#hybrid-node).
If you're interested in having any of the different node types, see [Cluster Node Configuration](/influxdb/v0.10/clustering/cluster_node_config/) for their configuration details.
Note that your first three nodes must be either hybrid nodes or consensus nodes.


We assume that you are running some version of Linux, and, while it is possible to build a cluster locally, it is not recommended.

> **Note:** Always use the [most recent release](https://influxdata.com/downloads/#influxdb) for clustering as there are significant improvements with each release.

**<font color=white size=4>1</font>**&nbsp;&nbsp; [Install](/influxdb/v0.10/introduction/installation/) InfluxDB on three machines.
Do not start the daemon on any of the machines.

**<font color=white size=4>2</font>**&nbsp;&nbsp;Configure the three nodes.

Where `IP` is the node's IP address *or* hostname, each node's `/etc/influxdb/influxdb.conf` file should have the following settings:
```
[meta]
  enabled = true
  ...
  bind-address = "IP:8088"
  http-bind-address = "IP:8091"

...

[data]
  enabled = true

[http]
  ...
  bind-address = "IP:8086"
```

* Setting `[meta] enabled = true` and `[data] enabled = true` makes the node a hybrid node.
* The `[meta] bind-address` is the address for cluster wide communication.
* The `[meta] http-bind-address` is the address for meta node communication.
* The `[http] bind-address` is the address for the HTTP API.

> **NOTE:** The hostnames for each machine must be resolvable by all members of the cluster.

**<font color=white size=4>3</font>**&nbsp;&nbsp;Start InfluxDB on the first node:
```
sudo service influxdb start
```

**<font color=white size=4>4</font>**&nbsp;&nbsp;Connect the second and third nodes to the first node.

On the second and third nodes, set `INFLUXD_OPTS` in `/etc/default/influxdb`:
```
INFLUXD_OPTS="-join IP1:8091"
```
where `IP1` is the *first* node's IP address *or* hostname.

If the `/etc/default/influxdb` file does not exist, create it.

**<font color=white size=4>5</font>**&nbsp;&nbsp;Start InfluxDB on the second and third nodes:
```
sudo service influxdb start
```

**<font color=white size=4>6</font>**&nbsp;&nbsp;Verify that the cluster is healthy.

Issue a `SHOW SERVERS` query to each node in your cluster using the [`influx` CLI](/influxdb/v0.10/tools/shell/).
The output should show that your cluster is made up of three hybrid nodes (hybrid nodes appear as both `data_nodes` and `meta_nodes` in the `SHOW SERVERS` query results):

```
> SHOW SERVERS
name: data_nodes
----------------
id	 http_addr	 tcp_addr
1	  IP1:8086	  IP1:8088
3	  IP2:8086	  IP2:8088
5	  IP3:8086	  IP3:8088


name: meta_nodes
----------------
id	 http_addr  tcp_addr
1	  IP1:8091	  IP1:8088
2	  IP2:8091	  IP2:8088
4	  IP3:8091	  IP3:8088
```

> **Note:** The irregular node `id` numbers is a known issue and a fix is underway.
For now, it may be easier to identify data nodes and consensus nodes by the IP addresses reported in the `SHOW SERVERS` results.

And that's your three node cluster!

If you believe that you did the above steps correctly, but are still experiencing problems, try restarting each node in your cluster.

### Adding nodes to your cluster

Once your initial cluster is healthy and running appropriately, you can start adding nodes to the cluster. Additional nodes can be consensus nodes, data nodes, or hybrid nodes. See [Cluster Node Configuration](/influxdb/v0.10/clustering/cluster_node_config/) for how to configure the different node types.

Adding a node to your cluster follows the same procedure that we outlined above. Note that in step 4, when you connect your new node to the cluster, you must set `INFLUXD_OPTS` to any single pre-existing cluster member's `hostname:port` pair. If you specify more than one pair in a comma delimited list, Influx will try to connect with the additional pairs if it cannot connect with the first.
