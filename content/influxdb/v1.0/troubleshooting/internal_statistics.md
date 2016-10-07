
# Introduction

InfluxDB periodically samples and stores metrics about its own operations. 
The metrics are stored in the `_internal` database and can be queried, downsampled, passed to Kapacitor, etc. just like any other data in the system.

The metrics in `_internal` are recorded periodically as determined by the `monitor.store-interval` configuration setting.
For a view of the internal metrics at the current instant in time, use the `SHOW STATS` query.

The internal metrics are primarily intended for debugging and tuning InfluxDB.
We do not make any guarantees about which internal metrics remain across different versions of InfluxDB.

# Using `_internal`

## Important numbers to watch

TODO: list the ones that matter, linking to their definition below.

## Examples queries on `_internal`

TODO: a few examples showing good and problematic query responses for some or all of the above numbers

# Metric definitions

## collectd

The `collectd` measurement tracks statistics about the collectd service.
This measurement will only be present if the collectd service plugin is enabled.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| batchesTx | integer | none |
| batchesTxFail | integer | none |
| bytesRx | integer | bytes |
| droppedPointsInvalid | integer | none |
| pointsParseFail | integer | none |
| pointsRx | integer | none |
| pointsTx | integer | none |
| readFail | integer | none |

### batchesTx

The `batchesTx` statistic is incremented for every batch of points the collectd service successfully sends to the InfluxDB write layer.

### batchesTxFail

The `batchesTxFail` statistic is incremented for every batch of points the collectd service fails to send to the InfluxDB write layer.

### bytesRx

The `bytesRx` statistic is incremented for every byte that the collectd service successfully reads via its UDP connection.

### droppedPointsInvalid

The `droppedPointsInvalid` statistic is incremented for every point that was received by the collectd service but unable to be converted to an InfluxDB point successfully.

### pointsParseFail

The `pointsParseFail` statistic is incremented any time the collectd service receives a packet that could not be parsed into the collectd format.

### pointsRx

The `pointsRx` statistic is incremented for every point accepted by the collectd service.

### pointsTx

The `pointsTx` statistic is incremented for every point the collectd service successfully sends to the InfluxDB write layer.

### readFail

The `readFail` statistic is incremented any time the collectd service fails to correctly read a packet from its UDP connection.

## cq

The `cq` measurement tracks statistics about the continuous query executor.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| queryFail |  integer | none |
| queryOk | integer | none |

### queryFail

The `queryFail` statistic is incremented whenever a continuous query is executed but fails.

### queryOk

The `queryOk` statistic is incremented whenever a continuous query is executed without a failure.
Note that this value may be incremented in some cases where a CQ is initiated but does not actually run, e.g. due to misconfigured resample interals.

## database

The `database` measurement tracks statistics about the databases in InfluxDB.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| numMeasurements | integer | none |
| numSeries | integer | none |

### numMeasurements

The `numMeasurements` statistic indicates the number of measurements in the database identified by the `database` tag.
This number should always be the same as if you were to manually count the output of `SHOW MEASUREMENTS` against the given database.

### numSeries

The `numSeries` statistic indicates the number of series in the database identified by the `database` tag.
This number should always be the same as if you were to manually count the output of `SHOW SERIES` against the given database.

## graphite

The `graphite` measurement tracks statistics about the graphite service.
This measurement will only be present if the graphite service plugin is enabled.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| batchesTx | integer | none |
| batchesTxFail | integer | none |
| bytesRx | integer | bytes |
| connsActive | integer | none |
| connsHandled | integer | none |
| pointsNanFail | integer | none |
| pointsParseFail | integer | none |
| pointsRx | integer | none |
| pointsTx | integer | none |

### batchesTx

The `batchesTx` statistic is incremented for every batch of points the graphite service successfully sends to the InfluxDB write layer.

### batchesTxFail

The `batchesTxFail` statistic is incremented for every batch of points the graphite service fails to send to the InfluxDB write layer.

### bytesRx

The `bytesRx` statistic is incremented for every byte that the collectd service successfully reads over TCP or UDP.

### connsActive

The `connsActive` statistic is incremented every time a TCP connection to a client is opened and decremented when the connection is closed.

### connsHandled

The `connsHandled` statistic is incremented every time a TCP connection to a client is opened.

### pointsNanFail

The `pointsNanFail` statistic is incremented any time the graphite service rejects a point whose value is _NaN_.

### pointsParseFail

The `pointsParseFail` statistic is incremented any time the graphite service receives a packet that could not be parsed into the graphite format.

### pointsRx

The `pointsRx` statistic is incremented for every point accepted by the graphite service.

### pointsTx

The `pointsTx` statistic is incremented for every point the graphite service successfully sends to the InfluxDB write layer.

## httpd

The `httpd` measurement tracks statistics about the InfluxDB HTTP server.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| authFail | integer | none |
| clientError | integer | none |
| cqReq | integer | none |
| pingReq | integer | none |
| pointsWrittenFail | integer | none |
| pointsWrittenOK | integer | none |
| queryReq | integer | none |
| queryReqDurationNs | integer | nanoseconds |
| queryRespBytes | integer | bytes |
| req | integer | none |
| reqActive | integer | none |
| reqDurationNs | integer | nanoseconds |
| serverError | integer | none |
| statusReq | integer | none |
| writeReq | integer | none |
| writeReqActive | integer | none |
| writeReqBytes | integer | bytes |
| writeReqDurationNs | integer | nanoseconds |

### authFail

The `authFail` statistic indicates how many HTTP requests were aborted due to authentication being required but unsupplied or incorrect.

### clientError

The `clientError` statistic is incremented every time InfluxDB sends an HTTP response with a 4XX status code.

### cqReq

The `cqReq` statistic is incremented every time there is an HTTP request to process continuous queries.
(The HTTP endpoint to process CQs is deprecated and this statistic will be removed in a future version of InfluxDB.)

### pingReq

The `pingReq` statistic is incremented every time InfluxDB serves the `/ping` HTTP endpoint.

### pointsWrittenFail

The `pointsWrittenFail` statistic is incremented for every _point_ (not every _batch_) that was accepted by the `/write` HTTP endpoint but was unable to be persisted, e.g. if writing to a database or retention policy that doesn't exist.

### pointsWrittenOK

The `pointsWrittenOK` statistic is incremented for every _point_ (not every _batch_) that was accepted by the `/write` HTTP endpoint and persisted successfully.

### queryReq

The `queryReq` statistic is incremented every time InfluxDB serves the `/query` HTTP endpoint.

### queryReqDurationNs

The `queryReqDurationNs` statistic tracks the cumulative [wall time](https://en.wikipedia.org/wiki/Wall-clock_time), in nanoseconds, of every query served.

Concurrently executed queries contribute to this statistic independently.
If one query took 1000 ns from start to finish, and another query took 500 ns from start to finish and ran before the first query finished, the statistic would increase by 1500.

### queryRespBytes

The `queryRespBytes` statistic is increased for every byte InfluxDB sends in a successful query response.

Note that for gzipped responses, the statistic tracks the number of bytes in the response prior to being compressed.

### req

The `req` statistic is incremented for every HTTP request InfluxDB receives.

### reqActive

The `reqActive` statistic is incremented when InfluxDB begins accepting an HTTP request and is decremented whenever InfluxDB finishes serving that request.
In other words, it tracks the number of HTTP requests being handled at this instant in time.

### reqDurationNs

The `reqReqDurationNs` statistic tracks the cumulative [wall time](https://en.wikipedia.org/wiki/Wall-clock_time), in nanoseconds, of every request served.

Concurrently served requests contribute to this statistic independently.
If one request took 1000 ns from start to finish, and another request took 500 ns from start to finish and ran before the first query finished, the statistic would increase by 1500.

### serverError

The `serverError` statistic is incremented every time InfluxDB sends an HTTP response with a 5XX status code.

### statusReq

The `statusReq` statistic is incremented every time InfluxDB serves the `/status` HTTP endpoint.
(The `/status` HTTP endpoint is deprecated and this statistic will be removed in a future version of InfluxDB.)

### writeReq

The `writeReq` statistic is incremented every time InfluxDB serves the `/write` HTTP endpoint.

### writeReqActive

The `writeReqActive` statistic is incremented when InfluxDB begins accepting an HTTP request to `/write` and is decremented whenever InfluxDB finishes serving that request.
In other words, it tracks the number of write requests over HTTP being handled at this instant in time.

### writeReqBytes

The `writeReqBytes` statistic tracks the total number of bytes of line protocol received by the `/write` endpoint.

Note that for gzipped requests, the statistic tracks the number of uncompressed bytes.

### writeReqDurationNs

The `writeReqDurationNs` statistic tracks the cumulative [wall time](https://en.wikipedia.org/wiki/Wall-clock_time), in nanoseconds, of every write request served.

Concurrently executed writes contribute to this statistic independently.
If one write took 1000 ns from start to finish, and another write took 500 ns from start to finish and ran before the first query finished, the statistic would increase by 1500.

## queryExecutor

The `queryExecutor` measurement tracks statistics about the query executor portion of the InfluxDB engine.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| queriesActive | integer | none |
| queryDurationNs | integer | nanoseconds |

### queriesActive

The `queriesActive` statistic is incremented when the InfluxDB engine begins executing a query and is decremented whenever the engine finishes executing that query.
In other words, it tracks the number of queries being handled at this instant in time.

### queryDurationNs

The `queryDurationNs` statistic tracks the cumulative [wall time](https://en.wikipedia.org/wiki/Wall-clock_time), in nanoseconds, of every query executed.

Concurrently executed writes contribute to this statistic independently.
If one query took 1000 ns from start to finish, and another query took 500 ns from start to finish and ran before the first query finished, the statistic would increase by 1500.

## opentsdb

The `opentsdb` measurement tracks statistics about the opentsdb service.
This measurement will only be present if the opentsdb service plugin is enabled.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| batchesTx | integer | none |
| batchesTxFail | integer | none |
| connsActive | integer | none |
| connsHandled | integer | none |
| droppedPointsInvalid | integer | none |
| httpConnsHandled | integer | none |
| pointsTx | integer | none |
| tlBadFloat | integer | none |
| tlBadLine | integer | none |
| tlBadTag | integer | none |
| tlBadTime | integer | none |
| tlBytesRx | integer | bytes |
| tlConnsActive | integer | none |
| tlConnsHandled | integer | none |
| tlPointsRx | integer | none |
| tlReadErr | integer | none |

### batchesTx

The `batchesTx` statistic is incremented for every batch of points the opentsdb service successfully sends to the InfluxDB write layer.

### batchesTxFail

The `batchesTxFail` statistic is incremented for every batch of points the opentsdb service fails to send to the InfluxDB write layer.

### connsActive

The `connsActive` statistic is incremented every time a TCP connection to a client is opened and decremented when the connection is closed.

### connsHandled

The `connsHandled` statistic is incremented every time a TCP connection to a client is opened.

### droppedPointsInvalid

The `droppedPointsInvalid` statistic is incremented for every point that arrives over HTTP and could not be parsed into an InfluxDB point.

### httpConnsHandled

The `httpConnsHandled` statistic is incremented for every TCP connection that is parsed as HTTP.

### pointsTx

The `pointsTx` statistic is incremented for every point the opentsdb service successfully sends to the InfluxDB write layer.

### tlBadFloat

The `tlBadFloat` statistic is incremented for every value that arrives over telnet and is rejected for not being correctly parsed as a float or converted to an InfluxDB point.

### tlBadLine

The `tlBadLine` statistic is incremented for every line that arrives over telnet and is rejected for not being an OpenTSDB `put`.

### tlBadTag

The `tlBadTag` statistic is incremented for every line that arrives over telnet and is rejected for containing a malformed tag.

### tlBadTime

The `tlBadTime` statistic is incremented for every line that arrives over telnet and is rejected for containing a malformed time.

### tlBytesRx

The `tlBytesRx` statistic is incremented for every byte that arrives over telnet.

### tlConnsActive

The `tlConnsActive` statistic is incremented every time a telnet connection is opened and decremented every time a telnet connection is closed.

### tlConnsHandled

The `tlConnsHandled` statistic is incremented every time a telnet connection is opened.

### tlPointsRx

The `tlPointsRx` statistic is incremented for every line that arrives over telnet.

### tlReadErr

The `tlReadErr` statistic is incremented every time there is an error reading telnet data from the TCP connection.

## runtime

The `runtime` measurement tracks a subset of the statistics exposed by the [Golang memory allocator stats](https://golang.org/pkg/runtime/#MemStats).

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| Alloc | integer | none |
| Frees | integer | none |
| HeapAlloc | integer | bytes |
| HeapIdle | integer | bytes |
| HeapInUse | integer | bytes |
| HeapObjects | integer | bytes |
| HeapReleased | integer | bytes |
| HeapSys | integer | bytes |
| Lookups | integer | none |
| Mallocs | integer | none |
| NumGC | integer | none |
| NumGoroutine | integer | none |
| PauseTotalNs | integer | nanoseconds |
| Sys | integer | bytes |
| TotalAlloc | integer | none |

## shard

The `shard` measurement tracks shard level statistics.
The tags on the series indicate the database, retention policy, and ID of the shard.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| diskBytes | integer | bytes |
| seriesCreate | integer | none |
| writeBytes | integer | bytes |
| writePointsErr | integer | none |
| writePointsOk | integer | none |
| writeReq | integer | none |
| writeReqErr | integer | none |
| writeReqOk | integer | none |

### diskBytes

The `diskBytes` statistic tracks the disk size in bytes consumed by the WAL cache and by the TSM files for the given shard.

### seriesCreate

The `seriesCreate` statistic tracks the number of series present in the given shard.

### writeBytes

The `writeBytes` statistic is currently unused and should always be zero.

### writePointsErr

The `writePointsErr` statistic tracks the number of points that the engine attempted to write to the shard but failed.

### writePointsOk

The `writePointsOk` statistic tracks the number of points that the engine successfully wrote to the shard.

### writeReq

The `writeReq` statistic tracks the number of batches that the engine attempted to write to the shard, regardless of success.

### writeReqErr

The `writeReqErr` statistic tracks the number of batches that the engine attempted to write to the shard but failed.

### writeReqOk

The `writeReqOk` statistic tracks the number of batches that the engine successfully wrote to the shard.

## subscriber

The `subscriber` measurement tracks subscriber statistics.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointsWritten | integer | none |
| writeFailures | integer | none |

### pointsWritten

The `pointsWritten` statistic tracks the number of points successfully written to subscribers.

### writeFailures

The `writeFailures` statistic tracks the number of batches that failed to send to subscribers.

## tsm1_cache

The `tsm1_cache` measurement tracks statistics about the WAL portion of the TSM1 engine.
The tags on the series include the shard's database, retention policy, and shard ID.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| WALCompactionTimeMs | integer | milliseconds |
| cacheAgeMs | integer | milliseconds |
| cachedBytes | integer | bytes |
| diskBytes | integer | bytes |
| memBytes | integer | bytes |
| snapshotCount | integer | none |

### WALCompactionTimeMs

The `WALCompactionTimeMs` statistic tracks the total time spent compacting the WAL into TSM files.

### cacheAgeMs

The `cacheAgeMs` statistic tracks the current age of the cache in milliseconds.

### cachedBytes

The `cachedBytes` statistic tracks how many bytes of data are stored in the cache.

### diskBytes

The `diskBytes` statistic tracks how many bytes are stored on disk for the given cache.

### memBytes

The `memBytes` statistic tracks how many bytes are stored in memory for the given cache.

### snapshotCount

The `snapshotCount` statistic tracks how many times a snapshot has been attempted by the given cache.

## tsm1_engine

The `tsm1_engine` measurement tracks statistics about TSM and cache compactions.
The tags on the series include the shard's database, retention policy, and shard ID.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| cacheCompactionDuration | integer | nanoseconds |
| cacheCompactions | integer | none |
| tsmFullCompactionDuration | integer | nanoseconds |
| tsmFullCompactions | integer | none |
| tsmLevel1CompactionDuration | integer | nanoseconds |
| tsmLevel1Compactions | integer | none |
| tsmLevel2CompactionDuration | integer | nanoseconds |
| tsmLevel2Compactions | integer | none |
| tsmLevel3CompactionDuration | integer | nanoseconds |
| tsmLevel3Compactions | integer | none |

The details for the level compaction statistics have been merged together, as the only difference between them is which level of compaction they refer to.

### cacheCompactionDuration

The `cacheCompactionDuration` statistic tracks how much time the engine spent compacting WAL files into TSM files.

### cacheCompactions

The `cacheCompactions` statistic is incremented every time a WAL file is compacted into a TSM file successfully.

### tsm{Full,Level{1,2,3}}CompactionDuration

The `tsmXXXCompactionDuration` statistics track the total duration spent compacting TSM files at the specified level.

### tsm{Full,Level{1,2,3}}Compactions

The `tsmXXXCompactions` statistics are incremented each time a compaction at the specified level succeeds.

## tsm1_filestore

The `tsm1_filestore` measurement tracks statistics about the files managed by the TSM1 engine.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| diskBytes | integer | bytes |
| numFiles | integer | none |

### diskBytes

The `diskBytes` statistic tracks the total disk space consumed by TSM files tracked by this filestore.

### numFiles

The `numFiles` statistic tracks the total number of TSM files tracked by this filestore.

## tsm1_wal

The `tsm1_wal` measurement tracks statistics about the WAL.
The tags on the series include the WAL's database, retention policy, and shard ID.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| currentSegmentDiskBytes | integer | bytes |
| oldSegmentsDiskBytes | integer | bytes |
| writeErr | integer | none |
| writeOk | integer | none |

### currentSegmentDiskBytes

The `currentSegmentsDiskBytes` statistic tracks the size on disk of the "hot" segments of WAL files.

### oldSegmentsDiskBytes

The `oldSegmentsDiskBytes` statistic tracks the size on disk of the "cold" segments of WAL files.

### writeErr

The `writeErr` statistic is incremented every time a batch of points is failed to be written into the WAL.

### writeOk

The `writeOk` statistic is incremented every time a batch of points is successfully written into the WAL.

## udp

The `udp` measurement tracks statistics about the udp service.
This measurement will only be present if the udp service plugin is enabled.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| batchesTx | integer | none |
| batchesTxFail | integer | none |
| bytesRx | integer | bytes |
| pointsParseFail | integer | none |
| pointsRx | integer | none |
| pointsTx | integer | none |
| readFail | integer | none |

### batchesTx

The `batchesTx` statistic is incremented for every batch of points the udp service successfully sends to the InfluxDB write layer.

### batchesTxFail

The `batchesTxFail` statistic is incremented for every batch of points the udp service fails to send to the InfluxDB write layer.

### bytesRx

The `bytesRx` statistic is incremented for every byte that the udp service successfully reads via its UDP connection.

### pointsParseFail

The `pointsParseFail` statistic is incremented any time the udp service receives a packet that could not be parsed successfully.

### pointsRx

The `pointsRx` statistic is incremented for every point accepted by the udp service.

### pointsTx

The `pointsTx` statistic is incremented for every point the udp service successfully sends to the InfluxDB write layer.

### readFail

The `readFail` statistic is incremented any time the udp service fails to correctly read a packet from its UDP connection.

## write

The `write` measurement tracks statistics about writes at a system level.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointReq | integer | none |
| pointReqLocal | integer | none |
| req | integer | none |
| subWriteDrop | integer | none |
| subWriteOk | integer | none |
| writeDrop | integer | none |
| writeError | integer | none |
| writeOk | integer | none |
| writeTimeout | integer | none |

### pointReq

The `pointReq` statistic is incremented for every point that is attempted to be written, regardless of success.

### pointReqLocal

The `pointReqLocal` statistic is incremented for every point that is attempted to be written into a shard, regardless of success.

### req

The `req` statistic is incremented every time a batch of points is attempted to be written, regardless of success.

### subWriteDrop

The `subWriteDrop` statistic is incremented every time a batch write to a subscriber is dropped due to contention or write saturation.

### subWriteOk

The `subWriteOk` statistic is incremented every time a batch write to a subscriber succeeds.

### writeDrop

The `writeDrop` statistic is incremented for every point dropped due to having a timestamp that does not match any existing retention policy.

### writeError

The `writeErr` statistic is incremented for every batch that was attempted to be written to a shard but failed.

### writeOk

The `writeOk` statistic is incremented for every batch that was successfully written to a shard.

### writeTimeout

The `writeTimeout` statistic is incremented every time a write failed due to timing out.
An increase in this statistic typically indicates contention at the filesystem or disk layer.
