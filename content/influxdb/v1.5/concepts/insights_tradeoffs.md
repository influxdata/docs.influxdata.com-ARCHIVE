---
title: InfluxDB design insights and tradeoffs
menu:
  influxdb_1_5:
    name: Design insights and tradeoffs
    weight: 40
    parent: Concepts
---

InfluxDB is a time series database.
Optimizing for this use case entails some tradeoffs, primarily to increase performance at the cost of functionality.
Below is a list of some of those design insights that lead to tradeoffs:

1.  For the time series use case, we assume that if the same data is sent multiple times, it is the exact same data that a client just sent several times.

    _**Pro:**_ Simplified [conflict resolution](/influxdb/v1.5/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points) increases write performance.  
    _**Con:**_ Cannot store duplicate data; may overwrite data in rare circumstances.  

2.  Deletes are a rare occurrence.
    When they do occur it is almost always against large ranges of old data that are cold for writes.

    _**Pro:**_ Restricting access to deletes allows for increased query and write performance.  
    _**Con:**_ Delete functionality is significantly restricted.  

3.  Updates to existing data are a rare occurrence and contentious updates never happen.
    Time series data is predominantly new data that is never updated.

    _**Pro:**_ Restricting access to updates allows for increased query and write performance.  
    _**Con:**_ Update functionality is significantly restricted.  

4.  The vast majority of writes are for data with very recent timestamps and the data is added in time ascending order.

    _**Pro:**_ Adding data in time ascending order is significantly more performant.  
    _**Con:**_ Writing points with random times or with time not in ascending order is significantly less performant.  

5.  Scale is critical.
    The database must be able to handle a *high* volume of reads and writes.

    _**Pro:**_ The database can handle a *high* volume of reads and writes.  
    _**Con:**_ The InfluxDB development team was forced to make tradeoffs to increase performance.  

6.  Being able to write and query the data is more important than having a strongly consistent view.  

    _**Pro:**_ Writing and querying the database can be done by multiple clients and at high loads.  
    _**Con:**_ Query returns may not include the most recent points if database is under heavy load.  

7.  Many time [series](/influxdb/v1.5/concepts/glossary/#series) are ephemeral.
    There are often time series that appear only for a few hours and then go away, e.g.
    a new host that gets started and reports for a while and then gets shut down.

    _**Pro:**_ InfluxDB is good at managing discontinuous data.  
    _**Con:**_ Schema-less design means that some database functions are not supported e.g. there are no cross table joins.

8.  No one point is too important.

    _**Pro:**_ InfluxDB has very powerful tools to deal with aggregate data and large data sets.  
    _**Con:**_ Points don't have IDs in the traditional sense, they are differentiated by timestamp and series.  
