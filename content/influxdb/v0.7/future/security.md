---
title: Security Enhancements
---

Should it be possible to limit a user's permissions for reads and writes
so they can only write specific values for a given column or request a
subset of series data?

```json
{
  "readPermissions": [
    {
      "matcher": ".*"
    },
    {
      "name": "customer_events",
      "whereClause": "where customer_id = 3"
    }
  ],
  "writePermissions": [
    {
      "name": "customer_events",
      "valueRestrictions": {
        "customer_id": 3
      }
    }
  ]
}
```

In this example we have a user that is allowed to read from any time
series, but when reading from `customer_events`, they will only be
able to see events that have a `customer_id` of `3`. The user is only
able to write to the `customer_events` time series, but the only value
they can write to the `customer_id` column is `3`. This would let you
have multiple users writing into the same analytics series without
exposing their data to each other.

