---
title: Creating alerts based on two measurements
menu:
  kapacitor_1_5:
    name: Alerts based on two measurements
    identifier: two-measurement-alert
    weight: 20
    parent: guides
---

Kapacitor allows you to create alerts based on two or more measurements.
In this guide, we are going to compare two measurements, `m1` and `m2`, and create
and create an alert whenever the two measurements are different.
As an added bonus, we'll also include a query that can be used to graph the percentage
difference between the two measurements.

## Comparing measurements and creating an alert
The following TICKscript streams the `m1` and `m2` measurements, joins them, compares them,
and alerts if the two measurements are different.

```js
var window_size = 1m

// Stream m1
var m1 = stream
  |from()
    .measurement('m1')
  |window()
    .period(window_size)
    .every(window_size)
    .align()
  |count('value')
    .as('value')

// Stream m2
var m2 = stream
  |from()
    .measurement('m2')
  |window()
    .period(window_size)
    .every(window_size)
    .align()
  |count('value')
    .as('value')

// Join m1 and m2
var data = m1
    |join(m2)
        .as('m1', 'm2')

// Compare the joined stream and alert when m1 and m2 values are different
data
  |alert()
    .crit(lambda: "m1.value" != "m2.value")
    .message('values were not equal m1 value is {{ index .Fields "m1.value" }} m2 value is {{ index .Fields "m2.value" }}')
```



### The full TICKscript
```js
var window_size = 1m

var m1 = stream
  |from()
    .measurement('m1')
  |window()
    .period(window_size)
    .every(window_size)
    .align()
  |count('value')
    .as('value')

var m2 = stream
  |from()
    .measurement('m2')
  |window()
    .period(window_size)
    .every(window_size)
    .align()
  |count('value')
    .as('value')

var data = m1
  |join(m2)
    .as('m1', 'm2')

data
  |alert()
    .crit(lambda: "m1.value" != "m2.value")
    .message('values were not equal m1 value is {{ index .Fields "m1.value" }} m2 value is {{ index .Fields "m2.value" }}')

data
  |eval(lambda: "m1.value" - "m2.value")
    .as('value_diff')
    .keep()
  |eval(lambda: (float("value_diff") / float("m1.value")) * 100.0, lambda: (float("value_diff") / float("m2.value")) * 100.0)
    .as('diff_percentage_m1', 'diff_percentage_m2')
  |influxDBOut()
    .measurement('diffs')
    .database('mydb')
    .create()
```
