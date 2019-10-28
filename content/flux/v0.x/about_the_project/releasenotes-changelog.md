---
title: Release Notes/Changelog
menu:
  flux_0_x:
    parent: About the project
    weight: 1
---

## v0.50.2 [2019-10-24]

### Bug fixes
- Make `keep()` and `drop()` throw an error if merging tables with different schemas.

## v0.50.1 [2019-10-24]

### Bug fixes
- Add annotated errors to the execute package where it affects normal usage.
- Reorder variables in the allocator for atomic operations.

## v0.50.0 [2019-10-11]

### Features
- Add `experimental/prometheus` package.
- Add a memory manager to the memory allocator.
- Add an internal function for generating data.
- Switch to using discarding mode for transformations.
- Group key join on `_time`.

### Bug fixes
- Require `data` parameter in `monitor.check()`.
- Return the EOF error when reading metadata.
- Re-add missing import.
- Fix broken links in SPEC.
- Return error from cache.
- Update the `universe` package to use flux errors throughout.
- Parse escape characters in string interpolation expressions.
- Improve CSV error message for serialized Flux error.
- Have the interpreter return annotated Flux errors.

## v0.49.0 [2019-09-24]

### Features
- Optimize `filter()` to pass through tables when possible.
- Additional arrow builder utilities.
- Add a `benchmark()` function to the testing package.
- Add an arrow backed version of the table buffer.

### Bug fixes
- Fix `sql.from()` connection leak.
- Fix some of the memory leaks within the standard library.
- Fix `mqtt.to()` topic parameter.

## v0.48.0 [2019-09-20]

### Breaking changes
- Convert the Flux memory allocator into an arrow allocator.

### Features
- New dependency injection framework.
- Add planner options to Flux language.
- Make Flux `internal/promql/quantile` behavior match PromQL `quantile` aggregate.

### Bug fixes
- Passing context to WalkIR.
- Make `join()` reject input tables lacking `on` columns.


## v0.47.1 [2019-09-18]

### Bug fixes
- Pass dependencies to WalkIR

### Bug fixes
- Introduce ParenExpression.
- Make fmt runs cargo fmt on Rust directories.
- Update `Hex.Dump` to `hex.EncodeToString`.
- Integrate the Promql transpiler into Flux.

## v0.46.2 [2019-09-12]

### Bug fixes
- Make `to` use URL validator.
- Add filesystem to default test dependencies.

## v0.46.1 [2019-09-11]

### Bug fixes
- Add a filesystem service.
- Do a pointer comparison for table objects instead of a deep compare.

## v0.46.0 [2019-09-10]

### Features
- Replace EnvironmentSecretService with EmptySecret….
- Source location for rust parser.

### Bug fixes
- Push error for bad string expression.
- Remove `token` parameter from `pagerduty.endpoint`.

## v0.45.2 [2019-09-10]

### Bug fixes
- Push the tag before running goreleaser.
- Additional opentracing spans for debugging query flow.

## v0.45.1 [2019-09-09]

### Bug fixes
- Ensure `http.post` respects the context.

## v0.45.0 [2019-09-06]

### Features
- Added Google Bigtable `from()`.

### Bug fixes
- Add `pagerduty.severityFromLevel()` helper function.
- Sleep function now gets canceled when the context is canceled.
- Categorize the undefined identifier as an invalid status code.
- Panic from `CheckKind` in `memberEvaluator`.

## v0.44.0 [2019-09-05]

### Features
- Add `http.basicAuth` function.
- Add measurement filters to `monitor.from` and `monitor.logs`.

### Bug fixes
- changed the default HTTP client to be more robust.

## v0.43.0 [2019-09-04]

### Features
- PagerDuty endpoint for alerts and notifications.

## v0.42.0 [2019-08-30]

### Features
- Add `stateChanges` function.

### Bug fixes
- Race condition in looking up types in `map`.
- Support bool equality expressions.
- Calculating a type variable's free type variables.
- Do not generate fresh type variables for member expressions.
- Array instantiation.

## v0.41.0 [2019-08-26]

### Features
- Add ability to validate URLs before making `http.post` requests.
- Evaluate string interpolation.
- Implement the `secrets.get` function.
- Added secret service interface.
- Add secrets package that will construct a secret object.
- Added a SecretService interface and a new dependencies package and a basic test of functionality.
- Add Slack endpoint.

### Bug fixes
- Make `reset()` check for non-nil data before calling `Release()`.
- Add test case for `notify` function.
- Add missing math import to test case.
- Make packages aware of options.
- Resolved `holtWinters` panic.
- Use non-pointer receiver for `interpreter.function`.

## v0.40.2 [2019-08-22]

### Bug fixes
- Resolved `holtWinters()` panic.

## v0.40.1 [2019-08-21]

### Bug fixes
- Use non-pointer receiver for `interpreter.function`.

## v0.40.0 [2019-08-20]

### Breaking changes
- Update compiler package to use true scope.
- Add `http` and `json` to prelude.

### Features
- Add `alerts.check()` function.
- Add `alerts.notify` function.
- Add `kaufmansER()` and `kaufmansAMA()` functions.
- Add `experimental.to()` function.
- Add `experimental.set()` function to update entire object.
- Add `experimental.objectKeys()` function.
- Add `tripleExponentialDerivative()` function.
- Add `json.encode()` function.
- Add `mqtt.to()` function.
- Add Bytes type.
- Update compiler package to use true scope.
- Add http endpoint.
- Add post method implementation.
- String interpolation.

### Bug fixes
- Avoid wrapping table errors in the CSV encoder.
- Remove irrelevant TODOs.
- `mode()` now properly considers nulls when calculating the mode.
- Add `http` and `json` to prelude.
- Rename all Flux test files to use `_test.flux`.

## v0.39.0 [2019-08-13]

{{% warn %}}
In Flux 0.39.0, `holtWinters()` can cause the query engine to panic.
**Flux 0.40.2 resolves this panic.**
{{% /warn %}}

### Breaking changes
- Implement the scanning components for string expressions.

### Features
- Add `tail()` function.
- Add framework for `http.post()` function.
- Implement `deadman()` function.
- Time arithmetic functions.
- Alerts package.
- Add an experimental `group()` function with mode `extend`.
- Implement the scanning components for string expressions.
- Add `chandeMomentumOscillator()` function.
- Add `hourSelection()` function.
- Add `date.year()` function

### Bug fixes
- Update object to use Invalid type instead of nil monotypes.
- Make it so the alerts package can be defined in pure Flux.
- Close connection after `sql.to()`.

## v0.38.0 [2019-08-06]

### Features
- Update selectors to operate on time columns.
- Add `relativeStrengthIndex()` transformation.
- Add double and triple exponential average transformations (`doubleEMA()` and `tripleEMA()`).
- Add `holtWinters()` transformation.
- Add `keepFirst` parameter to `difference()`.
- DatePart equivalent functions.
- Add runtime package.
- Add and subtract duration literal arithmetic.
- Allow `keep()` to run regardless of nonexistent columns.
  If all columns given are nonexistent, `keep()` returns an empty table.
- Scanner returns positioning.

### Bug fixes
- Function resolver now keeps track of local assignments that may be evaluated at runtime.
- Fixed InfluxDB test errors.
- Add range to tests to pass in InfluxDB.
- Allow converting a duration to a duration.
- Catch integer overflow and underflow for literals.

## v0.37.2 [2019-07-24]

-  _General cleanup of internal code._

## v0.37.1 [2019-07-23]

### Bug fixes
- Fixed InfluxDB test errors.
- Add range to tests to pass in InfluxDB.

## v0.37.0 [2019-07-22]

### Features
- Add PromQL to Flux transpiler and Flux helper functions.
- Add mutable arrow array builders.
- Created date package.
- Return query and result errors in the multi result encoder.
- Add `exponentialMovingAverage()`.
- Add full draft of Rust parser.
- Implement more production rules.
- AST marshalling.
- Parse statements.
- Parse integer and float literals.
- Add initial Rust implementation of parser.

## v0.36.2 [2019-07-12]

_A technical preview of Flux packaged with InfluxDB v1.7.8._

### Bug fixes
- Add helper methods for comparing entire result sets.
- Map will not panic when a record is `null`.

## v0.36.1 [2019-07-10]

### Bug fixes
- Add `range` call to some end-to-end tests.
- Fix implementation of `strings.replaceAll`.

## v0.36.0 [2019-07-09]

### Features
- Updated `movingAverage()` and added `timedMovingAverage`.
- `elapsed()` function.
- `mode()` function.
- `sleep()` function.
- Modify error usage in places to use the new enriched errors.
- Enriched error interface.
- End-to-end tests that show how to mimic pandas functionality.
- End-to-end tests for string functions.

### Bug fixes
- Fix `difference()` so that it returns an error instead of panicking when given a `_time` column.
- Added end-to-end tests for type conversion functions.
- Make `map()` error if return type is not an object.
- Fixed miscounted allocations in the `ColListTableBuilder`.
- Support formatting `with`.

### Breaking changes
- Updated `movingAverage()` to `timedMovingAverage` and added new
  `movingAverage()` implementation.


## v0.35.1 [2019-07-03]

### Bug fixes
- Re-add `mergeKey` parameter to `map()` in deprecated state.

## v0.35.0 [2019-07-02]

### Breaking changes
- Remove `mergeKey` parameter from the `map()` function.

### Features
- Add `sql.to()` function.
- Add `movingAverage()` function.
- Add `strlen()` and `substring()` functions to the `strings` package.

### Bug fixes
- Remove `mergeKey` parameter from the `map()` function.
- Parse float types with PostgreSQL.

## v0.34.2 [2019-06-27]

### Bug fixes
- Parse float types with PostgreSQL.

## v0.34.1 [2019-06-26]

### Features
- Add custom PostgreSQL type support.
- Added MySQL type support.
- Nulls work in table and row functions.

### Bug fixes
- Fixed boolean literal type conversion problem and added tests.
- Diff should track memory allocations when it copies the table.
- Copy table will report if it is empty correctly.

## v0.33.2 [2019-06-25]

### Bug fixes
- Use `strings.Replace` instead of `strings.ReplaceAll` for compatibility.

## v0.33.1 [2019-06-20]

### Bug fixes
- Copy table will report if it is empty correctly.

## v0.33.0 [2019-06-18]

### Breaking changes
- Implement nulls in the compiler runtime.

### Features
- Add Go `regexp` functions to Flux.
- Add the exists operator to the compiler runtime.
- Implement nulls in the compiler runtime.
- Add nullable kind.
- Support "with" syntax for objects in row functions.
- Port several string functions from go `strings` library to Flux.
- Add exists unary operator.

### Bug fixes
- Add range to map_extension_with.flux.
- Row function resets records map with each call to prepare.
- Fix `joinStr`, including adding an EndToEnd Test.
- Fix `string_trimLeft` and `string_trimRight` so that they pass in InfluxDB.
- Add length check for empty tables in fill.

## v0.32.1 [2019-06-10]

### Bug fixes
- Identify memory limit exceeded errors in dispatcher.

## v0.32.0 [2019-06-05]

### Breaking changes
- Remove the control package.

### Bug fixes
- Changelog generator now handles merge commits better.
- Return count of errors when checking AST.

## v0.31.1 [2019-05-29]

### Bug fixes
- Do not call done after calling the function.

## v0.31.0 [2019-05-28]

### Breaking changes
- Copy the table when a table is used multiple times.

### Features
- Support for dynamic queries.

### Bug fixes
- Copy the table when a table is used multiple times.

## v0.30.0 [2019-05-16]

### Features
- Support for dynamic queries.

## v0.29.0 [2019-05-15]

### Breaking changes
- Make `on` a required parameter to `join()`.

### Features
- Add stream table index functions (
  [`tableFind()`](/flux/v0.x/stdlib/built-in/transformations/stream-table/tablefind/),
  [`getRecord()`](/flux/v0.x/stdlib/built-in/transformations/stream-table/getrecord/),
  [`getColumn()`](/flux/v0.x/stdlib/built-in/transformations/stream-table/getcolumn/)
  ).
- Construct invalid binary expressions when given multiple expressions.

### Bug fixes
- Properly use RefCount to reference count tables.
- Remove the race condition within the `(*Query).Done` method.
- Fix table functions test.
- Add `column` parameter to `median()`.
- Modify `median` to work with `aggregateWindow()`.
- `pivot()` now uses the correct column type when filling nulls.
- Add error handling for property list.
- Return the error from the context in the executor.

## v0.28.3 [2019-05-01]

### Bug fixes
- Fix request results labels to count runtime errors.
- An error when joining could result in two calls to finish.

## v0.28.2 [2019-04-26]

### Bug fixes
- Preallocate data when constructing a new string array.

## v0.28.1 [2019-04-25]

### Bug fixes
- Make executor respect memory limit from caller.

## v0.28.0 [2019-04-24]

### Features
- Allow choosing sample/population mode in `stddev()`.

### Bug fixes
- Fix `reduce()` so it resets the reduce value to the neutral element value for each new group key
  and reports an error when two reducers write to the same destination group key.

## v0.27.0 [2019-04-22]

### Features
- Add `trimSuffix` and `trimPrefix` functions to the strings package.
- Add support for conditional expressions to compiler.
- Add conditional expression handling to interpreter.

### Bug fixes
- Enforce memory and concurrency limits in controller.
- Format conditional expression.
- `tagKeys` should include a call to `distinct`.

## v0.26.0 [2019-04-18]

### Breaking changes
- Aggregates now accept only a `column` parameter. `columns` not used.

### Features
- Add handling for conditional expressions to type inference.
- Add `if`/`then`/`else` syntax to Flux parser.
- Added a WalkIR function that external programs can use to traverse an opSpec structure.
- Add planner options to compile options.
- Add example on how to use Flux as a library.
- `duplicate()` will now overwrite a column if the as label already exists.

#### Bug fixes
- Format right child with good parentheses.
- Make staticcheck pass.
- Rename `json` tag so go vet passes.
- The controller pump could reference a nil pointer.
- Create a DependenciesAwareProgram so controller can assign dependencies.
- Make `Program.Start` start execution synchronously.
- Read the metadata channel in a separate goroutine.
- Remove dead code in controller so `staticcheck` passes.
- Allow Flux unit tests to pass.
- Require a Github token to perform a release.
- Change example name to make go vet pass.
- Make `csv.from` return decode error.

## v0.25.0 [2019-04-08]

## Breaking changes
- Fix logical operators (`and`, `or`) precedence.

## Bug fixes
- Omit space between unary operator and operand.
- Format AST preserving operator precedence.


{{% note %}}
### Breaking changes since last Flux update
Flux v0.24 is packaged with the InfluxDB v1.7.6.
-B v1.7.3-1.7.5 included Flux v0.12.
The list below is a summary of breaking changes in Flux between those versions.

- Rename `percentile()` function to `quantile()`.
- Remove unused statistics from the struct.
- Support attaching arbitrary query metadata from the executor.
- Make `window()` parameters match SPEC.
- Split FromProcedureSpec into logical and physical specs.
- Implement and require builtin statements.
- Fix keys to output group key.
- Organizes builtin code into Flux packages.
- Change flux command to be a REPL.
- Add File and Package nodes to the AST.
{{% /note %}}

## v0.24.0 [2019-04-01]

_A technical preview of Flux packaged with InfluxDB v1.7.6 and 1.7.7._

### Breaking changes
- Rename `percentile()` function to `quantile()`.

### Bug fixes
- Handle when a non-call expression is parsed as the pipe destination.
- Add error message to Compile methods for empty Spec.

## v0.23.0 [2019-03-26]

### Breaking changes
- Remove unused statistics from the struct.

### Features
- Define comparison operators between time types.
- Parse signed duration.
- Added `reduce()` function and supporting go API for implementation.
- Fix for recognizing locally scoped objects and arrays in a row function.

### Bug fixes
- Columns in percentile signature and more strict param checking.
- Report the error received when parsing a bad regex literal.
- Remove unused statistics from the struct.

## v0.22.0 [2019-03-18]

### Features
- Added a math package and ported all 64 bit go math library functions.

### Bug fixes
- Make read-like access patterns for objects thread-safe.

## v0.21.4 [2019-03-06]

### Bug fixes
- Test union.flux correctly uses sort.
- Pivot orders rowKey and columnKey by the input parameters, rather than the table column order.
- Deterministic sorting of input tables in join.
- Group key comparison works regardless of column ordering.


## v0.21.3 [2019-03-05]

### Bug fixes
- Fix test to pass in InfluxDB.
- Write table and result name in each row of CSV output.
- Make time() function accept any format that parser accepts.
- Return errors when evaluating functions.
- Prevent a deadlock in the array expression parser.


## v0.21.2 [2019-03-01]

### Bug fixes
- Add AST compiler to mappings.


## v0.21.1 [2019-03-01]

### Bug fixes
- Make ASTCompiler marshalable.
- Fix a controller test to be less flaky.
- `from()` must send deep table copies to its downstream transformations.


## v0.21.0 [2019-02-25]

### Breaking changes
- Support attaching arbitrary query metadata from the executor.

### Features
- Support attaching arbitrary query metadata from the executor.
- Socket source.

### Bug fixes
- Add locks to make diff threadsafe.


## v0.20.0 [2019-02-20]

### Features
- AST match.
- Generate ASTs from Flux test files for external consumption.
- Add compile subcommand that compiles Flux to spec.

### Bug fixes
- Change loadStorage and loadMem to be options so that they are modifiable.
- Generate skipped tests; skip in test driver.


## v0.19.0 [2019-02-11]

### Breaking changes
- Make `window()` parameters match SPEC.
- Split FromProcedureSpec into logical and physical specs.

### Features
- Add `contains()` function to check for membership in lists.
- `test` keyword.

### Bug fixes
- Raw query test case.


## v0.18.0 [2019-02-07]

### Features
- Add strings package with functions to trim/change string case.
- Make duration conversion public.
- Add assertEmpty method and use it with testing.test.
- Expose literal parsers used within the parser.
- Add testing.diff function.
- Execute command.

### Bug fixes
- Refactor the controller to remove data races.
- Member expressions using a string literal use the incorrect end bracket.
- Skip lambda evaluation when referencing nulls.
- Options editor should use ast.Expression.
- Fix decoder bug where a default table ID is given when none is required.
- Add close to SourceIterator.


## v0.17.0 [2019-01-22]

### Features
- Checks for option dependencies.
- Add query success and error metrics.
- Track nested blocks in the parser.
- Update `aggregateWindow()` to include `createEmpty` as parameter to allow for null results.
- Add query function count metrics.

### Bug fixes
- Multiplicative operators are above additive operators in precedence.
- Fix panic when copying lambda.
- Only print a package's public exports.
- Cannot access imports of imports.
- Check for schema collision when appending columns to a table.
- Process test helper had bad logic to check for errors.
- Handle rune errors correctly when decoding an illegal token.


## v0.16.1 [2019-01-17]

### Bug fixes
- Copy packages for importer copy.


##v0.16.0 [2019-01-17]

### Features
- Adds various v1 meta queries helper functions

### Bug fixes
- Fixes various UX issues.
- Object polytype.
- Fix edge case panic in `assertEquals`.
- Check for equality in time columns correctly.
- Fix bug where `assertEquals` did not check tables without a match in both streams.
- Clear return for each REPL command.


## v0.15.0 [2019-01-16]

### Features
- Add rule to remove filter true nodes.
- Checks for variable reassignment and option declarations below package block.

### Bug fixes
- Move a test file into the testing/testdata folder.


## v0.14.0 [2019-01-14]

### Breaking changes
- Implement and require builtin statements.
- Fix keys to output group key.
- Organizes builtin code into Flux packages.
- Change flux command to be a REPL.

### Features
- Implement and require builtin statements.
- Added a new utility library for generating test data.
- `columns()` function.
- Add fill function to set a default value for null values in a column.
- Organizes built-in code into Flux packages.
- Change flux command to be a REPL.
- Refactored the table builder interfaces to support null value creation.
- Aggregates process empty/all-null tables by creating a null row.
- Show nulls in REPL as empty string.
- Add ability to define built-in packages.
- Treat omitted values with no defaults as nil in CSV.
- Build arrow columns with null values.
- Converting limit to use arrow arrays.
- TableBuilder interface and ColListTableBuilder implementation support creation of nil values.

### Bug fixes
- Count nulls in the count aggregate.
- Fix keys to output group key.
- Adding test for type mismatch in group.
- Nest extern blocks for each level in scope.
- Memory leak in limit when slicing.
- Prettier formatting for package.
- Change Package.Path to be json omitempty.


## v0.13.0 [2019-01-07]

### Breaking changes
- Add File and Package nodes to the AST.

### Features
- Embed errors into the ast from the parser.
- Add no-points optimization for `from() |> keys()`.
- Add File and Package nodes to the AST.
- Add a function for checking for errors within the AST.

### Bug fixes
- Remove unneeded use of memory allocator.
- Allow the memory allocator to be nil for arrow arrays.
- Fix several bugs in copy methods add tests.
- Fix a flaky test in the controller shutdown.


## v0.12.0 [2019-01-02]
_A technical preview of Flux packaged with InfluxDB v1.7.3._

### Features
- Slice utils.
- Parse string literal object keys.
- Add tests for multi-line and escaped strings.
- Arrow helper method.
- Converting all aggregates to use arrow arrays.

### Bug fixes
- Embed plan.DefaultCost in input and output functions.
- Side effect statements are now copied between related interpreter scopes.


## v0.11.0 [2018-12-18]

### Features
- Add utility methods for converting a slice into an arrow array buffer.

### Bug fixes
- Do not panic with unbalanced parenthesis.
- Respect positive timeout for toHTTP.


## v0.10.0 [2018-12-17]

### Breaking changes
- Change "label" to "column" for state tracking functions.

### Features
- Plan validation.
- Testing framework	no longer checks output.
- Integrate arrow arrays into the table builder.
- Support packages and imports.

### Bug fixes
- Cancel all queries after timeout elapses.
- `makefile` for generating the scanner after clean was incorrect.


## v0.9.0 [2018-12-11]

### Features
- Option Editor.

### Bug fixes
- Return the source attribute in the location correctly.


## v0.8.0 [2018-12-11]

### Features
- Rule to chain group operations.
- Add package and import support to the semantic graph.
- Add `assertEquals` function to transformations.
- Parse import and package statements
- Walk pattern for AST.
- AST formatting.
- Switch over to the new parser.

### Bug fixes
- Make controller return planner failures.
- Collision between external and fresh type vars.
- fmt for import and package.
- Add import/package nodes to ast.Walk.
- Improve panic message when the wrong column type is used.
- Check nil results when computing stats.
- Suppress group push down for \_time and \_value.
- Terminal output functions must produce results.
- Fix race in interpreter.doCall.
- Fix ast.Walk for Assignemnt rename.
- Improve error message for missing object properties.
- Add unary logical expression to the parser.
- Variable declarator node needs to duplicate the location information.


## v0.7.4 (2018-12-04)

### Bug Fixes
- Add missing comparison operators.


## v0.7.3 (2018-12-04)

### Bug Fixes
- Fix the ident statement to use expression suffix.


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
