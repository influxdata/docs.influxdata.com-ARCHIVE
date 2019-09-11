---
title: Packages
description: >
  Flux source is organized into packages.
  A package consists of one or more source files.
  Each source file is parsed individually and composed into a single package.
aliases:
  - /flux/v0.36/language/programs
menu:
  flux_0_36:
    parent: Language reference
    name: Packages
    weight: 70
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.

Flux source is organized into packages.
A package consists of one or more source files.
Each source file is parsed individually and composed into a single package.

```js
File = [ PackageClause ] [ ImportList ] StatementList .
ImportList = { ImportDeclaration } .
```

## Package clause

```js
PackageClause = "package" identifier .
```

A _package clause_ defines the name for the current package.
Package names must be valid Flux identifiers.
The package clause must be at the beginning of any Flux source file.
All files in the same package must declare the same package name.
When a file does not declare a package clause, all identifiers in that
file will belong to the special `main` package.

> [IMPL#247](https://github.com/influxdata/platform/issues/247) Add package/namespace support.

### Package main

The `main` package is special for a few reasons:

1. It defines the entry point of a Flux program.
2. It cannot be imported.
3. All statements are marked as producing side effects.

## Package initialization

Packages are initialized in the following order:

1. All imported packages are initialized and assigned to their package identifier.
2. All option declarations are evaluated and assigned regardless of order. An option cannot have a dependency on another option assigned in the same package block.
3. All variable declarations are evaluated and assigned regardless of order. A variable cannot have a direct or indirect dependency on itself.
4. Any package side effects are evaluated.

A package will only be initialized once across all file blocks and across all packages blocks regardless of how many times it is imported.

Initializing imported packages must be deterministic.
Specifically after all imported packages are initialized, each option must be assigned the same value.
Packages imported in the same file block are initialized in declaration order.
Packages imported across different file blocks have no known order.
When a set of imports modify the same option, they must be ordered by placing them in the same file block.
