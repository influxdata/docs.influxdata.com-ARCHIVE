---
title: Custom Anomaly Detection

menu:
  kapacitor_011:
    name: Custom Anomaly Detection
    identifier: anomaly_detection
    weight: 20
    parent: examples
---


Everyone has their own anomaly detection algorithm, so we have built
Kapacitor to integrate easily with which ever algorithm fits your
domain.  Kapacitor calls these custom algorithms UDFs for User Defined
Functions.  This guide will walk through the necessary steps for
writing and using your own UDFs within Kapacitor.

If you haven't already, we recommend following the [getting started
guide](/kapacitor/v0.11/introduction/getting_started/) for Kapacitor
prior to continuing.

## 3D Printing

If you own or have recently purchased a 3D printer, you may know that
3D printing requires the environment to be at certain temperatures in
order to ensure quality prints.  Prints can also take a long time
(some can take more than 24 hours), so you can't just watch the
temperature graphs the whole time to make sure the print is going
well. Also, if a print goes bad early, you want to make sure and stop
it so that you can restart it, and not waste materials on continuing a
bad print.

Due to the physical limitations of 3D printing, the printer software
is typically designed to keep the temperatures within certain
tolerances. For the sake of argument, let's say that you don't trust
the software to do it's job (or want to create your own), and want to
be alerted when the temperature reaches an abnormal level.

There are three temperatures when it comes to 3D printing:

1. The temperature of the hot end (where the plastic is melted before being printed).
2. The temperature of the bed (where the part is being printed).
3. The temperature of the ambient air (the air around the printer).

All three of these temperatures affect the quality of the print (some
being more important than others), but we want to make sure and track
all of them.

To keep our anomaly detection algorithm simple, let's compute a
`p-value` for each window of data we receive, and then emit a single
data point with that `p-value`. To compute the `p-value`, we will use
[Welch's t-test](https://en.wikipedia.org/wiki/Welch%27s_t_test).  For
a null hypothesis, we will state that a new window is from the same
population as the historical windows. If the `p-value` drops low
enough, we can reject the null hypothesis and conclude that the window
must be from something different than the historical data population, or
_an anomaly_.  This is an oversimplified approach, but we are learning
how to write UDFs, not statistics.

## Writing a UDF

Now that we have an idea of what we want to do, let's understand how
Kapacitor wants to communicate with our process. From the [UDF
README](https://github.com/influxdata/kapacitor/tree/master/udf/agent)
we learn that Kapacitor will spawn a process called an `agent`.  The
`agent` is responsible for describing what options it has, and then
initializing itself with a set of options.  As data is received by the
UDF, the `agent` performs its computation and then returns the
resulting data to Kapacitor.  All of this communication occurs over
STDIN and STDOUT using protocol buffers.  As of this writing, Kapacitor
has agents implemented in Go and Python that take care of the
communication details and expose an interface for doing the actual
work.  For this guide, we will be using the Python agent.

### The Handler Interface

Here is the Python handler interface for the agent:

```python
# The Agent calls the appropriate methods on the Handler as requests are read off STDIN.
#
# Throwing an exception will cause the Agent to stop and an ErrorResponse to be sent.
# Some *Response objects (like SnapshotResponse) allow for returning their own error within the object itself.
# These types of errors will not stop the Agent and Kapacitor will deal with them appropriately.
#
# The Handler is called from a single thread, meaning methods will not be called concurrently.
#
# To write Points/Batches back to the Agent/Kapacitor use the Agent.write_response method, which is thread safe.
class Handler(object):
    def info(self):
        pass
    def init(self, init_req):
        pass
    def snapshot(self):
        pass
    def restore(self, restore_req):
        pass
    def begin_batch(self):
        pass
    def point(self):
        pass
    def end_batch(self, end_req):
        pass
```

### The Info Method

Let's start with the `info` method.  When Kapacitor starts up it will
call `info` and expect in return some information about how this UDF
behaves.  Specifically, Kapacitor expects the kind of edge the UDF
wants and provides.

> **Remember**: within Kapacitor, data is transported in streams or
batches, so the UDF must declare what it expects.

In addition, UDFs can accept certain options so that they are
individually configurable.  The `info` response can contain a list of
options, their names, and expected arguments.

For our example UDF, we need to know three things:

1. The field to operate on.
2. The size of the historical window to keep.
3. The significance level or `alpha` being used.

Below we have the implementation of the `info` method for our handler that defines the edge types and options available:

```python
...
    def info(self):
        """
        Respond with which type of edges we want/provide and any options we have.
        """
        response = udf_pb2.Response()

        # We will consume batch edges aka windows of data.
        response.info.wants = udf_pb2.BATCH
        # We will produce single points of data aka stream.
        response.info.provides = udf_pb2.STREAM

        # Here we can define options for the UDF.
        # Define which field we should process.
        response.info.options['field'].valueTypes.append(udf_pb2.STRING)

        # Since we will be computing a moving average let's make the size configurable.
        # Define an option 'size' that takes one integer argument.
        response.info.options['size'].valueTypes.append(udf_pb2.INT)

        # We need to know the alpha level so that we can ignore bad windows.
        # Define an option 'alpha' that takes one double valued argument.
        response.info.options['alpha'].valueTypes.append(udf_pb2.DOUBLE)

        return response
...
```

When Kapacitor starts, it will spawn our UDF process and request
the `info` data and then shutdown the process.  Kapacitor will
remember this information for each UDF.  This way, Kapacitor can
understand the available options for a given UDF before its executed
inside of a task.

### The Init Method

Next let's implement the `init` method, which is called once the task
starts executing.  The `init` method receives a list of chosen
options, which are then used to configure the handler appropriately.
In response, we indicate whether the `init` request was successful,
and, if not, any error messages if the options were invalid.

```python
...
    def init(self, init_req):
        """
        Given a list of options initialize this instance of the handler
        """
        success = True
        msg = ''
        size = 0
        for opt in init_req.options:
            if opt.name == 'field':
                self._field = opt.values[0].stringValue
            elif opt.name == 'size':
                size = opt.values[0].intValue
            elif opt.name == 'alpha':
                self._alpha = opt.values[0].doubleValue

        if size <= 1:
            success = False
            msg += ' must supply window size > 1'
        if self._field == '':
            success = False
            msg += ' must supply a field name'
        if self._alpha == 0:
            success = False
            msg += ' must supply an alpha value'

        # Initialize our historical window
        # We will define MovingStats in the next step
        self._history = MovingStats(size)

        response = udf_pb2.Response()
        response.init.success = success
        response.init.error = msg[1:]

        return response
...
```

When a task starts, Kapacitor spawns a new process for the UDF and
calls `init`, passing any specified options from the TICKscript. Once
initialized, the process will remain running and Kapacitor will begin
sending data as it arrives.

### The Batch and Point Methods

Our task wants a `batch` edge, meaning it expects to get data in
batches or windows.  To send a batch of data to the UDF process,
Kapacitor first calls the `begin_batch` method, which indicates that all
subsequent points belong to a batch.  Once the batch is complete, the
`end_batch` method is called with some metadata about the batch.

At a high level, this is what our UDF code will do for each of the
`begin_batch`, `point`, and `end_batch` calls:

* `begin_batch` -- mark the start of a new batch and initialize a structure for it
* `point` -- store the point
* `end_batch` -- perform the `t-test` and then update the historical data

### The Complete UDF Script

What follows is the complete UDF implementation with our `info`,
`init`, and batching methods (as well as everything else we need).

```python

from agent import Agent, Handler
from scipy import stats
import math
import udf_pb2
import sys

class TTestHandler(Handler):
    """
    Keep a rolling window of historically normal data
    When a new window arrives use a two-sided t-test to determine
    if the new window is statistically significantly different.
    """
    def __init__(self, agent):
        self._agent = agent

        self._field = ''
        self._history = None

        self._batch = None

        self._alpha = 0.0

    def info(self):
        """
        Respond with which type of edges we want/provide and any options we have.
        """
        response = udf_pb2.Response()
        # We will consume batch edges aka windows of data.
        response.info.wants = udf_pb2.BATCH
        # We will produce single points of data aka stream.
        response.info.provides = udf_pb2.STREAM

        # Here we can define options for the UDF.
        # Define which field we should process
        response.info.options['field'].valueTypes.append(udf_pb2.STRING)

        # Since we will be computing a moving average let's make the size configurable.
        # Define an option 'size' that takes one integer argument.
        response.info.options['size'].valueTypes.append(udf_pb2.INT)

        # We need to know the alpha level so that we can ignore bad windows
        # Define an option 'alpha' that takes one double argument.
        response.info.options['alpha'].valueTypes.append(udf_pb2.DOUBLE)

        return response

    def init(self, init_req):
        """
        Given a list of options initialize this instance of the handler
        """
        success = True
        msg = ''
        size = 0
        for opt in init_req.options:
            if opt.name == 'field':
                self._field = opt.values[0].stringValue
            elif opt.name == 'size':
                size = opt.values[0].intValue
            elif opt.name == 'alpha':
                self._alpha = opt.values[0].doubleValue

        if size <= 1:
            success = False
            msg += ' must supply window size > 1'
        if self._field == '':
            success = False
            msg += ' must supply a field name'
        if self._alpha == 0:
            success = False
            msg += ' must supply an alpha value'

        # Initialize our historical window
        self._history = MovingStats(size)

        response = udf_pb2.Response()
        response.init.success = success
        response.init.error = msg[1:]

        return response

    def begin_batch(self):
        # create new window for batch
        self._batch = MovingStats(-1)

    def point(self, point):
        self._batch.update(point.fieldsDouble[self._field])

    def end_batch(self, batch_meta):
        pvalue = 1.0
        if self._history.n != 0:
            # Perform Welch's t test
            t, pvalue = stats.ttest_ind_from_stats(
                    self._history.mean, self._history.stddev(), self._history.n,
                    self._batch.mean, self._batch.stddev(), self._batch.n,
                    equal_var=False)


            # Send pvalue point back to Kapacitor
            response = udf_pb2.Response()
            response.point.time = batch_meta.tmax
            response.point.name = batch_meta.name
            response.point.group = batch_meta.group
            response.point.tags.update(batch_meta.tags)
            response.point.fieldsDouble["t"] = t
            response.point.fieldsDouble["pvalue"] = pvalue
            self._agent.write_response(response)

        # Update historical stats with batch, but only if it was normal.
        if pvalue > self._alpha:
            for value in self._batch._window:
                self._history.update(value)


class MovingStats(object):
    """
    Calculate the moving mean and variance of a window.
    Uses Welford's Algorithm.
    """
    def __init__(self, size):
        """
        Create new MovingStats object.
        Size can be -1, infinite size or > 1 meaning static size
        """
        self.size = size
        if not (self.size == -1 or self.size > 1):
            raise Exception("size must be -1 or > 1")


        self._window = []
        self.n = 0.0
        self.mean = 0.0
        self._s = 0.0

    def stddev(self):
        """
        Return the standard deviation
        """
        if self.n == 1:
            return 0.0
        return math.sqrt(self._s / (self.n - 1))

    def update(self, value):

        # update stats for new value
        self.n += 1.0
        diff = (value - self.mean)
        self.mean += diff / self.n
        self._s += diff * (value - self.mean)

        if self.n == self.size + 1:
            # update stats for removing old value
            old = self._window.pop(0)
            oldM = (self.n * self.mean - old)/(self.n - 1)
            self._s -= (old - self.mean) * (old - oldM)
            self.mean = oldM
            self.n -= 1

        self._window.append(value)

if __name__ == '__main__':
    # Create an agent
    agent = Agent()

    # Create a handler and pass it an agent so it can write points
    h = TTestHandler(agent)

    # Set the handler on the agent
    agent.handler = h

    # Anything printed to STDERR from a UDF process gets captured into the Kapacitor logs.
    print >> sys.stderr, "Starting agent for TTestHandler"
    agent.start()
    agent.wait()
    print >> sys.stderr, "Agent finished"

```

That was a lot, but now we are ready to configure Kapacitor to run our
code.  Create a scratch dir for working through the rest of this
guide:

```bash
mkdir /tmp/kapacitor_udf
cd /tmp/kapacitor_udf
```

Save the above UDF python script into `/tmp/kapacitor_udf/ttest.py`.

### Configuring Kapacitor for our UDF

Add this snippet to your Kapacitor configuration file (typically located at `/etc/kapacitor/kapacitor.conf`):

```
[udf]
[udf.functions]
    [udf.functions.tTest]
        # Run python
        prog = "/usr/bin/python2"
        # Pass args to python
        # -u for unbuffered STDIN and STDOUT
        # and the path to the script
        args = ["-u", "/tmp/kapacitor_udf/ttest.py"]
        # If the python process is unresponsive for 10s kill it
        timeout = "10s"
        # Define env vars for the process, in this case the PYTHONPATH
        [udf.functions.tTest.env]
            PYTHONPATH = "/tmp/kapacitor_udf/kapacitor/udf/agent/py"
```

In the configuration we called the function `tTest`. That is also how
we will reference it in the TICKscript.

Notice that our Python script imported the `Agent` object, and we set
the `PYTHONPATH` in the configuration.  Clone the Kapacitor source
into the tmp dir so we can point the `PYTHONPATH` at the necessary
python code.  This is typically overkill since it's just two Python
files, but it makes it easy to follow:

```
git clone https://github.com/influxdata/kapacitor.git /tmp/kapacitor_udf/kapacitor
```

### Running Kapacitor with the UDF

Restart the Kapacitor daemon to make sure everything is configured
correctly:

```bash
service kapacitor restart
```

Check the logs (`/var/log/kapacitor/`) to make sure you see a
*Listening for signals* line and that no errors occurred.  If you
don't see the line, it's because the UDF process is hung and not
responding. It should be killed after a timeout, so give it a moment
to stop properly. Once stopped, you can fix any errors and try again.

### The TICKscript

If everything was started correctly, then it's time to write our
TICKscript to use the `tTest` UDF method:

```javascript
// This TICKscript monitors the three temperatures for a 3d printing job,
// and triggers alerts if the temperatures start to experience abnormal behavior.

// Define our desired significance level.
var alpha = 0.001

// Select the temperatures measurements
var data = stream
    .from().measurement('temperatures')
    .window()
        .period(5m)
        .every(5m)

data
    //Run our tTest UDF on the hotend temperature
    .tTest()
        // specify the hotend field
        .field('hotend')
        // Keep a 1h rolling window
        .size(3600)
        // pass in the alpha value
        .alpha(alpha)
    .alert()
        .id('hotend')
        .crit(lambda: "pvalue" < alpha)
        .log('/tmp/kapacitor_udf/hotend_failure.log')

// Do the same for the bed and air temperature.
data
    .tTest()
        .field('bed')
        .size(3600)
        .alpha(alpha)
    .alert()
        .id('bed')
        .crit(lambda: "pvalue" < alpha)
        .log('/tmp/kapacitor_udf/bed_failure.log')

data
    .tTest()
        .field('air')
        .size(3600)
        .alpha(alpha)
    .alert()
        .id('air')
        .crit(lambda: "pvalue" < alpha)
        .log('/tmp/kapacitor_udf/air_failure.log')

```

Notice that we have called `tTest` three times. This means that
Kapacitor will spawn three different Python processes and pass the
respective init option to each one.

Save this script as `/tmp/kapacitor_udf/print_temps.tick` and define
the Kapacitor task:

```bash
kapacitor define -name print_temps -type stream -dbrp printer.default -tick print_temps.tick
```

### Generating Test Data

To simulate our printer for testing, we will write a simple Python
script to generate temperatures.  This script generates random
temperatures that are normally distributed around a target
temperature.  At specified times, the variation and offset of the
temperatures changes, creating an anomaly.

> Don't worry too much about the details here.  It would be much better
to use real data for testing our TICKscript and UDF, but this is
faster (and much cheaper than a 3D printer).

```python
#!/usr/bin/python2

from numpy import random
from datetime import timedelta, datetime
import sys
import time
import requests


# Target temperatures in C
hotend_t = 220
bed_t = 90
air_t = 70

# Connection info
write_url = 'http://localhost:9092/write?db=printer&rp=default&precision=s'
measurement = 'temperatures'

def temp(target, sigma):
    """
    Pick a random temperature from a normal distribution
    centered on target temperature.
    """
    return random.normal(target, sigma)

def main():
    hotend_sigma = 0
    bed_sigma = 0
    air_sigma = 0
    hotend_offset = 0
    bed_offset = 0
    air_offset = 0

    # Define some anomalies by changing sigma at certain times
    # list of sigma values to start at a specified iteration
    hotend_anomalies =[
        (0, 0.5, 0), # normal sigma
        (3600, 3.0, -1.5), # at one hour the hotend goes bad
        (3900, 0.5, 0), # 5 minutes later recovers
    ]
    bed_anomalies =[
        (0, 1.0, 0), # normal sigma
        (28800, 5.0, 2.0), # at 8 hours the bed goes bad
        (29700, 1.0, 0), # 15 minutes later recovers
    ]
    air_anomalies = [
        (0, 3.0, 0), # normal sigma
        (10800, 5.0, 0), # at 3 hours air starts to fluctuate more
        (43200, 15.0, -5.0), # at 12 hours air goes really bad
        (45000, 5.0, 0), # 30 minutes later recovers
        (72000, 3.0, 0), # at 20 hours goes back to normal
    ]

    # Start from 2016-01-01 00:00:00 UTC
    # This makes it easy to reason about the data later
    now = datetime(2016, 1, 1)
    second = timedelta(seconds=1)
    epoch = datetime(1970,1,1)

    # 24 hours of temperatures once per second
    points = []
    for i in range(60*60*24+2):
        # update sigma values
        if len(hotend_anomalies) > 0 and i == hotend_anomalies[0][0]:
            hotend_sigma = hotend_anomalies[0][1]
            hotend_offset = hotend_anomalies[0][2]
            hotend_anomalies = hotend_anomalies[1:]

        if len(bed_anomalies) > 0 and i == bed_anomalies[0][0]:
            bed_sigma = bed_anomalies[0][1]
            bed_offset = bed_anomalies[0][2]
            bed_anomalies = bed_anomalies[1:]

        if len(air_anomalies) > 0 and i == air_anomalies[0][0]:
            air_sigma = air_anomalies[0][1]
            air_offset = air_anomalies[0][2]
            air_anomalies = air_anomalies[1:]

        # generate temps
        hotend = temp(hotend_t+hotend_offset, hotend_sigma)
        bed = temp(bed_t+bed_offset, bed_sigma)
        air = temp(air_t+air_offset, air_sigma)
        points.append("%s hotend=%f,bed=%f,air=%f %d" % (
            measurement,
            hotend,
            bed,
            air,
            (now - epoch).total_seconds(),
        ))
        now += second

    # Write data to Kapacitor
    r = requests.post(write_url, data='\n'.join(points))
    if r.status_code != 204:
        print >> sys.stderr, r.text
        return 1
    return 0

if __name__ == '__main__':
    exit(main())

```

Save the above script as `/tmp/kapacitor_udf/printer_data.py`.

> This Python script has two Python dependencies: `requests` and `numpy`.
They can easily be installed via `pip` or your package manager.  

At this point we have a task ready to go, and a script to generate
some fake data with anomalies.  Now we can create a recording of our
fake data so that we can easily iterate on the task:

```
# Start the recording in the background
kapacitor record stream -name print_temps -duration 24h &
# Run our python script to generate data
chmod +x ./printer_data.py
./printer_data.py
# Grab the ID from the output and store it in a var
# The ID will appear on a line above the last line about the background task finishing.
rid=7bd3ced5-5e95-4a67-a0e1-f00860b1af47
```

We can verify it worked by listing information about the recording.
Our recording came out to `1.6MB`, so yours should come out somewhere
close to that:

```
$ kapacitor list recordings $rid
ID                                      Type    Size      Created
7bd3ced5-5e95-4a67-a0e1-f00860b1af47    stream  1.6 MB    21 Jan 16 12:43 MST
```

### Detecting Anomalies

Finally, let's run the play against our task and see how it works:

```
kapacitor replay -name print_temps -id $rid -fast -rec-time
```

Check the various log files to see if the algorithm caught the
anomalies:

```
cat /tmp/kapacitor_udf/{hotend,bed,air}_failure.log
```

Based on the `printer_data.py` script above, there should be anomalies at:

* 1hr -- hotend
* 8hr -- bed
* 12hr -- air

There may be some false positives as well, but, since we want this to
work with real data (not our nice clean fake data), it doesn't help
much to tweak it at this point.

Well, there we have it.  We can now get alerts when the temperatures
for our prints deviates from the norm.  Hopefully you now have a
better understanding of how Kapacitor UDFs work, and have a good
working example as a launching point into further work with UDFS.

The framework is in place, now go plug in a real anomaly detection
algorithm that works for your domain!

## Extending This Example

There are a few things that we have left as exercises to the reader:

1. Snapshot/Restore -- Kapacitor will regularly snapshot the state of
   your UDF process so that it can be restored if the process is
   restarted.  The examples
   [here](https://github.com/influxdata/kapacitor/tree/master/udf/agent/examples/)
   have implementations for the `snapshot` and `restore` methods.
   Implement them for the `TTestHandler` handler as an exercise.

2. Change the algorithm from a t-test to something more fitting for
   your domain. Both `numpy` and `scipy` have a wealth of algorithms.

3. The options returned by the `info` request can contain multiple
   arguments.  Modify the `field` option to accept three field names
   and change the `TTestHandler` to maintain historical data and
   batches for each field instead of just the one.  That way only one
   ttest.py process needs to be running.


