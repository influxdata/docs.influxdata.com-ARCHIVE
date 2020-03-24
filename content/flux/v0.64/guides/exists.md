---
title: Check if a value exists
description: >
  Use the Flux `exists` operator to check if an object contains a key or if that
  key's value is `null`.
menu:
  flux_0_64:
    name: Check if a value exists
    parent: Guides
weight: 20
---

Use the Flux `exists` operator to check if an object contains a key or if that
key's value is `null`.

```js
p = {firstName: "John", lastName: "Doe", age: 42}

exists p.firstName
// Returns true

exists p.height
// Returns false
```

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/flux/v0.64/introduction/getting-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/flux/v0.64/guides/executing-queries/) to discover a variety of ways to run your queries.

Use `exists` with row functions (
[`filter()`](/flux/v0.64/stdlib/built-in/transformations/filter/),
[`map()`](/flux/v0.64/stdlib/built-in/transformations/map/),
[`reduce()`](/flux/v0.64/stdlib/built-in/transformations/aggregates/reduce/))
to check if a row includes a column or if the value for that column is `null`.

#### Filter out null values
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) => exists r._value)
```

#### Map values based on existence
```js
from(bucket: "default")
  |> range(start: -30s)
  |> map(fn: (r) => ({
      r with
      human_readable:
        if exists r._value then "${r._field} is ${string(v:r._value)}."
        else "${r._field} has no value."
  }))
```

#### Ignore null values in a custom aggregate function
```js
customSumProduct = (tables=<-) =>
  tables
    |> reduce(
      identity: {sum: 0.0, product: 1.0},
      fn: (r, accumulator) => ({
        r with
        sum:
          if exists r._value then r._value + accumulator.sum
          else accumulator.sum,
        product:
          if exists r._value then r.value * accumulator.product
          else accumulator.product
      })
    )
```
