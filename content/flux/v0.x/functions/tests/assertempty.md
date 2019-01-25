---
title: assertEmpty() function
description: placeholder
menu:
  flux_0_x:
    name: assertEmpty
    parent: Tests
    weight: 1
---

The `assertEmpty()` function tests if an input stream is empty.
If not empty, the function outputs an error.

_**Function type:** Test_  

```js
assertEmpty()
```

_The `assertEmpty()` function can be used to perform in-line tests in a query._

## Examples

#### Check if there is a difference between streams
This example uses the [`diff()` function](/flux/v0.x/functions/tests/diff)
which outputs the diff for the two streams.
The `.assertEmpty()` function checks to see if the diff is empty.

```js
got = from(bucket: "telegraf/autogen")
  |> range(start: -15m)

want = from(bucket: "backup_telegraf/autogen")
  |> range(start: -15m)

got
  |> diff(want: want)
  |> assertEmpty()
```
