---
title: Influx Query Language (InfluxQL) reference
menu:
  influxdb_1_6:
    name: InfluxQL reference
    weight: 90
    parent: InfluxQL
---

## Introduction

This is the reference for the Influx Query Language (InfluxQL).
If you're looking for less formal documentation, see the following:

* [Data exploration using InfluxQL](/influxdb/v1.6/query_language/data_exploration/)
* [Schema exploration using InfluxQL](/influxdb/v1.6/query_language/schema_exploration/)
* [Database management](/influxdb/v1.6/query_language/database_management/)
* [Authentication and authorization](/influxdb/v1.6/administration/authentication_and_authorization/).

InfluxQL is a SQL-like query language for interacting with InfluxDB.
It has been lovingly crafted to feel familiar to those coming from other SQL or SQL-like environments while providing features specific to storing and analyzing time series data.

Sections:

* [Notation](/influxdb/v1.6/query_language/spec/#notation)
* [Query representation](/influxdb/v1.6/query_language/spec/#query-representation)
* [Letters and digits](/influxdb/v1.6/query_language/spec/#letters-and-digits)
* [Identifiers](/influxdb/v1.6/query_language/spec/#identifiers)
* [Keywords](/influxdb/v1.6/query_language/spec/#keywords)
* [Literals](/influxdb/v1.6/query_language/spec/#literals)
* [Queries](/influxdb/v1.6/query_language/spec/#queries)
* [Statements](/influxdb/v1.6/query_language/spec/#statements)
* [Clauses](/influxdb/v1.6/query_language/spec/#clauses)
* [Expressions](/influxdb/v1.6/query_language/spec/#expressions)
* [Other](/influxdb/v1.6/query_language/spec/#other)
* [Query engine internals](/influxdb/v1.6/query_language/spec/#query-engine-internals)

## Notation

The syntax is specified using Extended Backus-Naur Form ("EBNF").
EBNF is the same notation used in the [Go](http://golang.org) programming language specification, which can be found [here](https://golang.org/ref/spec).
Not so coincidentally, InfluxDB is written in Go.

```
Production  = production_name "=" [ Expression ] "." .
Expression  = Alternative { "|" Alternative } .
Alternative = Term { Term } .
Term        = production_name | token [ "…" token ] | Group | Option | Repetition .
Group       = "(" Expression ")" .
Option      = "[" Expression "]" .
Repetition  = "{" Expression "}" .
```

Notation operators in order of increasing precedence:

```
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

## Query representation

### Characters

InfluxQL is Unicode text encoded in [UTF-8](http://en.wikipedia.org/wiki/UTF-8).

```
newline             = /* the Unicode code point U+000A */ .
unicode_char        = /* an arbitrary Unicode code point except newline */ .
```

## Letters and digits

Letters are the set of ASCII characters plus the underscore character _ (U+005F) is considered a letter.

Only decimal digits are supported.

```
letter              = ascii_letter | "_" .
ascii_letter        = "A" … "Z" | "a" … "z" .
digit               = "0" … "9" .
```

## Identifiers

Identifiers are tokens which refer to [database](/influxdb/v1.6/concepts/glossary/#database) names, [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) names, [user](/influxdb/v1.6/concepts/glossary/#user) names, [measurement](/influxdb/v1.6/concepts/glossary/#measurement) names, [tag keys](/influxdb/v1.6/concepts/glossary/#tag-key), and [field keys](/influxdb/v1.6/concepts/glossary/#field-key).

The rules:

- double quoted identifiers can contain any unicode character other than a new line
- double quoted identifiers can contain escaped `"` characters (i.e., `\"`)
- double quoted identifiers can contain InfluxQL [keywords](/influxdb/v1.6/query_language/spec/#keywords)
- unquoted identifiers must start with an upper or lowercase ASCII character or "_"
- unquoted identifiers may contain only ASCII letters, decimal digits, and "_"

```
identifier          = unquoted_identifier | quoted_identifier .
unquoted_identifier = ( letter ) { letter | digit } .
quoted_identifier   = `"` unicode_char { unicode_char } `"` .
```

#### Examples:

```
cpu
_cpu_stats
"1h"
"anything really"
"1_Crazy-1337.identifier>NAME👍"
```

## Keywords

```
ALL           ALTER         ANY           AS            ASC           BEGIN
BY            CREATE        CONTINUOUS    DATABASE      DATABASES     DEFAULT
DELETE        DESC          DESTINATIONS  DIAGNOSTICS   DISTINCT      DROP
DURATION      END           EVERY         EXPLAIN       FIELD         FOR
FROM          GRANT         GRANTS        GROUP         GROUPS        IN
INF           INSERT        INTO          KEY           KEYS          KILL
LIMIT         SHOW          MEASUREMENT   MEASUREMENTS  NAME          OFFSET
ON            ORDER         PASSWORD      POLICY        POLICIES      PRIVILEGES
QUERIES       QUERY         READ          REPLICATION   RESAMPLE      RETENTION
REVOKE        SELECT        SERIES        SET           SHARD         SHARDS
SLIMIT        SOFFSET       STATS         SUBSCRIPTION  SUBSCRIPTIONS TAG
TO            USER          USERS         VALUES        WHERE         WITH
WRITE
```

If you use an InfluxQL keywords as an
[identifier](/influxdb/v1.6/concepts/glossary/#identifier) you will need to
double quote that identifier in every query.

The keyword `time` is a special case.
`time` can be a
[continuous query](/influxdb/v1.6/concepts/glossary/#continuous-query-cq) name,
database name,
[measurement](/influxdb/v1.6/concepts/glossary/#measurement) name,
[retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) name,
[subscription](/influxdb/v1.6/concepts/glossary/#subscription) name, and
[user](/influxdb/v1.6/concepts/glossary/#user) name.
In those cases, `time` does not require double quotes in queries.
`time` cannot be a [field key](/influxdb/v1.6/concepts/glossary/#field-key) or
[tag key](/influxdb/v1.6/concepts/glossary/#tag-key);
InfluxDB rejects writes with `time` as a field key or tag key and returns an error.
See [Frequently Asked Questions](/influxdb/v1.6/troubleshooting/frequently-asked-questions/#time) for more information.

## Literals

### Integers

InfluxQL supports decimal integer literals.
Hexadecimal and octal literals are not currently supported.

```
int_lit             = ( "1" … "9" ) { digit } .
```

### Floats

InfluxQL supports floating-point literals.
Exponents are not currently supported.

```
float_lit           = int_lit "." int_lit .
```

### Strings

String literals must be surrounded by single quotes.
Strings may contain `'` characters as long as they are escaped (i.e., `\'`).

```
string_lit          = `'` { unicode_char } `'` .
```

### Durations

Duration literals specify a length of time.
An integer literal followed immediately (with no spaces) by a duration unit listed below is interpreted as a duration literal.
Durations can be specified with mixed units.

#### Duration units

| Units  | Meaning                                 |
| ------ | --------------------------------------- |
| ns     | nanoseconds (1 billionth of a second)   |
| u or µ | microseconds (1 millionth of a second)  |
| ms     | milliseconds (1 thousandth of a second) |
| s      | second                                  |
| m      | minute                                  |
| h      | hour                                    |
| d      | day                                     |
| w      | week                                    |


```
duration_lit        = int_lit duration_unit .
duration_unit       = "ns" | "u" | "µ" | "ms" | "s" | "m" | "h" | "d" | "w" .
```

### Dates & Times

The date and time literal format is not specified in EBNF like the rest of this document.
It is specified using Go's date / time parsing format, which is a reference date written in the format required by InfluxQL.
The reference date time is:

InfluxQL reference date time: January 2nd, 2006 at 3:04:05 PM

```
time_lit            = "2006-01-02 15:04:05.999999" | "2006-01-02" .
```

### Booleans

```
bool_lit            = TRUE | FALSE .
```

### Regular Expressions

```
regex_lit           = "/" { unicode_char } "/" .
```

**Comparators:**
`=~` matches against
`!~` doesn't match against

> **Note:** InfluxQL supports using regular expressions when specifying:
>
* [field keys](/influxdb/v1.6/concepts/glossary/#field-key) and [tag keys](/influxdb/v1.6/concepts/glossary/#tag-key) in the [`SELECT` clause](/influxdb/v1.6/query_language/data_exploration/#the-basic-select-statement)
* [measurements](/influxdb/v1.6/concepts/glossary/#measurement) in the [`FROM` clause](/influxdb/v1.6/query_language/data_exploration/#the-basic-select-statement)
* [tag values](/influxdb/v1.6/concepts/glossary/#tag-value) and string [field values](/influxdb/v1.6/concepts/glossary/#field-value) in the [`WHERE` clause](/influxdb/v1.6/query_language/data_exploration/#the-where-clause).
* [tag keys](/influxdb/v1.6/concepts/glossary/#tag-key) in the [`GROUP BY` clause](/influxdb/v1.6/query_language/data_exploration/#group-by-tags)
>
>Currently, InfluxQL does not support using regular expressions to match
>non-string field values in the
>`WHERE` clause,
>[databases](/influxdb/v1.6/concepts/glossary/#database), and
>[retention polices](/influxdb/v1.6/concepts/glossary/#retention-policy-rp).

## Queries

A query is composed of one or more statements separated by a semicolon.

```
query               = statement { ";" statement } .

statement           = alter_retention_policy_stmt |
                      create_continuous_query_stmt |
                      create_database_stmt |
                      create_retention_policy_stmt |
                      create_subscription_stmt |
                      create_user_stmt |
                      delete_stmt |
                      drop_continuous_query_stmt |
                      drop_database_stmt |
                      drop_measurement_stmt |
                      drop_retention_policy_stmt |
                      drop_series_stmt |
                      drop_shard_stmt |
                      drop_subscription_stmt |
                      drop_user_stmt |
                      explain_stmt |
                      explain_analyze_stmt |
                      grant_stmt |
                      kill_query_statement |
                      revoke_stmt |
                      select_stmt |
                      show_continuous_queries_stmt |
                      show_databases_stmt |
                      show_diagnostics_stmt |
                      show_field_key_cardinality_stmt |
                      show_field_keys_stmt |
                      show_grants_stmt |
                      show_measurement_cardinality_stmt |
                      show_measurement_exact_cardinality_stmt |
                      show_measurements_stmt |
                      show_queries_stmt |
                      show_retention_policies_stmt |
                      show_series_cardinality_stmt |
                      show_series_exact_cardinality_stmt |
                      show_series_stmt |
                      show_shard_groups_stmt |
                      show_shards_stmt |
                      show_stats_stmt |
                      show_subscriptions_stmt |
                      show_tag_key_cardinality_stmt |
                      show_tag_key_exact_cardinality_stmt |
                      show_tag_keys_stmt |
                      show_tag_values_stmt |
                      show_tag_values_cardinality_stmt |
                      show_users_stmt .
```

## Statements

### ALTER RETENTION POLICY

```
alter_retention_policy_stmt  = "ALTER RETENTION POLICY" policy_name on_clause
                               retention_policy_option
                               [ retention_policy_option ]
                               [ retention_policy_option ]
                               [ retention_policy_option ] .
```

#### Examples:

```sql
-- Set default retention policy for mydb to 1h.cpu.
ALTER RETENTION POLICY "1h.cpu" ON "mydb" DEFAULT

-- Change duration and replication factor.
-- REPLICATION (replication factor) not valid for OSS instances.
ALTER RETENTION POLICY "policy1" ON "somedb" DURATION 1h REPLICATION 4
```

### CREATE CONTINUOUS QUERY

```
create_continuous_query_stmt = "CREATE CONTINUOUS QUERY" query_name on_clause
                               [ "RESAMPLE" resample_opts ]
                               "BEGIN" select_stmt "END" .

query_name                   = identifier .

resample_opts                = (every_stmt for_stmt | every_stmt | for_stmt) .
every_stmt                   = "EVERY" duration_lit
for_stmt                     = "FOR" duration_lit
```

#### Examples:

```sql
-- selects from DEFAULT retention policy and writes into 6_months retention policy
CREATE CONTINUOUS QUERY "10m_event_count"
ON "db_name"
BEGIN
  SELECT count("value")
  INTO "6_months"."events"
  FROM "events"
  GROUP (10m)
END;

-- this selects from the output of one continuous query in one retention policy and outputs to another series in another retention policy
CREATE CONTINUOUS QUERY "1h_event_count"
ON "db_name"
BEGIN
  SELECT sum("count") as "count"
  INTO "2_years"."events"
  FROM "6_months"."events"
  GROUP BY time(1h)
END;

-- this customizes the resample interval so the interval is queried every 10s and intervals are resampled until 2m after their start time
-- when resample is used, at least one of "EVERY" or "FOR" must be used
CREATE CONTINUOUS QUERY "cpu_mean"
ON "db_name"
RESAMPLE EVERY 10s FOR 2m
BEGIN
  SELECT mean("value")
  INTO "cpu_mean"
  FROM "cpu"
  GROUP BY time(1m)
END;
```

### CREATE DATABASE

```
create_database_stmt = "CREATE DATABASE" db_name
                       [ WITH
                           [ retention_policy_duration ]
                           [ retention_policy_replication ]
                           [ retention_policy_shard_group_duration ]
                           [ retention_policy_name ]
                       ] .
```

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

#### Examples:

```sql
-- Create a database called foo
CREATE DATABASE "foo"

-- Create a database called bar with a new DEFAULT retention policy and specify the duration, replication, shard group duration, and name of that retention policy
CREATE DATABASE "bar" WITH DURATION 1d REPLICATION 1 SHARD DURATION 30m NAME "myrp"

-- Create a database called mydb with a new DEFAULT retention policy and specify the name of that retention policy
CREATE DATABASE "mydb" WITH NAME "myrp"
```

### CREATE RETENTION POLICY

```
create_retention_policy_stmt = "CREATE RETENTION POLICY" policy_name on_clause
                               retention_policy_duration
                               retention_policy_replication
                               [ retention_policy_shard_group_duration ]
                               [ "DEFAULT" ] .
```

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

#### Examples

```sql
-- Create a retention policy.
CREATE RETENTION POLICY "10m.events" ON "somedb" DURATION 60m REPLICATION 2

-- Create a retention policy and set it as the DEFAULT.
CREATE RETENTION POLICY "10m.events" ON "somedb" DURATION 60m REPLICATION 2 DEFAULT

-- Create a retention policy and specify the shard group duration.
CREATE RETENTION POLICY "10m.events" ON "somedb" DURATION 60m REPLICATION 2 SHARD DURATION 30m
```

### CREATE SUBSCRIPTION

Subscriptions tell InfluxDB to send all the data it receives to [Kapacitor](/kapacitor/latest/introduction/).

```
create_subscription_stmt = "CREATE SUBSCRIPTION" subscription_name "ON" db_name "." retention_policy "DESTINATIONS" ("ANY"|"ALL") host { "," host} .
```

#### Examples:

```sql
-- Create a SUBSCRIPTION on database 'mydb' and retention policy 'autogen' that send data to 'example.com:9090' via UDP.
CREATE SUBSCRIPTION "sub0" ON "mydb"."autogen" DESTINATIONS ALL 'udp://example.com:9090'

-- Create a SUBSCRIPTION on database 'mydb' and retention policy 'autogen' that round robins the data to 'h1.example.com:9090' and 'h2.example.com:9090'.
CREATE SUBSCRIPTION "sub0" ON "mydb"."autogen" DESTINATIONS ANY 'udp://h1.example.com:9090', 'udp://h2.example.com:9090'
```

### CREATE USER

```
create_user_stmt = "CREATE USER" user_name "WITH PASSWORD" password
                   [ "WITH ALL PRIVILEGES" ] .
```

#### Examples:

```sql
-- Create a normal database user.
CREATE USER "jdoe" WITH PASSWORD '1337password'

-- Create an admin user.
-- Note: Unlike the GRANT statement, the "PRIVILEGES" keyword is required here.
CREATE USER "jdoe" WITH PASSWORD '1337password' WITH ALL PRIVILEGES
```

> **Note:** The password string must be wrapped in single quotes.

### DELETE

```
delete_stmt = "DELETE" ( from_clause | where_clause | from_clause where_clause ) .
```

#### Examples:

```sql
DELETE FROM "cpu"
DELETE FROM "cpu" WHERE time < '2000-01-01T00:00:00Z'
DELETE WHERE time < '2000-01-01T00:00:00Z'
```

### DROP CONTINUOUS QUERY

```
drop_continuous_query_stmt = "DROP CONTINUOUS QUERY" query_name on_clause .
```

#### Example:

```sql
DROP CONTINUOUS QUERY "myquery" ON "mydb"
```

### DROP DATABASE

```
drop_database_stmt = "DROP DATABASE" db_name .
```

#### Example:

```sql
DROP DATABASE "mydb"
```

### DROP MEASUREMENT

```
drop_measurement_stmt = "DROP MEASUREMENT" measurement .
```

#### Examples:

```sql
-- drop the cpu measurement
DROP MEASUREMENT "cpu"
```

### DROP RETENTION POLICY

```
drop_retention_policy_stmt = "DROP RETENTION POLICY" policy_name on_clause .
```

#### Example:

```sql
-- drop the retention policy named 1h.cpu from mydb
DROP RETENTION POLICY "1h.cpu" ON "mydb"
```

### DROP SERIES

```
drop_series_stmt = "DROP SERIES" ( from_clause | where_clause | from_clause where_clause ) .
```

> ***Note:*** Filtering by time is not supported in the  WHERE clause.

#### Example:

```sql
DROP SERIES FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu8'

```

### DROP SHARD

```
drop_shard_stmt = "DROP SHARD" ( shard_id ) .
```

#### Example:

```
DROP SHARD 1
```

### DROP SUBSCRIPTION

```
drop_subscription_stmt = "DROP SUBSCRIPTION" subscription_name "ON" db_name "." retention_policy .
```

#### Example:

```sql
DROP SUBSCRIPTION "sub0" ON "mydb"."autogen"
```

### DROP USER

```
drop_user_stmt = "DROP USER" user_name .
```

#### Example:

```sql
DROP USER "jdoe"
```

### EXPLAIN

Parses and plans the query, and then prints a summary of estimated costs.

Many SQL engines use the `EXPLAIN` statement to show join order, join algorithms, and predicate and expression pushdown.
Since InfluxQL does not support joins, the cost of a InfluxQL query is typically a function of the total series accessed, the number of iterator accesses to a TSM file, and the number of TSM blocks that need to be scanned.

The elements of `EXPLAIN` query plan include:

- expression
- auxillary fields
- number of shards
- number of series
- cached values
- number of files
- number of blocks
- size of blocks

```
explain_stmt = "EXPLAIN" select_stmt .
```

#### Example:

```
> explain select sum(pointReq) from "_internal"."monitor"."write" group by hostname;
> QUERY PLAN
------
EXPRESSION: sum(pointReq::integer)
NUMBER OF SHARDS: 2
NUMBER OF SERIES: 2
CACHED VALUES: 110
NUMBER OF FILES: 1
NUMBER OF BLOCKS: 1
SIZE OF BLOCKS: 931
```


### EXPLAIN ANALYZE

Executes the query and counts the actual costs during runtime.

```
explain_analyze_stmt = "EXPLAIN ANALYZE" select_stmt .
```

#### Example:

```
> explain analyze select sum(pointReq) from "_internal"."monitor"."write" group by hostname;
> EXPLAIN ANALYZE
-----------
.
└── select
├── execution_time: 242.167µs
├── planning_time: 2.165637ms
├── total_time: 2.407804ms
└── field_iterators
├── labels
│   └── statement: SELECT sum(pointReq::integer) FROM "_internal"."monitor"."write" GROUP BY hostname
└── expression
├── labels
│   └── expr: sum(pointReq::integer)
├── create_iterator
│   ├── labels
│   │   ├── measurement: write
│   │   └── shard_id: 57
│   ├── cursors_ref: 1
│   ├── cursors_aux: 0
│   ├── cursors_cond: 0
│   ├── float_blocks_decoded: 0
│   ├── float_blocks_size_bytes: 0
│   ├── integer_blocks_decoded: 1
│   ├── integer_blocks_size_bytes: 931
│   ├── unsigned_blocks_decoded: 0
│   ├── unsigned_blocks_size_bytes: 0
│   ├── string_blocks_decoded: 0
│   ├── string_blocks_size_bytes: 0
│   ├── boolean_blocks_decoded: 0
│   ├── boolean_blocks_size_bytes: 0
│   └── planning_time: 1.401099ms
└── create_iterator
├── labels
│   ├── measurement: write
│   └── shard_id: 58
├── cursors_ref: 1
├── cursors_aux: 0
├── cursors_cond: 0
├── float_blocks_decoded: 0
├── float_blocks_size_bytes: 0
├── integer_blocks_decoded: 0
├── integer_blocks_size_bytes: 0
├── unsigned_blocks_decoded: 0
├── unsigned_blocks_size_bytes: 0
├── string_blocks_decoded: 0
├── string_blocks_size_bytes: 0
├── boolean_blocks_decoded: 0
├── boolean_blocks_size_bytes: 0
└── planning_time: 76.192µs
```


### GRANT

> **NOTE:** Users can be granted privileges on databases that do not exist.

```
grant_stmt = "GRANT" privilege [ on_clause ] to_clause .
```

#### Examples:

```sql
-- grant admin privileges
GRANT ALL TO "jdoe"

-- grant read access to a database
GRANT READ ON "mydb" TO "jdoe"
```

### KILL QUERY

Stop currently-running query.

```sql
kill_query_statement = "KILL QUERY" query_id .
```

Where `query_id` is the query ID, displayed in the [`SHOW QUERIES`](/influxdb/v1.6/troubleshooting/query_management/#list-currently-running-queries-with-show-queries) output as `qid`.

> ***InfluxDB Enterprise clusters:*** To kill queries on a cluster, you need to specify the query ID (qid) and the TCP host (for example, `myhost:8088`),
> available in the `SHOW QUERIES` output.
>
> ```sql
KILL QUERY <qid> ON "<host>"
```

#### Examples:

```sql
-- kill query with qid of 36 on the local host
KILL QUERY 36
```

```sql
-- kill query on InfluxEnterprise cluster
KILL QUERY 53 ON "myhost:8088"
```

### REVOKE

```sql
revoke_stmt = "REVOKE" privilege [ on_clause ] "FROM" user_name .
```

#### Examples:

```sql
-- revoke admin privileges from jdoe
REVOKE ALL PRIVILEGES FROM "jdoe"

-- revoke read privileges from jdoe on mydb
REVOKE READ ON "mydb" FROM "jdoe"
```

### SELECT

```
select_stmt = "SELECT" fields from_clause [ into_clause ] [ where_clause ]
              [ group_by_clause ] [ order_by_clause ] [ limit_clause ]
              [ offset_clause ] [ slimit_clause ] [ soffset_clause ] [ timezone_clause ] .
```

#### Examples

Select from all measurements beginning with cpu into the same measurement name in the cpu_1h retention policy

```sql
SELECT mean("value") INTO "cpu_1h".:MEASUREMENT FROM /cpu.*/
```

Select from measurements grouped by the day with a timezone

```sql
SELECT mean("value") FROM "cpu" GROUP BY region, time(1d) fill(0) tz('America/Chicago')
```

### SHOW CARDINALITY

Refers to the group of commands used to estimate or count exactly the cardinality of measurements, series, tag keys, tag key values, and field keys.

The SHOW CARDINALITY commands are available in two variations: estimated and exact. Estimated values are calculated using sketches and are a safe default for all cardinality sizes. Exact values are counts directly from TSM (Time-Structured Merge Tree) data, but are expensive to run for high cardinality data.  Unless required, use the estimated variety.

Filtering by `time` is only supported when Time Series Index (TSI) is enabled on a database.

See the specific SHOW CARDINALITY commands for details:

- [SHOW FIELD KEY CARDINALITY](#show-field-key-cardinality)
- [SHOW MEASUREMENT CARDINALITY](#show-measurement-cardinality)
- [SHOW SERIES CARDINALITY](#show-series-cardinality)
- [SHOW TAG KEY CARDINALITY](#show-tag-key-cardinality)
- [SHOW TAG VALUES CARDINALITY](#show-tag-values-cardinality)

### SHOW CONTINUOUS QUERIES

```
show_continuous_queries_stmt = "SHOW CONTINUOUS QUERIES" .
```

#### Example:

```sql
-- show all continuous queries
SHOW CONTINUOUS QUERIES
```

### SHOW DATABASES

```
show_databases_stmt = "SHOW DATABASES" .
```

#### Example:

```sql
-- show all databases
SHOW DATABASES
```

### SHOW DIAGNOSTICS

Displays node information, such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

```sql
show_diagnostics_stmt = "SHOW DIAGNOSTICS"
```


### SHOW FIELD KEY CARDINALITY

Estimates or counts exactly the cardinality of the field key set for the current database unless a database is specified using the `ON <database>` option.

> **Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
> When using these query clauses, the query falls back to an exact count.
> Filtering by `time` is only supported when Time Series Index (TSI) is enabled and `time` is not supported in the `WHERE` clause.

```sql
show_field_key_cardinality_stmt = "SHOW FIELD KEY CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_field_key_exact_cardinality_stmt = "SHOW FIELD KEY EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Examples

```sql
-- show estimated cardinality of the field key set of current database
SHOW FIELD KEY CARDINALITY
-- show exact cardinality on field key set of specified database
SHOW FIELD KEY EXACT CARDINALITY ON mydb
```

### SHOW FIELD KEYS

```
show_field_keys_stmt = "SHOW FIELD KEYS" [on_clause] [ from_clause ] .
```

#### Examples

```sql
-- show field keys and field value data types from all measurements
SHOW FIELD KEYS

-- show field keys and field value data types from specified measurement
SHOW FIELD KEYS FROM "cpu"
```

### SHOW GRANTS

```
show_grants_stmt = "SHOW GRANTS FOR" user_name .
```

#### Example:

```sql
-- show grants for jdoe
SHOW GRANTS FOR "jdoe"
```
#### SHOW MEASUREMENT CARDINALITY

Estimates or counts exactly the cardinality of the measurement set for the current database unless a database is specified using the `ON <database>` option.

> **Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
> When using these query clauses, the query falls back to an exact count.
> Filtering by `time` is only supported when TSI (Time Series Index) is enabled and `time` is not supported in the `WHERE` clause.

```sql
show_measurement_cardinality_stmt = "SHOW MEASUREMENT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_measurement_exact_cardinality_stmt = "SHOW MEASUREMENT EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Example:

```sql
-- show estimated cardinality of measurement set on current database
SHOW MEASUREMENT CARDINALITY
-- show exact cardinality of measurement set on specified database
SHOW MEASUREMENT EXACT CARDINALITY ON mydb
```

### SHOW MEASUREMENTS

```
show_measurements_stmt = "SHOW MEASUREMENTS" [on_clause] [ with_measurement_clause ] [ where_clause ] [ limit_clause ] [ offset_clause ] .
```

#### Examples:

```sql
-- show all measurements
SHOW MEASUREMENTS

-- show measurements where region tag = 'uswest' AND host tag = 'serverA'
SHOW MEASUREMENTS WHERE "region" = 'uswest' AND "host" = 'serverA'

-- show measurements that start with 'h2o'
SHOW MEASUREMENTS WITH MEASUREMENT =~ /h2o.*/
```

### SHOW QUERIES

```
show_queries_stmt = "SHOW QUERIES" .
```

#### Example:

```sql
-- show all currently-running queries
SHOW QUERIES
--
```

### SHOW RETENTION POLICIES

```
show_retention_policies_stmt = "SHOW RETENTION POLICIES" [on_clause] .
```

#### Example:

```sql
-- show all retention policies on a database
SHOW RETENTION POLICIES ON "mydb"
```

### SHOW SERIES

```
show_series_stmt = "SHOW SERIES" [on_clause] [ from_clause ] [ where_clause ] [ limit_clause ] [ offset_clause ] .
```

#### Example:

```sql
SHOW SERIES FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu8'
```

#### SHOW SERIES CARDINALITY

Estimates or counts exactly the cardinality of the series for the current database unless a database is specified using the `ON <database>` option.

[Series cardinality](/influxdb/v1.6/concepts/glossary/#series-cardinality) is the major factor that affects RAM requirements. For more information, see:

- [When do I need more RAM?](/influxdb/v1.6/guides/hardware_sizing/#when-do-i-need-more-ram) in [Hardware Sizing Guidelines](/influxdb/v1.6/guides/hardware_sizing/)
- [Don't have too many series](/influxdb/v1.6/concepts/schema_and_data_layout/#don-t-have-too-many-series)

> **Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
> When using these query clauses, the query falls back to an exact count.
> Filtering by `time` is only supported when TSI (Time Series Index) is enabled and `time` is not supported in the `WHERE` clause.

```
show_series_cardinality_stmt = "SHOW SERIES CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_series_exact_cardinality_stmt = "SHOW SERIES EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Examples:

```sql
-- show estimated cardinality of the series on current database
SHOW SERIES CARDINALITY
-- show estimated cardinality of the series on specified database
SHOW SERIES CARDINALITY ON mydb
-- show exact series cardinality
SHOW SERIES EXACT CARDINALITY
-- show series cardinality of the series on specified database
SHOW SERIES EXACT CARDINALITY ON mydb
```

### SHOW SHARD GROUPS

```
show_shard_groups_stmt = "SHOW SHARD GROUPS" .
```

#### Example:

```sql
SHOW SHARD GROUPS
```

### SHOW SHARDS

```
show_shards_stmt = "SHOW SHARDS" .
```

#### Example:

```sql
SHOW SHARDS
```

### SHOW STATS

Returns detailed statistics on available components an InfluxDB node and available (enabled) components.

```
show_stats_stmt = "SHOW STATS [ FOR '<component>' | 'indexes' ]"
```

#### `SHOW STATS`

* The `SHOW STATS` command does not list index memory usage -- use the [`SHOW STATS FOR 'indexes'`](#show-stats-for-indexes) command.
* Statistics returned by `SHOW STATS` are stored in memory and reset to zero when the node is restarted, but `SHOW STATS` is triggered every 10 seconds to populate the `_internal` database.

#### `SHOW STATS FOR <component>`

* For the specified component (\<component\>), the command returns available statistics.
* For the `runtime` component, the command returns an overview of memory usage by the InfluxDB system, using the [Go runtime](https://golang.org/pkg/runtime/) package.

#### `SHOW STATS FOR 'indexes'`

* Returns an estimate of memory use of all indexes. Index memory use is not reported with `SHOW STATS` because it is a potentially expensive operation.


#### Example

```
> show stats
name: runtime
-------------
Alloc   Frees   HeapAlloc       HeapIdle        HeapInUse       HeapObjects     HeapReleased    HeapSys         Lookups Mallocs NumGC   NumGoroutine    PauseTotalNs    Sys             TotalAlloc
4136056 6684537 4136056         34586624        5816320         49412           0               40402944        110     6733949 83      44              36083006        46692600        439945704


name: graphite
tags: proto=tcp
batches_tx      bytes_rx        connections_active      connections_handled     points_rx       points_tx
----------      --------        ------------------      -------------------     ---------       ---------
159             3999750         0                       1                       158110          158110
```


### SHOW SUBSCRIPTIONS

```
show_subscriptions_stmt = "SHOW SUBSCRIPTIONS" .
```

#### Example:

```sql
SHOW SUBSCRIPTIONS
```

#### SHOW TAG KEY CARDINALITY

Estimates or counts exactly the cardinality of tag key set on the current database unless a database is specified using the `ON <database>` option.

> **Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
> When using these query clauses, the query falls back to an exact count.
> Filtering by `time` is only supported when TSI (Time Series Index) is enabled and `time` is not supported in the `WHERE` clause.

```
show_tag_key_cardinality_stmt = "SHOW TAG KEY CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_tag_key_exact_cardinality_stmt = "SHOW TAG KEY EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Examples:

```sql
-- show estimated tag key cardinality
SHOW TAG KEY CARDINALITY
-- show exact tag key cardinality
SHOW TAG KEY EXACT CARDINALITY
```

### SHOW TAG KEYS

```
show_tag_keys_stmt = "SHOW TAG KEYS" [on_clause] [ from_clause ] [ where_clause ]
                     [ limit_clause ] [ offset_clause ] .
```

#### Examples:

```sql
-- show all tag keys
SHOW TAG KEYS

-- show all tag keys from the cpu measurement
SHOW TAG KEYS FROM "cpu"

-- show all tag keys from the cpu measurement where the region key = 'uswest'
SHOW TAG KEYS FROM "cpu" WHERE "region" = 'uswest'

-- show all tag keys where the host key = 'serverA'
SHOW TAG KEYS WHERE "host" = 'serverA'
```

### SHOW TAG VALUES

```
show_tag_values_stmt = "SHOW TAG VALUES" [on_clause] [ from_clause ] with_tag_clause [ where_clause ]
                       [ limit_clause ] [ offset_clause ] .
```

#### Examples:

```sql
-- show all tag values across all measurements for the region tag
SHOW TAG VALUES WITH KEY = "region"

-- show tag values from the cpu measurement for the region tag
SHOW TAG VALUES FROM "cpu" WITH KEY = "region"

-- show tag values across all measurements for all tag keys that do not include the letter c
SHOW TAG VALUES WITH KEY !~ /.*c.*/

-- show tag values from the cpu measurement for region & host tag keys where service = 'redis'
SHOW TAG VALUES FROM "cpu" WITH KEY IN ("region", "host") WHERE "service" = 'redis'
```
#### SHOW TAG VALUES CARDINALITY

Estimates or counts exactly the cardinality of tag key values for the specified tag key on the current database unless a database is specified using the `ON <database>` option.

> **Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
> When using these query clauses, the query falls back to an exact count.
> Filtering by `time` is only supported when TSI (Time Series Index) is enabled.

```
show_tag_values_cardinality_stmt = "SHOW TAG VALUES CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ] with_key_clause

show_tag_values_exact_cardinality_stmt = "SHOW TAG VALUES EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ] with_key_clause
```

#### Examples:

```sql
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
```

### SHOW USERS

```
show_users_stmt = "SHOW USERS" .
```

#### Example:

```sql
-- show all users
SHOW USERS
```

## Clauses

```
from_clause     = "FROM" measurements .

group_by_clause = "GROUP BY" dimensions fill(fill_option).

into_clause     = "INTO" ( measurement | back_ref ).

limit_clause    = "LIMIT" int_lit .

offset_clause   = "OFFSET" int_lit .

slimit_clause   = "SLIMIT" int_lit .

soffset_clause  = "SOFFSET" int_lit .

timezone_clause = tz(string_lit) .

on_clause       = "ON" db_name .

order_by_clause = "ORDER BY" sort_fields .

to_clause       = "TO" user_name .

where_clause    = "WHERE" expr .

with_measurement_clause = "WITH MEASUREMENT" ( "=" measurement | "=~" regex_lit ) .

with_tag_clause = "WITH KEY" ( "=" tag_key | "!=" tag_key | "=~" regex_lit | "IN (" tag_keys ")"  ) .
```

## Expressions

```
binary_op        = "+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "AND" |
                   "OR" | "=" | "!=" | "<>" | "<" | "<=" | ">" | ">=" .

expr             = unary_expr { binary_op unary_expr } .

unary_expr       = "(" expr ")" | var_ref | time_lit | string_lit | int_lit |
                   float_lit | bool_lit | duration_lit | regex_lit .
```

## Other

```
alias            = "AS" identifier .

back_ref         = ( policy_name ".:MEASUREMENT" ) |
                   ( db_name "." [ policy_name ] ".:MEASUREMENT" ) .

db_name          = identifier .

dimension        = expr .

dimensions       = dimension { "," dimension } .

field_key        = identifier .

field            = expr [ alias ] .

fields           = field { "," field } .

fill_option      = "null" | "none" | "previous" | int_lit | float_lit . | "linear"

host             = string_lit .

measurement      = measurement_name |
                   ( policy_name "." measurement_name ) |
                   ( db_name "." [ policy_name ] "." measurement_name ) .

measurements     = measurement { "," measurement } .

measurement_name = identifier | regex_lit .

password         = string_lit .

policy_name      = identifier .

privilege        = "ALL" [ "PRIVILEGES" ] | "READ" | "WRITE" .

query_id         = int_lit .

query_name       = identifier .

retention_policy = identifier .

retention_policy_option      = retention_policy_duration |
                               retention_policy_replication |
                               retention_policy_shard_group_duration |
                               "DEFAULT" .

retention_policy_duration    = "DURATION" duration_lit .

retention_policy_replication = "REPLICATION" int_lit .

retention_policy_shard_group_duration = "SHARD DURATION" duration_lit .

retention_policy_name = "NAME" identifier .

series_id        = int_lit .

shard_id         = int_lit .

sort_field       = field_key [ ASC | DESC ] .

sort_fields      = sort_field { "," sort_field } .

subscription_name = identifier .

tag_key          = identifier .

tag_keys         = tag_key { "," tag_key } .

user_name        = identifier .

var_ref          = measurement .
```

### Comments

Use comments with InfluxQL statements to describe your queries.

* A single line comment begins with two hyphens (`--`) and ends where InfluxDB detects a line break.
  This comment type cannot span several lines.
* A multi-line comment begins with `/*` and ends with `*/`. This comment type can span several lines.
  Multi-line comments do not support nested multi-line comments.

## Query Engine Internals

Once you understand the language itself, it's important to know how these
language constructs are implemented in the query engine. This gives you an
intuitive sense for how results will be processed and how to create efficient
queries.

The life cycle of a query looks like this:

1. InfluxQL query string is tokenized and then parsed into an abstract syntax
   tree (AST). This is the code representation of the query itself.

2. The AST is passed to the `QueryExecutor` which directs queries to the
   appropriate handlers. For example, queries related to meta data are executed
   by the meta service and `SELECT` statements are executed by the shards
   themselves.

3. The query engine then determines the shards that match the `SELECT`
   statement's time range. From these shards, iterators are created for each
   field in the statement.

4. Iterators are passed to the emitter which drains them and joins the resulting
   points. The emitter's job is to convert simple time/value points into the
   more complex result objects that are returned to the client.


### Understanding iterators

Iterators are at the heart of the query engine. They provide a simple interface
for looping over a set of points. For example, this is an iterator over Float
points:

```
type FloatIterator interface {
    Next() *FloatPoint
}
```

These iterators are created through the `IteratorCreator` interface:

```
type IteratorCreator interface {
    CreateIterator(opt *IteratorOptions) (Iterator, error)
}
```

The `IteratorOptions` provide arguments about field selection, time ranges,
and dimensions that the iterator creator can use when planning an iterator.
The `IteratorCreator` interface is used at many levels such as the `Shards`,
`Shard`, and `Engine`. This allows optimizations to be performed when applicable
such as returning a precomputed `COUNT()`.

Iterators aren't just for reading raw data from storage though. Iterators can be
composed so that they provided additional functionality around an input
iterator. For example, a `DistinctIterator` can compute the distinct values for
each time window for an input iterator. Or a `FillIterator` can generate
additional points that are missing from an input iterator.

This composition also lends itself well to aggregation. For example, a statement
such as this:

```
SELECT MEAN(value) FROM cpu GROUP BY time(10m)
```

In this case, `MEAN(value)` is a `MeanIterator` wrapping an iterator from the
underlying shards. However, if we can add an additional iterator to determine
the derivative of the mean:

```
SELECT DERIVATIVE(MEAN(value), 20m) FROM cpu GROUP BY time(10m)
```


### Understanding Auxiliary Fields

Because InfluxQL allows users to use selector functions such as `FIRST()`,
`LAST()`, `MIN()`, and `MAX()`, the engine must provide a way to return related
data at the same time with the selected point.

For example, in this query:

```
SELECT FIRST(value), host FROM cpu GROUP BY time(1h)
```

We are selecting the first `value` that occurs every hour but we also want to
retrieve the `host` associated with that point. Since the `Point` types only
specify a single typed `Value` for efficiency, we push the `host` into the
auxiliary fields of the point. These auxiliary fields are attached to the point
until it is passed to the emitter where the fields get split off to their own
iterator.


### Built-in Iterators

There are many helper iterators that let us build queries:

* Merge Iterator - This iterator combines one or more iterators into a single
  new iterator of the same type. This iterator guarantees that all points
  within a window will be output before starting the next window but does not
  provide ordering guarantees within the window. This allows for fast access
  for aggregate queries which do not need stronger sorting guarantees.

* Sorted Merge Iterator - This iterator also combines one or more iterators
  into a new iterator of the same type. However, this iterator guarantees
  time ordering of every point. This makes it slower than the `MergeIterator`
  but this ordering guarantee is required for non-aggregate queries which
  return the raw data points.

* Limit Iterator - This iterator limits the number of points per name/tag
  group. This is the implementation of the `LIMIT` & `OFFSET` syntax.

* Fill Iterator - This iterator injects extra points if they are missing from
  the input iterator. It can provide `null` points, points with the previous
  value, or points with a specific value.

* Buffered Iterator - This iterator provides the ability to "unread" a point
  back onto a buffer so it can be read again next time. This is used extensively
  to provide lookahead for windowing.

* Reduce Iterator - This iterator calls a reduction function for each point in
  a window. When the window is complete then all points for that window are
  output. This is used for simple aggregate functions such as `COUNT()`.

* Reduce Slice Iterator - This iterator collects all points for a window first
  and then passes them all to a reduction function at once. The results are
  returned from the iterator. This is used for aggregate functions such as
  `DERIVATIVE()`.

* Transform Iterator - This iterator calls a transform function for each point
  from an input iterator. This is used for executing binary expressions.

* Dedupe Iterator - This iterator only outputs unique points. It is resource
  intensive so it is only used for small queries such as meta query statements.


### Call Iterators

Function calls in InfluxQL are implemented at two levels. Some calls can be
wrapped at multiple layers to improve efficiency. For example, a `COUNT()` can
be performed at the shard level and then multiple `CountIterator`s can be
wrapped with another `CountIterator` to compute the count of all shards. These
iterators can be created using `NewCallIterator()`.

Some iterators are more complex or need to be implemented at a higher level.
For example, the `DERIVATIVE()` needs to retrieve all points for a window first
before performing the calculation. This iterator is created by the engine itself
and is never requested to be created by the lower levels.
