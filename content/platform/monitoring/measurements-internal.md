---
title: Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise (_internal)
description: Use and understand the InfluxDB measurements statistics and field keys that can be used to monitor InfluxDB OSS servers and InfluxDB Enterprise clusters.
menu:
  platform:
    name: Measurements for monitoring
    weight: 60
---

**On this page**
* [Using the `_internal` database](#using-the-internal-database)
* [Measurements in the `_internal` database](#internal-measurements-details)
  * **[ae](#ae-enterprise-only)** (E)
    * [bytesRx](#bytesrx)
    * [errors](#errors)
    * [jobs](#jobs)
    * [jobsActive](#jobsactive)
  * **[cluster](#cluster-enterprise-only)** (E)
    * [copyShardReq](#copyshardreq)
    * [createIteratorReq](#createiteratorreq)
    * [expandSourcesReq](expandsourcereq)
    * [fieldDimensionsReq](#fielddimensionreq)
    * [iteratorCostReq](#iteratorcostreq)
    * [removeShardReq](#removeshardreq)
    * [writeShardFail](#writeshardfail)
    * [writeShardPointsReq](#writeshardpointsreq)
    * [writeShardReq](#writeshardreq)
  * **[cq](#cq)**
    * [queryFail](#queryfail)
    * [queryOk](#queryok)
  * **[database](#database)**
    * [numMeasurements](#nummeasurements)
    * [numSeries](#numseries)
  * **[hh](#hh-enterprise-only)** (E)
    * [writeShardReq](#writeshardreq)
    * [writeShardReqPoints](#writeshardreqpoints)
  * **[hh_processor](#hh_processor-enterprise-only)** (E)
    * [bytesRead](#bytesread)
    * [bytesWritten](#byteswritten)
    * [queueBytes](#queuebytes)
    * [queueDepth](#queuedepth)
    * [writeBlocked](#writeblocked)
    * [writeDropped](#writedropped)
    * [writeNodeReq](#writenodereq)
    * [writeNodeReqFail](#writenodereqfail)
    * [writeNodeReqPoints](#writenodereqpoints)
    * [writeShardReq](#writeshardreq)
    * [writeShardReqPoints](#writeshardreqpoints)
  * **[httpd](#httpd)**
    * [authFail](#authfail)
    * [clientError](#clienterror)
    * [pingReq](#pingreq)
    * [pointsWrittenDropped](#pointswrittendropped)
    * [pointsWrittenFail](#pointswrittenfail)
    * [pointsWrittenOK](#pointswrittenok)
    * [promReadReq](#promreadreq)
    * [promWriteReq](#promwritereq)
    * [queryReq](#queryreq)
    * [queryReqDurationNs](#queryreqdurationns)
    * [queryRespBytes](#queryrespbytes)
    * [recoveredPanics](#recoveredpanics)
    * [req](#req)
    * [reqActive](#reqactive)
    * [reqDurationNs](#reqdurationns)
    * [serverError](#servererror)
    * [statusReq](#statusreq)
    * [writeReq](#writereq)
    * [writeReqActive](#writereqactive)
    * [writeReqBytes](#writereqbytes)
    * [writeReqDurationNs](#writereqdurationns)
  * **[queryExecutor](#queryexecutor)**
    * [queriesActive](#queriesactive)
    * [queriesExecuted](#queriesexecuted)
    * [queriesFinished](#queriesfinished)
    * [queryDurationNs](#querydurationns)
    * [recoveredPanics](#recoveredpanics)
  * **[rpc](#rpc-enterprise-only)** (E)
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
  * **[runtime](#runtime)**
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
  * **[shard](#shard)**
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
  * **[subscriber](#subscriber)**
    * [createFailures](#createfailures)
    * [pointsWritten](#pointswritten)
    * [writeFailures](#writefailures)
  * **[tsm1_cache](#tsm1-cache)**
    * [WALCompactionTimeMs](#walcompationtimems)
    * [cacheAgeMs](#cacheagems)
    * [cachedBytes](#cachedbytes)
    * [diskBytes](#diskbytes)
    * [memBytes](#membytes)
    * [snapshotCount](#snapshotcount)
    * [writeDropped](#writedropped)
    * [writeErr](#writeerr)
    * [writeOk](#writeok)
  * **[tsm1_engine](#tsm1-engine)**
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
    * [tsmLevel1CompactionsActive](tsmlevel1compactionsactive)
    * [tsmLevel2CompactionDuration](#tsmlevel2compactionduration)
    * [tsmLevel2CompactionErr](#tsmlevel2compactionerr)
    * [tsmLevel2CompactionQueue](#tsmlevel2compactionqueue)
    * [tsmLevel2Compactions](#tsmlevel2compactions)
    * [tsmLevel2CompactionsActive](#tsmlevel2compactionsactive)
    * [tsmLevel3CompactionDuration](#tsmlevel3compactionduration)
    * [tsmLevel3CompactionErr](#tsmlevel3compactionerr)
    * [tsmLevel3CompactionQueue](#tsmlevel3compactionqueue)
    * [tsmLevel3Compactions](#tsmlevel3compactions)
    * [tsmLevel3CompactionsActive](#tsmlevel3compactionactive)
    * [tsmOptimizeCompactionDuration](#tsmoptimizecompactionduration)
    * [tsmOptimizeCompactionErr](#tsmoptimizecompactionerr)
    * [tsmOptimizeCompactionQueue](#tsmoptimizecompactionqueue)
    * [tsmOptimizeCompactions](#tsmoptimizecompactions)
    * [tsmOptimizeCompactionsActive](#tsmoptimizecompactionactive)
  * **[tsm1_filestore](#tsm1-filestore)**
    * [diskBytes](#diskbytes)
    * [numFiles](#numfiles)
  * **[tsm1_wal](#tsm1-wal)**
    * [currentSegmentDiskBytes](#currentsegmentdiskbytes)
    * [oldSegmentsDiskBytes](#oldsegmentsdiskbytes)
    * [writeErr](#writeerr)
    * [writeOk](#writeok)
  * **[write](#write)**
    * [pointReq](#pointreq)
    * [pointReqHH](#pointreqhh) (E)
    * [pointReqLocal](#pointreqlocal)
    * [pointReqRemote](#pointreqremote) (E)
    * [req](#req)
    * [subWriteDrop](#subwritedrop)
    * [subWriteOk](#subwriteok)
    * [writeDrop](#writedrop)
    * [writeError](#writeerror)
    * [writeOk](#writeok)
    * [writePartial](#writepartial)
    * [writeTimeout](#writetimeout)


## Using the `_internal` database

The `_internal` database




## Measuremments in the `_internal` database



### ae (E)

The measurement statistics related to Anti-Entropy (AE) used in InfluxDB Enterprise clusters.

#### bytesRx

* ???
* Data type: integer

#### errors

* ???
* Data type:
* Used in "Anti-Entropy Errors"
* Examples
  * "Anti-Entropy Errors" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#anti-entropy-errors) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#anti-entropy-errors) dashboards.

#### jobs

* ???
* Data type: integer

#### jobsActive

* Number of active jobs in Anti-Entropy (AE)
* Data type: integer
* Examples
  * "Anti-Entropy Jobs" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#anti-entropy-jobs) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#anti-entropy-jobs) dashboards.

_____

### cluster

The measurement statistics related to clusters.

####  copyShardReq

* Data type: integer

####  createIteratorReq

* Data type: integer

####  expandSourcesReq

* Data type: integer

####  fieldDimensionsReq

* Data type: integer

####  iteratorCostReq

* Data type: integer

####  removeShardReq

* Data type: integer

#### writeShardFail

* Data type: integer

#### writeShardPointsReq

* Data type: integer

#### writeShardReq

* Data type: integer



_____

### cq

The statistics related to continuous queries (CQs).

#### queryFail

* ???
* Data type: integer
* Examples
  * "Continuous Queries Executed" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#continuous-queries-executed) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#continuous-queries-executed) dashboards.

#### queryOk

* ???
* Data type: integer
* Examples
  * "Continuous Queries Executed" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#continuous-queries-executed) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#continuous-queries-executed) dashboards.

--------  ---------

### database

#### numMeasurements

* The current number of measurements in the specified database.
* Data type: integer
* The series cardinality values are estimates, based on [HyperLogLog++ (HLL++)](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Examples:
  * "Measurements By Database" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#measurements-by-database) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#measurements-by-database) dashboards.

#### numSeries

* The current series cardinality of the specified database.
* Data type: integer
* The series cardinality values are estimates, based on [HyperLogLog++ (HLL++)](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Examples
  * "Series Cardinality By Database metric" in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#series-cardinality-by-database) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#series-cardinality-by-database) dashboards.



_____

### hh [Enterprise only]

The `hh` measurement statistics are related to Hinted Handoff (HH) in InfluxDB Enterprise.

#### writeShardReq

* The number of write shard requests. ???
* Data type: integer

#### writeShardReqPoints

* The number of points written during write shard requests. ???
* Data type: integer



_____

### hh_processor [Enterprise only]

The `hh_processor` measurement statistics are related to the Hinted Handoff (HH) processor in InfluxDB Enterprise.

> **Note:** The `hh_processor` statistics against a host are only accurate for the lifecycle of the current process. If the process crashes or restarts, `bytesRead` and `bytesWritten` are reset to zero, even if the HH queue was non-empty. (From https://github.com/influxdata/plutonium/issues/539.)

#### bytesRead

* The size, in bytes, of points read from a remote node.
* **Note:** Resets to zero after crash or restart, even if the HH queue was non-empty.
* Data type: integer

#### bytesWritten

* The size, in bytes, of points written to a remote node.
* **Note:** Resets to zero after crash or restart, even if the HH queue was non-empty.
* Data type: integer

#### queueBytes

* The total size, in bytes, remaining in the queue.
* Data type: integer
* Should remain correct across restarts, unlike `bytesRead` and `bytesWritten` (See https://github.com/influxdata/docs.influxdata.com/issues/780)
  * See PR on `max-values-per-tag` limit and effects on this field key (https://github.com/influxdata/docs.influxdata.com/issues/780).
  * Examples:
    * "Hinted Handoff Queue Size" in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#hinted-handoff-queue-size) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#hinted-handoff-queue-size) dashboards.

#### queueDepth

* The total number of segments in the Hinted Handoff queue. The HH queue is a sequence of 10MB "segment" files.
* The `queueDepth` values can give you a sense of when a queue is growing or shrinking.
* Data type: integer

####  writeBlocked

* The number of writes blocked (and thus ) because the number of concurrent HH requests exceeds the limit.
* Data type: integer

####  writeDropped

* The number of writes dropped from the HH queue and appeared to be corrupted and was therefore dropped.
* Data type: integer

####  writeNodeReq

* Data type: integer

####  writeNodeReqFail

* Data type: integer

####  writeNodeReqPoints

* Data type: integer

####  writeShardReq

* Data type: integer

####  writeShardReqPoints

* Data type: integer

_____

### httpd

The `httpd` measurement statistics are related to the InfluxDB HTTP server.

####  authFail

* The number of HTTP requests that were aborted due to authentication being required but not supplied or incorrect.
* Data type: integer

####  clientError

* The number of HTTP responses due to client errors, with a `4XX` HTTP status code.
* Data type: integer
* Used in "HTTP Requests"
* Examples:
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-requests-per-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-requests-per-minute) dashboards.


####  pingReq

* The number of times InfluxDB HTTP server served the `/ping` HTTP endpoint.
* Data type: integer

####  pointsWrittenDropped

* The number of points dropped by the storage engine.
* Data type: integer

####  pointsWrittenFail

* The number of points accepted by the `/write` HTTP endpoint, but unable to be persisted.
* Data type: integer

####  pointsWrittenOK

* The number of points accepted by the `/write` HTTP endpoint and persisted successfully.
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
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-request-duration--99th-%-) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-request-duration--99th-%-) dashboards.
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-requests-per-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-requests-per-minute) dashboards.

####  queryReqDurationNs

* The total query request duration, in nanosecond (ns).
* Data type: integer
* Examples:
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-request-duration--99th-%-) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-request-duration--99th-%-) dashboards.

####  queryRespBytes

* The sum of all bytes returned in query responses.
* Data type: integer

####  recoveredPanics

* The number of panics recovered by the HTTP handler.
* Data type: integer

####  req

* The number of HTTP requests served.
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
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-requests-per-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-requests-per-minute) dashboards.

####  statusReq

* The number of status requests served using the HTTP `/status` endpoint.
* Data type: integer

####  writeReq

* The number of write requests served using the HTTP `/write` endpoint.
* Data type: integer
* Examples
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-request-duration--99th-%-) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-request-duration--99th-%-) dashboards.
  * "HTTP Requests Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-requests-per-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-requests-per-minute) dashboards.

####  writeReqActive

* The number of currently active write requests.
* Data type: integer

####  writeReqBytes

* The total size, in bytes, of line protocol data received by write requests, using the HTTP `/write` endpoint.
* Data type: integer

####  writeReqDurationNs

* The duration (wall time), in nanoseconds, of write requests served using the `/write` HTTP endpoint.
* Data type: integer
* Examples
  * "HTTP Request Duration (99th %)" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#http-request-duration-99th-%) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#http-request-duration-99th-%) dashboards.

-----

### queryExecutor

The `queryExecutor` statistics related to usage of the Query Executor of the InfluxDB engine.

####  queriesActive

* The number of queries currently being handled.
* Data type: integer

#####  queriesExecuted

* The number of queries executed (started).
* Data type: integer
* Examples
  * "Queries Executed Per Minute" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#queries-executed-per-minute) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#queries-executed-per-minute) dashboards.

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

### rpc [Enterprise only]

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

* The total number of RPC failures, which are errors that did not recover.
* Data type: integer

####  rpcReadBytes

* The total number of bytes read.
* Data type: integer

####  rpcRetries

* The total number of RPC calls that retried at least once.
* Data type: integer

####  rpcWriteBytes

* The total number of bytes written.
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

The `runtime` measurement statistics include a subset of MemStats records statistics about the Go memory allocator.

The [Go runtime package](https://golang.org/pkg/runtime/) contains operations that interact with Go's runtime system, including functions used to control goroutines. It also includes the low-level type information used by the [Go reflect package](https://golang.org/pkg/reflect/).

####  Alloc

* The size, in bytes, of allocated heap objects.
* Data type: integer

####  Frees

* The cumulative number of freed heap objects.
* Data type: integer

####  HeapAlloc

* The size, in bytes, of all heap objects.
* Data type: integer

####  HeapIdle

* The size, in bytes, of idle heap objects.
* Data type: integer

####  HeapInUse

* The size, in bytes, in in-use spans.
* Data type: integer
* Examples
  * "Heap Size" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring#heap-size) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring#heap-size) dashboards.

####  HeapObjects

* The number of allocated heap objects.
* Data type: integer

####  HeapReleased

* The size, in bytes, of physical memory returned to the OS.
* Data type: integer

####   HeapSys

* The size, in bytes, of heap memory obtained from the OS.
* Measures the amount of virtual address space reserved for the heap.
* Data type: integer

####  Lookups

* The number of pointer lookups performed by the runtime.
* Primarily useful for debugging runtime internals.
* Data type: integer

####  Mallocs

* The cumulative count of heap objects allocated.
* The number of live objects is Mallocs - Frees.
* Data type: integer

#### NumGC

* Data type: integer

####  NumGoroutine

* The number of Go routines.
* Data type: integer

#### PauseTotalNs

* The length of total pause, in nanoseconds.
* Data type: integer

#### Sys

* The total bytes of memory obtained from the OS.
* Measures the virtual address space reserved by Go runtime for the heap, stacks, and other internal data structures.
* Data type: integer

#### TotalAlloc

* The cumulative bytes allocated for heap objects.
* Does not decrease when objects are freed.
* Data type: integer

____

### shard

The `shard` measurement statistics are related to working with shards in InfluxDB OSS and InfluxDB Enterprise.

#### diskBytes
- Data type: integer

#### fieldsCreate
- Data type: integer

#### seriesCreate

- Data type: integer

#### writeBytes

* Data type: integer

#### writePointsDropped

* Incremented when a point is dropped from a write.
* Also, `http.pointsWrittentDropped` incremented when a point is dropped from a write. (See https://github.com/influxdata/docs.influxdata.com/issues/780)
* Data type: integer

#### writePointsErr

* ???
* Data type: integer

#### writePointsOk

* ???
* Data type: integer

#### writeReq

* ???
* Data type: integer

#### writeReqErr

* ???
* Data type: integer

#### writeReqOk

* ???
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

#### WALCompactionTimeMs

* The total number of milliseconds (ms) spent compacting snapshots.
* Data type: integer

#### cacheAgeMs

* The number of milliseconds (ms) since cache was last snapshotted at sample time.
* Data type: integer

#### cachedBytes

* The total number of bytes written into snapshots.
* Data type: integer

#### diskBytes

* The size, in bytes, of on-disk snapshots.
* Data type: integer

#### memBytes

* The size, in bytes, of in-memory cache.
* Data type: integer

#### snapshotCount

* The number of active snapshots.
* Data type: integer

#### writeDropped

* ???
* Data type: integer

#### writeErr

* ???
* Data type: integer

#### writeOk

* ???
* Data type: integer

____

### tsm1_engine

The `tsm1_engine` measurement statistics are related to the usage of the TSM storage engine.

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

The `write` measurement statistics are related to writing data to InfluxDB OSS and InfluxDB Enterprise.

#### pointReq

* The total number of attempted point requests.
* Data type: integer
* Examples
  * "Points Throughput / Minute by Hostname" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-oss-monitoring/) and [InfluxDB Enterprise Stats](/platform/monitoring/dashboard-enterprise-monitoring/) dashboards

#### pointReqHH [Enterprise only]

* The total number of attempted point requests to Hinted Handoff (HH).

* Data type: integer

#### pointReqLocal

* The total number of point requests that have been attempted to be written into a shard on the local node.
* Data type: integer

#### pointReqRemote [Enterprise only]

* The total number of point requests that have been attempted to be written into a shard on a  remote node.
* Data type: integer

#### req

* The total number of write requests, for batches of points, that have been attempted to be written.
* Data type: integer

#### subWriteDrop

* The total number of batch write requests to  subscribers that were dropped due to contention or write saturation.
* Data type: integer

#### subWriteOk

* The total number of batch write requests that were successfully written to subscribers.
* Data type: integer

#### writeDrop

* The total number of write requests for points that have been dropped due to timestamps not matching any existing retention policies.
* Data type: integer

#### writeError

* The total number of batch requests that  attempted to be written to a shard but failed.
* Data type: integer
* Examples
  * "Shard Write Errors" metric in [InfluxDB OSS Stats](/platform/monitoring/dashboard-enterprise-monitoring#shard-write-errors/#shard-write-errors) and [InfluxDB Enterprise Statistics](/platform/monitoring/dashboard-enterprise-monitoring#shard-write-errors) dashboards

#### writeOk

* The total number of batch requests that were successfully written to a shard.
* Data type: integer

#### writePartial [Enterprise only]

* ???
* Data type: integer

#### writeTimeout

* The total number of write requests that failed due to timing out.
* Data type: integer
