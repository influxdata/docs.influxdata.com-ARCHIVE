---
title: Flux math package
description: >
  The Flux math package provides basic constants and mathematical functions.
  Import the `math` package.
menu:
  flux_0_33:
    name: Math
    parent: Packages and functions
weight: 2
v2.0/tags: [math, functions]
---

The Flux math package provides basic constants and mathematical functions.
Import the `math` package.

```js
import "math"
```

## Mathematical constants
That `math` package includes the following mathematical constants.

```js
math.e        = 2.71828182845904523536028747135266249775724709369995957496696763 // https ://oeis.org/A001113
math.pi       = 3.14159265358979323846264338327950288419716939937510582097494459 // https ://oeis.org/A000796
math.phi      = 1.61803398874989484820458683436563811772030917980576286213544862 // https ://oeis.org/A001622

math.sqrt2    = 1.41421356237309504880168872420969807856967187537694807317667974 // https ://oeis.org/A002193
math.sqrte    = 1.64872127070012814684865078781416357165377610071014801157507931 // https ://oeis.org/A019774
math.sqrtpi   = 1.77245385090551602729816748334114518279754945612238712821380779 // https ://oeis.org/A002161
math.sqrtphi  = 1.27201964951406896425242246173749149171560804184009624861664038 // https ://oeis.org/A139339

math.ln2      = 0.693147180559945309417232121458176568075500134360255254120680009 // https://oeis.org/A002162
math.log2e    = 1 ÷ math.ln2
math.ln10     = 2.30258509299404568401799145468436420760110148862877297603332790 // https ://oeis.org/A002392
math.log10e   = 1 ÷ math.ln10

math.maxfloat = 1.797693134862315708145274237317043567981e+308 // 2**1023 * (2**53 - 1) / 2**52
math.maxint   = 1<<63 - 1
math.minint   = -1 << 63
math.maxuint  = 1<<64 - 1
```

## Mathematical functions
{{< function-list >}}
