







LinearBuckets produces a list of linearly separated floats.

LinearBuckets has the following properties:

* `start` float
    Start is the first value in the returned list.
* `width` float
    Width is the distance between subsequent bucket values.
* `count` int
    Count is the number of buckets to create.
* `infinity` bool
    Infinity when true adds an additional bucket with a value of positive infinity.
    Defaults to `true`.
