---
title: Flux guides
description: Helpful guides that walk through both common and complex tasks and use cases for Flux.
menu:
  flux_0_x:
    name: Guides
    weight: 3
---

The following guides walk through both common and complex queries and use cases for Flux.

{{% note %}}
#### Example data variable
Many of the examples provided in the following guides use a `data` variable,
which represents a basic query that filters data by measurement and field.
`data` is defined as:

```js
data = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
```
{{% /note %}}

{{< children >}}
