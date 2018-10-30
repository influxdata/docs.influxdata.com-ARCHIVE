---
title: Notation
description:
menu:
  flux_0_7:
    parent: Flux language
    name: Notation
    weight:
---

The syntax of the language is specified using Extended Backus-Naur Form (EBNF):

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
Non-terminals are in CamelCase.
Lexical tokens are enclosed in double quotes "" or back quotes \`\`.
