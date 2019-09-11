---
title: System built-ins
description: >
  When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
  All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.
aliases:
  - /flux/v0.x/language/built-ins/system-built-ins/
menu:
  flux_0_x:
    name: System built-ins
    parent: Language reference
    weight: 6
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
