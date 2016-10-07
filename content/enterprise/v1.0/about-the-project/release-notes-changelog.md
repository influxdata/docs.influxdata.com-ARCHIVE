---
title: Release Notes/Changelog
menu:
  enterprise_1_0:
    weight: 0
    parent: About the Project
---

# Clustering

## v1.0.3 [2016-10-07]

This release builds off of the 1.0.2 release of InfluxDB.  Please see the [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v102-2016-10-05) for specific changes.

### Cluster-specific Bugfixes

- Fix panic in hinted handoff: lastModified

## v1.0.2 [2016-10-06]
This release builds off of the 1.0.2 release of InfluxDB.  Please see the [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v102-2016-10-05) for specific changes.

### Cluster-specific Features

### Cluster-specific Bugfixes

- Prevent double read-lock in Meta Client.
- Corrupted hinted handoff file prevents `influxd` from starting
- Fix systemd package upgrade symlink failure

## v1.0.1 [2016-09-28]
This release builds off of the 1.0.1 OSS release of InfluxDB.
Please see the [OSS release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v101-2016-09-26)
for specific changes.

### Cluster-specific Features

### Cluster-specific Bugfixes

* Balance shards correctly with a restore
* Fix panic in hinted handoff: `runtime error: invalid memory address or nil pointer dereference`
* Ensure meta node redirects to leader when removing data node
* Fix panic in hinted handoff: `runtime error: makeslice: len out of range`
* Update sample config for data nodes

## v1.0.0 [2016-09-07]

This release builds on the latest 1.0 master branch based off of 1.0beta3 + latest.  Please see the [release notes](https://github.com/influxdata/influxdb/blob/master/CHANGELOG.md#v100-unreleased) for specific changes.

Breaking Changes:

* The keywords `IF`, `EXISTS`, and `NOT` were removed for this release. This means you no longer need to specify `IF NOT EXISTS` for `DROP DATABASE` or `IF EXISTS` for `CREATE DATABASE`.  Using these keywords will return a query error.
* `max-series-per-database` was added with a default of 1M but can be disabled by setting it to `0`. Existing databases with series that exceed this limit will continue to load, but writes that would create new series will fail.

### Hinted Handoff

A number of changes to hinted handoff are included in this release:

* Truncating only the corrupt block in a corrupted segment to minimize data loss.
* Immediately queue writes in hinted handoff if there are still writes pending to prevent inconsistencies in shards.
* Remove hinted handoff queues when data nodes are removed to eliminate manual cleanup tasks.

### Performance

* `SHOW MEASUREMENT` and `SHOW TAG VALUES` have been optimized to work better for multiple nodes and shards.
* `DROP` and `DELETE` statements run in parallel and more efficiently and should not leave the system in an inconsistent state.

### Security

The Cluster API used by `influxd-ctl` can not be protected with SSL certs.

### Cluster Management

Data nodes that can no longer be restarted can now be forcefully removed from the cluster using `influxd-ctl remove-data -force <addr>`.  This should only be run if a grace removal is not possible.

Backup and restore has been updated to fix issues and refine existing capabilities.  

### Features

- Add Users method to control client
- Force Removal Of Data Node
- Disable logging stats queries
- Optimize `SHOW MEASUREMENTS` and `SHOW TAG VALUES`
- Update go package library dependencies
- Minimize amount of data-loss in corrupted hinted handoff file by repairing it
- Log a write error when hinted handoff queue is full for a node
- Remove hinted handoff queues when data nodes are removed from the cluster
- Add tests around import for meta store
- Adds full TLS support to Plutonium's Cluster API, including the use of self-signed certificates
- Improved backup/restore
- Update shard group creation logic to be balanced
- Keep raft log to a minimum to prevent replaying large raft logs on startup

### Bugfixes

- Remove bad connection from meta executor connection pool
- Fix panic in meta store
- Fix panic caused when shard group is not found
- Corrupted Hinted Handoff
- Ensure imported OSS admin users have all privileges
- Ensure max-select-series is respected
- Handle peer already known error
- Hinted handoff panic
- Drop writes if they contain field type inconsistencies

# Web Console

## v1.0.3 [2016-10-07]

There are no new features or bugfixes in version 1.0.3.
This release is for maintaining version parity with clustering.

### Features

### Bugfixes

## v1.0.2 [2016-10-06]

### Features

### Bugfixes

- Fix systemd package upgrade symlink failure

## v1.0.1

### Features

* Log error messages from the InfluxEnterprise cluster

### Bugfixes

* Fix bug where users cannot log out of the Web Console

## v1.0.0

### Features

* **Rebalancing:** Rebalancing now ensures that all existing data adhere to the relevant [replication factor](/influxdb/v1.0/concepts/glossary/#replication-factor). See [Web Console Features](/enterprise/v1.0/features/web-console-features/#cluster-rebalancing) for more information.
* **User updates:** In versions 0.7.2 and below, users were loosely synced between the cluster and web console. In version 1.0, users have web-console-specific functions and are given cluster-specific permissions by being associated with a separate cluster account. The document [InfluxEnterprise Users](/enterprise/v1.0/features/users/) describes the new user arrangement in more detail. Please note that this change requires additional steps if you are [upgrading](/enterprise/v1.0/administration/upgrading/) from a previous version of the web console.

### Bugfixes
