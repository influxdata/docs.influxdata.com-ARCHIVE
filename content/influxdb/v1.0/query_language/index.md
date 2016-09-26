---
title: Query Language
---

This section introduces InfluxQL, InfluxDB's SQL-like query language for
interacting with data in InfluxDB.

## InfluxQL Tutorial
The first seven documents in this section provide a tutorial-style introduction
to InfluxQL.
Feel free to download the dataset provided in
[Sample Data](/influxdb/v1.0/query_language/data_download/) and follow along
with the documentation.

#### [Data Exploration](/influxdb/v1.0/query_language/data_exploration/)

Covers the query language basics for InfluxQL, including the
[`SELECT`](/influxdb/v1.0/query_language/data_exploration/#the-select-statement-and-the-where-clause)
statement,
[`GROUP BY`](/influxdb/v1.0/query_language/data_exploration/#the-group-by-clause) clauses,
[`INTO`](/influxdb/v1.0/query_language/data_exploration/#the-into-clause) queries, and more.
See Data Exploration to learn about
[time syntax](/influxdb/v1.0/query_language/data_exploration/#time-syntax-in-queries) and
[regular expressions](/influxdb/v1.0/query_language/data_exploration/#regular-expressions-in-queries) in
queries.

#### [Schema Exploration](/influxdb/v1.0/query_language/schema_exploration/)

Covers queries that are useful for viewing and exploring your
[schema](/influxdb/v1.0/concepts/glossary/#schema).
See Schema Exploration for syntax explanations and examples of InfluxQL's `SHOW`
queries.

#### [Database Management](/influxdb/v1.0/query_language/database_management/)

Covers InfluxQL for managing
[databases](/influxdb/v1.0/concepts/glossary/#database) and
[retention policies](/influxdb/v1.0/concepts/glossary/#retention-policy-rp) in
InfluxDB.
See Database Management for creating and dropping databases and retention
policies as well as deleting and dropping data.

#### [Functions](/influxdb/v1.0/query_language/functions/)

Covers all InfluxQL functions.

#### [Continuous Queries](/influxdb/v1.0/query_language/continuous_queries/)

Covers the syntax for
[creating](/influxdb/v1.0/query_language/continuous_queries/#influxql-for-creating-a-cq),
[showing](/influxdb/v1.0/query_language/continuous_queries/#list-cqs-with-show),
and [deleting](/influxdb/v1.0/query_language/continuous_queries/#delete-cqs-with-drop) InfluxDB's
[Continuous Queries](/influxdb/v1.0/concepts/glossary/#continuous-query-cq).

#### [Mathematical Operators](/influxdb/v1.0/query_language/math_operators/)

Covers the use of mathematical operators in InfluxQL.

#### [Authentication and Authorization](/influxdb/v1.0/query_language/authentication_and_authorization/)

Covers how to
[set up authentication](/influxdb/v1.0/query_language/authentication_and_authorization/#set-up-authentication)
and how to
[authenticate requests](/influxdb/v1.0/query_language/authentication_and_authorization/#authenticating-requests) in InfluxDB.
This page also describes the different
[user types](/influxdb/v1.0/query_language/authentication_and_authorization/#user-types-and-their-privileges) and the InfluxQL for
[managing database users](/influxdb/v1.0/query_language/authentication_and_authorization/#user-management-commands).

## [InfluxQL Reference](/influxdb/v1.0/query_language/spec/)

The reference documentation for InfluxQL.
