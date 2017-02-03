---
title: Installation Guidelines (⏰ Please Read!)
aliases:
  /enterprise/v1.2/introduction/meta_node_installation/
  /enterprise/v1.2/introduction/data_node_installation/
  /enterprise/v1.2/introduction/web_console_installation/
menu:
  enterprise_1_2:
    weight: 20
    parent: Introduction
---

Please review the sections below before you begin working with InfluxEnterprise.

## Which installation is right for me?

There are two ways to install InfluxEnterprise.

The first option is the [QuickStart Installation](/enterprise/v1.2/quickstart_installation/) process.
We recommend the QuickStart Installation process for users looking to quickly
get up and running with InfluxEnterprise and for users who are looking to
evaluate the product.
The QuickStart Installation process **is not** designed for use
in a production environment.

The second option is the [Production Installation](/enterprise/v1.2/production_installation/) process.
We recommend the Production Installation process for users looking to deploy
InfluxEnterprise in a production environment.

> **Note:** If you install InfluxEnterprise with the QuickStart Installation process you
will need to reinstall InfluxEnterprise with the Production Installation
process before using the product in a production environment.

## Requirements for InfluxEnterprise Clusters

Please review the [Clustering Guide](http://docs.influxdata.com/enterprise/v1.2/concepts/clustering/)
for an overview of the architecture and concepts in an InfluxEnterprise Cluster
and the
[Hardware Sizing Guide](http://docs.influxdata.com/influxdb/v1.0/guides/hardware_sizing/#general-hardware-guidelines-for-a-cluster)
for information on provisioning the correct servers.

For clusters using a license key and not a license file, all nodes must be able to contact `portal.influxdata.com`
via port `80` or port `443`. Nodes that go more than four hours without connectivity to the Portal may experience license issues.

### Frequently Overlooked Requirements

The following are the most frequently overlooked requirements when installing a cluster.

#### Ensure connectivity between machines

All nodes in the cluster must be able to resolve each other by hostname or IP,
whichever is used in the configuration files.

For simplicity, ensure that all nodes can reach all other nodes on ports `8086`, `8088`, `8089`, and `8091`.
If you alter the default ports in the configuration file(s), ensure the configured ports are open between the nodes.

#### Synchronize time between hosts

InfluxEnterprise uses hosts' local time in UTC to assign timestamps to data and for
coordination purposes.
Use the Network Time Protocol (NTP) to synchronize time between hosts.

#### Use SSDs

Clusters require sustained availability of 1000-2000 IOPS from the attached storage.
SANs must guarantee at least 1000 IOPS is always available to InfluxEnterprise
nodes or they may not be sufficient.
SSDs are strongly recommended, and we have had no reports of IOPS contention from
any customers running on SSDs.

#### Use three and only three Meta nodes

Although technically the cluster can function with any number of meta nodes, there are
very few if any reasons to run with anything other than three meta nodes. One or two
meta nodes offer very little redundancy.
The loss of one meta node will render a single meta node cluster non-functional,
and will prevent a two meta node cluster from functioning more than a few hours, at best.

In contrast, a three meta node cluster can tolerate the permanent loss of a single
meta node with no degradation in any function or performance.
A replacement meta node can be added to restore the cluster to full redundancy.
A three meta node cluster that loses two meta nodes will still be able to handle
basic writes and queries, but no new shards, databases, users, etc. can be created.

Running a cluster with five meta nodes does allow for the permanent loss of
two meta nodes without impact on the cluster, but it doubles the
Raft communication overhead.

#### Meta and Data nodes are fully independent

Meta nodes run the Raft consensus protocol together, and manage the metastore of
all shared cluster information: cluster nodes, databases, retention policies,
shard groups, users, continuous queries, and subscriptions.

Data nodes store the shard groups and respond to queries.
They request metastore information from the meta group as needed.

There is no requirement at all for there to be a meta process on a data node,
or for there to be a meta process per data node.
Three meta nodes is enough for an arbitrary number of data nodes, and for best
redundancy, all nodes should run on independent servers.

#### Install the Web Console last

The Enterprise Web Console should not be installed or configured until the
InfluxEnterprise cluster is fully functional.
Attempting to connect the Web Console before the cluster is installed
and fully functional, successfully processing writes and queries, will
lead to user permission and data retrieval issues.
