---
title: Schema Exploration
menu:
  influxdb_1_2:
    weight: 20
    parent: query_language
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections cover useful query syntax for exploring your [schema](/influxdb/v1.2/concepts/glossary/#schema).

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
    <td></td>
    <td></td>
  </tr>
</table>

**Sample data**

The data used in this document are available for download on the [Sample Data](/influxdb/v1.2/query_language/data_download/) page.

Before proceeding, login to the Influx CLI.

```bash
$ influx -precision rfc3339 
Connected to http://localhost:8086 version 1.2.x
InfluxDB shell 1.2.x
>
```

## `SHOW DATABASES`
Returns a list of all [databases](/influxdb/v1.2/concepts/glossary/#database) on your instance.

### Syntax

```
SHOW DATABASES
```

### Examples

#### Example 1: Run a `SHOW DATABASES` query
```
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
Returns a list of [retention policies](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) for the specified [database](/influxdb/v1.2/concepts/glossary/#database).

### Syntax
```
SHOW RETENTION POLICIES [ON <database_name>]
```

### Description of Syntax
`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

### Examples

#### Example 1: Run a `SHOW RETENTION POLICIES` query with the `ON` clause

```
> SHOW RETENTION POLICIES ON NOAA_water_database

name      duration   shardGroupDuration   replicaN   default
----      --------   ------------------   --------   -------
autogen   0s         168h0m0s             1          true
```

The query returns the list of retention policies in the `NOAA_water_database`
database in tabular format.
The database has one retention policy called `autogen`.
The `autogen` retention policy has an infinite [duration](/influxdb/v1.2/concepts/glossary/#duration),
a seven-day [shard group duration](/influxdb/v1.2/concepts/glossary/#shard-group),
a [replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor)
of one, and it is the `DEFAULT` retention policy for the database.

#### Example 2: Run a `SHOW RETENTION POLICIES` query without the `ON` clause

{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
```
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
{{< /vertical-tabs >}}

## `SHOW SERIES`
Returns a list of [series](/influxdb/v1.2/concepts/glossary/#series) for
the specified [database](/influxdb/v1.2/concepts/glossary/#database).

### Syntax
```
SHOW SERIES [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> [ '<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax
`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

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
[`FROM` clause](/influxdb/v1.2/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.2/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.2/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.2/query_language/data_exploration/#regular-expressions).

### Examples

#### Example 1: Run a `SHOW SERIES` query with the `ON` clause

```
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

The query's output is similar to the [line protocol](/influxdb/v1.2/concepts/glossary/#line-protocol) format.
Everything before the first comma is the [measurement](/influxdb/v1.2/concepts/glossary/#measurement) name.
Everything after the first comma is either a [tag key](/influxdb/v1.2/concepts/glossary/#tag-key) or a [tag value](/influxdb/v1.2/concepts/glossary/#tag-value).
The `NOAA_water_database` has five different measurements and 14 different series.

#### Example 2: Run a `SHOW SERIES` query without the `ON` clause

{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
```
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
{{< /vertical-tabs >}}

#### Example 3: Run a `SHOW SERIES` query with several clauses

```
> SHOW SERIES ON NOAA_water_database FROM "h2o_quality" WHERE "location" = 'coyote_creek' LIMIT 2

key
---
h2o_quality,location=coyote_creek,randtag=1
h2o_quality,location=coyote_creek,randtag=2
```

The query returns all series in the `NOAA_water_database` database that are
associated with the `h2o_quality` measurement and the tag `location = coyote_creek`.
The `LIMIT` clause limits the number of series returned to two.

## `SHOW MEASUREMENTS`
Returns a list of [measurements](/influxdb/v1.2/concepts/glossary/#measurement)
for the specified [database](/influxdb/v1.2/concepts/glossary/#database).

### Syntax
```
SHOW MEASUREMENTS [ON <database_name>] [WITH MEASUREMENT <regular_expression>] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax
`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

The `WITH`, `WHERE`, `LIMIT` and `OFFSET` clauses are optional.
The `WHERE` clause supports tag comparisons; field comparisons are not
valid for the `SHOW SERIES` query.

Supported operators in the `WHERE` clause:  
`=`&emsp;&nbsp;&thinsp;equal to  
`<>`&emsp;not equal to  
`!=`&emsp;not equal to  
`=~`&emsp;matches against  
`!~`&emsp;doesn't match against

See the Data Exploration page for documentation on the
[`LIMIT` clause](/influxdb/v1.2/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.2/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.2/query_language/data_exploration/#regular-expressions).

### Examples

#### Example 1: Run a `SHOW MEASUREMENTS` query with the `ON` clause
```
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

#### Example 2: Run a `SHOW MEASUREMENTS` query without the `ON` clause

{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
{{< /vertical-tabs >}}

#### Example 3: Run a `SHOW MEASUREMENTS` query with several clauses (i)
```
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

#### Example 4: Run a `SHOW MEASUREMENTS` query with several clauses (ii)

```
> SHOW MEASUREMENTS ON NOAA_water_database WITH MEASUREMENT =~ /h2o.*/ WHERE "randtag"  =~ /\d/

name: measurements
name
----
h2o_quality
```

The query returns all measurements in the `NOAA_water_database` that start
with `h2o` and have values for the tag key `randtag` that include an integer.

## `SHOW TAG KEYS`
Returns a list of [tag keys](/influxdb/v1.2/concepts/glossary/#tag-key)
associated with the specified [database](/influxdb/v1.2/concepts/glossary/#database).

### Syntax
```
SHOW TAG KEYS [ON <database_name>] [FROM_clause] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax

`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

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
[`FROM` clause](/influxdb/v1.2/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.2/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.2/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.2/query_language/data_exploration/#regular-expressions).

### Examples

#### Example 1: Run a `SHOW TAG KEYS` query with the `ON` clause
```
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

#### Example 2: Run a `SHOW TAG KEYS` query without the `ON` clause

{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
```
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
{{< /vertical-tabs >}}


#### Example 3: Run a `SHOW TAG KEYS` query with several clauses
```
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
Returns the list of [tag values](/influxdb/v1.2/concepts/glossary/#tag-value)
for the specified [tag key(s)](/influxdb/v1.2/concepts/glossary/#tag-key) in the database.

### Syntax
```
SHOW TAG VALUES [ON <database_name>][FROM_clause] WITH KEY [ [<operator> "<tag_key>" | <regular_expression>] | [IN ("<tag_key1>","<tag_key2")]] [WHERE <tag_key> <operator> ['<tag_value>' | <regular_expression>]] [LIMIT_clause] [OFFSET_clause]
```

### Description of Syntax
`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

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
[`FROM` clause](/influxdb/v1.2/query_language/data_exploration/#the-basic-select-statement),
[`LIMIT` clause](/influxdb/v1.2/query_language/data_exploration/#the-limit-clause),
[`OFFSET` clause](/influxdb/v1.2/query_language/data_exploration/#the-offset-clause),
and on [Regular Expressions in Queries](/influxdb/v1.2/query_language/data_exploration/#regular-expressions).

### Examples

#### Example 1: Run a `SHOW TAG VALUES` query with the `ON` clause
```
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

#### Example 2: Run a `SHOW TAG VALUES` query without the `ON` clause

{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
```
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
{{< /vertical-tabs >}}

#### Example 3: Run a `SHOW TAG VALUES` query with several clauses
```
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
Returns the [field keys](/influxdb/v1.2/concepts/glossary/#field-key) and the
[data type](/influxdb/v1.2/write_protocols/line_protocol_reference/#data-types) of their
[field values](/influxdb/v1.2/concepts/glossary/#field-value).

### Syntax
```
SHOW FIELD KEYS [ON <database_name>] [FROM <measurement_name>]
```

### Description of Syntax
`ON <database_name>` is optional.
If the query does not include `ON <database_name>`, you must specify the
database with `USE <database_name>` in the [CLI](/influxdb/v1.2/tools/shell/) or with the `db` query
string parameter in the [HTTP API](/influxdb/v1.2/tools/api/#query-string-parameters) request.

The `FROM` clause is also optional.
See the Data Exploration page for documentation on the
[`FROM` clause](/influxdb/v1.2/query_language/data_exploration/#the-basic-select-statement).

> **Note:** A field's data type [can differ](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards) across
[shards](/influxdb/v1.2/concepts/glossary/#shard).
If your field has more than one type, `SHOW FIELD KEYS` returns the type that
occurs first in the following list: float, integer, string, boolean.

### Examples

#### Example 1: Run a `SHOW FIELD KEYS` query with the `ON` clause
```
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

#### Example 2: Run a `SHOW FIELD KEYS` query without the `ON` clause
{{< vertical-tabs >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

Specify the database with `USE <database_name>`
```
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
```
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
{{< /vertical-tabs >}}


#### Example 3: Run a `SHOW FIELD KEYS` query with the `FROM` clause
```
> SHOW FIELD KEYS ON "NOAA_water_database" FROM "h2o_feet"

name: h2o_feet
fieldKey            fieldType
--------            ---------
level description   string
water_level         float
```

The query returns the fields keys and field value data types for the `h2o_feet`
measurement in the `NOAA_water_database` database.

### Common Issues with SHOW FIELD KEYS

#### Issue 1: SHOW FIELD KEYS and field type discrepancies
Field value
[data types](/influxdb/v1.2/write_protocols/line_protocol_reference/#data-types)
cannot differ within a [shard](/influxdb/v1.2/concepts/glossary/#shard) but they
can differ across shards.
`SHOW FIELD KEYS` returns every data type, across every shard, associated with
the field key.

##### Example
<br>
The `all_the_types` field stores four different data types:

```
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
See the
[FAQ](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
page for more information.
