---
title: Cluster Node Configuration

menu:
  influxdb_010:
    weight: 20
    parent: Clustering
---

The following sections describe the different node types in an InfluxDB cluster and show how to configure them.

### General node configuration

Each node's [configuration file](/influxdb/v0.10/administration/config/) must specify:

* A `bind-address` in the `[meta]` section.
This is the address for cluster wide communication.
* An `http-bind-address` in the `[meta]` section.
This is the address for consensus node communication.
* A `bind-address` in the `[http]` section.
This is the address for the HTTP API.

Each configuration option should indicate the node's IP address or hostname followed by the port (see the next sections for examples).

> **NOTE:** The hostnames for each machine must be resolvable by all members of the cluster.

### Consensus node

Consensus nodes coordinate activity in the cluster. They participate in consensus, which means that they have consistent data about cluster membership, [databases](/influxdb/v0.10/concepts/glossary/#database), [retention policies](/influxdb/v0.10/concepts/glossary/#retention-policy-rp), [users](/influxdb/v0.10/concepts/glossary/#user), [continuous queries](/influxdb/v0.10/concepts/glossary/#continuous-query-cq), and shard metadata.

#### Configuration:
```
[meta]
  enabled = true #✨
  ...
  bind-address = "IP:8088"
  http-bind-address = "IP:8091"

...

[data]
  enabled = false #✨

[http]
  ...
  bind-address = "IP:8086"
```

### Data node

Data nodes store the actual time series data and respond to queries about those data.

#### Configuration:
```
[meta]
  enabled = false #✨
  ...
  bind-address = "IP:8088"
  http-bind-address = "IP:8091"

...

[data]
  enabled = true #✨

[http]
  ...
  bind-address = "IP:8086"
```

### Hybrid node

Hybrid nodes act as both a consensus node and a data node.

#### Configuration:
```
[meta]
  enabled = true #✨
  ...
  bind-address = "IP:8088"
  http-bind-address = "IP:8091"

...

[data]
  enabled = true #✨

[http]
  ...
  bind-address = "IP:8086"
```
