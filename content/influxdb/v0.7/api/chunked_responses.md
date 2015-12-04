---
title: Chunked HTTP Responses
---

If the request asks for a chunked response, JSON objects will get written to the HTTP response as they are ready. They will come in batches in the requested time order. That might look like this:

```json
{
  "name": "a_series",
  "columns": ["time", "sequence_number", "column_a"],
  "points": [
    [1383059590062, 3, 27.3],
    [1383059590062, 4, 97.1]
  ]
}
```

Then followed by

```json
{
  "name": "b_series",
  "columns": ["time", "sequence_number", "column_a"],
  "points": [
    [1383059590062, 2, 2232.1]
  ]
}
```

Then followed by

```json
{
  "name": "a_series",
  "columns": ["time", "sequence_number", "column_a"],
  "points": [
    [1383059590000, 1, 291.7],
    [1383059590000, 2, 44.1]
  ]
}
```

The chunks for different series can be interleaved, but they will always come back in the correct time order. You should use chunked queries when pulling back a large number of data points. If you're just pulling back data for a graph, which should generally have fewer than a few thousand points, non-chunked responses are easiest to work with.
