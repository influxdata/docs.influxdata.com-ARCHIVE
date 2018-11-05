---
title: Representation
description:
menu:
  flux_0_7:
    parent: Flux language
    name: Representation
    weight: 80
---

Source code is encoded in UTF-8.
The text need not be canonicalized.

## Characters

This document will use the term _character_ to refer to a Unicode code point.

The following terms are used to denote specific Unicode character classes:

```
newline        = /* the Unicode code point U+000A */ .
unicode_char   = /* an arbitrary Unicode code point except newline */ .
unicode_letter = /* a Unicode code point classified as "Letter" */ .
unicode_digit  = /* a Unicode code point classified as "Number, decimal digit" */ .
```

In The Unicode Standard 8.0, Section 4.5, "General Category" defines a set of character categories.
Flux treats all characters in any of the Letter categories (Lu, Ll, Lt, Lm, or Lo) as Unicode letters, and those in the Number category (Nd) as Unicode digits.

### Letters and digits

The underscore character `_` (`U+005F`) is considered a letter.

```
letter        = unicode_letter | "_" .
decimal_digit = "0" … "9" .
```
