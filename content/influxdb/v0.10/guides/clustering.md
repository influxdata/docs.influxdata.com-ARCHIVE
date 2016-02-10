---
title: Clustering

menu:
  influxdb_010:
    weight: 20
    parent: guides
---

> **NOTE:** Clustering is still considered _experimental_, and there are still quite a few rough edges. If you encounter any issues, please [report them](https://github.com/influxdata/influxdb/issues/new).

This guide briefly introduces the InfluxDB cluster model and provides step-by-step instructions for setting up a cluster.

## InfluxDB cluster model

InfluxDB supports arbitrarily sized clusters and any [replication factor](/influxdb/v0.10/concepts/glossary/#replication-factor) from 1 to the number of nodes in the cluster.
There are three types of nodes in an InfluxDB cluster:

* **Meta nodes** coordinate activity in the cluster. They participate in consensus, which means that they have consistent data about cluster membership, [databases](/influxdb/v0.10/concepts/glossary/#database), [retention policies](/influxdb/v0.10/concepts/glossary/#retention-policy-rp), [users](/influxdb/v0.10/concepts/glossary/#user), [continuous queries](/influxdb/v0.10/concepts/glossary/#continuous-query-cq), and shard meta-data.

    *Requirements:*
    Meta nodes do not require significant system resources and can run on a very lightweight server.

* **Data nodes** store data and respond to queries. Here, data refers to time series data and the time series data [schema](/influxdb/v0.10/concepts/glossary/#schema).

    *Requirements:*
    Data nodes must run on systems with at least 2 CPUs, 4GB RAM, and storage with 1000 IOPS.
    See the [hardware sizing guide](/influxdb/v0.10/guides/hardware_sizing/) for more detail.

* **Meta-data nodes** act as both a meta node and a data node.

In an InfluxDB cluster, any node can be a meta node, data node, or both.
Each cluster must have _at least_ three meta nodes (or meta-data nodes) in order to form a Raft consensus and remain in a healthy state.

## Cluster setup

The following sections configure an InfluxDB cluster with three meta nodes (the raft cluster) and one data node.
While this may not match the makeup of your cluster, the steps to set it up will be similar.
Note that you need at least three meta nodes (or meta-data nodes) to form a healthy raft cluster.

The following steps assume that you are running some version of Linux, and, while it is possible to build a cluster locally, it is not recommended.

> **Note:** Always use the [most recent release](https://influxdata.com/downloads/#influxdb) for clustering as there are significant improvements with each release.

### Start the Raft cluster

**<font color=white size=4>1</font>** [Install](/influxdb/v0.10/introduction/installation/) InfluxDB on three machines.
Do not start the daemon on any of the machines.

**<font color=white size=4>2</font>** Configure the raft cluster.

Where `IP` is the node's IP address *or* hostname, each node's `/etc/influxdb/influxdb.conf` file should have the following settings:
```
[meta]
  enabled = true
  ...
  bind-address = "IP:8088"
  http-bind-address = "IP:8091"

...

[data]
  enabled = false

[http]
  ...
  bind-address = "IP:8086"
```

● Setting `[meta] enabled = true` and `[data] enabled = false` makes the node a meta node.  
● The `[meta] bind-address` is the address for cluster wide communication.  
● The `[meta] http-bind-address` is the address for meta node communication.  
● The `[http] bind-address` is the address for the HTTP API.  

> **NOTE:** The hostnames for each machine must be resolvable by all members of the cluster.

**<font color=white size=4>3</font>** Start InfluxDB on the first node:
```
sudo service influxdb start
```

**<font color=white size=4>4</font>** Connect the second and third nodes to the first node.

On the second and third nodes, set `INFLUXD_OPTS` in `/etc/default/influxdb`:
```
INFLUXD_OPTS="-join IP1:8091"
```
where `IP1` is the *first* node's IP address *or* hostname.

If the `/etc/default/influxdb` file does not exist, create it.

**<font color=white size=4>5</font>** Start InfluxDB on the second and third node:
```
sudo service influxdb start
```

**<font color=white size=4>6</font>** Verify that the Raft cluster is healthy.

Issue a `SHOW SERVERS` query to each node in your raft cluster using the [`influx` CLI](/influxdb/v0.10/tools/shell/).
The output should show that your cluster is made up of three meta-data nodes (note that meta-data nodes appear as both `data_nodes` and `meta_nodes` in the `SHOW SERVERS` query results):

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
For now, it may be easier to identify data nodes and meta nodes by the IP addresses reported in the `SHOW SERVERS` results.

And that's the Raft cluster!
If you believe that you did the following steps correctly, but are still experiencing problems, try restarting each node in your cluster.

### Add a data node

Once the Raft cluster is healthy and running appropriately, you can start adding nodes to the cluster. The following steps add a data node to the cluster.

**<font color=white size=4>1</font>** [Install](/influxdb/v0.10/introduction/installation/) InfluxDB on the machine.
Do not start the daemon.

**<font color=white size=4>2</font>** Configure the data node.

Where `IP4` is the data node's IP address *or* hostname, the node's `/etc/influxdb/influxdb.conf` file should have the following settings:
```
[meta]
  enabled = false
  ...
  bind-address = "IP4:8088"
  http-bind-address = "IP4:8091"

...

[data]
  enabled = true

[http]
  ...
  bind-address = "IP4:8086"
```

● Setting `[meta] enabled = false` and `[data] enabled = true` makes the node a data node.  
● The `[meta] bind-address` is the address for cluster wide communication.  
● The `[meta] http-bind-address` is the address for meta node communication.  
● The `[http] bind-address` is the address for the HTTP API.

**<font color=white size=4>3</font>** Connect the data node to a pre-existing member of the cluster.

On the fourth node, set `INFLUXD_OPTS` in `/etc/default/influxdb`:
```
INFLUXD_OPTS="-join IP:8091"
```
where `IP` is a pre-existing cluster member's IP address *or* hostname.

If the `/etc/default/influxdb` file does not exist, create it.

> **Note:** When using the `-join` you need only specify one `hostname:port` pair.
If you provide more than `hostname:port` in a comma delimited list, Influx will try to connect with the additional pairs if it cannot connect with the first pair.

**<font color=white size=4>4</font>** Start InfluxDB on the data node:
```
sudo service influxdb start
```

**<font color=white size=4>5</font>** Verify that the cluster is healthy.

The results of the `SHOW SERVERS` query should now show that your cluster is made up of three meta-data nodes and one data-only node:

```
> SHOW SERVERS
name: data_nodes
----------------
id	 http_addr  tcp_addr
1	  IP1:8086	  IP1:8088
3	  IP2:8086	  IP2:8088
5	  IP3:8086	  IP3:8088
6	  IP4:8086	  IP4:8088 ✨The new data-only node✨


name: meta_nodes
----------------
id	 http_addr  tcp_addr
1	  IP1:8091	  IP1:8088
2	  IP2:8091	  IP2:8088
4	  IP3:8091	  IP3:8088
```

> **Note:** The irregular node `id` numbers is a known issue and a fix is underway.
For now, it may be easier to identify data nodes and meta nodes by the IP addresses reported in the `SHOW SERVERS` results.

You now have a four node cluster! Follow the same procedure to add additional data nodes, meta nodes, and/or meta-data nodes. Note that the configuration file (`/etc/influxdb/influxdb.conf`) for a meta-data node looks like this:
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
where `IP` is the data node's IP address or hostname.
