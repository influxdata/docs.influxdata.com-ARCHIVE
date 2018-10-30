---
title: Flux syntax basics
description:
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

<div class="page-nav-btns">
  <a class="btn prev" href="/flux/v0.7/introduction/getting-started/transform-data/">Transform your data</a>
</div>
