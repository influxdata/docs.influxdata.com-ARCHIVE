---
title: assertEquals() function
description: The assertEquals() function tests whether two streams have identical data.
menu:
  flux_0_x:
    name: assertEquals
    parent: Tests
    weight: 1
---

The `assertEquals()` function tests whether two streams have identical data.
If equal, the function outputs the tested data stream unchanged.
If unequal, the function outputs an error.

_**Function type:** Test_  

```js
assertEquals(
  name: "streamEquality",
  got: got,
  want: want
)
```

_The `assertEquals()` function can be used to perform in-line tests in a query._

## Parameters

## name
Unique name given to the assertion.

_**Data type:** String_

## got
The stream containing data to test.
Defaults to data piped forward from another function (`<-`).

_**Data type:** Object_

## want
The stream that contains the expected data to test against.

_**Data type:** Object_


## Examples

##### Assert of separate streams
```js
want = from(bucket: "backup-telegraf/autogen")
  |> range(start: -5m)

got = from(bucket: "telegraf/autogen")
  |> range(start: -5m)

assertEquals(got: got, want: want)
```

##### Inline assertion
```js
want = from(bucket: "backup-telegraf/autogen")
  |> range(start: -5m)

from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> assertEquals(want: want)
```
