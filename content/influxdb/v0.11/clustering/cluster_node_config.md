---
title: Cluster Node Configuration

menu:
  influxdb_011:
    weight: 20
    parent: Clustering
---

The following sections describe the different node types in an InfluxDB cluster and show how to configure them.

### General node configuration

Each node's [configuration file](/influxdb/v0.11/administration/config/) must specify:

* A `bind-address` in the `[meta]` section.
This is the address for cluster wide communication.
* An `http-bind-address` in the `[meta]` section.
This is the address for consensus service communication.
* A `bind-address` in the `[http]` section.
This is the address for the HTTP API.

Each configuration option should indicate the node's IP address or hostname followed by the port (see the next sections for examples).

> **NOTE:** The hostnames for each machine must be resolvable by all members of the cluster.

### Consensus node

Consensus nodes run only the consensus service.
The consensus service ensures consistency across the cluster for node membership, [databases](/influxdb/v0.11/concepts/glossary/#database), [retention policies](/influxdb/v0.11/concepts/glossary/#retention-policy-rp), [users](/influxdb/v0.11/concepts/glossary/#user), [continuous queries](/influxdb/v0.11/concepts/glossary/#continuous-query-cq), shard metadata, and [subscriptions](/influxdb/v0.11/query_language/spec/#create-subscription).

#### Configuration:
```
[meta]
  enabled = true #✨
  ...
  bind-address = "<IP>:8088"
  http-bind-address = "<IP>:8091"

...

[data]
  enabled = false #✨

[http]
  ...
  bind-address = "<IP>:8086"
```

### Data node

Data nodes run only the data service.
The data service stores the actual time series data and responds to queries about those data.

#### Configuration:
```
[meta]
  enabled = false #✨
  ...
  bind-address = "<IP>:8088"
  http-bind-address = "<IP>:8091"

...

[data]
  enabled = true #✨

[http]
  ...
  bind-address = "<IP>:8086"
```

### Hybrid node

Hybrid nodes run both the consensus and data services.

#### Configuration:
```
[meta]
  enabled = true #✨
  ...
  bind-address = "<IP>:8088"
  http-bind-address = "<IP>:8091"

...

[data]
  enabled = true #✨

[http]
  ...
  bind-address = "<IP>:8086"
```
