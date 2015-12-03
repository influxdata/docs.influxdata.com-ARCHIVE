---
title: Mathematical Operators
aliases:
  - /docs/v0.9/query_language/math_operators.html
---

**Note:** Currently all mathematical operators work solely on `floats`.  For the moment being any `int` involved will be converted to a `float` as any operation performed on an `int` would return a `null` value. This fixes the problem for all integer values up to 2^53. Issue [3614](https://github.com/influxdb/influxdb/issues/3614) tracks implementing true integer math, which will support values up to 2^63.

Mathematical operators follow the standard order of operations. That is, *parentheses* take precedence to *division* and *multiplication*, which takes precedence to *addition* and *substraction*. For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

## Supported Operators

**Note:** Any expression that involves adding, subtracting, or dividing by 0 yields a `null` value. This is not intentional and is the result of a bug. See issue [3000](https://github.com/influxdb/influxdb/issues/3000).

### Addition

You can add a constant.

```sql
SELECT A + 5 FROM add
```

You can add together other field keys.

```sql
SELECT A + B FROM add
```

### Subtraction

You can subtract a constant.

```sql
SELECT 1 - A FROM sub
```

You can subtract one field key from another field key.

```sql
SELECT A - B FROM sub
```

### Multiplication

You can multiply by a constant.

```sql
SELECT A + B FROM add
SELECT 10 * A FROM mult
```

You can multiply by other field keys.

```sql
SELECT A * B * C FROM mult
```

Multiplication distributes across other operators

```sql
SELECT 10 * (A + B + C) FROM mult
```

```sql
SELECT 10 * (A - B - C) FROM mult
```

```sql
SELECT 10 * (A + B - C) FROM mult
```

### Division
You can divide by a constant.

```sql
SELECT 10 / A FROM div
```

You can divide by other field keys.

```sql
SELECT A / B FROM div
```

Division distributes across other operators

```sql
SELECT 10 / (A + B + C) FROM mult
```

## Operators with Functions

The use of mathematical operators inside of function calls is currently unsupported.

For example

```sql
SELECT 10 * mean(value) FROM cpu
```
will work, however
```sql
SELECT mean(10 * value) FROM cpu
```
will yield a parse error.

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=` will yield empty results for all types. See issue [3525](https://github.com/influxdb/influxdb/issues/3525).

### Miscellaneous

Using any of `%`, `^` will yield a parse error. If you would like to see support for these operators open an [issue](https://github.com/influxdb/influxdb/issues/new).

## Logical Operators are Unsupported

Using any of `&`,`|`,`!|`,`NAND`,`XOR`,`NOR` will yield parse error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.
