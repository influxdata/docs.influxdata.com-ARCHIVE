---
title: Clustering

menu:
  influxdb_010:
    weight: 20
    parent: guides
---

> **NOTE:** Clustering is still considered _experimental_, and there are still quite a few rough edges. If you encounter any issues, please [report them](https://github.com/influxdata/influxdb/issues/new).

InfluxDB supports arbitrarily sized clusters and any replication
factor from 1 to the number of nodes in the cluster. There are two
types of nodes in an InfluxDB cluster:

- [Meta nodes](/influxdb/v0.10/concepts/glossary/#meta-node) coordinate
activity in the cluster.  Meta nodes do not require significant system
resources and can run on a very lightweight server.

- [Data nodes](/influxdb/v0.10/concepts/glossary/#data-node) store data
and respond to queries. Data nodes must run on systems with at least
2 CPUs, 4GB RAM, and storage with 1000 IOPS.  See the
[hardware sizing guide](/influxdb/v0.10/guides/hardware_sizing/) for
more detail.

Any node can be a meta node, data node, or both. Each cluster must
have _at least_ three meta nodes in order to form a Raft concensus and
remain in a healthy state.

## Configuration

The following is the current recommended procedure for configuring a cluster.

> **Note:** You should always use the most recent release for clustering as there are significant improvements with each release.

### Start the Initial Raft Cluster

Throughout this example, each node will be given a hostname that
denotes the order in which it was started (e.g. `influx1` for the
first node, `influx2` for the second node, etc.). Each machine
hostname must be resolvable over the network. You will need at least
_three_ nodes in order to form a healthy raft cluster. It is also
assumed that you are running some version of Linux, and, while it is
possible to build a cluster locally, it is not recommended.

1. Install InfluxDB on the 3 machines following the [installation guide](/influxdb/v0.10/introduction/installation/).
Do not start the daemon on any of the machines.
2. For each node's `/etc/influxdb/influxdb.conf` file, replace each of the following paramaters:
   - Under the `[meta]` section, set the `bind-address` parameter to `<hostname>:8088`. For example, `influx1`'s meta `bind-address` value will be set to `influx1:8088`.
   - Under the `[meta]` section, set the `http-bind-address` parameter to `<hostname>:8091`. For example, `influx1`'s meta `http-bind-address` value will be set to `influx1:8091`.
   - Under the `[http]` section, set the `bind-address` parameter to `<hostname>:8086`. For example, `influx1`'s http `bind-address` value will be set to `influx1:8086`

	<br>
	
	> **Note:** the hostnames for each machine must be resolvable by all members of the cluster. IP addresses are also acceptable instead of hostnames.

3. Start InfluxDB on the first node (`influx1`), `sudo service influxdb start`.
4. In `/etc/default/influxdb` on the second and third node (`influx2` and `influx3`), set `INFLUXD_OPTS="-join influx1:8091"`. If the `/etc/default/influxdb` file does not exist, create it.
5. Start InfluxDB on the second and third node, `sudo service influxdb start`.

At this point you'll want to verify that that your initial raft cluster is healthy.
To do this, issue a `SHOW SERVERS` query to each node in your raft cluster using the `influx` CLI.
You should see something along the lines of this:

> **Note:** The CLI output of a `SHOW SERVERS` command should look similar to:

```
> SHOW SERVERS
name: data_nodes
----------------
id	http_addr	tcp_addr
2	influx1:8086	influx1:8088
5	influx3:8086	influx3:8088
6	influx2:8086	influx2:8088

name: meta_nodes
----------------
id	http_addr	tcp_addr
1	influx1:8091	influx1:8088
3	influx3:8091	influx3:8088
4	influx2:8091	influx2:8088
```

If you believe that you did the following steps correctly, but are still experiencing problems, try restarting each node in your cluster.

### Adding More Nodes

Once you have verified that your cluster is healthy and running appropriately, you can add extra nodes by following the same steps above. When specifying the `-join` address, you will need to use the hostname/IP address of a pre-existing member of the cluster (either `influx1`, `influx2`, or `influx3` if following the example above).

> **Note:** When using the `-join` you need only specify one `hostname:port` pair.
However, if more than one is provided, Influx will try to connect with the additional pairs in the case that it cannot connect with the first one.
