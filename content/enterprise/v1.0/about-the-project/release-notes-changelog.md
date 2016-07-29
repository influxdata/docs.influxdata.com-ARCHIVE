---
title: Release Notes/Changelog
menu:
  enterprise_1_0:
    weight: 0
    parent: About the Project
---

The following sections describe the new features available in InfluxEnterprise
Clustering version 0.7.3 and InfluxEnterprise Web Console version 0.7.0.

### Clustering

Version 0.7.3 features several bug fixes.
Starting  with version 0.7.3, migrating an OSS instance will transfer users
from the OSS instance to the InfluxEnterprise cluster.
See [OSS to Cluster Migration](/enterprise/v1.0/guides/migration) for more
information.

### Web Console

#### Tabular query output

The Data Explorer in Web Console version 0.7.0 allows users to view query output
in tabular format:

![Tabular Format GIF](/img/enterprise/tabular-format.gif)

#### Cluster rebalancing

The Web Console version 0.7.0 allows users to easily rebalance data across all
data nodes in the InfluxEnterprise Cluster.
The `Rebalance` button is available on the `Tasks` page.

Rebalancing a cluster allocates existing
[shards](https://docs.influxdata.com/influxdb/v1.0/concepts/glossary/#shard)
such that each data node has roughly the same number of shards.
Perform a rebalance if you've recently added a data node to a cluster and would
like to evenly redistribute shards across that cluster.

Note that performing a rebalance can result in temporarily inconsistent data
across data nodes.
That inconsistency is not permanent and the cluster will resolve it over time.
