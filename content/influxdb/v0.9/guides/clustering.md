---
title: Clustering
aliases:
  - /docs/v0.9/guides/clustering.html
  - /docs/v0.9/concepts/clustering.html
  - /docs/v0.9/advanced_topics/clustering.html

---

> **Note:** Clustering is in a beta state right now. There are still a good number of rough edges. If you notice any issues please [report them](https://github.com/influxdb/influxdb/issues/new).

Starting with version 0.9.3, InfluxDB supports arbitrarily sized clusters that need not be fully replicated. Additionally new data nodes can be added to a cluster. The first three nodes to join a cluster are raft peers. All subsequent nodes are data nodes and do not participate in consensus.

<dt> Distributed meta-queries are not fully functional. See issues [3295](https://github.com/influxdb/influxdb/issues/3295) and [3296](https://github.com/influxdb/influxdb/issues/3296) for more information.</dt>


## Configuration
The following is the current recommended procedure for configuring a cluster.

> **Note:** You should always use the most recent release for clustering as there are significant improvements with each release. Do not attempt a cluster with InfluxDB versions prior to 0.9.3. 

### Start the Initial Raft Cluster

Throughout this example, each node will be given a number that denotes the order in which it was started (e.g. 1 for the first node, 2 for the second node, etc.). It is also assumed that you are running some version of Linux and while it is possible to build a cluster locally, it is not recommended.

1. Install InfluxDB on the 3 machines following the [installation guide](/docs/v0.9/introduction/installation.html). Do not start the daemon on any of the machines.
2. For each node's `/etc/opt/influxdb/influxdb.conf` file, replace `hostname = "localhost"` with your host's actual name. This hostname must be resolved by all members in the cluster. It can be an IP or a hostname and optional port number if necessary.
3. For each node's `/etc/opt/influxdb/influxdb.conf` file, update the bind-address to another port if `8088` is unacceptable. The bind-address can also specify the host interface IP to use (e.g. `10.0.1.10:8088`). By default it will bind on all interfaces. Note that the port may differ from node to node (e.g. one can use `8088`, another use `9099`, and the other `10101`).
4. Start InfluxDB on the first node, `sudo service influxdb start` (or `sudo systemctl start influxdb` if you are using systemd).
5. In `/etc/default/influxdb` on the second node, set `INFLUXD_OPTS="-join hostname_1:port_1"`. If the file does not exist, create it.
6. Start InfluxDB on the second node, `sudo service influxdb start` (or `sudo systemctl start influxdb` if you are using systemd).
7. In `/etc/default/influxdb` on the third node, set `INFLUXD_OPTS="-join hostname_1:port_1,hostname_2:port_2"`. If the file does not exist, create it.
8. Start InfluxDB on the third node, `sudo service influxdb start` (or `sudo systemctl start influxdb` if you are using systemd).

> **Note:** As an alternative to steps 3 and 4, an additional `-hostname host[:port]` flag may be provided to `INFLUXD_OPTS`.

At this point you'll want to verify that that your initial raft cluster is healthy. To do this, issue a `SHOW SERVERS` query to each node in your raft cluster. You should see something along the lines of this:

| id | cluster_addr | raft |
|----|--------------|------|
|  1 | "hostname_1:port_1" |  true |
|  2 | "hostname_2:port_2" |  true |
|  3 | "hostname_3:port_3" |  true |

> **Note:** The CLI output of `SHOW SERVERS` looks like this
>
```
> show servers
id    cluster_addr            raft
1     hostname_1:port_1       true
2     hostname_2:port_2       true
3     hostname_3:port_3       true
```

If you do not see all three raft nodes, your cluster is not healthy. If you believe that you did the following steps correctly, but are still experiencing problems, try restarting each node in your cluster. If your problems persist, uninstall InfluxDB on each machine and retry steps 1 through 8. Under no circumstance should you continue setting up your cluster if your initial raft cluster is not healthy.

> **Note:** If you're having a hard time setting up your cluster, try setting the `/var/opt/influxdb/meta/peers.json` file manually to be `["<hostname 1>:<port 1>","<hostname 2>:<port 2>","<hostname 3>:<port 3>"]`.

### Add More Data Nodes

Once you have verified that your raft cluster is healthy and running appropriately, extra data nodes can be added.

1. Install InfluxDB on the new node.
2. In the new node's `/etc/opt/influxdb/influxdb.conf` file, replace `hostname = "localhost"` with the nodes hosts actual name. This hostname must be resolved by all members in the cluster. It can be an IP or a hostname and optional port number if necessary.
3. In the new node's `/etc/opt/influxdb/influxdb.conf` file, update the bind-address to another port if `8088` is unacceptable. The bind-address can also specify the host interface IP to use (e.g. `10.0.1.10:8088`). By default it will bind on all interfaces. Note that the port may differ from node to node (e.g. one can use `8088`, another use `9099`, and the other `10101`).
4. In the new node's `/etc/default/influxdb` file, set `INFLUXD_OPTS="-join hostname_1:port_1,hostname_2:port_2"`. If the file does not exist, create it.
5. Start InfluxDB on the new node, `sudo service influxdb start` (or `sudo systemctl start influxdb` if you are using systemd).

> **Note:** When using the `-join` you need only specify one `hostname:port` pair. However, if more than one is provided, Influx will try to connect with the additional pairs in the case that it cannot connect with the first one.


> **Note:** As an alternative to steps 2 and 3, an additional `-hostname host[:port]` flag may be provided to `INFLUXD_OPTS`.



To verify that the new node has successfully joined the cluster, issue a `SHOW SERVERS` query to one of the nodes in the cluster. You should see something along the lines of this:

| id | cluster_addr | raft |
|----|:--------------:|------|
|  1 | "hostname_1:port_1" |  true  |
|  2 | "hostname_2:port_2" |  true  |
|  3 | "hostname_3:port_3" |  true  |
| ...|        ...                  |  false |
|  n | "hostname_n:port_n" |  false |

If you do not, then your node was not successfully added to the cluster. Please verify that your cluster is healthy and retry steps 1 through 3.


## Unimplemented Features

* Configuring which nodes participate in raft consensus after the first three nodes form a cluster is not currently possible. For now, all new nodes are data-only nodes.
* Removing raft nodes.  
