---
title: Adding annotations in Chronograf views
menu:
  chronograf_1_4:
    weight: 70
    parent: Guides
---

## Adding annotations in the Chronograf interface

Annotations in Chronograf are notes of explanation or comments added to graph views by editors or administrators. Annotations can provide Chronograf users with useful contextual information about single points in time or time intervals. Users can use annotations to correlate the effects of important events, such as system changes or outages across multiple metrics, with Chronograf data.

When an annotation is added, a solid white line appears on all graph views for that point in time or an interval of time.

### Annotations example

The following screenshot of five graph views displays annotations for a single point in time and a time interval.
The text and timestamp for the single point in time can be seem above the annotation line in the graph view on the lower right.
The annotation displays "`Deploy v3.8.1-2`" and the time "`2018/28/02 15:59:30:00`".

![Annotations on multiple graph views](/img/chronograf/chrono-annotations-example.png)


**To add an annotation in Chronograf user interface:**



1.


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
