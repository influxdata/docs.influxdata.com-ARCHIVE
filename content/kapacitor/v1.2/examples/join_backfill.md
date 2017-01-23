---
title: Calculate Rates across joined series + Backfill

menu:
  kapacitor_1_1:
    name: Calculate Rates Across Series
    identifier: join_backfill
    weight: 0
    parent: examples
---

Often times we have set of series where each series is counting a particular event.
Using Kapacitor we can join those series and calculate a combined value.

Let's say we have two measurements:

* `errors` -- the number of page views that had an error.
* `views` -- the number of page views that had no errror.

Both measurements exist in a database called `pages` and in the retention policy `autogen`.

We want to know the percent of page views that resulted in an error.
The process is to select both existing measurements join them and calculate the percentage.
Then to store the data back into InfluxDB as a new measurement.

### Joining with batch data

We need to query the two measurements, `errors` and `views`.
```javascript
// Get errors batch data
var errors = batch
    |query('SELECT sum(value) FROM "pages"."autogen".errors')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)

// Get views batch data
var views = batch
    |query('SELECT sum(value) FROM "pages"."autogen".views')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)
```

The join process skips points that do not have a matching point in time from the other source.
As a result it is important to both `groupBy` and `fill` the data while joining batch data.
Grouping the data by time ensures that each source has data points at consistent time values.
Filling the data ensures every point will have a match with a sane default.

Now that we have two batch sources for each measurement we need to join them like so.

```javascript
// Join errors and views
errors
    |join(views)
        .as('errors', 'views')
```

The data is joined by time, meaning that as pairs of batches arrive from each source
they will be combined into a single batch.
As a result the fields from each source need to
be renamed to properly namespace the fields.
This is done via the `.as('errors', 'views')` line.
In this example each measurement has only one field named `sum`, the joined fields will be called
`errors.sum` and `views.sum` respectively.

Now that the data is joined we can calculate the percentage.
Using the new names for the fields we can write this expression to calculate our desired percentage.

```javascript
    //Calculate percentage
    |eval(lambda: "errors.sum" / ("views.sum" + "errors.sum"))
        // Give the resulting field a name
        .as('value')

```

 Finally we want to store this data back into InfluxDB.

```javascript
    |influxDBOut()
        .database('pages')
        .measurement('error_percent')

```

Here is the complete TICKscript for the batch task:

```javascript
// Get errors batch data
var errors = batch
    |query('SELECT sum(value) FROM "pages"."autogen".errors')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)

// Get views batch data
var views = batch
    |query('SELECT sum(value) FROM "pages"."autogen".views')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)

// Join errors and views
errors
    |join(views)
        .as('errors', 'views')
    //Calculate percentage
    |eval(lambda: "errors.sum" / ("views.sum" + "errors.sum"))
        // Give the resulting field a name
        .as('value')
    |influxDBOut()
        .database('pages')
        .measurement('error_percent')

```

### Backfill
Now for a fun little trick.
Using Kapacitor's record/replay actions we can actually run this TICKscript on historical data.
First save the above script as `error_percent.tick` and define it.
Then create a recording for the past time frame we want.

```bash
kapacitor define error_percent \
    -type batch \
    -tick error_percent.tick \
    -dbrp pages.autogen
kapacitor record batch -task error_percent -past 1d
```

Grab the recording ID and replay the historical data against the task.
Here we specify the `-rec-time` flag to instruct Kapacitor to use the actual
time stored in the recording when processing the data instead of adjusting to the present time.

```bash
kapacitor replay -task error_percent -recording RECORDING_ID -rec-time
```

If the data set is too large to keep in one recording you can define a specific range of time to record
and then replay each range individually.

```bash
rid=$(kapacitor record batch -task error_percent -start 2015-10-01 -stop 2015-10-02)
echo $rid
kapacitor replay -task error_percent -recording $rid -rec-time
kapacitor delete recordings $rid
```

Just loop through the above script for each time window and reconstruct all the historical data you need.
With that we now have the error_percent every minute backfilled for the historical data we had.

If you would like to try out this example case there are scripts [here](https://github.com/influxdb/kapacitor/blob/master/examples/error_percent/) that create test data and backfill the data using Kapacitor.

### Stream method
To do the same for the streaming case the TICKscript is very similar:

```javascript
// Get errors stream data
var errors = stream
    |from()
        .measurement('errors')
        .groupBy(*)

// Get views stream data
var views = stream
    |from()
        .measurement('views')
        .groupBy(*)

// Join errors and views
errors
    |join(views)
        .as('errors', 'views')
    //Calculate percentage
    |eval(lambda: "errors.value" / "views.value")
        // Give the resulting field a name
        .as('error_percent')
    |influxDBOut()
        .database('pages')
        .measurement('error_percent')
```
