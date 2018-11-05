---
title: Request format
description:
menu:
  flux_0_7:
    parent: Request-response formats
    name: Request formats
    weight:
---

To submit a query for execution, make an HTTP POST request to the `/v2/query` endpoint.

The POST request may either submit parameters as the POST body or a subset of the parameters as URL query parameters.
The following parameters are supported:

| Parameter | Description                                                                                                                                       |
| --------- | -----------                                                                                                                                       |
| query     | Query is Flux text describing the query to run.  Only one of `query` or `spec` may be specified. This parameter may be passed as a URL parameter. |
| spec      | Spec is a query specification. Only one of `query` or `spec` may be specified.                                                                    |
| dialect   | Dialect is an object defining the options to use when encoding the response.                                                                      |


When using the POST body to submit the query, the `Content-Type` HTTP header must contain the name of the request encoding being used.

Supported request content types:

* `application/json` - Use a JSON encoding of parameters.



Multiple response content types will be supported.
The desired response content type is specified using the `Accept` HTTP header on the request.
Each response content type will have its own dialect options.

Supported response encodings:

* `test/csv` - Corresponds with the MIME type specified in [RFC 4180](https://tools.ietf.org/html/rfc4180).
    Details on the encoding format are specified below.

If no `Accept` header is present, it is assumed that `text/csv` was specified.
The HTTP header `Content-Type` of the response will specify the encoding of the response.

## Examples requests

Make a request using a query string and URL query parameters:

```
POST /v2/query?query=%20from%28db%3A%22mydatabse%22%29%20%7C%3E%20last%28%29 HTTP/1.1
```

Make a request using a query string and the POST body as JSON:

```
POST /v2/query


{
    "query": "from(bucket:\"mydatabase/autogen\") |> last()"
}
```

Make a request using a query specification and the POST body as JSON:

```
POST /v2/query


{
    "spec": {
      "operations": [
        {
          "kind": "from",
          "id": "from0",
          "spec": {
            "db": "mydatabase"
          }
        },
        {
          "kind": "last",
          "id": "last1",
          "spec": {
            "column": ""
          }
        }
      ],
      "edges": [
        {
          "parent": "from0",
          "child": "last1"
        }
      ],
      "resources": {
        "priority": "high",
        "concurrency_quota": 0,
        "memory_bytes_quota": 0
      }
    }
}
```

Make a request using a query string and the POST body as JSON.
Dialect options are specified for the `text/csv` format.
See below for details on specific dialect options.

```
POST /v2/query


{
    "query": "from(bucket:\"mydatabase/autogen\") |> last()",
    "dialect" : {
        "header": true,
        "annotations": ["datatype"]
    }
}
```
