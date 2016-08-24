---
title: Release Notes/Changelog
menu:
  enterprise_1_0:
    weight: 0
    parent: About the Project
---

The following sections describe the new features available in InfluxEnterprise
1.0.

### Clustering

Clustering version 1.0 features several bug fixes.
Starting with version 1.0, clustering has full TLS support for intra-node
cluster communication, including the use of self-signed certificates.

### Web Console

Version 1.0 features various bug fixes and UI improvements.

#### Rebalancing Updates

With version 1.0 rebalancing ensures that all existing data adhere to the
relevant replication factor.
The replication factor is the part of the
[retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp)
that determines the number of copies of data that are stored in the cluster.
See [Web Console Features](/enterprise/v1.0/features/web-console-features/#cluster-rebalancing)
for more information.

#### User Updates

Version 1.0 also introduces a new way to allocate users across the
InfluxEnterprise cluster and web console.

In versions 0.7.2 and below, users were loosely synced between the cluster and
web console. In version 1.0, users have web-console-specific functions and
are given cluster-specific permissions by being associated with a
separate cluster account.
The document [InfluxEnterprise Users](/enterprise/v1.0/features/users/)
describes the new user arrangement in more detail.
Please note that this change requires additional steps if you are [upgrading](/enterprise/v1.0/administration/upgrading/)
from a previous version of the web console.
