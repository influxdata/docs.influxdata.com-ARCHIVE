---
title: Design Insights and Tradeoffs in InfluxDB
menu:
  influxdb_011:
    weight: 60
    parent: concepts
---

InfluxDB is a time-series database.
Optimizing for this use-case entails some tradeoffs, primarily to increase performance at the cost of functionality.
Below is a list of some of those design insights that lead to tradeoffs:

1. For the time series use case, we assume that if the same data is sent multiple times, it is the exact same data that a client just sent several times.
  * *Pro:* Simplified [conflict resolution](/influxdb/v0.11/troubleshooting/frequently_encountered_issues/#writing-duplicate-points) increases write performance
  * *Con:* May lose data in rare circumstances
1. Deletes are a rare occurrence.
When they do occur it is almost always against large ranges of old data that are cold for writes.
  * *Pro:* Restricting access to deletes allows for increased query and write performance
  * *Con:* Delete functionality is significantly restricted
1. Updates to existing data are a rare occurrence and contentious updates never happen.
Time series data is predominantly new data that is never updated.
  * *Pro:* Restricting access to updates allows for increased query and write performance
  * *Con:* Update functionality is significantly restricted
1. The vast majority of writes are for data with very recent timestamps and the data is added in time ascending order.
  * *Pro:* Adding data in time ascending order is significantly more performant
  * *Con:* Writing points with random times or with time not in ascending order is significantly less performant
1. Scale is critical.
The database must be able to handle a *high* volume of reads and writes.
  * *Pro:* The database can handle a *high* volume of reads and writes
  * *Con:* The InfluxDB development team was forced to make tradeoffs to increase performance
1. Being able to write and query the data is more important than having a strongly consistent view.
  * *Pro:* Writing and querying the database can be done by multiple clients and at high loads
  * *Con:* Query returns may not include the most recent points if database is under heavy load
1. Many time series are ephemeral.
There are often time series that appear only for a few hours and then go away, e.g.
a new host that gets started and reports for a while and then gets shut down.
  * *Pro:* InfluxDB is good at managing discontinuous data
  * *Con:* Schema-less design means that some database functions are not supported e.g.
there are no cross table joins
1. No one point is too important.
  * *Pro:* InfluxDB has very powerful tools to deal with aggregate data and large data sets
  * *Con:* Points don't have IDs in the traditional sense, they are differentiated by timestamp and series

For more information on this topic please refer to this [blog post](https://influxdata.com/blog/influxdb-clustering-design-neither-strictly-cp-or-ap/) by Paul Dix.
