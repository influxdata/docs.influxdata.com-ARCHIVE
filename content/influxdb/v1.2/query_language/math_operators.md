---
title: Mathematical Operators

menu:
  influxdb_1_2:
    weight: 80
    parent: query_language
---

Mathematical operators follow the [standard order of operations](https://golang.org/ref/spec#Operator_precedence).
That is, *parentheses* take precedence to *division* and *multiplication*, which takes precedence to *addition* and *substraction*.
For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

## Supported Operators

### Addition

You can add a constant.

```sql
SELECT "A" + 5 FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + 5 > 10
```

You can add together other field keys.

```sql
SELECT "A" + "B" FROM "add"
```
```sql
SELECT * FROM "add" WHERE "A" + "B" >= 10
```

### Subtraction

You can subtract a constant.

```sql
SELECT 1 - "A" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE 1 - "A" <= 3
```

You can subtract one field key from another field key.

```sql
SELECT "A" - "B" FROM "sub"
```
```sql
SELECT * FROM "sub" WHERE "A" - "B" <= 1
```

### Multiplication

You can multiply by a constant.

```sql
SELECT 10 * "A" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * 10 >= 20
```

You can multiply by other field keys.

```sql
SELECT "A" * "B" * "C" FROM "mult"
```
```sql
SELECT * FROM "mult" WHERE "A" * "B" <= 80
```

Multiplication distributes across other operators

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
You can divide by a constant.

```sql
SELECT 10 / "A" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / 10 <= 2
```

You can divide by other field keys.

```sql
SELECT "A" / "B" FROM "div"
```
```sql
SELECT * FROM "div" WHERE "A" / "B" >= 10
```

Division distributes across other operators

```sql
SELECT 10 / ("A" + "B" + "C") FROM "mult"
```

### Bitwise And

You can use this operator with any non-negative integers, whether they are fields or constants.
It does not work with non-integer datatypes.
If either side of the expression is negative then it will return zero.

```sql
SELECT "A" & 255 FROM "bitfields"
```

```sql
SELECT "A" & "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" & 15 > 0
```

### Bitwise Or

You can use this operator with any non-negative integers, whether they are fields or constants.
It does not work with non-integer datatypes.
If either side of the expression is negative then it will return zero.

```sql
SELECT "A" | 5 FROM "bitfields"
```

```sql
SELECT "A" | "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" | 12 = 12
```

### Bitwise Exclusive-Or

You can use this operator with any non-negative integers, whether they are fields or constants.
It does not work with non-integer datatypes.
If either side of the expression is negative then it will return zero.

```sql
SELECT "A" ^ 255 FROM "bitfields"
```

```sql
SELECT "A" ^ "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" ^ 6 > 0
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

> **Note:** Starting with version 1.2, InfluxQL supports [subqueries](/influxdb/v1.2/query_language/data_exploration/#subqueries) which offer similar functionality to using mathematical operators inside a function call.
See [Data Exploration](/influxdb/v1.2/query_language/data_exploration/#subqueries) for more information.

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` clause yields empty results for all types.
See GitHub issue [3525](https://github.com/influxdb/influxdb/issues/3525).

### Logical Operators

Using any of `!|`,`NAND`,`XOR`,`NOR` will yield parse error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.

### Bitwise Not

There is no bitwise-not operator, because the results you expect depend on the width of your bitfield.
InfluxQL does not know how wide your bitfield is, so cannot implement a suitable bitwise-not operator.

For example, if your bitfield is 8 bits wide, then to you the integer 1 represents the bits `0000 0001`.  
The bitwise-not of this should return the bits `1111 1110`, i.e. the integer 254.

However, if your bitfield is 16 bits wide, then the integer 1 represents the bits `0000 0000 0000 0001`.
The bitwise-not of this should return the bits `1111 1111 1111 1110`, i.e. the integer 65534.

#### Solution

You can easily implement a bitwise-not operation by using the `^` (bitwise xor) operator together with the number representing all-ones for your word-width:

For 8-bit data:

```sql
SELECT "A" ^ 255 FROM "data"
```

For 16-bit data:

```sql
SELECT "A" ^ 65535 FROM "data"
```

For 32-bit data:

```sql
SELECT "A" ^ 4294967295 FROM "data"
```

In each case the constant you need can be calculated as `(2 ** width) - 1`.
