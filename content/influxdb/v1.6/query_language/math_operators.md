---
title: InfluxQL mathematical operators

menu:
  influxdb_1_6:
    name: Mathematical operators
    weight: 70
    parent: InfluxQL
---

Mathematical operators follow the [standard order of operations](https://golang.org/ref/spec#Operator_precedence).
That is, parentheses take precedence to division and multiplication, which takes precedence to addition and subtraction.
For example `5 / 2 + 3 * 2 =  (5 / 2) + (3 * 2)` and `5 + 2 * 3 - 2 = 5 + (2 * 3) - 2`.

### Content

* [Mathematical Operators](#mathematical-operators)
  * [Addition](#addition)
  * [Subtraction](#subtraction)
  * [Multiplication](#multiplication)
  * [Division](#division)
  * [Modulo](#modulo)
  * [Bitwise AND](#bitwise-and)
  * [Bitwise OR](#bitwise-or)
  * [Bitwise Exclusive-OR](#bitwise-exclusive-or)
  * [Common Issues with Mathematical Operators](#common-issues-with-mathematical-operators)
* [Unsupported Operators](#unsupported-operators)


## Mathematical Operators

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

### Bitwise AND

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" & 255 FROM "bitfields"
```

```sql
SELECT "A" & "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" & 15 > 0
```

```sql
SELECT "A" & "B" FROM "booleans"
```

```sql
SELECT ("A" ^ true) & "B" FROM "booleans"
```


### Bitwise OR

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" | 5 FROM "bitfields"
```

```sql
SELECT "A" | "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" | 12 = 12
```

### Bitwise Exclusive-OR

You can use this operator with any integers or Booleans, whether they are fields or constants.
It does not work with float or string datatypes, and you cannot mix integers and Booleans.

```sql
SELECT "A" ^ 255 FROM "bitfields"
```

```sql
SELECT "A" ^ "B" FROM "bitfields"
```

```sql
SELECT * FROM "data" WHERE "bitfield" ^ 6 > 0
```

### Common Issues with Mathematical Operators

#### Issue 1: Mathematical operators with wildcards and regular expressions
InfluxDB does not support combining mathematical operations with a wildcard (`*`) or [regular expression](/influxdb/v1.6/query_language/data_exploration/#regular-expressions) in the `SELECT` clause.
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

#### Issue 2: Mathematical operators with functions

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

> InfluxQL supports [subqueries](/influxdb/v1.6/query_language/data_exploration/#subqueries) which offer similar functionality to using mathematical operators inside a function call.
See [Data Exploration](/influxdb/v1.6/query_language/data_exploration/#subqueries) for more information.

## Unsupported Operators

### Inequalities

Using any of `=`,`!=`,`<`,`>`,`<=`,`>=`,`<>` in the `SELECT` clause yields empty results for all types.
See GitHub issue [3525](https://github.com/influxdb/influxdb/issues/3525).

### Logical Operators

Using any of `!|`,`NAND`,`XOR`,`NOR` yield a parser error.

Additionally using `AND`, `OR` in the `SELECT` clause of a query will not behave as mathematical operators and simply yield empty results, as they are tokens in InfluxQL.
However, you can apply the bitwise operators `&`, `|` and `^` to Boolean data.

### Bitwise Not

There is no bitwise-not operator, because the results you expect depend on the width of your bitfield.
InfluxQL does not know how wide your bitfield is, so cannot implement a suitable bitwise-not operator.

For example, if your bitfield is 8 bits wide, then to you the integer 1 represents the bits `0000 0001`.
The bitwise-not of this should return the bits `1111 1110`, i.e. the integer 254.

However, if your bitfield is 16 bits wide, then the integer 1 represents the bits `0000 0000 0000 0001`.
The bitwise-not of this should return the bits `1111 1111 1111 1110`, i.e. the integer 65534.

#### Solution

You can implement a bitwise-not operation by using the `^` (bitwise xor) operator together with the number representing all-ones for your word-width:

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
