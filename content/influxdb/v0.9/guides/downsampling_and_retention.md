---
title: Downsampling and Data Retention
---

InfluxDB can handle hundreds of thousands of data points per second. Working with that much data over a long period of time can create storage concerns. A natural solution is to downsample the data; keep the high precision raw data for only a limited time, and store the lower precision, summarized data for much longer or forever. 

This guide shows how to combine two InfluxDB features -- retention policies and continuous queries -- to automatically downsample and expire data.

## Retention Policies
### Definition  
A retention policy (RP) is the part of InfluxDB's data structure that describes for how long InfluxDB keeps data (duration) and how many copies of those data are stored in the cluster (replication factor). A database can have several RPs and RPs are unique per database.

### Purpose 
In general, InfluxDB wasn't built to process deletes. One of the fundamental assumptions in its architecture is that deletes are infrequent and need not be highly performant. However, InfluxDB recognizes the necessity of purging data that have outlived their usefulness - that is the purpose of RPs.

### Working with RPs 
When you create a database, InfluxDB automatically creates an RP called `default` with an infinite duration and a replication factor set to the number of nodes in the cluster. `default` also serves as the `DEFAULT` RP; if you do not supply an explicit RP when you write a point to the database, the data are subject to the `DEFAULT` RP.

You can also create, alter, and delete you own RPs, and you can change the database's `DEFAULT` RP. See [Database management](../query_language/database_management.html#retention-policy-management) for more on RP management.

> **Clarifying** `default` **vs.** `DEFAULT`

> `default`: The RP that InfluxDB automatically generates when you create a new database. It has an infinite duration and a replication factor set to the number of nodes in the cluster.

> `DEFAULT`: The RP that InfluxDB writes to if you do not supply an explicit RP in the write.

## Continuous Queries
### Definition
A continuous query (CQ) is an InfluxQL query that runs automatically and periodically within a database. CQs require a function in the `SELECT` clause and must include a `GROUP BY time()` clause. InfluxDB stores the results of the CQ in a specified measurement.

### Purpose
CQs are optimal for regularly downsampling data - once you implement the CQ, InfluxDB automatically and periodically runs the query, and, instead of simply returning the results like a normal query, InfluxDB stores the results of a CQ in a measurement for future use.

### Working with CQs
The section below offers a very brief introduction to creating CQs. See [Continuous Queries](../query_language/continuous_queries.html) for a detailed discussion on how to create and manage CQs.

## Combining RPs and CQs - a casestudy
We have real-time data that track the number of food orders to a restaurant via phone and via website at 10 second intervals. In the long run, we're only interested in the average number of orders by phone and by website at 30 minute intervals. In the next steps, we use RPs and CQs to make InfluxDB:
 
 * automatically delete the raw 10 second level data that are older than two hours
 * automatically aggregate the 10 second level data to 30 minute level data
 * keep the 30 minute level data forever 

The following steps work with a fictional [database](../concepts/glossary.html#database) called `food_data` and the [measurement](../concepts/glossary.html#measurement) `orders`. `orders` has two [fields](../concepts/glossary.html#field), `phone` and `website`, which store the number of orders that arrive through the relevant median every 10 seconds.

### Prepare the database
Before writing the data to the database `food_data`, we perform the following steps. 

> **Note:** We do this before inserting any data because InfluxDB only performs CQs on new data, that is, data with timestamps that occur after the time at which we create the CQ.

#### Create a new `DEFAULT` RP 
When we initially [created the database](../query_language/database_management.html#create-a-database-with-create-database) `food_data`, InfluxDB automatically generated an RP called `default` with an infinite duration and a replication factor set to the number of nodes in the cluster. `default` is also the `DEFAULT` RP for `food_data`; if we do not supply an explicit RP when we write a point to the database, InfluxDB writes the point to `default` and it keeps those data forever.

We want the `DEFAULT` RP on `food_data` to be a two hour policy. To create our new RP, we enter the following command:

```sql
> CREATE RETENTION POLICY two_hours ON food_data DURATION 2h REPLICATION 1 DEFAULT
```
That query makes the `two_hours` RP the `DEFAULT` RP in `food_data`. When we write data to the database and do not supply an RP in the write, InfluxDB automatically stores those data in the `two_hours` RP. Once those data have timestamps that are older than two hours, InfluxDB deletes those data. For a more detailed discussion on the `CREATE RETENTION POLICY` syntax, see [Database Management](../query_language/database_management.html#retention-policy-management).
    
To clarify, we've included the results from the [`SHOW RETENTION POLICIES`](../query_language/schema_exploration.html#explore-retention-policies-with-show-retention-policies) query below. Notice that there are two RPs in `food_data` (`default` and `two_hours`) and that the third column identifies `two_hours` as the `DEFAULT` RP.
    
```sh
> SHOW RETENTION POLICIES ON food_data
name		      duration	  replicaN	  default
default		   0		        1		        false
two_hours	  2h0m0s		   1		        true
```
    
#### Create the CQ
Now we create a CQ that automatically downsamples the 10 second level data to 30 minute level data:

```sql
> CREATE CONTINUOUS QUERY cq_30m ON food_data BEGIN SELECT mean(website) AS mean_website,mean(phone) AS mean_phone INTO food_data."default".downsampled_orders FROM orders GROUP BY time(30m) END
```
That CQ makes InfluxDB automatically and periodically calculate the 30 minute average from the 10 second website order data and the 30 minute average from the 10 second phone order data. InfluxDB also writes the CQ's results into the measurement `downsampled_orders` and to the RP `default`; InfluxDB stores the aggregated data in `downsampled_orders` forever.

For a more detailed discussion on the `CREATE CONTINUOUS QUERY` syntax, see [Continuous Queries](../query_language/continuous_queries.html).

### Write the data to InfluxDB and see the results
Now that we've prepped `food_data`, we start writing the data to InfluxDB and let things run for a bit. After a while, we see that the database has two measurements: `orders` and `downsampled_orders`.

A sample of the oldest data in `orders` - these are the raw 10 second data subject to the `two_hours` RP:
```sh
> SELECT * FROM orders LIMIT 5
name: orders
-----------------
time						            phone 	website
2015-12-04T20:00:11Z	 1	     6
2015-12-04T20:00:20Z		9	     10
2015-12-04T20:00:30Z		2	     17
2015-12-04T20:00:40Z		3	     10
2015-12-04T20:00:50Z		1	     15
```
We submitted this query on 12/04/2015 at 22:08:19 UTC  - notice that the oldest data have timestamps that are no older than around two hours ago<sup>[1](#retentionconfig)</sup>.

A sample of the oldest data in `downsampled_orders` - these are the aggregated data subject to the `default` RP:
```sh
> SELECT * FROM food_data."default".downsampled_orders LIMIT 5
name: downsampled_orders
------------------------
time			               mean_phone		       mean_website
2015-12-03T22:30:00Z	 4.318181818181818	 9.254545454545454
2015-12-03T23:00:00Z	 4.266666666666667	 9.827777777777778
2015-12-03T23:30:00Z	 4.766666666666667	 9.677777777777777
2015-12-04T00:00:00Z	 4.405555555555556	 8.5
2015-12-04T00:30:00Z	 4.788888888888889	 9.383333333333333
```
Notice that the timestamps in `downsampled_orders` occur at 30 minute intervals and that the measurement has timestamps that are older than those in the `orders` measurement. The data in `downsampled_orders` aren't subject to the `two_hours` RP.

> **Note:** You must specify the RP in your query in order to select data that are subject to an RP other than the `DEFAULT` RP. In the second `SELECT` statement, we get the CQ results by specifying the database, RP, and measurement name in the query. 

Using a combination of RPs and CQs, we've made InfluxDB automatically downsample data and expire old data. Now that you have a general understanding of how these features can work together, we recommend looking at the detailed documentation on [CQs](../query_language/continuous_queries.html) and [RPs](../query_language/database_management.html#retention-policy-management) to see all that they can do for you.

<a name="retentionconfig">1</a>: By default, InfluxDB checks to enforce an RP every 30 minutes so you may have data that are older than two hours between checks. The rate at which InfluxDB checks to enforce an RP is a configurable setting, see [Database Configuration](../administration/config.html#retention).

