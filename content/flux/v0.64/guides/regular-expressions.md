---
title: How to use regular expressions in Flux
description: This guide walks through using regular expressions in evaluation logic in Flux functions.
menu:
  flux_0_64:
    name: Regular expressions
    parent: Guides
    weight: 10
---

Regular expressions (regexes) are incredibly powerful when matching patterns in large collections of data.
With Flux, regular expressions are primarily used for evaluation logic in operations such as filtering rows,
dropping and keeping columns, state detection, etc.
This guide shows how to use regular expressions in your Flux scripts.

## Go regular expression syntax
Flux uses Go's [regexp package](https://golang.org/pkg/regexp/) for regular expression search.
The links [below](#helpful-links) provide information about Go's regular expression syntax.

## Regular expression operators
Flux provides two comparison operators for use with regular expressions.

#### `=~`
When the expression on the left **MATCHES** the regular expression on the right, this evaluates to `true`.

#### `!~`
When the expression on the left **DOES NOT MATCH** the regular expression on the right, this evaluates to `true`.

## Regular expressions in Flux
When using regex matching in your Flux scripts, enclose your regular expressions with `/`.
The following is the basic regex comparison syntax:

###### Basic regex comparison syntax
```js
expression =~ /regex/
expression !~ /regex/
```
## Examples

### Use a regex to filter by tag value
The following example filters records by the `cpu` tag.
It only keeps records for which the `cpu` is either `cpu0`, `cpu1`, or `cpu2`.

```js
from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_user" and
    r.cpu =~ /cpu[0-2]/
  )
```

### Use a regex to filter by field key
The following example excludes records that have `_percent` in a field key.

```js
from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r._field !~ /_percent/
  )
```

### Drop columns matching a regex
The following example drops columns whose names do not being with `_`.

```js
from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) => r._measurement == "mem")
  |> drop(fn: (column) => column !~ /_.*/)
```

## Helpful links

##### Syntax documentation
[regexp Syntax GoDoc](https://godoc.org/regexp/syntax)  
[RE2 Syntax Overview](https://github.com/google/re2/wiki/Syntax)

##### Go regex testers
[Regex Tester - Golang](https://regex-golang.appspot.com/assets/html/index.html)  
[Regex101](https://regex101.com/)
