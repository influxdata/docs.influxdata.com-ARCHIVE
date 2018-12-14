---
title: Release Notes/Changelog
menu:
  flux_0_x:
    parent: About the project
    weight: 1
---

## v0.7.1 [2018-12-06]

_A technical preview of Flux packaged with InfluxDB v1.7.2._

### Features
- Add support for string comparison operators.
- Add array indexing.
- Add scanned values & bytes to Statistics.
- Remove unused "verbose" flag.
- Log flux.Spec and plans in log level "debug."
- Implement new Flux parser.

### Bug Fixes
- Return error in `covariance()` when a column doesn't exist.
- Switch the scanner interface for the parser.
- Regular expression scanning would produce the wrong tokens.
- Add arrow (`=>`) token to the scanner and rename the pipe tokens.
- Regular expression escape sequences in the scanner.
- Don't push `group()` into `from()` when group mode is "except."
- Cancelling query context stops execution.
- Add TableIterator.Statistics().

### Breaking changes
- Change the `histogram()` function's `buckets` parameter to `bins`.
- Change `linearBuckets()` and `logarithmicBuckets` to `linearBins()` and `logarithmicBins()`.


## v0.7.0 [2018-11-06]

_A technical preview of Flux packaged with InfluxDB v1.7.0 and v1.7.1._
