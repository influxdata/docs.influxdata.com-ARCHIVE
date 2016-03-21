---
title: Mathematical Operators

menu:
  influxdb_011:
    weight: 70
    parent: query_language
---

Mathematical operators follow the standard order of operations.
That is, *parentheses* take precedence to *division* and *multiplication*, which takes precedence to *addition* and *substraction*.
For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

## Supported Operators

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

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` clause yields empty results for all types.
See GitHub issue [3525](https://github.com/influxdb/influxdb/issues/3525).

### Miscellaneous

Using any of `%`, `^` will yield a parse error.
If you would like to see support for these operators open an [issue](https://github.com/influxdb/influxdb/issues/new).

## Logical Operators are Unsupported

Using any of `&`,`|`,`!|`,`NAND`,`XOR`,`NOR` will yield parse error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.
