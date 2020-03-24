---
title: InfluxDB 1.7 release notes
menu:
  influxdb_1_7:
    name: Release notes
    weight: 10
    parent: About the project
---

## v1.7.10 [2020-02-07]

### Bug fixes
- Fix failing corrupt data file renaming process.
- Make shard digests safe for concurrent use.
- Fix defect in TSI index where negative equality filters (`!=`) could result in no matching series.
- Fix compaction logic on infrequent cache snapshots which resulted in frequent full
  compactions rather than [level compactions](/influxdb/v1.7/concepts/storage_engine/#compactions).
- Fix for series key block data being truncated when read into an empty buffer.
  Ensure all block data is returned.
- During compactions, skip TSM files with block read errors from previous compactions.

## v1.7.9 [2019-10-27]

### Release notes
- This release is built using Go 1.12.10 which eliminates the
  [HTTP desync vulnerability](https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn).

### Bug fixes
- Guard against compaction burst throughput limit.
- Replace TSI compaction wait group with counter.
- Update InfluxQL dependency.
- Add option to authenticate debug/pprof and ping endpoints.
- Honor `insecure-skip-verify` even if custom TLS config is specified.

### Features
- Update Go version to 1.12.10.
- Remove Godeps file.
- Update Flux version to v0.50.2.

## v1.7.8 [2019-08-20]

{{% warn %}}
InfluxDB now rejects all non-UTF-8 characters.
To successfully write data to InfluxDB, use only UTF-8 characters in
database names, measurement names, tag sets, and field sets.
{{% /warn %}}

### Bug fixes
- Fix Prometheus read panic.
- Remove stray `fmt.Println` in `tsm1.StringArrayEncodeAll`.
- Fix issue where fields re-appear after `DROP MEASUREMENT`.
- Remove a dubugging `println` call.
- Subquery ordering with aggregates in descending mode was wrong.
- Fix the http handler to not mislabel series as partial.
- Make `SHOW SERIES EXACT CARDINALITY` count only distinct series.
- Fix time range exceeding min/max bounds.

### Features
- Update Flux version to v0.36.2

## 1.7.7 [2019-06-26]

### Known issues

- The Flux Technical Preview was not advanced and remains at version 0.24.0. Next month's maintenance release will update the preview.
- After upgrading, customers have experienced an excessively large output additional lines due to a `Println` statement introduced in this release. For a possible workaround, see https://github.com/influxdata/influxdb/issues/14265#issuecomment-508875853. Next month's maintenance release will address this.

### Bug fixes

- Fix the sort order for aggregates so that they are sorted by tag and then time.
- Use the timezone when evaluating time literals in subqueries.
- Fix CSV decoder bug where empty tag values cause an array index panic.
- Fix open/close race in `SeriesFile`.
- Sync series segment after truncate.
- Fix the ordering for selectors within a subquery with different outer tags.

## 1.7.6 [2019-04-16]

{{% warn %}}
If your InfluxDB OSS server is using the default in-memory index (`[data].index-version = "inmem"`),
this release includes the fix for InfluxDB 1.7.5 servers that stopped responding without warning.
{{% /warn %}}

### Features

- Upgrade Flux to `0.24.0` and remove the platform dependency.
  - If Flux is enabled, use Chronograf 1.7.11 or later.
  - When using Flux, there is a known issue that using `now` will cause a panic.  The proper syntax is `now()`.
- Track remote read requests to Prometheus remote read handler.

### Bug fixes

- Ensure credentials are correctly passed when executing Flux HTTP requests in the `influx` CLI with the `-type=flux` option.
- Back port of data generation improvements: renamed files for consistency between versions, added `time-interval` schema option, and updated schema example documentation.
- Fix security vulnerability when `[http]shared-secret` configuration setting is blank.
- Add nil check for `tagKeyValueEntry.setIDs()`.
- Extend the Prometheus remote write endpoint to drop unsupported Prometheus values (`NaN`,`-Inf`, and `+Inf`) rather than reject the entire batch.
  - If write trace logging enabled (`[http] write-tracing = true`), then summaries of dropped values are logged.
  - If a batch of values contains values that are subsequently dropped, HTTP status code `204` is returned.
- Update predicate key mapping to match InfluxDB `2.x` behavior.
- Fix panic in Prometheus read API.
- Add a version constraint for influxql.

## 1.7.5 [2019-03-26]

{{% warn %}}
**Update (2019-04-01):** If your InfluxDB OSS server is using the default in-memory index (`[data].index-version = "inmem"`), then do not upgrade to this release. Customers have reported that InfluxDB 1.7.5 stops responding without warning. For details, see [GitHub issue #13010](https://github.com/influxdata/influxdb/issues/13010). The [planned fix](https://github.com/influxdata/influxdb/issues/13053) will be available soon.
{{% /warn %}}

### Bug fixes

- Update `tagKeyValue` mutex to write lock.
- Fix some more shard epoch races.

## 1.7.4 [2019-02-13]

### Features

- Allow TSI bitset cache to be configured. See: [InfluxDB Configuration `[data]`](/influxdb/v1.7/administration/config/#tsi-tsi1-index-settings)

### Bug fixes

- Remove copy-on-write when caching bitmaps in TSI.
- Use `systemd` for Amazon Linux 2.
- Revert "Limit force-full and cold compaction size."
- Convert `TagValueSeriesIDCache` to use string fields.
- Ensure that cached series id sets are Go heap backed.

## 1.7.3 [2019-01-11]

### Important update [2019-02-13]

If you have not installed this release, then install the 1.7.4 release.

**If you are currently running this release, then upgrade to the 1.7.4 release as soon as possible.**

- A critical defect in the InfluxDB 1.7.3 release was discovered and our engineering team fixed the issue in the 1.7.4 release. Out of high concern for your data and projects, upgrade to the 1.7.4 release as soon as possible.
  - **Critical defect:** Shards larger than 16GB are at high risk for data loss during full compaction. The full compaction process runs when a shard go "cold" – no new data is being written into the database during the time range specified by the shard.
  - **Post-mortem analysis:** InfluxData engineering is performing a post-mortem analysis to determine how this defect was introduced. Their discoveries will be shared in a blog post.

### Breaking changes

- Fix invalid UTF-8 bytes preventing shard opening. Treat fields and measurements as raw bytes.

### Features

- Update Flux to `0.12.0`

### Bug fixes

* Limit force-full and cold compaction size.
* Add user authentication and authorization support for Flux HTTP requests.
* Call `storage.Group` API to correctly map group mode.
* Marked functions that always return floats as always returning floats.
* Add support for optionally logging Flux queries.
* Fix cardinality estimation error.

## 1.7.2 [2018-12-11]

### Bug fixes

* Update to Flux 0.7.1.
* Conflict-based concurrency resolution adds guards and an epoch-based system to
   coordinate modifications when deletes happen against writes to the same points
   at the same time.
* Skip and warn that series file should not be in a retention policy directory.
* Checks if measurement was removed from index, and if it was, then cleans up out
  of fields index. Also fix cleanup issue where only prefix was checked when
  matching measurements like "m1" and "m10".
* Error message to user that databases must be run in non-mixed index mode
 to allow deletes.
* Update platform dependency to simplify Flux support in Enterprise.
* Verify series file in presence of tombstones.
* Fix `ApplyEnvOverrides` when a type that implements Unmarshaler is in a slice to
  not call `UnMarshaltext` when the environment variable is set to empty.
* Drop NaN values when writing back points and fix the point writer to report the
  number of points actually written and omits the ones that were dropped.
* Query authorizer was not properly passed to subqueries so rejections did not
  happen when a subquery was the one reading the value. Max series limit was not propagated downward.

## 1.7.1 [2018-11-14]

### Bug fixes

* Simple8B `EncodeAll` incorrectly encodes entries: For a run of `1s`, if the 120th or 240th entry is not a `1`, the run will be incorrectly encoded as selector `0` (`240 1s`) or selector `1` (`120 1s`), resulting in a loss of data for the 120th or 240th value. Manifests itself as consuming significant CPU resources and as compactions running indefinitely.

## 1.7.0 [2018-11-06]

### Breaking changes

Chunked query was added into the Go client v2 interface. If you compiled against the Go client v2 previously, you need to recompile using the updated interface.

### Features

#### Flux v0.7 technical preview

Support for the Flux language and queries has been added in this release. To begin exploring Flux 0.7 (technical preview):

* Enable Flux using the new configuration setting [`[http] flux-enabled = true`](/influxdb/v1.7/administration/config/#flux-enabled-false).
* Use the new [`influx -type=flux`](/influxdb/v1.7/tools/shell/#type) option to enable the Flux REPL shell for creating Flux queries.
* Read about Flux and the Flux language, enabling Flux, or jump into the getting started and other guides in the [Flux v0.7 (technical preview) documentation](/flux/v0.7/).

#### Time Series Index (TSI) query performance and throughputs improvements

* Faster index planning for queries against indexes with many series that share tag pairs.
* Reduced index planning for queries that include previously queried tag pairs — the TSI
  index now caches partial index results for later reuse.
* Performance improvements required a change in on-disk TSI format to be used.
* **To take advantage of these improvements**:
  * Rebuild your indexes or wait for a TSI compaction of your indexes,
    at which point the new TSI format will be applied.
  * Hot shards and new shards immediately use the new TSI format.

#### Other features

* Enable the storage service by default.
* Ensure read service regular expressions get optimized.
* Add chunked query into the Go client v2.
* Add `access-log-status-filters` config setting to create an access log filter.
* Compaction performance improvements for Time Series Index (TSI).
* Add roaring bitmaps to TSI index files.


### Bug fixes

*	Missing `hardwareAddr` in `uuid` v1 generation.
*	Fix the inherited interval for derivative and others.
*	Fix subquery functionality when a function references a tag from the subquery.
*	Strip tags from a subquery when the outer query does not group by that tag.

## 1.6.6 [2019-02-28]

### Bug fixes

* Marked functions that always return floats as always returning floats.
* Fix cardinality estimation error.
* Update `tagKeyValue` mutex to write lock.

## 1.6.5 [2019-01-10]

### Features

*	Reduce allocations in TSI `TagSets` implementation.

### Bug fixes

*	Fix panic in `IndexSet`.
*	Pass the query authorizer to subqueries.
*	Fix TSM1 panic on reader error.
* Limit database and retention policy names to 255 characters.
* Update Go runtime to 1.10.6.

## 1.6.4 [2018-10-16]

### Features

*	Set maximum cache size using `-max-cache-size` in `buildtsi` when building TSI index.

### Bug fixes

*	Fix `tsi1` sketch locking.
*	Fix subquery functionality when a function references a tag from the subquery.
*	Strip tags from a subquery when the outer query does not group by that tag.
*	Add `-series-file` flag to `dumptsi` command help.
*	Cleanup failed TSM snapshots.
*	Fix TSM1 panic on reader error.
*	Fix series file tombstoning.
*	Fixing the stream iterator to not ignore the error.
*	Do not panic when a series ID iterator is nil.
*	Fix append of possible nil iterator.

## 1.6.3 [2018-09-14]

### Features

*	Remove TSI1 HLL sketches from heap.

### Bug fixes

*	Fix the inherited interval for derivative and others.  The inherited interval from an outer query should not have caused
an inner query to fail because inherited intervals are only implicitly passed to inner queries that support group
by time functionality. Since an inner query with a derivative doesn't support grouping by time and the inner query itself
doesn't specify a time, the outer query shouldn't have invalidated the inner query.
*	Fix the derivative and others time ranges for aggregate data. The derivative function and others similar to it would
preload themselves with data so that the first interval would be the start of the time range. That meant reading data outside
of the time range. One change to the shard mapper made in v1.4.0 caused the shard mapper to constrict queries to the
intervals given to the shard mapper. This was correct because the shard mapper can only deal with times it has mapped,
but this broke the functionality of looking back into the past for the derivative and other functions that used that
functionality. The query compiler has been updated with an additional attribute that records how many intervals in the past
will need to be read so that the shard mapper can include extra times that it may not necessarily read from,
but may be queried because of the above described functionality.

## 1.6.2 [2018-08-27]

### Features

*	Reduce allocations in TSI TagSets implementation.

### Bug fixes

*	Ensure orphaned series cleaned up with shard drop.

## 1.6.1 [2018-08-03]

### Features

*	Improve LogFile performance with bitset iterator.
*	Add TSI index cardinality report to `influx_inspect`.
*	Update to Go 1.10.
*	Improve performance of `buildtsi` and TSI planning.
*	Improve performance of read service for single measurements.
*	Remove max concurrent compaction limit.
*	Provide configurable TLS options.
*	Add option to hint MADV_WILLNEED to kernel.

### Bug fixes

*	Improve series segment recovery.
*	Fix windows mmap on zero length file.
*	Ensure Filter iterators executed as late as possible.
*	Document UDP precision setting in config.
*	Allow tag keys to contain underscores.
*	Fix a panic when matching on a specific type of regular expression.

## 1.6.0 [2018-07-05]

### Breaking changes

*	If math is used with the same selector multiple times, it will now act as a selector
rather than an aggregate. See [#9563](https://github.com/influxdata/influxdb/pull/9563) for details.
* For data received from Prometheus endpoints, every Prometheus measurement is now
stored in its own InfluxDB measurement rather than storing everything in the `_` measurement
using the Prometheus measurement name as the `__name__` label.

### Features

*	Support proxy environment variables in the `influx` client.
*	Implement basic trigonometry functions.
*	Add ability to delete many series with predicate.
*	Implement `floor`, `ceil`, and `round` functions.
*   Add more math functions to InfluxQL.
*	Allow customizing the unix socket group and permissions created by the server.
*	Add `suppress-write-log` option to disable the write log when the log is enabled.
*	Add additional technical analysis algorithms.
*	Validate points on input.
*	Log information about index version during startup.
*	Add key sanitization to `deletetsm` command in `influx_inspect` utility.
*	Optimize the `spread` function to process points iteratively instead of in batch.
*	Allow math functions to be used in the condition.
*	Add HTTP write throttle settings: `max-concurrent-write-limit`, `max-enqueued-write-limit`, and `enqueued-write-timeout`.
*	Implement `SHOW STATS FOR indexes`.
*	Add `dumptsmwal` command to `influx_inspect` utility.
*	Improve the number of regex patterns that are optimized to static OR conditions.

### Bug fixes

* Support setting the log level through the environment variable.
* Fix panic when checking fieldsets.
* Ensure correct number of tags parsed when commas used.
* Fix data race in WAL.
* Allow `SHOW SERIES` kill.
* Revert "Use MADV_WILLNEED when loading TSM files".
* Fix regression to allow now() to be used as the group by offset again.
* Delete deleted shards in retention service.
* Ignore index size in `Engine.DiskSize()`.
* Enable casting values from a subquery.
* Avoid a panic when using show diagnostics with text/csv.
* Properly track the response bytes written for queries in all format types.
* Remove error for series file when no shards exist.
* Fix the validation for multiple nested distinct calls.
* TSM: `TSMReader.Close` blocks until reads complete.
* Return the correct auxiliary values for `top` and `bottom`.
* Close TSMReaders from `FileStore.Close` after releasing FileStore mutex.

## 1.5.5 [2018-12-19]

### Features

*	Reduce allocations in TSI `TagSets` implementation.

### Bug fixes

*	Copy return value of `IndexSet.MeasurementNamesByExpr`.
*	Ensure orphaned series cleaned up with shard drop.
*	Fix the derivative and others time ranges for aggregate data.
*	Fix the stream iterator to not ignore errors.
*	Do not panic when a series ID iterator is `nil`.
*	Fix panic in `IndexSet`.
*	Pass the query authorizer to subqueries.
*	Fix TSM1 panic on reader error.

## 1.5.4 [2018-06-21]

### Features

* Add `influx_inspect deletetsm` command for bulk deletes of measurements in raw TSM files.

### Bug fixes

* Fix panic in readTombstoneV4.
* buildtsi: Do not escape measurement names.

## 1.5.3 [2018-05-25]

### Features

* Add `[http] debug-pprof-enabled` configuration setting immediately on startup. Useful for debugging startup performance issues.

### Bug fixes

* Fix the validation for multiple nested `DISTINCT` calls.
* Return the correct auxiliary values for `TOP` and `BOTTOM`.

## 1.5.2 [2018-04-12]

### Features

* Check for root user when running `buildtsi`.
* Adjustable TSI Compaction Threshold.

### Bug fixes

* backport: check for failure case where backup directory has no manifest files.
* Fix regression to allow `now()` to be used as the group by offset again.
* Revert `Use MADV_WILLNEED when loading TSM files`.
* Ignore index size in `Engine.DiskSize()`.
* Fix `buildtsi` partition key.
* Ensure that conditions are encoded correctly even if the AST is not properly formed.

## 1.5.1 [2018-03-20]

### Bug fixes

-	Allow time variable to be case insensitive again.
-	Support setting the log level through the environment variable.
-	Ensure correct number of tags parsed.
-	Fix panic when checking fieldsets.
-	Fix data race in WAL.

## 1.5.0 [2018-03-06]

### Breaking changes

The default logging format has been changed. See [Logging and tracing in InfluxDB](/influxdb/v1.7/administration/logs) for details.

### Features

- Improve CLI connection warnings.
- Backup utility prints a list of backup files.
- Backup and restore for OSS produces and consumes data in the Enterprise-compatible backup format.
- Restore runs in online mode and does not delete existing databases.
- Export functionality using `start` and `end` to filter exported data by `timestamp`.
- Handle high cardinality deletes in TSM engine.
- Improve in-memory index startup performance for high cardinality.
- Add further TSI support for streaming and copying shards.
- Schedule a full compaction after a successful import.
- Add Prometheus `/metrics` endpoint.
- Add ability to generate shard digests.
- Allow setting the node ID in the InfluxDB CLI program.

### Bug fixes

- Refuse extra arguments to influx CLI.
- Fix space required after regex operator. Thanks @stop-start!
- Fix `panic: sync: WaitGroup is reused before previous Wait has returned`.
- Fix race condition in the merge iterator close method.
- Fix query compilation so multiple nested distinct calls is allowable
- Fix CLI to allow quoted database names in use statement.
- Updated client `4xx` error message when response body length is zero.
- Remove extraneous newlines from the log.
- Allow lone Boolean literals in a condition expression.
- Improve performance when writes exceed `max-values-per-tag` or `max-series`.
- Prevent a panic when a query simultaneously finishes and is killed at the same time.
- Fix missing sorting of blocks by time when compacting.
- WAL: update `lastWriteTime` behavior

## 1.4.3 [unreleased]

### Configuration Changes

#### `[data]` Section

`cache-snapshot-memory-size`: default value changed from `25m` to `256m`.

### Bug fixes

- Fix higher disk I/O utilization

## 1.4.2 [2017-11-15]

Refer to the 1.4.0 breaking changes section if `influxd` fails to start with an `incompatible tsi1 index MANIFEST` error.

### Bug fixes

- Fix `panic: runtime error: slice bounds out of range` when running `dep init`

## 1.4.1 [2017-11-13]

### Bug fixes

- Fix descending cursors and range queries via IFQL RPC API.

## 1.4.0 [2017-11-13]

### TSI Index
This feature remains experimental in this release.
However, a number of improvements have been made and new meta query changes will allow for this feature to be explored at more depth than previously possible.  It is not recommended for production use at this time.
We appreciate all of the feedback we receive on this feature.  Please keep it coming!

### Breaking changes

You can no longer specify a different `ORDER BY` clause in a subquery than the one in the top level query.
This functionality never worked properly,
but was not explicitly forbidden.

As part of the ongoing development of the `tsi1` index,
the implementation of a Bloom Filter,
used to efficiently determine if series are not present in the index,
was altered.
While this significantly increases the performance of the index and reduces its memory consumption,
the existing `tsi1` indexes created while running previous versions of the database are not compatible with 1.4.0.

Users with databases using the `tsi1` index must go through the following process to upgrade to 1.4.0:

1. Stop `influxd`.
2. Remove all `index` directories on databases using the `tsi1` index. With default configuration these can be found in
   `/var/lib/influxdb/data/DB_NAME/RP_NAME/SHARD_ID/index` or `~/.influxdb/data/DB_NAME/RP_NAME/SHARD_ID/index`.
   It's worth noting at this point how many different `shard_ids` you visit.
3. Run the `influx_inspect inmem2tsi` tool using the shard's data and WAL directories for `-datadir` and `-waldir`, respectively.
   Given the example in step (2) that would be
   `influx_inspect inmem2tsi -datadir /var/lib/influxdb/data/DB_NAME/RP_NAME/SHARD_ID -waldir /path/to/influxdb/wal/DB_NAME/RP_NAME/SHARD_ID`.
4. Repeat step (3) for each shard that needs to be converted.
5. Start `influxd`.

Users with existing `tsi1` shards,
who attempt to start version 1.4.0 without following the steps above,
will find the shards refuse to open and will most likely see the following error message: `incompatible tsi1 index MANIFEST`.

### Configuration Changes

#### `[collectd]` Section

* `parse-multivalue-plugin` option was added with a default of `split`.  When set to `split`, multivalue plugin data (e.g. `df free:5000,used:1000`) will be split into separate measurements (e.g., `df_free, value=5000` and `df_used, value=1000`).  When set to `join`, multivalue plugin will be stored as a single multi-value measurement (e.g., `df, free=5000,used=1000`).

### Features

- Add `influx_inspect inmem2tsi` command to convert existing in-memory (TSM-based) shards to the TSI (Time Series Index) format.
- Add support for the Prometheus remote read and write APIs.
- Support estimated and exact SHOW CARDINALITY commands for measurements, series, tag keys, tag key values, and field keys.
- Improve `SHOW TAG KEYS` performance.
- Add `EXPLAIN ANALYZE` command, which produces a detailed execution plan of a `SELECT` statement.
- Improved compaction scheduling.
- Support Ctrl+C to cancel a running query in the Influx CLI.
- Allow human-readable byte sizes in configuation file.
- Respect X-Request-Id/Request-Id headers.
- Add 'X-Influxdb-Build' to http response headers so users can identify if a response is from an OSS or Enterprise service.
- All errors from queries or writes are available via X-InfluxDB-Error header, and 5xx error messages will be written
  to server logs.
- Add `parse-multivalue-plugin` to allow users to choose how multivalue plugins should be handled by the collectd service.
- Make client errors more helpful on downstream errors.
- Allow panic recovery to be disabled when investigating server issues.
- Support http pipelining for `/query` endpoint.
- Reduce allocations when reading data.
- Mutex profiles are now available.
- Batch up writes for monitor service.
- Use system cursors for measurement, series, and tag key meta queries.
- Initial implementation of explain plan.
- Include the number of scanned cached values in the iterator cost.
- Improve performance of `Include` and `Exclude` functions.
- Report the task status for a query.
- Reduce allocations, improve `readEntries` performance by simplifying loop
- Separate importer log statements to stdout and stderr.
- Improve performance of Bloom Filter in TSI index.
- Add message pack format for query responses.
- Implicitly decide on a lower limit for fill queries when none is present.
- Streaming `inmem2tsi` conversion.
- Sort & validate TSI key value insertion.
- Handle nil MeasurementIterator.
- Add long-line support to client importer.
- Update to go 1.9.2.
- InfluxDB now uses MIT licensed version of BurntSushi/toml.

### Bug fixes

- Change the default stats interval to 1 second instead of 10 seconds.
- illumos build broken on `syscall.Mmap`.
- Prevent privileges on non-existent databases from being set.
- `influxd backup` tool now separates out logging to `stdout` and `stderr`. Thanks @xginn8!
- Dropping measurement used several GB disk space.
- Fix the CQ start and end times to use Unix timestamps.
- `influx` CLI case-sensitivity.
- Fixed time boundaries for continuous queries with time zones.
- Return query parsing errors in CSV formats.
- Fix time zone shifts when the shift happens on a time zone boundary.
- Parse time literals using the time zone in the `SELECT` statement.
- Reduce CPU usage when checking series cardinality
- Fix backups when snapshot is empty.
- Cursor leak, resulting in an accumulation of `.tsm.tmp` files after compactions.
- Improve condition parsing.
- Ensure inputs are closed on error. Add runtime GC finalizer as additional guard to close iterators.
- Fix merging bug on system iterators.
- Force subqueries to match the parent queries ordering.
- Fix race condition accessing `seriesByID` map.
- Fix deadlock when calling `SeriesIDsAllOrByExpr`.
- Fix `influx_inspect export` so it skips missing files.
- Reduce how long it takes to walk the varrefs in an expression.
- Address `panic: runtime error: invalid memory address or nil pointer dereference`.
- Drop Series Cause Write Fail/Write Timeouts/High Memory Usage.
- Fix increased memory usage in cache and wal readers.
- An OSS read-only user should be able to list measurements on a database.
- Ensure time and tag-based condition can be used with tsi1 index when deleting.
- Prevent deadlock when doing math on the result of a subquery.
- Fix a minor memory leak in batching points in TSDB.
- Don't assume `which` is present in package post-install script.
- Fix missing man pages in new packaging output.
- Fix use of `INFLUXD_OPTS` in service file.
- Fix WAL panic: runtime error: makeslice: cap out of range.
- Copy returned bytes from TSI meta functions.
- Fix data deleted outside of time range.
- Fix data dropped incorrectly during compaction.
- Prevent deadlock during Collectd, Graphite, openTSDB, and UDP shutdown.
- Remove the pidfile after the server has exited.
- Return `query.ErrQueryInterrupted` for successful read on `InterruptCh`.
- Fix race inside Measurement index.
- Ensure retention service always removes local shards.
- Handle utf16 files when reading the configuration file.
- Fix `panic: runtime error: slice bounds out of range`.

## 1.3.7 [2017-10-26]

### Release Notes
Bug fix identified via Community and InfluxCloud. The build artifacts are now consistent with v1.3.5.

### Bug fixes

- Don't assume `which` is present in package post-install script.
- Fix use of `INFLUXD_OPTS` in service file.
- Fix missing man pages in new packaging output.
- Add RPM dependency on shadow-utils for `useradd`.
- Fix data deleted outside of specified time range when using `delete`
- Fix data dropped incorrectly during compaction.
- Return `query.ErrQueryInterrupted` for a successful read on `InterruptCh`.
- Copy returned bytes from TSI meta functions.

## v1.3.6 [2017-09-28]

### Release Notes
Bug fix identified via Community and InfluxCloud.

### Bug fixes
- Reduce how long it takes to walk the varrefs in an expression.
- Address `panic: runtime error: invalid memory address or nil pointer dereference`.
- Fix increased memory usage in cache and WAL readers for clusters with a large number of shards.
- Prevent deadlock when doing math on the result of a subquery.
- Fix several race conditions present in the shard and storage engine.
- Fix race condition on cache entry.

### Release Notes
Bug fix identified via Community and InfluxCloud.

### Bug fixes
- Fix race condition accessing `seriesByID` map.
- Fix deadlock when calling `SeriesIDsAllOrByExpr`.

## v1.3.5 [2017-08-29]

### Release Notes
Bug fix identified via Community and InfluxCloud.

### Bug fixes
- Fix race condition accessing `seriesByID` map.
- Fix deadlock when calling `SeriesIDsAllOrByExpr`.

## v1.3.4 [2017-08-23]

### Release Notes
Bug fix identified via Community and InfluxCloud.

### Bug fixes
- Fixed time boundaries for continuous queries with time zones.
- Fix time zone shifts when the shift happens on a time zone boundary.
- Parse time literals using the time zone in the select statement.
- Fix drop measurement not dropping all data.
- Fix backups when snapshot is empty.
- Eliminated cursor leak, resulting in an accumulation of .tsm.tmp files after compactions.
- Fix Deadlock when dropping measurement and writing.
- Ensure inputs are closed on error. Add runtime GC finalizer as additional guard to close iterators.
- Fix leaking tmp file when large compaction aborted.

## v1.3.3 [2017-08-10]

### Release Notes
Bug fix identified via Community and InfluxCloud.

### Bug fixes

- Resolves a memory leak when NewReaderIterator creates a nilFloatIterator, the reader is not closed.

## v1.3.2 [2017-08-04]

### Release Notes
Minor bug fixes were identified via Community and InfluxCloud.

### Bug fixes

- Interrupt "in-progress" TSM compactions.
- Prevent excessive memory usage when dropping series.
- Significantly improve performance of SHOW TAG VALUES.

## v1.3.1 [2017-07-20]

### Release Notes
Minor bug fixes were identified via Community and InfluxCloud.

### Bug fixes

- Ensure temporary TSM files get cleaned up when compaction aborted.
- Address deadlock issue causing 1.3.0 to become unresponsive.
- Duplicate points generated via INSERT after DELETE.
- Fix the CQ start and end times to use Unix timestamps.

## v1.3.0 [2017-06-21]

### Release Notes

#### TSI

Version 1.3.0 marks the first official release of the new InfluxDB time series index (TSI) engine.

The TSI engine is a significant technical advancement in InfluxDB.
It offers a solution to the [time-structured merge tree](/influxdb/v1.2/concepts/storage_engine/) engine's [high series cardinality issue](/influxdb/v1.3/troubleshooting/frequently-asked-questions/#why-does-series-cardinality-matter).
With TSI, the number of series should be unbounded by the memory on the server hardware and the number of existing series will have a negligible impact on database startup time.
See Paul Dix's blogpost [Path to 1 Billion Time Series: InfluxDB High Cardinality Indexing Ready for Testing](https://www.influxdata.com/path-1-billion-time-series-influxdb-high-cardinality-indexing-ready-testing/) for additional information.

TSI is disabled by default in version 1.3.
To enable TSI, uncomment the [`index-version` setting](/influxdb/v1.3/administration/config#index-version-inmem) and set it to `tsi1`.
The `index-version` setting is in the `[data]` section of the configuration file.
Next, restart your InfluxDB instance.

```
[data]
  dir = "/var/lib/influxdb/data"
  index-version = "tsi1"
```

#### Continuous Query Statistics

When enabled, each time a continuous query is completed, a number of details regarding the execution are written to the `cq_query` measurement of the internal monitor database (`_internal` by default). The tags and fields of interest are

| tag / field       | description                              |
| :---------------- | :--------------------------------------- |
| `db`              | name of database                         |
| `cq`              | name of continuous query                 |
| `durationNS`      | query execution time in nanoseconds      |
| `startTime`       | lower bound of time range                |
| `endTime`         | upper bound of time range                |
| `pointsWrittenOK` | number of points written to the target measurement |


* `startTime` and `endTime` are UNIX timestamps, in nanoseconds.
* The number of points written is also included in CQ log messages.

### Removals

The admin UI is removed and unusable in this release. The `[admin]` configuration section will be ignored.

### Configuration Changes

* The top-level config `bind-address` now defaults to `localhost:8088`.
  The previous default was just `:8088`, causing the backup and restore port to be bound on all available interfaces (i.e. including interfaces on the public internet).

The following new configuration options are available.

#### `[http]` Section

* `max-body-size` was added with a default of 25,000,000, but can be disabled by setting it to 0.
  Specifies the maximum size (in bytes) of a client request body. When a client sends data that exceeds
  the configured maximum size, a `413 Request Entity Too Large` HTTP response is returned.

#### `[continuous_queries]` Section

* `query-stats-enabled` was added with a default of `false`. When set to `true`, continuous query execution statistics are written to the default monitor store.

### Features

- Add WAL sync delay
- Add chunked request processing back into the Go client v2
- Allow non-admin users to execute SHOW DATABASES
- Reduce memory allocations by reusing gzip.Writers across requests
- Add system information to /debug/vars
- Add modulo operator to the query language.
- Failed points during an import now result in a non-zero exit code
- Expose some configuration settings via SHOW DIAGNOSTICS
- Support single and multiline comments in InfluxQL
- Support timezone offsets for queries
- Add "integral" function to InfluxQL
- Add "non_negative_difference" function to InfluxQL
- Add bitwise AND, OR and XOR operators to the query language
- Write throughput/concurrency improvements
- Remove the admin UI
- Update to go1.8.1
- Add max concurrent compaction limits
- Add TSI support tooling
- Track HTTP client requests for /write and /query with /debug/requests
- Write and compaction stability
- Add new profile endpoint for gathering all debug profiles and queries in single archive
- Add nanosecond duration literal support
- Optimize top() and bottom() using an incremental aggregator
- Maintain the tags of points selected by top() or bottom() when writing the results.
- Write CQ stats to the `_internal` database

### Bug fixes

- Several statements were missing the DefaultDatabase method
- Fix spelling mistake in HTTP section of config -- shared-secret
- History file should redact passwords before saving to history
- Suppress headers in output for influx cli when they are the same
- Add chunked/chunk size as setting/options in cli
- Do not increment the continuous query statistic if no query is run
- Forbid wildcards in binary expressions
- Fix fill(linear) when multiple series exist and there are null values
- Update liner dependency to handle docker exec
- Bind backup and restore port to localhost by default
- Kill query not killing query
- KILL QUERY should work during all phases of a query
- Simplify admin user check.
- Significantly improve DROP DATABASE speed
- Return an error when an invalid duration literal is parsed
- Fix the time range when an exact timestamp is selected
- Fix query parser when using addition and subtraction without spaces
- Fix a regression when math was used with selectors
- Ensure the input for certain functions in the query engine are ordered
- Significantly improve shutdown speed for high cardinality databases
- Fix racy integration test
- Prevent overflowing or underflowing during window computation
- Enabled golint for admin, httpd, subscriber, udp, thanks @karlding
- Implicitly cast null to false in binary expressions with a Boolean
- Restrict fill(none) and fill(linear) to be usable only with aggregate queries
- Restrict top() and bottom() selectors to be used with no other functions
- top() and bottom() now returns the time for every point
- Remove default upper time bound on DELETE queries
- Fix LIMIT and OFFSET for certain aggregate queries
- Refactor the subquery code and fix outer condition queries
- Fix compaction aborted log messages
- TSM compaction does not remove .tmp on error
- Set the CSV output to an empty string for null values
- Compaction exhausting disk resources in InfluxDB
- Small edits to the etc/config.sample.toml file
- Points beyond retention policy scope are dropped silently
- Fix TSM tmp file leaked on disk
- Fix large field keys preventing snapshot compactions
- URL query parameter credentials take priority over Authentication header
- TSI branch has duplicate tag values
- Out of memory when using HTTP API
- Check file count before attempting a TSI level compaction.
- index file fd leak in tsi branch
- Fix TSI non-contiguous compaction panic

## v1.2.4 [2017-05-08]

### Bug fixes

- Prefix partial write errors with `partial write:` to generalize identification in other subsystems.

## v1.2.3 [2017-04-17]

### Bug fixes

- Redact passwords before saving them to the history file.
- Add the missing DefaultDatabase method to several InfluxQL statements.
- Fix segment violation in models.Tags.Get.
- Simplify the admin user check.
- Fix a regression when math was used with selectors.
- Ensure the input for certain functions in the query engine are ordered.
- Fix issue where deleted `time` field keys created unparseable points.

## v1.2.2 [2017-03-14]

### Release Notes

### Configuration Changes

#### `[http]` Section

* [`max-row-limit`](/influxdb/v1.3/administration/config#max-row-limit-0) now defaults to `0`.
  In versions 1.0 and 1.1, the default setting was `10000`, but due to a bug, the value in use in versions 1.0 and 1.1 was effectively `0`.
  In versions 1.2.0 through 1.2.1, we fixed that bug, but the fix caused a breaking change for Grafana and Kapacitor users; users who had not set `max-row-limit` to `0` experienced truncated/partial data due to the `10000` row limit.
  In version 1.2.2, we've changed the default `max-row-limit` setting to `0` to match the behavior in versions 1.0 and 1.1.

### Bug fixes

- Change the default [`max-row-limit`](/influxdb/v1.3/administration/config#max-row-limit-0) setting from `10000` to `0` to prevent the absence of data in Grafana or Kapacitor.

## v1.2.1 [2017-03-08]

### Release Notes

### Bug fixes

-	 Treat non-reserved measurement names with underscores as normal measurements.
  - Reduce the expression in a subquery to avoid a panic.
  - Properly select a tag within a subquery.
  - Prevent a panic when aggregates are used in an inner query with a raw query.
  - Points missing after compaction.
  - Point.UnmarshalBinary() bounds check.
  - Interface conversion: tsm1.Value is tsm1.IntegerValue, not tsm1.FloatValue.
  - Map types correctly when using a regex and one of the measurements is empty.
  - Map types correctly when selecting a field with multiple measurements where one of the measurements is empty.
  - Include IsRawQuery in the rewritten statement for meta queries.
  - Fix race in WALEntry.Encode and Values.Deduplicate
  - Fix panic in collectd when configured to read types DB from directory.
  - Fix ORDER BY time DESC with ordering series keys.
  - Fix mapping of types when the measurement uses a regular expression.
  - Fix LIMIT and OFFSET when they are used in a subquery.
  - Fix incorrect math when aggregates that emit different times are used.
  - Fix EvalType when a parenthesis expression is used.
  - Fix authentication when subqueries are present.
  - Expand query dimensions from the subquery.
  - Dividing aggregate functions with different outputs doesn't panic.
  - Anchors not working as expected with case-insensitive regular expression.

## v1.2.0 [2017-01-24]

### Release Notes

This release introduces a major new querying capability in the form of sub-queries, and provides several performance improvements, including a 50% or better gain in write performance on larger numbers of cores. The release adds some stability and memory-related improvements, as well as several CLI-related bug fixes. If upgrading from a prior version, please read the configuration changes in the following section before upgrading.

### Configuration Changes

The following new configuration options are available, if upgrading to `1.2.0` from prior versions.

#### `[[collectd]]` Section

* `security-level` which defaults to `"none"`. This field also accepts `"sign"` and `"encrypt"` and enables different levels of transmission security for the collectd plugin.
* `auth-file` which defaults to `"/etc/collectd/auth_file"`. Specifies where to locate the authentication file used to authenticate clients when using signed or encrypted mode.

### Deprecations

The stress tool `influx_stress` will be removed in a subsequent release. We recommend using [`influx-stress`](https://github.com/influxdata/influx-stress) as a replacement.

### Features

- Remove the override of GOMAXPROCS.
- Uncomment section headers from the default configuration file.
- Improve write performance significantly.
- Prune data in meta store for deleted shards.
- Update latest dependencies with Godeps.
- Introduce syntax for marking a partial response with chunking.
- Use X-Forwarded-For IP address in HTTP logger if present.
- Add support for secure transmission via collectd.
- Switch logging to use structured logging everywhere.
- [CLI feature request] USE retention policy for queries.
- Add clear command to CLI.
- Adding ability to use parameters in queries in the v2 client using the `Parameters` map in the `Query` struct.
- Allow add items to array config via ENV.
- Support subquery execution in the query language.
- Verbose output for SSL connection errors.
- Cache snapshotting performance improvements

### Bug fixes

- Fix potential race condition in correctness of tsm1_cache memBytes statistic.
- Fix broken error return on meta client's UpdateUser and DropContinuousQuery methods.
- Fix string quoting and significantly improve performance of `influx_inspect export`.
- CLI was caching db/rp for insert into statements.
- Fix CLI import bug when using self-signed SSL certificates.
- Fix cross-platform backup/restore.
- Ensures that all user privileges associated with a database are removed when the database is dropped.
- Return the time from a percentile call on an integer.
- Expand string and Boolean fields when using a wildcard with `sample()`.
- Fix chuid argument order in init script.
- Reject invalid subscription URLs.
- CLI should use spaces for alignment, not tabs.
- 0.12.2 InfluxDB CLI client PRECISION returns "Unknown precision...".
- Fix parse key panic when missing tag value.
- Rentention Policy should not allow `INF` or `0` as a shard duration.
- Return Error instead of panic when decoding point values.
- Fix slice out of bounds panic when pruning shard groups.
- Drop database will delete /influxdb/data directory.
- Ensure Subscriber service can be disabled.
- Fix race in storage engine.
- InfluxDB should do a partial write on mismatched type errors.

## v1.1.5 [2017-05-08]

### Bug fixes

- Redact passwords before saving them to the history file.
- Add the missing DefaultDatabase method to several InfluxQL statements.

## v1.1.4 [2017-02-27]

### Bug fixes

- Backport from 1.2.0: Reduce GC allocations.

## v1.1.3 [2017-02-17]

### Bug fixes

- Remove Tags.shouldCopy, replace with forceCopy on series creation.

## v1.1.2 [2017-02-16]

### Bug fixes

- Fix memory leak when writing new series over HTTP.
- Fix series tag iteration segfault.
- Fix tag dereferencing panic.

## v1.1.1 [2016-12-06]

### Features

- Update Go version to 1.7.4.

### Bug fixes

- Fix string fields w/ trailing slashes.
- Quote the empty string as an ident.
- Fix incorrect tag value in error message.

### Security

[Go 1.7.4](https://golang.org/doc/devel/release.html#go1.7.minor) was released to address two security issues.  This release includes these security fixes.

## v1.1.0 [2016-11-14]

### Release Notes

This release is built with GoLang 1.7.3 and provides many performance optimizations, stability changes and a few new query capabilities.  If upgrading from a prior version, please read the configuration changes below section before upgrading.

### Deprecations

The admin interface is deprecated and will be removed in a subsequent release.
The configuration setting to enable the admin UI is now disabled by default, but can be enabled if necessary.
We recommend using [Chronograf](https://github.com/influxdata/chronograf) or [Grafana](https://github.com/grafana/grafana) as a replacement.

### Configuration Changes

The following configuration changes may need to changed before upgrading to `1.1.0` from prior versions.

#### `[admin]` Section

* `enabled` now default to false.  If you are currently using the admin interaface, you will need to change this value to `true` to re-enable it.  The admin interface is currently deprecated and will be removed in a subsequent release.

#### `[data]` Section

* `max-values-per-tag` was added with a default of 100,000, but can be disabled by setting it to `0`.  Existing measurements with tags that exceed this limit will continue to load, but writes that would cause the tags cardinality to increase will be dropped and a `partial write` error will be returned to the caller.  This limit can be used to prevent high cardinality tag values from being written to a measurement.
* `cache-max-memory-size` has been increased to from `524288000` to `1048576000`.  This setting is the maximum amount of RAM, in bytes, a shard cache can use before it rejects writes with an error.  Setting this value to `0` disables the limit.
* `cache-snapshot-write-cold-duration` has been decreased from `1h` to `10m`.  This setting determines how long values will stay in the shard cache while the shard is cold for writes.
* `compact-full-write-cold-duration` has been decreased from `24h` to `4h`.  The shorter duration allows cold shards to be compacted to an optimal state more quickly.

### Features

The query language has been extended with a few new features:

- Support regular expressions on fields keys in select clause.
- New `linear` fill option.
- New `cumulative_sum` function.
- Support `ON` for `SHOW` commands.

All Changes:

- Filter out series within shards that do not have data for that series.
- Rewrite regular expressions of the form host = /^server-a$/ to host = 'server-a', to take advantage of the tsdb index.
- Improve compaction planning performance by caching tsm file stats.
- Align binary math expression streams by time.
- Reduce map allocations when computing the TagSet of a measurement.
- Make input plugin services open/close idempotent.
- Speed up shutdown by closing shards concurrently.
- Add sample function to query language.
- Add `fill(linear)` to query language.
- Implement cumulative_sum() function.
- Update defaults in config for latest best practices.
- UDP Client: Split large points.
- Add stats for active compactions, compaction errors.
- More man pages for the other tools we package and compress man pages fully.
- Add max-values-per-tag to limit high tag cardinality data.
- Update jwt-go dependency to version 3.
- Support enable HTTP service over unix domain socket.
- Add additional statistics to query executor.
- Feature request: `influx inspect -export` should dump WAL files.
- Implement text/csv content encoding for the response writer.
- Support tools for running async queries.
- Support ON and use default database for SHOW commands.
- Correctly read in input from a non-interactive stream for the CLI.
- Support `INFLUX_USERNAME` and `INFLUX_PASSWORD` for setting username/password in the CLI.
- Optimize first/last when no group by interval is present.
- Make regular expressions work on field and dimension keys in SELECT clause.
- Change default time boundaries for raw queries.
- Support mixed duration units.

### Bug fixes

- Avoid deadlock when `max-row-limit` is hit.
- Fix incorrect grouping when multiple aggregates are used with sparse data.
- Fix output duration units for SHOW QUERIES.
- Truncate the version string when linking to the documentation.
- influx_inspect: export does not escape field keys.
- Fix issue where point would be written to wrong shard.
- Fix retention policy inconsistencies.
- Remove accidentally added string support for the stddev call.
- Remove /data/process_continuous_queries endpoint.
- Enable https subscriptions to work with custom CA certificates.
- Reduce query planning allocations.
- Shard stats include WAL path tag so disk bytes make more sense.
- Panic with unread show series iterators during drop database.
- Use consistent column output from the CLI for column formatted responses.
- Correctly use password-type field in Admin UI.
- Duplicate parsing bug in ALTER RETENTION POLICY.
- Fix database locked up when deleting shards.
- Fix mmap dereferencing.
- Fix base64 encoding issue with /debug/vars stats.
- Drop measurement causes cache max memory exceeded error.
- Decrement number of measurements only once when deleting the last series from a measurement.
- Delete statement returns an error when retention policy or database is specified.
- Fix the dollar sign so it properly handles reserved keywords.
- Exceeding max retention policy duration gives incorrect error message.
- Drop time when used as a tag or field key.

## v1.0.2 [2016-10-05]

### Bug fixes

- Fix RLE integer decoding producing negative numbers.
- Avoid stat syscall when planning compactions.
- Subscription data loss under high write load.
- Do not automatically reset the shard duration when using ALTER RETENTION POLICY.
- Ensure correct shard groups created when retention policy has been altered.

## v1.0.1 [2016-09-26]

### Bug fixes

- Prevent users from manually using system queries since incorrect use would result in a panic.
- Ensure fieldsCreated stat available in shard measurement.
- Report cmdline and memstats in /debug/vars.
- Fixing typo within example configuration file.
- Implement time math for lazy time literals.
- Fix database locked up when deleting shards.
- Skip past points at the same time in derivative call within a merged series.
- Read an invalid JSON response as an error in the Influx client.

## v1.0.0 [2016-09-08]

### Release Notes
Inital release of InfluxDB.

### Breaking changes

* `max-series-per-database` was added with a default of 1M but can be disabled by setting it to `0`. Existing databases with series that exceed this limit will continue to load but writes that would create new series will fail.
* Config option `[cluster]` has been replaced with `[coordinator]`.
* Support for config options `[collectd]` and `[opentsdb]` has been removed; use `[[collectd]]` and `[[opentsdb]]` instead.
* Config option `data-logging-enabled` within the `[data]` section, has been renamed to `trace-logging-enabled`, and defaults to `false`.
* The keywords `IF`, `EXISTS`, and `NOT` where removed for this release.  This means you no longer need to specify `IF NOT EXISTS` for `DROP DATABASE` or `IF EXISTS` for `CREATE DATABASE`.  If these are specified, a query parse error is returned.
* The Shard `writePointsFail` stat has been renamed to `writePointsErr` for consistency with other stats.

With this release the systemd configuration files for InfluxDB will use the system configured default for logging and will no longer write files to `/var/log/influxdb` by default. On most systems, the logs will be directed to the systemd journal and can be accessed by `journalctl -u influxdb.service`. Consult the systemd journald documentation for configuring journald.

### Features

- Add mode function.
- Support negative timestamps for the query engine.
- Write path stats.
- Add MaxSeriesPerDatabase config setting.
- Remove IF EXISTS/IF NOT EXISTS from influxql language.
- Update go package library dependencies.
- Add tsm file export to influx_inspect tool.
- Create man pages for commands.
- Return 403 Forbidden when authentication succeeds but authorization fails.
- Added favicon.
- Run continuous query for multiple buckets rather than one per bucket.
- Log the CQ execution time when continuous query logging is enabled.
- Trim BOM from Windows Notepad-saved config files.
- Update help and remove unused config options from the configuration file.
- Add NodeID to execution options.
- Make httpd logger closer to Common (& combined) Log Format.
- Allow any variant of the help option to trigger the help.
- Reduce allocations during query parsing.
- Optimize timestamp run-length decoding.
- Adds monitoring statistic for on-disk shard size.
- Add HTTP(s) based subscriptions.
- Add new HTTP statistics to monitoring.
- Speed up drop database.
- Add Holt-Winter forecasting function.
- Add support for JWT token authentication.
- Add ability to create snapshots of shards.
- Parallelize iterators.
- Teach the http service how to enforce connection limits.
- Support cast syntax for selecting a specific type.
- Refactor monitor service to avoid expvar and write monitor statistics on a truncated time interval.
- Dynamically update the documentation link in the admin UI.
- Support wildcards in aggregate functions.
- Support specifying a retention policy for the graphite service.
- Add extra trace logging to tsm engine.
- Add stats and diagnostics to the TSM engine.
- Support regex selection in SHOW TAG VALUES for the key.
- Modify the default retention policy name and make it configurable.
- Update SHOW FIELD KEYS to return the field type with the field key.
- Support bound parameters in the parser.
- Add https-private-key option to httpd config.
- Support loading a folder for collectd typesdb files.

### Bug fixes

- Optimize queries that compare a tag value to an empty string.
- Allow blank lines in the line protocol input.
- Runtime: goroutine stack exceeds 1000000000-byte limit.
- Fix alter retention policy when all options are used.
- Concurrent series limit.
- Ensure gzip writer is closed in influx_inspect export.
- Fix CREATE DATABASE when dealing with default values.
- Fix UDP pointsRx being incremented twice.
- Tombstone memory improvements.
- Hardcode auto generated RP names to autogen.
- Ensure IDs can't clash when managing Continuous Queries.
- Continuous full compactions.
- Remove limiter from walkShards.
- Copy tags in influx_stress to avoid a concurrent write panic on a map.
- Do not run continuous queries that have no time span.
- Move the CQ interval by the group by offset.
- Fix panic parsing empty key.
- Update connection settings when changing hosts in CLI.
- Always use the demo config when outputting a new config.
- Minor improvements to init script. Removes sysvinit-utils as package dependency.
- Fix compaction planning with large TSM files.
- Duplicate data for the same timestamp.
- Fix panic: truncate the slice when merging the caches.
- Fix regex binary encoding for a measurement.
- Fix fill(previous) when used with math operators.
- Rename dumptsmdev to dumptsm in influx_inspect.
- Remove a double lock in the tsm1 index writer.
- Remove FieldCodec from TSDB package.
- Allow a non-admin to call "use" for the influx CLI.
- Set the condition cursor instead of aux iterator when creating a nil condition cursor.
- Update `stress/v2` to work with clusters, ssl, and username/password auth. Code cleanup.
- Modify the max nanosecond time to be one nanosecond less.
- Include sysvinit-tools as an rpm dependency.
- Add port to all graphite log output to help with debugging multiple endpoints.
- Fix panic: runtime error: index out of range.
- Remove systemd output redirection.
- Database unresponsive after DROP MEASUREMENT.
- Address Out of Memory Error when Dropping Measurement.
- Fix the point validation parser to identify and sort tags correctly.
- Prevent panic in concurrent auth cache write.
- Set X-Influxdb-Version header on every request (even 404 requests).
- Prevent panic if there are no values.
- Time sorting broken with overwritten points.
- queries with strings that look like dates end up with date types, not string types.
- Concurrent map read write panic.
- Drop writes from before the retention policy time window.
- Fix SELECT statement required privileges.
- Filter out sources that do not match the shard database/retention policy.
- Truncate the shard group end time if it exceeds MaxNanoTime.
- Batch SELECT INTO / CQ writes.
- Fix compaction planning re-compacting large TSM files.
- Ensure client sends correct precision when inserting points.
- Accept points with trailing whitespace.
- Fix panic in SHOW FIELD KEYS.
- Disable limit optimization when using an aggregate.
- Fix panic: interface conversion: tsm1.Value is \*tsm1.StringValue, not \*tsm1.FloatValue.
- Data race when dropping a database immediately after writing to it.
- Make sure admin exists before authenticating query.
- Print the query executor's stack trace on a panic to the log.
- Fix read tombstones: EOF.
- Query-log-enabled in config not ignored anymore.
- Ensure clients requesting gzip encoded bodies don't receive empty body.
- Optimize shard loading.
- Queries slow down hundreds times after overwriting points.
- SHOW TAG VALUES accepts != and !~ in WHERE clause.
- Remove old cluster code.
- Ensure that future points considered in SHOW queries.
- Fix full compactions conflicting with level compactions.
- Overwriting points on large series can cause memory spikes during compactions.
- Fix parseFill to check for fill ident before attempting to parse an expression.
- Max index entries exceeded.
- Address slow startup time.
- Fix measurement field panic in tsm1 engine.
- Queries against files that have just been compacted need to point to new files.
- Check that retention policies exist before creating CQ.
