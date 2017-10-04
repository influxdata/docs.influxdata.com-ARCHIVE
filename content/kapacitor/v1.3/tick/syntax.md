---
title: Syntax

menu:
  kapacitor_1_3:
    name: Syntax
    identifier: syntax
    weight: 3
    parent: tick
---

# Concepts

The sections [Introduction](/tbd) and [Getting Started](/tbd) already presented the key concepts of **nodes** and **pipelines**.  Nodes represent process invocation units, that either take data as a batch, or in a point by point stream, and then alter that data, store that data, or trigger some other activity such as an alert.  Pipelines are simply logically organized chains of nodes.    

**Built on GO.** One important thing to keep in mind is that the TICKscript parser is built on GO.  Some arguments get passed from TICKscript into underlying GO API's, and some arguments accept GO structures or arguments that can be directly used to instantiate underlying GO structures, especially using the Duration type of the GO Time library.  

**Three Syntax domains.**  When working with TICKscript, three syntax domains will be encountered.  Overarching is the TICKscript syntax of the TICKscript file.  This is primarily composed of nodes chained together in pipelines.  Some nodes can be instantiated using strings representing InfluxQL statements.  So, InlfuxQL represents the second syntax domain that can be found.  Other nodes and methods use Lambda expressions, which represents the third syntax domain that will be met. The syntax between these domains, such as when dereferencing variables, can differ in important ways, and this can sometimes lead to confusion.

**Directed Acyclic Graphs.**  As mentioned in Getting Started, a pipeline is a Directed Acylic Graph (DAG). (For more information see [Wolfram](http://mathworld.wolfram.com/AcyclicDigraph.html) or [Wikipedia](https://en.wikipedia.org/wiki/Directed_acyclic_graph)). It contains a finite number of nodes (a.k.a. vertices) and edges.  Each edge is directed from one node to another.  No edge path can lead back to an earlier node in the path, which would result in a cycle or loop.  TICKscript paths (a.k.a pipelines and chains) typically begin with a processing mode definition node with an edge to a data set definition node and then pass their results down to filtering and processing nodes.

<!-- img src="/img/kapacitor/dag.png" width="120" height="75"  style="height: 200px; width: 320px"></img -->

# TICKscript Syntax

TICKscript is case sensitive and uses Unicode. The TICKscript parser scans TICKscript code from top to bottom and left to right instantiating variables and nodes and then chaining or linking them together into pipelines as they are encountered.  When loading a TICKscript the parser does not check for compatibility between nodes.  Edges between incompatible nodes will result in log error messages when a task is first run.

## Code Representation

As the TICKScript parser is built on GO, source files should be encoded using **UTF-8**.  A script is broken into **declarations** and **expressions** that terminate with a newline character.  

**Whitespace** is used in declarations to separate variable names from operators and literal values.  It is also used before expressions to create indentations, which indicate the hierarchy of method calls.  This also helps to make the script more readable.  Whitespace can be used in method calls in much the same way it is used in GO.  That is, it can be used to separate and to name method call arguments.  Argument naming is especially common in passing lambda expressions.  

**Comments** can be created on a single line by using a pair of forward slashes "//" before the text.  Comment forward slashes can be preceded by whitespace and need not be the first characters of a newline. However comments should not follow after a declaration or expression.

### Keywords

TICKscript is compact and contains only a small set of keywords compared to less specific languages.

| **Word** | **Usage** |
| :----|:------|
| **AND**  | Standard boolean conjunction operator. |
| **FALSE** | The literal boolean value "false". |
| **lambda** | Flags that what follows is to be interpreted as a lambda expression. |
| **OR** | Standard boolean disjunction operator. |
| **TRUE** | The literal boolean value "true". |
| **var** | Starts a variable declaration. |

Since the set of native node types available in TICKscript is limited, each node type, such as `batch` or `stream`, could be considered key.  However, node types and their taxonomy are discussed in detail below.  

### Operators

TICKscript borrows many operators from GO and adds a few which make sense in its data processing domain.

**Standard Operators**

| **Operator** | **Type** | **Usage** | **Examples** |
|:-------------|:---------|:----------|:-------------|
| **+** | Binary | Addition and concatenating strings | `3 + 6`, `total + count` and `'foo' + 'bar'` |
| **-** | Binary | Subtraction | `10 - 1`, `total - errs` |
| **\*** | Binary | Multiplication | `3 * 6`, `ratio * 100.0` |
| **/** | Binary |  Division | `36 / 4`, `errs / total` |
| **==** | Binary | Comparison of equality |  `1 == 1`, `date == today` |
| **!=** | Binary | Comparison of inequality | `result != 0`, `id != "testbed"` |
| **<** | Binary | Comparison less than | `4 < 5`, `timestamp < today` |
| **<=** | Binary | Comparison less than or equal to | `3 <= 6`, `flow <= mean` |
| **>** | Binary | Comparison greater than | `6 > 3.0`, `delta > sigma` |
| **>=** | Binary | Comparison greater than or equal to | `9.0 >= 8.1`, `quantity >= threshold` |
| **=~** | Binary | Regular expression equality.  Right value must be a regular expression <br/>or a variable holding such an expression. | `tag =~ /^cz\d+/` |
| **!~** | Binary | Negative regular expression equality. Right value must be a regular expression <br/>or a variable holding such an expression. | `tag !~ /^sn\d+/` |
| **!** | Unary | Logical not | `!TRUE`, `!cpu_idle > 70` |
| **AND** | Binary | Logical conjunction |  `rate < 20.0 AND rate >= 10` |
| **OR** | Binary | Logical disjunction | `status > warn OR delta > signma` |

Standard operators are used in TICKscript and in Lambda expressions.

**Chaining Operators**

| **Operator** | **Usage** | **Examples** |
|:-------------|:----------|:------------|
| **\|** |  Creates an instance of a new node and chains it to the node above it | `stream`<br/>&nbsp;&nbsp;&nbsp;\|`from()` |
| **.** | Invokes a property method, setting or changing an internal property in the node above | `from()`<br/>&nbsp;&nbsp;&nbsp;`.database(mydb)` |
| **@** | Invokes a user defined function (UDF) | `from()`<br/>`...`<br/>`@MyFunc()` |

Chaining operators are used to create pipeline statements.

## Variables and Literals

No scripting language would be of much use without the ability to declare variables to hold values and to initialize them with literals.  Variables in TICKscript are useful for storing and reusing values and for providing a friendly mnemonic for quickly understanding intended meaning.

### Variables

#### Naming Variables

Variables are declared using the keyword `var` at the start of the declaration and then assigning them a literal value.  Variable identifiers must begin with a standard ASCII letter and can be followed by any number of letters, digits and underscores.  Both upper and lower cases can be used.  The type the variable will hold depends upon what it is assigned when it is declared.  

**Example 1 &ndash; variable declarations**
```
var my_var = 'foo'
var my_float = 2.71
var my_int = 1
var my_node = stream
```

Variables are immutable and cannot be reassigned new values later on in the script, though they can be passed into methods.

### Literal values

Literal values are parsed into type instances and are then either passed into method arguments or assigned to variables.  The parser interprets types based on context and creates instances of the following: boolean, string, float, integer, regular expression and array.  Lambda expressions, GO Duration structures and nodes are also recognized.  The rules the parser uses to recognize a type are discussed in the following Types section.

#### Types

##### Booleans
**Booleans**. Boolean values are generated using the boolean keywords: `TRUE` and `FALSE`.  Note that these keywords use all upper case letters.  The parser will throw an error when values using lower case are used, e.g. `True` or `true`.

**Example 2 &ndash; Boolean literals**
```
var true_bool = TRUE
...
   |flatten()
       .on('host','port')
       .dropOriginalFieldName(FALSE)
```
##### Numerical Types
Any token beginning with a digit will lead to the generation of a numerical type instance.  TICKscript understands two numerical types based on GO: `int64` and `float64`.  Any numerical token containing a decimal point will result in the creation of a `float64` value.  Any numerical token that ends without containing a decimal point will result in the creation of an `int64` value.  

**Example 3 &ndash; Numerical literals**
```
var my_int = 6
var my_float = 2.71828
...

```
##### Strings
Strings begin with either one or three single single quotation marks: `'` or `'''`.  Strings can be concatenated using the addition `+` operator.  To escape quotation marks within a string delimited by a single quotation mark use the backslash character.  If it is to be anticipated that many quotation marks will be encountered inside the string delimit it using triple single quotation marks.

**Example 4 &ndash; Basic strings**

```
var region1 = 'EMEA'
var old_standby = 'foo' + 'bar'
var query1 =   'SELECT mean("sequestr") FROM "co2accumulator"."autogen".co2 WHERE "location" = \'50.0675, 14.471667\' '
var query2 = '''SELECT mean("sequestr") FROM "co2accumulator"."autogen".co2 WHERE "location" = '50.0675, 14.471667' '''
...
batch
   |query('SELECT count(sequestr) FROM "co2accumulator"."autogen".co2 WHERE sequestr < 0.25 GROUP BY location')
...   
```
To make long complex strings more readable newlines are permitted within the string.

**Example 5 &ndash; Multiline string**
```
batch
   |query('
      SELECT mean("sequestr") AS stat
      FROM "co2accumulator"."autogen".co2
      WHERE "location" = \'50.0675, 14.471667\'
      ')
```

##### Regular Expressions

| **/.../**| Unary | Between the two slashes, defines a regular expression |  /[A\|a]lbatross/, /^abc.*/ |

##### Lambda Expressions

##### Arrays

##### GO Structures

##### Nodes



**===================================================================================**
<br/>Previous documentation below<br/>
**===================================================================================**

Literals
--------

### Booleans

Boolean literals are the keywords `TRUE` and `FALSE`.
They are case sensitive.

### Numbers

Numbers are typed and are either a `float64` or an `int64`.
If the number contains a decimal it is considered to be a `float64` otherwise it is an `int64`.
All `float64` numbers are considered to be in base 10.
If an integer is prefixed with a `0` then it is considered a base 8 (octal) number, otherwise it is considered base 10.

Valid number literals:

* 1 -- int64
* 1.2 -- float64
* 5 -- int64
* 5.0 -- float64
* 0.42 -- float64
* 0400 -- octal int64


### Strings

There are two ways to write string literals:

1. Single quoted strings with backslash escaped single quotes.

    This string `'single \' quoted'` becomes the literal `single ' quoted`.

2. Triple single quoted strings with no escaping.

    This string `'''triple \' quoted'''` becomes the literal `triple \' quoted`.

### Durations

TICKscript supports durations literals.
They are of the form of InfluxQL duration literals.
See https://docs.influxdata.com/influxdb/v1.3/query_language/spec/#literals

Duration literals specify a length of time.
An integer literal followed immediately (with no spaces) by a duration unit listed below is interpreted as a duration literal.

#### Duration unit definitions

 Units  | Meaning
--------|-----------------------------------------
 u or µ | microseconds (1 millionth of a second)
 ms     | milliseconds (1 thousandth of a second)
 s      | second
 m      | minute
 h      | hour
 d      | day
 w      | week

Statements
----------

A statement begins with an identifier and any number of chaining function calls.
The result of a statement can be assigned to a variable using the `var` keyword and assignment operator `=`.

Example:

```javascript
var errors = stream
    |from()
        .measurement('errors')
var requests = stream
    |from()
    .measurement('requests')
// Join the errors and requests stream
errors
    |join(requests)
        .as('errors', 'requests')
    |eval(lambda: "errors.value" / "requests.value")
```

Format
------

### Whitespace

Whitespace is ignored and can be used to format the code as you like.

Typically property methods are indented in from their calling node.
This way methods along the left edge are chaining methods.

For example:

```javascript
stream
    |eval(lambda: "views" + "errors")
        .as('total_views') // Increase indent for property method.
    |httpOut('example') // Decrease indent for chaining method.
```

### Comments

 Basic `//` style single line comments are supported.
