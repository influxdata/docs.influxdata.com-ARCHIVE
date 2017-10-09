---
title: Syntax

menu:
  kapacitor_1_3:
    name: Syntax
    identifier: syntax
    weight: 3
    parent: tick
---

# Table of Contents

   * [Concepts](#concepts)
   * [TICKscript syntax](#tickscript-syntax)
      * [Code representation](#code-representation)
      * [Variables and literals](#variables-and-literals)
      * [Statements](#statements)
   * [InfluxQL in TICKscript](#influxql-in-tickscript)
   * [Lamdba expressions](#lambda-expressions)
   * [Summary of variable use between syntactic domains](#summary-of-variable-use-between-syntactic-domains)
   * [Gotchas](#gotchas)

# Concepts

The sections [Introduction](/tbd) and [Getting Started](/tbd) already presented the key concepts of **nodes** and **pipelines**.  Nodes represent process invocation units, that either take data as a batch, or in a point by point stream, and then alter that data, store that data, or trigger some other activity such as an alert.  Pipelines are simply logically organized chains of nodes.    

**Built on GO.** One important thing to keep in mind is that the TICKscript parser is built on GO.  Some arguments get passed from TICKscript into underlying GO API's, and some arguments accept arguments that can be directly used to instantiate underlying GO structures, especially using the Duration type of the GO Time library.  

**Three Syntax domains.**  When working with TICKscript, three syntax domains will be encountered.  Overarching is the TICKscript syntax of the TICKscript file.  This is primarily composed of nodes chained together in pipelines.  Some nodes on instantiation use strings representing InfluxQL statements.  So, InlfuxQL represents the second syntax domain that can be found.  Other nodes and methods use Lambda expressions, which represents the third syntax domain that will be met. The syntax between these domains, such as when accessing variable values, can differ in important ways, and this can sometimes lead to confusion.

**Directed Acyclic Graphs.**  As mentioned in Getting Started, a pipeline is a Directed Acylic Graph (DAG). (For more information see [Wolfram](http://mathworld.wolfram.com/AcyclicDigraph.html) or [Wikipedia](https://en.wikipedia.org/wiki/Directed_acyclic_graph)). It contains a finite number of nodes (a.k.a. vertices) and edges.  Each edge is directed from one node to another.  No edge path can lead back to an earlier node in the path, which would result in a cycle or loop.  TICKscript paths (a.k.a pipelines and chains) typically begin with a processing mode definition node with an edge to a data set definition node and then pass their results down to filtering and processing nodes.

<!-- img src="/img/kapacitor/dag.png" width="120" height="75"  style="height: 200px; width: 320px"></img -->

# TICKscript syntax

TICKscript is case sensitive and uses Unicode. The TICKscript parser scans TICKscript code from top to bottom and left to right instantiating variables and nodes and then chaining or linking them together into pipelines as they are encountered.  When loading a TICKscript the parser does not check for compatibility between nodes.  Edges between incompatible nodes will result in log error messages when a task is first run.

## Code representation

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
| **+** | Binary | Addition and string concatenation | `3 + 6`, `total + count` and `'foo' + 'bar'` |
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
| **\|** |  Declares an instance of a new node and chains it to the node above it | `stream`<br/>&nbsp;&nbsp;&nbsp;\|`from()` |
| **.** | Invokes a property method, setting or changing an internal property in the node above | `from()`<br/>&nbsp;&nbsp;&nbsp;`.database(mydb)` |
| **@** | Declares a user defined function (UDF) | `from()`<br/>`...`<br/>`@MyFunc()` |

Chaining operators are used to create pipeline statements.

## Variables and literals

No scripting language would be of much use without the ability to declare variables to hold values and to initialize them with literals.  Variables in TICKscript are useful for storing and reusing values and for providing a friendly mnemonic for quickly understanding what a variable represents.

### Variables

#### Naming variables

Variables are declared using the keyword `var` at the start of the declaration and then assigning them a literal value.  Variable identifiers must begin with a standard ASCII letter and can be followed by any number of letters, digits and underscores.  Both upper and lower case can be used.  The type the variable will hold depends upon the literal value it is assigned when it is declared.  

**Example 1 &ndash; variable declarations**
```javascript
var my_var = 'foo'
var MY_VAR = 'BAR'
var my_float = 2.71
var my_int = 1
var my_node = stream
```

Variables are immutable and cannot be reassigned new values later on in the script, though they can be passed into methods.

### Literal values

Literal values are parsed into type instances.  They can be declared directly in method arguments or can be assigned to variables.  The parser interprets types based on context and creates instances of the following: boolean, string, float, integer, regular expression.  Lists, lambda expressions, GO Duration structures and nodes are also recognized.  The rules the parser uses to recognize a type are discussed in the following Types section.

#### Types

##### Booleans
**Booleans**. Boolean values are generated using the boolean keywords: `TRUE` and `FALSE`.  Note that these keywords use all upper case letters.  The parser will throw an error when values using lower case are used, e.g. `True` or `true`.

**Example 2 &ndash; Boolean literals**
```javascript
var true_bool = TRUE
...
   |flatten()
       .on('host','port')
       .dropOriginalFieldName(FALSE)
```

In Example 2 above the first line shows a simple assignment using a boolean literal.  The second example shows using the boolean literal `FALSE` in a method call.

##### Numerical types
Any literal token beginning with a digit will lead to the generation of a numerical type instance.  TICKscript understands two numerical types based on GO: `int64` and `float64`.  Any numerical token containing a decimal point will result in the creation of a `float64` value.  Any numerical token that ends without containing a decimal point will result in the creation of an `int64` value.  If an integer is prefixed with the zero character, `0`, it is interpreted as an octal.

**Example 3 &ndash; Numerical literals**
```javascript
var my_int = 6
var my_float = 2.71828
var my_octal = 0400
...
```
In Example 3 above `my_int` is of type `int64`, `my_float` is of type `float64` and `my_octal` is of type `int64` octal.

##### Strings
Strings begin with either one or three single single quotation marks: `'` or `'''`.  Strings can be concatenated using the addition `+` operator.  To escape quotation marks within a string delimited by a single quotation mark use the backslash character.  If it is to be anticipated that many quotation marks will be encountered inside the string delimit it using triple single quotation marks instead.  The double quotation mark, when used to access field and tag values, can be used without an escape.   

**Example 4 &ndash; Basic strings**

```javascript
var region1 = 'EMEA'
var old_standby = 'foo' + 'bar'
var query1 =   'SELECT mean("sequestr") FROM "co2accumulator"."autogen".co2 WHERE "location" = \'50.0675, 14.471667\' '
var query2 = '''SELECT mean("sequestr") FROM "co2accumulator"."autogen".co2 WHERE "location" = '50.0675, 14.471667' '''
...
batch
   |query('SELECT count(sequestr) FROM "co2accumulator"."autogen".co2 WHERE sequestr < 0.25 GROUP BY location')
...   
```
In Example 4 above the first line shows a simple string assignment using a string literal.  The second line shows use of the concatenation operator.  Lines three and four show two different approaches to declaring complex string literals with and without internally escaped single quotation marks.  The final example shows using a string literally directly in a method call.

To make long complex strings more readable newlines are permitted within the string.

**Example 5 &ndash; Multiline string**
```javascript
batch
   |query('
      SELECT mean("sequestr") AS stat
      FROM "co2accumulator"."autogen".co2
      WHERE "location" = \'50.0675, 14.471667\'
      ')
```
In Example 5 above the string is broken up to make the query more easily understood.

##### String templates

String templates allow node properties, tags and fields to be added to a string. This is useful when writing alert messages.  To add a property, tag or field value to a string template, it needs to be wrapped inside of double curly braces: "{{}}".

**Example 6 &ndash; Variables inside of string templates**
```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" }}')
```    
In Example 6 three values are added to two string templates.  In the call to the setter `id()` the value of the tag `"host"` is added to the start of the string.  The call to the setter `message()` then adds the `id` and then the value of the field `"stat"`.  This is currently applicable with the [Alert](/tbd) node and is discussed further in the section [Accessing values in string templates](#accessing-values-in-string-templates) below.

##### String lists

A string list is a collection of strings declared between two brackets.

**Example 6 &ndash; String list**
```javascript
var my_str_list = [ 'cz', 'sk', 'pl', 'hu', 'at' ]
```
<p style="color: red">FIXME COMMENT - I see that I can create this in a script, but cannot derefence the internal elements.  I also see in the code base, that there is a String List node (tick/ast/parser.go:366) which creates a list of String nodes.  However, I cannot seem to find an example, even in tests, where this is used.  Is there a use case for this?</p>

##### Regular expressions

As in Javascript regular expressions begin and end with a forward slash: `/`.  The expression content should be compatible with the GO [regular expression library](https://golang.org/pkg/regexp/syntax/) (`regexp`).

**Example 7 &ndash; Regular expressions**
```javascript
var cz_turbines = /^cz\d+/
var adr_senegal = /\.sn$/
var local_ips = /^192\.168\..*/
...
var locals = stream
   |from()
      .measurement('responses')
      .where(lambda: "node" =~ local_ips )

var south_afr = stream
   |from()
      .measurement('responses')
      .where(lambda: "dns_node" =~ /\.za$/ )       
```
In Example 7 the first three examples show the assignment of regular expressions to variables.  The `locals` stream reuses the regular expression assigned to the variable `local_ips`. The `south_afr` stream uses a regular expression comparison with the regular expression declared literally as a part of the lambda expression.

##### Lambda expressions as literals

A lambda expression is a parameter representing a short easily understood function to be passed into a method call or held in a variable. It can wrap a boolean expression, a mathematical expression or a call to an internal stateful function.  As of the release 1.3 the three functions are provided.

   * `sigma` - counts the number of standard deviations a give value is from the running mean.
   * `count` - counts the number of values processed.
   * `spread`- computes the running range of all values.

Additionally it is possible to use stateless type conversion and mathematical functions.  These are discussed in the sections [Type converversion](#type-conversion) and [Lambda Expressions](#lambda-expressions) below.  Lambda expressions are presented in detail in the topic [Lambda Expressions](/kapacitor/v1.3/tick/expr/)   

Lambda expressions begin with the token `lambda` followed by a colon, ':' &ndash; `lambda:`.  

**Example 8 &ndash; Lambda expressions**
```javascript
var my_lambda = lambda: 1 > 0
var crit_lambda = lambda: "usage_idle" < 95
...
var data = stream
  |from()
...
var alert = data
  |eval(lambda: sigma("stat"))
    .as('sigma')
    .keep()
  |alert()
    .id('{{ index .Tags "host"}}/cpu_used')
    .message('{{ .ID }}:{{ index .Fields "stat" }}')
    .info(lambda: "stat" > info OR "sigma" > infoSig)
    .warn(lambda: "stat" > warn OR "sigma" > warnSig)
    .crit(lambda: "stat" > crit OR "sigma" > critSig)

```
Example 8 above shows that a lambda expression can be directly assigned to a variable.  In the eval node a lamda statement is used which calls the sigma function. The alert node uses lambda expressions to define the log levels of given events.  

##### GO Duration structures

GO duration structures are generated internally whenever a duration literal is encountered in the script in a context to which a time duration can be applied.  This syntax follows the same syntax present in [InfluxQL](https://docs.influxdata.com/influxdb/v1.3/query_language/spec/#literals).  A duration literal is comprised of two parts: an integer and a duration unit.  It is essentially an integer terminated by one or a pair of reserved characters, which represent a unit of time.

**Unit**  | **Meaning**
-------|-----------------------------------------
u or µ | microseconds (1 millionth of a second)
ms     | milliseconds (1 thousandth of a second)
s      | second
m      | minute
h      | hour
d      | day
w      | week

**Example 9 &ndash; Duration expressions**
```javascript
var period = 10s
var every = 10s
...
var views = batch
    |query('SELECT sum(value) FROM "pages"."default".views')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)
```

In Example 9 above the first two lines show the declaration of Duration types.  The first represents a period of 10 seconds and the second a time frame of 10 seconds.  The final example shows declaring duration literals directly in method calls.

##### Nodes

Like the simpler types Node types are declared and can be assigned to variables.  More often they are added to pipelines using chaining methods.

**Example 10 &ndash; Node expressions**
```javascript
var data = stream
  |from()
    .database('telegraf')
    .retentionPolicy('autogen')
    .measurement('cpu')
    .groupBy('host')
    .where(lambda: "cpu" == 'cpu-total')
  |eval(lambda: 100.0 - "usage_idle")
    .as('used')
  |window()
    .period(period)
    .every(every)
  |mean('used')
    .as('stat')
...
var alert = data
  |eval(lambda: sigma("stat"))
    .as('sigma')
    .keep()
...    
```
In Example 10 above, in the first section, five nodes are created.  The top level node `stream` is assigned to the variable `data`.  `stream` is then used as the root of the pipeline to which the nodes `from`, `eval`, `window` and `mean` are chained in order. In the second section the pipeline is then extended using assignment to the variable `alert`, so that a second `eval` node can be applied to the data.  

#### Working with arguments and variables

While it is possible to declare and use variables in TICKscript, it is also possible to work with tags and fields drawn from InfluxDB data series. This is most evident in the examples presented so far. The following section explores working not only with variables but also with tag and field values, that should be found in the data.    

##### Accessing values

As was pointed out in the [Getting started guide](http://localhost:1414/kapacitor/v1.3/introduction/getting_started/#gotcha-single-versus-double-quotes) accessing data tags and fields, using string literals and accessing TICKscript variables each involves different syntax, which can lead to confusion.  Additionally it is possible to access the results of lambda expressions used with certain nodes.  

   * **Variables** &ndash; To access a _TICKscript variable_ simply use its identifier.  

   **Example 11 &ndash; Variable access**
   ```javascript
   var db = 'website'
   ...
   var data = stream
    |from()
        .database(db)
   ...
   ```
   In Example 11 the variable `db` is assigned the literal value `'website'`.  This is then used in the setter `.database()` under the chaining method `from()`.

   * **String literals** &ndash; To declare a _string literal_ use single quotation marks as discussed in the section [Strings](#strings) above.

   * **Tag and Field values** &ndash; To access a _tag value_ or a _field value_ from the data set use double quotation marks.

   **Example 12 &ndash; Field access**
   ```javascript
   // Data frame
  var data = stream
     |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        .groupBy('host')
        .where(lambda: "cpu" == 'cpu-total')
     |eval(lambda: 100.0 - "usage_idle")
        .as('used')
   ...        
   ```
   In Example 12 two values from the data frame are accessed.  In the `where()` method call the lambda expression uses the tag `"cpu"` to filter the data frame down to only datapoints whose "cpu" tag equals the literal value of `'cpu-total'`.  The chaining method `eval()` also takes a lambda expression that accesses the field `"usage-idle"` to calculate cpu processing power 'used'.

   * **Named lambda expression results** &ndash; Lambda expression results get named using an `as()` method.  Think of the `as()` method functioning just like the 'AS' keyword in InfluxQL.  See the `eval()` method in Example 12 above.  The results of lambda expressions can be accessed with double quotation marks, just like data fields.  

  **Example 13 &ndash; Name lambda expression access**

  ```javascript
  ...
      |window()
        .period(period)
        .every(every)
      |mean("used")
        .as('stat')

    // Thresholds
    var alert = data
      |eval(lambda: sigma("stat"))
        .as('sigma')
        .keep()
      |alert()
        .id('{{ index .Tags "host"}}/cpu_used')
        .message('{{ .ID }}:{{ index .Fields "stat" }}')
        .info(lambda: "stat" > info OR "sigma" > infoSig)
        .warn(lambda: "stat" > warn OR "sigma" > warnSig)
        .crit(lambda: "stat" > crit OR "sigma" > critSig)
  ```
  Example 13 above continues the pipeline from Example 12.  In Example 12, the results of the lambda expression named as `'used'` under the `eval()` method are then accessed, in Example 13, as an argument to the method `'mean()'`, which then names its result _as_ `'stat'`.  A new statement then begins.  This contains a new call to the method `'eval()'`, which has a lambda expression that accesses `"stat"` and sets its result _as_ `'sigma'`.  `"stat"` is also accessed in the `message()` method and the threshold methods under the `alert()` chaining method.  The named result `"sigma"` is also used in the lambda expressions of these methods.

##### Accessing values in string templates

As mentioned in the section [String templates](#string-templates) it is possible to add values from node specific properties, tags and fields to output strings.  This can be seen under the alert node in Example 13.  The accessor expression is wrapped in two curly braces.  To access a property a period, `.`, is used before th identifier.  To access a value from tags or fields the token 'index' is used, followed by a period and then the part of the data series to be accessed (e.g. `.Tag` or `.Field`), the actual name is then specified in double quotes.      

```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" }}')
```    

For more specific information see the [Alert](/tbd) node documentation.

##### Type conversion

Within lambda expressions it is possible to use stateless conversion functions to convert values between types.

   * `bool()` - converts a string, int64, float64 to boolean.  
   * `int()` - converts a string, float64, boolean or duration type to an int64.
   * `float()` - converts a string, int64 or boolean to float64.
   * `string()` - converts an int64, float64, boolean or duration value to a string.
   * `duration()` - converts an int64, float64 or string to a duration type.  

**Example 14 &ndash; Type conversion**

```javascript
   |eval(lambda: float("total_error_responses")/float("total_responses") * 100.0)
```

In Example 14 above the `float` conversion function is used to ensure that the calculated percentage uses floating point precision when the field values in the InfluxDB may have been stored as integers.

##### Numerical precision

<!-- issue 1244 -->

When writing floating point values in messages, or to InfluxDB it might be helpful to specify the decimal precision in order to make the values more readable or better comparable.  For example in the `messsage()` method of an `alert` node it is possible to "pipe" a value to a `printf` statement.  

```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" | printf "%0.2f" }}')
```   

When working with floating point values in lambda expressions, it is possible to use the floor function and powers of ten to round to a less precise value.  Note that since values are stored as 64bits, this has no effect on storage.  If this were to be used with the `InfluxDBOUt` node, for example when downsizing data, it could lead to a needless loss of information.   

**Example 15 &ndash; Rendering floating points less precise**
```javascript
stream
 // Select just the cpu measurement from our example database.
 |from()
    .measurement('cpu')
 |eval(lambda: floor("usage_idle" * 1000.0)/1000.0)
    .as('thousandths')
    .keep('usage_user','usage_idle','thousandths')
 |alert()
    .crit(lambda: "thousandths" <  95.000)
    .message('{{ index .Fields "thousandths" }}')
       // Whenever we get an alert write it to a file.
    .log('/tmp/alerts.log')   
```
Example 15 accomplishes something similar to using `printf`.  The `usage_idle` value is rounded down to thousandths of a percent and then used for comparison in the threshold method of the alert node.  It is then written into the alert message.

##### Time precision

<!-- Issue 1244 -->

As Kapacitor and TICKscripts can be used to write values into an InfluxDB time series database, it will be necessary, in some cases, to specify the time precision to be used.  This occurs when working with the `InfluxDBOut` node, whose precision property can be set.  It is important not to confuse _mathematical_ precision, which is used most commonly with field values, and _time_ precision which is specified for timestamps.  

**Example 16 &ndash; Setting time precision with InfluxDBOut**
```javascript
...
   |influxDBOut()
      .database('co2accumulator')
      .retentionPolicy('autogen')
      .measurement('testvals')
      .precision('m')
      .tag('test','true')
      .tag('version','0.1')
...      
```
In Example 16 the time precision of the series to be written to the database "co2accumulator" as measurement "testvals" is set to the unit minutes.  

Valid values for precision are the same as those used in InfluxDB.

|String|Unit|
|:-----|----|
| "ns" | nanoseconds |
| "ms" | milliseconds |
| "s" | seconds |
| "m" | minutes |
| "h" | hours |

<!--
##### Regular expressions
TODO:  Is there more to be said about regular expression?
-->
## Statements

There are two types of statements in TICKscript: Declarations and Expressions.  Declarations declare variables.  Expressions express a pipeline (a.k.a chain) of function calls, which instantiate and set the properties of processing nodes.   

### Declarations

Declarations begin with the "var" keyword followed by an identifier for the variable being declared.  An assignment operator follows with a literal right side value, which will set the type and value for the new variable.

**Example 17 &ndash; Typical declarations**
```javascript
...
var db = 'website'
var rp = 'autogen'
var measurement = 'responses'
var whereFilter = lambda: ("lb" == '17.99.99.71')
var name = 'test rule'
var idVar = name + ':{{.Group}}'
...
```
Example 17 shows six declaration statements, that create variables holding strings and a lambda expression.

A declaration can also be used to assign an expression to a variable.  

**Example 18 &ndash; Declaring an expression to a variable**
```javascript
var data = stream
    |from()
        .database(db)
        .retentionPolicy(rp)
```
In Example 18 the `data` variable holds the stream pipeline declared in the expression beginning with the node `stream`.

### Expressions

An expression begins with a node identifier or a variable identifier holding another expression.  It then chains together additional node instantiation methods (chaining methods), property setters (property methods) or user defined functions (UDF).  The pipe operator "|" indicates the start of a chaining method call, returning a new node into the chain.  The dot operator "." adds a property setter.  The ampersand operator "@" introduces a user defined function.

Expressions can be written all on a single line, but this can lead to readability issues.  The command `kapacitor show <taskname>` will pretty print scripts using indentation.  Adding a new line and indenting new method calls is the recommended practice for writing TICKscript expressions.  Typically, when a new chaining method is introduced in an expression, a newline is created and the new link in the chain gets indented three or more spaces.  Likewise, when a new property setter is called, it is set out on a new line and indented an additional number of spaces.  For readability user defined functions should be indented the same as chaining methods.  

An expression ends with the last setter of the last node in the pipeline.

**Example 19 &ndash; Single line expressions**
```javascript
stream|from().measurement('co2')|window().period(1m).every(30s).align()
   |eval(lambda: sqrt("mofcap") ).as('sqrt')
   |influxDBOut().database('co2accumulator').retentionPolicy('autogen').measurement('testvals')
       .tag('test','true').tag('version','0.1')

...
```
Example 19 shows an expression with a number of nodes and setters declared all on the same line.  While this is possible, it is not the recommended style.    

**Example 20 &ndash; Recommended expression syntax**
```javascript
// Dataframe
var data = batch
  |query('''SELECT mean(used_percent) AS stat FROM "telegraf"."autogen"."mem" ''')
    .period(period)
    .every(every)
    .groupBy('host')

// Thresholds
var alert = data
  |eval(lambda: sigma("stat"))
    .as('sigma')
    .keep()
  |alert()
    .id('{{ index .Tags "host"}}/mem_used')
    .message('{{ .ID }}:{{ index .Fields "stat" }}')
    .info(lambda: "stat" > info OR "sigma" > infoSig)
    .warn(lambda: "stat" > warn OR "sigma" > warnSig)
    .crit(lambda: "stat" > crit OR "sigma" > critSig)

// Alert
alert
  .log('/tmp/mem_alert_log.txt')
```
Example 20, taken from the example [mem_alert_batch.tick](https://github.com/influxdata/kapacitor/blob/master/examples/telegraf/mem/mem_alert_batch.tick) in the code base, shows the recommended style for writing expressions.  This example contains three expression statements.  The first begins with the declaration of the batch node for the data frame.  This gets assigned to the variable data.  The second expression takes the data variable and defines thresholds for warning messages.  This gets assigned to the alert variable.  The third expression sets the log property of the alert node.  

### Node instantiation

With two exceptions (`stream` and `batch`) nodes always occur in pipeline expressions (chains), where they are instantiated through chaining methods.  For each node type, the method that creates an instance of that type uses the same signature.  So if a `query` node instantiates an `eval` node and adds it to the chain, and if a `from` node can also create an `eval` node and add it to the chain, the chaining method creating a new `eval` node will accept the same arguments (e.g. one or more lamdba expressions) regardless of which node created it.  

examples...    

### Pipelines

# InfluxQL in TICKscript

## How InfluxQL is encountered

## Some InfluxQL essentials

# Lambda expressions

Lambda expressions are discussed in detail in the following section, [Lambda expressions](/kapacitor/v1.3/tick/expr/).
<!-- N.B. the topic lamda expressions are discssed in the next section -->

   * Declaration
   * Variables
   * Operators
   * Functions in lambda expressions

 TBD

## How lambda expressions are encountered

   * Lists of lamdba functions and naming

# Summary of variable use between syntactic domains

<!-- see defect 1238 -->


# Taxonomy of node types

# Gotchas

## Literals versus field values

## Incompatible node types

## Circular rewrites
<!-- -->

# Where next?

See the [examples](https://github.com/influxdata/kapacitor/tree/master/examples) in the code base on Github.  See also the detailed use case solutions in the section [Guides](/kapacitor/v1.3/guides).  






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
