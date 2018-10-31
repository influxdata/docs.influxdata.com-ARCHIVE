---
title: Flux syntax basics
description: An introduction to the basic elements of the Flux syntax with real-world application examples.
menu:
  flux_0_7:
    name: Syntax basics
    parent: get-started
    weight: 3
---


Flux, at its core, is scripting language, but designed specifically for working with time series data.
To illustrate this, this guide walks through a handful of simple expressions and what they mean in Flux.

## Use the influx CLI
Use the `influx` CLI in "Flux mode" when following this guide.
When started with `-type=flux`, the `influx` CLI is an interactive read-eval-print-loop (REPL) that supports Flux syntax.

##### Start in the influx CLI in Flux mode
```bash
influx -type=flux
```

> If using the [InfluxData Sandbox](/platform/installation/sandbox-install), use the
> `./sandbox enter` command console into the `influxdb` container, where you can run `influx -type=flux`.
>
```bash
./sandbox enter influxdb

root@9bfc3c08579c:/# influx -type=flux
```

## Basic Flux syntax
The code blocks below provide commands that illustrate the basic syntax of Flux
that should be run in the `influx` shell in Flux mode.

### Simple expressions
Flux is a scripting language and so basic expressions are supported.
For example here is a simple addition:

```js
> 1 + 1
2
```

### Variables
You can assign expressions to a variable.

```js
> s = "this is a string"
> i = 1 // an integer
> f = 2.0 // a floating point number
```

Typing in the name of a variable will print its value:

```js
> s
this is a string
> i
1
> f
2
```

### Objects
Flux also supports objects. Each value in an object can be a different type.

```js
> o = {name:"Jim", age: 42}
```

Access a property of an object using dot notation:

```js
> o.name
Jim
> o.age
42
```

### Lists
Flux supports lists. List values must be the same type.

```js
> l = [1,2,3,i]
> l
[1, 2, 3, 1]
```

### Functions
Flux uses functions for most of its heavy lifting.
Here is a simple function that squares the number passed using the `n` parameter.

```js
> square = (n) => n * n
> square(n:3)
9
```

> Flux does not have support positional arguments or parameters.
> Parameters must always be named.

## Real-world application of basic syntax
This likely seems familiar if you've already been through through the other [getting started guides](/flux/v0.7/introduction/getting-started), which is by design.
Flux's syntax is inspired by Javascript and other functional scripting languages.
As you begin to apply these basic principles in real use cases such as creating data stream variables,
custom functions, etc., the power of Flux and it's ability to query and process time series data is apparent.

The examples below provide both multi-line and single-line versions of each input command.
Carriage returns in Flux aren't necessary, but do help with readability.
Both single- and multi-line commands can be copied and pasted into the `influx` CLI running in FLux mode.

{{< tab-labels >}}
  {{% tabs %}}
  [Multi-line inputs](#)
  [Single-line inputs](#)
  {{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}
### Define data stream variables
A common use case for variable assignments in Flux is creating variables for multiple filtered input data streams.

```js
timeRange = -1h

cpuUsageUser = from(bucket:"telegraf/autogen")
  |> range(start: timeRange)
  |> filter(fn: (row) =>
    row._measurement == "cpu" AND
    row._field == "usage_user" AND
    row.cpu == "cpu-total"
  )

memUsagePercent = from(bucket:"telegraf/autogen")
  |> range(start: timeRange)
  |> filter(fn: (row) =>
    row._measurement == "mem" AND
    row._field == "used_percent"
  )
```

These variables can be used in other functions, such as  `join()`, while keeping the syntax minimal and flexible.

### Define custom functions
Let's create a function that returns the `N` number rows in the input data stream with the highest `_value`s.
To do this, pass the input stream (`table`) and the number of results to return (`n`) into a custom function.
Then using Flux's `sort()` and `limit()` functions to find the top `n` results in the data set.

```js
topN = (table=<-, n) => table
  |> sort(desc: true)
  |> limit(n: n)
```

_More information about creating custom functions is available in the [Custom functions](#) documentation._

Using the `cpuUsageUser` data stream variable defined above, find the top five data
points with the custom `topN` function and yield the results.

```js
cpuUsageUser
  |> topN(n:5)
  |> yield()
```
{{% /tab-content %}}

{{% tab-content %}}
### Define data stream variables
A common use case for variable assignments in Flux is creating variables for multiple filtered input data streams.

```js
timeRange = -1h
cpuUsageUser = from(bucket:"telegraf/autogen") |> range(start: timeRange) |> filter(fn: (row) => row._measurement == "cpu" AND row._field == "usage_user" AND row.cpu == "cpu-total")
memUsagePercent = from(bucket:"telegraf/autogen") |> range(start: timeRange) |> filter(fn: (row) => row._measurement == "mem" AND row._field == "used_percent")
```

These variables can be used in other functions, such as  `join()`, while keeping the syntax minimal and flexible.

### Define custom functions
Let's create a function that returns the `N` number rows in the input data stream with the highest `_value`s.
To do this, pass the input stream (`table`) and the number of results to return (`n`) into a custom function.
Then using Flux's `sort()` and `limit()` functions to find the top `n` results in the data set.

```js
topN = (table=<-, n) => table |> sort(desc: true) |> limit(n: n)
```

_More information about creating custom functions is available in the [Custom functions](#) documentation._

Using the `cpuUsageUser` data stream variable defined [above](#define-data-stream-variables),
Find the top five data points with the custom `topN` function and yield the results.

```js
cpuUsageUser |> topN(n:5) |> yield()
```
{{% /tab-content %}}
{{< /tab-content-container >}}
{{< /tab-labels >}}

This query will return the five data points with the highest user CPU usage over the last hour.

<div class="page-nav-btns">
  <a class="btn prev" href="/flux/v0.7/introduction/getting-started/transform-data/">Transform your data</a>
</div>
