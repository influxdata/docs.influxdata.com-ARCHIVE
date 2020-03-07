---
title: http.endpoint() function
description: >
  The `http.endpoint()` function sends output data to an HTTP URL using the POST request method.
menu:
  flux_0_x:
    name: http.endpoint
    parent: HTTP
weight: 1
---

The `http.endpoint()` function sends output data to an HTTP URL using the POST request method.

_**Function type:** Output_

```js
import "http"

http.endpoint(
  url: "http://localhost:1234/"
)
```

## Parameters

### url
The URL to POST to.

_**Data type:** String_

### mapFn
A function that builds the object used to generate the POST request.

{{% note %}}
_You should rarely need to override the default `mapFn` parameter.
To see the default `mapFn` value or for insight into possible overrides, view the
[`http.endpoint()` source code](https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux)._
{{% /note %}}

_**Data type:** Function_

The returned object must include the following fields:

- `headers`
- `data`

_For more information, see [`http.post()`](/v2.0/reference/flux/stdlib/http/post/)_
