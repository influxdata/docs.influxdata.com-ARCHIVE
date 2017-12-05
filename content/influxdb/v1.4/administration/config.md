---
title: Configuration
menu:
  influxdb_1_4:
    weight: 70
    parent: administration
---

The InfluxDB configuration file contains configuration settings specific to a local node.

#### Content

* [Using configuration files](#using-configuration-files)
    * [Configuration options overview](#configuration-options-overview)
    * [Environment variables](#environment-variables)
* [Configuration options by section](#configuration-options-by-section)
    * [Global options](#global-options)
        * [reporting-disabled](#reporting-disabled--false)
        * [bind-address](#bind-address--1270018088)
        * [GOMAXPROCS](#gomaxprocs)
    * [[meta]](#meta)
        * [dir](#dir--varlibinfluxdbmeta)
        * [retention-autocreate](#retention-autocreate--true)
        * [logging-enabled](#logging-enabled--true)
    * [[data]](#data)
        * [dir](#dir-varlibinfluxdbdata)
        * [index-version](#index-version--inmem)
        * [wal-dir](#wal-dir--varlibinfluxdbwal)
        * [wal-fsync-delay](#wal-fsync-delay--0s)
        * [trace-logging-enabled](#trace-logging-enabled--false)
        * [query-log-enabled](#query-log-enabled--true)
        * [cache-max-memory-size](#cache-max-memory-size--1073741824)
        * [cache-snapshot-memory-size](#cache-snapshot-memory-size--26214400)
        * [cache-snapshot-write-cold-duration](#cache-snapshot-write-cold-duration--10m)
        * [compact-full-write-cold-duration](#compact-full-write-cold-duration--4h)
        * [max-concurrent-compactions](#max-concurrent-compactions--0)
        * [max-series-per-database](#max-series-per-database--1000000)
        * [max-values-per-tag](#max-values-per-tag--100000)
    * [[coordinator]](#coordinator)
        * [write-timeout](#write-timeout--10s)
        * [max-concurrent-queries](#max-concurrent-queries--0)
        * [query-timeout](#query-timeout--0s)
        * [log-queries-after](#log-queries-after--0s)
        * [max-select-point](#max-select-point--0)
        * [max-select-series](#max-select-series--0)
        * [max-select-buckets](#max-select-buckets--0)
    * [[retention]](#retention)
        * [enabled](#enabled--true)
        * [check-interval](#check-interval--30m0s)
    * [[shard-precreation]](#shard-precreation)
        * [enabled](#enabled-true--1)
        * [check-interval](#check-interval--10m)
        * [advance-period](#advance-period--30m)
    * [[monitor]](#monitor)
        * [store-enabled](#store-enabled--true)
        * [store-database](#store-database--_internal)
        * [store-interval](#store-interval--10s)
    * [[admin]](#admin)
    * [[http]](#http)
        * [enabled](#enabled--true-2)
        * [bind-address](#bind-address--8086)
        * [auth-enabled](#auth-enabled--false)
        * [realm](#realm--influxdb)
        * [log-enabled](#log-enabled--true)
        * [write-tracing](#write-tracing--false)
        * [pprof-enabled](#pprof-enabled--true)
        * [https-enabled](#https-enabled-false)
        * [https-certificate](#https-certificate--etcsslinfluxdbpem)
        * [https-private-key](#https-private-key--)
        * [shared-secret](#shared-secret--)
        * [max-row-limit](#max-row-limit--0)
        * [max-connection-limit](#max-connection-limit--0)
        * [unix-socket-enabled](#unix-socket-enabled--false)
        * [bind-socket](#bind-socket--varruninfluxdbsock)
        * [max-body-size](#max-body-size--25000000)
    * [[subscriber]](#subscriber)
        * [enabled](#enabled--true-3)
        * [http-timeout](#http-timeout--30s)
        * [insecure-skip-verify](#insecure-skip-verify--false)
        * [ca-certs](#ca-certs--)
        * [write-concurrency](#write-concurrency--40)
        * [write-buffer-size](#write-buffer-size--1000)
    * [[[graphite]]](#graphite)
        * [enabled](#enabled--false)
        * [database](#database--graphite)
        * [retention-policy](#retention-policy--)
        * [bind-address](#bind-address--2003)
        * [protocol](#protocol--tcp)
        * [consistency-level](#consistency-level--one)
        * [batch-size](#batch-size--5000)
        * [batch-pending](#batch-pending--10)
        * [batch-timeout](#batch-timeout--1s)
        * [udp-read-buffer](#udp-read-buffer--0)
        * [separator](#separator--)
    * [[[collectd]]](#collectd)
        * [enabled](#enabled--false-1)
        * [bind-address](#bind-address--25826)
        * [database](#database--collectd)
        * [retention-policy](#retention-policy---1)
        * [typesdb](#typesdb--usrlocalsharecollectd)
        * [security-level](#security-level--none)
        * [auth-file](#auth-file--etccollectdauth_file)
        * [batch-size](#batch-size--5000-1)
        * [batch-pending](#batch-pending--10-1)
        * [batch-timeout](#batch-timeout--10s)
        * [read-buffer](#read-buffer--0)
        * [parse-multivalue-plugin](#parse-multivalue-plugin--split)
    * [[[opentsdb]]](#opentsdb)
        * [enabled](#enabled--false-2)
        * [bind-address](#bind-address--4242)
        * [database](#database--opentsdb)
        * [retention-policy](#retention-policy---2)
        * [consistency-level](#consistency-level--one-1)
        * [tls-enabled](#tls-enabled--false)
        * [certificate](#certificate--etcsslinfluxdbpem)
        * [log-point-errors](#log-point-errors--true)
        * [batch-size](#batch-size--1000)
        * [batch-pending](#batch-pending--5)
        * [batch-timeout](#batch-timeout--1s-1)
    * [[[udp]]](#udp)
        * [enabled](#enabled--false-3)
        * [bind-address](#bind-address--8089)
        * [database](#database--udp)
        * [retention-policy](#retention-policy---3)
        * [batch-size](#batch-size--5000-2)
        * [batch-pending](#batch-pending--10-2)
        * [batch-timeout](#batch-timeout--1s-2)
        * [read-buffer](#read-buffer--0-1)
        * [precision](#precision--)
     * [[continuous_queries]](#continuous-queries)
        * [enabled](#enabled--true-4)
        * [log-enabled](#log-enabled--true-1)
        * [query-stats-enabled](#query-stats-enabled--false)
        * [run-interval](#run-interval--1s)


## Using Configuration Files

The system has internal defaults for every configuration file setting.
View the default configuration settings with the `influxd config` command.

Most of the settings in the local configuration file
(`/etc/influxdb/influxdb.conf`) are commented out; all
commented-out settings will be determined by the internal defaults.
Any uncommented settings in the local configuration file override the
internal defaults.
Note that the local configuration file does not need to include every
configuration setting.

There are two ways to launch InfluxDB with your configuration file:

* Point the process to the correct configuration file by using the `-config`
option:

    ```bash
    influxd -config /etc/influxdb/influxdb.conf
    ```
* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
configuration file and start the process.
For example:

    ```
    echo $INFLUXDB_CONFIG_PATH
    /etc/influxdb/influxdb.conf

    influxd
    ```

InfluxDB first checks for the `-config` option and then for the environment
variable.

### Configuration Options Overview

Every configuration section has configuration options and every configuration option is optional.
If you do not uncomment a configuration option, the system uses its default setting.
The configuration options in this document are set to their default settings.

Configuration options that specify a duration support the following duration units:

`ns`&nbsp;&nbsp;&emsp;&emsp;&emsp;&nbsp;&thinsp;&thinsp;nanoseconds  
`us` or `µs`&emsp;microseconds  
`ms`&nbsp;&nbsp;&emsp;&emsp;&emsp;&nbsp;&thinsp;&thinsp;milliseconds  
`s`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;seconds  
`m`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;minutes  
`h`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;hours  
`d`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;days  
`w`&nbsp;&emsp;&emsp;&emsp;&emsp;&nbsp;weeks

>**Note:** This page documents configuration options for the latest official release - the [sample configuration file on GitHub](https://github.com/influxdb/influxdb/blob/master/etc/config.sample.toml) will always be slightly ahead of what is documented here.

### Environment Variables

All configuration options can be specified in the configuration file or in an
environment variable.
The environment variable overrides the equivalent option in the configuration
file.
If a configuration option is not specified in either the configuration file
or in an environment variable, InfluxDB uses its internal default
configuration.

In the sections below we name the relevant environment variable in the
description for the configuration setting.

> **Note:**
To set or override settings in a config section that allows multiple
configurations (any section with [[`double_brackets`]] in the header supports
multiple configurations), the desired configuration must be specified by ordinal
number.
For example, for the first set of `[[graphite]]` environment variables,
prefix the configuration setting name in the environment variable with the
relevant position number (in this case: `0`):
>
    INFLUXDB_GRAPHITE_0_BATCH_PENDING
    INFLUXDB_GRAPHITE_0_BATCH_SIZE
    INFLUXDB_GRAPHITE_0_BATCH_TIMEOUT
    INFLUXDB_GRAPHITE_0_BIND_ADDRESS
    INFLUXDB_GRAPHITE_0_CONSISTENCY_LEVEL
    INFLUXDB_GRAPHITE_0_DATABASE
    INFLUXDB_GRAPHITE_0_ENABLED
    INFLUXDB_GRAPHITE_0_PROTOCOL
    INFLUXDB_GRAPHITE_0_RETENTION_POLICY
    INFLUXDB_GRAPHITE_0_SEPARATOR
    INFLUXDB_GRAPHITE_0_TAGS
    INFLUXDB_GRAPHITE_0_TEMPLATES
    INFLUXDB_GRAPHITE_0_UDP_READ_BUFFER
>
For the Nth Graphite configuration in the configuration file, the relevant
environment variables would be of the form `INFLUXDB_GRAPHITE_(N-1)_BATCH_PENDING`.
For each section of the configuration file the numbering restarts at zero.

## Configuration Options by Section

## Global Options

### reporting-disabled = false

InfluxData, the company, relies on reported data from running nodes
primarily to track the adoption rates of different InfluxDB versions.
This data helps InfluxData support the continuing development of
InfluxDB.  

The `reporting-disabled` option toggles
the reporting of data every 24 hours to `usage.influxdata.com`.
Each report includes a randomly-generated identifier, OS, architecture,
InfluxDB version, and the
number of [databases](/influxdb/v1.4/concepts/glossary/#database),
[measurements](/influxdb/v1.4/concepts/glossary/#measurement), and
unique [series](/influxdb/v1.4/concepts/glossary/#series).  Setting
this option to `true` will disable reporting.

>**Note:** No data from user databases is ever transmitted.

Environment variable: `INFLUXDB_REPORTING_DISABLED`

### bind-address = "127.0.0.1:8088"

The bind address to use for the RPC service for [backup and restore](/influxdb/v1.4/administration/backup_and_restore/).

Environment variable: `INFLUXDB_BIND_ADDRESS`

### GOMAXPROCS

GOMAXPROCS is a GoLang setting.

The default value of GOMAXPROCS is the number of CPUs (whatever your operating system considers to be a CPU --
this could be the number of cores i.e. GOMAXPROCS=32 for a 32 core machine) visible to the program *at startup.*  
However, you can override this value to be less than the maxium value.  
This can be important in cases where you are running the database alongside other processes on the same machine and
want to ensure that the database doesn't completely starve those those processes.

Keep in mind that setting GOMAXPROCS=1 will eliminate all parallelization.  

Environment variable: `GOMAXPROCS`

## [meta]

This section controls parameters for InfluxDB's metastore,
which stores information on users, databases, retention policies, shards, and
continuous queries.

### dir = "/var/lib/influxdb/meta"

The `meta` directory.
Files in the `meta` directory include `meta.db`.

>**Note:** The default directory for OS X installations is `/Users/<username>/.influxdb/meta`

Environment variable: `INFLUXDB_META_DIR`

### retention-autocreate = true

Retention policy auto-creation automatically creates the [`DEFAULT` retention policy](/influxdb/v1.4/concepts/glossary/#retention-policy-rp) `autogen` when a database is created.
The retention policy `autogen` has an infinite duration and is also set as the
database's `DEFAULT` retention policy, which is used when a write or query does
not specify a retention policy.
Disable this setting to prevent the creation of this retention policy when creating databases.

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

### logging-enabled = true

Meta logging toggles the logging of messages from the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

## [data]

This section controls where the actual shard data for InfluxDB lives and how it is flushed from the WAL. `dir` may need to be changed to a suitable place for you system, but the WAL settings are an advanced configuration. The defaults should work for most systems.

### dir = "/var/lib/influxdb/data"

The directory where InfluxDB stores the data.
This directory may be changed.

>**Note:** The default directory for OS X installations is `/Users/<username>/.influxdb/data`

Environment variable: `INFLUXDB_DATA_DIR`

### index-version = "inmem"

The type of shard index to use for new shards.
The default is an in-memory index that is recreated at startup.
A value of `tsi1` will use a disk based index that supports higher cardinality datasets.

Environment variable: `INFLUXDB_DATA_INDEX_VERSION`

### wal-dir = "/var/lib/influxdb/wal"

The WAL directory is the location of the [write ahead log](/influxdb/v1.4/concepts/glossary/#wal-write-ahead-log).

Environment variable: `INFLUXDB_DATA_WAL_DIR`


### wal-fsync-delay = "0s"

The amount of time that a write waits before fsyncing. Use a duration greater than `0` to batch up multiple fsync calls.
This is useful for slower disks or when experiencing [WAL](/influxdb/v1.4/concepts/glossary/#wal-write-ahead-log) write contention.
A value of `0s` fsyncs every write to the WAL.
We recommend values in the range of `0ms`-`100ms` for non-SSD disks.

Environment variable: `INFLUXDB_DATA_WAL_FSYNC_DELAY`

### trace-logging-enabled = false

Toggles logging of additional debug information within the TSM engine and WAL.

Environment variable: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

### query-log-enabled = true

The query log enabled setting toggles the logging of parsed queries before execution.
Very useful for troubleshooting, but will log any sensitive data contained within a query.

Environment variable: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

### cache-max-memory-size = 1073741824

The cache maximum memory size is the maximum size (in bytes) a shard's cache can reach before it starts rejecting writes.

Environment variable: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

### cache-snapshot-memory-size = 26214400

The cache snapshot memory size is the size at which the engine will snapshot the cache and write it to a TSM file, freeing up memory.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

### cache-snapshot-write-cold-duration = "10m"

The cache snapshot write cold duration is the length of time at which the engine will snapshot the cache and write it to a new TSM file if the shard hasn't received writes or deletes.

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

### compact-full-write-cold-duration = "4h"

The compact full write cold duration is the duration at which the engine will compact all TSM files in a shard if it hasn't received a write or delete.

Environment variable: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

### max-concurrent-compactions = 0

The maximum number of concurrent full and level [compactions](/influxdb/v1.4/concepts/storage_engine/#compactions) that can run at one time.  
A value of 0 results in runtime.GOMAXPROCS(0) used at runtime -- which means use all processors.  
This setting does not apply to cache snapshotting.

Environment variable: `INFLUXDB_DATA_MAX_CONCURRENT_COMPACTIONS`

### max-series-per-database = 1000000

The maximum number of [series](/influxdb/v1.4/concepts/glossary/#series) allowed
per database.
The default setting is one million.
Change the setting to `0` to allow an unlimited number of series per database.

If a point causes the number of series in a database to exceed
`max-series-per-database` InfluxDB will not write the point, and it returns a
`500` with the following error:

```
{"error":"max series per database exceeded: <series>"}
```

> **Note:** Any existing databases with a series count that exceeds `max-series-per-database`
will continue to accept writes to existing series, but writes that create a
new series will fail.

Environment variable: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

### max-values-per-tag = 100000

The maximum number of [tag values](/influxdb/v1.4/concepts/glossary/#tag-values)
allowed per [tag key]((/influxdb/v1.4/concepts/glossary/#tag-key).
The default setting is `100000`.
Change the setting to `0` to allow an unlimited number of tag values per tag
key.
If a tag value causes the number of tag values of a tag key to exceed
`max-values-per-tag` InfluxDB will not write the point, and it returns
a `partial write` error.

Any existing tag keys with tag values that exceed `max-values-per-tag`
will continue to accept writes, but writes that create a new tag value
will fail.

Environment variable: `INFLUXDB_DATA_MAX_VALUES_PER_TAG`

## [coordinator]

This section contains configuration options for query management.
For more on managing queries, see [Query Management](/influxdb/v1.4/troubleshooting/query_management/).

### write-timeout = "10s"

The time within which a write request must complete on the cluster.

Environment variable: `INFLUXDB_COORDINATOR_WRITE_TIMEOUT`

### max-concurrent-queries = 0

The maximum number of running queries allowed on your instance.
The default setting (`0`) allows for an unlimited number of queries.

Environment variable: `INFLUXDB_COORDINATOR_MAX_CONCURRENT_QUERIES`

### query-timeout = "0s"

The maximum time for which a query can run on your instance before InfluxDB
kills the query.
The default setting (`0`) allows queries to run with no time restrictions.
This setting is a [duration](#configuration-options).

Environment variable: `INFLUXDB_COORDINATOR_QUERY_TIMEOUT`

### log-queries-after = "0s"

The maximum time a query can run after which InfluxDB logs the query with a
`Detected slow query` message.
The default setting (`"0"`) will never tell InfluxDB to log the query.
This setting is a
[duration](#configuration-options).

Environment variable: `INFLUXDB_COORDINATOR_LOG_QUERIES_AFTER`

### max-select-point = 0

The maximum number of [points](/influxdb/v1.4/concepts/glossary/#point) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of points.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_POINT`

### max-select-series = 0

The maximum number of [series](/influxdb/v1.4/concepts/glossary/#series) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of series.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_SERIES`

### max-select-buckets = 0

The maximum number of `GROUP BY time()` buckets that a query can process.
The default setting (`0`) allows a query to process an unlimited number of
buckets.

Environment variable: `INFLUXDB_COORDINATOR_MAX_SELECT_BUCKETS`

## [retention]

This section controls the enforcement of retention policies for evicting old data.

### enabled = true

Set to `false` to prevent InfluxDB from enforcing retention policies.

Environment variable: `INFLUXDB_RETENTION_ENABLED`

### check-interval = "30m0s"

The rate at which InfluxDB checks to enforce a retention policy.

Environment variable: `INFLUXDB_RETENTION_CHECK_INTERVAL`

## [shard-precreation]

Controls the precreation of shards so that shards are available before data arrive.
Only shards that, after creation, will have both a start- and end-time in the future are ever created.
Shards that would be wholly or partially in the past are never precreated.

### enabled = true

Environment variable: `INFLUXDB_SHARD_PRECREATION_ENABLED`

### check-interval = "10m"

Environment variable: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

### advance-period = "30m"

The maximum period in the future for which InfluxDB precreates shards.
The `30m` default should work for most systems.
Increasing this setting too far in the future can cause inefficiencies.

Environment variable: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

## [monitor]

This section controls InfluxDB's [system self-monitoring](https://github.com/influxdb/influxdb/blob/master/monitor/README.md).

By default, InfluxDB writes the data to the `_internal` database.
If that database does not exist, InfluxDB creates it automatically.
The `DEFAULT` retention policy on the `_internal` database is seven days.
If you want to use a retention policy other than the seven-day retention policy, you must [create](/influxdb/v1.4/query_language/database_management/#retention-policy-management) it.

### store-enabled = true

Set to `false` to disable recording statistics internally.
If set to `false` it will make it substantially more difficult to diagnose issues with your installation.

Environment variable: `INFLUXDB_MONITOR_STORE_ENABLED`

### store-database = "\_internal"

The destination database for recorded statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_DATABASE`

### store-interval = "10s"

The interval at which InfluxDB records statistics.

Environment variable: `INFLUXDB_MONITOR_STORE_INTERVAL`

## [admin]

<dt> Starting with version 1.3, the web admin interface is no longer available in InfluxDB.
The interface does not run on port `8083` and InfluxDB ignores the `[admin]` section in the configuration file if that section is present.
[Chronograf](/chronograf/latest/) replaces the web admin interface with improved tooling for querying data, writing data, and database management.
See [Chronograf's transition guide](/chronograf/latest/guides/transition-web-admin-interface/) for more information.
</dt>

## [http]

This section controls how InfluxDB configures the HTTP endpoints.
These are the primary mechanisms for getting data into and out of InfluxDB.
Edit the options in this section to enable HTTPS and authentication.
See [Authentication and Authorization](/influxdb/v1.4/query_language/authentication_and_authorization/).

### enabled = true

Set to `false` to disable HTTP.
Note that the InfluxDB [command line interface (CLI)](/influxdb/v1.4/tools/shell/) connects to the database using the HTTP API.

Environment variable: `INFLUXDB_HTTP_ENABLED`

### bind-address = ":8086"

The port used by the HTTP API.

Environment variable: `INFLUXDB_HTTP_BIND_ADDRESS`

### auth-enabled = false

Set to `true` to require authentication.

Environment variable: `INFLUXDB_HTTP_AUTH_ENABLED`

### realm = "InfluxDB"

Realm is the JWT realm used by the http endpoint.

Environment variable: `INFLUXDB_HTTP_REALM`

### log-enabled = true

Set to `false` to disable logging.

Environment variable: `INFLUXDB_HTTP_LOG_ENABLED`

### write-tracing = false

Set to `true` to enable logging for the write payload.
If set to `true`, this will duplicate every write statement in the logs and is thus not recommended for general use.

Environment variable: `INFLUXDB_HTTP_WRITE_TRACING`

### pprof-enabled = true

Determines whether the pprof endpoint is enabled.  This endpoint is used for
troubleshooting and monitoring.

Environment variable: `INFLUXDB_HTTP_PPROF_ENABLED`

### https-enabled = false

Set to `true` to enable HTTPS.

Environment variable: `INFLUXDB_HTTP_HTTPS_ENABLED`

### https-certificate = "/etc/ssl/influxdb.pem"

The path of the certificate file.

Environment variable: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

### https-private-key = ""

The separate private key location.
If only the `https-certificate` is specified, the httpd service will try to load
the private key from the `https-certificate` file.
If a separate `https-private-key` file is specified, the httpd service will load
the private key from the `https-private-key` file.

Environment variable: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

### shared-secret = ""

The shared secret used for JWT signing.

Environment variable: `INFLUXDB_HTTP_SHARED_SECRET`

### max-row-limit = 0

Limits the number of rows that the system can return in a [non-chunked](/influxdb/v1.4/tools/api/#query-string-parameters) query.
The default setting (`0`) allows for an unlimited number of rows.
InfluxDB includes a `"partial":true` tag in the response body if query results exceed the `max-row-limit` setting.

Environment variable: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

### max-connection-limit = 0

Limit the number of connections for the http service.  0 is unlimited.

Environment variable: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

### unix-socket-enabled = false

Set to `true` to enable http service over unix domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_SOCKET_ENABLED`

### bind-socket = "/var/run/influxdb.sock"

The path of the unix domain socket.

Environment variable: `INFLUXDB_HTTP_UNIX_BIND_SOCKET`

### max-body-size = 25000000

Specifies the maximum size (in bytes) of a client request body. When a client sends data that exceeds the configured
maximum size, a 413 Request Entity Too Large HTTP response is returned. This can be disabled by setting it to 0.

Environment variable: `INFLUXDB_HTTP_MAX_BODY_SIZE`

## [subscriber]

This section controls how [Kapacitor](/kapacitor/v1.4/) will receive data.

### enabled = true

Set to `false` to disable the subscriber service.

Environment variable: `INFLUXDB_SUBSCRIBER_ENABLED`

### http-timeout = "30s"

Controls how long an http request for the subscriber service will run before it times out.

Environment variable: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

### insecure-skip-verify = false

Allows insecure HTTPS connections to subscribers.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_SUBSCRIBER_INSECURE_SKIP_VERIFY`

### ca-certs = ""

The path to the PEM encoded CA certs file.
If the empty string, the default system certs will be used.

Environment variable: `INFLUXDB_SUBSCRIBER_CA_CERTS`

### write-concurrency = 40

The number of writer goroutines processing the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_CONCURRENCY`

### write-buffer-size = 1000

The number of in-flight writes buffered in the write channel.

Environment variable: `INFLUXDB_SUBSCRIBER_WRITE_BUFFER_SIZE`

## [[graphite]]

This section controls one or many listeners for Graphite data.
See the [README](https://github.com/influxdb/influxdb/blob/master/services/graphite/README.md) on GitHub for more information.

### enabled = false

Set to `true` to enable Graphite input.

Environment variable: `INFLUXDB_GRAPHITE_0_ENABLED`

### database = "graphite"

The name of the database that you want to write to.

Environment variable: `INFLUXDB_GRAPHITE_0_DATABASE`

### retention-policy = ""

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_GRAPHITE_0_RETENTION_POLICY`

### bind-address = ":2003"

The default port.

Environment variable: `INFLUXDB_GRAPHITE_0_BIND_ADDRESS`

### protocol = "tcp"

Set to `tcp` or `udp`.

Environment variable: `INFLUXDB_GRAPHITE_PROTOCOL`

### consistency-level = "one"

The number of nodes that must confirm the write.
If the requirement is not met the return value will be either `partial write` if some points in the batch fail or `write failure` if all points in the batch fail.
For more information, see the Query String Parameters for Writes section in the [Line Protocol Syntax Reference ](/influxdb/v1.4/write_protocols/write_syntax/).

Environment variable: `INFLUXDB_GRAPHITE_CONSISTENCY_LEVEL`

*The next three options control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### batch-size = 5000

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_SIZE`

### batch-pending = 10

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_PENDING`

### batch-timeout = "1s"

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_GRAPHITE_BATCH_TIMEOUT`

### udp-read-buffer = 0

UDP Read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_GRAPHITE_UDP_READ_BUFFER`

### separator = "."

This string joins multiple matching 'measurement' values providing more control over the final measurement name.

Environment variable: `INFLUXDB_GRAPHITE_SEPARATOR`

## [[collectd]]

This section controls the listener for collectd data. See the
[README](https://github.com/influxdata/influxdb/tree/master/services/collectd)
on Github for more information.

### enabled = false

Set to `true` to enable collectd writes.

Environment variable: `INFLUXDB_COLLECTD_ENABLED`

### bind-address = ":25826"

The port.

Environment variable: `INFLUXDB_COLLECTD_BIND_ADDRESS`

### database = "collectd"

The name of the database that you want to write to.
This defaults to `collectd`.

Environment variable: `INFLUXDB_COLLECTD_DATABASE`

### retention-policy = ""

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_COLLECTD_RETENTION_POLICY`

### typesdb = "/usr/local/share/collectd"

The collectd service supports either scanning a directory for multiple types
db files, or specifying a single db file.
A sample `types.db` file
can be found
[here](https://github.com/collectd/collectd/blob/master/src/types.db).

Environment variable: `INFLUXDB_COLLECTD_TYPESDB`

### security-level = "none"

Environment variable: `INFLUXDB_COLLECTD_SECURITY_LEVEL`

### auth-file = "/etc/collectd/auth_file"

Environment variable: `INFLUXDB_COLLECTD_AUTH_FILE`

*The next three options control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### batch-size = 5000

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_COLLECTD_BATCH_SIZE`

### batch-pending = 10

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_COLLECTD_BATCH_PENDING`

### batch-timeout = "10s"

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_COLLECTD_BATCH_TIMEOUT`

### read-buffer = 0

UDP Read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_COLLECTD_READ_BUFFER`

### parse-multivalue-plugin = "split"

When set to `split`, multi-value plugin data (e.g. df free:5000,used:1000) will be split into separate measurements (e.g., (df_free, value=5000) (df_used, value=1000)).  When set to `join`, multi-value plugin will be stored as a single multi-value measurement (e.g., (df, free=5000,used=1000)). Defaults to `split`.

## [[opentsdb]]

Controls the listener for OpenTSDB data.
See the [README](https://github.com/influxdb/influxdb/blob/master/services/opentsdb/README.md) on GitHub for more information.

### enabled = false

Set to `true` to enable openTSDB writes.

Environment variable: `INFLUXDB_OPENTSDB_0_ENABLED`

### bind-address = ":4242"

The default port.

Environment variable: `INFLUXDB_OPENTSDB_BIND_ADDRESS`

### database = "opentsdb"

The name of the database that you want to write to.
If the database does not exist, it will be created automatically when the input is initialized.

Environment variable: `INFLUXDB_OPENTSDB_DATABASE`

### retention-policy = ""

The relevant retention policy.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_OPENTSDB_RETENTION_POLICY`

### consistency-level = "one"

Sets the write consistency level: `any`, `one`, `quorum`, or `all` for writes.

Environment variable: `INFLUXDB_OPENTSDB_CONSISTENCY_LEVEL`

### tls-enabled = false

Environment variable: `INFLUXDB_OPENTSDB_TLS_ENABLED`

### certificate = "/etc/ssl/influxdb.pem"

Environment variable: `INFLUXDB_OPENTSDB_CERTIFICATE`

### log-point-errors = true

Log an error for every malformed point.

Environment variable: `INFLUXDB_OPENTSDB_0_LOG_POINT_ERRORS`

*The next three options control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Only points metrics received over the telnet protocol undergo batching.*

### batch-size = 1000

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_SIZE`

### batch-pending = 5

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_PENDING`

### batch-timeout = "1s"

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_OPENTSDB_BATCH_TIMEOUT`

## [[udp]]

This section controls the listeners for InfluxDB line protocol data via UDP.
See the [UDP page](/influxdb/v1.4/write_protocols/udp/) for more information.

### enabled = false

Set to `true` to enable writes over UDP.

Environment variable: `INFLUXDB_UDP_ENABLED`

### bind-address = ":8089"

An empty string is equivalent to `0.0.0.0`.

Environment variable: `INFLUXDB_UDP_BIND_ADDRESS`

### database = "udp"

The name of the database that you want to write to.

Environment variable: `INFLUXDB_UDP_DATABASE`

### retention-policy = ""

The relevant retention policy for your data.
An empty string is equivalent to the database's `DEFAULT` retention policy.

Environment variable: `INFLUXDB_UDP_RETENTION_POLICY`

*The next three options control how batching works.
You should have this enabled otherwise you could get dropped metrics or poor performance.
Batching will buffer points in memory if you have many coming in.*

### batch-size = 5000

The input will flush if this many points get buffered.

Environment variable: `INFLUXDB_UDP_0_BATCH_SIZE`

### batch-pending = 10

The number of batches that may be pending in memory.

Environment variable: `INFLUXDB_UDP_0_BATCH_PENDING`

### batch-timeout = "1s"

The input will flush at least this often even if it hasn't reached the configured batch-size.

Environment variable: `INFLUXDB_UDP_BATCH_TIMEOUT`

### read-buffer = 0

UDP read buffer size, 0 means OS default.
UDP listener will fail if set above OS max.

Environment variable: `INFLUXDB_UDP_BATCH_SIZE`

### precision = ""

[Time precision](/influxdb/v1.4/query_language/spec/#durations) used when decoding time values.  Defaults to `nanoseconds` which is the default of the database.

Environment variable: `INFLUXDB_UDP_PRECISION`

## [continuous_queries]

This section controls how [continuous queries (CQs)](/influxdb/v1.4/concepts/glossary/#continuous-query-cq) run within InfluxDB.
CQs are automated batches of queries that execute over recent time intervals.
InfluxDB executes one auto-generated query per `GROUP BY time()` interval.

### enabled = true

Set to `false` to disable CQs.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

### log-enabled = true

Set to `false` to disable logging for CQ events.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

### query-stats-enabled = false.

When set to true, continuous query execution statistics are written to the default monitor store.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_QUERY_STATS_ENABLED`

### run-interval = "1s"

The interval at which InfluxDB checks to see if a CQ needs to run. Set this option to the lowest interval at which your CQs run. For example, if your most frequent CQ runs every minute, set `run-interval` to `1m`.

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`
