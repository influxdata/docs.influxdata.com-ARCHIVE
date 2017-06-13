---
title: Mathematical Operators

menu:
  influxdb_1_3:
    weight: 80
    parent: query_language
---

Mathematical operators follow the standard order of operations.
That is, *parentheses* take precedence to *division* and *multiplication*, which takes precedence to *addition* and *subtraction*.
For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

### Content

* [Supported Operators](#supported-operators)
  * [Addition](#addition)
  * [Subtraction](#subtraction)
  * [Multiplication](#multiplication)
  * [Division](#division)
  * [Modulo](#modulo)
  * [Common Issues with Operators](#common-issues-with-operators)
* [Operators with Functions](#operators-with-functions)
* [Unsupported Operators](#unsupported-operators)

## Supported Operators

### Addition

Perform addition with a constant.

```sql
SELECT "A" + 5 FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + 5 > 10
```

Perform addition on two fields.

```sql
SELECT "A" + "B" FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + "B" >= 10
```

### Subtraction

Perform subtraction with a constant.

```sql
SELECT 1 - "A" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE 1 - "A" <= 3
```

Perform subtraction with two fields.

```sql
SELECT "A" - "B" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE "A" - "B" <= 1
```

### Multiplication

Perform multiplication with a constant.

```sql
SELECT 10 * "A" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * 10 >= 20
```

Perform multiplication with two fields.

```sql
SELECT "A" * "B" * "C" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * "B" <= 80
```

Multiplication distributes across other operators.

```sql
SELECT 10 * ("A" + "B" + "C") FROM "mult"
```

```sql
SELECT 10 * ("A" - "B" - "C") FROM "mult"
```

```sql
SELECT 10 * ("A" + "B" - "C") FROM "mult"
```

### Division
Perform division with a constant.

```sql
SELECT 10 / "A" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / 10 <= 2
```

Perform division with two fields.

```sql
SELECT "A" / "B" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / "B" >= 10
```

Division distributes across other operators.

```sql
SELECT 10 / ("A" + "B" + "C") FROM "mult"
```

### Modulo

Perform modulo arithmetic with a constant.

```
SELECT "B" % 2 FROM "modulo"
```
```
SELECT "B" FROM "modulo" WHERE "B" % 2 = 0
```

Perform modulo arithmetic on two fields.

```
SELECT "A" % "B" FROM "modulo"
```
```
SELECT "A" FROM "modulo" WHERE "A" % "B" = 0
```

### Common Issues with Operators

InfluxDB does not support combining mathematical operations with a wildcard (`*`) or [regular expression](/influxdb/v1.3/query_language/data_exploration/#regular-expressions) in the `SELECT` clause.
The following queries are invalid and the system returns an error:

Perform a mathematical operation on a wildcard.
```
> SELECT * + 2 FROM "nope"
ERR: unsupported expression with wildcard: * + 2
```

Perform a mathematical operation on a wildcard within a function.
```
> SELECT COUNT(*) / 2 FROM "nope"
ERR: unsupported expression with wildcard: count(*) / 2
```

Perform a mathematical operation on a regular expression.
```
> SELECT /A/ + 2 FROM "nope"
ERR: error parsing query: found +, expected FROM at line 1, char 12
```

Perform a mathematical operation on a regular expression within a function.
```
> SELECT COUNT(/A/) + 2 FROM "nope"
ERR: unsupported expression with regex field: count(/A/) + 2
```
 
## Operators with Functions

The use of mathematical operators inside of function calls is currently unsupported.
Note that InfluxDB only allows functions in the `SELECT` clause.

For example

```sql
SELECT 10 * mean("value") FROM "cpu"
```
will work, however
```sql
SELECT mean(10 * "value") FROM "cpu"
```
will yield a parse error.

> **Note:** Starting with version 1.2, InfluxQL supports [subqueries](/influxdb/v1.3/query_language/data_exploration/#subqueries) which offer similar functionality to using mathematical operators inside a function call.
See [Data Exploration](/influxdb/v1.3/query_language/data_exploration/#subqueries) for more information.

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` clause yields empty results for all types.
See GitHub issue [3525](https://github.com/influxdb/influxdb/issues/3525).

### Miscellaneous

Using `^` yields a parse error.
If you would like support for that operator, please open an [issue](https://github.com/influxdb/influxdb/issues/new).

### Logical Operators

Using any of `&`,`|`,`!|`,`NAND`,`XOR`,`NOR` will yield parse error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.
