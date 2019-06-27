---
title: testing.assertEmpty() function
description: The testing.assertEmpty() function tests if an input stream is empty.
menu:
  flux_0_33:
    name: testing.assertEmpty
    parent: Testing
    weight: 1
---

The `testing.assertEmpty()` function tests if an input stream is empty.
If not empty, the function returns an error.

_**Function type:** Test_  

```js
import "testing"

testing.assertEmpty()
```

_The `testing.assertEmpty()` function can be used to perform in-line tests in a query._

## Examples

#### Check if there is a difference between streams
This example uses the [`testing.diff()` function](/flux/v0.33/functions/testing/diff)
which outputs the diff for the two streams.
The `.testing.assertEmpty()` function checks to see if the diff is empty.

```js
import "testing"

got = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
want = from(bucket: "backup_telegraf/autogen")
  |> range(start: -15m)
got
  |> testing.diff(want: want)
  |> testing.assertEmpty()
```
