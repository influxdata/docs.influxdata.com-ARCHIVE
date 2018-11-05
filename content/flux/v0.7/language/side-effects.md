---
title: Side effects
description:
menu:
  flux_0_7:
    parent: Flux language
    name: Side effects
    weight: 90
---

Side effects can occur in one of two ways.

1. By reassigning builtin options
2. By calling a function that produces side effects

A function produces side effects when it is explicitly declared to have side effects or when it calls a function that itself produces side effects.
