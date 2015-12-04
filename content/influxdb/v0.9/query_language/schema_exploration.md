---
title: Schema Exploration
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB. The following sections cover useful query syntax for exploring your schema (that is, how you set up your time series data):

* [See all databases with `SHOW DATABASES`](../query_language/schema_exploration.html#see-all-databases-with-show-databases)
* [Explore retention policies with `SHOW RETENTION POLICIES`](../query_language/schema_exploration.html#explore-retention-policies-with-show-retention-policies)
* [Explore series with `SHOW SERIES`](../query_language/schema_exploration.html#explore-series-with-show-series)
* [Explore measurements with `SHOW MEASUREMENTS`](../query_language/schema_exploration.html#explore-measurements-with-show-measurements)
* [Explore tag keys with `SHOW TAG KEYS`](../query_language/schema_exploration.html#explore-tag-keys-with-show-tag-keys)
* [Explore tag values with `SHOW TAG VALUES`](../query_language/schema_exploration.html#explore-tag-values-with-show-tag-values)
* [Explore field keys with `SHOW FIELD KEYS`](../query_language/schema_exploration.html#explore-field-keys-with-show-field-keys)

The examples below query data using [InfluxDB's Command Line Interface (CLI)](../introduction/getting_started.html). See the [Querying Data](../guides/querying_data.html) guide for how to directly query data with the HTTP API.

**Sample data**

This document uses the same sample data as the [Data Exploration](../query_language/data_exploration.html) page. The data are described and are available for download on the [Sample Data](../sample_data/data_download.html) page.

## See all databases with `SHOW DATABASES`
Get a list of all the databases in your system by entering:
```sql
SHOW DATABASES
```

CLI example:
```sh
> SHOW DATABASES
name: databases
---------------
name
NOAA_water_database
```

## Explore retention policies with `SHOW RETENTION POLICIES`
The `SHOW RETENTION POLICIES` query lists the existing [retention policies](../concepts/glossary.html#retention-policy) on a given database, and it takes the following form:
```sql
SHOW RETENTION POLICIES ON <database_name>
```

CLI example:
```sql
> SHOW RETENTION POLICIES ON NOAA_water_database
```

CLI response:
```sh
name	    duration	 replicaN	 default
default	 0		       1		       true
```

The first column of the output contains the names of the different retention policies in the specified database. The second column shows the [duration](../concepts/glossary.html#duration) and the third column shows the [replication factor](../concepts/glossary.html#replication-factor) of the retention policy. The fourth column specifies if the retention policy is the default retention policy for the database.

The following example shows a hypothetical CLI response where there are four different retention policies in the database, and where the default retention policy is `three_days_only`:

```sh
name		           duration	 replicaN	 default
default		        0		       1		       false
two_days_only	   48h0m0s		 1		       false
one_day_only	    24h0m0s		 1		       false
three_days_only	 72h0m0s		 1		       true
```

## Explore series with `SHOW SERIES`
The `SHOW SERIES` query returns the distinct [series](../concepts/glossary.html#series) in your database and takes the following form, where the `FROM` and `WHERE` clauses are optional:

```sql
SHOW SERIES FROM [<measurement_name> WHERE <tag_key>='<tag_value>']
```

Return all series in the database `NOAA_water_database`:
```sql
> SHOW SERIES
```

CLI response:  
```sh
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

`SHOW SERIES` organizes its output by [measurement](../concepts/glossary.html#measurement) name. From the return you can see that the data in the database `NOAA_water_database` have five different measurements and 14 different series. The measurements are `average_temperature`, `h2o_feet`, `h2o_pH`, `h2o_quality`, and `h2o_temperature`. Every measurement
has the [tag key](../concepts/glossary.html#tag-key) `location` with the [tag values](../concepts/glossary.html#tag-value) `coyote_creek` and `santa_monica` - that makes 10 series. The measurement `h2o_quality` has the additional tag key `randtag` with the tag values `1`,`2`, and `3` - that makes 14 series.

Return series for a specific measurement:
```sql
> SHOW SERIES FROM h2o_quality
```

CLI response:
```sh
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
```sh
name: h2o_quality
-----------------
_key						                                     location	       randtag
h2o_quality,location=coyote_creek,randtag=1	   coyote_creek	   1
h2o_quality,location=coyote_creek,randtag=2	   coyote_creek	   2
h2o_quality,location=coyote_creek,randtag=3	   coyote_creek	   3
```

## Explore measurements with `SHOW MEASUREMENTS`
The `SHOW MEASUREMENTS` query returns all [measurements](../concepts/glossary.html#measurement) in your database and it takes the following form, where the `WHERE` clause is optional:
```sql
SHOW MEASUREMENTS [WHERE <tag_key>=<'tag_value'>]
```

Return all measurements in the `NOAA_water_database` database:
```sql
> SHOW MEASUREMENTS
```

CLI response:
```sh
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
```sh
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
```sh
name: measurements
------------------
name
h2o_quality
```

## Explore tag keys with SHOW TAG KEYS
`SHOW TAG KEYS` returns the [tag keys](../concepts/glossary.html#tag-key) associated with each measurement and takes the following form, where the `FROM` clause is optional:
```sql
SHOW TAG KEYS [FROM <measurement_name>]
```

Return all tag keys that are in the database `NOAA_water_database`:
```sql
> SHOW TAG KEYS
```

CLI response:
```sh
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

InfluxDB organizes the output by measurement. Notice that each of the five measurements has the tag key `location` and that the measurement `h2o_quality` also has the tag key `randtag`.

Return the tag keys for a specific measurement:
```sql
> SHOW TAG KEYS FROM h2o_temperature
```

CLI response:
```sh
name: h2o_temperature
---------------------
tagKey
location
```

## Explore tag values with SHOW TAG VALUES
The `SHOW TAG VALUES` query returns the set of [tag values](../concepts/glossary.html#tag-value) for a specific tag key across all measurements in the database. It takes the following form, where the `FROM` clause is optional:
```sql
SHOW TAG VALUES [FROM <measurement_name> WITH KEY = <tag_key>]
```

Return the tag values for the tag key `randtag` across all measurements in the database `NOAA_water_database`:
```sql
> SHOW TAG VALUES WITH KEY = randtag
```

CLI response:
```sh
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
```sh
```

The measurement `average_temperature` doesn't have the tag key `randtag` so InfluxDB returns nothing.

## Explore field keys with `SHOW FIELD KEYS`
The `SHOW FIELD KEYS` query returns the [field keys](../concepts/glossary.html#field-key) across each measurement in the database. It takes the following form, where the `FROM` clause is optional:

```sql
SHOW FIELD KEYS [FROM <measurement_name>]
```

Return the field keys across all measurements in the database `NOAA_water_database`:

```sql
> SHOW FIELD KEYS
```

CLI response:
```sh
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

```sh
name: h2o_feet
--------------
fieldKey
level description
water_level
```
