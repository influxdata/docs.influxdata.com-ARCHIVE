---
title: http.post() function
description: >
  The `http.post()` function submits an HTTP POST request to the specified URL with headers and data.
  The HTTP status code is returned.
menu:
  flux_0_65:
    name: http.post
    parent: HTTP
weight: 1
---

The `http.post()` function submits an HTTP POST request to the specified URL with
headers and data and returns the HTTP status code.

_**Function type:** Output_

```js
import "http"

http.post(
  url: "http://localhost:9999/",
  headers: {x:"a", y:"b", z:"c"},
  data: bytes(v: "body")
)
```

## Parameters

### url
The URL to POST to.

_**Data type:** String_

### headers
Headers to include with the POST request.

_**Data type:** Object_

### data
The data body to include with the POST request.

_**Data type:** Bytes_

## Examples

##### Send the last reported status to a URL
```js
import "json"
import "http"

lastReported =
  from(bucket: "telegraf/autogen")
    |> range(start: -1m)
    |> filter(fn: (r) => r._measurement == "statuses")
    |> last()
    |> tableFind(fn: (key) => exists key._level)
    |> getColumn(column: "_level")

http.post(
  url: "http://myawsomeurl.com/api/notify",
  headers: {Authorization: "Bearer mySuPerSecRetTokEn"},
  data: bytes(v: lastReported[0])
)
```
