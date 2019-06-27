---
title: System built-ins
description: >
  When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
  All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.
menu:
  flux_0_33:
    name: System built-ins
    parent: Built-ins
    weight: 80
---

When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.

```js
BuiltinStatement = "builtin" identifer ":" TypeExpression
```

##### Example

```js
builtin from : (bucket: string, bucketID: string) -> stream
```
