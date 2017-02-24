---
title: Upgrading from Previous Versions
menu:
  enterprise_1_2:
    weight: 0
    parent: Administration
---

## Upgrading from version 1.1 to 1.2

For users currently on clustering version 1.1.x, please do not upgrade to clustering version 1.2.x.
**We are currently addressing and testing several issues identified in the 1.2.x release.
We've include a list of those issues below.**

For users currently on clustering version 1.2.0, please upgrade to version 1.2.1 **immediately**.
Clustering version 1.2.1 fixes [two issues](/enterprise/v1.2/about-the-project/release-notes-changelog/#v1-2-1-2017-01-25) that were identified in clustering version 1.2.0. The relevant 1.2.1 packages are listed below.
<br>
If you have already upgraded to 1.2.x, please do **not** attempt to downgrade your cluster from version 1.2.x to 1.1.x; reverting from version 1.2.x to version 1.1.x is not a supported process.
<br>

If you have any issues with your cluster, please do not hesitate to contact support at the email provided to you when you received your InfluxEnterprise license.

## Clustering version 1.2.1 packages

### Ubuntu & Debian (64-bit)

#### Meta nodes
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.2.0-c1.2.1_amd64.deb
sudo dpkg -i influxdb-meta_1.2.0-c1.2.1_amd64.deb
```

#### Data nodes
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.2.0-c1.2.1_amd64.deb
sudo dpkg -i influxdb-data_1.2.0-c1.2.1_amd64.deb
```

### RedHat & CentOS (64-bit)

#### Meta nodes
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.2.0_c1.2.1.x86_64.rpm
sudo yum localinstall influxdb-meta-1.2.0_c1.2.1.x86_64.rpm
```

#### Data nodes
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.2.0_c1.2.1.x86_64.rpm
sudo yum localinstall influxdb-data-1.2.0_c1.2.1.x86_64.rpm
```

## Known issues in clustering version 1.2.1

### OSS issues (these issues also apply to InfluxEnterprise clusters)

#### Regular expressions
- [#7877](https://github.com/influxdata/influxdb/issues/7877): For some queries, the new shard mapper implementation ignores regular expressions.
- [#7906](https://github.com/influxdata/influxdb/issues/7906): Regular expressions mistakenly use an exact match for case-insensitive expressions.

#### Subqueries
- [#7885](https://github.com/influxdata/influxdb/issues/7885): The `LIMIT` and `OFFSET` clauses do not function correctly in subqueries.
- [#7888](https://github.com/influxdata/influxdb/pull/7888): Some subqueries return duplicate columns and points in the wrong order.
- [#7910](https://github.com/influxdata/influxdb/issues/7910): Subqueries with an expression in parentheses cause a Go (golang) stack overflow.
- [#7946](https://github.com/influxdata/influxdb/issues/7946): Non-admin users cannot perform subqueries.
- [#7966](https://github.com/influxdata/influxdb/pull/7966): Queries that include an aggregation function and a `GROUP BY <tag-key>` clause in the subquery, and reference that tag key in the main query result in a panic.

#### Other
- [#7895](https://github.com/influxdata/influxdb/issues/7895): The system performs incorrect math when aggregate functions emit different timestamps.
- [#7905](https://github.com/influxdata/influxdb/issues/7905): The `ORDER BY time DESC` clause sometimes returns results in the wrong order.
- [#7929](https://github.com/influxdata/influxdb/issues/7929): Tags can become dereferenced during iteration which causes a segmentation fault.

### Cluster-specific issues

#### Backup and Restore
- Backups return a `shard not found` error if they encounter an empty shard.
- Restores return a `shard not found` error if they encounter an empty shard.
- Restores from an incremental backup do not handle file paths correctly.
- Incremental backups with restrictions (for example, they use the `-db` or `-rp` flags) cannot be stored in the same directory.
- Restores from an incremental backup require the user to be on the meta node leader.

#### Hinted Handoff
- Dropped writes are not recorded when the hinted handoff queue reaches the maximum size.
- The hinted handoff queue drops points encountering field type conflicts or hitting the max-values-per-tag limit.

#### Other
- A panic occurs when the system fails to process points.
- Cluster hostnames must be lowercase.
- The `retryCAS` code doesn't wait for a newer snapshot before retrying.
- Raft log buildup occurs on meta nodes.
- RPM packages include sysvinit package dependency.

**The InfluxData engineering team is working to address these issues as rapidly as possible. Look for a 1.2.x update shortly.**
