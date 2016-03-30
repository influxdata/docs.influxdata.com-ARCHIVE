---
title: Query Management

menu:
  influxdb_012:
    weight: 20
    parent: troubleshooting
---

Intro TK when this page is finished.
Include why this is important (user can identify currently-running queries and can kill queries that are overloading their system).

* [List currently-running queries with `SHOW QUERIES`](/influxdb/v0.12/troubleshooting/query_management/#list-currently-running-queries-with-show-queries)
* [Stop currently-running queries with `KILL QUERY`](/influxdb/v0.12/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query)

## List currently-running queries with `SHOW QUERIES`
`SHOW QUERIES` lists the query id, query text, relevant database, and duration
of all currently-running queries on your InfluxDB instance.

##### Syntax:
```
SHOW QUERIES
```

##### Example:
<br>
```
> SHOW QUERIES
qid	  query															               database		  duration
37	   SHOW QUERIES																                	  100368u
36	   SELECT mean(myfield) FROM mymeas   mydb        3s
```

##### Explanation of the output:
<br>
`qid`: The id number of the query. Use this value with [`KILL QUERY`](/influxdb/v0.12/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query).  
`query`: The query text.  
`database`: The database targeted by the query.  
`duration`: The length of time that the query has been running.
See [Query Language Reference](/influxdb/v0.12/query_language/spec/#durations)
for an explanation of InfluxDB's time units.

## Stop currently-running queries with `KILL QUERY`
`KILL QUERY` tells InfluxDB to stop running the relevant query.

##### Syntax:
Where `qid` is the id of the query from the [`SHOW QUERIES`](/influxdb/v0.12/troubleshooting/query_management/#list-currently-running-queries-with-show-queries) output:
```
KILL QUERY <qid>
```

##### Example:
<br>
```
> KILL QUERY 36
>
```

A successful `KILL QUERY` query returns no results.
