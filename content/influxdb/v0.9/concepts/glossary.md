---
title: Glossary of Terms
menu:
  influxdb_09:
    weight: 10
    parent: concepts
---

## aggregation
An InfluxQL function that returns an aggregated value across a set of points. See [InfluxQL Functions](/influxdb/v0.9/query_language/functions/#aggregations) for a complete list of the available and upcoming aggregations.

Related entries: [function](/influxdb/v0.9/concepts/glossary/#function), [selector](/influxdb/v0.9/concepts/glossary/#selector), [transformation](/influxdb/v0.9/concepts/glossary/#transformation)

## cluster
A collection of servers running InfluxDB nodes. All nodes in a cluster have the same users, databases, retention policies, and continuous queries. See [Clustering](/influxdb/v0.9/guides/clustering/) for how to set up an InfluxDB cluster.

Related entries: [node](/influxdb/v0.9/concepts/glossary/#node), [server](/influxdb/v0.9/concepts/glossary/#server)
	
## continuous query (CQ)
An InfluxQL query that runs automatically and periodically within a database. Continuous queries require a function in the `SELECT` clause and must include a `GROUP BY time()` clause. See [Continuous Queries](/influxdb/v0.9/query_language/continuous_queries/).  

Related entries: [function](/influxdb/v0.9/concepts/glossary/#function)

## coordinator node
The node that receives write and query requests for the cluster.  

Related entries: [cluster](/influxdb/v0.9/concepts/glossary/#cluster), [hinted handoff](/influxdb/v0.9/concepts/glossary/#hinted-handoff), [node](/influxdb/v0.9/concepts/glossary/#node)
	
## database
A logical container for users, retention policies, continuous queries, and time series data.

Related entries: [continuous query](/influxdb/v0.9/concepts/glossary/#continuous-query-cq), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp), [user](/influxdb/v0.9/concepts/glossary/#user)

## duration
The attribute of the retention policy that determines how long InfluxDB stores data. Data older than the duration are automatically dropped from the database. See [Database Management](/influxdb/v0.9/query_language/database_management/#create-retention-policies-with-create-retention-policy) for how to set duration.
	
Related entries: [replication factor](/influxdb/v0.9/concepts/glossary/#replication-factor), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp) 

## field
The key-value pair in InfluxDB's data structure that records metadata and the actual data value. Fields are required in InfluxDB's data structure and they are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant relative to tags.

*Query tip:* Compare fields to tags; tags are indexed.

Related entries: [field key](/influxdb/v0.9/concepts/glossary/#field-key), [field set](/influxdb/v0.9/concepts/glossary/#field-set), [field value](/influxdb/v0.9/concepts/glossary/#field-value), [tag](/influxdb/v0.9/concepts/glossary/#tag)
	
## field key
The key part of the key-value pair that makes up a field. Field keys are strings and they store metadata. 

Related entries: [field](/influxdb/v0.9/concepts/glossary/#field), [field set](/influxdb/v0.9/concepts/glossary/#field-set), [field value](/influxdb/v0.9/concepts/glossary/#field-value), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key)
	
## field set
The collection of field keys and field values on a point.

Related entries: [field](/influxdb/v0.9/concepts/glossary/#field), [field key](/influxdb/v0.9/concepts/glossary/#field-key), [field value](/influxdb/v0.9/concepts/glossary/#field-value), [point](/influxdb/v0.9/concepts/glossary/#point)  
	
## field value  
The value part of the key-value pair that makes up a field. Field values are the actual data; they can be strings, floats, integers, or booleans. A field value is always associated with a timestamp.

Field values are not indexed - queries on field values scan all points that match the specified time range and, as a result, are not performant.

*Query tip:* Compare field values to tag values; tag values are indexed.

Related entries: [field](/influxdb/v0.9/concepts/glossary/#field), [field key](/influxdb/v0.9/concepts/glossary/#field-key), [field set](/influxdb/v0.9/concepts/glossary/#field-set), [tag value](/influxdb/v0.9/concepts/glossary/#tag-value), [timestamp](/influxdb/v0.9/concepts/glossary/#timestamp)
	
## function
InfluxQL aggregations, selectors, and transformations. See [InfluxQL Functions](/influxdb/v0.9/query_language/functions/) for a complete list of InfluxQL functions.

Related entries: [aggregation](/influxdb/v0.9/concepts/glossary/#aggregation), [selector](/influxdb/v0.9/concepts/glossary/#selector), [transformation](/influxdb/v0.9/concepts/glossary/#transformation)  

## hinted handoff
A durable queue of data destined for a server which was unavailable at the time the data was received. Coordinating nodes temporarily store queued data when a target node for a write is down for a short period of time.

Related entries: [cluster](/influxdb/v0.9/concepts/glossary/#cluster), [node](/influxdb/v0.9/concepts/glossary/#node), [server](/influxdb/v0.9/concepts/glossary/#server)

## identifier
Tokens which refer to database names, retention policy names, user names, measurement names, tag keys, and field keys. See [Query Language Specification](/influxdb/v0.9/query_language/spec/#identifiers).

Related entries: [database](/influxdb/v0.9/concepts/glossary/#database), [field key](/influxdb/v0.9/concepts/glossary/#field-key), [measurement](/influxdb/v0.9/concepts/glossary/#measurement), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key), [user](/influxdb/v0.9/concepts/glossary/#user)

## measurement  
The part of InfluxDB's structure that describes the data stored in the associated fields. Measurements are strings.

Related entries: [field](/influxdb/v0.9/concepts/glossary/#field), [series](/influxdb/v0.9/concepts/glossary/#series)

## node
An independent `influxd` process.

Related entries: [cluster](/influxdb/v0.9/concepts/glossary/#cluster), [server](/influxdb/v0.9/concepts/glossary/#server)

## point   
The part of InfluxDB's data structure that consists of a single collection of fields in a series. Each point is uniquely identified by its series and timestamp.

You cannot store more than one point with the same timestamp in the same series. Instead, when you write a new point to the same series with the same timestamp as an existing point in that series, InfluxDB silently overwrites the old field set with the new field set.

Related entries: [field set](/influxdb/v0.9/concepts/glossary/#field-set), [series](/influxdb/v0.9/concepts/glossary/#series), [timestamp](/influxdb/v0.9/concepts/glossary/#timestamp)

## query
An operation that retrieves data from InfluxDB. See [Data Exploration](/influxdb/v0.9/query_language/data_exploration/), [Schema Exploration](/influxdb/v0.9/query_language/schema_exploration/), [Database Management](/influxdb/v0.9/query_language/database_management/).
	
## replication factor  
The attribute of the retention policy that determines how many copies of the data are stored in the cluster. InfluxDB replicates data across `N` data nodes, where `N` is the replication factor.

To maintain data availability for queries, the replication factor should be less than or equal to the number of data nodes in the cluster:

* Data are fully available when the replication factor is greater than the number of *unavailable* data nodes. 
* Data may be unavailable when the replication factor is less than the number of *unavailable* data nodes.

Note that there are no query performance benefits from replication. Replication is for ensuring data availability when a data node or nodes are unavailable. See [Database Management](/influxdb/v0.9/query_language/database_management/#create-retention-policies-with-create-retention-policy) for how to set the replication factor.
	
Related entries: [cluster](/influxdb/v0.9/concepts/glossary/#cluster), [duration](/influxdb/v0.9/concepts/glossary/#duration), [node](/influxdb/v0.9/concepts/glossary/#node), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp)

## retention policy (RP)
The part of InfluxDB's data structure that describes for how long InfluxDB keeps data (duration) and how many copies of those data are stored in the cluster (replication factor). RPs are unique per database and along with the measurement and tag set define a series.

When you create a database, InfluxDB automatically creates a retention policy called `default` with an infinite duration and a replication factor set to the number of nodes in the cluster. See [Database Management](/influxdb/v0.9/query_language/database_management/#retention-policy-management) for retention policy management.
	
Related entries: [duration](/influxdb/v0.9/concepts/glossary/#duration), [measurement](/influxdb/v0.9/concepts/glossary/#measurement), [replication factor](/influxdb/v0.9/concepts/glossary/#replication-factor), [series](/influxdb/v0.9/concepts/glossary/#series), [tag set](/influxdb/v0.9/concepts/glossary/#tag-set)

## schema
How the data are organized in InfluxDB. The fundamentals of the InfluxDB schema are databases, retention policies, series, measurements, tag keys, tag values, and field keys.

Related entries: [database](/influxdb/v0.9/concepts/glossary/#database), [field key](/influxdb/v0.9/concepts/glossary/#field-key), [measurement](/influxdb/v0.9/concepts/glossary/#measurement), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp), [series](/influxdb/v0.9/concepts/glossary/#series), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key), [tag value](/influxdb/v0.9/concepts/glossary/#tag-value)
	
## selector  
An InfluxQL function that returns a single point from the range of specified points. See [InfluxQL Functions](/influxdb/v0.9/query_language/functions/#selectors) for a complete list of the available and upcoming selectors.

Related entries: [aggregation](/influxdb/v0.9/concepts/glossary/#aggregation), [function](/influxdb/v0.9/concepts/glossary/#function), [transformation](/influxdb/v0.9/concepts/glossary/#transformation)
	
## series  
The collection of data in InfluxDB's data structure that share a measurement, tag set, and retention policy. 

> **Note:** The field set is not part of the series identification!

Related entries: [field set](/influxdb/v0.9/concepts/glossary/#field-set), [measurement](/influxdb/v0.9/concepts/glossary/#measurement), [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp), [tag set](/influxdb/v0.9/concepts/glossary/#tag-set)

## series cardinality
The count of all combinations of measurements and tags within a given data set. For example, take measurement `mem_available` with tags `host` and `total_mem`.  If there are 35 different `host`s and 15 different `total_mem` values then series cardinality for that measurement is `35 * 15 = 525`. To calculate series cardinality for a database add the series cardinalities for the individual measurements together.

Related entries: [tag set](/influxdb/v0.9/concepts/glossary/#tag-set), [measurement](/influxdb/v0.9/concepts/glossary/#measurement), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key)

## server  
A machine, virtual or physical, that is running InfluxDB. There should only be one InfluxDB process per server.

Related entries: [cluster](/influxdb/v0.9/concepts/glossary/#cluster), [node](/influxdb/v0.9/concepts/glossary/#node)

## tag  
The key-value pair in InfluxDB's data structure that records metadata. Tags are an optional part of InfluxDB's data structure but they are useful for storing commonly-queried metadata; tags are indexed so queries on tags are performant.
	
*Query tip:* Compare tags to fields; fields are not indexed.

Related entries: [field](/influxdb/v0.9/concepts/glossary/#field), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key), [tag set](/influxdb/v0.9/concepts/glossary/#tag-set), [tag value](/influxdb/v0.9/concepts/glossary/#tag-value)

## tag key  
The key part of the key-value pair that makes up a tag. Tag keys are strings and they store metadata. Tag keys are indexed so queries on tag keys are performant.

*Query tip:* Compare tag keys to field keys; field keys are not indexed.

Related entries: [field key](/influxdb/v0.9/concepts/glossary/#field-key), [tag](/influxdb/v0.9/concepts/glossary/#tag), [tag set](/influxdb/v0.9/concepts/glossary/#tag-set), [tag value](/influxdb/v0.9/concepts/glossary/#tag-value) 
	
## tag set
The collection of tag keys and tag values on a point. 

Related entries: [point](/influxdb/v0.9/concepts/glossary/#point), [series](/influxdb/v0.9/concepts/glossary/#series), [tag](/influxdb/v0.9/concepts/glossary/#tag), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key), [tag value](/influxdb/v0.9/concepts/glossary/#tag-value)
 
## tag value  
The value part of the key-value pair that makes up a tag. Tag values are strings and they store metadata. Tag values are indexed so queries on tag values are performant.  

Related entries: [tag](/influxdb/v0.9/concepts/glossary/#tag), [tag key](/influxdb/v0.9/concepts/glossary/#tag-key), [tag set](/influxdb/v0.9/concepts/glossary/#tag-set)

## timestamp  
The date and time associated with a point. All time in InfluxDB is UTC.

For how to specify time when writing data, see [Write Syntax](/influxdb/v0.9/write_protocols/write_syntax/). For how to specify time when querying data, see [Data Exploration](/influxdb/v0.9/query_language/data_exploration/#time-syntax-in-queries).

Related entries: [point](/influxdb/v0.9/concepts/glossary/#point)
	
## transformation  
An InfluxQL function that returns a value or a set of values calculated from specified points, but does not return an aggregated value across those points. See [InfluxQL Functions](/influxdb/v0.9/query_language/functions/#transformations) for a complete list of the available and upcoming aggregations.

Related entries: [aggregation](/influxdb/v0.9/concepts/glossary/#aggregation), [function](/influxdb/v0.9/concepts/glossary/#function), [selector](/influxdb/v0.9/concepts/glossary/#selector)
	
## user  
There are two kinds of users in InfluxDB:

* *Admin users* have `READ` and `WRITE` access to all databases and full access to administrative queries and user management commands.
* *Non-admin users* have `READ`, `WRITE`, or `ALL` (both `READ` and `WRITE`) access per database. 

When authentication is enabled, InfluxDB only executes HTTP requests that are sent with a valid username and password. See [Authentication and Authorization](/influxdb/v0.9/administration/authentication_and_authorization/).

<!--
## wal

## shard

## shard group

## storage engines (tsm1, b1, bz1)

-->
