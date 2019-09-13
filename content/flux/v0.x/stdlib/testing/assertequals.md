---
title: testing.assertEquals() function
description: The testing.assertEquals() function tests whether two streams have identical
  data.
aliases:
  - /flux/v0.x/functions/tests/assertequals
  - /flux/v0.x/functions/testing/assertequals/
menu:
  flux_0_x:
    name: testing.assertEquals
    parent: Testing
weight: 1
---

The `testing.assertEquals()` function tests whether two streams have identical data.
If equal, the function outputs the tested data stream unchanged.
If unequal, the function returns an error.

```js
import "testing"

testing.assertEquals(
  name: "streamEquality",
  got: got,
  want: want
)
```

_The `testing.assertEquals()` function can be used to perform in-line tests in a query._

## Parameters

### name
Unique name given to the assertion.

_**Data type:** String_

### got
The stream containing data to test.
Defaults to piped-forward data (`<-`).

_**Data type:** Object_

### want
The stream that contains the expected data to test against.

_**Data type:** Object_


## Examples

##### Assert of separate streams
```js
import "testing"

want = from(bucket: "backup-telegraf/autogen")
  |> range(start: -5m)

got = from(bucket: "telegraf/autogen")
  |> range(start: -5m)

testing.assertEquals(got: got, want: want)
```

##### Inline assertion
```js
import "testing"

want = from(bucket: "backup-telegraf/autogen")
  |> range(start: -5m)

from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> testing.assertEquals(want: want)
```
