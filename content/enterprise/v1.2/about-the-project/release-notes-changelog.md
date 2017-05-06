---
title: Release Notes/Changelog
menu:
  enterprise_1_2:
    weight: 0
    parent: About the Project
---

<table style="width:100%">
  <tr>
    <td><a href="#clustering">Clustering Release Notes/Changelog</a></td>
    <td><a href="#web-console">Web Console Release Notes/Changelog</a></td>
  </tr>
</table>

<br>
<br>
# Clustering

## v1.2.5 [2017-05-16]

This release builds off of the 1.2.4 release of OSS InfluxDB.
Please see the OSS [release notes](/influxdb/v1.2/about_the_project/releasenotes-changelog/#v1-2-4-2017-05-08) for more information about the OSS releases.

#### Bugfixes

- Fix issue where the [`ALTER RETENTION POLICY` query](/influxdb/v1.2/query_language/database_management/#modify-retention-policies-with-alter-retention-policy) does not update the default retention policy.
- Hinted-handoff: remote write errors containing `partial write` are considered droppable.
- Fix the broken `influxd-ctl remove-data -force` command.
- Fix security escalation bug in subscription management.
- Prevent certain user permissions from having a database-specific scope.
- Reduce the cost of the admin user check for clusters with large numbers of users.
- Fix hinted-handoff remote write batching.

## v1.2.2 [2017-03-15]

This release builds off of the 1.2.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v121-2017-03-08) for more information about the OSS release.

### Release Notes

### Configuration Changes

The following configuration changes may need to changed before [upgrading](/enterprise/v1.2/administration/upgrading/) to 1.2.2 from prior versions.

#### shard-writer-timeout

We've removed the data node's `shard-writer-timeout` configuration option from the `[cluster]` section.
As of version 1.2.2, the system sets `shard-writer-timeout` internally.
The configuration option can be removed from the [data node configuration file](/enterprise/v1.2/administration/configuration/#data-node-configuration).

#### retention-autocreate

In versions 1.2.0 and 1.2.1, the `retention-autocreate` setting appears in both the meta node and data node configuration files.
To disable retention policy auto-creation, users on version 1.2.0 and 1.2.1 must set `retention-autocreate` to `false` in both the meta node and data node configuration files.

In version 1.2.2, we’ve removed the `retention-autocreate` setting from the data node configuration file.
As of version 1.2.2, users may remove `retention-autocreate` from the data node configuration file.
To disable retention policy auto-creation, set `retention-autocreate` to `false` in the meta node configuration file only.

This change only affects users who have disabled the `retention-autocreate` option and have installed version 1.2.0 or 1.2.1.

#### Bugfixes

##### Backup and Restore
<br>

- Prevent the `shard not found` error by making [backups](/enterprise/v1.2/guides/backup-and-restore/#backup) skip empty shards
- Prevent the `shard not found` error by making [restore](/enterprise/v1.2/guides/backup-and-restore/#restore) handle empty shards
- Ensure that restores from an incremental backup correctly handle file paths
- Allow incremental backups with restrictions (for example, they use the `-db` or `rp` flags) to be stores in the same directory
- Support restores on meta nodes that are not the raft leader

##### Hinted Handoff
<br>

- Fix issue where dropped writes were not recorded when the [hinted handoff](/enterprise/v1.2/concepts/clustering/#hinted-handoff) queue reached the maximum size
- Prevent the hinted handoff from becoming blocked if it encounters field type errors

##### Other
<br>

- Return partial results for the [`SHOW TAG VALUES` query](/influxdb/v1.2/query_language/schema_exploration/#show-tag-values) even if the cluster includes an unreachable data node
- Return partial results for the [`SHOW MEASUREMENTS` query](/influxdb/v1.2/query_language/schema_exploration/#show-measurements) even if the cluster includes an unreachable data node
- Prevent a panic when the system files to process points
- Ensure that cluster hostnames can be case insensitive
- Update the `retryCAS` code to wait for a newer snapshot before retrying
- Serialize access to the meta client and meta store to prevent raft log buildup
- Remove sysvinit package dependency for RPM packages
- Make the default retention policy creation an atomic process instead of a two-step process
- Prevent `influxd-ctl`'s [`join` argument](/enterprise/v1.2/features/cluster-commands/#join) from completing a join when the command also specifies the help flag (`-h`)
- Fix the `influxd-ctl`'s [force removal](/enterprise/v1.2/features/cluster-commands/#remove-meta) of meta nodes
- Update the meta node and data node sample configuration files

## v1.2.1 [2017-01-25]

#### Cluster-specific Bugfixes

- Fix panic: Slice bounds out of range  
&emsp;Fix how the system removes expired shards.
- Remove misplaced newlines from cluster logs

## v1.2.0 [2017-01-24]

### Release Notes

This release builds off of the 1.2.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v120-2017-01-24) for more information about the OSS release.

### Upgrading

* The `retention-autocreate` configuration option has moved from the meta node configuration file to the [data node configuration file](/enterprise/v1.2/administration/configuration/#retention-autocreate-true).
To disable the auto-creation of retention policies, set `retention-autocreate` to `false` in your data node configuration files.
* The previously deprecated `influxd-ctl force-leave` command has been removed. The replacement command to remove a meta node which is never coming back online is [`influxd-ctl remove-meta -force`](/enterprise/v1.2/features/cluster-commands/).

#### Cluster-specific Features

- Improve the meta store: any meta store changes are done via a compare and swap
- Add support for [incremental backups](/enterprise/v1.2/guides/backup-and-restore/)
- Automatically remove any deleted shard groups from the data store
- Uncomment the section headers in the default [configuration file](/enterprise/v1.2/administration/configuration/)
- Add InfluxQL support for [subqueries](/influxdb/v1.2/query_language/data_exploration/#subqueries)

#### Cluster-specific Bugfixes

- Update dependencies with Godeps
- Fix a data race in meta client
- Ensure that the system removes the relevant [user permissions and roles](/enterprise/v1.2/features/users/) when a database is dropped
- Fix a couple typos in demo [configuration file](/enterprise/v1.2/administration/configuration/)
- Make optional the version protobuf field for the meta store
- Remove the override of GOMAXPROCS
- Remove an unused configuration option (`dir`) from the backend
- Fix a panic around processing remote writes
- Return an error if a remote write has a field conflict
- Drop points in the hinted handoff that (1) have field conflict errors (2) have [`max-values-per-tag`](/influxdb/v1.2/administration/config/#max-values-per-tag-100000) errors
- Remove the deprecated `influxd-ctl force-leave` command
- Fix issue where CQs would stop running if the first meta node in the cluster stops
- Fix logging in the meta httpd handler service
- Fix issue where subscriptions send duplicate data for [Continuous Query](/influxdb/v1.2/query_language/continuous_queries/) results
- Fix the output for `influxd-ctl show-shards`
- Send the correct RPC response for `ExecuteStatementRequestMessage`

## v1.1.5 [2017-04-28]

### Bugfixes

- Prevent certain user permissions from having a database-specific scope.
- Fix security escalation bug in subscription management.

## v1.1.3 [2017-02-27]

## Release Notes

This release incorporates the changes in the 1.1.4 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.4/CHANGELOG.md) for more information about the OSS release.

### Bugfixes

- Delay when a node listens for network connections until after all requisite services are running. This prevents queries to the cluster from failing unnecessarily.
- Allow users to set the `GOMAXPROCS` environment variable.

## v1.1.2 [internal]

## Release Notes

This release was an internal release only.
It incorporates the changes in the 1.1.3 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.3/CHANGELOG.md) for more information about the OSS release.

## v1.1.1 [2016-12-06]

### Release Notes

This release builds off of the 1.1.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v111-2016-12-06) for more information about the OSS release.

This release is built with Go (golang) 1.7.4.
It resolves a security vulnerability reported in Go (golang) version 1.7.3 which impacts all
users currently running on the Mac OS X platform, powered by the Darwin operating system.

#### Cluster-specific Bugfixes

- Fix hinted-handoff issue: Fix record size larger than max size  
&emsp;If a Hinted Handoff write appended a block that was larger than the maximum file size, the queue would get stuck because       the maximum size was not updated. When reading the block back out during processing, the system would return an error         because the block size was larger than the file size -- which indicates a corrupted block.

## v1.1.0 [2016-11-14]

### Release Notes
This release builds off of the 1.1.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v110-2016-11-14) for more information about the OSS release.

### Upgrading

* The 1.1.0 release of OSS InfluxDB has some important [configuration changes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#configuration-changes) that may affect existing clusters.
* The `influxd-ctl join` command has been renamed to `influxd-ctl add-meta`.  If you have existing scripts that use `influxd-ctl join`, they will need to use `influxd-ctl add-meta` or be updated to use the new cluster setup command.

#### Cluster Setup

The `influxd-ctl join` command has been changed to simplify cluster setups.  To join a node to a cluster, you can run `influxd-ctl join <meta:8091>`, and we will attempt to detect and add any meta or data node process running on the hosts automatically.  The previous `join` command exists as `add-meta` now.  If it's the first node of a cluster, the meta address argument is optional.

#### Logging

Switches to journald logging for on systemd systems. Logs are no longer sent to `/var/log/influxdb` on systemd systems.

#### Cluster-specific Features

- Add a configuration option for setting gossiping frequency on data nodes
- Allow for detailed insight into the Hinted Handoff queue size by adding `queueBytes` to the hh\_processor statistics
- Add authentication to the meta service API
- Update Go (golang) dependencies: Fix Go Vet and update circle Go Vet command
- Simplify the process for joining nodes to a cluster
- Include the node's version number in the `influxd-ctl show` output
- Return and error if there are additional arguments after `influxd-ctl show`  
&emsp;Fixes any confusion between the correct command for showing detailed shard information (`influxd-ctl show-shards`) and the incorrect command (`influxd-ctl show shards`)

#### Cluster-specific Bugfixes

- Return an error if getting latest snapshot takes longer than 30 seconds
- Remove any expired shards from the `/show-shards` output
- Respect the [`pprof-enabled` configuration setting](/enterprise/v1.2/administration/configuration/#pprof-enabled-true) and enable it by default on meta nodes
- Respect the [`pprof-enabled` configuration setting](/enterprise/v1.2/administration/configuration/#pprof-enabled-true-1) on data nodes
- Use the data reference instead of `Clone()` during read-only operations for performance purposes
- Prevent the system from double-collecting cluster statistics
- Ensure that the meta API redirects to the cluster leader when it gets the `ErrNotLeader` error
- Don't overwrite cluster users with existing OSS InfluxDB users when migrating an OSS instance into a cluster
- Fix a data race in the raft store
- Allow large segment files (> 10MB) in the Hinted Handoff
- Prevent `copy-shard` from retrying if the `copy-shard` command was killed
- Prevent a hanging `influxd-ctl add-data` command by making data nodes check for meta nodes before they join a cluster

## v1.0.4 [2016-10-19]

#### Cluster-specific Bugfixes

- Respect the [Hinted Handoff settings](/enterprise/v1.2/administration/configuration/#hinted-handoff) in the configuration file
- Fix expanding regular expressions when all shards do not exist on node that's handling the request

## v1.0.3 [2016-10-07]

#### Cluster-specific Bugfixes

- Fix a panic in the Hinted Handoff: `lastModified`

## v1.0.2 [2016-10-06]
### Release Notes
This release builds off of the 1.0.2 release of OSS InfluxDB.  Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v102-2016-10-05) for more information about the OSS release.

#### Cluster-specific Bugfixes

- Prevent double read-lock in the meta client
- Fix a panic around a corrupt block in Hinted Handoff
- Fix  issue where `systemctl enable` would throw an error if the symlink already exists

## v1.0.1 [2016-09-28]
### Release Notes
This release builds off of the 1.0.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v101-2016-09-26)
for more information about the OSS release.

#### Cluster-specific Bugfixes

* Balance shards correctly with a restore
* Fix a panic in the Hinted Handoff: `runtime error: invalid memory address or nil pointer dereference`
* Ensure meta node redirects to leader when removing data node
* Fix a panic in the Hinted Handoff: `runtime error: makeslice: len out of range`
* Update the data node configuration file so that only the minimum configuration options are uncommented

## v1.0.0 [2016-09-07]
### Release Notes
This release builds off of the 1.0.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v100-2016-09-07) for more information about the OSS release.

Breaking Changes:

* The keywords `IF`, `EXISTS`, and `NOT` were removed for this release. This means you no longer need to specify `IF NOT EXISTS` for `DROP DATABASE` or `IF EXISTS` for `CREATE DATABASE`.  Using these keywords will return a query error.
* `max-series-per-database` was added with a default of 1M but can be disabled by setting it to `0`. Existing databases with series that exceed this limit will continue to load, but writes that would create new series will fail.

### Hinted Handoff

A number of changes to hinted handoff are included in this release:

* Truncating only the corrupt block in a corrupted segment to minimize data loss
* Immediately queue writes in hinted handoff if there are still writes pending to prevent inconsistencies in shards
* Remove hinted handoff queues when data nodes are removed to eliminate manual cleanup tasks

### Performance

* `SHOW MEASUREMENTS` and `SHOW TAG VALUES` have been optimized to work better for multiple nodes and shards
* `DROP` and `DELETE` statements run in parallel and more efficiently and should not leave the system in an inconsistent state

### Security

The Cluster API used by `influxd-ctl` can not be protected with SSL certs.

### Cluster Management

Data nodes that can no longer be restarted can now be forcefully removed from the cluster using `influxd-ctl remove-data -force <addr>`.  This should only be run if a grace removal is not possible.

Backup and restore has been updated to fix issues and refine existing capabilities.  

#### Cluster-specific Features

- Add the Users method to control client
- Add a `-force` option to the `influxd-ctl remove-data` command
- Disable the logging of `stats` service queries
- Optimize the `SHOW MEASUREMENTS` and `SHOW TAG VALUES` queries
- Update the Go (golang) package library dependencies
- Minimize the amount of data-loss in a corrupted Hinted Handoff file by truncating only the last corrupted segment instead of the entire file
- Log a write error when the Hinted Handoff queue is full for a node
- Remove Hinted Handoff queues on data nodes when the target data nodes are removed from the cluster
- Add unit testing around restore in the meta store
- Add full TLS support to the cluster API, including the use of self-signed certificates
- Improve backup/restore to allow for partial restores to a different cluster or to a database with a different database name
- Update the shard group creation logic to be balanced
- Keep raft log to a minimum to prevent replaying large raft logs on startup

#### Cluster-specific Bugfixes

- Remove bad connections from the meta executor connection pool
- Fix a panic in the meta store
- Fix a panic caused when a shard group is not found
- Fix a corrupted Hinted Handoff
- Ensure that any imported OSS admin users have all privileges in the cluster
- Ensure that `max-select-series` is respected
- Handle the `peer already known` error
- Fix Hinted handoff panic around segment size check
- Drop Hinted Handoff writes if they contain field type inconsistencies

<br>
<br>
# Web Console

## v1.2.2 [2017-03-15]

### Bug Fixes

* Set a sane default (`24h`) for the [`session-lifetime` configuration setting](/enterprise/v1.2/administration/configuration/#session-lifetime-24h)
* Fix node and shard reporting inaccurate information
* Fix the retention policy page dropdown when selecting databases

## v1.2.1 [2017-01-31]

As of version 1.2.1, the `Rebalance` button on the Web Consoles `Tasks` page
is deprecated and no longer available.
We based this decision on customer and support feedback regarding the feature.
For the time being, you will need to rebalance clusters manually.
The [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) guide offers
detailed instructions for performing a manual rebalance of your InfluxEnterprise cluster.
Please contact support with any questions or concerns you may have about this
development.

### Features

* Remove the `Tasks` page from the Web Console

### Bug Fixes

* Fix the [`autologout` configuration setting](/enterprise/v1.2/administration/configuration/#autologout-false)
* Fix the series and measurement counts on the `Database Manager` page

## v1.1.1 [2016-12-06]

This release is built with Go (golang) 1.7.4.
It resolves a security vulnerability reported in Go (golang) version 1.7.3 which impacts all
users currently running on the Mac OS X platform, powered by the Darwin operating system.

### Features

- Add the [`autologout` configuration setting](/enterprise/v1.2/administration/configuration/#autologout-false) to enable a forced logout on browser close

## v1.1.0 [2016-11-14]

### Features

- Add the [`session-lifetime` configuration setting](/enterprise/v1.2/administration/configuration/#session-lifetime-24h) to configure the time after which users are automatically logged out

## v1.0.3 [2016-10-07]

There are no new features or bugfixes in version 1.0.3.
This release is for maintaining version parity with clustering.

## v1.0.2 [2016-10-06]

### Bugfixes

- Fix systemd package upgrade symlink failure

## v1.0.1

### Features

* Log error messages from the InfluxEnterprise cluster

### Bugfixes

* Fix bug where users cannot log out of the Web Console

## v1.0.0

### Features

* **Rebalancing:** Rebalancing now ensures that all existing data adhere to the relevant [replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor). See [Web Console Features](/enterprise/v1.2/features/web-console-features/#cluster-rebalancing) for more information.
* **User updates:** In versions 0.7.2 and below, users were loosely synced between the cluster and web console. In version 1.0, users have web-console-specific functions and are given cluster-specific permissions by being associated with a separate cluster account. The document [InfluxEnterprise Users](/enterprise/v1.2/features/users/) describes the new user arrangement in more detail. Please note that this change requires additional steps if you are [upgrading](/enterprise/v1.2/administration/upgrading/) from a previous version of the web console.
