---
title: Data Exploration

menu:
  influxdb_1_0:
    weight: 10
    parent: query_language
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections detail InfluxQL's `SELECT` statement and useful query syntax
for exploring your data.

<table style="width:100%">
  <tr>
    <td><b>The Basics:</b></td>
    <td><b>Limit and Sort Query Results:</b></td>
    <td><b>General Tips on Query Syntax:</b></td>
  </tr>
  <tr>
    <td><a href="#the-basic-select-statement">The SELECT statement</a></td>
    <td><a href="#order-by-time-desc">ORDER BY time DESC</a></td>
    <td><a href="#time-syntax-in-queries">Time Syntax in Queries</a></td>
  </tr>
  <tr>
    <td><a href="#the-where-clause">The WHERE clause</a></td>
    <td><a href="#the-limit-and-slimit-clauses">The LIMIT and SLIMIT Clauses</a></td>
    <td><a href="#regular-expressions-in-queries">Regular Expressions in Queries</a></td>
  </tr>
  <tr>
    <td><a href="#the-group-by-clause">The GROUP BY clause</a></td>
    <td><a href="#the-offset-and-soffset-clauses">The OFFSET and SOFFSET Clauses</a></td>
    <td><a href="#data-types-and-cast-operations-in-queries">Data Types and Cast Operations in Queries</a></td>
  </tr>
  <tr>
    <td><a href="#the-into-clause">The INTO clause</a></td>
    <td><a href="#"></a></td>
    <td><a href="#merge-series-in-queries">Merge Series in Queries</a></td>
  </tr>
  <tr>
    <td><a href="#"></a></td>
    <td><a href="#"></a></td>
    <td><a href="#multiple-statements-in-queries">Multiple Statements in Queries</a></td>
  </tr>
</table>

### Sample Data

This document uses publicly available data from the
[National Oceanic and Atmospheric Administration's (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).
See the [Sample Data](/influxdb/v1.0/query_language/data_download/) page to download
the data and follow along with the example queries in the sections below.
To start out, feel free to get acquainted with this subsample of the data in
the `h2o_feet` measurement:

name: <span class="tooltip" data-tooltip-text="Measurement">h2o_feet</span>  
\------------------------------------  
time
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
<span class="tooltip" data-tooltip-text="Field Key">level description</span>
&emsp;&emsp;&emsp;&emsp;
<span class="tooltip" data-tooltip-text="Tag Key">location</span>
&emsp;&emsp;&emsp;&emsp;
<span class="tooltip" data-tooltip-text="Field Key">water_level</span>
&emsp;&emsp;  
2015-08-18T00:00:00Z
&emsp;&emsp;
between 6 and 9 feet
&emsp;&emsp;&#8202;&#8202;&#8202;
coyote_creek
&emsp;&emsp;
8.12  
2015-08-18T00:00:00Z
&emsp;&emsp;
below 3 feet
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
santa_monica
&emsp;&nbsp;&nbsp;&#8202;&#8202;
2.064  
<span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:06:00Z</span>
&emsp;&nbsp;
<span class="tooltip" data-tooltip-text="Field Value">between 6 and 9 feet</span>
&emsp;&emsp;&#8202;&#8202;
<span class="tooltip" data-tooltip-text="Tag Value">coyote_creek</span>
&emsp;&nbsp;&nbsp;&nbsp;
<span class="tooltip" data-tooltip-text="Field Value">8.005</span>  
2015-08-18T00:06:00Z
&emsp;&emsp;
below 3 feet
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
santa_monica
&emsp;&nbsp;&nbsp;&#8202;&#8202;
2.116  
2015-08-18T00:12:00Z
&emsp;&emsp;
between 6 and 9 feet
&emsp;&emsp;&#8202;&#8202;&#8202;
coyote_creek
&emsp;&emsp;
7.887  
2015-08-18T00:12:00Z
&emsp;&emsp;
below 3 feet
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
santa_monica
&emsp;&nbsp;&nbsp;&#8202;&#8202;
2.028

The data in the `h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement)
occur at six-minute time intervals.
The measurement has one [tag key](/influxdb/v1.0/concepts/glossary/#tag-key)
(`location`) which has two [tag values](/influxdb/v1.0/concepts/glossary/#tag-value):
`coyote_creek` and `santa_monica`.
The measurement also has two [fields](/influxdb/v1.0/concepts/glossary/#field):
`level description` stores string [field values](/influxdb/v1.0/concepts/glossary/#field-value)
and `water_level` stores float field values.
All of these data are in the `NOAA_water_database` [database](/influxdb/v1.0/concepts/glossary/#database).

> **Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string field values.

<br>
# The basic SELECT statement

The `SELECT` statement queries data from a particular [measurement](/influxdb/v1.0/concepts/glossary/#measurement) or measurements.

### Syntax
```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```  

### Description of Syntax

The `SELECT` statement requires a `SELECT` clause and a `FROM` clause.

#### `SELECT` clause
The `SELECT` clause supports several formats for specifying data:

`SELECT *`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns all [fields](/influxdb/v1.0/concepts/glossary/#field) and [tags](/influxdb/v1.0/concepts/glossary/#tag).

`SELECT "<field_key>"`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field.

`SELECT "<field_key>","<field_key>"`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns more than one field.  

`SELECT "<field_key>","<tag_key>"`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field and tag.
The `SELECT` clause must specify at least one field when it includes a tag.

`SELECT "<field_key>"::field,"<tag_key>"::tag`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field and tag.
The `::[field | tag]` syntax specifies the [identifier's](/influxdb/v1.0/concepts/glossary/#identifier) type.
Use this syntax to differentiate between field keys and tag keys that have the same name.

Other supported features:
[Arithmetic Operations](/influxdb/v1.0/query_language/math_operators/),
[Functions](/influxdb/v1.0/query_language/functions/),
[Basic Cast Operations](#data-types-and-cast-operations-in-queries)

#### `FROM` clause
The `FROM` clause supports several formats for specifying a [measurement(s)](/influxdb/v1.0/concepts/glossary/#measurement):

`FROM <measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a single measurement.
If you're using the [CLI](/influxdb/v1.0/tools/shell/) InfluxDB queries the measurement in the
[`USE`d](/influxdb/v1.0/tools/shell/#commands)
[database](/influxdb/v1.0/concepts/glossary/#database) and the `DEFAULT` [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp).
If you're using the [HTTP API](/influxdb/v1.0/tools/api/) InfluxDB queries the
measurement in the database specified in the [`db` query string parameter](/influxdb/v1.0/tools/api/#query-string-parameters)
and the `DEFAULT` retention policy.

`FROM <measurement_name>,<measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from more than one measurement.

`FROM <database_name>.<retention_policy_name>.<measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a fully qualified measurement.
Fully qualify a measurement by specifying its database and retention policy.

`FROM <database_name>..<measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a measurement in a user-specified [database](/influxdb/v1.0/concepts/glossary/#database) and the `DEFAULT`
[retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp).

Other supported features:
[Regular Expressions](#regular-expressions-in-queries)

#### Quoting
[Identifiers](/influxdb/v1.0/concepts/glossary/#identifiers) **must** be double quoted if they contain characters other than `[A-z,0-9,_]`, if they
begin with a digit, or if they are an [InfluxQL keyword](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords).
While not always necessary, we recommend that you double quote identifiers.

> **Note:** The quoting syntax for queries differs from the [line protocol](/influxdb/v1.0/concepts/glossary/#line-protocol).
Please review the [rules for single and double-quoting](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries) in queries.

### Examples

#### Example 1: Select all fields and tags from a single measurement
```
> SELECT * FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects all [fields](/influxdb/v1.0/concepts/glossary/#field) and
[tags](/influxdb/v1.0/concepts/glossary/#tag) from the `h2o_feet`
[measurement](/influxdb/v1.0/concepts/glossary/#measurement).

If you're using the [CLI](/influxdb/v1.0/tools/shell/) be sure to enter
`USE NOAA_water_database` before you run the query.
The CLI queries the data in the `USE`d database and the
`DEFAULT` [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp).
If you're using the [HTTP API](/influxdb/v1.0/tools/api/) be sure to set the
`db` [query string parameter](/influxdb/v1.0/tools/api/#query-string-parameters)
to `NOAA_water_database`.
If you do not set the `rp` query string parameter, the HTTP API automatically
queries the database's `DEFAULT` retention policy.

#### Example 2: Select specific tags and fields from a single measurement
```
> SELECT "level description","location","water_level" FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects the `level description` field, the `location` tag, and the
`water_level` field.
Note that the `SELECT` clause must specify at least one field when it includes
a tag.

#### Example 3: Select specific tags and fields from a single measurement, and provide their identifier type
```
> SELECT "level description"::field,"location"::tag,"water_level"::field FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects the `level description` field, the `location` tag, and the
`water_level` field from the `h2o_feet` measurement.
The `::[field | tag]` syntax specifies if the
[identifier](/influxdb/v1.0/concepts/glossary/#identifier) is a field or tag.
Use `::[field | tag]` to differentiate between [an identical field key and tag key ](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#how-do-i-query-data-with-an-identical-tag-key-and-field-key).
That syntax is not required for most use cases.

#### Example 4: Select all fields from a single measurement
```
> SELECT *::field FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      water_level
2015-08-18T00:00:00Z   below 3 feet           2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   4.938
```

The query selects all fields from the `h2o_feet` measurement.
The `SELECT` clause supports combining the `*` syntax with the `::` syntax.

#### Example 5: Select a specific field from a measurement and perform basic arithmetic
```
> SELECT ("water_level" * 2) + 4 from "h2o_feet"

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   20.24
2015-08-18T00:00:00Z   8.128
[...]
2015-09-18T21:36:00Z   14.132
2015-09-18T21:42:00Z   13.876
```

The query multiplies `water_level`'s field values by two and adds four to those
values.
Note that InfluxDB follows the standard order of operations.
See [Mathematical Operators](/influxdb/v1.0/query_language/math_operators/)
for more on supported operators.

#### Example 6: Select all data from more than one measurement
```
> SELECT * FROM "h2o_feet","h2o_pH"

name: h2o_feet
--------------
time                   level description      location       pH   water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica        2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek        8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica        5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica        4.938

name: h2o_pH
------------
time                   level description   location       pH   water_level
2015-08-18T00:00:00Z                       santa_monica   6
2015-08-18T00:00:00Z                       coyote_creek   7
[...]
2015-09-18T21:36:00Z                       santa_monica   8
2015-09-18T21:42:00Z                       santa_monica   7
```

The query selects all fields and tags from two measurements: `h2o_feet` and
`h2o_pH`.
Separate multiple measurements with a comma (`,`).

#### Example 7: Select all data from a fully qualified measurement
```
> SELECT * FROM "NOAA_water_database"."autogen"."h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects data in the `NOAA_water_database`, the `autogen` retention
policy, and the measurement `h2o_feet`.

In the CLI, fully qualify a measurement to query data in a database other
than the `USE`d database and in a retention policy other than the
`DEFAULT` retention policy.
In the HTTP API, fully qualify a measurement in place of using the `db`
and `rp` query string parameters if desired.

#### Example 8: Select all data from a measurement in a particular database
```
> SELECT * FROM "NOAA_water_database".."h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects data in the `NOAA_water_database`, the `DEFAULT` retention
policy, and the `h2o_feet` measurement.
The `..` indicates the `DEFAULT` retention policy for the specified database.

In the CLI, specify the database to query data in a database other than the
`USE`d database.
In the HTTP API, specify the database in place of using the `db` query
string parameter if desired.

## The `WHERE` clause
The `WHERE` filters data based on
[fields](/influxdb/v1.0/concepts/glossary/#field),
[tags](/influxdb/v1.0/concepts/glossary/#tag), and/or
[timestamps](/influxdb/v1.0/concepts/glossary/#timestamp).

### Syntax

```
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

### Description of Syntax

The `WHERE` clause supports `conditional_expression`s on fields, tags, and
timestamps.

#### fields

```
field_key <operator> ['string' | boolean | float | integer]
```

The `WHERE` clause supports comparisons against string, boolean, float,
and integer [field values](/influxdb/v1.0/concepts/glossary/#field-value).

Single quote string field values in the `WHERE` clause.
Queries with unquoted string field values or double quoted string field values
will not return any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

Supported operators:  
`=`&emsp;&nbsp;&thinsp;equal to  
`<>`&emsp;not equal to  
`!=`&emsp;not equal to  
`>`&emsp;&nbsp;&thinsp;greater than  
`>=`&emsp;greater than or equal to  
`<`&emsp;&nbsp;&thinsp;less than  
`<=`&emsp;less than or equal to  

Other supported features:
[Arithmetic Operations](/influxdb/v1.0/query_language/math_operators/),
[Regular Expressions](#regular-expressions-in-queries)

#### tags

```
tag_key <operator> ['tag_value']
```

Single quote [tag values](/influxdb/v1.0/concepts/glossary/#tag-value) in
the `WHERE` clause.
Queries with unquoted tag values or double quoted tag values will not return
any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

Supported operators:  
`=`&emsp;&nbsp;&thinsp;equal to  
`<>`&emsp;not equal to  
`!=`&emsp;not equal to  

Other supported features:
[Regular Expressions](#regular-expressions-in-queries)

#### timestamps

By default, a query's time range is between [`1677-09-21 00:12:43.145224194` UTC](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store)
and [`now()`](/influxdb/v1.0/concepts/glossary/#now).
The [Time Syntax in Queries](#time-syntax-in-queries) section on this page
details how to specify alternative time ranges in the `WHERE` clause.

### Examples

#### Example 1: Select data that have specific field key-values
```
> SELECT * FROM "h2o_feet" WHERE "water_level" > 8

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
2015-08-18T00:06:00Z   between 6 and 9 feet   coyote_creek   8.005
[...]
2015-09-18T00:12:00Z   between 6 and 9 feet   coyote_creek   8.189
2015-09-18T00:18:00Z   between 6 and 9 feet   coyote_creek   8.084
```

The query returns data from the `h2o_feet`
[measurement](/influxdb/v1.0/concepts/glossary/#measurement) with
[field values](/influxdb/v1.0/concepts/glossary/#field-value) of `water_level`
that are greater than eight.

#### Example 2: Select data that have a specific string field key-value
```
> SELECT * FROM "h2o_feet" WHERE "level description" = 'below 3 feet'

name: h2o_feet
--------------
time                   level description   location       water_level
2015-08-18T00:00:00Z   below 3 feet        santa_monica   2.064
2015-08-18T00:06:00Z   below 3 feet        santa_monica   2.116
[...]
2015-09-18T14:06:00Z   below 3 feet        santa_monica   2.999
2015-09-18T14:36:00Z   below 3 feet        santa_monica   2.907
```

The query returns data from the `h2o_feet` measurement with field values of
`level description` that equal the `below 3 feet` string.
InfluxQL requires single quotes around string field values in the `WHERE`
clause.

#### Example 3: Select data that have a specific field key-value and perform basic arithmetic  
```
> SELECT * FROM "h2o_feet" WHERE "water_level" + 2 > 11.9

name: h2o_feet
--------------
time                   level description           location       water_level
2015-08-29T07:06:00Z   at or greater than 9 feet   coyote_creek   9.902
2015-08-29T07:12:00Z   at or greater than 9 feet   coyote_creek   9.938
2015-08-29T07:18:00Z   at or greater than 9 feet   coyote_creek   9.957
2015-08-29T07:24:00Z   at or greater than 9 feet   coyote_creek   9.964
2015-08-29T07:30:00Z   at or greater than 9 feet   coyote_creek   9.954
2015-08-29T07:36:00Z   at or greater than 9 feet   coyote_creek   9.941
2015-08-29T07:42:00Z   at or greater than 9 feet   coyote_creek   9.925
2015-08-29T07:48:00Z   at or greater than 9 feet   coyote_creek   9.902
2015-09-02T23:30:00Z   at or greater than 9 feet   coyote_creek   9.902
```

The query returns data from the `h2o_feet` measurement with field values of
`water_level` plus two that are greater than 11.9.
Note that InfluxDB follows the standard order of operations
See [Mathematical Operators](/influxdb/v1.0/query_language/math_operators/)
for more on supported operators.

#### Example 4: Select data that have a specific tag key-value

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
[...]
2015-09-18T21:36:00Z   5.066
2015-09-18T21:42:00Z   4.938
```

The query returns data from the `h2o_feet` measurement where the
[tag key](/influxdb/v1.0/concepts/glossary/#tag-key) `location` is set to `santa_monica`.
InfluxQL requires single quotes around tag values in the `WHERE` clause.

#### Example 5: Select data that have specific field key-values and tag key-values
```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" <> 'santa_monica' AND (water_level < -0.59 OR water_level > 9.95)

name: h2o_feet
--------------
time                   water_level
2015-08-29T07:18:00Z   9.957
2015-08-29T07:24:00Z   9.964
2015-08-29T07:30:00Z   9.954
2015-08-29T14:30:00Z   -0.61
2015-08-29T14:36:00Z   -0.591
2015-08-30T15:18:00Z   -0.594
```

The query returns data from the `h2o_feet` measurement where the tag key
`location` is not set to `santa_monica` and where the field values of
`water_level` are either less than -0.59 or greater than 9.95.
The `WHERE` clause supports the operators `AND` and `OR`, and supports
separating logic with parentheses.

#### Example 6: Select data that have specific timestamps
```
> SELECT * FROM "h2o_feet" WHERE time > now() - 7d
```

The query returns data from the `h2o_feet` measurement that have [timestamps](/influxdb/v1.0/concepts/glossary/#timestamp)
within the past seven days.
The [Time Syntax in Queries](#time-syntax-in-queries) section on this page
offers in-depth information on supported time syntax in the `WHERE` clause.

### Common Issues with the `WHERE` Clause

#### Issue 1: A `WHERE` clause query unexpectedly returns no data

In most cases, this issue is the result of missing single quotes around
[tag values](/influxdb/v1.0/concepts/glossary/#tag-value)
or string [field values](/influxdb/v1.0/concepts/glossary/#field-value).
Queries with unquoted or double quoted tag values or string field values will
not return any data and, in most cases, will not return an error.

The first two queries in the code block below attempt to specify the tag value
`santa_monica` without any quotes and with double quotes.
Those queries return no results.
The third query single quotes `santa_monica` (this is the supported syntax)
and returns the expected results.
```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = santa_monica

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = "santa_monica"

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   2.064
[...]
2015-09-18T21:42:00Z   4.938
```

The first two queries in the code block below attempt to specify the string
field value `at or greater than 9 feet` without any quotes and with double
quotes.
The first query returns an error because the string field value includes
white spaces.
The second query returns no results.
The third query single quotes `at or greater than 9 feet` (this is the
supported syntax) and returns the expected results.

```
> SELECT "level description" FROM "h2o_feet" WHERE "level description" = at or greater than 9 feet

ERR: error parsing query: found than, expected ; at line 1, char 86

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = "at or greater than 9 feet"

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = 'at or greater than 9 feet'

name: h2o_feet
--------------
time                   level description
2015-08-26T04:00:00Z   at or greater than 9 feet
[...]
2015-09-15T22:42:00Z   at or greater than 9 feet
```

<br>
<br>
# The GROUP BY clause

The `GROUP BY` clause groups query results by a user-specified
set of [tags](/influxdb/v1.0/concepts/glossary/#tag) or a time interval.

<table style="width:100%">
  <tr>
    <td><a href="#group-by-tags">GROUP BY tags</a>
    <td></td>
    <td></td>
    <td></td>
    </td>
  </tr>
  <tr>
    <td><b>GROUP BY time intervals:
    <td><a href="#basic-group-by-time-syntax">Basic Syntax</a></td>
    <td><a href="#advanced-group-by-time-syntax">Advanced Syntax</a></td>
    <td><a href="#group-by-time-intervals-and-fill">GROUP BY time intervals and fill()</a></td>
    </b></td>
  </tr>
</table>

## GROUP BY tags

`GROUP BY <tag>` queries group query results by a user-specified set of [tags](/influxdb/v1.0/concepts/glossary/#tag).

#### Syntax

```
SELECT_clause FROM_clause [WHERE_clause] GROUP BY [* | <tag_key>[,<tag_key]]
```

#### Description of Syntax

`GROUP BY *`  
&emsp;&emsp;&emsp;Groups results by all [tags](/influxdb/v1.0/concepts/glossary/#tag)

`GROUP BY <tag_key>`  
&emsp;&emsp;&emsp;Groups results by a specific tag

`GROUP BY <tag_key>,<tag_key>`  
&emsp;&emsp;&emsp;Groups results by more than one tag.
The order of the [tag keys](/influxdb/v1.0/concepts/glossary/#tag-key) is irrelevant.

If the query includes a [`WHERE` clause](#the-where-clause) the `GROUP BY`
clause must appear after the `WHERE` clause.

#### Examples

##### Example 1: Group query results by a single tag
<br>
```
> SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"

name: h2o_feet
tags: location=coyote_creek
time			               mean
----			               ----
1970-01-01T00:00:00Z	 5.359342451341401


name: h2o_feet
tags: location=santa_monica
time			               mean
----			               ----
1970-01-01T00:00:00Z	 3.530863470081006
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level` for each
[tag value](/influxdb/v1.0/concepts/glossary/#tag-value) of `location` in
the `h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
InfluxDB returns results in two [series](/influxdb/v1.0/concepts/glossary/#series): one for each tag value of `location`.

>**Note:** In InfluxDB, [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an [aggregation function](/influxdb/v1.0/query_language/functions/) with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

##### Example 2: Group query results by more than one tag
<br>
```
> SELECT MEAN("index") FROM "h2o_quality" GROUP BY location,randtag

name: h2o_quality
tags: location=coyote_creek, randtag=1
time                  mean
----                  ----
1970-01-01T00:00:00Z  50.69033760186263

name: h2o_quality
tags: location=coyote_creek, randtag=2
time                   mean
----                   ----
1970-01-01T00:00:00Z   49.661867544220485

name: h2o_quality
tags: location=coyote_creek, randtag=3
time                   mean
----                   ----
1970-01-01T00:00:00Z   49.360939907550076

name: h2o_quality
tags: location=santa_monica, randtag=1
time                   mean
----                   ----
1970-01-01T00:00:00Z   49.132712456344585

name: h2o_quality
tags: location=santa_monica, randtag=2
time                   mean
----                   ----
1970-01-01T00:00:00Z   50.2937984496124

name: h2o_quality
tags: location=santa_monica, randtag=3
time                   mean
----                   ----
1970-01-01T00:00:00Z   49.99919903884662
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/) to calculate the average `index` for
each combination of the `location` [tag](/influxdb/v1.0/concepts/glossary/#tag) and the `randtag` tag in the
`h2o_quality` measurement.
Separate multiple tags with a comma in the `GROUP BY` clause.

##### Example 3: Group query results by all tags
<br>
```
> SELECT MEAN("index") FROM "h2o_quality" GROUP BY *

name: h2o_quality
tags: location=coyote_creek, randtag=1
time			               mean
----			               ----
1970-01-01T00:00:00Z	 50.55405446521169


name: h2o_quality
tags: location=coyote_creek, randtag=2
time			               mean
----			               ----
1970-01-01T00:00:00Z	 50.49958856271162


name: h2o_quality
tags: location=coyote_creek, randtag=3
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.5164137518956


name: h2o_quality
tags: location=santa_monica, randtag=1
time			               mean
----			               ----
1970-01-01T00:00:00Z	 50.43829082296367


name: h2o_quality
tags: location=santa_monica, randtag=2
time			               mean
----			               ----
1970-01-01T00:00:00Z	 52.0688508894012


name: h2o_quality
tags: location=santa_monica, randtag=3
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.29386362086556
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `index` for every possible
[tag](/influxdb/v1.0/concepts/glossary/#tag) combination in the `h2o_quality`
measurement.

Note that the query results are identical to the results of the query in [Example 2](#example-2-group-query-results-by-more-than-one-tag)
where we explicitly specified the `location` and `randtag` tag keys.
This is because the `h2o_quality` measurement only has two tag keys.

## GROUP BY time intervals

`GROUP BY time()` queries group query results by a user-specified time interval.

### Basic GROUP BY time() Syntax

#### Syntax
```
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>),[tag_key] [fill(<fill_option>)]
```

#### Description of Basic Syntax

Basic `GROUP BY time()` queries require an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
in the [`SELECT` clause](#the-basic-select-statement) and a time range in the
[`WHERE` clause](#the-where-clause).
Note that the `GROUP BY` clause must come after the `WHERE` clause.

##### `time(time_interval)`
<br>
The `time_interval` in the `GROUP BY time()` clause is a
[duration literal](/influxdb/v1.0/query_language/spec/#durations).
It determines how InfluxDB groups query results over time.
For example, a `time_interval` of `5m` groups query results into five-minute
time groups across the time range specified in the [`WHERE` clause](#the-where-clause).

##### `fill(<fill_option>)`
<br>
`fill(<fill_option>)` is optional.
It changes the value reported for time intervals that have no data.
See [GROUP BY time intervals and `fill()`](#group-by-time-intervals-and-fill)
for more information.

**Coverage:**

Basic `GROUP BY time()` queries rely on the `time_interval` and on InfluxDB's
preset time boundaries to determine the raw data included in each time interval
and the timestamps returned by the query.

#### Examples of Basic Syntax

The examples below use the following subsample of the sample data:
```
> SELECT "water_level","location" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
--------------
time                   water_level   location
2015-08-18T00:00:00Z   8.12          coyote_creek
2015-08-18T00:00:00Z   2.064         santa_monica
2015-08-18T00:06:00Z   8.005         coyote_creek
2015-08-18T00:06:00Z   2.116         santa_monica
2015-08-18T00:12:00Z   7.887         coyote_creek
2015-08-18T00:12:00Z   2.028         santa_monica
2015-08-18T00:18:00Z   7.762         coyote_creek
2015-08-18T00:18:00Z   2.126         santa_monica
2015-08-18T00:24:00Z   7.635         coyote_creek
2015-08-18T00:24:00Z   2.041         santa_monica
2015-08-18T00:30:00Z   7.5           coyote_creek
2015-08-18T00:30:00Z   2.051         santa_monica
```

##### Example 1: Group query results into 12 minute intervals
<br>
```
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
--------------
time                   count
2015-08-18T00:00:00Z   2
2015-08-18T00:12:00Z   2
2015-08-18T00:24:00Z   2
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to count the number of `water_level` points with the [tag](/influxdb/v1.0/concepts/glossary/#tag)
`location = coyote_creek` and it group results into 12 minute intervals.

The result for each [timestamp](/influxdb/v1.0/concepts/glossary/#timestamp)
represents a single 12 minute interval.
The count for the first timestamp covers the raw data between `2015-08-18T00:00:00Z`
and up to, but not including, `2015-08-18T00:12:00Z`.
The count for the second timestamp covers the raw data between `2015-08-18T00:12:00Z`
and up to, but not including, `2015-08-18T00:24:00Z.`

##### Example 2: Group query results into 12 minutes intervals and by a tag key
<br>
```
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m),"location"

name: h2o_feet
tags: location=coyote_creek
time                   count
----                   -----
2015-08-18T00:00:00Z   2
2015-08-18T00:12:00Z   2
2015-08-18T00:24:00Z   2

name: h2o_feet
tags: location=santa_monica
time                   count
----                   -----
2015-08-18T00:00:00Z   2
2015-08-18T00:12:00Z   2
2015-08-18T00:24:00Z   2
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to count the number of `water_level` points.
It groups results by the `location` tag and into 12 minute intervals.
Note that the time interval and the tag key are separated by a comma in the
`GROUP BY` clause.

The query returns two [series](/influxdb/v1.0/concepts/glossary/#series) of results: one for each
[tag value](/influxdb/v1.0/concepts/glossary/#tag-value) of the `location` tag.
The result for each timestamp represents a single 12 minute interval.
The count for the first timestamp covers the raw data between `2015-08-18T00:00:00Z`
and up to, but not including, `2015-08-18T00:12:00Z`.
The count for the second timestamp covers the raw data between `2015-08-18T00:12:00Z`
and up to, but not including, `2015-08-18T00:24:00Z.`

#### Common Issues with Basic Syntax

##### Issue 1: Unexpected timestamps and values in query results
<br>
With the basic syntax, InfluxDB relies on the `GROUP BY time()` interval
and on the system's preset time boundaries to determine the raw data included
in each time interval and the timestamps returned by the query.
In some cases, this can lead to unexpected results.

**Example**

Raw data:

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:18:00Z'
name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
2015-08-18T00:18:00Z   7.762
```

Query and Results:

The following query covers a 12-minute time range and groups results into 12-minute time intervals, but it returns **two** results:

```
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time < '2015-08-18T00:18:00Z' GROUP BY time(12m)

name: h2o_feet
time                   count
----                   -----
2015-08-18T00:00:00Z   1        <----- Note that this timestamp occurs before the start of the query's time range
2015-08-18T00:12:00Z   1
```

Explanation:

InfluxDB uses preset round-number time boundaries for `GROUP BY` intervals that are
independent of any time conditions in the `WHERE` clause.
When it calculates the results, all returned data must occur within the query's
explicit time range but the `GROUP BY` intervals will be based on the preset
time boundaries.

The table below shows the preset time boundary, the relevant `GROUP BY time()` interval, the
points included, and the returned timestamp for each `GROUP BY time()`
interval in the results.

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2015-08-18T00:00:00Z AND time < 2015-08-18T00:12:00Z` | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:12:00Z` | `8.005` | `2015-08-18T00:00:00Z` |
| 2  | `time >= 2015-08-12T00:12:00Z AND time < 2015-08-18T00:24:00Z` | `time >= 2015-08-12T00:12:00Z AND time < 2015-08-18T00:18:00Z`  | `7.887` | `2015-08-18T00:12:00Z` |

The first preset 12-minute time boundary begins at `00:00` and ends just before
`00:12`.
Only one raw point (`8.005`) falls both within the query's first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 12-minute time boundary begins at `00:12` and ends just before
`00:24`.
Only one raw point (`7.887`) falls both within the query's second `GROUP BY time()` interval and in that
second time boundary.

The [advanced `GROUP BY time()` syntax](#advanced-group-by-time-syntax) allows users to shift
the start time of InfluxDB's preset time boundaries.
[Example 3](#example-3-group-query-results-into-12-minute-intervals-and-shift-the-preset-time-boundaries-forward)
in the Advanced Syntax section continues with the query shown here;
it shifts forward the preset time boundaries by six minutes such that
InfluxDB returns:

```
name: h2o_feet
time                   count
----                   -----
2015-08-18T00:06:00Z   2
```

### Advanced GROUP BY time() Syntax

#### Syntax

```
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(<time_interval>,<offset_interval>),[tag_key] [fill(<fill_option>)]
```

#### Description of Advanced Syntax

Advanced `GROUP BY time()` queries require an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
in the [`SELECT` clause](#the-basic-select-statement) and a time range in the
[`WHERE` clause](#the-where-clause).
Note that the `GROUP BY` clause must come after the `WHERE` clause.

##### `time(time_interval,offset_interval)`
<br>
See the [Basic GROUP BY time() Syntax](#basic-group-by-time-syntax)
for details on the `time_interval`.

The `offset_interval` is a
[duration literal](/influxdb/v1.0/query_language/spec/#durations).
It shifts forward or back InfluxDB's preset time boundaries.
The `offset_interval` can be positive or negative.

##### `fill(<fill_option>)`
<br>
`fill(<fill_option>)` is optional.
It changes the value reported for time intervals that have no data.
See [GROUP BY time intervals and `fill()`](#group-by-time-intervals-and-fill)
for more information.

**Coverage:**

Advanced `GROUP BY time()` queries rely on the `time_interval`, the `offset_interval`
, and on InfluxDB's preset time boundaries to determine the raw data included in each time interval
and the timestamps returned by the query.

#### Examples of Advanced Syntax

The examples below use the following subsample of the sample data:

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:54:00Z'

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
2015-08-18T00:18:00Z   7.762
2015-08-18T00:24:00Z   7.635
2015-08-18T00:30:00Z   7.5
2015-08-18T00:36:00Z   7.372
2015-08-18T00:42:00Z   7.234
2015-08-18T00:48:00Z   7.11
2015-08-18T00:54:00Z   6.982
```

##### Example 1: Group query results into 18 minute intervals and shift the preset time boundaries forward
<br>
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(18m,6m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:06:00Z   7.884666666666667
2015-08-18T00:24:00Z   7.502333333333333
2015-08-18T00:42:00Z   7.108666666666667
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level`, grouping results into 18 minute
time intervals, and offsetting the preset time boundaries by six minutes.

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB's preset time boundaries. Let's first examine the results without the offset:

```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(18m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   7.946
2015-08-18T00:18:00Z   7.6323333333333325
2015-08-18T00:36:00Z   7.238666666666667
2015-08-18T00:54:00Z   6.982
```

The time boundaries and returned timestamps for the query **without** the
`offset_interval` adhere to InfluxDB's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2015-08-18T00:00:00Z AND time < 2015-08-18T00:18:00Z` | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:18:00Z` | `8.005`,`7.887` | `2015-08-18T00:00:00Z` |
| 2  | `time >= 2015-08-18T00:18:00Z AND time < 2015-08-18T00:36:00Z` | <--- same | `7.762`,`7.635`,`7.5` | `2015-08-18T00:18:00Z` |
| 3  | `time >= 2015-08-18T00:36:00Z AND time < 2015-08-18T00:54:00Z` | <--- same | `7.372`,`7.234`,`7.11` | `2015-08-18T00:36:00Z` |
| 4  | `time >= 2015-08-18T00:54:00Z AND time < 2015-08-18T01:12:00Z` | `time = 2015-08-18T00:54:00Z` | `6.982` | `2015-08-18T00:54:00Z` |

The first preset 18-minute time boundary begins at `00:00` and ends just before
`00:18`.
Two raw points (`8.005` and `7.887`) fall both within the first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 18-minute time boundary begins at `00:18` and ends just before
`00:36`.
Three raw points (`7.762` and `7.635` and `7.5`) fall both within the second `GROUP BY time()` interval and in that
second time boundary. In this case, the boundary time range and the interval's time range are the same.

The fourth preset 18-minute time boundary begins at `00:54` and ends just before
`1:12:00`.
One raw point (`6.982`) falls both within the fourth `GROUP BY time()` interval and in that
fourth time boundary.

The time boundaries and returned timestamps for the query **with** the
`offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | ------------- |
| 1  | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:24:00Z` | <--- same | `8.005`,`7.887`,`7.762` | `2015-08-18T00:06:00Z` |
| 2  | `time >= 2015-08-18T00:24:00Z AND time < 2015-08-18T00:42:00Z` | <--- same | `7.635`,`7.5`,`7.372` | `2015-08-18T00:24:00Z` |
| 3  | `time >= 2015-08-18T00:42:00Z AND time < 2015-08-18T01:00:00Z` | <--- same | `7.234`,`7.11`,`6.982` | `2015-08-18T00:42:00Z` |
| 4  | `time >= 2015-08-18T01:00:00Z AND time < 2015-08-18T01:12:00Z` | NA | NA | NA |

The six-minute offset interval shifts forward the preset boundary's time range
such that the boundary time ranges and the relevant `GROUP BY time()` interval time ranges are
always the same.
With the offset, each interval performs the calculation on three points, and
the timestamp returned matches both the start of the boundary time range and the
start of the `GROUP BY time()` interval time range.

Note that `offset_interval` forces the fourth time boundary to be outside
the query's time range so the query returns no results for that last interval.

##### Example 2: Group query results into 12 minute intervals and shift the preset time boundaries back
<br>
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(18m,-12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:06:00Z   7.884666666666667
2015-08-18T00:24:00Z   7.502333333333333
2015-08-18T00:42:00Z   7.108666666666667
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level`, grouping results into 18 minute
time intervals, and offsetting the preset time boundaries by -12 minutes.

> **Note:**
The query in Example 2 returns the same results as the query in Example 1, but
the query in Example 2 uses a negative `offset_interval` instead of a positive
`offset_interval`.
There are no performance differences between the two queries; feel free to choose the most
intuitive option when deciding between a positive and negative `offset_interval`.

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB's preset time boundaries. Let's first examine the results without the offset:
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(18m)

name: h2o_feet
time                    mean
----                    ----
2015-08-18T00:00:00Z    7.946
2015-08-18T00:18:00Z    7.6323333333333325
2015-08-18T00:36:00Z    7.238666666666667
2015-08-18T00:54:00Z    6.982
```

The time boundaries and returned timestamps for the query **without** the
`offset_interval` adhere to InfluxDB's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2015-08-18T00:00:00Z AND time < 2015-08-18T00:18:00Z` | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:18:00Z` | `8.005`,`7.887` | `2015-08-18T00:00:00Z` |
| 2  | `time >= 2015-08-18T00:18:00Z AND time < 2015-08-18T00:36:00Z` | <--- same | `7.762`,`7.635`,`7.5` | `2015-08-18T00:18:00Z` |
| 3  | `time >= 2015-08-18T00:36:00Z AND time < 2015-08-18T00:54:00Z` | <--- same | `7.372`,`7.234`,`7.11` | `2015-08-18T00:36:00Z` |
| 4  | `time >= 2015-08-18T00:54:00Z AND time < 2015-08-18T01:12:00Z` | `time = 2015-08-18T00:54:00Z` | `6.982` | `2015-08-18T00:54:00Z` |

The first preset 18-minute time boundary begins at `00:00` and ends just before
`00:18`.
Two raw points (`8.005` and `7.887`) fall both within the first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 18-minute time boundary begins at `00:18` and ends just before
`00:36`.
Three raw points (`7.762` and `7.635` and `7.5`) fall both within the second `GROUP BY time()` interval and in that
second time boundary. In this case, the boundary time range and the interval's time range are the same.

The fourth preset 18-minute time boundary begins at `00:54` and ends just before
`1:12:00`.
One raw point (`6.982`) falls both within the fourth `GROUP BY time()` interval and in that
fourth time boundary.

The time boundaries and returned timestamps for the query **with** the
`offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | ------------- |
| 1  | `time >= 2015-08-17T23:54:00Z AND time < 2015-08-18T00:06:00Z` | NA | NA | NA |
| 2  | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:24:00Z` | <--- same | `8.005`,`7.887`,`7.762` | `2015-08-18T00:06:00Z` |
| 3  | `time >= 2015-08-18T00:24:00Z AND time < 2015-08-18T00:42:00Z` | <--- same | `7.635`,`7.5`,`7.372` | `2015-08-18T00:24:00Z` |
| 4  | `time >= 2015-08-18T00:42:00Z AND time < 2015-08-18T01:00:00Z` | <--- same | `7.234`,`7.11`,`6.982` | `2015-08-18T00:42:00Z` |

The negative 12-minute offset interval shifts back the preset boundary's time range
such that the boundary time ranges and the relevant `GROUP BY time()` interval time ranges are always the
same.
With the offset, each interval performs the calculation on three points, and
the timestamp returned matches both the start of the boundary time range and the
start of the `GROUP BY time()` interval time range.

Note that `offset_interval` forces the first time boundary to be outside
the query's time range so the query returns no results for that first interval.

##### Example 3: Group query results into 12 minute intervals and shift the preset time boundaries forward
<br>
This example is a continuation of the scenario outlined in [Common Issues with Basic Syntax](#common-issues-with-basic-syntax).

```
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time < '2015-08-18T00:18:00Z' GROUP BY time(12m,6m)

name: h2o_feet
time                   count
----                   -----
2015-08-18T00:06:00Z   2
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level`, grouping results into 12 minute
time intervals, and offsetting the preset time boundaries by six minutes.

The time boundaries and returned timestamps for the query **without** the `offset_interval` adhere to InfluxDB's preset time boundaries. Let's first examine the results without the offset:

```
> SELECT COUNT("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-08-18T00:06:00Z' AND time < '2015-08-18T00:18:00Z' GROUP BY time(12m)

name: h2o_feet
time                   count
----                   -----
2015-08-18T00:00:00Z   1
2015-08-18T00:12:00Z   1
```

The time boundaries and returned timestamps for the query **without** the
`offset_interval` adhere to InfluxDB's preset time boundaries:

| Time Interval Number | Preset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2015-08-18T00:00:00Z AND time < 2015-08-18T00:12:00Z` | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:12:00Z` | `8.005` | `2015-08-18T00:00:00Z` |
| 2  | `time >= 2015-08-12T00:12:00Z AND time < 2015-08-18T00:24:00Z` | `time >= 2015-08-12T00:12:00Z AND time < 2015-08-18T00:18:00Z`  | `7.887` | `2015-08-18T00:12:00Z` |

The first preset 12-minute time boundary begins at `00:00` and ends just before
`00:12`.
Only one raw point (`8.005`) falls both within the query's first `GROUP BY time()` interval and in that
first time boundary.
Note that while the returned timestamp occurs before the start of the query's time range,
the query result excludes data that occur before the query's time range.

The second preset 12-minute time boundary begins at `00:12` and ends just before
`00:24`.
Only one raw point (`7.887`) falls both within the query's second `GROUP BY time()` interval and in that
second time boundary.

The time boundaries and returned timestamps for the query **with** the
`offset_interval` adhere to the offset time boundaries:

| Time Interval Number | Offset Time Boundary |`GROUP BY time()` Interval | Points Included | Returned Timestamp |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| 1  | `time >= 2015-08-18T00:06:00Z AND time < 2015-08-18T00:24:00Z` | <--- same | `8.005`,`7.887` | `2015-08-18T00:06:00Z` |
| 2  | `time >= 2015-08-18T00:24:00Z AND time < 2015-08-18T00:36:00Z` | NA | NA | NA |

The six-minute offset interval shifts forward the preset boundary's time range
such that the preset boundary time range and the relevant `GROUP BY time()` interval time range are the
same.
With the offset, the query returns a single result, and the timestamp returned
matches both the start of the boundary time range and the start of the `GROUP BY time()` interval
time range.

Note that `offset_interval` forces the second time boundary to be outside
the query's time range so the query returns no results for that second interval.

## `GROUP BY` time intervals and `fill()`

`fill()` changes the value reported for time intervals that have no data.

#### Syntax

```
SELECT <function>(<field_key>) FROM_clause WHERE <time_range> GROUP BY time(time_interval,[<offset_interval])[,tag_key] [fill(<fill_option>)]
```

#### Description of Syntax

By default, a `GROUP BY time()` interval with no data reports `null` as its
value in the output column.
`fill()` changes the value reported for time intervals that have no data.
Note that `fill()` must go at the end of the `GROUP BY` clause if you're
`GROUP(ing) BY` several things (for example, both [tags](/influxdb/v1.0/concepts/glossary/#tag) and a time interval).

##### fill_option
<br>

Any numerical value
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
 Reports the given numerical value for time intervals with no data.

`none`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Reports no timestamp and no value for time intervals with no data.

`null`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Reports null for time intervals with no data but returns a timestamp. This is the same as the default behavior.

`previous`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;
Reports the value from the previous time interval for time intervals with no data.

#### Examples

{{< vertical-tabs >}}
{{% tabs %}}
[Example 1: fill(100)](#)
[Example 2: fill(none)](#)
[Example 3: fill(null)](#)
[Example 4: fill(previous)](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Without `fill(100)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z   
```

With `fill(100)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m) fill(100)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z   100
```

`fill(100)` changes the value reported for the time interval with no data to `100`.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(none)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z
```

With `fill(none)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m) fill(none)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
```

`fill(none)` reports no value and no timestamp for the time interval with no data.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(null)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z
```

With `fill(null)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m) fill(null)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z   
```

`fill(null)` reports `null` as the value for the time interval with no data.
That result matches the result of the query without `fill(null)`.

{{% /tab-content %}}

{{% tab-content %}}

Without `fill(previous)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z
```

With `fill(previous)`:
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location"='coyote_creek' AND time >= '2015-09-18T16:00:00Z' AND time <= '2015-09-18T16:42:00Z' GROUP BY time(12m) fill(previous)

name: h2o_feet
--------------
time                   max
2015-09-18T16:00:00Z   3.599
2015-09-18T16:12:00Z   3.402
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z   3.235
```

`fill(previous)` changes the value reported for the time interval with no data to `3.235`,
the value from the previous time interval.

{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /vertical-tabs >}}

#### Common issues with `fill()`

##### Issue 1: `fill()` when no data fall within the query's time range
<br>
Currently, queries ignore `fill()` if no data fall within the query's time range.
This is the expected behavior. An open
[feature request](https://github.com/influxdata/influxdb/issues/6967) on GitHub
proposes that `fill()` should force a return of values even if the query's time
range covers no data.

**Example**

The following query returns no data because `water_level` has no points within
the query's time range.
Note that `fill(800)` has no effect on the query results.
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek' AND time >= '2015-09-18T22:00:00Z' AND time <= '2015-09-18T22:18:00Z' GROUP BY time(12m) fill(800)
>
```

##### Issue 2: `fill(previous)` when the previous result falls outside the query's time range
<br>
`fill(previous)` doesn’t fill the result for a time interval if the previous
value is outside the query’s time range.

**Example**

The following query covers the time range between `2015-09-18T16:24:00Z` and `2015-09-18T16:54:00Z`.
Note that `fill(previous)` fills the result for `2015-09-18T16:36:00Z` with the
result from `2015-09-18T16:24:00Z`.
```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE location = 'coyote_creek' AND time >= '2015-09-18T16:24:00Z' AND time <= '2015-09-18T16:54:00Z' GROUP BY time(12m) fill(previous)

name: h2o_feet
--------------
time                   max
2015-09-18T16:24:00Z   3.235
2015-09-18T16:36:00Z   3.235
2015-09-18T16:48:00Z   4
```

The next query shortens the time range in the previous query.
It now covers the time between `2015-09-18T16:36:00Z` and `2015-09-18T16:54:00Z`.
Note that `fill(previous)` doesn't fill the result for `2015-09-18T16:36:00Z` with the
result from `2015-09-18T16:24:00Z`; the result for `2015-09-18T16:24:00Z` is outside the query's
shorter time range.

```
> SELECT MAX("water_level") FROM "h2o_feet" WHERE location = 'coyote_creek' AND time >= '2015-09-18T16:36:00Z' AND time <= '2015-09-18T16:54:00Z' GROUP BY time(12m) fill(previous)

name: h2o_feet
--------------
time                   max
2015-09-18T16:36:00Z
2015-09-18T16:48:00Z   4
```

<br>
<br>
# The INTO clause

The `INTO` clause writes query results to a user-specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).

### Syntax
```
SELECT_clause INTO <measurement_name> FROM_clause [WHERE_clause] [GROUP_BY_clause]
```

### Description of Syntax

The `INTO` clause supports several formats for specifying a [measurement](/influxdb/v1.0/concepts/glossary/#measurement):

`INTO <measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Writes data to the specified measurement.
If you're using the [CLI](/influxdb/v1.0/tools/shell/) InfluxDB writes the data to the measurement in the
[`USE`d](/influxdb/v1.0/tools/shell/#commands)
[database](/influxdb/v1.0/concepts/glossary/#database) and the `DEFAULT` [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp).
If you're using the [HTTP API](/influxdb/v1.0/tools/api/) InfluxDB writes the data to the
measurement in the database specified in the [`db` query string parameter](/influxdb/v1.0/tools/api/#query-string-parameters)
and the `DEFAULT` retention policy.

`INTO <database_name>.<retention_policy_name>.<measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Writes data to a fully qualified measurement.
Fully qualify a measurement by specifying its database and retention policy.

`INTO <database_name>..<measurement_name>`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Writes data to a measurement in a user-specified database and the `DEFAULT`
retention policy.

`INTO <database_name>.<retention_policy_name>.:MEASUREMENT FROM /<regular_expression>/`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Writes data to all measurements in the user-specified database and
retention policy that match the [regular expression](#regular-expressions-in-queries) in the `FROM` clause.
`:MEASUREMENT` is a backreference to each measurement matched in the `FROM` clause.

### Examples

#### Example 1: Write the results of a query to a measurement

```
> SELECT "water_level" INTO "h2o_feet_copy_1" FROM "h2o_feet" WHERE "location" = 'coyote_creek'

name: result
------------
time                   written
1970-01-01T00:00:00Z   7604

> SELECT * FROM "h2o_feet_copy_1"

name: h2o_feet_copy_1
---------------------
time                   water_level
2015-08-18T00:00:00Z   8.12
[...]
2015-09-18T16:48:00Z   4
```

The query writes its results a new [measurement](/influxdb/v1.0/concepts/glossary/#measurement): `h2o_feet_copy_1`.
If you're using the [CLI](/influxdb/v1.0/tools/shell/), InfluxDB writes the data to
the `USE`d [database](/influxdb/v1.0/concepts/glossary/#database) and the `DEFAULT` [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp).
If you're using the [HTTP API](/influxdb/v1.0/tools/api/), InfluxDB writes the
data to the database and retention policy specified in the `db` and `rp`
[query string parameters](/influxdb/v1.0/tools/api/#query-string-parameters).
If you do not set the `rp` query string parameter, the HTTP API automatically
writes the data to the database's `DEFAULT` retention policy.

The response shows the number of points (`7605`) that InfluxDB writes to `h2o_feet_copy_1`.
The timestamp in the response is meaningless; InfluxDB uses epoch 0
(`1970-01-01T00:00:00Z`) as a null timestamp equivalent.

#### Example 2: Write the results of a query to a fully qualified measurement

```
> SELECT "water_level" INTO "where_else"."autogen"."h2o_feet_copy_2" FROM "h2o_feet" WHERE "location" = 'coyote_creek'

name: result
------------
time                   written
1970-01-01T00:00:00Z   7604

> SELECT * FROM "where_else"."autogen"."h2o_feet_copy_2"

name: h2o_feet_copy_2
---------------------
time                   water_level
2015-08-18T00:00:00Z   8.12
[...]
2015-09-18T16:48:00Z   4
```

The query writes its results to a new measurement: `h2o_feet_copy_2`.
InfluxDB writes the data to the `where_else` database and to the `autogen`
retention policy.
Note that both `where_else` and `autogen` must exist prior to running the `INTO`
query.
See [Database Management](/influxdb/v1.0/query_language/database_management/)
for how to manage databases and retetion policies.

The response shows the number of points (`7605`) that InfluxDB writes to `h2o_feet_copy_2`.
The timestamp in the response is meaningless; InfluxDB uses epoch 0
(`1970-01-01T00:00:00Z`) as a null timestamp equivalent.

#### Example 3: Write aggregated results to a measurement (downsampling)

```
> SELECT MEAN("water_level") INTO "all_my_averages" FROM "h2o_feet" WHERE "location" = 'coyote_creek' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: result
------------
time                   written
1970-01-01T00:00:00Z   3

> SELECT * FROM "all_my_averages"

name: all_my_averages
---------------------
time                   mean
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245
2015-08-18T00:24:00Z   7.5675
```

The query aggregates data using an
InfluxQL [function](/influxdb/v1.0/query_language/functions) and a [`GROUP BY
time()` clause](#group-by-time-intervals).
It also writes its results to the `all_my_averages` measurement.

The response shows the number of points (`3`) that InfluxDB writes to `all_my_averages`.
The timestamp in the response is meaningless; InfluxDB uses epoch 0
(`1970-01-01T00:00:00Z`) as a null timestamp equivalent.

The query is an example of downsampling: taking higher precision data,
aggregating those data to a lower precision, and storing the lower precision
data in the database.
Downsampling is a common use case for the `INTO` clause.

#### Example 4: Write aggregated results for more than one measurement to a different database (downsampling with backreferencing)

```
> SELECT MEAN(*) INTO "where_else"."autogen".:MEASUREMENT FROM /.*/ WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:06:00Z' GROUP BY time(12m)

name: result
time                   written
----                   -------
1970-01-01T00:00:00Z   5

> SELECT * FROM "where_else"."autogen"./.*/

name: average_temperature
time                   mean_degrees   mean_index   mean_pH   mean_water_level
----                   ------------   ----------   -------   ----------------
2015-08-18T00:00:00Z   78.5

name: h2o_feet
time                   mean_degrees   mean_index   mean_pH   mean_water_level
----                   ------------   ----------   -------   ----------------
2015-08-18T00:00:00Z                                         5.07625

name: h2o_pH
time                   mean_degrees   mean_index   mean_pH   mean_water_level
----                   ------------   ----------   -------   ----------------
2015-08-18T00:00:00Z                               6.75

name: h2o_quality
time                   mean_degrees   mean_index   mean_pH   mean_water_level
----                   ------------   ----------   -------   ----------------
2015-08-18T00:00:00Z                  51.75

name: h2o_temperature
time                   mean_degrees   mean_index   mean_pH   mean_water_level
----                   ------------   ----------   -------   ----------------
2015-08-18T00:00:00Z   63.75
```

The query aggregates data using an
InfluxQL [function](/influxdb/v1.0/query_language/functions) and a [`GROUP BY
time()` clause](#group-by-time-intervals).
It aggregates data in every measurement that matches the [regular expression](#regular-expressions-in-queries)
in the `FROM` clause and writes the results to measurements with the same name in the
`where_else` database and the `autogen` retention policy.
Note that both `where_else` and `autogen` must exist prior to running the `INTO`
query.
See [Database Management](/influxdb/v1.0/query_language/database_management/)
for how to manage databases and retention policies.

The response shows the number of points (`5`) that InfluxDB writes to the `where_else`
database and the `autogen` retention policy.
The timestamp in the response is meaningless; InfluxDB uses epoch 0
(`1970-01-01T00:00:00Z`) as a null timestamp equivalent.

The query is an example of downsampling with backreferencing.
It takes higher precision data from more than one measurement,
aggregates those data to a lower precision, and stores the lower precision
data in the database.
Downsampling with backreferencing is a common use case for the `INTO` clause.

### Common Issues with the `INTO` clause

#### Issue 1: Missing data

If an `INTO` query includes a [tag key](/influxdb/v1.0/concepts/glossary#tag-key) in the [`SELECT` clause](#the-basic-select-statement), the query converts [tags](/influxdb/v1.0/concepts/glossary#tag) in the current
measurement to [fields](/influxdb/v1.0/concepts/glossary#field) in the destination measurement.
This can cause InfluxDB to overwrite [points](/influxdb/v1.0/concepts/glossary#point) that were previously differentiated
by a [tag value](/influxdb/v1.0/concepts/glossary#tag-value).
The
[Frequently Asked Questions](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#why-are-my-into-queries-missing-data)
document describes that behavior in detail.

To preserve tags in the current measurement as tags in the destination measurement,
[`GROUP BY` the relevant tag key](#group-by-tags) or `GROUP BY *` in the `INTO` query.

#### Issue 2: Automating queries with the `INTO` clause

The `INTO` clause section in this document shows how to manually implement
queries with an `INTO` clause.
See the [Continuous Queries](/influxdb/v1.0/query_language/#continuous_queries)
documentation for how to automate `INTO` clause queries on realtime data.
Among [other uses](/influxdb/v1.0/query_language/continuous_queries/#continuous-query-use-cases),
Continuous Queries automate the downsampling process.

<br>
<br>
# ORDER BY time DESC
By default, InfluxDB returns results in ascending time order; the first [point](/influxdb/v1.0/concepts/glossary/#point)
returned has the oldest [timestamp](/influxdb/v1.0/concepts/glossary/#timestamp) and
the last point returned has the most recent timestamp.
`ORDER BY time DESC` reverses that order such that InfluxDB returns the points
with the most recent timestamps first.

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time DESC
```

### Description of Syntax

`ORDER by time DESC` must appear after the [`GROUP BY` clause](#the-group-by-clause)
if the query includes a `GROUP BY` clause.
`ORDER by time DESC` must appear after the [`WHERE` clause](#the-where-clause)
if the query includes a `WHERE` clause and no `GROUP BY` clause.

### Examples

#### Example 1: Return the newest points first

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' ORDER BY time DESC

name: h2o_feet
time                   water_level
----                   -----------
2015-09-18T21:42:00Z   4.938
2015-09-18T21:36:00Z   5.066
[...]
2015-08-18T00:06:00Z   2.116
2015-08-18T00:00:00Z   2.064
```

The query returns the points with the most recent timestamps from the
`h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement) first.
Without `ORDER by time DESC`, the query would return `2015-08-18T00:00:00Z`
first and `2015-09-18T21:42:00Z` last.

#### Example 2: Return the newest points first and include a GROUP BY time() clause
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY time(12m) ORDER BY time DESC

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:36:00Z   4.6825
2015-08-18T00:24:00Z   4.80675
2015-08-18T00:12:00Z   4.950749999999999
2015-08-18T00:00:00Z   5.07625
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`ORDER BY time DESC` returns the most recent 12-minute time intervals
first.

Without `ORDER BY time DESC`, the query would return
`2015-08-18T00:00:00Z` first and `2015-08-18T00:36:00Z` last.

<br>
<br>
# The LIMIT and SLIMIT clauses

`LIMIT` and `SLIMIT` limit the number of
[points](/influxdb/v1.0/concepts/glossary/#point) and the number of
[series](/influxdb/v1.0/concepts/glossary/#series) returned per query.

## The LIMIT Clause
`LIMIT <N>` returns the first `N` [points](/influxdb/v1.0/concepts/glossary/#point) from the specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
```

### Description of Syntax

`N` specifies the number of [points](/influxdb/v1.0/concepts/glossary/#point) to return from the specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
If `N` is greater than the number of points in a measurement, InfluxDB returns
all points from that series.

Note that the `LIMIT` clause must appear in the order outlined in the syntax above.

### Examples

#### Example 1: Limit the number of points returned
```
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3

name: h2o_feet
time                   water_level   location
----                   -----------   --------
2015-08-18T00:00:00Z   8.12          coyote_creek
2015-08-18T00:00:00Z   2.064         santa_monica
2015-08-18T00:06:00Z   8.005         coyote_creek
```

The query returns the three oldest [points](/influxdb/v1.0/concepts/glossary/#point) (determined by timestamp) from the
`h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement).

#### Example 2: Limit the number points returned and include a GROUP BY clause
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245

name: h2o_feet
tags: location=santa_monica
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions)
and a [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each [tag](/influxdb/v1.0/concepts/glossary/#tag) and for each twelve-minute
interval in the query's time range.
`LIMIT 2` requests the two oldest twelve-minute averages (determined by timestamp).

Note that without `LIMIT 2`, the query would return four points per [series](/influxdb/v1.0/concepts/glossary/#series);
one for each twelve-minute interval in the query's time range.

## The `SLIMIT` Clause
`SLIMIT <N>` returns every [point](/influxdb/v1.0/concepts/glossary/#point) from \<N> [series](/influxdb/v1.0/concepts/glossary/#series) in the specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] SLIMIT <N>
```

### Description of Syntax
`N` specifies the number of [series](/influxdb/v1.0/concepts/glossary/#series) to return from the specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
If `N` is greater than the number of series in a measurement, InfluxDB returns
all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`.
Note that the `SLIMIT` clause must appear in the order outlined in the syntax above.

### Examples

#### Example 1: Limit the number of series returned
```
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   water_level
----                   -----
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
[...]
2015-09-18T16:12:00Z   3.402
2015-09-18T16:18:00Z   3.314
2015-09-18T16:24:00Z   3.235
```

The query returns all `water_level` [points](/influxdb/v1.0/concepts/glossary/#points) from one of the [series](/influxdb/v1.0/concepts/glossary/#series) associated
with the `h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement).

#### Example 2: Limit the number of series returned and include a GROUP BY time() clause
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245
2015-08-18T00:24:00Z   7.5675
2015-08-18T00:36:00Z   7.303
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`SLIMIT 1` requests a single series
associated with the `h2o_feet` measurement.

Note that without `SLIMIT 1`, the query would return results for the two series
associated with the `h2o_feet` measurement: `location=coyote_creek` and
`location=santa_monica`.

## LIMIT and SLIMIT
`LIMIT <N>` followed by `SLIMIT <N>` returns the first \<N> [points](/influxdb/v1.0/concepts/glossary/#point) from \<N> [series](/influxdb/v1.0/concepts/glossary/#series) in the specified measurement.

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] LIMIT <N1> SLIMIT <N2>
```

### Description of Syntax

`N1` specifies the number of [points](/influxdb/v1.0/concepts/glossary/#point) to return per [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
If `N1` is greater than the number of points in a measurement, InfluxDB returns all points from that measurement.

`N2` specifies the number of series to return from the specified [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
If `N2` is greater than the number of series in a measurement, InfluxDB returns all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `LIMIT` and `SLIMIT` to include `GROUP BY *`.
Note that the `LIMIT` and `SLIMIT` clauses must appear in the order outlined in the syntax above.

### Examples

#### Example 1: Limit the number of points and series returned
```
> SELECT "water_level" FROM "h2o_feet" GROUP BY * LIMIT 3 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
```

The query returns the three oldest [points](/influxdb/v1.0/concepts/glossary/#point) (determined by timestamp) from one
of the [series](/influxdb/v1.0/concepts/glossary/#series) associated with the
[measurement](/influxdb/v1.0/concepts/glossary/#measurement) `h2o_feet`.

#### Example 2: Limit the number of points and series returned and include a GROUP BY time() clause
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`LIMIT 2` requests the two oldest twelve-minute averages (determined by
timestamp) and `SLIMIT 1` requests a single series
associated with the `h2o_feet` measurement.

Note that without `LIMIT 2 SLIMIT 1`, the query would return four points
for each of the two series associated with the `h2o_feet` measurement.

<br>
<br>
# The OFFSET and SOFFSET Clauses
`OFFSET` and `SOFFSET` paginates [points](/influxdb/v1.0/concepts/glossary/#point) and [series](/influxdb/v1.0/concepts/glossary/#series) returned.

<table style="width:100%">
  <tr>
    <td><a href="#the-offset-clause">The OFFSET clause</a></td>
    <td><a href="#the-soffset-clause">The SOFFSET clause</a></td>
  </tr>
</table>

## The `OFFSET` clause
`OFFSET <N>` paginates `N` [points](/influxdb/v1.0/concepts/glossary/#point) in the query results.

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT_clause OFFSET <N> [SLIMIT_clause]
```

### Description of Syntax
`N` specifies the number of [points](/influxdb/v1.0/concepts/glossary/#point) to paginate.
The `OFFSET` clause requires a [`LIMIT` clause](#the-limit-clause).
Using the `OFFSET` clause without a `LIMIT` clause can cause [inconsistent
query results](https://github.com/influxdata/influxdb/issues/7577).

> **Note:** InfluxDB returns no results if the `WHERE` clause includes a time
range and the `OFFSET` clause would cause InfluxDB to return points with
timestamps outside of that time range.

### Examples

#### Example 1: Paginate points
```
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3 OFFSET 3

name: h2o_feet
time                   water_level   location
----                   -----------   --------
2015-08-18T00:06:00Z   2.116         santa_monica
2015-08-18T00:12:00Z   7.887         coyote_creek
2015-08-18T00:12:00Z   2.028         santa_monica
```

The query returns the fourth, fifth, and sixth [points](/influxdb/v1.0/concepts/glossary/#point) from the `h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement).
If the query did not include `OFFSET 3`, it would return the first, second,
and third points from that measurement.

#### Example 2: Paginate points and include several clauses
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:12:00Z   7.8245
2015-08-18T00:00:00Z   8.0625
```

This example is pretty involved, so here's the clause-by-clause breakdown:

The [`SELECT` clause](#the-basic-select-statement) specifies an InfluxQL [function](/influxdb/v1.0/query_language/functions).  
The [`FROM` clause](#the-basic-select-statement) specifies a single measurement.  
The [`WHERE` clause](#the-where-clause) specifies the time range for the query.  
The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.  
The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.  
The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.  
The `OFFSET 2` clause excludes the first two averages from the query results.  
The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.

Without `OFFSET 2`, the query would return the first two averages of the query results:
```
name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:36:00Z   7.303
2015-08-18T00:24:00Z   7.5675
```

## The `SOFFSET` clause
`SOFFSET <N>` paginates `N` [series](/influxdb/v1.0/concepts/glossary/#series) in the query results.

### Syntax
```
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(time_interval)] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] SLIMIT_clause SOFFSET <N>
```

### Description of Syntax
`N` specifies the number of [series](/influxdb/v1.0/concepts/glossary/#series) to paginate.
The `SOFFSET` clause requires an [`SLIMIT` clause](#the-slimit-clause).
Using the `SOFFSET` clause without an `SLIMIT` clause can cause [inconsistent
query results](https://github.com/influxdata/influxdb/issues/7578).
There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`.

> **Note:** InfluxDB returns no results if the `SOFFSET` clause paginates
through more than the total number of series.

### Examples

#### Example 1: Paginate series
```
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
[...]
2015-09-18T21:36:00Z   5.066
2015-09-18T21:42:00Z   4.938
```

The query returns data for the [series](/influxdb/v1.0/concepts/glossary/#series) associated with the `h2o_feet`
[measurement](/influxdb/v1.0/concepts/glossary/#measurement) and the `location = santa_monica` [tag](/influxdb/v1.0/concepts/glossary/#tag).
Without `SOFFSET 1`, the query returns data for the series associated with the
`h2o_feet` measurement and the `location = coyote_creek` tag.

#### Example 2: Paginate series and include all clauses
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   mean
----                   ----
2015-08-18T00:12:00Z   2.077
2015-08-18T00:00:00Z   2.09
```

This example is pretty involved, so here's the clause-by-clause breakdown:

The [`SELECT` clause](#the-basic-select-statement) specifies an InfluxQL [function](/influxdb/v1.0/query_language/functions).  
The [`FROM` clause](#the-basic-select-statement) specifies a single measurement.  
The [`WHERE` clause](#the-where-clause) specifies the time range for the query.  
The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.  
The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.  
The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.  
The [`OFFSET 2` clause](#the-offset-clause) excludes the first two averages from the query results.  
The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.  
The `SOFFSET 1` clause paginates the series returned.

Without `SOFFSET 1`, the query would return the results for a different series:
```
name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:12:00Z   7.8245
2015-08-18T00:00:00Z   8.0625
```

<br>
<br>
# Time Syntax in Queries

By default, a query's time range is between [`1677-09-21 00:12:43.145224194` UTC](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store)
and [`now()`](/influxdb/v1.0/concepts/glossary/#now).
The following sections detail how to specify alternative time ranges in the `SELECT`
statement's [`WHERE` clause](#the-where-clause).

<table style="width:100%">
  <tr>
    <td><a href="#absolute-time">Absolute Time</a></td>
    <td><a href="#relative-time">Relative Time</a></td>
    <td><a href="#common-issues-with-time-syntax">Common Issues with Time Syntax</a></td>
  </tr>
</table>

## Absolute Time

Specify absolute time with date-time strings and epoch time.

### Syntax
```
SELECT_clause FROM_clause WHERE time <operator> ['<rfc3339_date_time_string>' | '<rfc3339_like_date_time_string>' | <epoch_time>] [AND ['<rfc3339_date_time_string>' | '<rfc3339_like_date_time_string>' | <epoch_time>] [...]]
```

### Description of Syntax

#### Supported operators

`=`&emsp;&nbsp;&thinsp;equal to  
`<>`&emsp;not equal to  
`!=`&emsp;not equal to  
`>`&emsp;&nbsp;&thinsp;greater than  
`>=`&emsp;greater than or equal to  
`<`&emsp;&nbsp;&thinsp;less than  
`<=`&emsp;less than or equal to  

Currently, InfluxDB does not support using `OR` with absolute time in the `WHERE`
clause. See the [Frequently Asked Questions](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
document and the [GitHub Issue](https://github.com/influxdata/influxdb/issues/7530)
for more information.

#### rfc3339_date_time_string

```
'YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ'
```

`.nnnnnnnnn` is optional and is set to `.000000000` if not included.
The [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) date-time string requires single quotes.

#### rfc3339_like_date_time_string

```
'YYYY-MM-DD HH:MM:SS.nnnnnnnnn'
```

`HH:MM:SS.nnnnnnnnn.nnnnnnnnn` is optional and is set to `00:00:00.000000000` if not included.
The RFC3339-like date-time string requires single quotes.

#### epoch_time

Epoch time is the amount of time that has elapsed since 00:00:00
Coordinated Universal Time (UTC), Thursday, 1 January 1970.

By default, InfluxDB assumes that all epoch timestamps are in nanoseconds.
Include a [duration literal](/influxdb/v1.0/query_language/spec/#durations)
at the end of the epoch timestamp to indicate a precision other than nanoseconds.

#### Basic Arithmetic

All timestamp formats support basic arithmetic.
Add (`+`) or subtract (`-`) a time from a timestamp with a [duration literal](/influxdb/v1.0/query_language/spec/#durations).
Note that InfluxQL requires a whitespace between the `+` or `-` and the
duration literal.

### Examples

#### Example 1: Specify a time range with RFC3339 date-time strings
```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00.000000000Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

The query returns data with timestamps between August 18, 2015 at 00:00:00.000000000 and
August 18, 2015 at 00:12:00.
The nanosecond specification in the first timestamp (`.000000000`)
is optional.

Note that the single quotes around the RFC3339 date-time strings are required.

#### Example 2: Specify a time range with RFC3339-like date-time strings

```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18' AND time <= '2015-08-18 00:12:00'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

The query returns data with timestamps between August 18, 2015 at 00:00:00 and August 18, 2015
at 00:12:00.
The first date-time string does not include a time; InfluxDB assumes the time
is 00:00:00.

Note that the single quotes around the RFC3339-like date-time strings are
required.


#### Example 3: Specify a time range with epoch timestamps
```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1439856000000000000 AND time <= 1439856720000000000

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

The query returns data with timestamps that occur between August 18, 2015
at 00:00:00 and August 18, 2015 at 00:12:00.
By default InfluxDB assumes epoch timestamps are in nanoseconds.

#### Example 4: Specify a time range with second-precision epoch timestamps
```
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= 1439856000s AND time <= 1439856720s

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

The query returns data with timestamps that occur between August 18, 2015
at 00:00:00 and August 18, 2015 at 00:12:00.
The `s` [duration literal](/influxdb/v1.0/query_language/spec/#durations) at the
end of the epoch timestamps indicate that the epoch timestamps are in seconds.

#### Example 5: Perform basic arithmetic on an RFC3339-like date-time string
```
> SELECT "water_level" FROM "h2o_feet" WHERE time > '2015-09-18T21:24:00Z' + 6m

name: h2o_feet
time                   water_level
----                   -----------
2015-09-18T21:36:00Z   5.066
2015-09-18T21:42:00Z   4.938
```

The query returns data with timestamps that occur at least six minutes after
September 18, 2015 at 21:24:00.
Note that the whitespace between the `+` and `6m` is required.

#### Example 6: Perform basic arithmetic on an epoch timestamp

```
> SELECT "water_level" FROM "h2o_feet" WHERE time > 24043524m - 6m

name: h2o_feet
time                   water_level
----                   -----------
2015-09-18T21:24:00Z   5.013
2015-09-18T21:30:00Z   5.01
2015-09-18T21:36:00Z   5.066
2015-09-18T21:42:00Z   4.938
```

The query returns data with timestamps that occur at least six minutes before
September 18, 2015 at 21:24:00.
Note that the whitespace between the `-` and `6m` is required.

## Relative time
Use [`now()`](/influxdb/v1.0/concepts/glossary/#now) to query data with [timestamps](/influxdb/v1.0/concepts/glossary/#timestamp) relative to the server's current timestamp.

### Syntax
```
SELECT_clause FROM_clause WHERE time <operator> now() [[ - | + ] <duration_literal>] [(AND|OR) now() [...]]
```

### Description of Syntax

`now()` is the Unix time of the server at the time the query is executed on that server.
The whitespace between `-` or `+` and the [duration literal](/influxdb/v1.0/query_language/spec/#durations) is required.

#### Supported operators

`=`&emsp;&nbsp;&thinsp;equal to  
`<>`&emsp;not equal to  
`!=`&emsp;not equal to  
`>`&emsp;&nbsp;&thinsp;greater than  
`>=`&emsp;greater than or equal to  
`<`&emsp;&nbsp;&thinsp;less than  
`<=`&emsp;less than or equal to  

#### duration_literal

`u`&emsp;microseconds  
`ms`&nbsp;&nbsp;milliseconds  
`s`&emsp;seconds  
`m`&emsp;minutes  
`h`&emsp;hours  
`d`&emsp;days  
`w`&emsp;weeks

### Examples

#### Example 1: Specify a time range with relative time
```
> SELECT "water_level" FROM "h2o_feet" WHERE time > now() - 1h
```

The query returns data with timestamps that occur within the past hour.
The whitespace between `-` and `1h` is required.

#### Example 2: Specify a time range with absolute time and relative time
```
> SELECT "level description" FROM "h2o_feet" WHERE time > '2015-09-18T21:18:00Z' AND time < now() + 1000d

name: h2o_feet
time                   level description
----                   -----------------
2015-09-18T21:24:00Z   between 3 and 6 feet
2015-09-18T21:30:00Z   between 3 and 6 feet
2015-09-18T21:36:00Z   between 3 and 6 feet
2015-09-18T21:42:00Z   between 3 and 6 feet
```

The query returns data with timestamps that occur between September 18, 2015
at 21:18:00 and 1000 days from `now()`.
The whitespace between `+` and `1000d` is required.

## Common Issues with Time Syntax

### Issue 1: Querying data that occur after `now()`

By default, InfluxDB uses [`now()`](/influxdb/v1.0/concepts/glossary/#now) as
the upper bound on a query's time range.
The `WHERE` clause must provide an alternative upper bound to query data with
timestamps that occur after `now()`.

#### Examples

Select everything from the `h2o_feet` measurement between
`1677-09-21 00:12:43.145224194` (the [minimum possible timestamp](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store)) and `now()`.
Note that InfluxDB only returns points where the `water_level` field has
data.
```
> SELECT "water_level" FROM "h2o_feet"
```

Select everything from the `h2o_feet` measurement between
`1677-09-21 00:12:43.145224194` and 1000 days after `now()`:
```
> SELECT "water_level" FROM "h2o_feet" WHERE time < now() + 1000d
```

Note that the `WHERE` clause must provide an alternative **upper** bound to override
the default `now()` upper bound.
The following query merely resets the lower bound to `now()` such that the query's time
range is between `now()` and `now()`:
```
> SELECT "water_level" FROM "h2o_feet" WHERE time > now()
```

### Issue 2: Using `OR` with absolute time

Currently, InfluxDB does not support using `OR` with absolute time
in the `WHERE` clause.

See the [Frequently Asked Questions](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
document for more information.

### Issue 3: Configuring the returned timestamps

The [CLI](/influxdb/v1.0/tools/shell/) returns timestamps in
nanosecond epoch format by default.
Specify alternative formats with the
[`precision <format>` command](/influxdb/v1.0/tools/shell/#influx-commands).
The [HTTP API](/influxdb/v1.0/tools/api/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the
[`epoch` query string parameter](/influxdb/v1.0/tools/api/#query-string-parameters).

<br>
<br>
# Regular Expressions in Queries

InfluxQL supports using regular expressions when specifying
[measurements](/influxdb/v1.0/concepts/glossary/#measurement) in the
[`FROM` clause](#the-from-clause)
, [tag values](/influxdb/v1.0/concepts/glossary/#tag-value) in the
[`WHERE` clause](#the-where-clause),
and string [field values](/influxdb/v1.0/concepts/glossary/#field-value)
in the [`WHERE` clause](#the-where-clause).
Currently, InfluxQL does not support using regular expressions to match
[databases](/influxdb/v1.0/concepts/glossary/#database),
[retention polices](/influxdb/v1.0/concepts/glossary/#retention-policy-rp), and
non-string [fields](/influxdb/v1.0/concepts/glossary/#field).

Regular expression comparisons are more computationally intensive than exact
string comparisons and thus queries with regular expressions are not as performant
as those without.

### Syntax
```
SELECT_clause FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/]
```

### Description of Syntax

Regular expressions are surrounded by `/` characters and use
[Golang's regular expression syntax](http://golang.org/pkg/regexp/syntax/).

Supported operators:  
`=~`&emsp;matches against  
`!~`&emsp;doesn't match against

### Examples

#### Example 1: Use a regular expression to specify measurements
```
> SELECT MEAN("degrees") FROM /temperature/

name: average_temperature
time			mean
----			----
1970-01-01T00:00:00Z   79.98472932232272

name: h2o_temperature
time			mean
----			----
1970-01-01T00:00:00Z   64.98872722506226
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `degrees` for every [measurement](/influxdb/v1.0/concepts/glossary#measurement) in the `NOAA_water_database`
[database](/influxdb/v1.0/concepts/glossary#database) that contains the word `temperature`.

#### Example 2: Use a regular expression to specify tag values

```
> SELECT MEAN(water_level) FROM "h2o_feet" WHERE "location" =~ /[m]/ AND "water_level" > 3

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.47155532049926
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level` where the [tag value](/influxdb/v1.0/concepts/glossary#tag-value) of `location`
includes an `m` and `water_level` is greater than three.

#### Example 3: Use a regular expression to specify a tag with no value

```
> SELECT * FROM "h2o_feet" WHERE "location" !~ /./
>
```

The query selects all data from the `h2o_feet` measurement where the `location`
[tag](/influxdb/v1.0/concepts/glossary#tag) has no value.
Every data [point](/influxdb/v1.0/concepts/glossary#point) in the `NOAA_water_database` has a tag value for `location`.

It's possible to perform this same query without a regular expression.
See the
[Frequently Asked Questions](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#how-do-i-select-data-with-a-tag-that-has-no-value)
document for more information.

#### Example 4: Use a regular expression to specify a tag with a value

```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" =~ /./

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.442107025822523
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level` across all data that have a tag value for
`location`.

#### Example 5: Use a regular expression to specify a field value
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND "level description" =~ /between/

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.47155532049926
```

The query uses an InfluxQL [function](/influxdb/v1.0/query_language/functions/)
to calculate the average `water_level` for all data where the field value of
`level description` includes the word `between`.

<br>
<br>
# Data Types and Cast Operations in Queries

The [`SELECT` clause](#the-basic-select-statement) supports specifying a [field's](/influxdb/v1.0/concepts/glossary/#field) type and basic cast
operations with the `::` syntax.

<table style="width:100%">
  <tr>
    <td><a href="#data-types">Data Types</a></td>
    <td><a href="#cast-operations">Cast Operations</a></td>
  </tr>
</table>

## Data types

[Field values](/influxdb/v1.0/concepts/glossary/#field-value) can be floats, integers, strings, or booleans.
The `::` syntax allows users to specify the field's type in a query.

> **Note:**  Generally, it is not necessary to specify the field value
type in the [`SELECT` clause](#the-basic-select-statement).
In most cases, InfluxDB rejects any writes that attempt to write a [field value](/influxdb/v1.0/concepts/glossary/#field-value)
to a field that previously accepted field values of a different type.
>
It is possible for field value types to differ across [shard groups](/influxdb/v1.0/concepts/glossary/#shard-group).
In these cases, it may be necessary to specify the field value type in the
`SELECT` clause.
Please see the
[Frequently Asked Questions](/influxdb/v1.0/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
document for more information on how InfluxDB handles field value type discrepancies.

### Syntax
```
SELECT_clause <field_key>::<type> FROM_clause
```

### Description of syntax.

`type` can be `float`, `integer`, `string`, or `boolean`.
In most cases, InfluxDB returns no data if the `field_key` does not store data of the specified
`type`. See [Cast Operations](#cast-operations) for more information.

### Example
```
> SELECT "water_level"::float FROM "h2o_feet" LIMIT 4

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8.12
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   8.005
2015-08-18T00:06:00Z   2.116
```

The query returns values of the `water_level` field key that are floats.

## Cast Operations

The `::` syntax allows users to perform basic cast operations in queries.
Currently, InfluxDB supports casting [field values](/influxdb/v1.0/concepts/glossary/#field-value) from integers to
floats or from floats to integers.

### Syntax
```
SELECT_clause <field_key>::<type> FROM_clause
```

### Description of Syntax

`type` can be `float` or `integer`.

InfluxDB returns no data if the query attempts to cast an integer or float to a
string or boolean.

### Examples

#### Example 1: Cast float field values to integers

```
> SELECT "water_level"::integer FROM "h2o_feet" LIMIT 4

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8
2015-08-18T00:00:00Z   2
2015-08-18T00:06:00Z   8
2015-08-18T00:06:00Z   2
```

The query returns the integer form of `water_level`'s float [field values](/influxdb/v1.0/concepts/glossary/#field-value).

#### Example 2: Cast float field values to strings (this functionality is not supported)

```
> SELECT "water_level"::string FROM "h2o_feet" LIMIT 4
>
```

The query returns no data as casting a float field value to a string is not
yet supported.

<br>
<br>
# Merge Series in Queries
In InfluxDB, queries merge [series](/influxdb/v1.0/concepts/glossary/#series)
automatically.

### Example

The `h2o_feet` [measurement](/influxdb/v1.0/concepts/glossary/#measurement) in the `NOAA_water_database` is part of two [series](/influxdb/v1.0/concepts/glossary/#series).
The first series is made up of the `h2o_feet` measurement and the `location = coyote_creek` [tag](/influxdb/v1.0/concepts/glossary/#tag).
The second series is made of up the `h2o_feet` measurement and the `location = santa_monica` tag.

The following query automatically merges those two series when it calculates the [average](/influxdb/v1.0/query_language/functions/#mean) `water_level`:

```
> SELECT MEAN("water_level") FROM "h2o_feet"

name: h2o_feet
--------------
time                   mean
1970-01-01T00:00:00Z   4.442107025822521
```

If you want the average `water_level` for the first series only, specify the relevant tag in the [`WHERE` clause](#the-where-clause):
```
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek'

name: h2o_feet
--------------
time                   mean
1970-01-01T00:00:00Z   5.359342451341401
```

If you want the average `water_level` for each individual series, include a [`GROUP BY` clause](#group-by-tags):

```
> SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
1970-01-01T00:00:00Z   5.359342451341401

name: h2o_feet
tags: location=santa_monica
time                   mean
----                   ----
1970-01-01T00:00:00Z   3.530863470081006
```

<br>
<br>
# Multiple Statements in Queries
Separate multiple [`SELECT` statements](#the-basic-select-statement) in a query with a semicolon (`;`).

### Examples:

{{< vertical-tabs >}}
{{% tabs %}}
[Example 1: CLI](#)
[Example 2: HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

In InfluxDB's [CLI](/influxdb/v1.0/tools/shell/):

```
> SELECT MEAN("water_level") FROM "h2o_feet"; SELECT "water_level" FROM "h2o_feet" LIMIT 2

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.442107025822522

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   8.12
2015-08-18T00:00:00Z   2.064
```

{{% /tab-content %}}

{{% tab-content %}}

With InfluxDB's [HTTP API](/influxdb/v1.0/tools/api/):

```
~# curl -G 'http://localhost:8086/query?db=NOAA_water_database' --data-urlencode 'q=SELECT MEAN("water_level") FROM "h2o_feet"; SELECT "water_level" FROM "h2o_feet" LIMIT 2'

{
    "results": [
        {
            "series": [
                {
                    "name": "h2o_feet",
                    "columns": [
                        "time",
                        "mean"
                    ],
                    "values": [
                        [
                            "1970-01-01T00:00:00Z",
                            4.442107025822521
                        ]
                    ]
                }
            ]
        },
        {
            "series": [
                {
                    "name": "h2o_feet",
                    "columns": [
                        "time",
                        "water_level"
                    ],
                    "values": [
                        [
                            "2015-08-18T00:00:00Z",
                            8.12
                        ],
                        [
                            "2015-08-18T00:00:00Z",
                            2.064
                        ]
                    ]
                }
            ]
        }
    ]
}
```

{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /vertical-tabs >}}
