#---
#title: InfluxDB Internal Statistics
#menu:
#  influxdb_1_0:
#    weight: 90
#    parent: troubleshooting
#---

# Introduction

InfluxDB periodically samples and stores metrics about its own operations. 
The metrics are stored in the `_internal` database and can be queried, downsampled, passed to Kapacitor, etc. just like any other data in the system.

# Using `_internal`

## Important numbers to watch

list the ones that matter, linking to their definition below.

## Examples queries on `_internal`

a few examples showing good and problematic query responses for some or all of the above numbers

# Metric definitions

## cq

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| queryFail |  integer | bananas |
| queryOk | integer | bananas |

### queryFail

### queryOk

## database

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| numMeasurements | integer | bananas |
| numSeries | integer | bananas |

### numMeasurements

### numSeries

## httpd

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| authFail | integer | bananas |
| clientError | integer | bananas |
| cqReq | integer | bananas |
| pingReq | integer | bananas |
| pointsWrittenFail | integer | bananas |
| pointsWrittenOK | integer | bananas |
| queryReq | integer | bananas |
| queryReqDurationNs | integer | bananas |
| queryRespBytes | integer | bananas |
| req | integer | bananas |
| reqActive | integer | bananas |
| reqDurationNs | integer | bananas |
| serverError | integer | bananas |
| statusReq | integer | bananas |
| writeReq | integer | bananas |
| writeReqActive | integer | bananas |
| writeReqBytes | integer | bananas |
| writeReqDurationNs | integer | bananas |

### authFail

### clientError

### cqReq

### pingReq

### pointsWrittenFail

### pointsWrittenOK

### queryReq

### queryReqDurationNs

### queryRespBytes

### req

### reqActive

### reqDurationNs

### serverError

### statusReq

### writeReq

### writeReqActive

### writeReqBytes

### writeReqDurationNs

## queryExecutor

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| queriesActive | integer | bananas |
| queryDurationNs | integer | bananas |

### queriesActive

### queryDurationNs

## runtime

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| Alloc | integer | bananas |
| Frees | integer | bananas |
| HeapAlloc | integer | bananas |
| HeapIdle | integer | bananas |
| HeapInUse | integer | bananas |
| HeapObjects | integer | bananas |
| HeapReleased | integer | bananas |
| HeapSys | integer | bananas |
| Lookups | integer | bananas |
| Mallocs | integer | bananas |
| NumGC | integer | bananas |
| NumGoroutine | integer | bananas |
| PauseTotalNs | integer | bananas |
| Sys | integer | bananas |
| TotalAlloc | integer | bananas |

### Alloc

### Frees

### HeapAlloc

### HeapIdle

### HeapInUse

### HeapObjects

### HeapReleased

### HeapSys

### Lookups

### Mallocs

### NumGC

### NumGoroutine

### PauseTotalNs

### Sys

### TotalAlloc

## shard

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| diskBytes | integer | bananas |
| seriesCreate | integer | bananas |
| writeBytes | integer | bananas |
| writePointsErr | integer | bananas |
| writePointsOk | integer | bananas |
| writeReq | integer | bananas |
| writeReqErr | integer | bananas |
| writeReqOk | integer | bananas |

### diskBytes

### seriesCreate

### writeBytes

### writePointsErr

### writePointsOk

### writeReq

### writeReqErr

### writeReqOk

## subscriber

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointsWritten | integer | bananas |
| writeFailures | integer | bananas |

### pointsWritten

### writeFailures

## tsm1_cache

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| WALCompactionTimeMs | integer | bananas |
| cacheAgeMs | integer | bananas |
| cachedBytes | integer | bananas |
| diskBytes | integer | bananas |
| memBytes | integer | bananas |
| snapshotCount | integer | bananas |

### WALCompactionTimeMs

### cacheAgeMs

### cachedBytes

### diskBytes

### memBytes

### snapshotCount

## tsm1_engine

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| cacheCompactionDuration | integer | bananas |
| cacheCompactions | integer | bananas |
| tsmFullCompactionDuration | integer | bananas |
| tsmFullCompactions | integer | bananas |
| tsmLevel1CompactionDuration | integer | bananas |
| tsmLevel1Compactions | integer | bananas |
| tsmLevel2CompactionDuration | integer | bananas |
| tsmLevel2Compactions | integer | bananas |
| tsmLevel3CompactionDuration | integer | bananas |
| tsmLevel3Compactions | integer | bananas |

### cacheCompactionDuration

### cacheCompactions

### tsmFullCompactionDuration

### tsmFullCompactions

### tsmLevel1CompactionDuration

### tsmLevel1Compactions

### tsmLevel2CompactionDuration

### tsmLevel2Compactions

### tsmLevel3CompactionDuration

### tsmLevel3Compactions

## tsm1_filestore

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| diskBytes | integer | bananas |
| numFiles | integer | bananas |

### diskBytes

### numFiles

## tsm1_wal

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| currentSegmentDiskBytes | integer | bananas |
| oldSegmentsDiskBytes | integer | bananas |
| writeErr | integer | bananas |
| writeOk | integer | bananas |

### currentSegmentDiskBytes

### oldSegmentsDiskBytes

### writeErr

### writeOk

## write

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointReq | integer | bananas |
| pointReqLocal | integer | bananas |
| req | integer | bananas |
| subWriteDrop | integer | bananas |
| subWriteOk | integer | bananas |
| writeDrop | integer | bananas |
| writeError | integer | bananas |
| writeOk | integer | bananas |
| writeTimeout | integer | bananas |

### pointReq

### pointReqLocal

### req

### subWriteDrop

### subWriteOk

### writeDrop

### writeError

### writeOk

### writeTimeout
