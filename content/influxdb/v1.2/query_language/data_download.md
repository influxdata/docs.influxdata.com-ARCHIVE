---
title: Sample Data
menu:
  influxdb_1_2:
    weight: 90
    parent: query_language
---

In order to explore the query language further, these instructions help you create a database, download and write data to that database within your InfluxDB installation.  The sample data is then used and referenced in [Data Exploration](../../query_language/data_exploration/), [Schema Exploration](../../query_language/schema_exploration/), and [Functions](../../query_language/functions/).

## Creating a database

If you've installed InfluxDB locally, the `influx` command should be available via the command line.
Executing `influx` will start the CLI and automatically connect to the local InfluxDB instance
(assuming you have already started the server with `service influxdb start` or by running `influxd` directly).
The output should look like this:

```bash
$ influx -precision rfc3339 -database NOAA_water_database
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
>
```

> **Notes:**
>
* The InfluxDB HTTP API runs on port `8086` by default.
Therefore, `influx` will connect to port `8086` and `localhost` by default.
If you need to alter these defaults, run `influx --help`.
* The [`-precision` argument](/influxdb/v1.2/tools/shell/#influx-arguments) specifies the format/precision of any returned timestamps.
In the example above, `rfc3339` tells InfluxDB to return timestamps in [RFC3339 format](https://www.ietf.org/rfc/rfc3339.txt) (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`).

The command line is now ready to take input in the form of the Influx Query Language (a.k.a InfluxQL) statements.
To exit the InfluxQL shell, type `exit` and hit return.

A fresh install of InfluxDB has no databases (apart from the system `_internal`),
so creating one is our first task.
You can create a database with the `CREATE DATABASE <db-name>` InfluxQL statement,
where `<db-name>` is the name of the database you wish to create.
Names of databases can contain any unicode character as long as the string is double-quoted.
Names can also be left unquoted if they contain _only_ ASCII letters,
digits, or underscores and do not begin with a digit.

Throughout the query language exploration, we'll use the database name `NOAA_water_database`:

```
> CREATE DATABASE NOAA_water_database
> exit
```

### Download and write the data to InfluxDB

From your terminal, download the text file that contains the data in [line protocol](/influxdb/v1.2/concepts/glossary/#line-protocol) format:
```
curl https://s3.amazonaws.com/noaa.water-database/NOAA_data.txt -o NOAA_data.txt
```

Write the data to InfluxDB via the [CLI](../../tools/shell/):
```
influx -import -path=./Downloads/NOAA_data.txt -precision=s -database=NOAA_water_database
```

### Test queries
```bash
$ influx -precision rfc3339 -database NOAA_water_database
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
>
```

See all five measurements:
```
> SHOW measurements
name: measurements
------------------
name
average_temperature
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

Count the number of non-null values of `water_level` in `h2o_feet`:
```bash
> SELECT COUNT(water_level) FROM h2o_feet
name: h2o_feet
--------------
time			               count
1970-01-01T00:00:00Z	 15258
```

Select the first five observations in the measurement h2o_feet:

```bash
> SELECT * FROM h2o_feet LIMIT 5
name: h2o_feet
--------------
time			                 level description	      location	       water_level
2015-08-18T00:00:00Z	   below 3 feet		          santa_monica	   2.064
2015-08-18T00:00:00Z	   between 6 and 9 feet	   coyote_creek	   8.12
2015-08-18T00:06:00Z	   between 6 and 9 feet	   coyote_creek	   8.005
2015-08-18T00:06:00Z	   below 3 feet		          santa_monica	   2.116
2015-08-18T00:12:00Z	   between 6 and 9 feet	   coyote_creek	   7.887
```

### Data sources and things to note
The sample data are publicly available data from the [National Oceanic and Atmospheric Administration’s (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).
The data include 15,258 observations of water levels (ft) collected every six seconds at two stations (Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period from August 18, 2015 through September 18, 2015.

Note that the measurements `average_temperature`, `h2o_pH`, `h2o_quality`, and `h2o_temperature` contain fictional data.
Those measurements serve to illuminate query functionality in [Schema Exploration](../../query_language/schema_exploration/).


The `h2o_feet` measurement is the only measurement that contains the NOAA data.
Please note that the `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string [field values](../../concepts/glossary/#field-value).
