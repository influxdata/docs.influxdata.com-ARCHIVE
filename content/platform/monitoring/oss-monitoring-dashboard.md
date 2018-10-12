---
title: InfluxDB OSS Stats monitoring dashboard
description: Describes details about metrics that are monitored in the InfluxDb OSS monitoring dashboard.
menu:
  platform:
    name: Cluster monitoring dashboard
    weight: 20
---

The InfluxDB OSS Stats dashboard is useful for monitoring the health of your InfluxDB OSS instances. The dashboard visualizations cover commonly monitored metrics that are important for monitoring and maintaining your InfluxDB OSS instance and for troubleshooting. So that you don't have to constantly check the dashboard, you can create alerts to notify you when attention is required.

> **Note:** The queries below use the `_internal` database, which is enabled by default on InfluxDB OSS instances.

## Continuous Queries Executed / Minute

### Description

Displays the non-negative mean rate of change in continuous queries (CQs) executed per minute.

### Query

`SELECT non_negative_derivative(mean(/.*/),60s) FROM "_internal".."cq" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:) fill(null)"`

### Metrics

#### [Continuous Queries]

`non_negative_derivative(mean(/.*/),60s)`

### Measurement

 `cq`

### Field keys

`cq_query`

_______________

## Heap Size

### Description

Returns the current heap size.

### Queries

`"SELECT mean(\"HeapInUse\") FROM \"_internal\"..\"runtime\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\" fill(null)"`

### Metrics

####  Heap Size

 `mean(\"HeapInUse\")`

## Measurement

 `runtime`

### Field keys

 `HeapInUse`

_________

## Shard Write Errors

### Description

Returns the number of shard write errors.

**Query**: `"SELECT non_negative_derivative(max(\"writeError\"), 10s) FROM \"_internal\"..\"write\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\" fill(null)"`

**Metric**: [Shard Write Errors] = `non_negative_derivative(max(\"writeError\")`

**Measurement: `write`

**Field keys**: `writeError`

___________

## Series Cardinality by Database

### Description

Returns the number of series (series cardinality) for the specified databases.

**Query**: `"SELECT max(\"numSeries\") AS \"Series Cardinality\" FROM \"_internal\"..\"database\" WHERE time > :dashboardTime:  GROUP BY time(:interval:), \"database\" fill(null)"`

**Metric**: Series cardinality =`max(\"numSeries\")`

**Measurement**: `database`

**Field keys**: `numSeries`

_____

## Number of Measurements by Database

### Description

Returns the number of measurements, by database.

**Query**: `"SELECT max(\"numMeasurements\") AS \"Measurements\" FROM \"_internal\"..\"database\" WHERE time > :dashboardTime:  GROUP BY time(:interval:), \"database\" fill(null)"`

**Metric**: Number of measurements = `max(\"numMeasurements\")`

**Measurement**: `database`

### Field keys

 `numMeasurements`

_____

## HTTP Request Duration (99th %)

### Description

Returns the duration, in nanoseconds, of the top 1% of HTTP requests.

### Queries

#### Write Request

 `"SELECT non_negative_derivative(percentile(\"writeReqDurationNs\", 99)) /  non_negative_derivative(max(\"writeReq\")) AS \"Write Request\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:) fill(0)\t"`

#### Query Request

`"SELECT non_negative_derivative(percentile(\"queryReqDurationNs\", 99)) / non_negative_derivative(max(\"queryReq\")) AS \"Query Request\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:)"`

### Metrics

#### Write Request

 `"non_negative_derivative(percentile(\"writeReqDurationNs\", 99)) /  non_negative_derivative(max(\"writeReq\"))`

#### Read Request

 `non_negative_derivative(percentile(\"queryReqDurationNs\", 99)) / non_negative_derivative(max(\"queryReq\"))`

### Measurement

 `httpd`

### Field keys

 `queryReq`

 `queryReqDurationNs`

 `writeReq`

`writeReqDurationNs`

____

## Point Throughput / Minute by Hostname

### Description

Returns the number of points requested each minute, by hostname.

### Query

 `"SELECT non_negative_derivative(max(\"pointReq\"), 60s) FROM \"_internal\"..\"write\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\""`

### Metrics

#### [Point Requests]

 `non_negative_derivative(max(\"pointReq\"), 60s)`

### Measurement

 `write`

### Field keys

`pointReq`

_____

## Queries Executed / Minute

### Description

Returns the number of queries executed per minute.

### Queries

#### Queries Executed

 `"SELECT non_negative_derivative(mean(\"queriesExecuted\"), 60s) AS \"Queries Executed\" FROM \"_internal\"..\"queryExecutor\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\" fill(null)"`

### Metrics

#### Queries Executed

 `non_negative_derivative(mean(\"queriesExecuted\"), 60s)`

### Measurement

 `queryExecutor`

### Field keys

 `queriesExecuted`

_____

## HTTP Requests / Minute

### Description

Returns the number of HTTP requests per minute.

### Queries

#### Query Requests

 `"SELECT non_negative_derivative(mean(\"queryReq\"), 60s) AS \"Query\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\""`

#### Write Requests

`"SELECT non_negative_derivative(mean(\"writeReq\"), 60s) AS \"Writes\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\""`

#### Server Errors

`"SELECT non_negative_derivative(mean(\"serverError\"), 60s) AS \"Server Errors\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\""`

#### Client Errors

`"SELECT non_negative_derivative(mean(\"clientError\"), 60s) AS \"Client Errors\" FROM \"_internal\"..\"httpd\" WHERE time > :dashboardTime: GROUP BY time(:interval:), \"hostname\""`

### Metrics

#### Query Requests

Query Requests = `non_negative_derivative(mean(\"queryReq\"), 60s)`

#### Writes

Writes = `non_negative_derivative(mean(\"writeReq\"), 60s)`

#### Server Errors

 `non_negative_derivative(mean(\"serverError\"), 60s)`

#### Client Errors

 `non_negative_derivative(mean(\"clientError\"), 60s)`

### Measurement

####  `httpd`

### Field keys

 `queryReq`,  `writeReq`, `serverError`, `clientError`

____
