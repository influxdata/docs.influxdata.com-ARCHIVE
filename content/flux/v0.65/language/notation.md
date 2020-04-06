---
title: Notation
description: Notation principles for the Flux functional data scripting language.
menu:
  flux_0_65:
    parent: Language reference
    name: Notation
    weight: 60
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.

The syntax of the language is specified using [Extended Backus-Naur Form (EBNF)](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form):

```
Production  = production_name "=" [ Expression ] "." .
Expression  = Alternative { "|" Alternative } .
Alternative = Term { Term } .
Term        = production_name | token [ "…" token ] | Group | Option | Repetition .
Group       = "(" Expression ")" .
Option      = "[" Expression "]" .
Repetition  = "{" Expression "}" .
```

A _production_ is an expression constructed from terms and the following operators, in increasing precedence:

```
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

Lowercase production names are used to identify lexical tokens.
Non-terminals are in [camel case](https://en.wikipedia.org/wiki/Camel_case).
Lexical tokens are enclosed in double quotes (`""`) or back quotes (``).
