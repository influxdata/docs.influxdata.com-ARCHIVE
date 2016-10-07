
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
For metrics shared by both InfluxDB and InfluxEnterprise, please refer to the [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## cluster

The `cluster` measurement tracks statistics related to the clustering features of the data nodes in InfluxEnterprise.
The tags on the series indicate the source host of the stat.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| copyShardReq | integer | none |
| createIteratorReq | integer | none |
| expandSourcesReq | integer | none |
| fieldDimensionsReq | integer | none |
| removeShardReq | integer | none |
| writeShardFail | integer | none |
| writeShardPointsReq | integer | none |
| writeShardReq | integer | none |

###copyShardReq

The `copyShardReq` statistic is incremented every time there is an internal request to copy a shard _from_ this data node to another data node.

###createIteratorReq

The `createIteratorReq` statistic is incremented every time a remote node requests to remotely read data from this node.

###expandSourcesReq

The `expandSourcesReq` statistic is incremented every time a remote node requests to find measurements on this node that match a given regular expression.

###fieldDimensionsReq

The `fieldDimensionsReq` statistic is incremented every time a remote node requests information about the fields and associated types, and tag keys, of measurements on this node.

###removeShardReq

The `removeShardReq` statistic is incremented every time there is an internal request to delete a shard from this data node.

###writeShardFail

The `writeShardFail` statistic is incremented every time there is an internal write request from a remote node, and the write fails.

###writeShardPointsReq

The `writeShardPointsReq` statistic is incremented for every point in every internal write request from any remote node.

###writeShardReq

The `writeShardReq` statistic is incremented every time there is an internal write request from a remote node, regardless of success.

## cq  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## database  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## hh

The `hh` measurement tracks events resulting in new hinted handoff processors for remote nodes.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| writeShardReq | integer | none |
| writeShardReqPoints | integer | none |

###writeShardReq

The `writeShardReq` statistic is incremented the first time the hinted handoff engine handles a write for a remote node.
Subsequent write requests to this node, destined for the same remote node, do not increment this statistic.

###writeShardReqPoints

The `writeShardReqPoints` statistic is incremented for each point in the first request to the hinted handoff engine for a remote node.
Subsequent write requests to this node, destined for the same remote node, do not increment this statistic.

## hh_processor

The `hh_processor` tracks statistics about hinted handoff processors, one for each remote node.
The tags indicate the destination node.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| bytesRead | integer | bytes |
| bytesWritten | integer | bytes |
| queueDepth | integer | none |
| writeNodeReq | integer | none |
| writeNodeReqFail | integer | none |
| writeNodeReqPoints | integer | none |
| writeShardReq | integer | none |
| writeShardReqPoints | integer | none |

###bytesRead

The `bytesRead` statistic is incremented for every byte read from the HH queue and sent to its destination node.

Note that if the data node process is restarted while there is data in the HH queue, `bytesRead` may settle to a number larger than `bytesWritten`.

###bytesWritten

The `bytesWritten` statistic is incremented for every byte written to the HH queue.

Note that it only tracks bytes written during the lifecycle of the current process.
Upon process restart, the statistic resets to zero.

###queueDepth

The `queueDepth` statistic tracks how many underlying segment files are in the HH queue.
This is a coarse-grained statistic that roughly represents the amount of data queued for a remote node.

###writeNodeReq

The `writeNodeReq` statistic is incremented every time the node successfully writes a batch to the destination node.

###writeNodeReqFail

The `writeNodeReqFail` statistic is incremented every time writing a batch of HH data to a destination node fails.

###writeNodeReqPoints

The `writeNodeReqPoints` statistic is incremented for every point successfully from the HH queue successfully written to the destination node.

###writeShardReq

The `writeShardReq` statistic is incremented for every write batch enqueued into hinted handoff.

###writeShardReqPoints

The `writeShardReqPoints` statistic is incremented for every point enqueued into hinted handoff.

## httpd  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## queryExecutor  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## runtime  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## shard  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## subscriber  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## tsm1_cache  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## tsm1_engine  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## tsm1_filestore  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).

## tsm1_wal  

See [InfluxDB `_internal` documentation](/influxdb/v1.0/troubleshooting/internal_statistics).


## write  

The `write` measurement tracks statistics about writes to the node, regardless of the source of the write.

| fieldKey | fieldType | units |
| :---- | :---- | :---- |
| pointReq | integer | none |
| pointReqHH | integer | none |
| pointReqLocal | integer | none |
| pointReqRemote | integer | none |
| req | integer | none |
| subWriteDrop | integer | none |
| subWriteOk | integer | none |
| writeError | integer | none |
| writeOk | integer | none |
| writePartial | integer | none |
| writeTimeout | integer | none |

###pointReq

The `pointReq` statistic is incremented for every point requested to be written to this node.

###pointReqHH

The `pointReqHH` statistic is incremented for every point received for write by this node and then enqueued into hinted handoff for the destination node.

###pointReqLocal

The `pointReqLocal` statistic is incremented for every point received for write by this node and able to be written to a shard that exists on the same node.

###pointReqRemote

The `pointReqRemote` statistic is incremented for every point received for write by this node but needed to be forwarded to a remote node.
This statistic does not distinguish between requests that are directly written to the destination node versus enqueued in hinted handoff for the destination node.

###req

The `req` statistic is incremented for every batch of points requested to be written to this node.

###subWriteDrop

The `subWriteDrop` statistic is incremented every time a batch of points is failed to be sent to the subscription dispatcher.

###subWriteOk

The `subWriteOk` statistic is incremented every time a batch of points is successfully sent to the subscription dispatcher.

###writeError

The `writeError` statistic is incremented any time a batch of points is not successfully written.
This could be a failure to write to a local shard or to a remote shard.

###writeOk

The `writeOk` statistic is incremented any time a batch of points is written at the requested consistency level.

###writePartial

The `writePartial` statistic is incremented any time a batch of points is written to at least one node but did not meet the requested consistency level.

###writeTimeout

The `writeTimeout` statistic is incremented any time a write failed to complete within the default write timeout duration.
This could indicate severely reduced or contentious disk I/O or a congested network to a remote node, for instance.
