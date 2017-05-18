---
title: Configuration
menu:
  enterprise_influxdb_1_0:
    weight: 20
    parent: Administration
---

<table style="width:100%">
  <tr>
    <td><a href="#using-configuration-files">Using Configuration Files</a></td>
    <td><a href="#meta-node-configuration">Meta Node Configuration File</a></td>
    <td><a href="#data-node-configuration">Data Node Configuration File</a></td>
    <td><a href="#web-console-configuration">Web Console Configuration File</a></td>
  </tr>
</table>
<br>
# Using Configuration Files

#### Print a default configuration file

The following commands print out a TOML-formatted configuration with all
available options set to their default values.

Meta configuration:
```
influxd-meta config
```

Data configuration:
```
influxd config
```

#### Create a configuration file

On POSIX systems, generate a new configuration file by redirecting the output
of the command to a file.

New meta configuration file:
```
influxd-meta config > /etc/influxdb/influxdb-meta-generated.conf
```

New data configuration file:
```
influxd config > /etc/influxdb/influxdb-generated.conf
```

Preserve custom settings from older configuration files when generating a new
configuration file with the `-config` option.
For example, this overwrites any default configuration settings in the output
file (`/etc/influxdb/influxdb.conf.new`) with the configuration settings from
the file (`/etc/influxdb/influxdb.conf.old`) passed to `-config`:

```
influxd config -config /etc/influxdb/influxdb.conf.old > /etc/influxdb/influxdb.conf.new
```

#### Launch the process with a configuration file

There are two ways to launch the meta or data processes using your customized
configuration file.

* Point the process to the desired configuration file with the `-config` option.

    To start the meta node process with `/etc/influxdb/influxdb-meta-generate.conf`:

        influxd-meta -config /etc/influxdb/influxdb-meta-generate.conf

    To start the data node process with `/etc/influxdb/influxdb-generated.conf`:

        influxd -config /etc/influxdb/influxdb-generated.conf


* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
configuration file and start the process.

    To set the `INFLUXDB_CONFIG_PATH` environment variable and launch the data
    process using `INFLUXDB_CONFIG_PATH` for the configuration file path:

        export INFLUXDB_CONFIG_PATH=/root/influxdb.generated.conf
        echo $INFLUXDB_CONFIG_PATH
        /root/influxdb.generated.conf
        influxd

If set, the command line `-config` path overrides any environment variable path.
If you do not supply a configuration file, InfluxDB uses an internal default
configuration (equivalent to the output of `influxd config` and `influxd-meta
config`).

### Environment variables

All configuration options can be specified in the configuration file or in an
environment variable.
The environment variable overrides the equivalent option in the configuration
file.
If a configuration option is not specified in either the configuration file
or in an environment variable, InfluxDB uses its internal default
configuration.

In the sections below we name the relevant environment variable in the
description for the configuration setting.
Environment variables can be set in `/etc/default/influxdb-meta` and
`/etc/default/influxdb`.

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

<br>
<br>
# Meta Node Configuration

## Global options

### reporting-disabled = false

InfluxData, the company, relies on reported data from running nodes primarily to
track the adoption rates of different InfluxDB versions.
These data help InfluxData support the continuing development of InfluxDB.

The `reporting-disabled` option toggles the reporting of data every 24 hours to
`usage.influxdata.com`.
Each report includes a randomly-generated identifier, OS, architecture,
InfluxDB version, and the number of databases, measurements, and unique series.
Setting this option to `true` will disable reporting.

> **Note:** No data from user databases are ever transmitted.

### bind-address = ""
This setting is not intended for use.
It will be removed in future versions.

### hostname = ""

The hostname of the [meta node](/enterprise_influxdb/v1.0/concepts/glossary/#meta-node).
This must be resolvable and reachable by all other members of the cluster.

## [enterprise]

The `[enterprise]` section contains the parameters for the meta node's
registration with the InfluxEnterprise Web Console and the
[InfluxEnterprise License Portal](https://portal.influxdata.com/).

###  registration-enabled = true

Set to `true` to enable registration with the InfluxEnterprise web console.
All meta nodes must have `registration-enabled` set to `true` for the
InfluxEnterprise Web Console to function properly.

Environment variable: `INFLUXDB_ENTERPRISE_REGISTRATION_ENABLED`

###  registration-server-url = "http://IP_or_hostname:3000"

The full URL of the server that runs the InfluxEnterprise web console.
All meta nodes must have `registration-server-url` set to the full protocol,
hostname, and port for the InfluxEnterprise Web Console to function properly.

Environment variable: `INFLUXDB_ENTERPRISE_REGISTRATION_SERVER_URL`

###  license-key = ""

The license key that you created on [InfluxPortal](https://portal.influxdata.com).
The meta node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
The server caches the license file locally.
You must use the [`license-path` setting](#license-path) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

###  license-path = ""

The local path to the permanent JSON license file that you received from InfluxData.
Permanent license files are not available for subscribers on a monthly plan.
If you are a monthly subscriber, your cluster must use the `license-key` setting.
Contact [sales@influxdb.com](mailto:sales@influxdb.com) to become an annual subscriber.

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

## [meta]

###  dir = "/var/lib/influxdb/meta"

The location of the meta directory which stores the [metastore](/influxdb/v1.0/concepts/glossary/#metastore).

Environment variable: `INFLUXDB_META_DIR`

###  bind-address = ":8089"

The bind address/port for meta node communication.
For simplicity we recommend using the same port on all meta nodes, but this
is not necessary.

Environment variable: `INFLUXDB_META_BIND_ADDRESS`

###  http-bind-address = ":8091"

The port used by the [`influxd-ctl` tool](/enterprise_influxdb/v1.0/features/cluster-commands/) and by data nodes to access the
meta APIs.
For simplicity we recommend using the same port on all meta nodes, but this
is not necessary.

Environment variable: `INFLUXDB_META_HTTP_BIND_ADDRESS`

###  https-enabled = false

Set to `true` to if using HTTPS over the `8091` API port.
Currently, the `8089` and `8088` ports do not support TLS.

Environment variable: `INFLUXDB_META_HTTPS_ENABLED`

###  https-certificate = ""

The path of the certificate file.
This is required if [`https-enabled`](#https-enabled-false) is set to `true`.

Environment variable: `INFLUXDB_META_HTTPS_CERTIFICATE`

###  gossip-frequency = "5s"

The frequency at which meta nodes communicate the cluster membership state.

Environment variable: `INFLUXDB_META_GOSSIP_FREQUENCY`

###  announcement-expiration = "30s"

The rate at which the results of `influxd-ctl show` are updated when a meta
node leaves the cluster.
Note that in version 1.0, configuring this setting provides no change from the
user's perspective.

Environment variable: `INFLUXDB_META_ANNOUNCEMENT_EXPIRATION`

###  retention-autocreate = true

Set to `false` to disable the automatic creation of an `autogen` [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp) for new databases.

If set to `true`, InfluxDB automatically creates a `DEFAULT` retention policy
when a database is created.
That retention policy is called `autogen`, has an infinite
[duration](/influxdb/v1.0/concepts/glossary/#duration), a one week [shard duration](/influxdb/v1.0/concepts/glossary/#shard-duration), and a
[replication factor](/influxdb/v1.0/concepts/glossary/#replication-factor) set
to the number of nodes in the cluster.
If set to `false`, you must explicitly create a `DEFAULT` retention policy on every new database before that database can accept any writes.

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

###  election-timeout = "1s"

The duration a Raft candidate spends in the candidate state without a leader
before it starts an election.
The election timeout is slightly randomized on each Raft node each time it is called.
An additional jitter is added to the `election-timeout` duration of between zero and the `election-timeout`.
The default setting should work for most systems.

Environment variable: `INFLUXDB_META_ELECTION_TIMEOUT`

###  heartbeat-timeout = "1s"

The heartbeat timeout is the amount of time a Raft follower remains in the
follower state without a leader before it starts an election.
Clusters with high latency between nodes may want to increase this parameter to
avoid unnecessary Raft elections.

Environment variable: `INFLUXDB_META_HEARTBEAT_TIMEOUT`

###  leader-lease-timeout = "500ms"

The leader lease timeout is the amount of time a Raft leader will remain leader
if it does not hear from a majority of nodes.
After the timeout the leader steps down to the follower state.
Clusters with high latency between nodes may want to increase this parameter to
avoid unnecessary Raft elections.

Environment variable: `INFLUXDB_META_LEADER_LEASE_TIMEOUT`

###  commit-timeout = "50ms"

The commit timeout is the amount of time a Raft node will tolerate between
commands before issuing a heartbeat to tell the leader it is alive.
The default setting should work for most systems.

Environment variable: `INFLUXDB_META_COMMIT_TIMEOUT`

###  cluster-tracing = false

Cluster tracing toggles the logging of Raft logs on Raft nodes.
Enable this setting when debugging Raft consensus issues.

Environment variable: `INFLUXDB_META_CLUSTER_TRACING`

###  logging-enabled = true

Meta logging toggles the logging of messages from the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

###  pprof-enabled = false

Set to `true` to enable the `/debug/pprof` endpoint for troubleshooting.

Environment variable: `INFLUXDB_META_PPROF_ENABLED`

###  lease-duration = "1m0s"

The default duration of the leases that data nodes acquire from the meta nodes.
Leases automatically expire after the `lease-duration` is met.

Leases ensure that only one data node is running something at a given time.
For example, [Continuous Queries](/influxdb/v1.0/concepts/glossary/#continuous-query-cq)
(CQ) use a lease so that all data nodes aren't running the same CQs at once.

Environment variable: `INFLUXDB_META_LEASE_DURATION`

<br>
<br>
# Data Node Configuration

The InfluxEnterprise data node configuration settings overlap significantly
with the settings in InfluxDB's Open Source Software (OSS).
Where possible, the following sections link to the [configuration documentation](/influxdb/v1.0/administration/config/)
for InfluxDB's OSS.

> **Note:**
The system has internal defaults for every configuration file setting.
View the default settings with the `influxd config` command.
The local configuration file (`/etc/influxdb/influxdb.conf`) overrides any
internal defaults but the configuration file does not need to include
every configuration setting.
Starting with version 1.0.1, most of the settings in the local configuration
file are commented out.
All commented-out settings will be determined by the internal defaults.

## Global options

### reporting-disabled = false

See the [OSS documentation](/influxdb/v1.0/administration/config/#reporting-disabled-false).

### bind-address = ":8088"

See the [OSS documentation](/influxdb/v1.0/administration/config/#bind-address-8088).

### hostname = "localhost"

The hostname of the [data node](/enterprise_influxdb/v1.0/concepts/glossary/#data-node).

## [enterprise]

Controls the parameters for the data node's registration with the web console
and [https://portal.influxdata.com](https://portal.influxdata.com).

### registration-enabled = false

This setting is not intended for use in the data node configuration file.
It will be removed in future versions.

Environment variable: `INFLUXDB_ENTERPRISE_REGISTRATION_ENABLED`

### registration-server-url = "http://IP_or_hostname:3000"

This setting is not intended for use in the data node configuration file.
It will be removed in future versions.

Environment variable: `INFLUXDB_ENTERPRISE_REGISTRATION_SERVER_URL`

### license-key = ""

The license key that you created on [InfluxPortal](https://portal.influxdata.com).
The data node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
The server caches the license file locally.
The data process will only function for a limited time without a valid license file.
You must use the [`license-path` setting](#license-path-1) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

### license-path = ""

The local path to the permanent JSON license file that you received from InfluxData.
The data process will only function for a limited time without a valid license file.
Permanent license files are not available for subscribers on a monthly plan.
If you are a monthly subscriber, your cluster must use the `license-key` setting.
Contact [sales@influxdb.com](mailto:sales@influxdb.com) to become an annual subscriber.

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

## [meta]

See the [OSS documentation](/influxdb/v1.0/administration/config/#meta).

###  dir = "/var/lib/influxdb/meta"

See the [OSS documentation](/influxdb/v1.0/administration/config/#dir-var-lib-influxdb-meta).
Note that data nodes do require a local meta directory.

Environment variable: `INFLUXDB_META_DIR`

###  meta-tls-enabled = false

Set to `true` to if [`https-enabled`](#https-enabled-false) is set to `true`.

Environment variable: `INFLUXDB_META_META_TLS_ENABLED`

###  meta-insecure-tls = false

Set to `true` to allow the data node to accept self-signed certificates if
[`https-enabled`](#https-enabled-false) is set to `true`.

Environment variable: `INFLUXDB_META_META_INSECURE_TLS`

###  retention-autocreate = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#retention-autocreate-true).

Environment variable: `INFLUXDB_META_RETENTION_AUTOCREATE`

###  logging-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#logging-enabled-true).

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

## [data]

See the [OSS documentation](/influxdb/v1.0/administration/config/#data).

###  dir = "/var/lib/influxdb/data"

See the [OSS documentation](/influxdb/v1.0/administration/config/#dir-var-lib-influxdb-data).

Environment variable: `INFLUXDB_DATA_DIR`

###  wal-dir = "/var/lib/influxdb/wal"

See the [OSS documentation](/influxdb/v1.0/administration/config/#wal-dir-var-lib-influxdb-wal).

Environment variable: `INFLUXDB_DATA_WAL_DIR`

###  wal-logging-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#wal-logging-enabled-true).

Environment variable: `INFLUXDB_DATA_WAL_LOGGING_ENABLED`

###  query-log-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#query-log-enabled-true).

Environment variable: `INFLUXDB_DATA_QUERY_LOG_ENABLED`

###  cache-max-memory-size = 524288000

See the [OSS documentation](/influxdb/v1.0/administration/config/#cache-max-memory-size-524288000).

Environment variable: `INFLUXDB_DATA_CACHE_MAX_MEMORY_SIZE`

###  cache-snapshot-memory-size = 26214400

See the [OSS documentation](/influxdb/v1.0/administration/config/#cache-snapshot-memory-size-26214400).

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_MEMORY_SIZE`

###  cache-snapshot-write-cold-duration = "1h0m0s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#cache-snapshot-write-cold-duration-1h0m0s).

Environment variable: `INFLUXDB_DATA_CACHE_SNAPSHOT_WRITE_COLD_DURATION`

###  compact-full-write-cold-duration = "24h0m0s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#compact-full-write-cold-duration-24h0m0s).

Environment variable: `INFLUXDB_DATA_COMPACT_FULL_WRITE_COLD_DURATION`

###  max-series-per-database = 1000000

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-series-per-database-1000000).

Environment variable: `INFLUXDB_DATA_MAX_SERIES_PER_DATABASE`

###  trace-logging-enabled = false

See the [OSS documentation](/influxdb/v1.0/administration/config/#trace-logging-enabled-false).

Environment variable: `INFLUXDB_DATA_TRACE_LOGGING_ENABLED`

## [cluster]

Controls how data are shared across shards and the options for [query
management](/influxdb/v1.0/troubleshooting/query_management/).

###  dial-timeout = "1s"

The duration for which the meta node waits for a connection to a remote data
node before the meta node attempts to connect to a different remote data node.
This setting applies to queries only.

Environment variable: `INFLUXDB_CLUSTER_DIAL_TIMEOUT`

###  shard-writer-timeout = "5s"

The time in which a remote write to a single data node must complete after which
the system returns a timeout error.

For clusters with contention, increasing `shard-writer-timeout` may reduce
points sent via the
[hinted handoff](/enterprise_influxdb/v1.0/concepts/clustering/#hinted-handoff), but
increasing this setting also raises the time it takes for a receiving node to
respond to a write client.

Environment variable: `INFLUXDB_CLUSTER_SHARD_WRITER_TIMEOUT`

###  shard-reader-timeout = "0"

The time in which a query connection must return its response after which the
system returns an error.

Environment variable: `INFLUXDB_CLUSTER_SHARD_READER_TIMEOUT`

###  max-remote-write-connections = 50

The maximum number of concurrent write connections to other data nodes.
This can be raised to allow for greater intra-cluster write throughput, provided there are sufficient resources for the additional network connections.

Environment variable: `INFLUXDB_CLUSTER_MAX_REMOTE_WRITE_CONNECTIONS`

###  cluster-tracing = false

Set to `true` to enable logging of cluster communications.
Enable this setting to verify connectivity issues between data nodes.

Environment variable: `INFLUXDB_CLUSTER_CLUSTER_TRACING`

###  write-timeout = "10s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#write-timeout-10s).

Environment variable: `INFLUXDB_CLUSTER_WRITE_TIMEOUT`

###  max-concurrent-queries = 0

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-concurrent-queries-0).

Environment variable: `INFLUXDB_CLUSTER_MAX_CONCURRENT_QUERIES`

###  query-timeout = "0"

See the [OSS documentation](/influxdb/v1.0/administration/config/#query-timeout-0).

Environment variable: `INFLUXDB_CLUSTER_QUERY_TIMEOUT`

###  log-queries-after = "0"

See the [OSS documentation](/influxdb/v1.0/administration/config/#log-queries-after-0).

Environment variable: `INFLUXDB_CLUSTER_LOG_QUERIES_AFTER`

###  max-select-point = 0

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-select-point-0).

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_POINT`

###  max-select-series = 0

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-select-series-0).

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_SERIES`

###  max-select-buckets = 0

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-select-buckets-0).

Environment variable: `INFLUXDB_CLUSTER_MAX_SELECT_BUCKETS`

## [retention]

See the [OSS documentation](/influxdb/v1.0/administration/config/#retention).

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true).

Environment variable: `INFLUXDB_RETENTION_ENABLED`

###  check-interval = "30m0s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#check-interval-30m0s).

Environment variable: `INFLUXDB_RETENTION_CHECK_INTERVAL`

## [shard-precreation]

See the [OSS documentation](/influxdb/v1.0/administration/config/#shard-precreation).

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true-1).

Environment variable: `INFLUXDB_SHARD_PRECREATION_ENABLED`

###  check-interval = "10m0s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#check-interval-10m0s).

Environment variable: `INFLUXDB_SHARD_PRECREATION_CHECK_INTERVAL`

###  advance-period = "30m0s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#advance-period-30m0s).

Environment variable: `INFLUXDB_SHARD_PRECREATION_ADVANCE_PERIOD`

## [admin]

See the [OSS documentation](/influxdb/v1.0/administration/config/#admin).

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true-2).

Environment variable: `INFLUXDB_ADMIN_ENABLED`

###  bind-address = ":8083"

See the [OSS documentation](/influxdb/v1.0/administration/config/#bind-address-8083).

Environment variable: `INFLUXDB_ADMIN_BIND_ADDRESS`

###  https-enabled = false

See the [OSS documentation](/influxdb/v1.0/administration/config/#https-enabled-false).

Environment variable: `INFLUXDB_ADMIN_HTTPS_ENABLED`

###  https-certificate = "/etc/ssl/influxdb.pem"  

See the [OSS documentation](/influxdb/v1.0/administration/config/#https-certificate-etc-ssl-influxdb-pem).

Environment variable: `INFLUXDB_ADMIN_HTTPS_ENABLED`

## [monitor]

See the [OSS documentation](/influxdb/v1.0/administration/config/#monitor).

###  store-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#store-enabled-true).

Environment variable: `INFLUXDB_MONITOR_STORE_ENABLED`

###  store-database = "\_internal"  

See the [OSS documentation](/influxdb/v1.0/administration/config/#store-database-internal).

Environment variable: `INFLUXDB_MONITOR_STORE_DATABASE`

###  store-interval = "10s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#store-interval-10s).

Environment variable: `INFLUXDB_MONITOR_STORE_INTERVAL`

###  remote-collect-interval = "10s"

Environment variable: `INFLUXDB_MONITOR_REMOTE_COLLECT_INTERVAL`

## [subscriber]

See the [OSS documentation](/influxdb/v1.0/administration/config/#subscriber).

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true-3).

Environment variable: `INFLUXDB_SUBSCRIBER_ENABLED`

###  http-timeout = "30s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#http-timeout-30s).

Environment variable: `INFLUXDB_SUBSCRIBER_HTTP_TIMEOUT`

## [http]

See the [OSS documentation](/influxdb/v1.0/administration/config/#http).

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true-4).

Environment variable: `INFLUXDB_HTTP_ENABLED`

###  bind-address = ":8086"

See the [OSS documentation](/influxdb/v1.0/administration/config/#bind-address-8086).

Environment variable: `INFLUXDB_HTTP_BIND_ADDRESS`

###  auth-enabled = false  

See the [OSS documentation](/influxdb/v1.0/administration/config/#auth-enabled-false).

Environment variable: `INFLUXDB_HTTP_AUTH_ENABLED`

###  log-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#log-enabled-true).

Environment variable: `INFLUXDB_HTTP_LOG_ENABLED`

###  write-tracing = false  

See the [OSS documentation](/influxdb/v1.0/administration/config/#write-tracing-false).

Environment variable: `INFLUXDB_HTTP_WRITE_TRACING`

###  https-enabled = false

See the [OSS documentation](/influxdb/v1.0/administration/config/#https-enabled-false-1).

Environment variable: `INFLUXDB_HTTP_HTTPS_ENABLED`

###  https-certificate = "/etc/ssl/influxdb.pem"

See the [OSS documentation](/influxdb/v1.0/administration/config/#https-certificate-etc-ssl-influxdb-pem-1).

Environment variable: `INFLUXDB_HTTP_HTTPS_CERTIFICATE`

###  https-private-key = ""

See the [OSS documentation](/influxdb/v1.0/administration/config/#https-private-key).

Environment variable: `INFLUXDB_HTTP_HTTPS_PRIVATE_KEY`

###  max-row-limit = 10000

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-row-limit-10000).

Environment variable: `INFLUXDB_HTTP_MAX_ROW_LIMIT`

###  max-connection-limit = 0

See the [OSS documentation](/influxdb/v1.0/administration/config/#max-connection-limit-0).

Environment variable: `INFLUXDB_HTTP_MAX_CONNECTION_LIMIT`

###  shared-secret = ""

See the [OSS documentation](/influxdb/v1.0/administration/config/#shared-secret).

This setting is required and must match on each data node if the cluster is using the InfluxEnterprise Web Console.

Environment variable: `INFLUXDB_HTTP_SHARED_SECRET`

###  realm = "InfluxDB"

See the [OSS documentation](/influxdb/v1.0/administration/config/#realm-influxdb).

Environment variable: `INFLUXDB_HTTP_REALM`

## [[graphite]]

See the [OSS documentation](/influxdb/v1.0/administration/config/#graphite).

## [[collectd]]

See the [OSS documentation](/influxdb/v1.0/administration/config/#collectd).

## [[opentsdb]]

See the [OSS documentation](/influxdb/v1.0/administration/config/#opentsdb).

## [[udp]]

See the [OSS documentation](/influxdb/v1.0/administration/config/#udp).

## [continuous_queries]

See the [OSS documentation](/influxdb/v1.0/administration/config/#continuous-queries).

###  log-enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#log-enabled-true-1).

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_LOG_ENABLED`

###  enabled = true

See the [OSS documentation](/influxdb/v1.0/administration/config/#enabled-true-5).

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_ENABLED`

###  run-interval = "1s"

See the [OSS documentation](/influxdb/v1.0/administration/config/#run-interval-1s).

Environment variable: `INFLUXDB_CONTINUOUS_QUERIES_RUN_INTERVAL`

## [hinted-handoff]

Controls the hinted handoff feature, which allows data nodes to temporarily cache writes destined for another data node when that data node is unreachable.

###  dir = "/var/lib/influxdb/hh"

The hinted handoff directory where the durable queue will be stored on disk.

Environment variable: `INFLUXDB_HINTED_HANDOFF_DIR`

###  enabled = true

Set to `false` to disable hinted handoff.
Disabling hinted handoff is not recommended and can lead to data loss if another data node is unreachable for any length of time.

Environment variable: `INFLUXDB_HINTED_HANDOFF_ENABLED`

###  max-size = 10737418240

The maximum size of the hinted handoff queue.
Each queue is for one and only one other data node in the cluster.
If there are N data nodes in the cluster, each data node may have up to N-1 hinted handoff queues.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_SIZE`

###  max-age = "168h0m0s"  

The time writes sit in the queue before they are purged. The time is determined by how long the batch has been in the queue, not by the timestamps in the data.
If another data node is unreachable for more than the `max-age` it can lead to data loss.

Environment variable: `INFLUXDB_HINTED_HANDOFF_MAX_AGE`

###  retry-concurrency = 20

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_CONCURRENCY`

###  retry-rate-limit = 0

The rate (in bytes per second) at which the hinted handoff retries writes.
The limit applies per remote node queue.
Set to `0` to disable the rate limit.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_RATE_LIMIT`

###  retry-interval = "1s"

The initial interval at which the hinted handoff retries a write after it fails.

> **Note:** Hinted handoff begins retrying writes to an unreachable node at the interval defined by the `retry-interval`. If any error occurs, it will backoff exponentially until it reaches the interval defined by the `retry-max-interval`. Hinted handoff then retries writes at that interval until it succeeds. The interval resets to the `retry-interval` once hinted handoff successfully completes writes to the node.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_INTERVAL`

###  retry-max-interval = "10s"  

The maximum interval at which the hinted handoff retries a write after it fails.
It retries at this interval until it succeeds.

Environment variable: `INFLUXDB_HINTED_HANDOFF_RETRY_MAX_INTERVAL`

###  purge-interval = "1m0s"  

The interval at which InfluxDB checks to purge data that are above `max-age`.

Environment variable: `INFLUXDB_HINTED_HANDOFF_PURGE_INTERVAL`
<br>
<br>
# Web Console Configuration

### url = "http://IP_or_hostname:3000"

The "pretty" URL that users will see for this app.

Environment variable: `URL`

### hostname = "localhost"

The hostname that you want to bind the application to.

Environment variable: `HOSTNAME`

### port = "3000"

The port that you want to bind the application to.

Environment variable: `PORT`

### license-key = ""

The license key that you created on [InfluxPortal](https://portal.influxdata.com).
The influx-enterprise node transmits the license key to [portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443 and receives a temporary JSON license file in return.
The server caches the license file locally.
You must use the [`license-file` setting](#license-file) if your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com).

Environment variable: `LICENSE_KEY`

### license-file = ""

The local path to the permanent JSON license file that you received from InfluxData.
Permanent license files are not available for subscribers on a monthly plan.
If you are a monthly subscriber, your cluster must use the `license-key` setting.
Contact [sales@influxdb.com](mailto:sales@influxdb.com) to become an annual subscriber.

Environment variable: `LICENSE_FILE`

## [influxdb]
### shared-secret = "long pass phrase used for signing tokens"

Allows the web console to authenticate users with the cluster.
This setting is required and must match the
[`shared-secret` setting](/enterprise_influxdb/v1.0/administration/configuration/#shared-secret)
in the data node configuration files.

Environment variable: `SHARED_SECRET`

## [smtp]

Controls how the web console sends emails to invite users to the application.
Note that the web console requires a functioning SMTP server to email invites to
new web console users.

### host = "localhost"

Environment variable: `SMTP_HOST`

### port = "25"

Environment variable: `SMTP_PORT`

### username = ""

Environment variable: `SMTP_USERNAME`

### password = ""

Environment variable: `SMTP_PASSWORD`

### from_email = "donotreply@example.com"

Environment variable: `SMTP_FROM_EMAIL`

## [database]

Controls the location of the web console's database.
The web console currently only supports Postgres >= 9.3 or SQLite3.

### url = "postgres://postgres:password@localhost:5432/enterprise"

The location of the PostgreSQL database for the web console.
By default, the web console uses SQLite for installations.
See
[Step 3 - Web Console Installation](/enterprise_influxdb/v1.0/introduction/web_console_installation/#install-the-influxenterprise-web-console-with-postgresql) for instructions on using PostgreSQL.

Environment variable: `DATABASE_URL`

### url = "sqlite3:///var/lib/influx-enterprise/enterprise.db"

The location of the SQLite database for the web console.
By default, the web console uses SQLite for installations.
