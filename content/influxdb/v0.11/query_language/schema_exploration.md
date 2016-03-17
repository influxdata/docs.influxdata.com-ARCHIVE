---
title: Schema Exploration
menu:
  influxdb_011:
    weight: 10
    parent: query_language
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections cover useful query syntax for exploring your schema (that is, how you set up your time series data):

* [See all databases with `SHOW DATABASES`](/influxdb/v0.11/query_language/schema_exploration/#see-all-databases-with-show-databases)
* [Explore retention policies with `SHOW RETENTION POLICIES`](/influxdb/v0.11/query_language/schema_exploration/#explore-retention-policies-with-show-retention-policies)
* [Explore series with `SHOW SERIES`](/influxdb/v0.11/query_language/schema_exploration/#explore-series-with-show-series)
* [Explore measurements with `SHOW MEASUREMENTS`](/influxdb/v0.11/query_language/schema_exploration/#explore-measurements-with-show-measurements)
* [Explore tag keys with `SHOW TAG KEYS`](/influxdb/v0.11/query_language/schema_exploration/#explore-tag-keys-with-show-tag-keys)
* [Explore tag values with `SHOW TAG VALUES`](/influxdb/v0.11/query_language/schema_exploration/#explore-tag-values-with-show-tag-values)
* [Explore field keys with `SHOW FIELD KEYS`](/influxdb/v0.11/query_language/schema_exploration/#explore-field-keys-with-show-field-keys)

The examples below query data using [InfluxDB's Command Line Interface (CLI)](/influxdb/v0.11/tools/shell/).
See the [Querying Data](/influxdb/v0.11/guides/querying_data/) guide for how to directly query data with the HTTP API.

**Sample data**

This document uses the same sample data as the [Data Exploration](/influxdb/v0.11/query_language/data_exploration/) page.
The data are described and are available for download on the [Sample Data](/influxdb/v0.11/sample_data/data_download/) page.

## See all databases with `SHOW DATABASES`
Get a list of all the databases in your system by entering:
```sql
SHOW DATABASES
```

CLI example:
```bash
> SHOW DATABASES
name: databases
---------------
name
NOAA_water_database
```

## Explore retention policies with `SHOW RETENTION POLICIES`
The `SHOW RETENTION POLICIES` query lists the existing [retention policies](/influxdb/v0.11/concepts/glossary/#retention-policy-rp) on a given database, and it takes the following form:
```sql
SHOW RETENTION POLICIES ON <database_name>
```

CLI example:
```sql
> SHOW RETENTION POLICIES ON NOAA_water_database
```

CLI response:
```bash
name	    duration	 replicaN	 default
default	 0		       1		       true
```

The first column of the output contains the names of the different retention policies in the specified database.
The second column shows the [duration](/influxdb/v0.11/concepts/glossary/#duration) and the third column shows the [replication factor](/influxdb/v0.11/concepts/glossary/#replication-factor) of the retention policy.
The fourth column specifies if the retention policy is the default retention policy for the database.

The following example shows a hypothetical CLI response where there are four different retention policies in the database, and where the default retention policy is `three_days_only`:

```bash
name		           duration	 replicaN	 default
default		        0		       1		       false
two_days_only	   48h0m0s		 1		       false
one_day_only	    24h0m0s		 1		       false
three_days_only	 72h0m0s		 1		       true
```

## Explore series with `SHOW SERIES`
The `SHOW SERIES` query returns the distinct [series](/influxdb/v0.11/concepts/glossary/#series) in your database and takes the following form, where the `FROM` and `WHERE` clauses are optional:

```sql
SHOW SERIES [FROM <measurement_name> [WHERE <tag_key>='<tag_value>']]
```

Return all series in the database `NOAA_water_database`:
```sql
> SHOW SERIES
```

CLI response:  
```bash
name: average_temperature
-------------------------
_key						                                   location
average_temperature,location=coyote_creek	   coyote_creek
average_temperature,location=santa_monica	   santa_monica

name: h2o_feet
--------------
_key						                        location
h2o_feet,location=coyote_creek	   coyote_creek
h2o_feet,location=santa_monica	   santa_monica

name: h2o_pH
------------
_key						                      location
h2o_pH,location=coyote_creek	   coyote_creek
h2o_pH,location=santa_monica	   santa_monica

name: h2o_quality
-----------------
_key						                                     location	       randtag
h2o_quality,location=coyote_creek,randtag=1	   coyote_creek	   1
h2o_quality,location=coyote_creek,randtag=2	   coyote_creek	   2
h2o_quality,location=coyote_creek,randtag=3	   coyote_creek	   3
h2o_quality,location=santa_monica,randtag=3	   santa_monica	   3
h2o_quality,location=santa_monica,randtag=2	   santa_monica	   2
h2o_quality,location=santa_monica,randtag=1	   santa_monica	   1

name: h2o_temperature
---------------------
_key					                                location
h2o_temperature,location=coyote_creek	   coyote_creek
h2o_temperature,location=santa_monica	   santa_monica
```

`SHOW SERIES` organizes its output by [measurement](/influxdb/v0.11/concepts/glossary/#measurement) name.
From the return you can see that the data in the database `NOAA_water_database` have five different measurements and 14 different series.
The measurements are `average_temperature`, `h2o_feet`, `h2o_pH`, `h2o_quality`, and `h2o_temperature`.
Every measurement
has the [tag key](/influxdb/v0.11/concepts/glossary/#tag-key) `location` with the [tag values](/influxdb/v0.11/concepts/glossary/#tag-value) `coyote_creek` and `santa_monica` - that makes 10 series.
The measurement `h2o_quality` has the additional tag key `randtag` with the tag values `1`,`2`, and `3` - that makes 14 series.

Return series for a specific measurement:
```sql
> SHOW SERIES FROM h2o_quality
```

CLI response:
```bash
name: h2o_quality
-----------------
_key						                                     location	       randtag
h2o_quality,location=coyote_creek,randtag=1	   coyote_creek	   1
h2o_quality,location=coyote_creek,randtag=2	   coyote_creek	   2
h2o_quality,location=coyote_creek,randtag=3	   coyote_creek	   3
h2o_quality,location=santa_monica,randtag=3	   santa_monica	   3
h2o_quality,location=santa_monica,randtag=2	   santa_monica	   2
h2o_quality,location=santa_monica,randtag=1	   santa_monica	   1
```

Return series for a specific measurement and tag set:
```sql
> SHOW SERIES FROM h2o_quality WHERE location = 'coyote_creek'
```

CLI response:
```bash
name: h2o_quality
-----------------
_key						                                     location	       randtag
h2o_quality,location=coyote_creek,randtag=1	   coyote_creek	   1
h2o_quality,location=coyote_creek,randtag=2	   coyote_creek	   2
h2o_quality,location=coyote_creek,randtag=3	   coyote_creek	   3
```

## Explore measurements with `SHOW MEASUREMENTS`
The `SHOW MEASUREMENTS` query returns the [measurements](/influxdb/v0.11/concepts/glossary/#measurement) in your database and it takes the following form:
```sql
SHOW MEASUREMENTS [WITH MEASUREMENT <regular_expression>] [WHERE <tag_key>=<'tag_value'>]
```

Return all measurements in the `NOAA_water_database` database:
```sql
> SHOW MEASUREMENTS
```

CLI response:
```bash
name: measurements
------------------
name
average_temperature
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

From the output you can see that the database `NOAA_water_database` has five measurements: `average_temperature`, `h2o_feet`, `h2o_pH`, `h2o_quality`, and `h2o_temperature`.

Return measurements where the tag key `randtag` equals `1`:
```sql
> SHOW MEASUREMENTS WHERE randtag = '1'
```

CLI response:
```bash
name: measurements
------------------
name
h2o_quality
```

Only the measurement `h2o_quality` contains the tag set `randtag = 1`.

Use a regular expression to return measurements where the tag key `randtag` is a digit:
```sql
SHOW MEASUREMENTS WHERE randtag =~ /\d/
```

CLI response:
```bash
name: measurements
------------------
name
h2o_quality
```

Use a regular expression with `WITH MEASUREMENT` to return all measurements that start with `h2o`:
```sql
> SHOW MEASUREMENTS WITH MEASUREMENT =~ /h2o.*/
```

CLI response:
```bash
name: measurements
------------------
name
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

## Explore tag keys with SHOW TAG KEYS
`SHOW TAG KEYS` returns the [tag keys](/influxdb/v0.11/concepts/glossary/#tag-key) associated with each measurement and takes the following form, where the `FROM` clause is optional:
```sql
SHOW TAG KEYS [FROM <measurement_name>]
```

Return all tag keys that are in the database `NOAA_water_database`:
```sql
> SHOW TAG KEYS
```

CLI response:
```bash
name: average_temperature
-------------------------
tagKey
location

name: h2o_feet
--------------
tagKey
location

name: h2o_pH
------------
tagKey
location

name: h2o_quality
-----------------
tagKey
location
randtag

name: h2o_temperature
---------------------
tagKey
location
```

InfluxDB organizes the output by measurement.
Notice that each of the five measurements has the tag key `location` and that the measurement `h2o_quality` also has the tag key `randtag`.

Return the tag keys for a specific measurement:
```sql
> SHOW TAG KEYS FROM h2o_temperature
```

CLI response:
```bash
name: h2o_temperature
---------------------
tagKey
location
```

## Explore tag values with SHOW TAG VALUES
The `SHOW TAG VALUES` query returns the set of [tag values](/influxdb/v0.11/concepts/glossary/#tag-value) for a specific tag key across all measurements in the database.
It takes the following form, where the `FROM` clause is optional:
```sql
SHOW TAG VALUES [FROM <measurement_name>] WITH KEY = <tag_key>
```

Return the tag values for the tag key `randtag` across all measurements in the database `NOAA_water_database`:
```sql
> SHOW TAG VALUES WITH KEY = randtag
```

CLI response:
```bash
name: randtagTagValues
----------------------
randtag
1
2
3
```

Return the tag values for the tag key `randtag` for a specific measurement in the `NOAA_water_database` database:
```sql
> SHOW TAG VALUES FROM average_temperature WITH KEY = randtag
```

CLI response:
```bash
```

The measurement `average_temperature` doesn't have the tag key `randtag` so InfluxDB returns nothing.

## Explore field keys with `SHOW FIELD KEYS`
The `SHOW FIELD KEYS` query returns the [field keys](/influxdb/v0.11/concepts/glossary/#field-key) across each measurement in the database.
It takes the following form, where the `FROM` clause is optional:

```sql
SHOW FIELD KEYS [FROM <measurement_name>]
```

Return the field keys across all measurements in the database `NOAA_water_database`:

```sql
> SHOW FIELD KEYS
```

CLI response:
```bash
name: average_temperature
-------------------------
fieldKey
degrees

name: h2o_feet
--------------
fieldKey
level description
water_level

name: h2o_pH
------------
fieldKey
pH

name: h2o_quality
-----------------
fieldKey
index

name: h2o_temperature
---------------------
fieldKey
degrees
```

Return the field keys in the measurement `h2o_feet` in the database `NOAA_water_database`:

```sql
> SHOW FIELD KEYS FROM h2o_feet
```

CLI response:

```bash
name: h2o_feet
--------------
fieldKey
level description
water_level
```
