---
title: InfluxDB Enterprise Cluster Stats monitoring dashboard
description: Describes metrics monitored in the InfluxDB Enterprise monitoring dashboard.
menu:
  platform:
    name: Enterprise Stats dashboard
    parent: Dashboards for monitoring InfluxDB
    weight: 3
---

The InfluxDB Enterprise Cluster Stats dashboard is useful for monitoring the health of your InfluxDB Enterprise clusters.
The dashboard visualizations cover commonly monitored metrics that are important for
monitoring and maintaining your InfluxDB Enterprise clusters and for troubleshooting.
So that you don't have to constantly check the dashboard, you can create alerts to notify you when attention is required.

> **Note:** The queries below use the `_internal` database, which is enabled by default on InfluxDB nodes.
> When using the "watcher of watcher (WoW)" configuration, data is written to the `telegraf` database.
> When the `_internal` measurements are sent to the `telegraf` database using InfluxDB plugins, many
> of the same field keys below are prepended with `infuxdb_`, but are otherwise the same field keys listed here.

## Continuous Queries Executed / Minute

Displays the non-negative mean rate of change in continuous queries (CQs) executed per minute.

### Query

`SELECT non_negative_derivative(mean(/.*/),60s) FROM "_internal".."cq" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:) fill(null)"`

### Metrics

#### Continuous Queries

`non_negative_derivative(mean(/.*/),60s)`

### Measurement

[`cq`](/platform/monitoring/tools/measurements-internal#cq)

### Field keys

[`queryOk`](/platform/monitoring/tools/measurements-internal#queryok), [`queryFail`](/platform/monitoring/tools/measurements-internal#queryfail)

_______________

## Heap Size

Displays the current heap size.

### Queries

`"SELECT mean("HeapInUse") FROM "_internal".."runtime" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname" fill(null)"`

### Metric

#### Heap Size

`mean("HeapInUse")`

## Measurement

[`runtime`](/platform/monitoring/tools/measurements-internal#runtime)

### Field keys

[`HeapInUse`](/platform/monitoring/tools/measurements-internal#heapinuse)

_________

## Shard Write Errors

Displays the number of shard write errors.

### Query

`"SELECT non_negative_derivative(max("writeError"), 10s) FROM "_internal".."write" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname" fill(null)"`

### Metric

#### [Shard Write Errors]

`non_negative_derivative(max("writeError")`

### Measurement

[`write`](/platform/monitoring/tools/measurements-internal#write)

### Field keys

[`writeError`](/platform/monitoring/tools/measurements-internal#writeerror)

___________

## Series Cardinality by Database

Displays the number of series (series cardinality) for the specified databases.

### Query

`"SELECT max("numSeries") AS "Series Cardinality" FROM "_internal".."database" WHERE time > :dashboardTime:  GROUP BY time(:interval:), "database" fill(null)"`

### Metric

#### Series Cardinality

`max("numSeries")`

### Measurement

[`database`](/platform/monitoring/tools/measurements-internal#database)

### Field keys

[`numSeries`](/platform/monitoring/tools/measurements-internal#numseries)

_____

## Number of Measurements by Database

Displays the number of measurements, by database.

### Query

`"SELECT max("numMeasurements") AS "Measurements" FROM "_internal".."database" WHERE time > :dashboardTime: GROUP BY time(:interval:), "database" fill(null)"`

### Metric

#### Number of measurements

`max("numMeasurements")`

### Measurement

[`database`](/platform/monitoring/tools/measurements-internal#database)

### Field keys

[`numMeasurements`](/platform/monitoring/tools/measurements-internal#nummeasurements)

_____

## HTTP Request Duration (99th %)

Displays the duration, in nanoseconds, of the top 1% of HTTP requests.

### Queries

#### Write Request

`"SELECT non_negative_derivative(percentile("writeReqDurationNs", 99)) /  non_negative_derivative(max("writeReq")) AS "Write Request" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:) fill(0)\t"`

#### Query Request

`"SELECT non_negative_derivative(percentile("queryReqDurationNs", 99)) / non_negative_derivative(max("queryReq")) AS "Query Request" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY hostname, time(:interval:)"`

### Metrics

#### Write Request

`"non_negative_derivative(percentile("writeReqDurationNs", 99)) /  non_negative_derivative(max("writeReq"))`

#### Read Request

`non_negative_derivative(percentile("queryReqDurationNs", 99)) / non_negative_derivative(max("queryReq"))`

### Measurement

[`httpd`](/platform/monitoring/tools/measurements-internal#httpd)

### Field keys

[`queryReq`](/platform/monitoring/tools/measurements-internal#queryreq), [`queryReqDurationNs`](/platform/monitoring/tools/measurements-internal#queryreqdurationns). [`writeReq`](/platform/monitoring/tools/measurements-internal#writereq), [`writeReqDurationNs`](/platform/monitoring/tools/measurements-internal#writereqdurationns)

____

## Point Throughput / Minute by Hostname

Displays the number of points requested each minute, by hostname.

### Queries

`"SELECT non_negative_derivative(max("pointReq"), 60s) FROM "_internal".."write" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname""`

### Metrics

#### \[Point Requests\]

 `non_negative_derivative(max("pointReq"), 60s)`

### Measurement

 [`write`](/platform/monitoring/tools/measurements-internal#write)

### Field keys

[`pointReq`](/platform/monitoring/tools/measurements-internal#pointreq)

_____

## Queries Executed Per Minute

Displays the number of queries executed per minute.

### Query

#### Queries Executed

 `"SELECT non_negative_derivative(mean("queriesExecuted"), 60s) AS "Queries Executed" FROM "_internal".."queryExecutor" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname" fill(null)"`

### Metric

#### Queries Executed

`non_negative_derivative(mean("queriesExecuted"), 60s)`

### Measurement

[`queryExecutor`](/platform/monitoring/tools/measurements-internal#queryexecutor)

### Field keys

[`queriesExecuted`](/platform/monitoring/tools/measurements-internal#queriesexecuted)

_____

## HTTP Requests / Minute

Displays the number of HTTP requests per minute.

### Queries

#### Query Requests

`"SELECT non_negative_derivative(mean("queryReq"), 60s) AS "Query" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname""`

#### Write Requests

`"SELECT non_negative_derivative(mean("writeReq"), 60s) AS "Write Requests" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname""`

#### Server Errors

`"SELECT non_negative_derivative(mean("serverError"), 60s) AS "Server Errors" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname""`

#### Client Errors

`"SELECT non_negative_derivative(mean("clientError"), 60s) AS "Client Errors" FROM "_internal".."httpd" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname""`

### Metrics

#### Query Requests

`non_negative_derivative(mean("queryReq"), 60s)`

#### Write Requests

`non_negative_derivative(mean("writeReq"), 60s)`

#### Server Errors

`non_negative_derivative(mean("serverError"), 60s)`

#### Client Errors

`non_negative_derivative(mean("clientError"), 60s)`

### Measurement

[`httpd`](/platform/monitoring/tools/measurements-internal#httpd)

### Field keys

[`queryReq`](/platform/monitoring/tools/measurements-internal#queryreq), [`writeReq`](/platform/monitoring/tools/measurements-internal#writereq), [`serverError`](/platform/monitoring/tools/measurements-internal#servererror), [`clientError`](/platform/monitoring/tools/measurements-internal#clienterror)

____

## Hinted Handoff (HH) Queue Size

Displays the size, in bytes, of Hinted Handoff (HH) queues, by hostname.

### Query

`"SELECT mean("queueBytes") FROM "_internal".."hh_processor" WHERE time > :dashboardTime: GROUP BY time(:interval:), "hostname" fill(0)"`

### Metric

#### HH Queue Size

`mean("queueBytes")`

### Measurement

[`hh_processor`](/platform/monitoring/tools/measurements-internal#hh-processor-enterprise-only)

### Field keys

[`queueBytes`](/platform/monitoring/tools/measurements-internal#queuebytes)

____

## Anti-Entropy Errors

Displays the count of Anti-Entropy errors.

### Queries

`"SELECT non_negative_derivative(mean("errors"),5m) AS "errors" FROM "_internal".""."ae" WHERE time > :dashboardTime: GROUP BY time(:interval:) FILL(null)"`

### Metric

#### \[AE Errors\]

`non_negative_derivative(mean("errors"),5m)`

### Measurement

[`ae`](/platform/monitoring/tools/measurements-internal#ae-enterprise-only)

### Field keys

[`errors`](/platform/monitoring/tools/measurements-internal#errors)

____

## Anti-Entropy Jobs

Displays the count of active Anti-Entry jobs.

### Query

`"SELECT count("jobs_active") AS \Active Jobs" FROM "_internal".."ae" WHERE time > :dashboardTime: GROUP BY time(:interval:) FILL(null)"`

### Metric

#### Count of Jobs

`count("jobs_active")`

### Measurement

[`ae`](/platform/monitoring/tools/measurements-internal#ae-enterprise-only)

### Field keys

[`jobs_active`](/platform/monitoring/tools/measurements-internal#jobsactive)
