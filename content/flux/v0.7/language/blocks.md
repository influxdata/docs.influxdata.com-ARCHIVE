---
title: Blocks
description:
menu:
  flux_0_7:
    parent: Language reference
    name: Blocks
    weight: 30
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.

A _block_ is a possibly empty sequence of statements within matching braces (`{}`).

```
Block = "{" StatementList "} .
StatementList = { Statement } .
```

In addition to _explicit blocks_ in the source code, there are _implicit blocks_:

1. The _options block_ is the top-level block for all Flux programs. All option declarations are contained in this block.
2. The _universe block_ encompasses all Flux source text aside from option statements. It is nested directly inside of the _options block_.
3. Each package has a _package block_ containing all Flux source text for that package.
4. Each file has a _file block_ containing all Flux source text in that file.
5. Each function literal has its own _function block_ even if not explicitly declared.

Blocks nest and influence scoping.
