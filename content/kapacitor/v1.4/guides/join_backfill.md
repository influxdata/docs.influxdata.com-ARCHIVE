---
title: Calculating rates across joined series + backfill
aliases:
    - kapacitor/v1.4/examples/join_backfill/
menu:
  kapacitor_1_4:
    name: Calculating rates across series
    weight: 10
    parent: Guides
---

Collecting a set of time series data where each time series is counting a particular event is a common scenario.
Using Kapacitor, multiple time series in a set can be joined and used to calculate a combined value, which can then be stored as a new time series.

This guide shows how to use a prepared data generator in python to combine two generated
time series into a new calculated measurement, then
store that measurement back into InfluxDB using Kapacitor.

It uses as its example a hypothetical high-volume website for which two measurements
are taken:

* `errors` -- the number of page views that had an error.
* `views` -- the number of page views that had no errror.

### The Data generator

Data for such a website can be primed and generated to InfluxDB using the Python
3 script rolled into [page.zip](/downloads/pages.zip)([md5](/downloads/pages.zip.md5), [sha256](/downloads/pages.zip.sha256)) and created for this purpose.
It leverages the [InfluxDB-Python](https://github.com/influxdata/influxdb-python) library.
See that Github project for instructions on how to install the library in Python.

Once unzipped, this script can be used to create a database called `pages`, which
uses the default retention policy `autogen`. It can be used to create a backlog
of data and then to set the generator running, walking along randomly generated
`view` and `error` counts.

It can be started with a backlog of two days worth of random data as follows:

```
$ ./pages_db.py --silent true pnr --start 2d
Created database  pages
priming and running
data primed
generator now running. CTRL+C to stop
..........................................
```

Priming two days worth of data can take about a minute.


### Joining with batch data

Having simple counts may not be sufficient for a site administrator. More
important would be to know the percent of page views that are resulting in error.
The process is to select both existing measurements, join them and calculate an
error percentage.  The error percentage can then be stored in
InfluxDB as a new measurement.

The two measurements, `errors` and `views`, need to be queried.
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
Grouping the data by time ensures that each source has data points at consistent time periods.
Filling the data ensures every point will have a match with a sane default.

In this example the `groupBy` method uses the wildcard `*` to group results by all tags.
This can be made more specific by declaring individual tags, and since the generated
demo data contains only one tag, `page`, the `groupBy` statement could be written
as follows: `.groupBy(time(1m), 'page')`.

With two batch sources for each measurement they need to be joined like so.

```javascript
// Join errors and views
errors
    |join(views)
        .as('errors', 'views')
```

The data is joined by time, meaning that as pairs of batches arrive from each source
they are combined into a single batch. As a result the fields from each source
need to be renamed to properly namespace the fields. This is done via the
`.as('errors', 'views')` line.  In this example each measurement has only one field
named `sum`.  The joined fields are called `errors.sum` and `views.sum` respectively.

Now that the data is joined the percentage can be calculated.
Using the new names for the fields, the following expression can be used to calculate
the desired percentage.

```javascript
    //Calculate percentage
    |eval(lambda: "errors.sum" / ("views.sum" + "errors.sum"))
        // Give the resulting field a name
        .as('value')

```

 Finally, this data is stored back into InfluxDB.

```javascript
    |influxDBOut()
        .database('pages')
        .measurement('error_percent')

```

Here is the complete TICKscript for the batch task:

```javascript
dbrp "pages"."autogen"

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
Using Kapacitor's record/replay actions, this TICKscript can be run on historical data.
First, save the above script as `error_percent.tick` and define it.
Then, create a recording for the past time frame we want to fill.

```bash
$ kapacitor define error_percent -tick error_percent.tick
$ kapacitor record batch -task error_percent -past 1d
```

Grab the recording ID and replay the historical data against the task.
Here specify the `-rec-time` flag to instruct Kapacitor to use the actual
time stored in the recording when processing the data instead of adjusting to the present time.

```bash
$ kapacitor replay -task error_percent -recording RECORDING_ID -rec-time
```

If the data set is too large to keep in one recording, define a specific range of time to record
and then replay each range individually.

```bash
rid=$(kapacitor record batch -task error_percent -start 2015-10-01 -stop 2015-10-02)
echo $rid
kapacitor replay -task error_percent -recording $rid -rec-time
kapacitor delete recordings $rid
```

Just loop through the above script for each time window and reconstruct all the historical data needed.
With that the `error_percent` for every minute will be backfilled for the historical data.

### Stream method
To do the same for the streaming case the TICKscript is very similar:

```javascript
dbrp "pages"."autogen"

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
    |eval(lambda: "errors.value" / ("views.sum" + "errors.sum"))
        // Give the resulting field a name
        .as('error_percent')
    |influxDBOut()
        .database('pages')
        .measurement('error_percent')
```

Note that with the streaming approach the new combined measurement, `error_percent`,
can be calculated and stored in real time.
