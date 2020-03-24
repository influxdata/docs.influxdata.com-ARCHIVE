---
title: http.basicAuth() function
description: >
  The `http.basicAuth()` function returns a Base64-encoded basic authentication
  header using a specified username and password combination.
menu:
  flux_0_64:
    name: http.basicAuth
    parent: HTTP
weight: 1
---

The `http.basicAuth()` function returns a Base64-encoded basic authentication
header using a specified username and password combination.

_**Function type:** Miscellaneous_

```js
import "http"

http.basicAuth(
  u: "username",
  p: "passw0rd"
)

// Returns "Basic dXNlcm5hbWU6cGFzc3cwcmQ="
```

## Parameters

### u
The username to use in the basic authentication header.

_**Data type:** String_

### p
The password to use in the basic authentication header.

_**Data type:** String_

## Examples

##### Set a basic authentication header in an HTTP POST request
```js
import "monitor"
import "http"

username = "myawesomeuser"
password = "mySupErSecRetPasSW0rD"

http.post(
  url: "http://myawesomesite.com/api/",
  headers: {Authorization: http.basicAuth(u:username, p:password)},
  data: bytes(v: "something I want to send.")
)
```
