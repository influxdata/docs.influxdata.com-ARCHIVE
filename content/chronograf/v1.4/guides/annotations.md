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

1. Click the **Edit** button ("pencil" icon) on the graph view.
2. Click **Add Annotation** to add an annotation.
3. Move cursor to point of time and click or drag cursor to set an annotation.
4. Click **Edit** again and then click **Edit Annotation**.
5. Click the cursor on the annotation point or interval. The annotation text box appears above the annotation point or interval.
6. Click on `Name Me` in the annotation and type a note or comment.
7. Click **Done Editing**.
8. Your annotation is now available in all graph views.

## Adding annotations programmatically to Chronograf

When an annotation is made using the Chronograf user interface, an annotation record is saved into the `chronograf` database. You can use the Influx CLI to enter an annotation.

* `database`: `chronograf`
* `id`:
* `deleted`: Boolean value. `true` if annotation is deleted; `false` if annotation is not deleted.
  - if `true`, then the annotation is not displayed
* `start_time`: Integer. Annotation start timestamp in nanoseconds (using UNIX Epoch time). Include an `i` as a suffix to designate integer. If `i` is not added, a floating point is assumed.
  - RFC 3339 with millisecond preciscio
  - Example: 12345i
* `modified_time_ns`: Integer. Modified time, in nanoseconds (using UNIX Epoch time), of the last modification to the annotation.
* `text`: Text note or comment displayed to users.
* `type`: Not currently used. Intended for future use.

> **Note:** If 

**Syntax:**

```
CUR_UNIX_TIME=$(date +'%s')000000000 influx -database chronograf -execute "insert annotations,id=<annotation_ID>,deleted=false|true,start_time=${CUR_UNIX_TIME}i,modified_time_ns=${CUR_UNIX_TIME}i,text=\"sp🚀 ces\",type=\"mytype\" ${CUR_UNIX_TIME}"
```

**Example:**

```
CUR_UNIX_TIME=$(date +'%s')000000000 influx -database chronograf -execute "insert annotations,id=myid,deleted=false,start_time=${CUR_UNIX_TIME}i,modified_time_ns=${CUR_UNIX_TIME}i,text=\"sp🚀 ces\",type=\"mytype\" ${CUR_UNIX_TIME}"
```

**To add an annotation to Chronograf using the CLI:**

1. Launch
1. Add a record to the chronograf database specifying all of the following fields:
