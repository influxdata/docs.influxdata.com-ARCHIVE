---
title: Flux language reference
description: Covers the current and future Flux functional data scripting language, which is designed for querying, analyzing, and acting on time series data.
menu:
  flux_0_33:
    name: Language reference
    weight: 5
---

The following document specifies the Flux language and query execution.

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.


The Flux language is centered on querying and manipulating time series data.

### Notation
The syntax of the language is specified using [Extended Backus-Naur Form (EBNF)](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form):

    Production  = production_name "=" [ Expression ] "." .
    Expression  = Alternative { "|" Alternative } .
    Alternative = Term { Term } .
    Term        = production_name | token [ "…" token ] | Group | Option | Repetition .
    Group       = "(" Expression ")" .
    Option      = "[" Expression "]" .
    Repetition  = "{" Expression "}" .

Productions are expressions constructed from terms and the following operators, in increasing precedence:

    |   alternation
    ()  grouping
    []  option (0 or 1 times)
    {}  repetition (0 to n times)

Lower-case production names are used to identify lexical tokens.
Non-terminals are in Camel case.
Lexical tokens are enclosed in double quotes (`""`) or back quotes (``).
