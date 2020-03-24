---
title: String interpolation
description: >
  Flux string interpolation evaluates string literals containing one or more placeholders
  and returns a result with placeholders replaced with their corresponding values.
menu:
  flux_0_64:
    parent: Language reference
    name: String interpolation
    weight: 11
---

Flux string interpolation evaluates string literals containing one or more placeholders
and returns a result with placeholders replaced with their corresponding values.

## String interpolation syntax
To use Flux string interpolation, enclose embedded [expressions](/flux/v0.64/language/expressions/)
in a dollar sign and curly braces `${}`.
Flux replaces the content between the braces with the result of the expression and
returns a string literal.

```js
name = "John"
"My name is ${name}."
// My name is John.
```

{{% note %}}
#### Flux only interpolates string values
Flux currently interpolates only string values ([IMP#1775](https://github.com/influxdata/flux/issues/1775)).
Use the [string() function](/flux/v0.64/stdlib/built-in/transformations/type-conversions/string/)
to convert non-string values to strings.

```js
count = 12
"I currently have ${string(v: count)} cats."
```
{{% /note %}}


## Use dot notation to interpolate object values
[Objects](/flux/v0.64/language/expressions/#object-literals) consist of key-value pairs.
Use [dot notation](/flux/v0.64/language/expressions/#member-expressions)
to interpolate values from an object.

```js
person = {
  name: "John",
  age: 42
}
"My name is ${person.name} and I'm ${string(v: person.age)} years old."
// My name is John and I'm 42 years old.
```

Flux returns each record in query results as an object.
In Flux row functions, each row object is represented by `r`.
Use dot notation to interpolate specific column values from the `r` object.

##### Use string interpolation to add a human-readable message
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> map(fn: (r) => ({
      r with
      human-readable: "${r._field} is ${r._value} at ${string(v: r._time)}."
  }))
```

## String interpolation versus concatenation
Flux supports both string interpolation and string concatenation.
String interpolation is a more concise method for achieving the same result.

```js
person = {
  name: "John",
  age: 42
}

// String interpolation
"My name is ${person.name} and I'm ${string(v: person.age)} years old."

// String concatenation
"My name is " + person.name + " and I'm " + string(v: person.age) + " years old."

// Both return: My name is John and I'm 42 years old.
```
