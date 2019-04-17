---
title: Release Notes/Changelog
menu:
  flux_0_24:
    parent: About the project
    weight: 1
---

{{% note %}}
### Breaking changes since last Flux update
Flux v0.24 is packaged with the InfluxDB v1.7.6.
InfluxDB v1.7.3-1.7.5 included Flux v0.12.
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

_A technical preview of Flux packaged with InfluxDB v1.7.6._

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
