
# Introduction

InfluxEnterprise periodically samples and stores metrics about its own operations. 
The metrics are stored in the `_internal` database and can be queried, downsampled, passed to Kapacitor, etc. just like any other data in the system.

# Using `_internal`

## Important numbers to watch

list the ones that matter, linking to their definition below.

## Examples queries on `_internal`

a few examples showing good and problematic query responses for some or all of the above numbers

# Metric definitions

These are the metrics that are unique to InfluxEnterprise. 
For metrics shared by both InfluxDB and InfluxEnterprise, please refer to the [InfluxDB `_internal` documentation](/influxdb/v1.2/troubleshooting/internal_statistics).

## cluster

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| copyShardReq | integer | bananas |
| createIteratorReq | integer | bananas |
| expandSourcesReq | integer | bananas |
| fieldDimensionsReq | integer | bananas |
| removeShardReq | integer | bananas |
| writeShardFail | integer | bananas |
| writeShardPointsReq | integer | bananas |
| writeShardReq | integer | bananas |

###copyShardReq

###createIteratorReq

###expandSourcesReq

###fieldDimensionsReq

###removeShardReq

###writeShardFail

###writeShardPointsReq

###writeShardReq

## cq  

See \<link to influxdb doc\>

## database  

See \<link to influxdb doc\>

## hh

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| writeShardReq | integer | bananas |
| writeShardReqPoints | integer | bananas |

###writeShardReq

###writeShardReqPoints

## hh_processor

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| bytesRead | integer | bananas |
| bytesWritten | integer | bananas |
| queueDepth | integer | bananas |
| writeNodeReq | integer | bananas |
| writeNodeReqFail | integer | bananas |
| writeNodeReqPoints | integer | bananas |
| writeShardReq | integer | bananas |
| writeShardReqPoints | integer | bananas |

###bytesRead

###bytesWritten

###queueDepth

###writeNodeReq

###writeNodeReqFail

###writeNodeReqPoints

###writeShardReq

###writeShardReqPoints

## httpd  

See \<link to influxdb doc\>

## queryExecutor  

See \<link to influxdb doc\>

## runtime  

See \<link to influxdb doc\>

## shard  

See \<link to influxdb doc\>

## subscriber  

See \<link to influxdb doc\>

## tsm1_cache  

See \<link to influxdb doc\>

## tsm1_engine  

See \<link to influxdb doc\>

## tsm1_filestore  

See \<link to influxdb doc\>

## tsm1_wal  

See \<link to influxdb doc\>


## write  

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointReq | integer | bananas |
| pointReqHH | integer | bananas |
| pointReqLocal | integer | bananas |
| pointReqRemote | integer | bananas |
| req | integer | bananas |
| subWriteDrop | integer | bananas |
| subWriteOk | integer | bananas |
| writeError | integer | bananas |
| writeOk | integer | bananas |
| writePartial | integer | bananas |
| writeTimeout | integer | bananas |

###pointReq

###pointReqHH

###pointReqLocal

###pointReqRemote

###req

###subWriteDrop

###subWriteOk

###writeError

###writeOk

###writePartial

###writeTimeout
