








LogrithmicBuckets produces a list of exponentially separated floats.

LogrithmicBuckets has the following properties:

* `start` float
    Start is the first value in the returned bucket list.
* `factor` float
    Factor is the multiplier applied to each subsequent bucket.
* `count` int
    Count is the number of buckets to create.
* `infinity` bool
    Infinity when true adds an additional bucket with a value of positive infinity.
    Defaults to `true`.
