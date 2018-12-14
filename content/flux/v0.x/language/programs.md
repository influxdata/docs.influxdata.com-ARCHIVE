---
title: Programs
description: A Flux program is a sequence of statements defined by the following syntax.
menu:
  flux_0_x:
    parent: Language reference
    name: Programs
    weight: 70
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.


A Flux program is a sequence of statements defined by the following syntax.

```
Program = [PackageStatement] [ImportList] StatementList .
ImportList = { ImportStatement } .
```
