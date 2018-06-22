---
title: Calculating percentages in a query
description: Percentages can be calculated using basic math operators available in InfluxQL. This guide walks through use-cases and examples of calculating percentages from two values in a single query.
menu:
  influxdb_1_5:
    weight: 50
    parent: Guides
---

[InfluxQL](/influxdb/v1.5/query_language/) lets you perform simple math equations
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
influx -import -path=path/to/apple_stand.txt -precision=s -database=apple_stand
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
<div class='view-in-chronograf' data-query='SELECT
    ("braeburn"/total_weight)*100,
    ("granny_smith"/total_weight)*100,
    ("golden_delicious"/total_weight)*100,
    ("fuji"/total_weight)*100,
    ("gala"/total_weight)*100
FROM "apple_stand"."autogen"."variety"'>
\*</div>

If visualized as a [stacked graph](/chronograf/v1.5/guides/visualization-types/#stacked-graph)
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

If visualized as a [stacked graph](/chronograf/v1.5/guides/visualization-types/#stacked-graph)
in Chronograf, it would look like:

![Hourly average percentage of total per apple variety](/img/influxdb/calc-percentage-hourly-apple-variety.png)
