---
title: testing.diff() function
description: The testing.diff() function produces a diff between two streams.
menu:
  flux_0_24:
    name: testing.diff
    parent: Testing
    weight: 1
---

The `testing.diff()` function produces a diff between two streams.

_**Function type:** Test_  

```js
import "testing"

testing.diff(got: stream2, want: stream1)
```

It matches tables from each stream with the same group keys.
For each matched table, it produces a diff.
Any added or removed rows are added to the table as a row.
An additional string column with the name `diff` is created and contains a `-` if the
row was present in the `got` table and not in the `want` table or `+` if the opposite is true.

The diff function is guaranteed to emit at least one row if the tables are
different and no rows if the tables are the same. _The exact diff produced may change._

_The `testing.diff()` function can be used to perform in-line diffs in a query._

## Parameters

### got
The stream containing data to test.
_Defaults to piped-forward data (`<-`)._

_**Data type:** Object_

### want
The stream that contains the expected data to test against.

_**Data type:** Object_

## Examples

##### Diff separate streams
```js
import "testing"

want = from(bucket: "backup-telegraf/autogen")
  |> range(start: -5m)
got = from(bucket: "telegraf/autogen")
  |> range(start: -5m)
testing.diff(got: got, want: want)
```

##### Inline diff
```js
import "testing"

want = from(bucket: "backup-telegraf/autogen") |> range(start: -5m)
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> testing.diff(want: want)
```
