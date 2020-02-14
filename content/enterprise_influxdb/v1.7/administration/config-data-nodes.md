---
title: Configure InfluxDB Enterprise data nodes
description: Covers the InfluxDB Enterprise data node configuration settings and environmental variables
menu:
  enterprise_influxdb_1_7:
    name: Configure data nodes
    weight: 20
    parent: Administration
---

* [Data node configuration settings](#data-node-configuration-settings)
  * [Global](#global-settings)
  * [Enterprise license [enterprise]](#enterprise-license-settings)
  * [Meta node `[meta]`](#meta-node-settings)
  * [Data `[data]`](#data-settings)
  * [Cluster `[cluster]`](#cluster-settings)
  * [Retention `[retention]`](#retention-policy-settings)
  * [Hinted Handoff `[hinted-handoff]`](#hinted-handoff-settings)
  * [Anti-Entropy `[anti-entropy]`](#anti-entropy-ae-settings)
  * [Shard precreation `[shard-precreation]`](#shard-precreation-settings)
  * [Monitor `[monitor]`](#monitor-settings)
  * [HTTP endpoints [http]](#http-endpoint-settings)
  * [Logging [logging]](#logging-settings)
  * [Subscriber [subscriber]](#subscriber-settings)
  * [Graphite [graphite]](#graphite-settings)
  * [Collectd [collectd]](#collectd-settings)
  * [OpenTSDB [opentsdb]](#opentsdb-settings)
  * [UDP [udp]](#udp-settings)
  * [Continuous queries [continuous-queries]](#continuous-queries-settings)
  * [TLS [tls]](#tls-settings)

## Data node configuration settings

The InfluxDB Enterprise data node configuration settings overlap significantly
with the settings in InfluxDB OSS.

> **Note:**
The system has internal defaults for every configuration file setting.
View the default settings with the `influxd config` command.
The local configuration file (`/etc/influxdb/influxdb.conf`) overrides any
internal defaults but the configuration file does not need to include
every configuration setting.
Starting with version 1.0.1, most of the settings in the local configuration
file are commented out.
All commented-out settings will be determined by the internal defaults.

-----

## Global settings

#### `reporting-disabled = false`

Once every 24 hours InfluxDB Enterprise will report usage data to usage.influxdata.com.
The data includes a random ID, os, arch, version, the number of series and other usage data. No data from user databases is ever transmitted.
Change this option to true to disable reporting.

#### `bind-address = ":8088"`

The TCP bind address used by the RPC service for inter-node communication and [backup and restore](/enterprise_influxdb/v1.7/administration/backup-and-restore/).

Environment variable: `INFLUXDB_BIND_ADDRESS`

#### `hostname = "localhost"`

The hostname of the [data node](/enterprise_influxdb/v1.7/concepts/glossary/#data-node). This must be resolvable by all other nodes in the cluster.

Environment variable: `INFLUXDB_HOSTNAME`

#### `gossip-frequency = "3s"`

How often to update the cluster with this node's internal status.

Environment variable: `INFLUXDB_GOSSIP_FREQUENCY`

-----

## Enterprise license settings

### `[enterprise]`

The `[enterprise]` section contains the parameters for the meta node's registration with the [InfluxDB Enterprise License Portal](https://portal.influxdata.com/).

#### `license-key = ""`

The license key created for you on [InfluxPortal](https://portal.influxdata.com). The meta node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
The server caches the license file locally.
The data process will only function for a limited time without a valid license file.
You must use the [`license-path` setting](#license-path) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

{{% warn %}}
Use the same key for all nodes in the same cluster.  
The `license-key` and `license-path` settings are
mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

InfluxData recommends performing rolling restarts on the nodes after the license key update.
Restart one meta, data, or Enterprise service at a time and wait for it to come back up successfully.
The cluster should remain unaffected as long as only one node is restarting at a time as long as there are two or more data nodes.

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

#### `license-path = ""`

The local path to the permanent JSON license file that you received from InfluxData for instances that do not have access to the internet.
The data process will only function for a limited time without a valid license file.
Contact [sales@influxdb.com](mailto:sales@influxdb.com) if a license file is required.

The license file should be saved on every server in the cluster, including Meta, Data, and Enterprise nodes.
The file contains the JSON-formatted license, and must be readable by the `influxdb` user. Each server in the cluster independently verifies its license.
InfluxData recommends performing rolling restarts on the nodes after the license file update.
Restart one meta, data, or Enterprise service at a time and wait for it to come back up successfully.
The cluster should remain unaffected as long as only one node is restarting at a time as long as there are two or more data nodes.

{{% warn %}}
Use the same license file for all nodes in the same cluster.
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

-----

## Meta node settings

### `[meta]`

Settings related to how the data nodes interact with the meta nodes.

#### `dir = "/var/lib/influxdb/meta"`

The directory where the cluster metadata is stored.

> **Note:** Data nodes do require a local meta directory.

Environment variable: `INFLUXDB_META_DIR`

#### `meta-tls-enabled = false`

Whether to use TLS when connecting to meta nodes.
Set to `true` to if [`https-enabled`](#https-enabled-false) is set to `true`.

Environment variable: `INFLUXDB_META_META_TLS_ENABLED`

#### `meta-insecure-tls = false`

Allows insecure TLS connections to meta nodes.
This is useful when testing with self-signed certificates.

Set to `true` to allow the data node to accept self-signed certificates if [`https-enabled`](#https-enabled-false) is set to `true`.

Environment variable: `INFLUXDB_META_META_INSECURE_TLS`

#### `meta-auth-enabled = false`

This setting must have the same value as the meta nodes' `[meta] auth-enabled` configuration.

Set to `true` if [`auth-enabled`](#auth-enabled-false) is set to `true` in the meta node configuration files.
For JWT authentication, also see the [`meta-internal-shared-secret`](#meta-internal-shared-secret) configuration option.

Environment variable: `INFLUXDB_META_META_AUTH_ENABLED`

#### `meta-internal-shared-secret = ""`

The shared secret used by the internal API for JWT authentication between InfluxDB nodes.
This value must be the same as the [`internal-shared-secret`](/enterprise_influxdb/v1.7/administration/config-meta-nodes/#internal-shared-secret) specified in the meta node configuration file.

Environment variable: `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`

#### `retention-autocreate = true`

Automatically creates a default [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp) (RP) when the system creates a database.
The default RP (`autogen`) has an infinite duration, a shard group duration of seven days, and a replication factor set to the number of data nodes in the cluster.
The system targets the `autogen` RP when a write or query does not specify an RP.
Set this option to `false` to prevent the system from creating the `autogen` RP when the system creates a database.

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

#### `logging-enabled = true`

Whether log messages are printed for the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

-----

## Data settings

### `[data]`

Controls where the actual shard data for InfluxDB lives and how it is compacted from the WAL.
"dir" may need to be changed to a suitable place for your system.
The defaults should work for most systems.

For InfluxDB OSS, see the [OSS documentation](/influxdb/v1.7/administration/config/#data-settings).

#### `dir = "/var/lib/influxdb/data"`

The directory where the TSM storage engine stores TSM (read-optimized) files.

Environment variable: `INFLUXDB_DATA_DIR`

#### `wal-dir = "/var/lib/influxdb/wal"`

The directory where the TSM storage engine stores WAL (write-optimized) files.

Environment variable: `INFLUXDB_DATA_WAL_DIR`

#### `trace-logging-enabled = false`

Trace logging provides more verbose output around the TSM engine.
Turning this on can provide more useful output for debugging TSM engine issues.

Environmental variable: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

#### `query-log-enabled = true`

Whether queries should be logged before execution.
Very useful for troubleshooting, but will log any sensitive data contained within a query.

Environment variable: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

#### `wal-fsync-delay = "0s"`

The amount of time that a write waits before fsyncing.
Use a duration greater than 0 to batch up multiple fsync calls.
This is useful for slower disks or when experiencing WAL write contention.
A value of `0s` fsyncs every write to the WAL.
InfluxData recommends values ranging from `0ms` to `100ms` for non-SSD disks.

Environment variable: `INFLUXDB_DATA_WAL_FSYNC_DELAY`

### Data settings for the TSM engine

#### `cache-max-memory-size = "1g"`

The maximum size a shard cache can reach before it starts rejecting writes.

Environment variable: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

#### `cache-snapshot-memory-size = "25m"`

The size at which the TSM engine will snapshot the cache and write it to a TSM file, freeing up memory.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

#### `cache-snapshot-write-cold-duration = "10m"`

The length of time at which the TSM engine will snapshot the cache and write it to a new TSM file if the shard hasn't received writes or deletes.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

#### `max-concurrent-compactions = 0`

The maximum number of concurrent full and level compactions that can run at one time.  
A value of `0` results in 50% of `runtime.GOMAXPROCS(0)` used at runtime.  
Any number greater than `0` limits compactions to that value.  
This setting does not apply to cache snapshotting.

Environmental variable: `INFLUXDB_DATA_CACHE_MAX_CONCURRENT_COMPACTIONS`

#### `compact-full-write-cold-duration = "4h"`

The duration at which the TSM engine will compact all TSM files in a shard if it hasn't received a write or delete.

Environment variable: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

#### `index-version = "inmem"`

The type of shard index to use for new shards.
The default (`inmem`) is to use an in-memory index that is recreated at startup.
A value of `tsi1` will use a disk-based index that supports higher cardinality datasets.
Value should be enclosed in double quotes.

Environment variable: `INFLUXDB_DATA_INDEX_VERSION`

### In-memory (`inmem`) index settings

#### `max-series-per-database = 1000000`

The maximum number of [series](/influxdb/v1.7/concepts/glossary/#series) allowed per database before writes are dropped.
The default setting is `1000000` (one million).
Change the setting to `0` to allow an unlimited number of series per database.

If a point causes the number of series in a database to exceed
`max-series-per-database`, InfluxDB will not write the point, and it returns a
`500` with the following error:

```bash
{"error":"max series per database exceeded: <series>"}
```

> **Note:** Any existing databases with a series count that exceeds `max-series-per-database`
> will continue to accept writes to existing series, but writes that create a
> new series will fail.

Environment variable: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

#### `max-values-per-tag = 100000`

The maximum number of [tag values](/influxdb/v1.7/concepts/glossary/#tag-value) allowed per [tag key](/influxdb/v1.7/concepts/glossary/#tag-key).
The default value is `100000` (one hundred thousand).
Change the setting to `0` to allow an unlimited number of tag values per tag
key.
If a tag value causes the number of tag values of a tag key to exceed
`max-values-per-tag`, then InfluxDB will not write the point, and it returns
a `partial write` error.

Any existing tag keys with tag values that exceed `max-values-per-tag`
will continue to accept writes, but writes that create a new tag value
will fail.

Environment variable: `INFLUXDB_DATA_MAX_VALUES_PER_TAG`

### TSI (`tsi1`) index settings

#### `max-index-log-file-size = "1m"`

The threshold, in bytes, when an index write-ahead log (WAL) file will compact
into an index file. Lower sizes will cause log files to be compacted more
quickly and result in lower heap usage at the expense of write throughput.
Higher sizes will be compacted less frequently, store more series in-memory,
and provide higher write throughput.
Valid size suffixes are `k`, `m`, or `g` (case-insensitive, 1024 = 1k).
Values without a size suffix are in bytes.

Environment variable: `INFLUXDB_DATA_MAX_INDEX_LOG_FILE_SIZE`

#### `series-id-set-cache-size = 100`

Specifies the number of series ID sets to cache for the TSI index (by default, 100). Series IDs in a set refer to series that match on the same index predicate (tag filter). An example filter might be `region = west`. When the index plans a query, it produces a set for each tag filter in the query. These sets are then cached in the index.

The series ID set is an LRU cache, so once the cache is full, the least recently used set is evicted. Cached results are returned quickly because they don’t need to be recalculated when a subsequent query with a matching tag filter is executed. For example, if a query includes `region = west`, the series IDs matching `region = west` are cached and subsequent queries that include `region = west` are retrieved from the cache.

We recommend using the default setting. Changing this value to `0` disables the cache, which may lead to query performance issues.
Increase this value only if you know the set of tag key-value predicates across all measurements for a database is larger than 100. Increasing the cache size may lead to an increase in heap usage.

Environment variable: `INFLUXDB_DATA_SERIES_ID_SET_CACHE_SIZE`

-----

## Cluster settings

### `[cluster]`

Settings related to how the data nodes interact with other data nodes.
Controls how data is shared across shards and the options for query management.

An InfluxDB Enterprise cluster uses remote procedure calls (RPCs) for inter-node communication.
An RPC connection pool manages the stream connections and efficiently uses system resources.
InfluxDB data nodes multiplex RPC streams over a single TCP connection to avoid the overhead of
frequently establishing and destroying TCP connections and exhausting ephemeral ports.
Typically, a data node establishes a single, persistent TCP connection to each of the other data nodes
to perform most RPC requests. In special circumstances, for example, when copying shards,
a single-use TCP connection may be used.

For information on InfluxDB `_internal` measurement statistics related to clusters, RPCs, and shards,
see [Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise (`_inernal`)](/platform/monitoring/influxdata-platform/tools/measurements-internal/#cluster-enterprise-only).

#### `dial-timeout = "1s"`

The duration for which the meta node waits for a connection to a remote data node before the meta node attempts to connect to a different remote data node.
This setting applies to queries only.

Environment variable: `INFLUXDB_CLUSTER_DIAL_TIMEOUT`

#### `pool-max-idle-time = "60s"`

The maximum time that a TCP connection to another data node remains idle in the connection pool.
When the connection is idle longer than the specified duration, the inactive connection is reaped —
retired or recycled — so that the connection pool is not filled with inactive connections. Reaping
idle connections minimizes inactive connections, decreases system load, and prevents system failure.

Environment variable: `INFLUXDB_CLUSTER_POOL_MAX_IDLE_TIME`

#### `pool-max-idle-streams = 100`

The maximum number of idle RPC stream connections to retain in an idle pool between two nodes.
When a new RPC request is issued, a connection is temporarily pulled from the idle pool, used, and then returned.
If an idle pool is full and a stream connection is no longer required, the system closes the stream connection and resources become available.
The number of active streams can exceed the maximum number of idle pool connections,
but are not returned to the idle pool when released.
Creating streams are relatively inexpensive operations to perform,
so it is unlikely that changing this value will measurably improve performance between two nodes.

Environment variable: `INFLUXDB_CLUSTER_POOL_MAX_IDLE_STREAMS`

#### `shard-reader-timeout = "0"`

The default timeout set on shard readers.
The time in which a query connection must return its response after which the system returns an error.

Environment variable: `INFLUXDB_CLUSTER_SHARD_READER_TIMEOUT`

#### `https-enabled = false`

Determines whether data nodes use HTTPS to communicate with each other.

#### `https-certificate = ""`

The SSL certificate to use when HTTPS is enabled.  
The certificate should be a PEM-encoded bundle of the certificate and key.  
If it is just the certificate, a key must be specified in `https-private-key`.

#### `https-private-key = ""`

Use a separate private key location.

#### `https-insecure-tls = false`

Whether data nodes will skip certificate validation communicating with each other over HTTPS.
This is useful when testing with self-signed certificates.

#### `cluster-tracing = false`

Enables cluster trace logging.
Set to `true` to enable logging of cluster communications.
Enable this setting to verify connectivity issues between data nodes.

Environment variable: `INFLUXDB_CLUSTER_CLUSTER_TRACING`

#### `write-timeout = "10s"`

The duration a write request waits until a "timeout" error is returned to the caller. The default value is 10 seconds.

Environment variable: `INFLUXDB_CLUSTER_WRITE_TIMEOUT`

#### `max-concurrent-queries = 0`

The maximum number of concurrent queries allowed to be executing at one time.  
If a query is executed and exceeds this limit, an error is returned to the caller.  
This limit can be disabled by setting it to `0`.

Environment variable: `INFLUXDB_CLUSTER_MAX_CONCURRENT_QUERIES`

#### `query-timeout = "0s"`

The maximum time a query is allowed to execute before being killed by the system.
This limit can help prevent run away queries.  Setting the value to `0` disables the limit.

Environment variable: `INFLUXDB_CLUSTER_QUERY_TIMEOUT`

#### `log-queries-after = "0s"`

The time threshold when a query will be logged as a slow query.  
This limit can be set to help discover slow or resource intensive queries.  
Setting the value to `0` disables the slow query logging.

Environment variable: `INFLUXDB_CLUSTER_LOG_QUERIES_AFTER`

#### `max-select-point = 0`

The maximum number of points a SELECT statement can process.  
A value of `0` will make the maximum point count unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_POINT`

#### `max-select-series = 0`

The maximum number of series a SELECT can run.
A value of `0` will make the maximum series count unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_SERIES`

#### `max-select-buckets = 0`

The maximum number of group by time buckets a SELECT can create.  
A value of `0` will make the maximum number of buckets unlimited.

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_BUCKETS`

-----

## Hinted Handoff settings

### `[hinted-handoff]`

Controls the hinted handoff (HH) queue, which allows data nodes to temporarily cache writes destined for another data node when that data node is unreachable.

#### `batch-size = 512000`

The maximum number of bytes to write to a shard in a single request.

Environment variable: `INFLUXDB_HINTED_HANDOFF_BATCH_SIZE`

#### `dir = "/var/lib/influxdb/hh"`

The hinted handoff directory where the durable queue will be stored on disk.

Environment variable: `INFLUXDB_HINTED_HANDOFF_DIR`

#### `enabled = true`

Set to `false` to disable hinted handoff.
Disabling hinted handoff is not recommended and can lead to data loss if another data node is unreachable for any length of time.

Environment variable: `INFLUXDB_HINTED_HANDOFF_ENABLED`

#### `max-size = 10737418240`

The maximum size of the hinted handoff queue in bytes.
Each queue is for one and only one other data node in the cluster.
If there are N data nodes in the cluster, each data node may have up to N-1 hinted handoff queues.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_SIZE`

#### `max-age = "168h0m0s"`

The time interval that writes sit in the queue before they are purged.
The time is determined by how long the batch has been in the queue, not by the timestamps in the data.
If another data node is unreachable for more than the `max-age` it can lead to data loss.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_AGE`

#### `retry-concurrency = 20`

The maximum number of hinted handoff blocks that the source data node attempts to write to each destination data node.
Hinted handoff blocks are sets of data that belong to the same shard and have the same destination data node.

If `retry-concurrency` is 20 and the source data node's hinted handoff has 25 blocks for destination data node A, then the source data node attempts to concurrently write 20 blocks to node A.
If `retry-concurrency` is 20 and the source data node's hinted handoff has 25 blocks for destination data node A and 30 blocks for destination data node B, then the source data node attempts to concurrently write 20 blocks to node A and 20 blocks to node B.
If the source data node successfully writes 20 blocks to a destination data node, it continues to write the remaining hinted handoff data to that destination node in sets of 20 blocks.

If the source data node successfully writes data to destination data nodes, a higher `retry-concurrency` setting can accelerate the rate at which the source data node empties its hinted handoff queue.

Note that increasing `retry-concurrency` also increases network traffic.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_CONCURRENCY`

#### `retry-rate-limit = 0`

The rate limit (in bytes per second) that hinted handoff retries hints. A value of `0` disables the rate limit.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_RATE_LIMIT`

#### `retry-interval = "1s"`

The time period after which the hinted handoff retries a write after the write fails.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_INTERVAL`

#### `retry-max-interval = "10s"`

The maximum interval after which the hinted handoff retries a write after the write fails.
The `retry-max-interval` option is no longer in use and will be removed from the configuration file in a future release.
Changing the `retry-max-interval` setting has no effect on your cluster.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_MAX_INTERVAL`

#### `purge-interval = "1m0s"`

The interval at which InfluxDB checks to purge data that are above `max-age`.

Environment variable: `INFLUXDB_HINTED_HANDOFF_PURGE_INTERVAL`

-----

## Anti-Entropy (AE) settings

For information about the Anti-Entropy service, see [Anti-entropy service in InfluxDB Enterprise](/enterprise_influxdb/v1.7/administration/anti-entropy).

### `[anti-entropy]`

Controls the copying and repairing of shards to ensure that data nodes contain the shard data they are supposed to.

#### `enabled = false`

Enables the anti-entropy service.
Default value is `false`.

Environment variable: `INFLUXDB_ANTI_ENTROPY_ENABLED`

#### `check-interval = "5m"`

The interval of time when anti-entropy checks run on each data node.

Environment variable: `INFLUXDB_ANTI_ENTROPY_CHECK_INTERVAL`

#### `max-fetch = 10`

The maximum number of shards that a single data node will copy or repair in parallel.

Environment variable: `INFLUXDB_ANTI_ENTROPY_MAX_FETCH`

#### `max-sync = 1`

The maximum number of concurrent sync operations that should be performed.
Modify this setting only when requested by InfluxData support.

Environment variable: `INFLUXDB_ANTI_ENTROPY_MAX_SYNC`

#### `auto-repair-missing = true`

Enables missing shards to automatically be repaired.

Environment variable: `INFLUXDB_ANTI_ENTROPY_AUTO_REPAIR_MISSING`

-----

## Retention policy settings

### `[retention]`

Controls the enforcement of retention policies for evicting old data.

#### `enabled = true`

Enables retention policy enforcement.
Default value is `true`.

Environment variable: `INFLUXDB_RETENTION_ENABLED`

#### `check-interval = "30m0s"`

The interval of time when retention policy enforcement checks run.

Environment variable: `INFLUXDB_RETENTION_CHECK_INTERVAL`

-----

## Shard precreation settings

### `[shard-precreation]`

Controls the precreation of shards, so they are available before data arrives.
Only shards that, after creation, will have both a start- and end-time in the future, will ever be created. Shards are never precreated that would be wholly or partially in the past.

#### `enabled = true`

Enables the shard precreation service.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ENABLED`

#### `check-interval = "10m"`

The interval of time when the check to precreate new shards runs.

Environment variable: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

#### `advance-period = "30m"`

The default period ahead of the end time of a shard group that its successor group is created.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

-----

## Monitor settings

### `[monitor]`

By default, InfluxDB writes system monitoring data to the `_internal` database.
If that database does not exist, InfluxDB creates it automatically.
The `DEFAULT` retention policy on the `internal` database is seven days.
To change the default seven-day retention policy, you must [create](/influxdb/v1.7/query_language/database_management/#retention-policy-management) it.

For InfluxDB Enterprise production systems, InfluxData recommends including a dedicated InfluxDB (OSS) monitoring instance for monitoring InfluxDB Enterprise cluster nodes.

* On the dedicated InfluxDB monitoring instance, set `store-enabled = false` to avoid potential performance and storage issues.
* On each InfluxDB cluster node, install a Telegraf input plugin and Telegraf output plugin configured to report data to the dedicated InfluxDB monitoring instance.

#### `store-enabled = true`

Enables the internal storage of statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_ENABLED`

#### `store-database = "_internal"`

The destination database for recorded statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_DATABASE`

#### `store-interval = "10s"`

The interval at which to record statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_INTERVAL`

#### `remote-collect-interval = "10s"`

The time interval to poll other data nodes' stats when aggregating cluster stats.

Environment variable: `INFLUXDB_MONITOR_REMOTE_COLLECT_INTERVAL`

-----

## HTTP endpoint settings

### `[http]`

Controls how the HTTP endpoints are configured. These are the primary mechanism for getting data into and out of InfluxDB.

For InfluxDB OSS, see the [OSS documentation](/influxdb/v1.7/administration/config/#http-endpoint-settings-http).

#### `enabled = true`

Enables HTTP endpoints.

Environment variable: `INFLUXDB_HTTP_ENABLED`

#### `flux-enabled = false`

Determines whether the Flux query endpoint is enabled. To enable the use of Flux queries, set the value to `true`.

Environment variable: `INFLUXDB_HTTP_FLUX_ENABLED`

#### `bind-address = ":8086"`

The bind address used by the HTTP service.

Environment variable: `INFLUXDB_HTTP_BIND_ADDRESS`

#### `auth-enabled = false`

Enables HTTP authentication.

Environment variable: `INFLUXDB_HTTP_AUTH_ENABLED`

#### `realm = "InfluxDB"`

The default realm sent back when issuing a basic authorization challenge.

Environment variable: `INFLUXDB_HTTP_REALM`

#### `log-enabled = true`

Enables HTTP request logging.

Environment variable: `INFLUXDB_HTTP_LOG_ENABLED`

### `suppress-write-log = false`

Determines whether the HTTP write request logs should be suppressed when the log is enabled.

#### `access-log-path = ""`

The path to the access log, which determines whether detailed write logging is enabled using `log-enabled = true`.
Specifies whether HTTP request logging is written to the specified path when enabled.
If `influxd` is unable to access the specified path, it will log an error and fall back to `stderr`.
When HTTP request logging is enabled, this option specifies the path where log entries should be written.
If unspecified, the default is to write to stderr, which intermingles HTTP logs with internal InfluxDB logging.
If `influxd` is unable to access the specified path, it will log an error and fall back to writing the request log to `stderr`.

Environment variable: `INFLUXDB_HTTP_ACCESS_LOG_PATH`

#### `access-log-status-filters = []`

Filters which requests should be logged. Each filter is of the pattern `nnn`, `nnx`, or `nxx` where `n` is
a number and `x` is the wildcard for any number.
To filter all `5xx` responses, use the string `5xx`.
If multiple filters are used, then only one has to match.
The default value is no filters, with every request being printed.

Environment variable: `INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_x`

##### Examples

###### Setting access log status filters using configuration settings

`access-log-status-filter = ["4xx", "5xx"]`

`"4xx"` is in array position `0`
`"5xx"` is in array position `1`

###### Setting access log status filters using environment variables

The input values for the `access-log-status-filters` is an array.
When using environment variables, the values can be supplied as follows.

`INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_0=4xx`

`INFLUXDB_HTTP_ACCESS_LOG_STATUS_FILTERS_1=5xx`

The `_n` at the end of the environment variable represents the array position of the entry.

#### `write-tracing = false`

Enables detailed write logging.

Environment variable: `INFLUXDB_HTTP_WRITE_TRACING`

#### `pprof-enabled = true`

Determines whether the `/pprof` endpoint is enabled.  
This endpoint is used for troubleshooting and monitoring.

Environment variable: `INFLUXDB_HTTP_PPROF_ENABLED`

#### `https-enabled = false`

Enables HTTPS.

Environment variable: `INFLUXDB_HTTP_HTTPS_ENABLED`

#### `https-certificate = "/etc/ssl/influxdb.pem"`

The SSL certificate to use when HTTPS is enabled.  
The certificate should be a PEM-encoded bundle of the certificate and key.  
If it is just the certificate, a key must be specified in `https-private-key`.

Environment variable: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

#### `https-private-key = ""`

The location of the separate private key.

Environment variable: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

#### `shared-secret = ""`

The JWT authorization shared secret used to validate requests using JSON web tokens (JWTs).

Environment variable: `INFLUXDB_HTTP_SHARED_SECRET`

#### `max-row-limit = 0`

The default chunk size for result sets that should be chunked.
The maximum number of rows that can be returned in a non-chunked query.
The default setting of `0` allows for an unlimited number of rows.
InfluxDB includes a `"partial":true` tag in the response body if query results exceed the `max-row-limit` setting.

Environment variable: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

#### `max-connection-limit = 0`

The maximum number of HTTP connections that may be open at once.  
New connections that would exceed this limit are dropped.  
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

#### `unix-socket-enabled = false`

Enables the HTTP service over the UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_SOCKET_ENABLED`

#### `bind-socket = "/var/run/influxdb.sock"`

The path of the UNIX domain socket.

Environment variable: `INFLUXDB_HTTP_BIND_SOCKET`

#### `max-concurrent-write-limit = 0`

The maximum number of writes processed concurrently.
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_CONCURRENT_WRITE_LIMIT`

#### `max-enqueued-write-limit = 0`

The maximum number of writes queued for processing.
The default value of `0` disables the limit.

Environment variable: `INFLUXDB_HTTP_MAX_ENQUEUED_WRITE_LIMIT`

#### `enqueued-write-timeout = 0`

The maximum duration for a write to wait in the queue to be processed.
Setting this to `0` or setting `max-concurrent-write-limit` to `0` disables the limit.

-----

## Logging settings

### `[logging]`

#### `format = "logfmt"`

Determines which log encoder to use for logs.
Valid options are `auto`, `logfmt`, and `json`.
A setting of `auto` will use a more a more user-friendly output format if the output terminal is a TTY, but the format is not as easily machine-readable.
When the output is a non-TTY, `auto` will use `logfmt`.

#### `level = "info"`

Determines which level of logs will be emitted.

#### `suppress-logo = false`

Suppresses the logo output that is printed when the program is started.

-----

## Subscriber settings

### `[subscriber]`

Controls the subscriptions, which can be used to fork a copy of all data received by the InfluxDB host.

#### `enabled = true`

Determines whether the subscriber service is enabled.

Environment variable: `INFLUXDB_SUBSCRIBER_ENABLED`

#### `http-timeout = "30s"`

The default timeout for HTTP writes to subscribers.

Environment variable: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

#### `insecure-skip-verify = false`

Allows insecure HTTPS connections to subscribers.
This option is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_SUBSCRIBER_INSECURE_SKIP_VERIFY`

#### `ca-certs = ""`

The path to the PEM-encoded CA certs file.
If the set to the empty string (`""`), the default system certs will used.

Environment variable: `INFLUXDB_SUBSCRIBER_CA_CERTS`

#### `write-concurrency = 40`

The number of writer Goroutines processing the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_CONCURRENCY`

#### `write-buffer-size = 1000`

The number of in-flight writes buffered in the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_BUFFER_SIZE`

-----

## Graphite settings

### `[[graphite]]`

This section controls one or many listeners for Graphite data.
For more information, see [Graphite protocol support in InfluxDB](/influxdb/v1.7/supported_protocols/graphite/).

#### `enabled = false`

Determines whether the graphite endpoint is enabled.

These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

```toml
# database = "graphite"
# retention-policy = ""
# bind-address = ":2003"
# protocol = "tcp"
# consistency-level = "one"
```

#### `batch-size = 5000`

Flush if this many points get buffered.

#### `batch-pending = 10`

The number of batches that may be pending in memory.

#### `batch-timeout = "1s"`

Flush at least this often even if we haven't hit buffer limit.

#### `udp-read-buffer = 0`

UDP Read buffer size, `0` means OS default. UDP listener will fail if set above OS max.

#### `separator = "."`

This string joins multiple matching 'measurement' values providing more control over the final measurement name.

#### `tags = ["region=us-east", "zone=1c"]`

Default tags that will be added to all metrics.  
These can be overridden at the template level or by tags extracted from metric.

#### Templates pattern

```toml
# templates = [
#   "*.app env.service.resource.measurement",
#   # Default template
#   "server.*",
# ]
```

Each template line requires a template pattern.  
It can have an optional filter before the template and separated by spaces.  
It can also have optional extra tags following the template.  
Multiple tags should be separated by commas and no spaces similar to the line protocol format.  
There can be only one default template.

-----

## CollectD settings

The `[[collectd]]` settings control the listener for `collectd` data.
For more information, see [CollectD protocol support in InfluxDB](/influxdb/v1.7/supported_protocols/collectd/).

### `[[collectd]]`

```toml
# enabled = false
# bind-address = ":25826"
# database = "collectd"
# retention-policy = ""
# typesdb = "/usr/share/collectd/types.db"
```

#### `security-level = ""`

The collectd security level can be "" (or "none"), "sign", or "encrypt".

#### `auth-file = ""`

The path to the `collectd` authorization file.
Must be set if security level is sign or encrypt.


These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

#### `batch-size = 5000`

Flush if this many points get buffered.

#### `batch-pending = 10`

The number of batches that may be pending in memory.

#### `batch-timeout = "10s"`

Flush at least this often even if we haven't hit buffer limit.

#### `read-buffer = 0`

UDP Read buffer size, 0 means OS default. UDP listener will fail if set above OS max.

-----

## OpenTSDB settings

Controls the listener for OpenTSDB data.
For more information, see [OpenTSDB protocol support in InfluxDB](/influxdb/v1.7/supported_protocols/opentsdb/).

### `[[opentsdb]]`

```toml
# enabled = false
# bind-address = ":4242"
# database = "opentsdb"
# retention-policy = ""
# consistency-level = "one"
# tls-enabled = false
# certificate= "/etc/ssl/influxdb.pem"
```

#### `log-point-errors = true`

Log an error for every malformed point.

#### Settings for batching

These next lines control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Only points metrics received over the telnet protocol undergo batching.

#### `batch-size = 1000`

Flush if this many points get buffered.

#### `batch-pending = 5`

The number of batches that may be pending in memory.

#### `batch-timeout = "1s"`

Flush at least this often even if we haven't hit buffer limit.

-----

## UDP settings

The `[[udp]]` settings control the listeners for InfluxDB line protocol data using UDP.
For more information, see [UDP protocol support in InfluxDB](/influxdb/v1.7/supported_protocols/udp/).

### `[[udp]]`

```toml
# enabled = false
# bind-address = ":8089"
# database = "udp"
# retention-policy = ""
```

#### `precision = ""`

InfluxDB precision for timestamps on received points ("" or "n", "u", "ms", "s", "m", "h")

These next lines control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.

#### `batch-size = 5000`

Flush if this many points get buffered.

#### `batch-pending = 10`

The number of batches that may be pending in memory.

#### `batch-timeout = "1s"`

Will flush at least this often even if we haven't hit buffer limit.

#### `read-buffer = 0`

UDP Read buffer size, 0 means OS default. UDP listener will fail if set above OS max.

-----

## Continuous queries settings

### `[continuous_queries]`

Controls how continuous queries are run within InfluxDB.

#### `enabled = true`

Determines whether the continuous query service is enabled.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

#### `log-enabled = true`

Controls whether queries are logged when executed by the CQ service.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

#### `run-interval = "1s"`

The interval for how often continuous queries will be checked whether they need to run.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`

-----

## TLS settings


### `[tls]`

Global configuration settings for Transport Layer Security (TLS) in InfluxDB.  

If the TLS configuration settings is not specified, InfluxDB supports all of the cipher suite IDs listed and all TLS versions implemented in the [Constants section of the Go `crypto/tls` package documentation](https://golang.org/pkg/crypto/tls/#pkg-constants), depending on the version of Go used to build InfluxDB.
Use the `SHOW DIAGNOSTICS` command to see the version of Go used to build InfluxDB.

### Recommended server configuration for "modern compatibility"

InfluxData recommends configuring your InfluxDB server's TLS settings for "modern compatibility" that provides a higher level of security and assumes that backward compatibility is not required.
Our recommended TLS configuration settings for `ciphers`, `min-version`, and `max-version` are based on Mozilla's "modern compatibility" TLS server configuration described in [Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility).

InfluxData's recommended TLS settings for "modern compatibility" are specified in the following configuration settings example.

#### Recommended "modern compatibility" cipher settings

```toml
ciphers = [ "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
]

min-version = "tls1.2"

max-version = "tls1.2"

```

#### `min-version = "tls1.2"`

Minimum version of the TLS protocol that will be negotiated. Valid values include: `tls1.0`, `tls1.1`, and `tls1.2`. If not specified, `min-version` is the minimum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants). In this example, `tls1.0` specifies the minimum version as TLS 1.0, which is consistent with the behavior of previous InfluxDB releases.

Environment variable: `INFLUXDB_TLS_MIN_VERSION`

#### `max-version = "tls1.2"`

The maximum version of the TLS protocol that will be negotiated. Valid values include: `tls1.0`, `tls1.1`, and `tls1.2`. If not specified, `max-version` is the maximum TLS version specified in the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants). In this example, `tls1.2` specifies the maximum version as TLS 1.2, which is consistent with the behavior of previous InfluxDB releases.

Environment variable: `INFLUXDB_TLS_MAX_VERSION`

    <!-- #### max-fetch = 10

    The maximum number of shards that a single data node will copy or repair in parallel.

    Environment variable: `INFLUXDB_ANTI_ENTROPY_MAX_FETCH`

    > Having `max-fetch=10` with higher numbers of shards (100+) can add significant overhead to running nodes.
    > The more shards you have, the lower this should be set.
    > If AE is left enabled while lowering your `max-fetch`, you will initially see
    > higher CPU load as new shard digest files are created.
    > The added load will drop off after shard digests are completed for existing shards. -->
