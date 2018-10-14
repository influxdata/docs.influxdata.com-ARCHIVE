









# Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise  (_internal)







On this page
* [ae](#ae-enterprise-only) (E)
  * [bytesRx](#bytesrx)
  * [errors](#errors)
  * [jobs](#jobs)
  * [jobsActive](#jobsactive)
* [cluster](#cluster-enterprise-only) (E)
  * [copyShardReq](#copyshardreq)
  * [createIteratorReq](#createiteratorreq)
  * [expandSourcesReq](expandsourcereq)
  * [fieldDimensionsReq](#fielddimensionreq)
  * [iteratorCostReq](#iteratorcostreq)
  * [removeShardReq](#removeshardreq)
  * [writeShardFail](#writeshardfail)
  * [writeShardPointsReq](#writeshardpointsreq)
  * [writeShardReq](#writeshardreq)
* [cq](#cq)
  * [queryFail](#queryfail)
  * [queryOk](#queryok)
* [database](#database)
  * [numMeasurements](#nummeasurements)
  * [numSeries](#numseries)
* [hh](#hh-enterprise-only) (E)
  * [writeShardReq](#writeshardreq)
  * [writeShardReqPoints](#writeshardreqpoints)
* [hh_processor](#hh_processor-enterprise-only) (E)
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
* [httpd](#httpd)
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
* [queryExecutor](#queryexecutor)
  * [queriesActive](#queriesactive)
  * [queriesExecuted](#queriesexecuted)
  * [queriesFinished](#queriesfinished)
  * [queryDurationNs](#querydurationns)
  * [recoveredPanics](#recoveredpanics)
* [rpc](#rpc-enterprise-only) (E)
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
  * [WALCompactionTimeMs](#walcompationtimems)
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
* [tsm1_filestore](#tsm1-filestore)
  * [diskBytes](#diskbytes)
  * [numFiles](#numfiles)
* [tsm1_wal](#tsm1-wal)
  * [currentSegmentDiskBytes](#currentsegmentdiskbytes)
  * [oldSegmentsDiskBytes](#oldsegmentsdiskbytes)
  * [writeErr](#writeerr)
  * [writeOk](#writeok)
* [write](#write)
  * [pointReq](#pointreq)
  * [pointReqHH](#pointreqhh)
  * [pointReqLocal](#pointreqlocal)
  * [pointReqRemote](#pointreqremote)
  * [req](#req)
  * [subWriteDrop](#subwritedrop)
  * [subWriteOk](#subwriteok)
  * [writeDrop](#writedrop)
  * [writeError](#writeerror)
  * [writeOk](#writeok)
  * [writePartial](#writepartial)
  * [writeTimeout](#writetimeout)



## ae (E)

The measurement statistics related to Anti-Entropy (AE) used in InfluxDB Enterprise clusters.

### bytesRx

* ???
* Data type: integer

### errors

* ???
* Data type:
* Used in "Count of AE Errors"

### jobs

* ???
* Data type: integer

### jobsActive

* Number of active jobs in Anti-Entropy (AE)
* Data type: integer
* Used in "Count of AE Jobs"



____

## cluster

The measurement statistics related to clusters.

### copyShardReq

* Data type: integer

### createIteratorReq

* Data type: integer

### expandSourcesReq

* Data type: integer

### fieldDimensionsReq

* Data type: integer

### iteratorCostReq

* Data type: integer

### removeShardReq

* Data type: integer

### writeShardFail

* Data type: integer

### writeShardPointsReq

* Data type: integer

### writeShardReq

* Data type: integer



_____

## cq

The statistics related to continuous queries (CQs).

### queryFail

* Data type: integer
* Used in "CQs executed per minute"

### queryOk

* Data type: integer
* Used in "CQs executed per minute"

--------  ---------

## database

### numMeasurements

* Number of measurements in the specified database
* Data type: integer
* Values are estimates, currently implemented using [HyperLogLog++ (HLL++) estimation](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Used in "Number of Measurements by Database"

### numSeries

* Number of series in the specified database
* Data type: integer
* Values are estimates, currently implemented using [HyperLogLog++ (HLL++) estimation](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Used in "Series Cardinality by Database"



_____

## hh [Enterprise only]

The `hh` measurement statistics are related to Hinted Handoff (HH) in InfluxDB Enterprise.

### writeShardReq

* The number of write shard requests. ???
* Data type: integer

### writeShardReqPoints

* The number of points written during write shard requests. ???
* Data type: integer



_____

## hh_processor [Enterprise only]

The `hh_processor` measurement statistics are related to the Hinted Handoff (HH) processor in InfluxDB Enterprise.

> **Note:** The `hh_processor` statistics against a host are only accurate for the lifecycle of the current process. If the process crashes or restarts, `bytesRead` and `bytesWritten` are reset to zero, even if the HH queue was non-empty. (From https://github.com/influxdata/plutonium/issues/539.)

### bytesRead

* The size, in bytes, of points read from a remote node.
* **Note:** Resets to zero after crash or restart, even if the HH queue was non-empty.
* Data type: integer

### bytesWritten

* The size, in bytes, of points written to a remote node.
* **Note:** Resets to zero after crash or restart, even if the HH queue was non-empty.
* Data type: integer

### queueBytes

* The total size, in bytes, remaining in the queue.
* Data type: integer
* Should remain correct across restarts, unlike `bytesRead` and `bytesWritten` (See https://github.com/influxdata/docs.influxdata.com/issues/780)
  * See PR on `max-values-per-tag` limit and effects on this field key (https://github.com/influxdata/docs.influxdata.com/issues/780).
* Used in "Hinted Handoff Queue Size"

### queueDepth

* The number of segments in the queue.
* Can give you a sense of when a queue is growing or shrinking.
* Data type: integer

### writeBlocked

* The number of writes dropped because the number of concurrent HH requests exeeds the limit.
* Data type: integer

### writeDropped

* Increments for every point that was read from the HH queue and appeared to be corrupted and was therefore dropped.
* Data type: integer

### writeNodeReq

* Data type: integer

### writeNodeReqFail

* Data type: integer

### writeNodeReqPoints

* Data type: integer

### writeShardReq

* Data type: integer

### writeShardReqPoints

* Data type: integer

_____

## httpd

The `httpd` measurement statistics are related to the InfluxDB HTTP server.

### authFail

* The number of HTTP requests that were aborted due to authentication being required but not supplied or incorrect.
* Data type: integer

### clientError

- The number of HTTP responses due to client errors, with a 4XX status code.
- Data type: integer
- Used in "HTTP Request per Minute"


### pingReq

* The number of times InfluxDB HTTP server served the /ping HTTP endpoint.
* Data type: integer

### pointsWrittenDropped

* The number of points dropped by the storage engine.
* Data type: integer

### pointsWrittenFail

* The number of points accepted by the /write HTTP endpoint but was unable to be persisted.
* Data type: integer

### pointsWrittenOK

* The number of points accepted by the /write HTTP endpoint and persisted successfully.
* Data type: integer

### promReadReq

* The number of read requests to the Prometheus endpoint.
* Data type: integer

### promWriteReq

* The number of write requests to the Prometheus endpoint.
* Data type: integer

### queryReq

* The number of query requests.
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests per Minute"

### queryReqDurationNs

* The total query request duration, in nanosecond (ns).
* Data type: integer
* Used in "HTTP Request Duration (99th %)"

### queryRespBytes

* The sum of all bytes returned in query responses.
* Data type: integer

### recoveredPanics

* The number of panics recovered by the HTTP handler.
* Data type: integer

### req

* The number of HTTP requests served.
* Data Type: integer

### reqActive  

* The number of currently active requests.
* Data type: integer

### reqDurationNs

* The cumulative duration, in (wall-time) nanoseconds (ns), spent inside requests.
* Data type: integer

### serverError

* The number of HTTP responses due to server errors.
* Data type: integer
* Used in "HTTP Request per Minute"

### statusReq

* The number of status requests served using the /status HTTP endpoint.
* Data type: integer

### writeReq

* The number of write requests served using the /write HTTP endpoint.
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests per Minute"

### writeReqActive

* The number of currently active write requests.
* Data type: integer

### writeReqBytes

* The total size, in bytes, of line protocol data received by write requests, using the /write HTTP endpoint.
* Data type: integer

### writeReqDurationNs

* The total duration, in nanoseconds (ns), of write requests served using the /write HTTP endpoint.
* Data type: integer
* Used in "HTTP Request Duration (99th %)"

-----

## queryExecutor

The statistics related to the Query Executor of the InfluxDB engine.

### queriesActive

* The number of queries currently being handled.
* Data type: integer

### queriesExecuted

* The number of queries executed (started)
* Data type: integer
* Used in "Queries Executed per Minute"

### queriesFinished

* The number of queries that have finished executing.
* Data t type: integer

### queryDurationNs

* The cumulative wall time, in nanoseconds, of every query executed.
* Data type: integer

### recoveredPanics

* The number of panics recovered by the Query Executor.
* Data type: integer



_____

## rpc [Enterprise only]

The `rpc` measurement statistics are related to the use of RPC calls within InfluxDB Enterprise clusters.

### idleStreams

* The number of idle multiplexed streams across all live TCP connections.
* Data type: integer

### liveConnections

* The number of live TCP connections to other nodes.
* Data type: integer

### liveStreams

*  The number of live multiplexed streams across all live TCP connections.
* Data type: integer

### rpcCalls

* The total number of RPC calls made to remote nodes.
* Data type: integer

### rpcFailures

* The total number of RPC failures, which are errors that did not recover.
* Data type: integer

### rpcReadBytes

* The total number of bytes read.
* Data type: integer

### rpcRetries

* The total number of RPC calls that retried at least once.
* Data type: integer

### rpcWriteBytes

* The total number of bytes written.
* Data type: integer

### singleUse

* The total number of single-use connections opened via Dial.
* Data type: integer

### singleUseOpen

* The number of single-use connections currently open.
* Data type: integer

### totalConnections

* The total number of TCP connections that have been established.
* Data type: integer

### totalStreams

* The total number of streams established.
* Data type: integer

-----

## runtime

The `runtime` measurement statistics include a subset of MemStats records statistics about the Go memory allocator.

The [Go runtime package](https://golang.org/pkg/runtime/) contains operations that interact with Go's runtime system, including functions used to control goroutines. It also includes the low-level type information used by the [Go reflect package](https://golang.org/pkg/reflect/).

### Alloc

* The size, in bytes, of allocated heap objects.
* Data type: integer

### Frees

* The cumulative number of freed heap objects.
* Data type: integer

### HeapAlloc

* The size, in bytes, of all heap objects.
* Data type: integer

### HeapIdle

* The size, in bytes, of idle heap objects.
* Data type: integer

### HeapInUse

* The size, in bytes, in in-use spans.
* Data type: integer
* Used in "Heap Size"

### HeapObjects

* The number of allocated heap objects.
* Data type: integer

### HeapReleased

* The size, in bytes, of physical memory returned to the OS.
* Data type: integer

###  HeapSys

* The size, in bytes, of heap memory obtained from the OS.
* Measures the amount of virtual address space reserved for the heap.
* Data type: integer

### Lookups

* The number of pointer lookups performed by the runtime.
* Primarily useful for debugging runtime internals.
* Data type: integer

### Mallocs

* The cumulative count of heap objects allocated.
* The number of live objects is Mallocs - Frees.
* Data type: integer

### NumGC

* Data type: integer

#### NumGoroutine

* The number of Go routines.
* Data type: integer

### PauseTotalNs

* The length of total pause, in nanoseconds.
* Data type: integer

### Sys

* The total bytes of memory obtained from the OS.
* Measures the virtual address space reserved by Go runtime for the heap, stacks, and other internal data structures.
* Data type: integer

### TotalAlloc

* The cumulative bytes allocated for heap objects.
* Does not decrease when objects are freed.
* Data type: integer

____

## shard

The `shard` measurement statistics are related to working with shards in InfluxDB OSS and InfluxDB Enterprise.

### diskBytes
- Data type: integer

### fieldsCreate
- Data type: integer

### seriesCreate

- Data type: integer

### writeBytes

* Data type: integer

### writePointsDropped

* Incremented when a point is dropped from a write.
* Also, `http.pointsWrittentDropped` incremented when a point is dropped from a write. (See https://github.com/influxdata/docs.influxdata.com/issues/780)
* Data type: integer

### writePointsErr

* ???
* Data type: integer

### writePointsOk

* ???
* Data type: integer

### writeReq

* ???
* Data type: integer

### writeReqErr

* ???
* Data type: integer

### writeReqOk

* ???
* Data type: integer

____

## subscriber

The `subscriber` measurement statistics are related to the usage of InfluxDB subscriptions.

### createFailures

* Number of failures creating a subscription. ???
* Data type: integer

### pointsWritten  

* Number of points written successfully to ???
* Data type: integer

### writeFailures  

* Number of failures to write to ???
* Data type: integer

______

## tsm1_cache

The `tsm1_cache` measurement statistics are related to the usage of the TSM cache.

### WALCompactionTimeMs

* The total number of milliseconds (ms) spent compacting snapshots.
* Data type: integer

### cacheAgeMs

* The number of milliseconds (ms) since cache was last snapshotted at sample time.
* Data type: integer

### cachedBytes

* The total number of bytes written into snapshots.
* Data type: integer

### diskBytes

* The size, in bytes, of on-disk snapshots.
* Data type: integer

### memBytes

* The size, in bytes, of in-memory cache.
* Data type: integer

### snapshotCount

* The number of active snapshots.
* Data type: integer

### writeDropped

* ???
* Data type: integer

### writeErr

* ???
* Data type: integer

### writeOk

* ???
* Data type: integer

____

## tsm1_engine

The `tsm1_engine` measurement statistics are related to the usage of the TSM storage engine.

### cacheCompactionDuration       

* Counter of number of wall nanoseconds spent in cache compactions.

* Data type: integer

### cacheCompactionErr

* Counter of cache compactions that have failed due to error.
* Data type: integer

### cacheCompactions              

* Counter of cache compactions that have ever run.
* Data type: integer

### cacheCompactionsActive

* Gauge of cache compactions currently running.
* Data type: integer

### tsmFullCompactionDuration

* Counter of number of wall nanoseconds spent in full compactions.
* Data type: integer

### tsmFullCompactionErr

* Counter of full compactions that have failed due to error.
* Data type: integer

### tsmFullCompactionQueue

* ???

* Data type: integer

### tsmFullCompactions

* Counter of full compactions that have ever run.
* Data type: integer

### tsmFullCompactionsActive

* Gauge of full compactions currently running.
* Data type: integer

### tsmLevel1CompactionDuration

* Data type: integer

### tsmLevel1CompactionErr

* Data type: integer

### tsmLevel1CompactionQueue

* Data type: integer

### tsmLevel1Compactions

* Data type: integer

### tsmLevel1CompactionsActive

* Data type: integer

#### tsmLevel2CompactionDuration

* Data type: integer

### tsmLevel2CompactionErr

* Data type: integer

### tsmLevel2CompactionQueue

* Data type: integer

### tsmLevel2Compactions

* Data type: integer

### tsmLevel2CompactionsActive    

* Data type: integer

### tsmLevel3CompactionDuration   

* Data type: integer

### tsmLevel3CompactionErr

* Data type: integer

### tsmLevel3CompactionQueue      

* Data type: integer

### tsmLevel3Compactions

* Data type: integer

### tsmLevel3CompactionsActive

* Data type: integer

### tsmOptimizeCompactionDuration

* Counter of number of wall nanoseconds spent in optimize compactions.
* Data type: integer

### tsmOptimizeCompactionErr

* Counter of optimize compactions that have failed due to error.
* Data type: integer

### tsmOptimizeCompactionQueue

* ???
* Data type: integer

### tsmOptimizeCompactions

* Counter of optimize compactions that have ever run
* Data type: integer

### tsmOptimizeCompactionsActive

* Gauge of optimize compactions currently running.
* Data type: integer



____

### tsm1_filestore

The `tsm1_filestore` measurement statistics are related to the usage of the TSM filestore.

### diskBytes

* Bytes of disk usage by TSM file store.
* Data type: integer

### numFiles

* Number of files in the TSM file store.
* Data type: integer

____

### tsm1_wal

The `tsm1_wal` measurement statistics are related to the usage of the TSM Write Ahead Log (WAL).

### currentSegmentDiskBytes

* Data type: integer

### oldSegmentDiskBytes

* Data type: integer

### writeErr

* Data type: integer

### writeOK

* Data type: integer



_____

## write

The `write` measurement statistics are related to writing to InfluxDB OSS and InfluxDB Enterprise.

### pointReq

* Incremented after each attempted point request.
* Data type: integer
* Used in "Per-host Point Throughput per Minute"

### pointReqHH [Enterprise only]

* ???

* Data type: integer

### pointReqLocal

* Incremented after every attempted point request to be written into a shard.
* Data type: integer

### pointReqRemote [Enterprise only]

* ???
* Data type: integer

### req

* Incremented every time a batch of points attempts to be written.
* Data type: integer

### subWriteDrop

* Incremented every time a batch write to a subscriber is dropped due to contention or write saturation.
* Data type: integer

### subWriteOk

* Incremented every time a batch write to a subscriber is successful.
* Data type: integer

### writeDrop

* Incremented after every point that is dropped due to having a timestamp that does not match an existing retention policy.
* Data type: integer

### writeError

* Incremented after every batch that was attempted to be written to a shard but failed.
* Data type: integer
* Used in "Shard Write Errors"

### writeOk

* Incremented for every batch that was successfully written to a shard.
* Data type: integer

### writePartial [Enterprise only]

* ???
* Data type: integer

### writeTimeout

* Incremented every time a write fails due to timing out.
* Data type: integer
