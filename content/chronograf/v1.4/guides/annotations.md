---
title: Adding annotations in Chronograf views
menu:
  chronograf_1_4:
    weight: 70
    parent: Guides
---

## Adding annotations in the Chronograf interface


**To add an annotation in Chronograf user interface:**



## Adding annotations programmatically to Chronograf


**To add an annotation to Chronograf:**

1. Add a record to the chronograf database specifying all of the following fields:

* `database`: must be `chronograf`
* `id`:
* `deleted`: Boolean if annotation is deleted or not
  - if true, then annotation is not displayed
* `start_time`: Must be an integer. You must include an `i` as a suffix for the integer; otherwise, a floating point is assumed.
  - RFC 3339 with millisecond preciscio
  - Example: 12345i
* `modified_time_ns`: Integer specifying nanoseconds. UNIX Epoch time that is time of the latest modification to this annotation.
* `text`:
* `type`: Intended for future use.
