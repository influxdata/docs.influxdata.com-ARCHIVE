---
title: Database Configuration
---

## The basics
---
Generate a new configuration file by running `influxd config` and redirecting the output to a file:
```
influxd config  > /etc/influxdb/influx_v0.9.x.conf
```

Start the influxd process using that configuration file with `influxd -config`:  
```
influxd -config /etc/influxdb/influx_v0.9.x.conf
```

## Upgrading your configuration file
___
While configuration files from prior versions of InfluxDB 0.9 should work with future releases, old files may lack options for new features. To keep your configuration file up-to-date we recommend doing one of the following:

* Generate a new configuration file with each InfluxDB upgrade. Any changes that you made to the old file will need to be manually ported to the new file.

* Use both the `config` and `-config` flags to combine the new configuration file with your old configuration file. In the example below, InfluxDB uses the union of the new configuration file and the old configuration file (`influx_v0.9.x.conf`), where any configurations in the old file take precedence over those in the new file.  
<br>
    ```
    influxd config -config /etc/influxdb/influx_v0.9.x.conf
    ```  

For a more detailed discussion, see [Generate a configuration file](../introduction/installation.html#generate-a-configuration-file). 

## The configuration file by section
---
The following sections follow the structure of the [sample configuration file on GitHub](https://github.com/influxdb/influxdb/blob/master/etc/config.sample.toml) and offer detailed explanations of the different options.  Note that this documentation refers to the configuration file for the last official release - the configuration file on GitHub will always be slightly ahead of what is documented here.

Configuration sections:  

* [[reporting]](../administration/config.html#reporting)  
* [[registration]](../administration/config.html#registration)  
* [[meta]](../administration/config.html#meta)  
* [[data]](../administration/config.html#data)  
* [[hinted-handoff]](../administration/config.html#hinted-handoff)  
* [[cluster]](../administration/config.html#cluster)  
* [[retention]](../administration/config.html#retention)  
* [[shard-precreation]](../administration/config.html#shard-precreation)
* [[monitor]](../administration/config.html#monitor)  
* [[admin]](../administration/config.html#admin)  
* [[http]](../administration/config.html#http)  
* [[graphite]](../administration/config.html#graphite)  
* [[collectd]](../administration/config.html#collectd)  
* [[opentsdb]](../administration/config.html#opentsdb)  
* [[udp]](../administration/config.html#udp)  
* [[continuous_queries]](../administration/config.html#continuous-queries)  

## [reporting]
Once every 24 hours InfluxDB reports anonymous data to m.influxdb.com. Those data include a unique, randomly-generated cluster identifier (an 8-byte Raft ID); OS; architecture; InfluxDB version; and the number of [databases](../concepts/glossary.html#database), [measurements](../concepts/glossary.html#measurement), and unique [series](../concepts/glossary.html#series). 

InfluxDB doesn't request, track, or store the IP addresses of those servers that report. InfluxDB uses these data primarily to track the number of deployed clusters for each version. 

**reporting-disabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set this option to `true` to disable reporting.

## [registration]
Controls Enterprise registration.  

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**url = "https://enterprise.influxdata.com"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Enterprise server URL.

**token = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The registration token for the Enterprise server.

## [meta]
This section controls some of the parameters for the InfluxDB cluster. Specifically, it handles the parameters for the Raft consensus group which coordinates metadata about the cluster. For step-by-step instructions on setting up an InfluxDB cluster, see [Cluster Setup](../guides/clustering.html). 

**dir = "/var/opt/influxdb/meta"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The directory where InfluxDB stores `id`, `peers.json`, `raft.db`, and the `snapshots` directory.

> * `id` stores the identification number of the Raft peer: `1` for the first node to join the cluster, `2` for the second node, and `3` for the third node to join the cluster.
* `peers.json` stores the hostnames and ports of the three Raft peers.
* `snapshots` contains the server's snapshots taken for the purpose of log compaction.
* `raft.db` is the BoltDB database that contains the Raft log and snapshots.

**hostname = "localhost"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The `hostname` of the Raft peer.  

**bind-address = ":8088"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The `port` over which the Raft peer communicates.  

**retention-autocreate = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable the autocreation of the [`default` retention policy](../concepts/glossary.html#retention-policy-rp) when InfluxDB creates a database.  

**election-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time a candidate spends in the candidate state without a leader before it starts an election. In practice, InfluxDB staggers this parameter for each Raft peer. The default setting should work for most systems.  

**heartbeat-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time a follower remains in the follower state without a leader before it starts an election. You may want to alter this parameter depending on your network.  

**leader-lease-timeout = "500ms"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time a raft leader can remain the leader without hearing from a majority of nodes. After the timeout the leader steps down to the follower state.  

**commit-timeout = "50ms"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The amount of time raft will go without issuing a command before a heartbeat is sent to tell the leader it is alive.  

## [data]
This section controls where the actual data for InfluxDB live and how they are flushed from the write ahead log (WAL). You may want to change the `dir` setting, but the WAL settings are an advanced configuration - the defaults should work for most systems.

**dir = "/var/opt/influxdb/data"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The directory where InfluxDB stores the data.

*The following three WAL settings apply to the b1 storage engine used in InfluxDB version 0.9.2. The settings won't apply to any new shards created after you've upgraded to versions 0.9.3+.*
 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **max-wal-size = 104857600**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum size of the WAL before a flush. This defaults to 100MB.
  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**wal-flush-interval = "10m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum time data can stay in the WAL before a flush.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**wal-partition-flush-delay = "2s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The delay time between each WAL partition flush.

*The following WAL settings are for the storage engine in InfluxDB versions 0.9.3+.*
 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**wal-dir = "/var/opt/influxdb/wal"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The WAL directory. For best throughput, the WAL directory and the data directory should be on different physical devices. If you have performance concerns, you will want to make this setting different from the `dir` in the [[data]](../administration/config.html#data) section.
 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**wal-enable-logging = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable logging.

*The following settings are for InfluxDB version 0.9.3 only. The WAL in versions 0.9.4+ no longer has five partitions.* 

**# wal-ready-series-size = 25600**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The size (in bytes) of a series in the WAL in-memory cache at which the series is marked as ready to flush to the index.
  
**# wal-compaction-threshold = 0.6**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The ratio of series that are over the `wal-ready-series-size` that triggers a partition flush and compaction.

**# wal-max-series-size = 2097152**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum size (in bytes) of a series in a partition. If any series in a partition gets above this size,  the partition is forced to flush and compact.

**# wal-flush-cold-interval = "10m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The amount of time with no writes after which a flush of all series and full compaction is forced. This option ensures that shards that are cold for writes don't keep a lot of data cached in memory and in the WAL.

**# wal-partition-size-threshold = 20971520**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The size (in bytes) of a partition at which the partition is forced to flush its largest series. There are five partitions so you'll need at least five times this amount of memory. The more memory you have, the bigger this setting can be.

**# query-log-enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable logging queries before execution. Note that when set to `true` InfluxDB will log any sensitive data in a query.

## [hinted-handoff]
This section controls the hinted handoff feature, which allows nodes to temporarily store queued data when one node of a cluster is down for a short period of time. Note that the hinted handoff has no function in a single node cluster.

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable hinted handoff. 

**dir = "/var/opt/influxdb/hh"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The hinted handoff directory. For best throughput, the HH directory and the WAL directory should be on different physical devices. If you have performance concerns, you will also want to make this setting different from the dir in the [[data]](../administration/config.html#data) section.

**max-size = 1073741824**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum size of the hinted handoff queue for a node. If the queue is full, new writes are rejected and an error is returned to the client. The queue is drained when either the writes are retried successfully or the writes expire.  

**max-age = "168h"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time writes sit in the queue before they are purged. The time is determined by how long the batch has been in the queue, not by the timestamps in the data.  

**retry-rate-limit = 0**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The rate (in bytes per second) per node at which the hinted handoff retries writes. Set to `0` to disable the rate limit.  

*Hinted handoff begins retrying writes to down nodes at the interval defined by the `retry-interval`. If any error occurs, it will backoff exponentially until it reaches the interval defined by the `retry-max-interval`. Hinted handoff then retries writes at that interval until it succeeds. The interval resets to the `retry-interval` once hinted handoff successfully completes writes to all nodes.*

**retry-interval = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The initial interval at which the hinted handoff retries a write after it fails.  

**retry-max-interval = "1m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum interval at which the hinted handoff retries a write after it fails. It retries at this interval until it succeeds.

**purge-interval = "1h"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The interval at which InfluxDB checks to purge data that are above `max-age`.  

## [cluster]
This section controls non-Raft cluster behavior, which generally includes how data are shared across shards.

**shard-writer-timeout = "5s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time that a write from one node to another must complete before the write times out. If the write times out, it may still succeed on the remote node but the client node stops waiting and queues it in [hinted handoff](../concepts/glossary.html#hinted-handoff). This timeout should always be less than or equal to the write-timeout.
 
 **write-timeout = "10s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The time during which the coordinating node must receive a successful response for writing to all remote shard owners before it considers the write a failure. If the write times out, it may still succeed but we stop waiting and queue those writes in [hinted handoff](../concepts/glossary.html#hinted-handoff). Depending on the requested consistency level and the number of successful responses received, the return value will be either `write failure` or `partial write`.

## [retention]
This section controls the enforcement of retention policies for evicting old data.

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to prevent InfluxDB from enforcing retention policies. 

**check-interval = "30m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The rate at which InfluxDB checks to enforce a retention policy. 

## [shard-precreation]
Controls the precreation of shards so that shards are available before data arrive. Only shards that, after creation, will have both a start- and end-time in the future are ever created. Shards that would be wholly or partially in the past are never precreated.

**enabled = true** 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**check-interval = "10m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**advance-period = "30m"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The maximum period in the future for which InfluxDB precreates shards. The `30m` default should work for most systems. Increasing this setting too far in the future can cause inefficiencies.   

## [monitor]
This section controls InfluxDB's [system self-monitoring](https://github.com/influxdb/influxdb/blob/master/monitor/README.md).

By default, InfluxDB writes the data to the `_internal` database. If that database does not exist, InfluxDB creates it automatically. The `DEFAULT` retention policy on the `_internal` database is seven days. If you want to use a retention policy other than the seven-day retention policy, you must [create](../administration/administration.html#retention-policy-management) it. 

**store-enabled = true**   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable recording statistics internally. If set to `false` it will make it substantially more difficult to diagnose issues with your installation.  

**store-database = "_internal"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The destination database for recorded statistics.

**store-interval = "10s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The interval at which InfluxDB records statistics.

## [admin]
Controls the availability of the built-in, web-based admin interface.

>**Note:** If you want to enable HTTPS for the admin interface you must also enable HTTPS on the [[http]](../administration/config.html#http) service.

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable the admin interface.

**bind-address = ":8083"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The port used by the admin interface.

**https-enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable HTTPS for the admin interface.

**https-certificate = "/etc/ssl/influxdb.pem"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The path of the certificate file.  

## [http]
This section controls how InfluxDB configures the HTTP endpoints. These are the primary mechanisms for getting data into and out of InfluxDB. Edit the options in this section to enable HTTPS and authentication. See [Authentication and Authorization](../administration/authentication_and_authorization.html).

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable HTTP. Note that the InfluxDB [command line interface (CLI)](../tools/shell.html) connects to the database using the HTTP API.

**bind-address = ":8086"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The port used by the HTTP API.

**auth-enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to require authentication.

**log-enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable logging.

**write-tracing = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable logging for the write payload. If set to `true`, this will duplicate every write statement in the logs and is thus not recommended for general use.  

**pprof-enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable [pprof](http://blog.golang.org/profiling-go-programs) on InfluxDB so that it gathers detailed performance information. 

**https-enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable HTTPS.

**https-certificate = "/etc/ssl/influxdb.pem"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The path of the certificate file.

## [[graphite]]
This section controls one or many listeners for Graphite data. See the [README](https://github.com/influxdb/influxdb/blob/master/services/graphite/README.md) on GitHub for more information.

**enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable Graphite input.

**database = "graphite"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The name of the database that you want to write to.  

**# bind-address = ":2003"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The default port.

**# protocol = "tcp"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `tcp` or `udp`.

**# consistency-level = "one"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The number of nodes that must confirm the write. If the requirement is not met the return value will be either `partial write` if some points in the batch fail or `write failure` if all points in the batch fail. For more information, see the Query String Parameters for Writes section in the [Line Protocol Syntax Reference ](../write_protocols/write_syntax.html).

**# name-separator = "."**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

*The next three options control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance. Batching will buffer points in memory if you have many coming in.*

**# batch-size = 1000**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush if this many points get buffered.

**# batch-pending = 5**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The number of batches that may be pending in memory.

**# batch-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush at least this often even if it hasn't reached the configured batch-size.

**# name-schema = "type.host.measurement.device"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This option configures tag keys for parsing the metric name from graphite protocol; separated by `name-separator`. The "measurement" tag is special and the corresponding field will become the name of the metric. e.g. "type.host.measurement.device" will parse "server.localhost.cpu.cpu0" as:
<br>
<br>
```
  ## {
  ##     measurement: "cpu",
  ##     tags: {
  ##         "type": "server",
  ##         "host": "localhost,
  ##         "device": "cpu0"
  ##     }
  ## }
```

**ignore-unnamed = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` so that when the input metric name has more fields than `name-schema` specified, the extra fields are ignored. Otherwise an error will be logged and the metric rejected.

## [collectd]
This section controls the listener for collectd data.

**enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable collectd writes.

**# bind-address = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An empty string is equivalent to `0.0.0.0`.

**# database = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The name of the database that you want to write to. This defaults to `collectd`. 

**# typesdb = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Defaults to `/usr/share/collectd/types.db`.

*The next three options control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance. Batching will buffer points in memory if you have many coming in.*

**# batch-size = 1000**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush if this many points get buffered.

**# batch-pending = 5**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The number of batches that may be pending in memory.

**# batch-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush at least this often even if it hasn't reached the configured batch-size.

## [opentsdb]
Controls the listener for OpenTSDB data. See the [README](https://github.com/influxdb/influxdb/blob/master/services/opentsdb/README.md) on GitHub for more information.

**enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable openTSDB writes.

**# bind-address = ":4242"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The default port.

**# database = "opentsdb"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The name of the database that you want to write to. If the database does not exist, it will be created automatically when the input is initialized.  

**# retention-policy = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The relevant retention policy. An empty string is equivalent to the database's `DEFAULT` retention policy.

**# consistency-level = "one"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**# tls-enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

**# certificate = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

*The next three options control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance. Only points metrics received over the telnet protocol undergo batching.*

**# batch-size = 1000**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush if this many points get buffered.

**# batch-pending = 5**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The number of batches that may be pending in memory.

**# batch-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush at least this often even if it hasn't reached the configured batch-size.

## [[udp]]
This section controls the listeners for InfluxDB line protocol data via UDP. See the [UDP page](../write_protocols/udp.html) for more information.

**enabled = false**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `true` to enable writes over UDP.

**# bind-address = ""**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An empty string is equivalent to `0.0.0.0`.

**# database = "udp"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The name of the database that you want to write to.  

**# retention-policy = ""**  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The relevant retention policy for your data. An empty string is equivalent to the database's `DEFAULT` retention policy.

*The next three options control how batching works. You should have this enabled otherwise you could get dropped metrics or poor performance. Batching will buffer points in memory if you have many coming in.*

**# batch-size = 1000**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush if this many points get buffered.

**# batch-pending = 5**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The number of batches that may be pending in memory.

**# batch-timeout = "1s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The input will flush at least this often even if it hasn't reached the configured batch-size.

## [continuous_queries]
This section controls how [continuous queries (CQs)](../concepts/glossary.html#continuous-query-cq) run within InfluxDB. CQs are automated batches of queries that execute over recent time intervals. InfluxDB executes one auto-generated query per `GROUP BY time()` interval.

**log-enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable logging for CQ events.

**enabled = true**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set to `false` to disable CQs.

**recompute-previous-n = 2**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The upper bound on the number of previous interval queries that InfluxDB executes per CQ batch.

**recompute-no-older-than = "10m0s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;InfluxDB will not generate queries with an upper time boundary older than `now()` - `recompute-no-older-than`, regardless of the value of `recompute-previous-n`.

**compute-runs-per-interval = 10**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The upper bound on the number of incremental queries generated within each `GROUP BY time()` interval. The actual number of generated queries can be lower, depending on the `GROUP BY time()` interval in the CQ and the `compute-no-more-than` setting.

**compute-no-more-than = "2m0s"**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Batches of CQs run at intervals determined by the `GROUP BY time()` interval divided by `compute-runs-per-interval`. However, CQ batches will never run more often than the `compute-no-more-than` value. 

> **Note:** `GROUP BY time()` * (`recompute-previous-n` + 1) must be greater than `compute-no-more-than` or some time intervals will never be sampled.
