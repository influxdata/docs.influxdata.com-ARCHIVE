---
title: Field keys used in monitoring dashboards
description: Describes the measurements and field keys that are used in the InfluxDb OSS and InfluxDB Enterprise monitoring dashboards.
menu:
  platform:
    name: Dashboard field keys
    weight: 30
---






# Field keys used in monitoring dashboard

The listings below include all of the measurements and their field keys that are used in the InfluxDB Enterprise Cluster and InfluxDB OSS monitoring dashboards. Information includes a description of the field keys, their data types, and where they are used in the monitoring dashboards.



-----

## ae

### errors

*
* Data type:
* Used in "Count of AE Errors"

### jobs_active

* Data type: float
* Number of active jobs in Anti-Entropy (AE)
* Used in "Count of AE Jobs"

### queueBytes

* Queue size, in bytes
* Used in "Hinted Handoff (HH) Queue Size"

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

* Query requests
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

* Write requests
* Data type: integer
* Used in "HTTP Request Duration (99th %)" and "HTTP Requests per Minute"

### writeReqDurationNs

* Total write request duration, in nanoseconds (ns).
* Data type: integer
* Used in "HTTP Request Duration (99th %)"

-----

## queryExecutor

### queriesExecuted

* Queries executed
* Data type: integer
* Used in "Queries Executed per Minute"

-----

## runtime

### HeapInUse

* Size of heap that is currently used
* Used in "Heap Size"

-----

## write

### pointReq

* Points requested
* Data type: integer
* Used in "Per-host Point Throughput per Minute"

### writeError

* Write errors
* Data type: integer
* Used in "Shard Write Errors"
