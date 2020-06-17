---
title: Query using conditional logic
seotitle: Query using conditional logic in Flux
list_title: Conditional logic
description: >
  This guide describes how to use Flux conditional expressions, such as `if`,
  `else`, and `then`, to query and transform data. **Flux evaluates statements from left to right and stops evaluating once a condition matches.**
menu:
  flux_0_65:
    name: Conditional logic
    parent: Query with Flux
weight: 20
list_code_example: |
  ```js
  if color == "green" then "008000" else "ffffff"
  ```
---

Flux provides `if`, `then`, and `else` conditional expressions that allow for powerful and flexible Flux queries.

##### Conditional expression syntax
```js
// Pattern
if <condition> then <action> else <alternative-action>

// Example
if color == "green" then "008000" else "ffffff"
```

Conditional expressions are most useful in the following contexts:

- When defining variables.
- When using functions that operate on a single row at a time (
  [`filter()`](/flux/v0.65/stdlib/built-in/transformations/filter/),
  [`map()`](/flux/v0.65/stdlib/built-in/transformations/map/),
  [`reduce()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/reduce) ).

## Evaluating conditional expressions

Flux evaluates statements in order and stops evaluating once a condition matches.

For example, given the following statement:

```js
if r._value > 95.0000001 and r._value <= 100.0 then "critical"
else if r._value > 85.0000001 and r._value <= 95.0 then "warning"
else if r._value > 70.0000001 and r._value <= 85.0 then "high"
else "normal"
```

When `r._value` is 96, the output is "critical" and the remaining conditions are not evaluated.

## Examples

- [Conditionally set the value of a variable](#conditionally-set-the-value-of-a-variable)
- [Create conditional filters](#create-conditional-filters)
- [Conditionally transform column values with map()](#conditionally-transform-column-values-with-map)
- [Conditionally increment a count with reduce()](#conditionally-increment-a-count-with-reduce)

### Conditionally set the value of a variable
The following example sets the `overdue` variable based on the
`dueDate` variable's relation to `now()`.

```js
dueDate = 2019-05-01
overdue = if dueDate < now() then true else false
```

### Create conditional filters
The following example uses an example `metric` variable to change how the query filters data.
`metric` has three possible values:

- Memory
- CPU
- Disk

```js
metric = "Memory"

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      if v.metric == "Memory"
        then r._measurement == "mem" and r._field == "used_percent"
      else if v.metric == "CPU"
        then r._measurement == "cpu" and r._field == "usage_user"
      else if v.metric == "Disk"
        then r._measurement == "disk" and r._field == "used_percent"
      else r._measurement != ""
  )
```

### Conditionally transform column values with map()
The following example uses the [`map()` function](/flux/v0.65/stdlib/built-in/transformations/map/)
to conditionally transform column values.
It sets the `level` column to a specific string based on `_value` column.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[No Comments](#)
[Comments](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> map(fn: (r) => ({
    r with
    level:
      if r._value >= 95.0000001 and r._value <= 100.0 then "critical"
      else if r._value >= 85.0000001 and r._value <= 95.0 then "warning"
      else if r._value >= 70.0000001 and r._value <= 85.0 then "high"
      else "normal"
    })
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> map(fn: (r) => ({
    // Retain all existing columns in the mapped row
    r with
    // Set the level column value based on the _value column
    level:
      if r._value >= 95.0000001 and r._value <= 100.0 then "critical"
      else if r._value >= 85.0000001 and r._value <= 95.0 then "warning"
      else if r._value >= 70.0000001 and r._value <= 85.0 then "high"
      else "normal"
    })
  )
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Conditionally increment a count with reduce()
The following example uses the [`aggregateWindow()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/aggregatewindow/)
and [`reduce()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/reduce/)
functions to count the number of records in every five minute window that exceed a defined threshold.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[No Comments](#)
[Comments](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
threshold = 65.0

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  |> aggregateWindow(
      every: 5m,
      fn: (column, tables=<-) => tables |> reduce(
            identity: {above_threshold_count: 0.0},
            fn: (r, accumulator) => ({
              above_threshold_count:
                if r._value >= threshold then accumulator.above_threshold_count + 1.0
                else accumulator.above_threshold_count + 0.0
            })
        )
    )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
threshold = 65.0

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent" )
  // Aggregate data into 5 minute windows using a custom reduce() function
  |> aggregateWindow(
      every: 5m,
      // Use a custom function in the fn parameter.
      // The aggregateWindow fn parameter requires 'column' and 'tables' parameters.
      fn: (column, tables=<-) => tables |> reduce(
            identity: {above_threshold_count: 0.0},
            fn: (r, accumulator) => ({
              // Conditionally increment above_threshold_count if
              // r.value exceeds the threshold
              above_threshold_count:
                if r._value >= threshold then accumulator.above_threshold_count + 1.0
                else accumulator.above_threshold_count + 0.0
            })
        )
    )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
