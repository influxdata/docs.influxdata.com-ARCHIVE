---
title: Explore your schema using InfluxQL
menu:
  influxdb_1_8:
    name: Explore your schema
    weight: 30
    parent: InfluxQL
aliases:
  - /influxdb/v1.8/query_language/schema_exploration/
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections cover useful query syntax for exploring your [schema](/influxdb/v1.8/concepts/glossary/#schema).

<table style="width:100%">
  <tr>
    <td><a href="#show-databases">SHOW DATABASES</a></td>
    <td><a href="#show-retention-policies">SHOW RETENTION POLICIES</a></td>
    <td><a href="#show-series">SHOW SERIES</a></td>
  </tr>
  <tr>
    <td><a href="#show-measurements">SHOW MEASUREMENTS</a></td>
    <td><a href="#show-tag-keys">SHOW TAG KEYS</a></td>
    <td><a href="#show-tag-values">SHOW TAG VALUES</a></td>
  </tr>
  <tr>
    <td><a href="#show-field-keys">SHOW FIELD KEYS</a></td>
    <td><a href="#filter-meta-queries-by-time">Filter meta queries by time</a></td>
    <td></td>
  </tr>
</table>

**Sample data**

The data used in this document are available for download on the [Sample Data](/influxdb/v1.8/query_language/data_download/) page.

Before proceeding, login to the Influx CLI.

```bash
$ influx -precision rfc3339
Connected to http://localhost:8086 version 1.4.x
InfluxDB shell 1.4.x
>
```

## `SHOW DATABASES`
Returns a list of all [databases](/influxdb/v1.8/concepts/glossary/#database) on your instance.

### Syntax

```sql
SHOW DATABASES
```

### Examples

#### Run a `SHOW DATABASES` query

```sql
> SHOW DATABASES

name: databases
name
----
NOAA_water_database
_internal
```

The query returns database names in a tabular format.
This InfluxDB instance has two databases: `NOAA_water_database` and `_internal`.

## `SHOW RETENTION POLICIES`

Returns a list of [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp) for the specified [database](/influxdb/v1.8/concepts/glossary/#database).

### Syntax

```sql
SHOW RETENTION POLICIES [ON <database_name>]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query
string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

### Examples

#### Run a `SHOW RETENTION POLICIES` query with the `ON` clause

```sql
> SHOW RETENTION POLICIES ON NOAA_water_database

name      duration   shardGroupDuration   replicaN   default
----      --------   ------------------   --------   -------
autogen   0s         168h0m0s             1          true
```

The query returns the list of retention policies in the `NOAA_water_database`
database in tabular format.
The database has one retention policy called `autogen`.
The `autogen` retention policy has an infinite [duration](/influxdb/v1.8/concepts/glossary/#duration),
a seven-day [shard group duration](/influxdb/v1.8/concepts/glossary/#shard-group),
a [replication factor](/influxdb/v1.8/concepts/glossary/#replication-factor)
of one, and it is the `DEFAULT` retention policy for the database.

#### Run a `SHOW RETENTION POLICIES` query without the `ON` clause

{{< tab-labels >}}
  {{% tabs %}}
  [CLI](#)
  [InfluxDB API](#)
  {{% /tabs %}}
{{< /tab-labels >}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW RETENTION POLICIES

name      duration   shardGroupDuration   replicaN   default
----      --------   ------------------   --------   -------
autogen   0s         168h0m0s             1          true
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```bash
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode "q=SHOW RETENTION POLICIES"

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "columns": [
                        "name",
                        "duration",
                        "shardGroupDuration",
                        "replicaN",
                        "default"
                    ],
                    "values": [
                        [
                            "autogen",
                            "0s",
                            "168h0m0s",
                            1,
                            true
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

## `SHOW SERIES`

Returns a list of [series](/influxdb/v1.8/concepts/glossary/#series) for
the specified [database](/influxdb/v1.8/concepts/glossary/#database).

### Syntax

```sql
SHOW SERIES [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> [ '<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query
string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW SERIES` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v1.8/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.8/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.8/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.8/query_language/data_exploration/#regular-expressions).

### Examples

#### Run a `SHOW SERIES` query with the `ON` clause

```sql
// Returns series for all shards in the database
> SHOW SERIES ON NOAA_water_database

key
---
average_temperature,location=coyote_creek
average_temperature,location=santa_monica
h2o_feet,location=coyote_creek
h2o_feet,location=santa_monica
h2o_pH,location=coyote_creek
h2o_pH,location=santa_monica
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_quality,location=santa_monica,randtag=1
h2o_quality,location=santa_monica,randtag=2
h2o_quality,location=santa_monica,randtag=3
h2o_temperature,location=coyote_creek
h2o_temperature,location=santa_monica
```

The query's output is similar to the [line protocol](/influxdb/v1.8/concepts/glossary/#influxdb-line-protocol) format.
Everything before the first comma is the [measurement](/influxdb/v1.8/concepts/glossary/#measurement) name.
Everything after the first comma is either a [tag key](/influxdb/v1.8/concepts/glossary/#tag-key) or a [tag value](/influxdb/v1.8/concepts/glossary/#tag-value).
The `NOAA_water_database` has five different measurements and 14 different series.

#### Run a `SHOW SERIES` query without the `ON` clause

{{< tab-labels >}}
  {{% tabs %}}
  [CLI](#)
  [InfluxDB API](#)
  {{% /tabs %}}
{{< /tab-labels >}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW SERIES

key
---
average_temperature,location=coyote_creek
average_temperature,location=santa_monica
h2o_feet,location=coyote_creek
h2o_feet,location=santa_monica
h2o_pH,location=coyote_creek
h2o_pH,location=santa_monica
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_quality,location=santa_monica,randtag=1
h2o_quality,location=santa_monica,randtag=2
h2o_quality,location=santa_monica,randtag=3
h2o_temperature,location=coyote_creek
h2o_temperature,location=santa_monica
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```bash
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode "q=SHOW SERIES"

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "columns": [
                        "key"
                    ],
                    "values": [
                        [
                            "average_temperature,location=coyote_creek"
                        ],
                        [
                            "average_temperature,location=santa_monica"
                        ],
                        [
                            "h2o_feet,location=coyote_creek"
                        ],
                        [
                            "h2o_feet,location=santa_monica"
                        ],
                        [
                            "h2o_pH,location=coyote_creek"
                        ],
                        [
                            "h2o_pH,location=santa_monica"
                        ],
                        [
                            "h2o_quality,location=coyote_creek,randtag=1"
                        ],
                        [
                            "h2o_quality,location=coyote_creek,randtag=2"
                        ],
                        [
                            "h2o_quality,location=coyote_creek,randtag=3"
                        ],
                        [
                            "h2o_quality,location=santa_monica,randtag=1"
                        ],
                        [
                            "h2o_quality,location=santa_monica,randtag=2"
                        ],
                        [
                            "h2o_quality,location=santa_monica,randtag=3"
                        ],
                        [
                            "h2o_temperature,location=coyote_creek"
                        ],
                        [
                            "h2o_temperature,location=santa_monica"
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

#### Run a `SHOW SERIES` query with several clauses

```sql
> SHOW SERIES ON NOAA_water_database FROM "h2o_quality" WHERE "location" = 'coyote_creek' LIMIT 2

key
---
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
```

The query returns all series in the `NOAA_water_database` database that are
associated with the `h2o_quality` measurement and the tag `location = coyote_creek`.
The `LIMIT` clause limits the number of series returned to two.

#### Run a `SHOW SERIES` query limited by time

Limit series returned within a specified shard group duration.

```sql
// Returns all series in the current shard.
> SHOW SERIES ON NOAA_water_database WHERE time < now() - 1m

key
---
average_temperature,location=coyote_creek
h2o_feet,location=coyote_creek
h2o_pH,location=coyote_creek
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_temperature,location=coyote_creek
```

The query above returns all series in the `NOAA_water_database` database in the current shard group. The `WHERE` clause limits results to series in the shard group that contain a timestamp in the last minute. Note, if a shard group duration is 7 days, results returned may be up to 7 days old.

```sql
// Returns all series in shard groups that contain a timestamp in the last 28 days.
> SHOW SERIES ON NOAA_water_database WHERE time < now() - 28d

key
---
average_temperature,location=coyote_creek
average_temperature,location=santa_monica
h2o_feet,location=coyote_creek
h2o_feet,location=santa_monica
h2o_pH,location=coyote_creek
h2o_pH,location=santa_monica
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
h2o_quality,location=coyote_creek,randtag=3
h2o_quality,location=santa_monica,randtag=1
h2o_quality,location=santa_monica,randtag=2
h2o_quality,location=santa_monica,randtag=3
h2o_temperature,location=coyote_creek
h2o_temperature,location=santa_monica
```

Note, if the specified shard group duration is 7 days, the query above returns series for the last 3 or 4 shards.

## `SHOW MEASUREMENTS`

Returns a list of [measurements](/influxdb/v1.8/concepts/glossary/#measurement)
for the specified [database](/influxdb/v1.8/concepts/glossary/#database).

### Syntax

```sql
SHOW MEASUREMENTS [ON <database_name>] [WITH MEASUREMENT <operator> ['<measurement_name>' | <regular_expression>]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query
string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The `WITH`, `WHERE`, `LIMIT` and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not valid for the `SHOW MEASUREMENTS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`LIMIT` clause](/influxdb/v1.8/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.8/query_language/data_exploration/#the-offset-clause),
and on [Regular expressions in queries](/influxdb/v1.8/query_language/data_exploration/#regular-expressions).

### Examples

#### Run a `SHOW MEASUREMENTS` query with the `ON` clause

```sql
> SHOW MEASUREMENTS ON NOAA_water_database

name: measurements
name
----
average_temperature
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

The query returns the list of measurements in the `NOAA_water_database`
database.
The database has five measurements: `average_temperature`, `h2o_feet`,
`h2o_pH`, `h2o_quality`, and `h2o_temperature`.

#### Run a `SHOW MEASUREMENTS` query without the `ON` clause

{{< tab-labels >}}
  {{% tabs %}}
  [CLI](#)
  [InfluxDB API](#)
  {{% /tabs %}}
{{< /tab-labels >}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW MEASUREMENTS
name: measurements
name
----
average_temperature
h2o_feet
h2o_pH
h2o_quality
h2o_temperature
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:
```
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode "q=SHOW MEASUREMENTS"

{
  {
      "results": [
          {
              "statement_id": 0,
              "series": [
                  {
                      "name": "measurements",
                      "columns": [
                          "name"
                      ],
                      "values": [
                          [
                              "average_temperature"
                          ],
                          [
                              "h2o_feet"
                          ],
                          [
                              "h2o_pH"
                          ],
                          [
                              "h2o_quality"
                          ],
                          [
                              "h2o_temperature"
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

#### Run a `SHOW MEASUREMENTS` query with several clauses (i)

```sql
> SHOW MEASUREMENTS ON NOAA_water_database WITH MEASUREMENT =~ /h2o.*/ LIMIT 2 OFFSET 1

name: measurements
name
----
h2o_pH
h2o_quality
```

The query returns the measurements in the `NOAA_water_database` database that
start with `h2o`.
The `LIMIT` and `OFFSET` clauses limit the number of measurement names returned to
two and offset the results by one, skipping the `h2o_feet` measurement.

#### Run a `SHOW MEASUREMENTS` query with several clauses (ii)

```sql
> SHOW MEASUREMENTS ON NOAA_water_database WITH MEASUREMENT =~ /h2o.*/ WHERE "randtag"  =~ /\d/

name: measurements
name
----
h2o_quality
```

The query returns all measurements in the `NOAA_water_database` that start
with `h2o` and have values for the tag key `randtag` that include an integer.

## `SHOW TAG KEYS`

Returns a list of [tag keys](/influxdb/v1.8/concepts/glossary/#tag-key)
associated with the specified [database](/influxdb/v1.8/concepts/glossary/#database).

### Syntax

```sql
SHOW TAG KEYS [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query
string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The `FROM` clause and the `WHERE` clause are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW TAG KEYS` query.

Supported operators in the `WHERE` clause:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v1.8/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.8/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.8/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.8/query_language/data_exploration/#regular-expressions).

### Examples

#### Run a `SHOW TAG KEYS` query with the `ON` clause

```sql
> SHOW TAG KEYS ON "NOAA_water_database"

name: average_temperature
tagKey
------
location

name: h2o_feet
tagKey
------
location

name: h2o_pH
tagKey
------
location

name: h2o_quality
tagKey
------
location
randtag

name: h2o_temperature
tagKey
------
location
```

The query returns the list of tag keys in the `NOAA_water_database` database.
The output groups tag keys by measurement name;
it shows that every measurement has the `location` tag key and that the
`h2o_quality` measurement has an additional `randtag` tag key.

#### Run a `SHOW TAG KEYS` query without the `ON` clause

{{< tab-labels >}}
{{% tabs %}}
[CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW TAG KEYS

name: average_temperature
tagKey
------
location

name: h2o_feet
tagKey
------
location

name: h2o_pH
tagKey
------
location

name: h2o_quality
tagKey
------
location
randtag

name: h2o_temperature
tagKey
------
location
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```sql
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode "q=SHOW TAG KEYS"

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "average_temperature",
                    "columns": [
                        "tagKey"
                    ],
                    "values": [
                        [
                            "location"
                        ]
                    ]
                },
                {
                    "name": "h2o_feet",
                    "columns": [
                        "tagKey"
                    ],
                    "values": [
                        [
                            "location"
                        ]
                    ]
                },
                {
                    "name": "h2o_pH",
                    "columns": [
                        "tagKey"
                    ],
                    "values": [
                        [
                            "location"
                        ]
                    ]
                },
                {
                    "name": "h2o_quality",
                    "columns": [
                        "tagKey"
                    ],
                    "values": [
                        [
                            "location"
                        ],
                        [
                            "randtag"
                        ]
                    ]
                },
                {
                    "name": "h2o_temperature",
                    "columns": [
                        "tagKey"
                    ],
                    "values": [
                        [
                            "location"
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
{{< /tab-labels >}}

#### Run a `SHOW TAG KEYS` query with several clauses

```sql
> SHOW TAG KEYS ON "NOAA_water_database" FROM "h2o_quality" LIMIT 1 OFFSET 1

name: h2o_quality
tagKey
------
randtag
```

The query returns tag keys from the `h2o_quality` measurement in the
`NOAA_water_database` database.
The `LIMIT` and `OFFSET` clauses limit the number of tag keys returned to one
and offsets the results by one.

## `SHOW TAG VALUES`

Returns the list of [tag values](/influxdb/v1.8/concepts/glossary/#tag-value)
for the specified [tag key(s)](/influxdb/v1.8/concepts/glossary/#tag-key) in the database.

### Syntax

```sql
SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The `WITH` clause is required.
It supports specifying a single tag key, a regular expression, and multiple tag keys.

The `FROM`, `WHERE`, `LIMIT`, and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW TAG KEYS` query.

Supported operators in the `WITH` and `WHERE` clauses:
`=`&emsp;&nbsp;&thinsp;equal to
`<>`&emsp;not equal to
`!=`&emsp;not equal to
`=~`&emsp;matches against
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v1.8/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.8/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.8/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.8/query_language/data_exploration/#regular-expressions).

### Examples

#### Run a `SHOW TAG VALUES` query with the `ON` clause

```sql
> SHOW TAG VALUES ON "NOAA_water_database" WITH KEY = "randtag"

name: h2o_quality
key       value
---       -----
randtag   1
randtag   2
randtag   3
```

The query returns all tag values of the `randtag` tag key in the `NOAA_water_database`
database.
`SHOW TAG VALUES` groups query results by measurement name.

#### Run a `SHOW TAG VALUES` query without the `ON` clause

{{< tab-labels >}}
  {{% tabs %}}
  [CLI](#)
  [InfluxDB API](#)
  {{% /tabs %}}
{{< /tab-labels >}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW TAG VALUES WITH KEY = "randtag"

name: h2o_quality
key       value
---       -----
randtag   1
randtag   2
randtag   3
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```bash
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode 'q=SHOW TAG VALUES WITH KEY = "randtag"'

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "h2o_quality",
                    "columns": [
                        "key",
                        "value"
                    ],
                    "values": [
                        [
                            "randtag",
                            "1"
                        ],
                        [
                            "randtag",
                            "2"
                        ],
                        [
                            "randtag",
                            "3"
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

#### Run a `SHOW TAG VALUES` query with several clauses

```sql
> SHOW TAG VALUES ON "NOAA_water_database" WITH KEY IN ("location","randtag") WHERE "randtag" =~ /./ LIMIT 3

name: h2o_quality
key        value
---        -----
location   coyote_creek
location   santa_monica
randtag	   1
```

The query returns the tag values of the tag keys `location` and `randtag` for
all measurements in the `NOAA_water_database` database where `randtag` has tag values.
The `LIMIT` clause limits the number of tag values returned to three.

## `SHOW FIELD KEYS`

Returns the [field keys](/influxdb/v1.8/concepts/glossary/#field-key) and the
[data type](/influxdb/v1.8/write_protocols/line_protocol_reference/#data-types) of their
[field values](/influxdb/v1.8/concepts/glossary/#field-value).

### Syntax

```sql
SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]
```

### Description of syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.8/tools/shell/) or with the `db` query
string parameter in the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The `FROM` clause is also optional.
See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v1.8/query_language/data_exploration/#the-basic-select-statement).

> **Note:** A field's data type [can differ](/influxdb/v1.8/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards) across
[shards](/influxdb/v1.8/concepts/glossary/#shard).
If your field has more than one type, `SHOW FIELD KEYS` returns the type that
occurs first in the following list: float, integer, string, boolean.

### Examples

#### Run a `SHOW FIELD KEYS` query with the `ON` clause

```sql
> SHOW FIELD KEYS ON "NOAA_water_database"

name: average_temperature
fieldKey            fieldType
--------            ---------
degrees             float

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float

name: h2o_pH
fieldKey            fieldType
--------            ---------
pH                  float

name: h2o_quality
fieldKey            fieldType
--------            ---------
index               float

name: h2o_temperature
fieldKey            fieldType
--------            ---------
degrees             float
```

The query returns the field keys and field value data types for each
measurement in the `NOAA_water_database` database.

#### Run a `SHOW FIELD KEYS` query without the `ON` clause

{{< tab-labels >}}
  {{% tabs %}}
  [CLI](#)
  [InfluxDB API](#)
  {{% /tabs %}}
{{< /tab-labels >}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`

```sql
> USE NOAA_water_database
Using database NOAA_water_database

> SHOW FIELD KEYS

name: average_temperature
fieldKey            fieldType
--------            ---------
degrees             float

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float

name: h2o_pH
fieldKey            fieldType
--------            ---------
pH                  float

name: h2o_quality
fieldKey            fieldType
--------            ---------
index               float

name: h2o_temperature
fieldKey            fieldType
--------            ---------
degrees             float
```

{{% /tab-content %}}

{{% tab-content %}}

Specify the database with the `db` query string parameter:

```bash
~# curl -G "http://localhost:8086/query?db=NOAA_water_database&pretty=true" --data-urlencode 'q=SHOW FIELD KEYS'

{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "average_temperature",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "degrees",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_feet",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "level description",
                            "string"
                        ],
                        [
                            "water_level",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_pH",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "pH",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_quality",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "index",
                            "float"
                        ]
                    ]
                },
                {
                    "name": "h2o_temperature",
                    "columns": [
                        "fieldKey",
                        "fieldType"
                    ],
                    "values": [
                        [
                            "degrees",
                            "float"
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


#### Run a `SHOW FIELD KEYS` query with the `FROM` clause

```sql
> SHOW FIELD KEYS ON "NOAA_water_database" FROM "h2o_feet"

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float
```

The query returns the fields keys and field value data types for the `h2o_feet`
measurement in the `NOAA_water_database` database.

### Common Issues with `SHOW FIELD KEYS`

#### SHOW FIELD KEYS and field type discrepancies

Field value
[data types](/influxdb/v1.8/write_protocols/line_protocol_reference/#data-types)
cannot differ within a [shard](/influxdb/v1.8/concepts/glossary/#shard) but they
can differ across shards.
`SHOW FIELD KEYS` returns every data type, across every shard, associated with
the field key.

##### Example

The `all_the_types` field stores four different data types:

```sql
> SHOW FIELD KEYS

name: mymeas
fieldKey        fieldType
--------        ---------
all_the_types   integer
all_the_types   float
all_the_types   string
all_the_types   boolean
```

Note that `SHOW FIELD KEYS` handles field type discrepancies differently from
`SELECT` statements.
For more information, see the
[How does InfluxDB handle field type discrepancies across shards?](/influxdb/v1.8/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards).

### Filter meta queries by time

When you filter meta queries by time, you may see results outside of your specified time. Meta query results are filtered at the shard level, so results can be approximately as granular as your shard group duration. If your time filter spans multiple shards, you'll get results from all shards with points in the specified time range. To review your shards and timestamps on points in the shard, run `SHOW SHARDS`. To learn more about shards and their duration, see [recommended shard groups durations](/influxdb/v1.8/concepts/schema_and_data_layout/#shard-group-duration-recommendations).

The example below shows how to filter `SHOW TAG KEYS` by approximately one hour using a 1h shard group duration. To filter other meta data, replace `SHOW TAG KEYS` with `SHOW TAG VALUES`, `SHOW SERIES`, `SHOW FIELD KEYS`, and so on.

> **Note:** `SHOW MEASUREMENTS` cannot be filtered by time.

#### Example filtering `SHOW TAG KEYS` by time

1. Specify a shard duration on a new database or [alter an existing shard duration](/influxdb/v1.8/query_language/database_management/#modify-retention-policies-with-alter-retention-policy). To specify a 1h shard duration when creating a new database, run the following command:

    ```sh
    > CREATE database mydb with duration 7d REPLICATION 1 SHARD DURATION 1h name myRP;
    ```

    > **Note:** The minimum shard duration is 1h.

2. Verify the shard duration has the correct time interval (precision) by running the `SHOW SHARDS` command. The example below shows a shard duration with an hour precision.

    ```sh
    > SHOW SHARDS
    name: mydb
    id database retention_policy shard_group start_time end_time expiry_time owners
    -- -------- ---------------- ----------- ---------- -------- ----------- ------
    > precision h
    ```  

3. (Optional) Insert sample tag keys. This step is for demonstration purposes. If you already have tag keys (or other meta data) to search for, skip this step.

    ```sh
    // Insert a sample tag called "test_key" into the "test" measurement, and then check the timestamp:
    > INSERT test,test_key=hello value=1

    > select * from test
    name: test
    time test_key value
    ---- -------- -----
    434820 hello 1

    // Add new tag keys with timestamps one, two, and three hours earlier:

    > INSERT test,test_key_1=hello value=1 434819
    > INSERT test,test_key_2=hello value=1 434819
    > INSERT test,test_key_3_=hello value=1 434818
    > INSERT test,test_key_4=hello value=1 434817
    > INSERT test,test_key_5_=hello value=1 434817
    ```

4. To find tag keys within a shard duration, run one of the following commands:

    `SHOW TAG KEYS ON database-name <WHERE time clause>` OR

    `SELECT * FROM measurement <WHERE time clause>`

    The examples below use test data from step 3.
    ```sh
    //Using data from Step 3, show tag keys between now and an hour ago
    > SHOW TAG KEYS ON mydb where time > now() -1h and time < now()
    name: test
    tagKey
    ------
    test_key
    test_key_1
    test_key_2

    // Find tag keys between one and two hours ago
    > SHOW TAG KEYS ON mydb where > time > now() -2h and time < now()-1h
    name: test
    tagKey
    ------
    test_key_1
    test_key_2
    test_key_3

    // Find tag keys between two and three hours ago
    > SHOW TAG KEYS ON mydb where > time > now() -3h and time < now()-2h
    name: test
    tagKey
    ------
    test_key_3
    test_key_4
    test_key_5

    // For a specified measurement, find tag keys in a given shard by specifying the time boundaries of the shard
    > SELECT * FROM test WHERE time >= '2019-08-09T00:00:00Z' and time < '2019-08-09T10:00:00Z'
    name: test
    time test_key_4 test_key_5 value
    ---- ------------ ------------ -----
    434817 hello 1
    434817 hello 1

    // For a specified database, find tag keys in a given shard by specifying the time boundaries of the shard
    > SHOW TAG KEYS ON mydb WHERE time >= '2019-08-09T00:00:00Z' and time < '2019-08-09T10:00:00Z'
    name: test
    tagKey
    ------
    test_key_4
    test_key_5
    ```
