---
title: Continuous Query Use Cases
menu:
  influxdb_013:
    weight: 11
    parent: guides
---

A Continuous Query (CQ) is an InfluxQL query that runs automatically and
periodically within a database.
CQs require a function in the `SELECT` clause and must include a
`GROUP BY time()` clause.

CQs are great for:

* [Downsampling and configuring data retention](#downsampling-and-data-retention)
* [Substituting for nested functions and HAVING clauses](#substituting-for-nested-functions-and-having-clauses)

This guide will not go into detail about the syntax for creating and managing
CQs.
If you're new to CQs, we recommend looking over the detailed [CQ documentation](/influxdb/v0.13/query_language/continuous_queries/).

## Downsampling and Data Retention

InfluxDB can handle hundreds of thousands of data points per second.
Working with that much data over a long period of time can create storage
concerns.
A natural solution is to downsample the data; keep the high precision raw data
for only a limited time, and store the lower precision, summarized data for much
longer or forever.

By the end of this section you will know how to combine two InfluxDB features
-- Retention Policies and CQs -- to automatically downsample and expire
data.

> A **Retention Policy** (RP) is the part of InfluxDB's data structure
that describes for how long InfluxDB keeps data.
InfluxDB compares your local server's timestamp to the timestamps on your data
and deletes data that are older than the RP's `DURATION`.
A single database can have several RPs and RPs are unique per database.
>
This guide will not go into detail about the syntax for creating and managing
RPs.
If you're new to RPs, we recommend looking over the detailed
[RP documentation](http://localhost:1313/influxdb/v0.13/query_language/database_management/#retention-policy-management).

### Sample data
This section uses fictional real-time data that track the number of food orders
to a restaurant via phone and via website at ten second intervals.
We will store those data in a
[database](/influxdb/v0.13/concepts/glossary/#database) called `food_data`, in
the [measurement](/influxdb/v0.13/concepts/glossary/#measurement) `orders`, and
in the [fields](/influxdb/v0.13/concepts/glossary/#field) `phone` and `website`.

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

 * Automatically delete the raw, ten-second resolution data that are older than two hours
 * Automatically aggregate the ten-second resolution data to 30-minute resolution data
 * Automatically delete the 30-minute resolution data that are older than 52 weeks

### Database Preparation
We perform the following steps before writing the data to the database
`food_data`.
We do this **before** inserting any data because InfluxDB only performs CQs on
new data, that is, data with timestamps that occur after the initial execution
of the CQ.

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
[`CREATE RETENTION POLICY`](/influxdb/v0.13/query_language/database_management/#create-retention-policies-with-create-retention-policy)
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
[`CREATE RETENTION POLICY`](/influxdb/v0.13/query_language/database_management/#create-retention-policies-with-create-retention-policy)
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
[`CREATE CONTINUOUS QUERY`](/influxdb/v0.13/query_language/continuous_queries/)
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
`"<database>"."<retention_policy>"."<measurement>"`) the measurement in the `INTO`
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
`"<database>"."<retention_policy>"."<measurement>"`) `downsampled_orders` in
the second `SELECT` statement. We must specify the RP in that query to `SELECT`
data that reside in an RP other than the `DEFAULT` RP.
>
* By default, InfluxDB checks to enforce an RP every 30 minutes.
Between checks, `orders` may have data that are older than two hours.
The rate at which InfluxDB checks to enforce an RP is a configurable setting,
see
[Database Configuration](/influxdb/v0.13/administration/config/#check-interval-30m0s).

Using a combination of RPs and CQs, we've automatically downsampled data and
expired old data.
Now that you have a general understanding of how these features can work
together, we recommend looking at the detailed documentation on [CQs](/influxdb/v0.13/query_language/continuous_queries/) and [RPs](/influxdb/v0.13/query_language/database_management/#retention-policy-management)
to see all that they can do for you.

## Substituting for nested functions and HAVING clauses

InfluxQL is a SQL-like query language for interacting with InfluxDB.
While InfluxQL resembles SQL in functionality, it does not always have similar
syntax.

By the end of this section you will know how to use InfluxDB's CQs to get the
same functionality as nested functions and SQL's `HAVING` clauses.

### Sample data

This section uses a sample of the data from the
[NOAA database](http://localhost:1313/influxdb/v0.13/sample_data/data_download/)
where the `location` is `santa_monica` and the time ranges from September 14,
2015 at `00:00:00` and September 16, 2015 at `23:59:59`:

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= '2015-09-14T00:00:00Z' AND time < '2015-09-17T00:00:00Z'
name: h2o_feet
--------------
time			                water_level
2015-09-14T00:00:00Z	  2.339
2015-09-14T00:06:00Z	  2.395
2015-09-14T00:12:00Z	  2.457
[...]
2015-09-16T23:42:00Z	  2.159
2015-09-16T23:48:00Z	  2.139
2015-09-16T23:54:00Z	  2.11
```

### Goal

To perform queries that act like:

* A nested function

    Calculate the minimum `water_level` at one-day intervals and calculate the
average of those values:

    ```
> SELECT mean(min("water_level")) FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= '2015-09-14T00:00:00Z' AND time < '2015-09-17T00:00:00Z' GROUP BY time(1d)
name: h2o_feet
-------------
time			        mean
1970-01-01T00:00:00Z	1.9183333333333337
    ```

Or:

* A `HAVING` clause

    Calculate the average `water_level` at one-day intervals and only return results
for days where the average is greater than `4.0` feet:

    ```
> SELECT mean("water_level") FROM "h2o_feet" WHERE "location"='santa_monica' AND time >= '2015-09-14T00:00:00Z' AND time < '2015-09-17T00:00:00Z' GROUP BY time(1d) HAVING mean("water_level") > 4.0
name: h2o_feet
--------------
time			        mean
2015-09-14T00:00:00Z	4.071287500000001
    ```

InfluxDB does not understand the syntax in those queries.
InfluxQL allows nesting with only a few functions (see
[`DISTINCT()`](/influxdb/v0.13/query_language/functions/#distinct),
[`DERIVATIVE()`](/influxdb/v0.13/query_language/functions/#derivative),
[`DIFFERENCE()`](/influxdb/v0.13/query_language/functions/#difference),
[`MOVING _AVERAGE()`](/influxdb/v0.13/query_language/functions/#moving-average),
and
[`NON_NEGATIVE_DERIVATIVE()`](/influxdb/v0.13/query_language/functions/#non-negative-derivative)
),
and InfluxQL does not support `HAVING` clauses.

### CQs as a substitute

Use a CQ in place of:

* A nested function

    Create a CQ to automatically calculate the minimum `water_level` at one-day
    intervals and store those results in a different measurement.
    You only need to perform this step once.

    The following query creates a CQ called `calc_mins` in the database
    `NOAA_water_database`.
    `calc_mins` tells InfluxDB to calculate the one-day minimum of the field
    `water_level` in the measurement `h2o_feet` where the `location` tag key is
    equal to `santa_monica`.
    It also tells InfluxDB to write those results to the measurement
    `one_day_mins`.
    InfluxDB will run this query every day for the previous day.

    ```
    > CREATE CONTINUOUS QUERY "calc_mins" ON "NOAA_water_database" BEGIN SELECT min("water_level") AS "min_water_level" INTO "one_day_mins" FROM "h2o_feet" WHERE "location"='santa_monica' GROUP BY time(1d) END
    ```

    Then, whenever you want the average of the one-day minimum calculations,
    query the measurement that stores the CQ results and use the `mean()`
    function.

    ```
    > SELECT mean("min_water_level") FROM "one_day_mins" WHERE time >= '2015-09-14T00:00:00Z' AND time < '2015-09-17T00:00:00Z'
    name: one_day_mins
    ------------------
    time			        mean
    2015-09-14T00:00:00Z	1.9183333333333337
    ```

    > **Note:** CQs only run on data with timestamps that are newer than the
    time at which the user initializes the CQ.
    In practice, the CQ `calc_mins` would not have run against the sample data
    from 2015.
    To write the results of a query on old data to a different measurement,
    simply use a
    [non-CQ `INTO` query](/influxdb/v0.13/query_language/data_exploration/#downsample-data).

* A `HAVING` clause

    Create a CQ to automatically calculate the average `water_level` at one-day
intervals and store those results in a different measurement.
    You only need to perform this step once.

    The following query creates a CQ called `calc_means` in the database
    `NOAA_water_database`.
    `calc_means` tells InfluxDB to calculate the one-day average of the field
    `water_level` in the measurement `h2o_feet` where the `location` tag key is
    equal to `santa_monica`.
    It also tells InfluxDB to write those results to the measurement
    `one_day_means`.
    InfluxDB will run this query every day for the previous day.

    ```
    > CREATE CONTINUOUS QUERY "calc_means" ON "NOAA_water_database" BEGIN SELECT mean("water_level") AS "mean_water_level" INTO "one_day_means" FROM "h2o_feet" WHERE "location"='santa_monica' GROUP BY time(1d) END
    ```

    Then, whenever you want to see results for days where the one-day average of
    `water_level` is greater than `4.0` feet, query the measurement that stores
    the CQ result and include that condition in the `WHERE` clause:

    ```
    > SELECT "mean_water_level" FROM "one_day_means" WHERE "mean_water_level" > 4.0 AND time >= '2015-09-14T00:00:00Z' AND time < '2015-09-17T00:00:00Z'
    name: one_day_means
    -------------------
    time			        mean_water_level
    2015-09-14T00:00:00Z	4.071287500000001
    ```

    > **Note:** CQs only run on data with timestamps that are newer than the
    time at which the user initializes the CQ.
    In practice, the CQ `calc_means` would not have run against the sample data
    from 2015.
    To write the results of a query on old data to a different measurement,
    simply use a
    [non-CQ `INTO` query](/influxdb/v0.13/query_language/data_exploration/#downsample-data).

    Using CQs, we've made InfluxQL perform the same calculations as nested
    queries and `HAVING` clauses.
    We recommend looking at the detailed documentation on [CQs](/influxdb/v0.13/query_language/continuous_queries/) to get more
    familiar with the syntax and the possibilities that CQs offer.
