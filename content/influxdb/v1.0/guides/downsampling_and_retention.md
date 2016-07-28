---
title: Downsampling and Data Retention
menu:
  influxdb_1_0:
    weight: 11
    parent: guides
---

InfluxDB can handle hundreds of thousands of data points per second.
Working with that much data over a long period of time can create storage
concerns.
A natural solution is to downsample the data; keep the high precision raw data
for only a limited time, and store the lower precision, summarized data for much
longer or forever.

InfluxDB offers two features - Continuous Queries (CQ) and Retention Policies
(RP) - that automate the process of downsampling data and expiring old data.
This guide describes a practical use case for CQs and RPs and covers how to
set up those features in InfluxDB.

### Definitions

A **Continuous Query** (CQ) is an InfluxQL query that runs automatically and
periodically within a database.
CQs require a function in the `SELECT` clause and must include a
`GROUP BY time()` clause.

A **Retention Policy** (RP) is the part of InfluxDB's data structure
that describes for how long InfluxDB keeps data.
InfluxDB compares your local server's timestamp to the timestamps on your data
and deletes data that are older than the RP's `DURATION`.
A single database can have several RPs and RPs are unique per database.

This guide will not go into detail about the syntax for creating and managing
CQs and RPs.
If you're new to both concepts, we recommend looking over the detailed
[CQ documentation](/influxdb/v/influxdb/v1.0//query_language/continuous_queries/) and
[RP documentation](http://localhost:1313/influxdb/v1.0/query_language/database_management/#retention-policy-management).

### Sample data
This section uses fictional real-time data that track the number of food orders
to a restaurant via phone and via website at ten second intervals.
We will store those data in a
[database](/influxdb/v1.0/concepts/glossary/#database) called `food_data`, in
the [measurement](/influxdb/v1.0/concepts/glossary/#measurement) `orders`, and
in the [fields](/influxdb/v1.0/concepts/glossary/#field) `phone` and `website`.

Sample:
```
name: orders
------------
time			               phone	 website
2016-05-10T23:18:00Z	 10 	   30
2016-05-10T23:18:10Z	 12 	   39
2016-05-10T23:18:20Z	 11 	   56
```

### Goal
Assume that, in the long run, we're only interested in the average number of orders by phone
and by website at 30 minute intervals.
In the next steps, we use RPs and CQs to:

 * Automatically aggregate the ten-second resolution data to 30-minute resolution data
 * Automatically delete the raw, ten-second resolution data that are older than two hours
 * Automatically delete the 30-minute resolution data that are older than 52 weeks

### Database Preparation
We perform the following steps before writing the data to the database
`food_data`.
We do this **before** inserting any data because CQs only run against recent
data; that is, data with timestamps that are no older than `now()` minus
the `FOR` clause of the CQ, or `now()` minus the `GROUP BY time()` interval if
the CQ has no `FOR` clause.

#### 1. Create the database

```
> CREATE DATABASE "food_data"
```

#### 2. Create a two-hour `DEFAULT` RP

InfluxDB writes to the `DEFAULT` RP if we do not supply an explicit RP when
writing a point to the database.
We make the `DEFAULT` RP keep data for two hours, because we want InfluxDB to
automatically write the incoming ten-second resolution data to that RP.

Use the
[`CREATE RETENTION POLICY`](/influxdb/v1.0/query_language/database_management/#create-retention-policies-with-create-retention-policy)
statement to create a `DEFAULT` RP:

```sql
> CREATE RETENTION POLICY "two_hours" ON "food_data" DURATION 2h REPLICATION 1 DEFAULT
```

That query creates an RP called `two_hours` that exists in the database
`food_data`.
`two_hours` keeps data for a `DURATION` of two hours (`2h`) and it's the `DEFAULT`
RP for the database `food_data`.

<dt>
The replication factor (`REPLICATION 1`) is a required parameter but must always
be set to 1 for single node instances.
</dt>

> **Note:** When we created the `food_data` database in step 1, InfluxDB
automatically generated an RP named `autogen` and set it as the `DEFAULT`
RP for the database.
The `autogen` RP has an infinite retention period.
With the query above, the RP `two_hours` replaces `autogen` as the `DEFAULT` RP
for the `food_data` database.

#### 3. Create a 52-week RP

Next we want to create another RP that keeps data for 52 weeks and is not the
`DEFAULT` RP for the database.
Ultimately, the 30-minute rollup data will be stored in this RP.

Use the
[`CREATE RETENTION POLICY`](/influxdb/v1.0/query_language/database_management/#create-retention-policies-with-create-retention-policy)
statement to create a non-`DEFAULT` RP:

```sql
> CREATE RETENTION POLICY "a_year" ON "food_data" DURATION 52w REPLICATION 1
```

That query creates an RP called `a_year` that exists in the database
`food_data`.
`a_year` keeps data for a `DURATION` of 52 weeks (`52w`).
Leaving out the `DEFAULT` argument ensures that `a_year` is not the `DEFAULT`
RP for the database `food_data`.
That is, write and read operations against `food_data` that do not specify an
RP will still go to the `two_hours` RP (the `DEFAULT` RP).

#### 4. Create the CQ

Now that we've set up our RPs, we want to create a CQ that will automatically
and periodically downsample the ten-second resolution data to the 30-minute
resolution, and store those results in a different measurement with a different
retention policy.

Use the
[`CREATE CONTINUOUS QUERY`](/influxdb/v1.0/query_language/continuous_queries/)
statement to generate a CQ:

```sql
> CREATE CONTINUOUS QUERY "cq_30m" ON "food_data" BEGIN
  SELECT mean("website") AS "mean_website",mean("phone") AS "mean_phone"
  INTO "a_year"."downsampled_orders"
  FROM "orders"
  GROUP BY time(30m)
END
```

That query creates a CQ called `cq_30m` in the database `food_data`.
`cq_30m` tells InfluxDB to calculate the 30-minute average of the two fields
`website` and `phone` in the measurement `orders` and in the `DEFAULT` RP
`two_hours`.
It also tells InfluxDB to write those results to the measurement
`downsampled_orders` in the retention policy `a_year` with the field keys
`mean_website` and `mean_phone`.
InfluxDB will run this query every 30 minutes for the previous 30 minutes.

> **Note:** Notice that we fully qualify (that is, we use the syntax
`"<retention_policy>"."<measurement>"`) the measurement in the `INTO`
clause.
InfluxDB requires that syntax to write data to an RP other than the `DEFAULT`
RP.

### Results

With the new CQ and two new RPs, `food_data` is ready to start receiving data.
After writing data to our database and letting things run for a bit, we see
two measurements: `orders` and `downsampled_orders`.

```bash
> SELECT * FROM "orders" LIMIT 5
name: cpu
---------
time			                phone  website
2016-05-13T23:00:00Z	  10     30
2016-05-13T23:00:10Z	  12     39
2016-05-13T23:00:20Z	  11     56
2016-05-13T23:00:30Z	  8      34
2016-05-13T23:00:40Z	  17     32

> SELECT * FROM "a_year"."downsampled_orders" LIMIT 5
name: downsampled_cpu
---------------------
time			                mean_phone  mean_website
2016-05-13T15:00:00Z	  12          23
2016-05-13T15:30:00Z	  13          32
2016-05-13T16:00:00Z	  19          21
2016-05-13T16:30:00Z	  3           26
2016-05-13T17:00:00Z	  4           23
```

The data in `orders` are the raw, ten-second resolution data that reside in the
two-hour RP.
The data in `downsampled_orders` are the aggregated, 30-minute resolution data
that are subject to the 52-week RP.

Notice that the first timestamps in `downsample_orders` are older than the first
timestamps in `orders`.
This is because InfluxDB has already deleted data from `orders` with timestamps
that are older than our local server's timestamp minus two hours (assume we
  executed the `SELECT` queries at `2016-05-13T00:59:59Z`).
InfluxDB will only start dropping data from `downsampled_orders` after 52 weeks.

> **Notes:**
>
* Notice that we fully qualify (that is, we use the syntax
`"<retention_policy>"."<measurement>"`) `downsampled_orders` in
the second `SELECT` statement. We must specify the RP in that query to `SELECT`
data that reside in an RP other than the `DEFAULT` RP.
>
* By default, InfluxDB checks to enforce an RP every 30 minutes.
Between checks, `orders` may have data that are older than two hours.
The rate at which InfluxDB checks to enforce an RP is a configurable setting,
see
[Database Configuration](/influxdb/v1.0/administration/config/#check-interval-30m0s).

Using a combination of RPs and CQs, we've successfully set up our database to
automatically keep the high precision raw data for a limited time, create lower
precision data, and store that lower precision data for a longer period of time.
Now that you have a general understanding of how these features can work
together, we recommend looking at the detailed documentation on [CQs](/influxdb/v1.0/query_language/continuous_queries/) and [RPs](/influxdb/v1.0/query_language/database_management/#retention-policy-management)
to see all that they can do for you.
