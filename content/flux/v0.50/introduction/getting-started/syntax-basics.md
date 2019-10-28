---
title: Flux syntax basics
description: An introduction to the basic elements of the Flux syntax with real-world application examples.
menu:
  flux_0_50:
    name: Syntax basics
    parent: get-started
    weight: 3
---


Flux, at its core, is a scripting language designed specifically for working with data.
This guide walks through a handful of simple expressions and how they are handled in Flux.

## Use the influx CLI
Use the `influx` CLI in "Flux mode" as you follow this guide.
When started with `-type=flux`, the `influx` CLI is an interactive read-eval-print-loop (REPL) that supports Flux syntax.

##### Start in the influx CLI in Flux mode
```bash
influx -type=flux
```

> If using the [InfluxData Sandbox](/platform/install-and-deploy/deploying/sandbox-install), use the `./sandbox enter`
> command to enter the `influxdb` container, where you can start the `influx` CLI in Flux mode.
> You will also need to specify the `host` as `influxdb` to connect to InfluxDB over the Docker network.
>
```bash
./sandbox enter influxdb

root@9bfc3c08579c:/# influx -host influxdb -type=flux
```

## Basic Flux syntax
The code blocks below provide commands that illustrate the basic syntax of Flux.
Run these commands in the `influx` CLI's Flux REPL.

### Simple expressions
Flux is a scripting language that supports basic expressions.
For example, simple addition:

```js
> 1 + 1
2
```

### Variables
Assign an expression to a variable using the assignment operator, `=`.

```js
> s = "this is a string"
> i = 1 // an integer
> f = 2.0 // a floating point number
```

Type the name of a variable to print its value:

```js
> s
this is a string
> i
1
> f
2
```

### Objects
Flux also supports objects. Each value in an object can be a different data type.

```js
> o = {name:"Jim", age: 42}
```

Use dot notation to access a properties of an object :

```js
> o.name
Jim
> o.age
42
```

### Lists
Flux supports lists. List values must be the same type.

```js
> n = 4
> l = [1,2,3,n]
> l
[1, 2, 3, 4]
```

### Functions
Flux uses functions for most of its heavy lifting.
Below is a simple function that squares a number, `n`.

```js
> square = (n) => n * n
> square(n:3)
9
```

> Flux does not support positional arguments or parameters.
> Parameters must always be named when calling a function.

### Pipe-forward operator
Flux uses the pipe-forward operator (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function where they are further processed or manipulated.

```js
data |> someFunction() |> anotherFunction()
```

## Real-world application of basic syntax
This likely seems familiar if you've already been through through the other [getting started guides](/flux/v0.50/introduction/getting-started).
Flux's syntax is inspired by Javascript and other functional scripting languages.
As you begin to apply these basic principles in real-world use cases such as creating data stream variables,
custom functions, etc., the power of Flux and its ability to query and process data will become apparent.

The examples below provide both multi-line and single-line versions of each input command.
Carriage returns in Flux aren't necessary, but do help with readability.
Both single- and multi-line commands can be copied and pasted into the `influx` CLI running in Flux mode.

{{< tab-labels >}}
  {{% tabs %}}
  [Multi-line inputs](#)
  [Single-line inputs](#)
  {{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}
### Define data stream variables
A common use case for variable assignments in Flux is creating variables for one
or more input data streams.

```js
timeRange = -1h

cpuUsageUser =
  from(bucket:"telegraf/autogen")
    |> range(start: timeRange)
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_user" and
      r.cpu == "cpu-total"
    )

memUsagePercent =
  from(bucket:"telegraf/autogen")
    |> range(start: timeRange)
    |> filter(fn: (r) =>
      r._measurement == "mem" and
      r._field == "used_percent"
    )
```

These variables can be used in other functions, such as  `join()`, while keeping the syntax minimal and flexible.

### Define custom functions
Create a function that returns the `N` number rows in the input stream with the highest `_value`s.
To do this, pass the input stream (`tables`) and the number of results to return (`n`) into a custom function.
Then using Flux's `sort()` and `limit()` functions to find the top `n` results in the data set.

```js
topN = (tables=<-, n) =>
  tables
    |> sort(desc: true)
    |> limit(n: n)
```

_More information about creating custom functions is available in the [Custom functions](/flux/v0.50/stdlib/custom-functions) documentation._

Using this new custom function `topN` and the `cpuUsageUser` data stream variable defined above,
find the top five data points and yield the results.

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
cpuUsageUser = from(bucket:"telegraf/autogen") |> range(start: timeRange) |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_user" and r.cpu == "cpu-total")
memUsagePercent = from(bucket:"telegraf/autogen") |> range(start: timeRange) |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
```

These variables can be used in other functions, such as  `join()`, while keeping the syntax minimal and flexible.

### Define custom functions
Let's create a function that returns the `N` number rows in the input data stream with the highest `_value`s.
To do this, pass the input stream (`tables`) and the number of results to return (`n`) into a custom function.
Then using Flux's `sort()` and `limit()` functions to find the top `n` results in the data set.

```js
topN = (tables=<-, n) => tables |> sort(desc: true) |> limit(n: n)
```

_More information about creating custom functions is available in the [Custom functions](/flux/v0.50/stdlib/custom-functions) documentation._

Using the `cpuUsageUser` data stream variable defined [above](#define-data-stream-variables),
find the top five data points with the custom `topN` function and yield the results.

```js
cpuUsageUser |> topN(n:5) |> yield()
```
{{% /tab-content %}}
{{< /tab-content-container >}}
{{< /tab-labels >}}

This query will return the five data points with the highest user CPU usage over the last hour.

<div class="page-nav-btns">
  <a class="btn prev" href="/flux/v0.50/introduction/getting-started/transform-data/">Transform your data</a>
</div>
