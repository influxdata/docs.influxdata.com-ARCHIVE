---
title: Field keys used in InfluxDB monitoring dashboards
description: Describes the measurements and field keys that are used in the InfluxDB OSS and InfluxDB Enterprise monitoring dashboards.
menu:
  platform:
    name: Field keys in monitoring dashboards
    weight: 30
---


The listings below include all of the measurements and their field keys that are used in the InfluxDB Enterprise Cluster and InfluxDB OSS monitoring dashboards. Information includes a description of the field keys, their data types, and where they are used in the monitoring dashboards.



-----

## ae

### errors

* Errors in the Anti-Entropy (AE) engine.
* Data type: integer
* Used in "Count of AE Errors"

### jobs_active

* Number of active jobs in Anti-Entropy (AE)
* Data type: integer
* Used in "Count of AE Jobs"

### queueBytes

* Queue size, in bytes
* Used in "Hinted Handoff (HH) Queue Size"

____
## cq

### queryFail

* Number of queries that failed.
* Data type: integer

### queryOk

* Number of queries that succeeded.
* Data type: integer
____

## database

### numMeasurements

* Number of measurements in the specified database.
* Data type: integer
* Values are estimates, currently implemented using [HyperLogLog++ (HLL++) estimation](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Used in "Number of Measurements by Database"

### numSeries

* Number of series in the specified database.
* Data type: integer
* Values are estimates, currently implemented using [HyperLogLog++ (HLL++) estimation](https://github.com/influxdata/influxdb/blob/master/pkg/estimator/hll/hll.go). The numbers returned by the estimates when there are thousands or millions of measurements or series should be accurate within a relatively small margin of error.
* Used in "Series Cardinality by Database"

____

## hh_processor

### queueBytes

* Queue size, in bytes
* Used in "Hinted Handoff Queue Size"



_____

## httpd

### clientError

- Client errors
- Data type: integer
- Used in "HTTP Request per Minute"

### queryReq

* The number of query requests.
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests per Minute"

### queryReqDurationNs

* Query request duration, in nanosecond (ns)
* Data type: integer
* Used in "HTTP Request Duration (99th %)"

### serverError

* Server errors
* Data type: integer
* Used in "HTTP Request per Minute"

### writeReq

* The number of write requests.
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests per Minute"

### writeReqDurationNs

* Total write request duration, in nanoseconds (ns).
* Data type: integer
* Used in "HTTP Request Duration (99th %)"

-----

## queryExecutor

### queriesExecuted

* The number of queries executed (started).
* Data type: integer
* Used in "Queries Executed per Minute"

-----

## runtime

### HeapInUse

* The size, in bytes, in in-use spans.
* Data type: integer
* Used in "Heap Size"

-----

## write

### pointReq

* Incremented after each attempted point request.
* Data type: integer
* Used in "Per-host Point Throughput per Minute"

### writeError

* Incremented after every batch that was attempted to be written to a shard but failed.
* Data type: integer
* Used in "Shard Write Errors"
