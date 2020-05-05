---
title: Calculate percentages in a query
description: Percentages can be calculated using basic math operators available in InfluxQL or Flux. This guide walks through use-cases and examples of calculating percentages from two values in a single query.
menu:
  influxdb_1_8:
    weight: 50
    parent: Guides
    name: Calculate percentages
aliases:
  - /influxdb/v1.8/guides/calculating_percentages/
---

Use Flux or InfluxQL to calculate percentages in query.

{{< tab-labels >}}
{{% tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}

[Flux](/flux/latest/) lets you perform simple math equations, for example, calculating a percentage.

## Calculate a percentage

Learn how to calculate a percentage using the following examples:

- [Basic calculations within a query](#basic-calculations-within-a-query)
- [Calculate a percentage from two fields](#calculate-a-percentage-from-two-fields)
- [Calculate a percentage using aggregate functions](#calculate-a-percentage-using-aggregate-functions)
- [Calculate the percentage of total weight per apple variety](#calculate-the-percentage-of-total-weight-per-apple-variety)
- [Calculate the aggregate percentage per variety](#calculate-the-aggregate-percentage-per-variety)

## Basic calculations within a query

Flux supports the use of basic math operators such as `+`,`-`,`/`, `*`, `()`, etc. When performing any math operation, you must complete the following steps:

1. Specify the [bucket](/flux/latest/introduction/getting-started/#buckets) to query from.
2. Filter your data by measurements, fields, and other applicable criteria.
3. Align values in one row (required to perform math in Flux) by using one of the following functions:
   - To query **from multiple** data sources, use the `join()` function.
   - To query **from the same** data source, use the `pivot()` function.

For examples using the `join()` function to calculate percentages and more examples of calculating percentages, see [Calculate percentage with Flux] (/v2.0/query-data/flux/calculate-percentages/).

#### Data variable

Because steps 1-3 are required for every math operation in Flux, we'll store the data from these steps in a `data` variable for reuse.

Here's how that looks in Flux:

```js
//query data over the past 15 minutes and store values for `field1` and `field2` in one row by time
data = from(bucket:"<database>/<retention_policy>")
      |> range(start: now() -15m)
      |> filter(fn: (r) =>  r._measurement == "measurement_name" and r._field =~ /fieldkey[1-2]/)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
```

Each row now contains the values necessary to perform a math operation. For example, to add two field keys, use the `data` variable created above, and then use `map()` to re-map values in each row.

```js
data
 |> map(fn: (r) => ({ r with _value: fieldkey1 + r.field2}))
```

## Calculate a percentage from two fields

Use the `data` variable created above, and then use `map()` to divide one field by another, multiply by 100, and add a new `percent` field to store the percentage values in.

```js
data
   |> map(fn: (r) => ({
    _time: r._time,
    _measurement: r._measurement,
    _field: "percent",
    _value: field1 / field2 * 100.0
  }))
```

## Calculate a percentage using aggregate functions

Aggregate functions must include the `aggregateWindow()` function to specify both the window of time to group data **and** the function used to aggregate data. Group and aggregate your data before pivoting the data into one row to calculate a percentage.

```js

from(bucket:"<database>/<retention_policy>")
      |> range(start: now() -15m)
      |> filter(fn: (r) =>  r._measurement == "measurement_name" and r._field =~ /fieldkey[1-2]/)
      |> aggregateWindow(every: 1m, fn:sum)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> map(fn: (r) => ({ r with _value: r.field1 / r.field2 * 100.0 }))
```

## Calculate the percentage of total weight per apple variety

Use simulated apple stand data to track the weight of apples (by type) throughout a day.

1. [Download the sample data](https://gist.githubusercontent.com/sanderson/8f8aec94a60b2c31a61f44a37737bfea/raw/c29b239547fa2b8ee1690f7d456d31f5bd461386/apple_stand.txt)
2. Import the sample data:

```bash
influx -import -path=path/to/apple_stand.txt -precision=ns -database=apple_stand
```

Use the following query to calculate the percentage of the total weight each variety
accounts for at each given point in time.

```js
from(bucket:"apple_stand/autogen")
      |> range(start: 2018-06-18T12:00:00Z, stop: 2018-06-19T04:35:00Z)
      |> filter(fn: (r) =>  r._measurement == "variety")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value"
      |> map(fn: (r) => ({ r with
        granny_smith: r.granny_smith / r.total_weight * 100.0 ,
        golden_delicious: r.golden_delicious / r.total_weight * 100.0 ,
        fuji: r.fuji / r.total_weight * 100.0 ,
        gala: r.gala / r.total_weight * 100.0 ,
        braeburn: r.braeburn / r.total_weight * 100.0 ,}))
```

## Calculate the aggregate percentage per variety

Use the following query to calculate the average percentage of the total weight each variety accounts for per hour.

```js

from(bucket:"apple_stand/autogen")
      |> range(start: 2018-06-18T00:00:00.00Z, stop: 2018-06-19T16:35:00.00Z)
      |> filter(fn: (r) => r._measurement == "variety")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value"
      |> window(every:1h)
      |> map(fn: (r) => ({ r with _value: (mean(r._field) / mean(r.total_weight)) * 100.0 }))
```

_**Note the following about this query:**_

- `windows()` aggregates data into 1 hour blocks. When using aggregate functions, we recommend explicitly limiting the time window. Otherwise, aggregate functions
  are very resource-intensive.
- `mean()` averages data by 1 hour blocks

{{% /tab-content %}}

{{% tab-content %}}

[InfluxQL](/influxdb/v1.8/query_language/) lets you perform simple math equations
which makes calculating percentages using two fields in a measurement pretty simple.
However there are some caveats of which you need to be aware.

## Basic calculations within a query

`SELECT` statements support the use of basic math operators such as `+`,`-`,`/`, `*`, `()`, etc.

```sql
-- Add two field keys
SELECT field_key1 + field_key2 AS "field_key_sum" FROM "measurement_name" WHERE time < now() - 15m

-- Subtract one field from another
SELECT field_key1 - field_key2 AS "field_key_difference" FROM "measurement_name" WHERE time < now() - 15m

-- Grouping and chaining mathematical calculations
SELECT (field_key1 + field_key2) - (field_key3 + field_key4) AS "some_calculation" FROM "measurement_name" WHERE time < now() - 15m
```

## Calculating a percentage in a query

Using basic math functions, you can calculate a percentage by dividing one field value
by another and multiplying the result by 100:

```sql
SELECT (field_key1 / field_key2) * 100 AS "calculated_percentage" FROM "measurement_name" WHERE time < now() - 15m
```

## Calculating a percentage using aggregate functions

If using aggregate functions in your percentage calculation, all data must be referenced
using aggregate functions.
_**You can't mix aggregate and non-aggregate data.**_

All Aggregate functions need a `GROUP BY time()` clause defining the time intervals
in which data points are grouped and aggregated.

```sql
SELECT (sum(field_key1) / sum(field_key2)) * 100 AS "calculated_percentage" FROM "measurement_name" WHERE time < now() - 15m GROUP BY time(1m)
```

## Examples

#### Sample data

The following example uses simulated Apple Stand data that tracks the weight of
baskets containing different varieties of apples throughout a day of business.

1. [Download the sample data](https://gist.githubusercontent.com/sanderson/8f8aec94a60b2c31a61f44a37737bfea/raw/c29b239547fa2b8ee1690f7d456d31f5bd461386/apple_stand.txt)
2. Import the sample data:

```bash
influx -import -path=path/to/apple_stand.txt -precision=ns -database=apple_stand
```

### Calculating percentage of total weight per apple variety

The following query calculates the percentage of the total weight each variety
accounts for at each given point in time.

```sql
SELECT
    ("braeburn"/total_weight)*100,
    ("granny_smith"/total_weight)*100,
    ("golden_delicious"/total_weight)*100,
    ("fuji"/total_weight)*100,
    ("gala"/total_weight)*100
FROM "apple_stand"."autogen"."variety"
```
<div class='view-in-chronograf' data-query-override='SELECT
    ("braeburn"/total_weight)*100,
    ("granny_smith"/total_weight)*100,
    ("golden_delicious"/total_weight)*100,
    ("fuji"/total_weight)*100,
    ("gala"/total_weight)*100
FROM "apple_stand"."autogen"."variety"'>
\*</div>

If visualized as a [stacked graph](/chronograf/v1.8/guides/visualization-types/#stacked-graph)
in Chronograf, it would look like:

![Percentage of total per apple variety](/img/influxdb/calc-percentage-apple-variety.png)

### Calculating aggregate percentage per variety

The following query calculates the average percentage of the total weight each variety
accounts for per hour.

```sql
SELECT
    (mean("braeburn")/mean(total_weight))*100,
    (mean("granny_smith")/mean(total_weight))*100,
    (mean("golden_delicious")/mean(total_weight))*100,
    (mean("fuji")/mean(total_weight))*100,
    (mean("gala")/mean(total_weight))*100
FROM "apple_stand"."autogen"."variety"
WHERE time >= '2018-06-18T12:00:00Z' AND time <= '2018-06-19T04:35:00Z'
GROUP BY time(1h)
```
<div class='view-in-chronograf' data-query-override='SELECT%0A%20%20%20%20%28mean%28"braeburn"%29%2Fmean%28total_weight%29%29%2A100%2C%0A%20%20%20%20%28mean%28"granny_smith"%29%2Fmean%28total_weight%29%29%2A100%2C%0A%20%20%20%20%28mean%28"golden_delicious"%29%2Fmean%28total_weight%29%29%2A100%2C%0A%20%20%20%20%28mean%28"fuji"%29%2Fmean%28total_weight%29%29%2A100%2C%0A%20%20%20%20%28mean%28"gala"%29%2Fmean%28total_weight%29%29%2A100%0AFROM%20"apple_stand"."autogen"."variety"%0AWHERE%20time%20>%3D%20%272018-06-18T12%3A00%3A00Z%27%20AND%20time%20<%3D%20%272018-06-19T04%3A35%3A00Z%27%0AGROUP%20BY%20time%281h%29'></div>

_**Note the following about this query:**_

- It uses aggregate functions (`mean()`) for pulling all data.
- It includes a `GROUP BY time()` clause which aggregates data into 1 hour blocks.
- It includes an explicitly limited time window. Without it, aggregate functions
  are very resource-intensive.

If visualized as a [stacked graph](/chronograf/v1.8/guides/visualization-types/#stacked-graph)
in Chronograf, it would look like:

![Hourly average percentage of total per apple variety](/img/influxdb/calc-percentage-hourly-apple-variety.png)

{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /tab-labels >}}