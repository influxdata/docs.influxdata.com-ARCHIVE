---
title: Glossary of Terms
menu:
  influxdb:
    weight: 10
    parent: concepts
---

## aggregation
An InfluxQL function that returns an aggregated value across a set of points. See [InfluxQL Functions](../query_language/functions.html#aggregations) for a complete list of the available and upcoming aggregations.

Related entries: [function](../concepts/glossary.html#function), [selector](../concepts/glossary.html#selector), [transformation](../concepts/glossary.html#transformation)

## cluster
A collection of servers running InfluxDB nodes. All nodes in a cluster have the same users, databases, retention policies, and continuous queries. See [Clustering](../guides/clustering.html) for how to set up an InfluxDB cluster.

Related entries: [node](../concepts/glossary.html#node), [server](../concepts/glossary.html#server)
	
## continuous query (CQ)
An InfluxQL query that runs automatically and periodically within a database. Continuous queries require a function in the `SELECT` clause and must include a `GROUP BY time()` clause. See [Continuous Queries](../query_language/continuous_queries.html).  

Related entries: [function](../concepts/glossary.html#function)

## coordinator node
The node that receives write and query requests for the cluster.  

Related entries: [cluster](../concepts/glossary.html#cluster), [hinted handoff](../concepts/glossary.html#hinted-handoff), [node](../concepts/glossary.html#node)
	
## database
A logical container for users, retention policies, continuous queries, and time series data.

Related entries: [continuous query](../concepts/glossary.html#continuous-query-cq), [retention policy](../concepts/glossary.html#retention-policy-rp), [user](../concepts/glossary.html#user)

## duration
The attribute of the retention policy that determines how long InfluxDB stores data. Data older than the duration are automatically dropped from the database. See [Database Management](../query_language/database_management.html#create-retention-policies-with-create-retention-policy) for how to set duration.
	
Related entries: [replication factor](../concepts/glossary.html#replication-factor), [retention policy](../concepts/glossary.html#retention-policy-rp) 

## field
The key-value pair in InfluxDB's data structure that records metadata and the actual data value. Fields are required in InfluxDB's data structure and they are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant relative to tags.

*Query tip:* Compare fields to tags; tags are indexed.

Related entries: [field key](../concepts/glossary.html#field-key), [field set](../concepts/glossary.html#field-set), [field value](../concepts/glossary.html#field-value), [tag](../concepts/glossary.html#tag)
	
## field key
The key part of the key-value pair that makes up a field. Field keys are strings and they store metadata. 

Related entries: [field](../concepts/glossary.html#field), [field set](../concepts/glossary.html#field-set), [field value](../concepts/glossary.html#field-value), [tag key](../concepts/glossary.html#tag-key)
	
## field set
The collection of field keys and field values on a point.

Related entries: [field](../concepts/glossary.html#field), [field key](../concepts/glossary.html#field-key), [field value](../concepts/glossary.html#field-value), [point](../concepts/glossary.html#point)  
	
## field value  
The value part of the key-value pair that makes up a field. Field values are the actual data; they can be strings, floats, integers, or booleans. A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](../concepts/glossary.html#field), [field key](../concepts/glossary.html#field-key), [field set](../concepts/glossary.html#field-set), [tag value](../concepts/glossary.html#tag-value), [timestamp](../concepts/glossary.html#timestamp)
	
## function
InfluxQL aggregations, selectors, and transformations. See [InfluxQL Functions](../query_language/functions.html) for a complete list of InfluxQL functions.

Related entries: [aggregation](../concepts/glossary.html#aggregation), [selector](../concepts/glossary.html#selector), [transformation](../concepts/glossary.html#transformation)  

## hinted handoff
A durable queue of data destined for a server which was unavailable at the time the data was received. Coordinating nodes temporarily store queued data when a target node for a write is down for a short period of time.

Related entries: [cluster](../concepts/glossary.html#cluster), [node](../concepts/glossary.html#node), [server](../concepts/glossary.html#server)

## identifier
Tokens which refer to database names, retention policy names, user names, measurement names, tag keys, and field keys. See [Query Language Specification](../query_language/spec.html#identifiers).

Related entries: [database](../concepts/glossary.html#database), [field key](../concepts/glossary.html#field-key), [measurement](../concepts/glossary.html#measurement), [retention policy](../concepts/glossary.html#retention-policy-rp), [tag key](../concepts/glossary.html#tag-key), [user](../concepts/glossary.html#user)

## measurement  
The part of InfluxDB's structure that describes the data stored in the associated fields. Measurements are strings.

Related entries: [field](../concepts/glossary.html#field), [series](../concepts/glossary.html#series)

## node
An independent `influxd` process.

Related entries: [cluster](../concepts/glossary.html#cluster), [server](../concepts/glossary.html#server)

## point   
The part of InfluxDB's data structure that consists of a single collection of fields in a series. Each point is uniquely identified by its series and timestamp.

You cannot store more than one point with the same timestamp in the same series. Instead, when you write a new point to the same series with the same timestamp as an existing point in that series, InfluxDB silently overwrites the old field set with the new field set.

Related entries: [field set](../concepts/glossary.html#field-set), [series](../concepts/glossary.html#series), [timestamp](../concepts/glossary.html#timestamp)

## query
An operation that retrieves data from InfluxDB. See [Data Exploration](../query_language/data_exploration.html), [Schema Exploration](../query_language/schema_exploration.html), [Database Management](../query_language/database_management.html).
	
## replication factor  
The attribute of the retention policy that determines how many copies of the data are stored in the cluster. InfluxDB replicates data across `N` data nodes, where `N` is the replication factor.

To maintain data availability for queries, the replication factor should be less than or equal to the number of data nodes in the cluster:

* Data are fully available when the replication factor is greater than the number of *unavailable* data nodes. 
* Data may be unavailable when the replication factor is less than the number of *unavailable* data nodes.

Note that there are no query performance benefits from replication. Replication is for ensuring data availability when a data node or nodes are unavailable. See [Database Management](../query_language/database_management.html#create-retention-policies-with-create-retention-policy) for how to set the replication factor.
	
Related entries: [cluster](../concepts/glossary.html#cluster), [duration](../concepts/glossary.html#duration), [node](../concepts/glossary.html#node), [retention policy](../concepts/glossary.html#retention-policy-rp)

## retention policy (RP)
The part of InfluxDB's data structure that describes for how long InfluxDB keeps data (duration) and how many copies of those data are stored in the cluster (replication factor). RPs are unique per database and along with the measurement and tag set define a series.

When you create a database, InfluxDB automatically creates a retention policy called `default` with an infinite duration and a replication factor set to the number of nodes in the cluster. See [Database Management](../query_language/database_management.html#retention-policy-management) for retention policy management.
	
Related entries: [duration](../concepts/glossary.html#duration), [measurement](../concepts/glossary.html#measurement), [replication factor](../concepts/glossary.html#replication-factor), [series](../concepts/glossary.html#series), [tag set](../concepts/glossary.html#tag-set)

## schema
How the data are organized in InfluxDB. The fundamentals of the InfluxDB schema are databases, retention policies, series, measurements, tag keys, tag values, and field keys.

Related entries: [database](../concepts/glossary.html#database), [field key](../concepts/glossary.html#field-key), [measurement](../concepts/glossary.html#measurement), [retention policy](../concepts/glossary.html#retention-policy-rp), [series](../concepts/glossary.html#series), [tag key](../concepts/glossary.html#tag-key), [tag value](../concepts/glossary.html#tag-value)
	
## selector  
An InfluxQL function that returns a single point from the range of specified points. See [InfluxQL Functions](../query_language/functions.html#selectors) for a complete list of the available and upcoming selectors.

Related entries: [aggregation](../concepts/glossary.html#aggregation), [function](../concepts/glossary.html#function), [transformation](../concepts/glossary.html#transformation)
	
## series  
The collection of data in InfluxDB's data structure that share a measurement, tag set, and retention policy. 

> **Note:** The field set is not part of the series identification!

Related entries: [field set](../concepts/glossary.html#field-set), [measurement](../concepts/glossary.html#measurement), [retention policy](../concepts/glossary.html#retention-policy-rp), [tag set](../concepts/glossary.html#tag-set)

## series cardinality
The count of all combinations of measurements and tags within a given data set. For example, take measurement `mem_available` with tags `host` and `total_mem`.  If there are 35 different `host`s and 15 different `total_mem` values then series cardinality for that measurement is `35 * 15 = 525`. To calculate series cardinality for a database add the series cardinalities for the individual measurements together.

Related entries: [tag set](../concepts/glossary.html#tag-set), [measurement](../concepts/glossary.html#measurement), [tag key](../concepts/glossary.html#tag-key)

## server  
A machine, virtual or physical, that is running InfluxDB. There should only be one InfluxDB process per server.

Related entries: [cluster](../concepts/glossary.html#cluster), [node](../concepts/glossary.html#node)

## tag  
The key-value pair in InfluxDB's data structure that records metadata. Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
	
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](../concepts/glossary.html#field), [tag key](../concepts/glossary.html#tag-key), [tag set](../concepts/glossary.html#tag-set), [tag value](../concepts/glossary.html#tag-value)

## tag key  
The key part of the key-value pair that makes up a tag. Tag keys are strings and they store metadata. Tag keys are indexed so queries on tag keys are performant.

*Query tip:* Compare tag keys to field keys; field keys are not indexed.

Related entries: [field key](../concepts/glossary.html#field-key), [tag](../concepts/glossary.html#tag), [tag set](../concepts/glossary.html#tag-set), [tag value](../concepts/glossary.html#tag-value) 
	
## tag set
The collection of tag keys and tag values on a point. 

Related entries: [point](../concepts/glossary.html#point), [series](../concepts/glossary.html#series), [tag](../concepts/glossary.html#tag), [tag key](../concepts/glossary.html#tag-key), [tag value](../concepts/glossary.html#tag-value)
 
## tag value  
The value part of the key-value pair that makes up a tag. Tag values are strings and they store metadata. Tag values are indexed so queries on tag values are performant.  

Related entries: [tag](../concepts/glossary.html#tag), [tag key](../concepts/glossary.html#tag-key), [tag set](../concepts/glossary.html#tag-set)

## timestamp  
The date and time associated with a point. All time in InfluxDB is UTC.

For how to specify time when writing data, see [Write Syntax](../write_protocols/write_syntax.html). For how to specify time when querying data, see [Data Exploration](../query_language/data_exploration.html#time-syntax-in-queries).

Related entries: [point](../concepts/glossary.html#point)
	
## transformation  
An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points. See [InfluxQL Functions](../query_language/functions.html#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregation](../concepts/glossary.html#aggregation), [function](../concepts/glossary.html#function), [selector](../concepts/glossary.html#selector)
	
## user  
There are two kinds of users in InfluxDB:

* *Admin users* have `READ` and `WRITE` access to all databases and full access to administrative queries and user management commands.
* *Non-admin users* have `READ`, `WRITE`, or `ALL` (both `READ` and `WRITE`) access per database. 

When authentication is enabled, InfluxDB only executes HTTP requests that are sent with a valid username and password. See [Authentication and Authorization](../administration/authentication_and_authorization.html).

<!--
## wal

## shard

## shard group

## storage engines (tsm1, b1, bz1)

-->
