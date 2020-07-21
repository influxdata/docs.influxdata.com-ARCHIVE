---
title: Manipulate timestamps with Flux
list_title: Manipulate timestamps
description: >
  Use Flux to process and manipulate timestamps.
menu:
  flux_0_65:
    name: Manipulate timestamps
    parent: Query with Flux
weight: 20
---

Every point stored in InfluxDB has an associated timestamp.
Use Flux to process and manipulate timestamps to suit your needs.

- [Convert timestamp format](#convert-timestamp-format)
- [Calculate the duration between two timestamps](#calculate-the-duration-between-two-timestamps)
- [Retrieve the current time](#retrieve-the-current-time)
- [Normalize irregular timestamps](#normalize-irregular-timestamps)
- [Use timestamps and durations together](#use-timestamps-and-durations-together)

{{% note %}}
If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/v2.0/query-data/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.
{{% /note %}}


## Convert timestamp format

- [Unix nanosecond to RFC3339](#unix-nanosecond-to-rfc3339)
- [RFC3339 to Unix nanosecond](#rfc3339-to-unix-nanosecond)

### Unix nanosecond to RFC3339
Use the [`time()` function](/flux/v0.65/stdlib/built-in/transformations/type-conversions/time/)
to convert a [Unix **nanosecond** timestamp](/v2.0/reference/glossary/#unix-timestamp)
to an [RFC3339 timestamp](/v2.0/reference/glossary/#rfc3339-timestamp).

```js
time(v: 1568808000000000000)
// Returns 2019-09-18T12:00:00.000000000Z
```

### RFC3339 to Unix nanosecond
Use the [`uint()` function](/flux/v0.65/stdlib/built-in/transformations/type-conversions/uint/)
to convert an RFC3339 timestamp to a Unix nanosecond timestamp.

```js
uint(v: 2019-09-18T12:00:00.000000000Z)
// Returns 1568808000000000000
```

## Calculate the duration between two timestamps
Flux doesn't support mathematical operations using [time type](/flux/v0.65/language/types/#time-types) values.
To calculate the duration between two timestamps:

1. Use the `uint()` function to convert each timestamp to a Unix nanosecond timestamp.
2. Subtract one Unix nanosecond timestamp from the other.
3. Use the `duration()` function to convert the result into a duration.

```js
time1 = uint(v: 2019-09-17T21:12:05Z)
time2 = uint(v: 2019-09-18T22:16:35Z)

duration(v: time2 - time1)
// Returns 25h4m30s
```

{{% note %}}
Flux doesn't support duration column types.
To store a duration in a column, use the [`string()` function](/flux/v0.65/stdlib/built-in/transformations/type-conversions/string/)
to convert the duration to a string.
{{% /note %}}

## Retrieve the current time
- [Current UTC time](#current-utc-time)
- [Current system time](#current-system-time)

### Current UTC time
Use the [`now()` function](/flux/v0.65/stdlib/built-in/misc/now/) to
return the current UTC time in RFC3339 format.

```js
now()
```

{{% note %}}
`now()`  is cached at runtime, so all instances of `now()` in a Flux script
return the same value.
{{% /note %}}

### Current system time
Import the `system` package and use the [`system.time()` function](/flux/v0.65/stdlib/system/time/)
to return the current system time of the host machine in RFC3339 format.

```js
import "system"

system.time()
```

{{% note %}}
`system.time()` returns the time it is executed, so each instance of `system.time()`
in a Flux script returns a unique value.
{{% /note %}}

## Normalize irregular timestamps
To normalize irregular timestamps, truncate all `_time` values to a specified unit
with the [`truncateTimeColumn()` function](/flux/v0.65/stdlib/built-in/transformations/truncatetimecolumn/).
This is useful in [`join()`](/flux/v0.65/stdlib/built-in/transformations/join/)
and [`pivot()`](/flux/v0.65/stdlib/built-in/transformations/pivot/)
operations where points should align by time, but timestamps vary slightly.

```js
data
  |> truncateTimeColumn(unit: 1m)
```

{{< flex >}}
{{% flex-content %}}
**Input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:49Z | 2.0    |
| 2020-01-01T00:01:01Z | 1.9    |
| 2020-01-01T00:03:22Z | 1.8    |
| 2020-01-01T00:04:04Z | 1.9    |
| 2020-01-01T00:05:38Z | 2.1    |
{{% /flex-content %}}
{{% flex-content %}}
**Output:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 2.0    |
| 2020-01-01T00:01:00Z | 1.9    |
| 2020-01-01T00:03:00Z | 1.8    |
| 2020-01-01T00:04:00Z | 1.9    |
| 2020-01-01T00:05:00Z | 2.1    |
{{% /flex-content %}}
{{< /flex >}}

## Use timestamps and durations together
- [Add a duration to a timestamp](#add-a-duration-to-a-timestamp)
- [Subtract a duration from a timestamp](#subtract-a-duration-from-a-timestamp)

### Add a duration to a timestamp
The [`experimental.addDuration()` function](/flux/v0.65/stdlib/experimental/addduration/)
adds a duration to a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.addDuration()`, you accept the
[risks of experimental functions](/flux/v0.65/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.addDuration(
  d: 6h,
  to: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T18:00:00.000000000Z
```

### Subtract a duration from a timestamp
The [`experimental.subDuration()` function](/flux/v0.65/stdlib/experimental/subduration/)
subtracts a duration from a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.subDuration()`, you accept the
[risks of experimental functions](/flux/v0.65/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.subDuration(
  d: 6h,
  from: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T06:00:00.000000000Z
```
