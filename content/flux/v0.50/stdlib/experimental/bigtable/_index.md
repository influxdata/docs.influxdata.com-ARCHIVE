---
title: Flux Bigtable package
description: >
  The Flux Bigtable package provides tools for working with data in Google Cloud Bigtable databases.
  Import the `experimental/bigtable` package.
menu:
  flux_0_50:
    name: Bigtable
    parent: Experimental
weight: 1
---

The Flux Bigtable package provides tools for working with data in
[Google Cloud Bigtable](https://cloud.google.com/bigtable/) databases.

{{% warn %}}
The Bigtable package is currently experimental and subject to change at any time.
By using this package, you accept the [risks of experimental functions](/flux/v0.50/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

Import the `experimental/bigtable` package:

```js
import "experimental/bigtable"
```

{{< children type="functions" >}}
