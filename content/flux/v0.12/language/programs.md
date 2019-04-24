---
title: Programs
description: A Flux program is a sequence of statements and optionally a package clause and import declarations.
menu:
  flux_0_12:
    parent: Language reference
    name: Programs
    weight: 70
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.

A Flux program is a sequence of statements and optionally a package clause and import declarations.

```
Program = [PackageClause] [ImportList] StatementList .
ImportList = { ImportDeclaration } .
```
