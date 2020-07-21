---
title: InfluxDB Enterprise 1.8 release notes

menu:
  enterprise_influxdb_1_8:
    name: Release notes
    weight: 10
    parent: About the project
---

## v1.8 [2020-04-27]

The InfluxDB Enterprise 1.8 release builds on the InfluxDB OSS 1.8 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1.8/about_the_project/releasenotes-changelog/).

### Features

#### **Back up meta data only**

- Add option to back up **meta data only** (users, roles, databases, continuous queries, and retention policies) using the new `-strategy` flag and `only meta` option: `influx ctl backup -strategy only meta </your-backup-directory>`.

    > **Note:** To restore a meta data backup, use the `restore -full` command and specify your backup manifest: `influxd-ctl restore -full </backup-directory/backup.manifest>`.

For more information, see [Perform a metastore only backup](/enterprise_influxdb/v1.8/administration/backup-and-restore/#perform-a-metastore-only-backup).

#### **Incremental and full backups**

- Add `incremental` and `full` backup options to the new `-strategy` flag in `influx ctl backup`:
  - `influx ctl backup -strategy incremental`
  - `influx ctl backup -strategy full`

For more information, see the [`influxd-ctl backup` syntax](/enterprise_influxdb/v1.8/administration/backup-and-restore/#syntax).

### Bug fixes

- Update the Anti-Entropy (AE) service to ignore expired shards.

## v1.7.10 [2020-02-07]

The InfluxDB Enterprise 1.7.10 release builds on the InfluxDB OSS 1.7.10 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Features
- Log when meta state file cannot be opened.

### Bugfixes
- Update `MaxShardGroupID` on meta update.
- Don't reassign shard ownership when removing a data node.

## v1.7.9 [2019-10-27]

The InfluxDB Enterprise 1.7.9 release builds on the InfluxDB OSS 1.7.9 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Release notes
- This release is built using Go 1.12.10 which eliminates the
  [HTTP desync vulnerability](https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn).

### Bug fixes
- Move `tsdb store open` to beginning of server initialization.
- Enable Meta client and Raft to use verified TLS.
- Fix RPC pool TLS configuration.
- Update example configuration file with new authorization options.

## 1.7.8 [2019-09-03]

{{% warn %}}
InfluxDB now rejects all non-UTF-8 characters.
To successfully write data to InfluxDB, use only UTF-8 characters in
database names, measurement names, tag sets, and field sets.
InfluxDB Enterprise customers can contact InfluxData support for more information.
{{% /warn %}}

The InfluxDB Enterprise 1.7.8 release builds on the InfluxDB OSS 1.7.8 release.
For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Bug fixes
- Clarified `influxd-ctl` error message when the Anti-Entropy (AE) service is disabled.
- Ensure invalid, non-UTF-8 data is removed from hinted handoff.
- Added error messages for `INFLUXDB_LOGGING_LEVEL` if misconfigured.
- Added logging when data nodes connect to meta service.

### Features
- The Flux Technical Preview has advanced to version [0.36.2](/flux/v0.36/).

## 1.7.7 [2019-07-12]

The InfluxDB Enterprise 1.7.7 release builds on the InfluxDB OSS 1.7.7 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Known issues

- The Flux Technical Preview was not advanced and remains at version 0.24.0. Next month's maintenance release will update the preview.
- After upgrading, customers have experienced an excessively large output additional lines due to a `Println` statement introduced in this release. For a possible workaround, see https://github.com/influxdata/influxdb/issues/14265#issuecomment-508875853.  Next month's maintenance release will address this issue.

### Features

- Adds TLS to RPC calls. If verifying certificates, uses the TLS setting in the configuration passed in with -config.

### Bug fixes

- Ensure retry-rate-limit configuration value is used for hinted handoff.
- Always forward AE repair to next node.
- Improve hinted handoff metrics.

## 1.7.6 [2019-05-07]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.6 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Bug fixes

- Reverts v1.7.5 InfluxQL regressions that removed parentheses and resulted in operator precedence causing changing results in complex queries and regular expressions.

## 1.7.5 [2019-03-26]

{{% warn %}}

**If you are currently on this release, roll back to v1.7.4 until a fix is available.**

After upgrading to this release, some customers have experienced regressions,
including parentheses being removed resulting in operator precedence causing changing results
in complex queries and regular expressions.

Examples:

- Complex WHERE clauses with parentheses. For example, `WHERE d > 100 AND (c = 'foo' OR v = 'bar'`).
- Conditions not including parentheses caysubg operator precedence to return `(a AND b) OR c` instead of `a AND (b OR c)`

{{% /warn %}}

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.5 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Features

- Add `influx_tools` utility (for internal support use) to be part of the packaging.

### Bug fixes

- Anti-Entropy: fix `contains no .tsm files` error.
- `fix(cluster)`: account for nil result set when writing read response.

## 1.7.4 [2019-02-13]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.4 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Bug fixes

- Use `systemd` for Amazon Linux 2.

## 1.7.3 [2019-01-11]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.3 release. For details on changes incorporated from the InfluxDB OSS release, see the [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Important update [2019-02-13]

If you have not installed this release, then install the 1.7.4 release.

**If you are currently running this release, then upgrade to the 1.7.4 release as soon as possible.**

- A critical defect in the InfluxDB 1.7.3 release was discovered and our engineering team fixed the issue in the 1.7.4 release. Out of high concern for your data and projects, upgrade to the 1.7.4 release as soon as possible.
  - **Critical defect:** Shards larger than 16GB are at high risk for data loss during full compaction. The full compaction process runs when a shard go "cold" – no new data is being written into the database during the time range specified by the shard.
  - **Post-mortem analysis:** InfluxData engineering is performing a post-mortem analysis to determine how this defect was introduced. Their discoveries will be shared in a blog post.

- A small percentage of customers experienced data node crashes with segmentation violation errors.  We fixed this issue in 1.7.4.

### Breaking changes
- Fix invalid UTF-8 bytes preventing shard opening. Treat fields and measurements as raw bytes.

### Features

#### Anti-entropy service disabled by default

Prior to v.1.7.3, the anti-entropy (AE) service was enabled by default. When shards create large digests with lots of time ranges (10s of thousands), some customers experienced significant performance issues, including CPU usage spikes. If your shards include a small number of time ranges (most have 1 to 10, some have up to several hundreds) and you can benefit from the AE service, then you can enable AE and watch to see if performance is significantly impacted.

- Add user authentication and authorization support for Flux HTTP requests.
- Add support for optionally logging Flux queries.
-	Add support for LDAP StartTLS.
-	Flux 0.7 support.
-	Implement TLS between data nodes.
-	Update to Flux 0.7.1.
-	Add optional TLS support to meta node Raft port.
-	Anti-Entropy: memoize `DistinctCount`, `min`, & `max` time.
-	Update influxdb dep for subquery auth update.

### Bug fixes

-	Update sample configuration.

## 1.6.6 [2019-02-28]
-------------------

This release only includes the InfluxDB OSS 1.6.6 changes (no Enterprise-specific changes).

## 1.6.5 [2019-01-10]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.5 releases. For details about changes incorporated from InfluxDB OSS releases, see [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

## 1.6.4 [2018-10-23]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.4 releases. For details about changes incorporated from InfluxDB OSS releases, see the [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Breaking changes

#### Require `internal-shared-secret` if meta auth enabled

If `[meta] auth-enabled` is set to `true`, the `[meta] internal-shared-secret` value must be set in the configuration.
If it is not set, an error will be logged and `influxd-meta` will not start.

* Previously, authentication could be enabled without setting an `internal-shared-secret`. The security risk was that an unset (empty) value could be used for the `internal-shared-secret`, seriously weakening the JWT authentication used for internode communication.

#### Review production installation configurations

The [Production Installation](/enterprise_influxdb/v1.7/production_installation/)
documentation has been updated to fix errors in configuration settings, including changing `shared-secret` to `internal-shared-secret` and adding missing steps for configuration settings of data nodes and meta nodes. All Enterprise users should review their current configurations to ensure that the configuration settings properly enable JWT authentication for internode communication.

The following summarizes the expected settings for proper configuration of JWT authentication for internode communication:

##### Data node configuration files (`influxdb.conf`)

**[http] section**

* `auth-enabled = true`
  - Enables authentication. Default value is false.

**[meta] section**

- `meta-auth-enabled = true`
  - Must match for meta nodes' `[meta] auth-enabled` settings.
- `meta-internal-shared-secret = "<long-pass-phrase>"`
  - Must be the same pass phrase on all meta nodes' `[meta] internal-shared-secret` settings.
  - Used by the internal API for JWT authentication. Default value is `""`.
  - A long pass phrase is recommended for stronger security.

##### Meta node configuration files (`meta-influxdb.conf`)

**[meta]** section

- `auth-enabled = true`
  - Enables authentication. Default value is `false` .
- `internal-shared-secret = "<long-pass-phrase>"`
  - Must same pass phrase on all data nodes' `[meta] meta-internal-shared-secret`
  settings.
  - Used by the internal API for JWT authentication. Default value is
`""`.
  - A long pass phrase is recommended for better security.

>**Note:** To provide encrypted internode communication, you must enable HTTPS. Although the JWT signature is encrypted, the the payload of a JWT token is encoded, but is not encrypted.

### Bug fixes

- Only map shards that are reported ready.
- Fix data race when shards are deleted and created concurrently.
- Reject `influxd-ctl update-data` from one existing host to another.
- Require `internal-shared-secret` if meta auth enabled.

## 1.6.2 [08-27-2018]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.2 releases. For details about changes incorporated from InfluxDB OSS releases, see the [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/).

### Features

- Update Go runtime to `1.10`.
- Provide configurable TLS security options.
- Add LDAP functionality for authorization and authentication.
- Anti-Entropy (AE): add ability to repair shards.
- Anti-Entropy (AE): improve swagger doc for `/status` endpoint.
- Include the query task status in the show queries output.

#### Bug fixes

- TSM files not closed when shard is deleted.
- Ensure shards are not queued to copy if a remote node is unavailable.
- Ensure the hinted handoff (hh) queue makes forward progress when segment errors occur.
- Add hinted handoff (hh) queue back pressure.

## 1.5.4 [2018-06-21]

This release builds off of the InfluxDB OSS 1.5.4 release. Please see the [InfluxDB OSS release notes](/influxdb/v1.5/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

## 1.5.3 [2018-05-25]

This release builds off of the InfluxDB OSS 1.5.3 release. Please see the [InfluxDB OSS release notes](/influxdb/v1.5/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

### Features

* Include the query task status in the show queries output.
* Add hh writeBlocked counter.

### Bug fixes

* Hinted-handoff: enforce max queue size per peer node.
* TSM files not closed when shard deleted.


## v1.5.2 [2018-04-12]

This release builds off of the InfluxDB OSS 1.5.2 release. Please see the [InfluxDB OSS release notes](/influxdb/v1.5/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

### Bug fixes

* Running backup snapshot with client's retryWithBackoff function.
* Ensure that conditions are encoded correctly even if the AST is not properly formed.

## v1.5.1 [2018-03-20]

This release builds off of the InfluxDB OSS 1.5.1 release. There are no Enterprise-specific changes.
Please see the [InfluxDB OSS release notes](/influxdb/v1.7/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

## v1.5.0 [2018-03-06]

> ***Note:*** This release builds off of the 1.5 release of InfluxDB OSS. Please see the [InfluxDB OSS release
> notes](https://docs.influxdata.com/influxdb/v1.5/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

For highlights of the InfluxDB 1.5 release, see [What's new in InfluxDB 1.5](/influxdb/v1.5/about_the_project/whats_new/).

### Breaking changes

The default logging format has been changed. See [Logging and tracing in InfluxDB](/influxdb/v1.6/administration/logs/) for details.

### Features

* Add `LastModified` fields to shard RPC calls.
* As of OSS 1.5 backup/restore interoperability is confirmed.
* Make InfluxDB Enterprise use OSS digests.
* Move digest to its own package.
* Implement distributed cardinality estimation.
* Add logging configuration to the configuration files.
* Add AE `/repair` endpoint and update Swagger doc.
* Update logging calls to take advantage of structured logging.
* Use actual URL when logging anonymous stats start.
* Fix auth failures on backup/restore.
* Add support for passive nodes
* Implement explain plan for remote nodes.
* Add message pack format for query responses.
* Teach show tag values to respect FGA
* Address deadlock in meta server on 1.3.6
* Add time support to `SHOW TAG VALUES`
* Add distributed `SHOW TAG KEYS` with time support

### Bug fixes

* Fix errors occurring when policy or shard keys are missing from the manifest when limited is set to true.
* Fix spurious `rpc error: i/o deadline exceeded` errors.
* Elide `stream closed` error from logs and handle `io.EOF` as remote iterator interrupt.
* Discard remote iterators that label their type as unknown.
* Do not queue partial write errors to hinted handoff.
* Segfault in `digest.merge`
* Meta Node CPU pegged on idle cluster.
* Data race on `(meta.UserInfo).acl)`
* Fix wildcard when one shard has no data for a measurement with partial replication.
* Add `X-Influxdb-Build` to http response headers so users can identify if a response is from an InfluxDB OSS or InfluxDB Enterprise service.
* Ensure that permissions cannot be set on non-existent databases.
* Switch back to using `cluster-tracing` config option to enable meta HTTP request logging.
* `influxd-ctl restore -newdb` can't restore data.
* Close connection for remote iterators after EOF to avoid writer hanging indefinitely.
* Data race reading `Len()` in connection pool.
* Use InfluxData fork of `yamux`. This update reduces overall memory usage when streaming large amounts of data.
* Fix group by marshaling in the IteratorOptions.
* Meta service data race.
* Read for the interrupt signal from the stream before creating the iterators.
* Show retention policies requires the `createdatabase` permission
* Handle UTF files with a byte order mark when reading the configuration files.
* Remove the pidfile after the server has exited.
* Resend authentication credentials on redirect.
* Updated yamux resolves race condition when SYN is successfully sent and a write timeout occurs.
* Fix no license message.

## v1.3.9 [2018-01-19]

### Upgrading -- for users of the TSI preview

If you have been using the TSI preview with 1.3.6 or earlier 1.3.x releases, you will need to follow the upgrade steps to continue using the TSI preview.  Unfortunately, these steps cannot be executed while the cluster is operating --
so it will require downtime.

### Bugfixes

* Elide `stream closed` error from logs and handle `io.EOF` as remote iterator interrupt.
* Fix spurious `rpc error: i/o deadline exceeded` errors
* Discard remote iterators that label their type as unknown.
* Do not queue `partial write` errors to hinted handoff.

## v1.3.8 [2017-12-04]

### Upgrading -- for users of the TSI preview

If you have been using the TSI preview with 1.3.6 or earlier 1.3.x releases, you will need to follow the upgrade steps to continue using the TSI preview.  Unfortunately, these steps cannot be executed while the cluster is operating -- so it will require downtime.

### Bugfixes

- Updated `yamux` resolves race condition when SYN is successfully sent and a write timeout occurs.
- Resend authentication credentials on redirect.
- Fix wildcard when one shard has no data for a measurement with partial replication.
- Fix spurious `rpc error: i/o deadline exceeded` errors.

## v1.3.7 [2017-10-26]

### Upgrading -- for users of the TSI preview

The 1.3.7 release resolves a defect that created duplicate tag values in TSI indexes See Issues
[#8995](https://github.com/influxdata/influxdb/pull/8995), and [#8998](https://github.com/influxdata/influxdb/pull/8998).
However, upgrading to 1.3.7 cause compactions to fail, see [Issue #9025](https://github.com/influxdata/influxdb/issues/9025).
We will provide a utility that will allow TSI indexes to be rebuilt,
resolving the corruption possible in releases prior to 1.3.7. If you are using the TSI preview,
**you should not upgrade to 1.3.7 until this utility is available**.
We will update this release note with operational steps once the utility is available.

#### Bugfixes

 - Read for the interrupt signal from the stream before creating the iterators.
 - Address Deadlock issue in meta server on 1.3.6
 - Fix logger panic associated with anti-entropy service and manually removed shards.

## v1.3.6 [2017-09-28]

### Bugfixes

- Fix "group by" marshaling in the IteratorOptions.
- Address meta service data race condition.
- Fix race condition when writing points to remote nodes.
- Use InfluxData fork of yamux. This update reduces overall memory usage when streaming large amounts of data.
  Contributed back to the yamux project via: https://github.com/hashicorp/yamux/pull/50
- Address data race reading Len() in connection pool.

## v1.3.5 [2017-08-29]

This release builds off of the 1.3.5 release of OSS InfluxDB.
Please see the OSS [release notes](/influxdb/v1.3/about_the_project/releasenotes-changelog/#v1-3-5-2017-08-29) for more information about the OSS releases.

## v1.3.4 [2017-08-23]

This release builds off of the 1.3.4 release of OSS InfluxDB. Please see the [OSS release notes](https://docs.influxdata.com/influxdb/v1.3/about_the_project/releasenotes-changelog/) for more information about the OSS releases.

### Bugfixes

- Close connection for remote iterators after EOF to avoid writer hanging indefinitely

## v1.3.3 [2017-08-10]

This release builds off of the 1.3.3 release of OSS InfluxDB. Please see the [OSS release notes](https://docs.influxdata.com/influxdb/v1.3/about_the_project/releasenotes-changelog/) for more information about the OSS releases.

### Bugfixes

- Connections are not closed when `CreateRemoteIterator` RPC returns no iterators, resolved memory leak

## v1.3.2 [2017-08-04]

### Bug fixes

- `influxd-ctl restore -newdb` unable to restore data.
- Improve performance of `SHOW TAG VALUES`.
- Show a subset of config settings in `SHOW DIAGNOSTICS`.
- Switch back to using cluster-tracing config option to enable meta HTTP request logging.
- Fix remove-data error.

## v1.3.1 [2017-07-20]

#### Bug fixes

- Show a subset of config settings in SHOW DIAGNOSTICS.
- Switch back to using cluster-tracing config option to enable meta HTTP request logging.
- Fix remove-data error.

## v1.3.0 [2017-06-21]

### Configuration Changes

#### `[cluster]` Section

* `max-remote-write-connections` is deprecated and can be removed.
* NEW: `pool-max-idle-streams` and `pool-max-idle-time` configure the RPC connection pool.
  See `config.sample.toml` for descriptions of these new options.

### Removals

The admin UI is removed and unusable in this release. The `[admin]` configuration section will be ignored.

#### Features

- Allow non-admin users to execute SHOW DATABASES
- Add default config path search for influxd-meta.
- Reduce cost of admin user check for clusters with large numbers of users.
- Store HH segments by node and shard
- Remove references to the admin console.
- Refactor RPC connection pool to multiplex multiple streams over single connection.
- Report RPC connection pool statistics.

#### Bug fixes

- Fix security escalation bug in subscription management.
- Certain permissions should not be allowed at the database context.
- Make the time in `influxd-ctl`'s `copy-shard-status` argument human readable.
- Fix `influxd-ctl remove-data -force`.
- Ensure replaced data node correctly joins meta cluster.
- Delay metadata restriction on restore.
- Writing points outside of retention policy does not return error
- Decrement internal database's replication factor when a node is removed.

## v1.2.5 [2017-05-16]

This release builds off of the 1.2.4 release of OSS InfluxDB.
Please see the OSS [release notes](/influxdb/v1.3/about_the_project/releasenotes-changelog/#v1-2-4-2017-05-08) for more information about the OSS releases.

#### Bug fixes

- Fix issue where the [`ALTER RETENTION POLICY` query](/influxdb/v1.3/query_language/database_management/#modify-retention-policies-with-alter-retention-policy) does not update the default retention policy.
- Hinted-handoff: remote write errors containing `partial write` are considered droppable.
- Fix the broken `influxd-ctl remove-data -force` command.
- Fix security escalation bug in subscription management.
- Prevent certain user permissions from having a database-specific scope.
- Reduce the cost of the admin user check for clusters with large numbers of users.
- Fix hinted-handoff remote write batching.

## v1.2.2 [2017-03-15]

This release builds off of the 1.2.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v121-2017-03-08) for more information about the OSS release.

### Configuration Changes

The following configuration changes may need to changed before [upgrading](/enterprise_influxdb/v1.3/administration/upgrading/) to 1.2.2 from prior versions.

#### shard-writer-timeout

We've removed the data node's `shard-writer-timeout` configuration option from the `[cluster]` section.
As of version 1.2.2, the system sets `shard-writer-timeout` internally.
The configuration option can be removed from the [data node configuration file](/enterprise_influxdb/v1.3/administration/configuration/#data-node-configuration).

#### retention-autocreate

In versions 1.2.0 and 1.2.1, the `retention-autocreate` setting appears in both the meta node and data node configuration files.
To disable retention policy auto-creation, users on version 1.2.0 and 1.2.1 must set `retention-autocreate` to `false` in both the meta node and data node configuration files.

In version 1.2.2, we’ve removed the `retention-autocreate` setting from the data node configuration file.
As of version 1.2.2, users may remove `retention-autocreate` from the data node configuration file.
To disable retention policy auto-creation, set `retention-autocreate` to `false` in the meta node configuration file only.

This change only affects users who have disabled the `retention-autocreate` option and have installed version 1.2.0 or 1.2.1.

#### Bug fixes

##### Backup and Restore
<br>

- Prevent the `shard not found` error by making [backups](/enterprise_influxdb/v1.3/guides/backup-and-restore/#backup) skip empty shards
- Prevent the `shard not found` error by making [restore](/enterprise_influxdb/v1.3/guides/backup-and-restore/#restore) handle empty shards
- Ensure that restores from an incremental backup correctly handle file paths
- Allow incremental backups with restrictions (for example, they use the `-db` or `rp` flags) to be stores in the same directory
- Support restores on meta nodes that are not the raft leader

##### Hinted handoff
<br>

- Fix issue where dropped writes were not recorded when the [hinted handoff](/enterprise_influxdb/v1.3/concepts/clustering/#hinted-handoff) queue reached the maximum size
- Prevent the hinted handoff from becoming blocked if it encounters field type errors

##### Other
<br>

- Return partial results for the [`SHOW TAG VALUES` query](/influxdb/v1.3/query_language/schema_exploration/#show-tag-values) even if the cluster includes an unreachable data node
- Return partial results for the [`SHOW MEASUREMENTS` query](/influxdb/v1.3/query_language/schema_exploration/#show-measurements) even if the cluster includes an unreachable data node
- Prevent a panic when the system files to process points
- Ensure that cluster hostnames can be case insensitive
- Update the `retryCAS` code to wait for a newer snapshot before retrying
- Serialize access to the meta client and meta store to prevent raft log buildup
- Remove sysvinit package dependency for RPM packages
- Make the default retention policy creation an atomic process instead of a two-step process
- Prevent `influxd-ctl`'s [`join` argument](/enterprise_influxdb/v1.3/features/cluster-commands/#join) from completing a join when the command also specifies the help flag (`-h`)
- Fix the `influxd-ctl`'s [force removal](/enterprise_influxdb/v1.3/features/cluster-commands/#remove-meta) of meta nodes
- Update the meta node and data node sample configuration files

## v1.2.1 [2017-01-25]

#### Cluster-specific Bugfixes

- Fix panic: Slice bounds out of range
&emsp;Fix how the system removes expired shards.
- Remove misplaced newlines from cluster logs

## v1.2.0 [2017-01-24]

This release builds off of the 1.2.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v120-2017-01-24) for more information about the OSS release.

### Upgrading

* The `retention-autocreate` configuration option has moved from the meta node configuration file to the [data node configuration file](/enterprise_influxdb/v1.3/administration/configuration/#retention-autocreate-true).
To disable the auto-creation of retention policies, set `retention-autocreate` to `false` in your data node configuration files.
* The previously deprecated `influxd-ctl force-leave` command has been removed. The replacement command to remove a meta node which is never coming back online is [`influxd-ctl remove-meta -force`](/enterprise_influxdb/v1.3/features/cluster-commands/).

#### Cluster-specific Features

- Improve the meta store: any meta store changes are done via a compare and swap
- Add support for [incremental backups](/enterprise_influxdb/v1.3/guides/backup-and-restore/)
- Automatically remove any deleted shard groups from the data store
- Uncomment the section headers in the default [configuration file](/enterprise_influxdb/v1.3/administration/configuration/)
- Add InfluxQL support for [subqueries](/influxdb/v1.3/query_language/data_exploration/#subqueries)

#### Cluster-specific Bugfixes

- Update dependencies with Godeps
- Fix a data race in meta client
- Ensure that the system removes the relevant [user permissions and roles](/enterprise_influxdb/v1.3/features/users/) when a database is dropped
- Fix a couple typos in demo [configuration file](/enterprise_influxdb/v1.3/administration/configuration/)
- Make optional the version protobuf field for the meta store
- Remove the override of GOMAXPROCS
- Remove an unused configuration option (`dir`) from the backend
- Fix a panic around processing remote writes
- Return an error if a remote write has a field conflict
- Drop points in the hinted handoff that (1) have field conflict errors (2) have [`max-values-per-tag`](/influxdb/v1.3/administration/config/#max-values-per-tag-100000) errors
- Remove the deprecated `influxd-ctl force-leave` command
- Fix issue where CQs would stop running if the first meta node in the cluster stops
- Fix logging in the meta httpd handler service
- Fix issue where subscriptions send duplicate data for [Continuous Query](/influxdb/v1.3/query_language/continuous_queries/) results
- Fix the output for `influxd-ctl show-shards`
- Send the correct RPC response for `ExecuteStatementRequestMessage`

## v1.1.5 [2017-04-28]

### Bug fixes

- Prevent certain user permissions from having a database-specific scope.
- Fix security escalation bug in subscription management.

## v1.1.3 [2017-02-27]

This release incorporates the changes in the 1.1.4 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.4/CHANGELOG.md) for more information about the OSS release.

### Bug fixes

- Delay when a node listens for network connections until after all requisite services are running. This prevents queries to the cluster from failing unnecessarily.
- Allow users to set the `GOMAXPROCS` environment variable.

## v1.1.2 [internal]

This release was an internal release only.
It incorporates the changes in the 1.1.3 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.3/CHANGELOG.md) for more information about the OSS release.

## v1.1.1 [2016-12-06]

This release builds off of the 1.1.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v111-2016-12-06) for more information about the OSS release.

This release is built with Go (golang) 1.7.4.
It resolves a security vulnerability reported in Go (golang) version 1.7.3 which impacts all
users currently running on the macOS platform, powered by the Darwin operating system.

#### Cluster-specific bug fixes

- Fix hinted-handoff issue: Fix record size larger than max size
&emsp;If a Hinted Handoff write appended a block that was larger than the maximum file size, the queue would get stuck because       the maximum size was not updated. When reading the block back out during processing, the system would return an error         because the block size was larger than the file size -- which indicates a corrupted block.

## v1.1.0 [2016-11-14]

This release builds off of the 1.1.0 release of InfluxDB OSS.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v110-2016-11-14) for more information about the OSS release.

### Upgrading

* The 1.1.0 release of OSS InfluxDB has some important [configuration changes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#configuration-changes) that may affect existing clusters.
* The `influxd-ctl join` command has been renamed to `influxd-ctl add-meta`.  If you have existing scripts that use `influxd-ctl join`, they will need to use `influxd-ctl add-meta` or be updated to use the new cluster setup command.

#### Cluster setup

The `influxd-ctl join` command has been changed to simplify cluster setups.  To join a node to a cluster, you can run `influxd-ctl join <meta:8091>`, and we will attempt to detect and add any meta or data node process running on the hosts automatically.  The previous `join` command exists as `add-meta` now.  If it's the first node of a cluster, the meta address argument is optional.

#### Logging

Switches to journald logging for on systemd systems. Logs are no longer sent to `/var/log/influxdb` on systemd systems.

#### Cluster-specific features

- Add a configuration option for setting gossiping frequency on data nodes
- Allow for detailed insight into the Hinted Handoff queue size by adding `queueBytes` to the hh\_processor statistics
- Add authentication to the meta service API
- Update Go (golang) dependencies: Fix Go Vet and update circle Go Vet command
- Simplify the process for joining nodes to a cluster
- Include the node's version number in the `influxd-ctl show` output
- Return and error if there are additional arguments after `influxd-ctl show`
&emsp;Fixes any confusion between the correct command for showing detailed shard information (`influxd-ctl show-shards`) and the incorrect command (`influxd-ctl show shards`)

#### Cluster-specific bug fixes

- Return an error if getting latest snapshot takes longer than 30 seconds
- Remove any expired shards from the `/show-shards` output
- Respect the [`pprof-enabled` configuration setting](/enterprise_influxdb/v1.3/administration/configuration/#pprof-enabled-true) and enable it by default on meta nodes
- Respect the [`pprof-enabled` configuration setting](/enterprise_influxdb/v1.3/administration/configuration/#pprof-enabled-true-1) on data nodes
- Use the data reference instead of `Clone()` during read-only operations for performance purposes
- Prevent the system from double-collecting cluster statistics
- Ensure that the Meta API redirects to the cluster leader when it gets the `ErrNotLeader` error
- Don't overwrite cluster users with existing OSS InfluxDB users when migrating an OSS instance into a cluster
- Fix a data race in the raft store
- Allow large segment files (> 10MB) in the Hinted Handoff
- Prevent `copy-shard` from retrying if the `copy-shard` command was killed
- Prevent a hanging `influxd-ctl add-data` command by making data nodes check for meta nodes before they join a cluster

## v1.0.4 [2016-10-19]

#### Cluster-specific bug fixes

- Respect the [Hinted Handoff settings](/enterprise_influxdb/v1.3/administration/configuration/#hinted-handoff) in the configuration file
- Fix expanding regular expressions when all shards do not exist on node that's handling the request

## v1.0.3 [2016-10-07]

#### Cluster-specific bug fixes

- Fix a panic in the Hinted Handoff: `lastModified`

## v1.0.2 [2016-10-06]

This release builds off of the 1.0.2 release of OSS InfluxDB.  Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v102-2016-10-05) for more information about the OSS release.

#### Cluster-specific bug fixes

- Prevent double read-lock in the meta client
- Fix a panic around a corrupt block in Hinted Handoff
- Fix  issue where `systemctl enable` would throw an error if the symlink already exists

## v1.0.1 [2016-09-28]

This release builds off of the 1.0.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v101-2016-09-26)
for more information about the OSS release.

#### Cluster-specific bug fixes

* Balance shards correctly with a restore
* Fix a panic in the Hinted Handoff: `runtime error: invalid memory address or nil pointer dereference`
* Ensure meta node redirects to leader when removing data node
* Fix a panic in the Hinted Handoff: `runtime error: makeslice: len out of range`
* Update the data node configuration file so that only the minimum configuration options are uncommented

## v1.0.0 [2016-09-07]

This release builds off of the 1.0.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v100-2016-09-07) for more information about the OSS release.

Breaking Changes:

* The keywords `IF`, `EXISTS`, and `NOT` were removed for this release. This means you no longer need to specify `IF NOT EXISTS` for `DROP DATABASE` or `IF EXISTS` for `CREATE DATABASE`.  Using these keywords will return a query error.
* `max-series-per-database` was added with a default of 1M but can be disabled by setting it to `0`. Existing databases with series that exceed this limit will continue to load, but writes that would create new series will fail.

### Hinted handoff

A number of changes to hinted handoff are included in this release:

* Truncating only the corrupt block in a corrupted segment to minimize data loss
* Immediately queue writes in hinted handoff if there are still writes pending to prevent inconsistencies in shards
* Remove hinted handoff queues when data nodes are removed to eliminate manual cleanup tasks

### Performance

* `SHOW MEASUREMENTS` and `SHOW TAG VALUES` have been optimized to work better for multiple nodes and shards
* `DROP` and `DELETE` statements run in parallel and more efficiently and should not leave the system in an inconsistent state

### Security

The Cluster API used by `influxd-ctl` can not be protected with SSL certs.

### Cluster management

Data nodes that can no longer be restarted can now be forcefully removed from the cluster using `influxd-ctl remove-data -force <addr>`.  This should only be run if a grace removal is not possible.

Backup and restore has been updated to fix issues and refine existing capabilities.

#### Cluster-specific features

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

#### Cluster-specific bug fixes

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
# Web Console

## DEPRECATED: Enterprise Web Console

The Enterprise Web Console has officially been deprecated and will be eliminated entirely by the end of 2017.
No additional features will be added and no additional bug fix releases are planned.

For browser-based access to InfluxDB Enterprise, [Chronograf](/chronograf/latest/introduction) is now the recommended tool to use.
