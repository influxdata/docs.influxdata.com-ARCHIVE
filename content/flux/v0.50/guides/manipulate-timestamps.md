---
title: Manipulate timestamps with Flux
description: >
  Use Flux to process and manipulate timestamps.
menu:
  flux_0_50:
    name: Manipulate timestamps
    parent: Guides
weight: 9
---

Every point stored in InfluxDB has an associated timestamp.
Use Flux to process and manipulate timestamps to suit your needs.

- [Convert timestamp format](#convert-timestamp-format)
- [Time-related Flux functions](#time-related-flux-functions)

## Convert timestamp format

### Convert nanosecond epoch timestamp to RFC3339
Use the [`time()` function](/flux/v0.50/stdlib/built-in/transformations/type-conversions/time/)
to convert a **nanosecond** epoch timestamp to an RFC3339 timestamp.

```js
time(v: 1568808000000000000)
// Returns 2019-09-18T12:00:00.000000000Z
```

### Convert RFC3339 to nanosecond epoch timestamp
Use the [`uint()` function](/flux/v0.50/stdlib/built-in/transformations/type-conversions/uint/)
to convert an RFC3339 timestamp to a nanosecond epoch timestamp.

```js
uint(v: 2019-09-18T12:00:00.000000000Z)
// Returns 1568808000000000000
```

### Calculate the duration between two timestamps
Flux doesn't support mathematical operations using [time type](/flux/v0.50/language/types/#time-types) values.
To calculate the duration between two timestamps:

1. Use the `uint()` function to convert each timestamp to a nanosecond epoch timestamp.
2. Subtract one nanosecond epoch timestamp from the other.
3. Use the `duration()` function to convert the result into a duration.

```js
time1 = uint(v: 2019-09-17T21:12:05Z)
time2 = uint(v: 2019-09-18T22:16:35Z)

duration(v: time2 - time1)
// Returns 25h4m30s
```

{{% note %}}
Flux doesn't support duration column types.
To store a duration in a column, use the [`string()` function](/flux/v0.50/stdlib/built-in/transformations/type-conversions/string/)
to convert the duration to a string.
{{% /note %}}

## Time-related Flux functions

### Retrieve the current time
Use the [`now()` function](/flux/v0.50/stdlib/built-in/misc/now/) to
return the current UTC time in RFC3339 format.

```js
now()
```

### Add a duration to a timestamp
The [`experimental.addDuration()` function](/flux/v0.50/stdlib/experimental/addduration/)
adds a duration to a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.addDuration()`, you accept the
[risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.addDuration(
  d: 6h,
  to: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T18:00:00.000000000Z
```

### Subtract a duration from a timestamps
The [`experimental.addDuration()` function](/flux/v0.50/stdlib/experimental/subduration/)
subtracts a duration from a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.addDuration()`, you accept the
[risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.subDuration(
  d: 6h,
  from: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T06:00:00.000000000Z
```
