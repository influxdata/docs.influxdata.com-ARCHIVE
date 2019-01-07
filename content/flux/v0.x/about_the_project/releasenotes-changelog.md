---
title: Release Notes/Changelog
menu:
  flux_0_x:
    parent: About the project
    weight: 1
---

> This is not a comprehensive changelog for Flux.
> The items below represent only end user-facing changes.
> For a complete changelog, see the
> [Flux Github repository](https://github.com/influxdata/flux/releases).

## v0.12.0 [unreleased]
_A technical preview of Flux packaged with InfluxDB v1.7.3._

### Features
- New functions: `assertEquals()`, `influxFieldsAsColumns()`, `fromCSV()`, `highestMax()`,
  `highestAverage()`, `highestCurrent()`, `lowestMin()`, `lowestAverage()`, `lowestCurrent()`.
- Parse string literal object keys.
- Support packages and imports.
- Rule to chain group operations.
- Switch over to the new parser.

### Bug fixes
- Embed plan.DefaultCost in input and output functions.
- Do not panic with unbalanced parenthesis.
- Respect positive timeout for toHTTP.
- Cancel all queries after timeout elapses.
- Return the source attribute in the location correctly.
- Collision between external and fresh type vars.
- `fmt` for import and package.
- Improve panic message when the wrong column type is used.
- Check `nil` results when computing stats.
- Suppress group push down for `_time` and `_value`.
- Terminal output functions must produce results.
- Improve error message for missing object properties.
- Add unary logical expression to the parser.
- Add missing comparison operators.

### Breaking changes
- Change `label` parameter to `column` for state tracking functions.
- Remove `fromRows()` function.
- Update to `group()` function parameters. Removed `except`, `by`, `none`,
  and `all` parameters. Added `columns` and `mode` parameters.

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
