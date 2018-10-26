







Histogram approximates the cumulative distribution function of a dataset by counting data frequencies for a list of buckets.
A bucket is defined by an upper bound where all data points that are less than or equal to the bound are counted in the bucket.
The bucket counts are cumulative.

Each input table is converted into a single output table representing a single histogram.
The output table will have a the same group key as the input table.
The columns not part of the group key will be removed and an upper bound column and a count column will be added.

Histogram has the following properties:

* `column` string
    Column is the name of a column containing the input data values.
    The column type must be float.
    Defaults to `_value`.
* `upperBoundColumn` string
    UpperBoundColumn is the name of the column in which to store the histogram upper bounds.
    Defaults to `le`.
* `countColumn` string
    CountColumn is the name of the column in which to store the histogram counts.
    Defaults to `_value`.
* `buckets` array of floats
    Buckets is a list of upper bounds to use when computing the histogram frequencies.
    Buckets should contain a bucket whose bound is the maximum value of the data set, this value can be set to positive infinity if no maximum is known.
* `normalize` bool
    Normalize when true will convert the counts into frequencies values between 0 and 1.
    Normalized histograms cannot be aggregated by summing their counts.
    Defaults to `false`.


Example:

    histogram(buckets:linearBuckets(start:0.0,width:10.0,count:10))  // compute the histogram of the data using 10 buckets from 0,10,20,...,100
