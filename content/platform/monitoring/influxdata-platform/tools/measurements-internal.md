---
title: Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise (_internal)
description: Use and understand the InfluxDB measurements statistics and field keys that can be used to monitor InfluxDB OSS servers and InfluxDB Enterprise clusters.
menu:
  platform:
    name: Measurements for monitoring
    parent: Tools for monitoring InfluxDB
    weight: 2
---

**On this page**

* [Using the `_internal` database](#using-the-internal-database)
* [Enterprise cluster measurements](#enterprise-cluster-measurements)
* [InfluxDB measurement statistics](#influxdb-measurement-statistics)
  * [ae](#ae-enterprise-only) (Enterprise only)
      - [bytesRx](#bytesrx)
      - [errors](#errors)
      - [jobs](#jobs)
      - [jobsActive](#jobsactive)
  * [cluster](#cluster-enterprise-only) (Enterprise only)
      - [copyShardReq](#copyshardreq)
      - [createIteratorReq](#createiteratorreq)
      - [expandSourcesReq](#expandsourcesreq)
      - [fieldDimensionsReq](#fielddimensionsreq)
      - [iteratorCostReq](#iteratorcostreq)
      - [removeShardReq](#removeshardreq)
      - [writeShardFail](#writeshardfail)
      - [writeShardPointsReq](#writeshardpointsreq)
      - [writeShardReq](#writeshardreq)
  * [cq](#cq)
      - [queryFail](#queryfail)
      - [queryOk](#queryok)
  * [database](#database)
      - [numMeasurements](#nummeasurements)
      - [numSeries](#numseries)
  * [hh](#hh-enterprise-only) (Enterprise only))
      - [writeShardReq](#writeshardreq)
      - [writeShardReqPoints](#writeshardreqpoints)
  * [hh_processor](#hh-processor-enterprise-only) (Enterprise only))
      - [bytesRead](#bytesread)
      - [bytesWritten](#byteswritten)
      - [queueBytes](#queuebytes)
      - [queueDepth](#queuedepth)
      - [writeBlocked](#writeblocked)
      - [writeDropped](#writedropped)
      - [writeNodeReq](#writenodereq)
      - [writeNodeReqFail](#writenodereqfail)
      - [writeNodeReqPoints](#writenodereqpoints)
      - [writeShardReq](#writeshardreq)
      - [writeShardReqPoints](#writeshardreqpoints)
  * [httpd](#httpd)
      - [authFail](#authfail)
      - [clientError](#clienterror)
      - [pingReq](#pingreq)
      - [pointsWrittenDropped](#pointswrittendropped)
      - [pointsWrittenFail](#pointswrittenfail)
      - [pointsWrittenOK](#pointswrittenok)
      - [promReadReq](#promreadreq)
      - [promWriteReq](#promwritereq)
      - [fluxQueryReq](#fluxqueryreq)
      - [fluxQueryDurationNs](#fluxquerydurationns)
      - [queryReq](#queryreq)
      - [queryReqDurationNs](#queryreqdurationns)
      - [queryRespBytes](#queryrespbytes)
      - [recoveredPanics](#recoveredpanics)
      * [req](#req)
      * [reqActive](#reqactive)
      * [reqDurationNs](#reqdurationns)
      * [serverError](#servererror)
      * [statusReq](#statusreq)
      * [writeReq](#writereq)
      * [writeReqActive](#writereqactive)
      * [writeReqBytes](#writereqbytes)
      * [writeReqDurationNs](#writereqdurationns)
  * [queryExecutor](#queryexecutor)
      * [queriesActive](#queriesactive)
      * [queriesExecuted](#queriesexecuted)
      * [queriesFinished](#queriesfinished)
      * [queryDurationNs](#querydurationns)
      * [recoveredPanics](#recoveredpanics)
  * [rpc](#rpc-enterprise-only) (Enterprise only)
      * [idleStreams](#idlestreams)
      * [liveConnections](#liveconnections)
      * [liveStreams](#livestreams)
      * [rpcCalls](#rpccalls)
      * [rpcFailures](#rpcfailures)
      * [rpcReadBytes](#rpcreadbytes)
      * [rpcRetries](#rpcretries)
      * [rpcWriteBytes](#rpcwritebytes)
      * [singleUse](#singleuse)
      * [singleUseOpen](#singleuseopen)
      * [totalConnections](#totalconnections)
      * [totalStreams](#totalstreams)
  * [runtime](#runtime)
      * [Alloc](#alloc)
      * [Frees](#frees)
      * [HeapAlloc](#heapalloc)
      * [HeapIdle](#heapidle)
      * [HeapInUse](#heapinuse)
      * [HeapObjects](#heapobjects)
      * [HeapReleased](#heapreleased)
      * [HeapSys](#heapsys)
      * [Lookups](#lookups)
      * [Mallocs](#mallocs)
      * [NumGC](#numgc)
      * [NumGoroutine](#numgoroutine)
      * [PauseTotalNs](#)
      * [Sys](#sys)
      * [TotalAlloc](#totalalloc)
  * [shard](#shard)
      * [diskBytes](#diskbytes)
      * [fieldsCreate](#fieldscreate)
      * [seriesCreate](#seriescreate)
      * [writeBytes](#writebytes)
      * [writePointsDropped](#writepointsdropped)
      * [writePointsErr](#writepointserr)
      * [writePointsOk](#writepointsok)
      * [writeReq](#writereq)
      * [writeReqErr](#writereqerr)
      * [writeReqOk](#writereqok)
  * [subscriber](#subscriber)
      * [createFailures](#createfailures)
      * [pointsWritten](#pointswritten)
      * [writeFailures](#writefailures)
  * [tsm1_cache](#tsm1-cache)
      * [WALCompactionTimeMs](#walcompactiontimems)
      * [cacheAgeMs](#cacheagems)
      * [cachedBytes](#cachedbytes)
      * [diskBytes](#diskbytes)
      * [memBytes](#membytes)
      * [snapshotCount](#snapshotcount)
      * [writeDropped](#writedropped)
      * [writeErr](#writeerr)
      * [writeOk](#writeok)
  * [tsm1_engine](#tsm1-engine)
      * [cacheCompactionDuration](#cachecompactionduration)
      * [cacheCompactionErr](#cachecompactionerr)
      * [cacheCompactions](#cachecompactions)
      * [cacheCompactionsActive](#cachecompactionsactive)
      * [tsmFullCompactionDuration](#tsmfullcompactionduration)
      * [tsmFullCompactionErr](#tsmfullcompactionerr)
      * [tsmFullCompactionQueue](#tsmfullcompactionqueue)
      * [tsmFullCompactions](#tsmfullcompactions)
      * [tsmFullCompactionsActive](#tsmfullcompactionsactive)
      * [tsmLevel1CompactionDuration](#tsmlevel1compactionduration)
      * [tsmLevel1CompactionErr](#tsmlevel1compactionerr)
      * [tsmLevel1CompactionQueue](#tsmlevel1compactionqueue)
      * [tsmLevel1Compactions](#tsmlevel1compactions)
      * [tsmLevel1CompactionsActive](#tsmlevel1compactionsactive)
      * [tsmLevel2CompactionDuration](#tsmlevel2compactionduration)
      * [tsmLevel2CompactionErr](#tsmlevel2compactionerr)
      * [tsmLevel2CompactionQueue](#tsmlevel2compactionqueue)
      * [tsmLevel2Compactions](#tsmlevel2compactions)
      * [tsmLevel2CompactionsActive](#tsmlevel2compactionsactive)
      * [tsmLevel3CompactionDuration](#tsmlevel3compactionduration)
      * [tsmLevel3CompactionErr](#tsmlevel3compactionerr)
      * [tsmLevel3CompactionQueue](#tsmlevel3compactionqueue)
      * [tsmLevel3Compactions](#tsmlevel3compactions)
      * [tsmLevel3CompactionsActive](#tsmlevel3compactionsactive)
      * [tsmOptimizeCompactionDuration](#tsmoptimizecompactionduration)
      * [tsmOptimizeCompactionErr](#tsmoptimizecompactionerr)
      * [tsmOptimizeCompactionQueue](#tsmoptimizecompactionqueue)
      * [tsmOptimizeCompactions](#tsmoptimizecompactions)
      * [tsmOptimizeCompactionsActive](#tsmoptimizecompactionsactive)
  * [tsm1_filestore](#tsm1-filestore)
      * [diskBytes](#diskbytes)
      * [numFiles](#numfiles)
  * [tsm1_wal](#tsm1-wal)
      * [currentSegmentDiskBytes](#currentsegmentdiskbytes)
      * [oldSegmentsDiskBytes](#oldsegmentdiskbytes)
      * [writeErr](#writeerr)
      * [writeOk](#writeok)
  * [write](#write)
      * [pointReq](#pointreq)
      * [pointReqHH](#pointreqhh-enterprise-only) (Enterprise only)
      * [pointReqLocal](#pointreqlocal-enterprise-only) (Enterprise only)
      * [pointReqRemote](#pointreqremote-enterprise-only) (Enterprise only)
      * [req](#req)
      * [subWriteDrop](#subwritedrop)
      * [subWriteOk](#subwriteok)
      * [writeDrop](#writedrop)
      * [writeError](#writeerror)
      * [writeOk](#writeok)
      * [writePartial](#writepartial-enterprise-only) (Enterprise only)
      * [writeTimeout](#writetimeout)


## Using the `_internal` database

By default, InfluxDB generates measurement statistics that are saved to the `_internal` database. These measurement statistics can be used in dashboards for monitoring your InfluxDB OSS servers and InfluxDB Enterprise clusters and for creating alerts to notify you when critical levels are reached.

> **Note:** When using the "watcher of watcher (WoW)" configuration, InfluxDB measurement statistics are written to the `telegraf` database using the InfluxDB plugins. When the data is collected in the `telegraf` database using InfluxDB plugins, most of the field keys below are prepended with `infuxdb_`, but they are otherwise identical to the ones listed here.


## Enterprise cluster measurements

In a cluster, each measurement in the `_internal` database has three tags:
* `clusterID` - the UUID of the cluster recording the `_internal` metrics
* `hostname` - the hostname of the node reporting the metrics.
  - The `hostname` is added to all statistics and should indicate the hostname as reported by the operating system.
* `nodeID` - the hostname and port of the node reporting the metrics.
  - The `nodeID` is set in closed source, and  should be set to the hostname or bind address as set in the config file.

## InfluxDB measurement statistics

### ae (Enterprise only)

The measurement statistics related to the Anti-Entropy (AE) engine in InfluxDB Enterprise clusters.

#### bytesRx

* The number of bytes received by the data node.
* Data type: integer

#### errors

* The total number of jobs that have resulted in errors.
* Data type: integer
* Used in "Anti-Entropy Errors"
* Examples
  * "Anti-Entropy Errors" metric in the [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#anti-entropy-errors) dashboard.

#### jobs

* The total number of jobs executed by the data node.
* Data type: integer

#### jobsActive

* The number of active (currently executing) jobs.
* Data type: integer
* Examples
  * "Anti-Entropy Jobs" metric in the [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#anti-entropy-jobs) dashboard.

_____

### cluster (Enterprise only)

The `cluster` measurement tracks statistics related to the clustering features of the data nodes in InfluxDB Enterprise.
The tags on the series indicate the source host of the stat.

####  copyShardReq

* The number of internal requests made to copy a shard from _this_ data node to another data node.
* Data type: integer

####  createIteratorReq

* The number of remote node requests made to remotely read data from this data node.
* Data type: integer

####  expandSourcesReq

* The number of remote node requests made to find measurements on this node that match a particular regular expression.
Indicates a SELECT from a regex initiated on a different data node, which then sent an internal request to this node.
* There is not currently a statistic tracking how many queries with a regex, instead of a fixed measurement, were initiated on a particular node.
* Data type: integer

####  fieldDimensionsReq

* The number of remote node requests for information about the fields and associated types, and tag keys of measurements on this data node.
* Data type: integer

####  iteratorCostReq

* The number of internal requests for iterator cost.
* Data type: integer

####  removeShardReq

* The number of internal requests to delete a shard from this data node.
* Exclusively incremented by use of the `influxd-ctl remove shard` command.
* Data type: integer

#### writeShardFail

* The total number of internal write requests from a remote node that failed.
* It's the cousin of OSS shard stat `writeReqErr`.
* A write request over HTTP is received by Node A. Node A does not have the shard locally, so it creates an internal request to Node B instructing what to write and to which shard. If Node B sees the request and if anything goes wrong, Node B increments its own `writeShardFail`. Depending on what went wrong, in most circumstances Node B would also increment its `writeReqErr` stat inherited from OSS.
* If Node A had the shard locally, there would be no internal request to write data to a remote node, so `writeShardFail` would not be incremented.
* Data type: integer

#### writeShardPointsReq

* The number of points in every internal write request from any remote node, regardless of success.
* Data type: integer

#### writeShardReq

* The number of internal write requests from a remote data node, regardless of success.
* Data type: integer



_____

### cq

The measurement statistics related to continuous queries (CQs).

#### queryFail

* The total number of continuous queries that executed but failed.
* Data type: integer
* Examples
  * "Continuous Queries Executed" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#continuous-queries-executed-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#continuous-queries-executed-minute) dashboards.

#### queryOk

* The total number of continuous queries that executed successfully.
* Note that this value may be incremented in some cases where a CQ is initiated but does not actually run, for example, due to misconfigured resample intervals.
* Data type: integer
* Examples
  * "Continuous Queries Executed" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#continuous-queries-executed-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#continuous-queries-executed-minute) dashboards.

--------  ---------

### database

#### numMeasurements

* The current number of measurements in the specified database.
* Data type: integer
* The series cardinality values are estimates, based on [HyperLogLog++ (HLL++)](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Examples:
  * "Measurements By Database" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#number-of-measurements-by-database) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#number-of-measurements-by-database) dashboards.

#### numSeries

* The current series cardinality of the specified database.
* Data type: integer
* The series cardinality values are estimates, based on [HyperLogLog++ (HLL++)](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Examples
  * "Series Cardinality By Database" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#series-cardinality-by-database) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#series-cardinality-by-database) dashboards.

_____

### hh \[Enterprise only\]

The `hh` measurement statistics track events resulting in new Hinted Handoff (HH) processors in InfluxDB Enterprise.

The `hh` measurement has one additional tag:
* `path` - The path to the durable hinted handoff queue on disk.

#### writeShardReq

* The number of initial write requests handled by the Hinted Handoff engine for a remote node.
* Subsequent write requests to this node, destined for the same remote node, do not increment this statistics.
* This statistic resets to `0` upon restart of `influxd`, regardless of the state the last time the process was alive. It is incremented when the HH "supersystem" is instructed to enqueue a write for the node, and the "subsystem" for the destination node doesn't exist and has to be created, and the "subsystem" created successfully.
* If HH files are on disk for a remote node at process startup, the branch that increments this stat will not be reached.
* Data type: integer

#### writeShardReqPoints

* The number of write requests for each point in the initial request to the Hinted Handoff engine for a remote node.
* Data type: integer

_____

### hh_processor \[Enterprise only\]

The `hh_processor` measurement statistics are related to the Hinted Handoff (HH) processors in InfluxDB Enterprise, one for each data node.

The `hh_processor` measurement has two additional tags:
* `node` - The destination node for the recorded metrics.
* `path` - The path to the durable hinted handoff queue on disk.

> **Note:** The `hh_processor` statistics against a host are only accurate for the lifecycle of the current process. If the process crashes or restarts, `bytesRead` and `bytesWritten` are reset to zero, even if the HH queue was non-empty.

#### bytesRead

>**Note:** Resets to zero after crash or restart, even if the HH queue was non-empty.

* The size, in bytes, of points read from the Hinted Handoff queue and sent to its destination data node.
* Note that if the data node process is restarted while there is data in the HH queue, `bytesRead` may settle to a number larger than `bytesWritten`.
* Hinted Handoff writes occur in concurrent batches as determined by the [`retry-concurrency`](/enterprise_influxdb/latest/administration/configuration/#retry-concurrency-20) setting. If an individual write succeeds, the metric is incremented. If any write out of the whole batch fails, the entire batch is considered unsuccessful, and every part of the batch will be retried later. This was not the intended behavior of this stat.
* The other situation where `bytesRead` could be larger would be after a restart of the process. Say at startup there were 1000 bytes still enqueued in HH from the previous run of the process. Immediately after a restart, both `bytesRead` and `bytesWritten` are set to zero. Assuming HH is properly depleted, and no future writes require HH, then the stats will read 1000 bytes read and 0 bytes written.
* Data type: integer

#### bytesWritten

* The total number of bytes written to the Hinted Handoff queue.
* Note that this statistic only tracks bytes written during the lifecycle of the current process.
Upon restart or a crash, this statistic resets to zero, even if the Hinted Handoff queue was not empty.
* Data type: integer

#### queueBytes

* The total number of bytes remaining in the Hinted Handoff queue.
* This statistic should accurately and absolutely track the number of bytes of encoded data waiting to be sent to the remote node.
* Data type: integer
* This statistic should remain correct across restarts, unlike `bytesRead` and `bytesWritten` (See https://github.com/influxdata/docs.influxdata.com/issues/780)
  * See PR on `max-values-per-tag` limit and effects on `queueBytes` (https://github.com/influxdata/docs.influxdata.com/issues/780).
  * Examples:
    * "Hinted Handoff Queue Size" in the [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#hinted-handoff-hh-queue-size) dashboard.

#### queueDepth

* The total number of segments in the Hinted Handoff queue. The HH queue is a sequence of 10MB "segment" files.
* This is a coarse-grained statistic that roughly represents the amount of data queued for a remote node.
* The `queueDepth` values can give you a sense of when a queue is growing or shrinking.
* Data type: integer

####  writeBlocked

* The number of writes blocked because the number of concurrent HH requests exceeds the limit.
* Data type: integer

####  writeDropped

* The number of writes dropped from the HH queue because the write appeared to be corrupted.
* Data type: integer

####  writeNodeReq

* The total number of write requests that succeeded in writing a batch to the destination node.
* Data type: integer

####  writeNodeReqFail

* The total number of write requests that failed in writing a batch of data from the Hinted Handoff queue to the destination node.
* Data type: integer

####  writeNodeReqPoints

* The total number of points successfully written from the HH queue to the destination node fr
* Data type: integer

####  writeShardReq

* The total number of every write batch request enqueued into the Hinted Handoff queue.
* Data type: integer

####  writeShardReqPoints

* The total number of points enqueued into the Hinted Handoff queue.
* Data type: integer

_____

### httpd

The `httpd` measurement statistics are related to the InfluxDB HTTP server.

####  authFail

* The number of HTTP requests that were aborted due to authentication being required, but not supplied or incorrect.
* Data type: integer

####  clientError

* The number of HTTP responses due to client errors, with a `4XX` HTTP status code.
* Data type: integer
* Used in "HTTP Requests"
* Examples:
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-requests-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-requests-minute) dashboards.


#### fluxQueryReq

* The number of Flux query requests served.
* Data type: integer

#### fluxQueryReqDurationNs

* The duration (wall-time), in nanoseconds, spent executing Flux query requests.
* Data type: integer


####  pingReq

* The number of times InfluxDB HTTP server served the `/ping` HTTP endpoint.
* Data type: integer

####  pointsWrittenDropped

* The number of points dropped by the storage engine.
* Data type: integer

####  pointsWrittenFail

* The number of points accepted by the HTTP `/write` endpoint, but unable to be persisted.
* Data type: integer

####  pointsWrittenOK

* The number of points accepted by the HTTP `/write` endpoint and persisted successfully.
* Data type: integer

####  promReadReq

* The number of read requests to the Prometheus `/read` endpoint.
* Data type: integer

####  promWriteReq

* The number of write requests to the Prometheus `/write` endpoint.
* Data type: integer

####  queryReq

* The number of query requests.
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests Per Minute"
* Examples:
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-request-duration-99th) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-request-duration-99th) dashboards.
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-requests-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-requests-minute) dashboards.

####  queryReqDurationNs

* The total query request duration, in nanosecond (ns).
* Data type: integer
* Examples:
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-request-duration-99th) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-request-duration-99th) dashboards.

####  queryRespBytes

* The total number of bytes returned in query responses.
* Data type: integer

####  recoveredPanics

* The total number of panics recovered by the HTTP handler.
* Data type: integer

####  req

* The total number of HTTP requests served.
* Data Type: integer

####  reqActive  

* The number of currently active requests.
* Data type: integer

####  reqDurationNs

* The duration (wall time), in nanoseconds, spent inside HTTP requests.
* Data type: integer

####  serverError

* The number of HTTP responses due to server errors.
* Data type: integer
* Examples
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-requests-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-requests-minute) dashboards.

####  statusReq

* The number of status requests served using the HTTP `/status` endpoint.
* Data type: integer

####  writeReq

* The number of write requests served using the HTTP `/write` endpoint.
* Data type: integer
* Examples
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-request-duration-99th) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-request-duration-99th) dashboards.
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-requests-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-requests-minute) dashboards.

####  writeReqActive

* The number of currently active write requests.
* Data type: integer

####  writeReqBytes

* The total number of bytes of line protocol data received by write requests, using the HTTP `/write` endpoint.
* Data type: integer

####  writeReqDurationNs

* The duration (wall time), in nanoseconds, of write requests served using the `/write` HTTP endpoint.
* Data type: integer
* Examples
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#http-request-duration-99th) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#http-request-duration-99th) dashboards.

-----

### queryExecutor

The `queryExecutor` statistics related to usage of the Query Executor of the InfluxDB engine.

####  queriesActive

* The number of active queries currently being handled.
* Data type: integer

#####  queriesExecuted

* The number of queries executed (started).
* Data type: integer
* Examples
  * "Queries Executed Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#queries-executed-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#queries-executed-per-minute) dashboards.

####  queriesFinished

* The number of queries that have finished executing.
* Data type: integer

####  queryDurationNs

* The duration (wall time), in nanoseconds, of every query executed.
* If one query took 1000 ns from start to finish, and another query took 500 ns from start to finish and ran before the first query finished, the statistic would increase by 1500.
* Data type: integer

####  recoveredPanics

* The number of panics recovered by the Query Executor.
* Data type: integer



_____

### rpc (Enterprise only)

The `rpc` measurement statistics are related to the use of RPC calls within InfluxDB Enterprise clusters.

####  idleStreams

* The number of idle multiplexed streams across all live TCP connections.
* Data type: integer

####  liveConnections

* The current number of live TCP connections to other nodes.
* Data type: integer

####  liveStreams

*  The current number of live multiplexed streams across all live TCP connections.
* Data type: integer

####  rpcCalls

* The total number of RPC calls made to remote nodes.
* Data type: integer

####  rpcFailures

* The total number of RPC failures, which are RPCs that did not recover.
* Data type: integer

####  rpcReadBytes

* The total number of RPC bytes read.
* Data type: integer

####  rpcRetries

* The total number of RPC calls that retried at least once.
* Data type: integer

####  rpcWriteBytes

* The total number of RPC bytes written.
* Data type: integer

####  singleUse

* The total number of single-use connections opened using Dial.
* Data type: integer

####  singleUseOpen

* The number of single-use connections currently open.
* Data type: integer

####  totalConnections

* The total number of TCP connections that have been established.
* Data type: integer

####  totalStreams

* The total number of streams established.
* Data type: integer

-----

### runtime

The `runtime` measurement statistics include a subset of MemStats records statistics about the Go memory allocator. The  `runtime` statistics can be useful to determine poor memory allocation strategies and related performance issues.

The [Go runtime package](https://golang.org/pkg/runtime/) contains operations that interact with Go's runtime system, including functions used to control goroutines. It also includes the low-level type information used by the [Go reflect package](https://golang.org/pkg/reflect/).

####  Alloc

* The currently allocated number of bytes of heap objects.
* Data type: integer

####  Frees

* The cumulative number of freed (live) heap objects.
* Data type: integer

####  HeapAlloc

* The size, in bytes, of all heap objects.
* Data type: integer

####  HeapIdle

* The number of bytes of idle heap objects.
* Data type: integer

####  HeapInUse

* The number of bytes in in-use spans.
* Data type: integer
* Examples
  * "Heap Size" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring#heap-size) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#heap-size) dashboards.

####  HeapObjects

* The number of allocated heap objects.
* Data type: integer

#### HeapReleased

* The number of bytes of physical memory returned to the OS.
* Data type: integer

#### HeapSys

* The number of bytes of heap memory obtained from the OS.
* Measures the amount of virtual address space reserved for the heap.
* Data type: integer

#### Lookups

* The number of pointer lookups performed by the runtime.
* Primarily useful for debugging runtime internals.
* Data type: integer

#### Mallocs

* The total number of heap objects allocated.
* The total number of live objects is [Frees](#frees).
* Data type: integer

#### NumGC

* The number of completed GC (garbage collection) cycles.
* Data type: integer

#### NumGoroutine

* The total number of Go routines.
* Data type: integer

#### PauseTotalNs

* The total duration, in nanoseconds, of total GC (garbage collection) pauses.
* Data type: integer

#### Sys

* The total number of bytes of memory obtained from the OS.
* Measures the virtual address space reserved by the Go runtime for the heap, stacks, and other internal data structures.
* Data type: integer

#### TotalAlloc

* The total number of bytes allocated for heap objects.
* This statistic does not decrease when objects are freed.
* Data type: integer

____

### shard

The `shard` measurement statistics are related to working with shards in InfluxDB OSS and InfluxDB Enterprise.

#### diskBytes

* The size, in bytes, of the shard, including the size of the data directory and the WAL directory.
* Data type: integer

#### fieldsCreate

* The number of fields created.
* Data type: integer

#### seriesCreate

* Then number of series created.
* Data type: integer

#### writeBytes

* The number of bytes written to the shard.
* Data type: integer

#### writePointsDropped

* The number of requests to write points t dropped from a write.
* Also, `http.pointsWrittentDropped` incremented when a point is dropped from a write. (See https://github.com/influxdata/docs.influxdata.com/issues/780)
* Data type: integer

#### writePointsErr

* The number of requests to write points that failed to be written due to errors.
* Data type: integer

#### writePointsOk

* The number of points written successfully.
* Data type: integer

#### writeReq

* The total number of write requests.
* Data type: integer

#### writeReqErr

* The total number of write requests that failed due to errors.
* Data type: integer

#### writeReqOk

* The total number of successful write requests.
* Data type: integer

____

### subscriber

The `subscriber` measurement statistics are related to the usage of InfluxDB subscriptions.

#### createFailures

* The number of subscriptions that failed to be created.
* Data type: integer

#### pointsWritten  

* The total number of points that were successfully written to subscribers.
* Data type: integer

#### writeFailures  

* The total number of batches that failed to be written to subscribers.
* Data type: integer

______

### tsm1_cache

The `tsm1_cache` measurement statistics are related to the usage of the TSM cache.


The following query example calculates various useful measurements related to the TSM cache.

```
SELECT
     max(cacheAgeMs) / 1000.000 AS CacheAgeSeconds,
     max(memBytes) AS MaxMemBytes, max(diskBytes) AS MaxDiskBytes,
     max(snapshotCount) AS MaxSnapShotCount,
     (last(cachedBytes) - first(cachedBytes)) / (last(WALCompactionTimeMs) - first(WALCompactionTimeMs)) * 1000.000 AS CompactedBytesPerSecond,
     last(cachedBytes) AS CachedBytes,
     (last(cachedBytes) - first(cachedBytes))/300 as CacheThroughputBytesPerSecond
FROM _internal.monitor.tsm1_cache
WHERE time > now() - 1h
GROUP BY time(5m), path
```

#### cacheAgeMs

* The duration, in milliseconds, since the cache was last snapshotted at sample time.
* This statistic indicates how busy the cache is. Large numbers indicate a cache which is idle with respect to writes.
* Data type: integer

#### cachedBytes

* The total number of bytes that have been written into snapshots.
* This statistic is updated during the creation of a snapshot.
* The purpose of this statistic is to allow calculation of cache throughput between any two instances of time. The ratio of the difference between two samples of this statistic divided by the interval separating the samples is a measure of the cache throughput (more accurately, the rate at which data is being snapshotted). When combined with the `diskBytes` and `memBytes` statistics, it can also be used to calculate the rate at which data is entering the cache and rate at which is being purged from the cache. If the entry rate exceeds the exit rate for a sustained period of time, there is an issue that needs to be addressed.
* Data type: integer

#### diskBytes

* The size, in bytes, of on-disk snapshots.
* Data type: integer

#### memBytes

* The size, in bytes, of in-memory cache.
* Data type: integer

#### snapshotCount

* The current level (number) of active snapshots.
* In a healthy system, this number should be between 0 and 1. A system experiencing transient write errors might expect to see this number rise.
* Data type: integer

#### WALCompactionTimeMs

* The duration, in milliseconds, that the commit lock is held while compacting snapshots.
* The expression `(cachedBytes - diskBytes) / WALCompactionTime` provides an indication of how fast the WAL logs are being committed to TSM files.
* The ratio of the difference between the start and end "WALCompactionTime" values for an interval divided by the length of the interval provides an indication of how much of maximum cache throughput is being consumed.
* Data type: integer

#### writeDropped

* The total number of writes dropped due to timeouts.
* Data type: integer

#### writeErr

* The total number of writes that failed.
* Data type: integer

#### writeOk

* The total number of successful writes.
* Data type: integer

____

### tsm1_engine

The `tsm1_engine` measurement statistics are related to the usage of a TSM storage engine with compressed blocks.

#### cacheCompactionDuration       

* The duration (wall time), in nanoseconds, spent in cache compactions.

* Data type: integer

#### cacheCompactionErr

* The number of cache compactions that have failed due to errors.
* Data type: integer

#### cacheCompactions              

* The total number of cache compactions that have ever run.
* Data type: integer

#### cacheCompactionsActive

* The number of cache compactions that are currently running.
* Data type: integer

#### tsmFullCompactionDuration

* The duration (wall time), in nanoseconds, spent in full compactions.
* Data type: integer

#### tsmFullCompactionErr

* The total number of TSM full compactions that have failed due to errors.
* Data type: integer

#### tsmFullCompactionQueue

* The current number of pending TMS Full compactions.
* Data type: integer

#### tsmFullCompactions

* The total number of TSM full compactions that have ever run.
* Data type: integer

#### tsmFullCompactionsActive

* The number of TSM full compactions currently running.
* Data type: integer

#### tsmLevel1CompactionDuration

* The duration (wall time), in nanoseconds, spent in TSM level 1 compactions.
* Data type: integer

#### tsmLevel1CompactionErr

* The total number of TSM level 1 compactions that have failed due to errors.
* Data type: integer

#### tsmLevel1CompactionQueue

* The current number of pending TSM level 1 compactions.
* Data type: integer

#### tsmLevel1Compactions

* The total number of TSM level 1 compactions that have ever run.
* Data type: integer

#### tsmLevel1CompactionsActive

* The number of TSM level 1 compactions that are currently running.
* Data type: integer

####  tsmLevel2CompactionDuration

* The duration (wall time), in nanoseconds, spent in TSM level 2 compactions.
* Data type: integer

#### tsmLevel2CompactionErr

* The number of TSM level 2 compactions that have failed due to errors.
* Data type: integer

#### tsmLevel2CompactionQueue

* The current number of pending TSM level 2 compactions.
* Data type: integer

#### tsmLevel2Compactions

* The total number of TSM level 2 compactions that have ever run.
* Data type: integer

#### tsmLevel2CompactionsActive    

* The number of TSM level 2 compactions that are currently running.
* Data type: integer

#### tsmLevel3CompactionDuration   

* The duration (wall time), in nanoseconds, spent in TSM level 3 compactions.
* Data type: integer

#### tsmLevel3CompactionErr

* The number of TSM level 3 compactions that have failed due to errors.
* Data type: integer

#### tsmLevel3CompactionQueue      

* The current number of pending TSM level 3 compactions.
* Data type: integer

#### tsmLevel3Compactions

* The total number of TSM level 3 compactions that have ever run.
* Data type: integer

#### tsmLevel3CompactionsActive

* The number of TSM level 3 compactions that are currently running.
* Data type: integer

#### tsmOptimizeCompactionDuration

* The duration (wall time), in nanoseconds, spent during TSM optimize compactions.
* Data type: integer

#### tsmOptimizeCompactionErr

* The total number of TSM optimize compactions that have failed due to errors.
* Data type: integer

#### tsmOptimizeCompactionQueue

* The current number of pending TSM optimize compactions.
* Data type: integer

#### tsmOptimizeCompactions

* The total number of TSM optimize compactions that have ever run.
* Data type: integer

#### tsmOptimizeCompactionsActive

* The number of TSM optimize compactions that are currently running.
* Data type: integer

____

### tsm1_filestore

The `tsm1_filestore` measurement statistics are related to the usage of the TSM file store.

#### diskBytes

* The size, in bytes, of disk usage by the TSM file store.
* Data type: integer

#### numFiles

* The total number of files in the TSM file store.
* Data type: integer

____

### tsm1_wal

The `tsm1_wal` measurement statistics are related to the usage of the TSM Write Ahead Log (WAL).

#### currentSegmentDiskBytes

* The current size, in bytes, of the segment disk.
* Data type: integer

#### oldSegmentDiskBytes

* The size, in bytes, of the segment disk.
* Data type: integer

#### writeErr

* The number of writes that failed due to errors.
* Data type: integer

#### writeOK

* The number of writes that succeeded.
* Data type: integer



_____

### write

The `write` measurement statistics are about writes to the data node, regardless of the source of the write.

#### pointReq

* The total number of every point requested to be written to this data node.
* Incoming writes have to make it through a couple of checks before reaching this point (points parse correctly, correct authentication provided, etc.). After these checks, this statistic should be incremented regardless of source (HTTP, UDP, `_internal` stats, OpenTSDB plugin, etc.).
* Data type: integer
* Examples
  * "Points Throughput / Minute by Hostname" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-oss-monitoring/) and [InfluxDB Enterprise Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring/) dashboards

#### pointReqHH (Enterprise only)

* The total number of points received for write by this node and then enqueued into Hinted Handoff for the destination node.

* Data type: integer

#### pointReqLocal (Enterprise only)

* The total number of point requests that have been attempted to be written into a shard on the same (local) node.
* Data type: integer

#### pointReqRemote (Enterprise only)

* The total number of points received for write by this node but needed to be forwarded into a shard on a remote node.
The `pointReqRemote` statistic is incremented immediately before the remote write attempt, which only happens if HH doesn't exist for that node. Then if the write attempt fails, we check again if HH exists, and if so, add the point to HH instead.
* This statistic does not distinguish between requests that are directly written to the destination node versus enqueued into the Hinted Handoff queue for the destination node.
* Data type: integer

#### req

* The total number of batches of points requested to be written to this node.
* Data type: integer

#### subWriteDrop

* The total number of batches of points that failed to be sent to the subscription dispatcher.
* Data type: integer

#### subWriteOk

* The total number of batches of points that were successfully sent to the subscription dispatcher.
* Data type: integer

#### writeDrop

* The total number of write requests for points that have been dropped due to timestamps not matching any existing retention policies.
* Data type: integer

#### writeError

* The total number of batches of points that were not successfully written, due to a failure to write to a local or remote shard.
* Data type: integer
* Examples
  * "Shard Write Errors" metric in [InfluxDB OSS Stats](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#shard-write-errors/#shard-write-errors) and [InfluxDB Enterprise Statistics](/platform/monitoring/monitoring-dashboards/dashboard-enterprise-monitoring#shard-write-errors) dashboards

#### writeOk

* The total number of batches of points written at the requested consistency level.
* Data type: integer

#### writePartial (Enterprise only)

* The total number of batches of points written to at least one node but did not meet the requested consistency level.
* Data type: integer

#### writeTimeout

* The total number of write requests that failed to complete within the default write timeout duration.
* This could indicate severely reduced or contentious disk I/O or a congested network to a remote node.
* For a single write request that comes in over HTTP or another input method, `writeTimeout` will be incremented by 1 if the entire batch is not written within the timeout period, regardless of whether the points within the batch can be written locally or remotely.
* Data type: integer
