---
title: TICKscript syntax

menu:
  kapacitor_1_4:
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
   * [Taxonomy of node types](#taxonomy-of-node-types)
   * [InfluxQL in TICKscript](#influxql-in-tickscript)
   * [Lambda expressions](#lambda-expressions)
   * [Summary of variable use between syntax sub-spaces](#summary-of-variable-use-between-syntax-sub-spaces)
   * [Gotchas](#gotchas)

# Concepts

The sections [Introduction](/kapacitor/v1.4/tick/introduction/) and [Getting Started](/kapacitor/v1.4/introduction/getting_started/) present the key concepts of **nodes** and **pipelines**.  Nodes represent process invocation units, that either take data as a batch, or in a point by point stream, and then alter that data, store that data, or based on changes in that data trigger some other activity  such as an alert.  Pipelines are simply logically organized chains of nodes.

In Kapacitor TICKscript is used to define tasks directly and to define template tasks, which act as templates that can be reused to generate new tasks.

**Go**

TICKscript Syntax was inspired by many different languages.  Among the most influential is Go.  This can be seen, for example, in the variable declaration idiom, in string templates, in types such as `duration`, in functions used in lambda expressions, and its influence is also apparent elsewhere in the documentation.

**Syntax sub-spaces**

When working with TICKscript, a couple of syntax sub-spaces will be encountered that have caused confusion for some users.  Overarching is the TICKscript syntax of the TICKscript file.  This is primarily composed of variable declarations and of nodes chained together in pipelines.  On creation the `query` node requires a string representing InfluxQL statements.  So, InlfuxQL represents the first syntax sub-space that may be used.  Other nodes and methods use Lambda expressions, which represents a second syntax sub-space that will be met. The syntax between these spaces, such as when accessing variable, tag and field values, can differ, and this can sometimes be a source of confusion.

To summarize the two syntax sub-spaces to be aware of in TICKscript are:

   * [InfluxQL](#influxql-in-tickscript)
   * [Lambda Expressions](#lambda-expressions)

**Directed Acyclic Graphs**

As mentioned in Getting Started, a pipeline is a Directed Acylic Graph (DAG). (For more information see [Wolfram](http://mathworld.wolfram.com/AcyclicDigraph.html) or [Wikipedia](https://en.wikipedia.org/wiki/Directed_acyclic_graph)). It contains a finite number of nodes (a.k.a. vertices) and edges.  Each edge is directed from one node to another.  No edge path can lead back to an earlier node in the path, which would result in a cycle or loop.  TICKscript paths (a.k.a pipelines and chains) typically begin with a data source definition node with an edge to a data set definition node and then pass their results down to data manipulation and processing nodes.

# TICKscript syntax

TICKscript is case sensitive and uses Unicode. The TICKscript parser scans TICKscript code from top to bottom and left to right instantiating variables and nodes and then chaining or linking them together into pipelines as they are encountered.  When loading a TICKscript the parser checks that a chaining method called on a node is valid.  If an invalid chaining method is encountered the parser will throw an error with the message "no method or property &lt;identifier&gt; on &lt;node type&gt;".

## Code representation

Source files should be encoded using **UTF-8**.  A script is broken into **declarations** and **expressions**.  Declarations result in the creation of a variable and occur on one line.  Expressions can cover more than one line and result in the creation of an entire pipeline, a pipeline **chain** or a pipeline **branch**.

**Whitespace** is used in declarations to separate variable names from operators and literal values.  It is also used within expressions to create indentations, which indicate the hierarchy of method calls.  This also helps to make the script more readable.  Otherwise, whitespace is ignored.

**Comments** can be created on a single line by using a pair of forward slashes "//" before the text.  Comment forward slashes can be preceded by whitespace and need not be the first characters of a newline.

### Keywords

Keywords are tokens that have special meaning within a language and therefore cannot be used as identifiers for functions or variables.  TICKscript is compact and contains only a small set of keywords.

**Table 1 &ndash; Keywords**

| **Word** | **Usage** |
| :----|:------|
| **TRUE** | The literal boolean value "true". |
| **FALSE** | The literal boolean value "false". |
| **AND**  | Standard boolean conjunction operator. |
| **OR** | Standard boolean disjunction operator. |
| **lambda:** | Flags that what follows is to be interpreted as a lambda expression. |
| **var** | Starts a variable declaration. |
| **dbrp** | Starts a database declaration |


Since the set of native node types available in TICKscript is limited, each node type, such as `batch` or `stream`, could be considered key.  Node types and their taxonomy are discussed in detail in the section [Taxonomy of node types](#taxonomy-of-node-types) below.

### Operators

TICKscript has support for traditional mathematical operators as well as a few which make sense in its data processing domain.

**Table 2 &ndash; Standard Operators**

| **Operator** | **Usage** | **Examples** |
|:-------------|:----------|:-------------|
| **+** | Addition and string concatenation | `3 + 6`, `total + count` and `'foo' + 'bar'` |
| **-** | Subtraction | `10 - 1`, `total - errs` |
| **\*** | Multiplication | `3 * 6`, `ratio * 100.0` |
| **/** | Division | `36 / 4`, `errs / total` |
| **==** | Comparison of equality |  `1 == 1`, `date == today` |
| **!=** | Comparison of inequality | `result != 0`, `id != "testbed"` |
| **<** | Comparison less than | `4 < 5`, `timestamp < today` |
| **<=** | Comparison less than or equal to | `3 <= 6`, `flow <= mean` |
| **>** | Comparison greater than | `6 > 3.0`, `delta > sigma` |
| **>=** | Comparison greater than or equal to | `9.0 >= 8.1`, `quantity >= threshold` |
| **=~** | Regular expression match.  Right value must be a regular expression <br/>or a variable holding such an expression. | `tag =~ /^cz\d+/` |
| **!~** | Regular expression not match. Right value must be a regular expression <br/>or a variable holding such an expression. | `tag !~ /^sn\d+/` |
| **!** | Logical not | `!TRUE`, `!(cpu_idle > 70)` |
| **AND** | Logical conjunction |  `rate < 20.0 AND rate >= 10` |
| **OR** | Logical disjunction | `status > warn OR delta > sigma` |

Standard operators are used in TICKscript and in Lambda expressions.

**Table 3 &ndash; Chaining Operators**

| **Operator** | **Usage** | **Examples** |
|:-------------|:----------|:------------|
| **\|** |  Declares a chaining method call which creates an instance of a new node and chains it to the node above it. | `stream`<br/>&nbsp;&nbsp;&nbsp;\|`from()` |
| **.** | Declares a property method call, setting or changing an internal property in the node to which it belongs. | `from()`<br/>&nbsp;&nbsp;&nbsp;`.database(mydb)` |
| **@** | Declares a user defined function (UDF) call.  Essentially a chaining method that adds a new UDF node to the pipeline. | `from()`<br/>`...`<br/>`@MyFunc()` |

Chaining operators are used within expressions to define pipelines or pipeline segments.

## Variables and literals

Variables in TICKscript are useful for storing and reusing values and for providing a friendly mnemonic for quickly understanding what a variable represents. They are typically declared along with the assignment of a literal value.  In a TICKscript intended to be used as a [Template Task](/kapacitor/v1.4/guides/template_tasks/) they can also be declared with simply a type identifier.

### Variables

Variables are declared using the keyword `var` at the start of a declaration.
Variables are immutable and cannot be reassigned new values later on in the script, though they can be used in other declarations and can be passed into methods.
Variables are also used in template tasks as placeholders to be filled when the template is used to create a new task.

For a detailed presentation on working with **template tasks** see the guide [Template tasks](/kapacitor/v1.4/guides/template_tasks/).
If a TICKscript proves useful, it may be desirable to reuse it as a template task in order to quickly create other similar tasks.  For this reason it is recommended to use variables as much as possible.

#### Naming variables

Variable identifiers must begin with a standard ASCII letter and can be followed by any number of letters, digits and underscores.  Both upper and lower case can be used.  In a TICKscript to be used to define a task directly, the type the variable holds depends on the literal value it is assigned.  In a TICKscript written for a task template, the type can also be set using the keyword for the type the variable will hold.  In a TICKscript to be used to define a task directly, using the type identifier will result in a compile time error `invalid TICKscript: missing value for var "<VARNAME>".`.

**Example 1 &ndash; variable declarations for a task**
```javascript
var my_var = 'foo'
var MY_VAR = 'BAR'
var my_float = 2.71
var my_int = 1
var my_node = stream
```
Variable declarations in templates do not require a literal assignment, as is shown in Example 2 below.

**Example 2 &ndash; variable declarations in a task template**
```javascript
var measurement string
var frame duration
var warn = float
var period = 12h
var critical = 3.0
```

### Literal values

Literal values are parsed into instances of the types available in TICKscript.  They can be declared directly in method arguments or can be assigned to variables.  The parser interprets types based on context and creates instances of the following primitives: boolean, string, float, integer. Regular expressions, lists, lambda expressions, duration structures and nodes are also recognized.  The rules the parser uses to recognize a type are discussed in the following Types section.

#### Types

TICKscript recognizes five type identifiers.  These identifiers can be used directly in TICKscripts intended for template tasks.  Otherwise, the type of the literal will be interpreted from its declaration.

**Table 4 &ndash; Type identifiers**

| **Identifier** | **Usage** |
|:---------------|:----------|
| **string** | In a template task, declare a variable as type `string`. | `var my_string string` |
| **duration** | In a template task, declare a variable as type `duration` . | `var my_period duration` |
| **int** | In a template task, declare a variable as type `int64`. | `var my_count int` |
| **float** | In a template task, declare a variable as type `float64`. | `var my_ratio float` |
| **lambda** | In a template task, declare a variable as a Lambda expression type. | `var crit lambda` |

##### Booleans
Boolean values are generated using the boolean keywords: `TRUE` and `FALSE`.  Note that these keywords use all upper case letters.  The parser will throw an error when using lower case characters, e.g. `True` or `true`.

**Example 3 &ndash; Boolean literals**
```javascript
var true_bool = TRUE
...
   |flatten()
       .on('host','port')
       .dropOriginalFieldName(FALSE)
...
```

In Example 3 above the first line shows a simple assignment using a boolean literal.  The second example shows using the boolean literal `FALSE` in a method call.

##### Numerical types
Any literal token containing only digits and optionally a decimal will lead to the generation of an instance of a numerical type.  TICKscript understands two numerical types based on Go: `int64` and `float64`.  Any numerical token containing a decimal point will result in the creation of a `float64` value.  Any numerical token that ends without containing a decimal point will result in the creation of an `int64` value.  If an integer is prefixed with the zero character, `0`, it is interpreted as an octal.

**Example 4 &ndash; Numerical literals**
```javascript
var my_int = 6
var my_float = 2.71828
var my_octal = 0400
...
```
In Example 4 above `my_int` is of type `int64`, `my_float` is of type `float64` and `my_octal` is of type `int64` octal.

##### Duration literals

Duration literals define a span of time.  Their syntax follows the same syntax present in [InfluxQL](https://docs.influxdata.com/influxdb/v1.3/query_language/spec/#literals).  A duration literal is comprised of two parts: an integer and a duration unit.  It is essentially an integer terminated by one or a pair of reserved characters, which represent a unit of time.

The following table presents the time units used in declaring duration types.

**Table 5 &ndash; Duration literal units**

**Unit**  | **Meaning**
-------|-----------------------------------------
u or µ | microseconds (1 millionth of a second)
ms     | milliseconds (1 thousandth of a second)
s      | second
m      | minute
h      | hour
d      | day
w      | week

**Example 5 &ndash; Duration expressions**
```javascript
var span = 10s
var frequency = 10s
...
var views = batch
    |query('SELECT sum(value) FROM "pages"."default".views')
        .period(1h)
        .every(1h)
        .groupBy(time(1m), *)
        .fill(0)
```

In Example 5 above the first two lines show the declaration of Duration types.  The first represents a time span of 10 seconds and the second a time frame of 10 seconds.  The final example shows declaring duration literals directly in method calls.


##### Strings
Strings begin with either one or three single single quotation marks: `'` or `'''`.  Strings can be concatenated using the addition `+` operator.  To escape quotation marks within a string delimited by a single quotation mark use the backslash character.  If it is to be anticipated that many single quotation marks will be encountered inside the string, delimit it using triple single quotation marks instead.  A string delimited by triple quotation marks requires no escape sequences. In both string demarcation cases, the double quotation mark, which is used to access field and tag values, can be used without an escape.

**Example 6 &ndash; Basic strings**

```javascript
var region1 = 'EMEA'
var old_standby = 'foo' + 'bar'
var query1 = 'SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = \'cpu-total\' '
var query2 = '''SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu-total' '''
...
batch
   |query('''SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu-total' ''')
...
```
In Example 6 above the first line shows a simple string assignment using a string literal.  The second line uses the concatenation operator.  Lines three and four show two different approaches to declaring complex string literals with and without internally escaped single quotation marks.  The final example shows using a string literal directly in a method call.

To make long complex strings more readable newlines are permitted within the string.

**Example 7 &ndash; Multiline string**
```javascript
batch
   |query('SELECT 100 - mean(usage_idle)
           AS stat
           FROM "telegraf"."autogen"."cpu"
           WHERE cpu = \'cpu-total\'
           ')
```
In Example 7 above the string is broken up to make the query more easily understood.

##### String templates

String templates allow node properties, tags and fields to be added to a string.  The format follows the same format provided by the Go [text.template](https://golang.org/pkg/text/template/) package.  This is useful when writing alert messages.  To add a property, tag or field value to a string template, it needs to be wrapped inside of double curly braces: "{{}}".

**Example 8 &ndash; Variables inside of string templates**
```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" }}')
```
In Example 8 three values are added to two string templates.  In the call to the setter `id()` the value of the tag `"host"` is added to the start of the string.  The call to the setter `message()` then adds the `id` and then the value of the field `"stat"`.

String templates are currently applicable with the [Alert](/kapacitor/v1.4/nodes/alert_node/) node and are discussed further in the section [Accessing values in string templates](#accessing-values-in-string-templates) below.

String templates can also include flow statements such as `if...else` as well as calls to internal formating methods.

```
.message('{{ .ID }} is {{ if eq .Level "OK" }}alive{{ else }}dead{{ end }}: {{ index .Fields "emitted" | printf "%0.3f" }} points/10s.')
```
##### String lists

A string list is a collection of strings declared between two brackets.  They can be declared with literals, identifiers for other variables, or with the asterisk wild card, "\*".  They can be passed into methods that take multiple string parameters.  They are especially useful in template tasks.  Note that when used in function calls, list contents get exploded and the elements are used as all the arguments to the function.  When a list is given, it is understood that the list contains all the arguments to the function.

**Example 9 &ndash; String lists in a standard task**
```javascript
var foo = 'foo'
var bar = 'bar'
var foobar_list = [foo, bar]
var cpu_groups = [ 'host', 'cpu' ]
...
stream
   |from()
      .measurement('cpu')
      .groupBy(cpu_groups)
...
```
Example 9 declares two string lists. The first contains identifiers for other variables.  The second contains string literals.  The list `cpu_groups` is used in the method `from.groupBy()`.

**Example 10 &ndash; String list in a template task**
```javascript
brp "telegaf"."not_autogen"

var measurement string
var where_filter = lambda: TRUE
var groups = [*]
var field string
var warn lambda
var crit lambda
var window = 5m
var slack_channel = '#alerts'

stream
    |from()
        .measurement(measurement)
        .where(where_filter)
        .groupBy(groups)
    |window()
        .period(window)
        .every(window)
    |mean(field)
    |alert()
         .warn(warn)
         .crit(crit)
         .slack()
         .channel(slack_channel)
```

Example 10, taken from the examples in the [code repository](https://github.com/influxdata/kapacitor/blob/1de435db363fa8ece4b50e26d618fc225b38c70f/examples/load/templates/implicit_template.tick), defines `implicit_template.tick`.  It uses the `groups` list to hold a variable arguments to be passed to the `from.groupBy()` method.  The contents of the `groups` list will be determined when the template is used to create a new task.

##### Regular expressions

Regular expressions begin and end with a forward slash: `/`. The regular expression syntax is the same as Perl, Python and other languages. For details on the syntax see the Go [regular expression library](https://golang.org/pkg/regexp/syntax/).

**Example 11 &ndash; Regular expressions**
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
In Example 11 the first three lines show the assignment of regular expressions to variables.  The `locals` stream uses the regular expression assigned to the variable `local_ips`. The `south_afr` stream uses a regular expression comparison with the regular expression declared literally as a part of the lambda expression.

##### Lambda expressions as literals

A lambda expression is a parameter representing a short easily understood function to be passed into a method call or held in a variable. It can wrap a boolean expression, a mathematical expression, a call to an internal function or a combination of these three.  Lambda expressions always operate on point data.  They are generally compact and as such are used as literals, which eventually get passed into node methods.  Internal functions that can be used in Lambda expressions are discussed in the sections [Type conversion](#type-conversion) and [Lambda Expressions](#lambda-expressions) below.  Lambda expressions are presented in detail in the topic [Lambda Expressions](/kapacitor/v1.4/tick/expr/).

Lambda expressions begin with the token `lambda` followed by a colon, ':' &ndash; `lambda:`.

**Example 12 &ndash; Lambda expressions**
```javascript
var my_lambda = lambda: 1 > 0
var lazy_lambda = lambda: "usage_idle" < 95
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
    .info(lambda: "stat" > 70 OR "sigma" > 2.5)
    .warn(lambda: "stat" > 80 OR "sigma" > 3.0)
    .crit(lambda: "stat" > 90 OR "sigma" > 3.5)

```
Example 12 above shows that a lambda expression can be directly assigned to a variable.  In the eval node a lambda statement is used which calls the sigma function. The alert node uses lambda expressions to define the log levels of given events.


##### Nodes

Like the simpler types, Node types are declared and can be assigned to variables.

**Example 13 &ndash; Node expressions**
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
    .period(span)
    .every(frequency)
  |mean('used')
    .as('stat')
...
var alert = data
  |eval(lambda: sigma("stat"))
    .as('sigma')
    .keep()
  |alert()
    .id('{{ index .Tags "host"}}/cpu_used')
...
```
In Example 13 above, in the first section, five nodes are created.  The top level node `stream` is assigned to the variable `data`. The `stream` node is then used as the root of the pipeline to which the nodes `from`, `eval`, `window` and `mean` are chained in order. In the second section the pipeline is then extended using assignment to the variable `alert`, so that a second `eval` node can be applied to the data.

#### Working with tags, fields and variables

In any script it is not enough to simply declare variables.  The values they hold must also be accessed.  In TICKscript it is also necessary to work with values held in tags and fields drawn from an InfluxDB data series.  This is most evident in the examples presented so far.  In addition values generated by lambda expressions can be added as new fields to the data set in the pipeline and then accessed as named results of those expressions. The following section explores working not only with variables but also with tag and field values, that can be extracted from the data, as well as with named results.

##### Accessing values

Accessing data tags and fields, using string literals and accessing TICKscript variables each involves a different syntax.  Additionally it is possible to access the results of lambda expressions used with certain nodes.

   * **Variables** &ndash; To access a _TICKscript variable_ simply use its identifier.

   **Example 14 &ndash; Variable access**
   ```javascript
   var db = 'website'
   ...
   var data = stream
    |from()
        .database(db)
   ...
   ```
   In Example 14 the variable `db` is assigned the literal value `'website'`.  This is then used in the setter `.database()` under the chaining method `from()`.

   * **String literals** &ndash; To declare a _string literal_ use single quotation marks as discussed in the section [Strings](#strings) above.
   * **Tag and Field values** &ndash; To access a _tag value_ or a _field value_ in a Lambda expression use double quotes.  To refer to them in method calls use single quotes.  In method calls these are in essence string literals to be used by a node in matching tag or field values in the data series.

   **Example 15 &ndash; Field access**
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
   In Example 15 two values from the data frame are accessed.  In the `where()` method call the lambda expression uses the tag `"cpu"` to filter the data frame down to only datapoints whose "cpu" tag equals the literal value of `'cpu-total'`.  The chaining method `eval()` also takes a lambda expression that accesses the field `"usage-idle"` to calculate cpu processing power 'used'.  Note that the `groupBy()` method uses a string literal `'host'` to be matched to a tag name in the data series.  It will then group the data by this tag.

   * **Named lambda expression results** &ndash; Lambda expression results get named and added as fields to the data set using an `as()` method.  Think of the `as()` method functioning just like the 'AS' keyword in InfluxQL.  See the `eval()` method in Example 15 above.  The results of lambda expressions can be accessed in other Lambda expressions with double quotation marks, and in method calls with single quotes, just like data tags and fields.

  **Example 16 &ndash; Named lambda expression access**

  ```javascript
  ...
      |window()
        .period(period)
        .every(every)
      |mean('used')
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
  Example 16 above continues the pipeline from Example 15.  In Example 15, the results of the lambda expression named as `'used'` under the `eval()` method are then accessed in Example 16 as an argument to the method `'mean()'`, which then names its result _as_ `'stat'`.  A new statement then begins.  This contains a new call to the method `'eval()'`, which has a lambda expression that accesses `"stat"` and sets its result _as_ `'sigma'`.  The named result `"stat"` is also accessed in the `message()` method and the threshold methods (`info()`,`warn()`,`crit()`) under the `alert()` chaining method.  The named result `"sigma"` is also used in the lambda expressions of these methods.

  **Note &ndash; InfluxQL nodes and tag or field access** &ndash; [InfluxQL nodes](/kapacitor/v1.4/nodes/influx_q_l_node/), such as `mean()` in Example 16, are special nodes that wrap InfluxQL functions. See the section [Taxonomy of node types](#taxonomy-of-node-types) below.  When accessing field values, tag values or named results with this node type single quotes are used.

  **Example 17 &ndash; Field access with an InfluxQL node**
  ```javascript
  // Dataframe
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
  ```
  In Example 17 above the `eval` result gets named as `used`.  The chaining method `mean` is an alias of the node type InfluxQL.  It wraps the InfluxQL `mean` function.  In the call to mean the named result `'used'` is accessed using only single quotes.


##### Accessing values in string templates

As mentioned in the section [String templates](#string-templates) it is possible to add values from node specific properties, and from tags and fields to output strings.  This can be seen under the `alert` node in Example 16.  The accessor expression is wrapped in two curly braces.  To access a property a period, `.`, is used before the identifier.  To access a value from tags or fields the token 'index' is used, followed by a space and a period and then the part of the data series to be accessed (e.g. `.Tags` or `.Fields`); the actual name is then specified in double quotes.

**Example 18 &ndash; accessing values in string templates**

```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" }}')
```
In Example 18 above, the property method `.id()` uses the value of the tag in the data stream with the key `"host"` to set the part of the value of the id.  This value is then used in the property method `message()` as `.ID`.  This property method also access the value from the named result `"stat"`.

For more specific information see the [Alert](/kapacitor/v1.4/nodes/alert_node/) node documentation.

##### Type conversion

Within lambda expressions it is possible to use stateless conversion functions to convert values between types.

   * `bool()` - converts a string, int64 or float64 to boolean.
   * `int()` - converts a string, float64, boolean or duration type to an int64.
   * `float()` - converts a string, int64 or boolean to float64.
   * `string()` - converts an int64, float64, boolean or duration value to a string.
   * `duration()` - converts an int64, float64 or string to a duration type.

**Example 19 &ndash; Type conversion**

```javascript
   |eval(lambda: float("total_error_responses")/float("total_responses") * 100.0)
```

In Example 19 above the `float` conversion function is used to ensure that the calculated percentage uses floating point precision when the field values in the data series may have been stored as integers.

##### Numerical precision

<!-- issue 1244 -->

When writing floating point values in messages, or to InfluxDB it might be helpful to specify the decimal precision in order to make the values more readable or better comparable.  For example in the `messsage()` method of an `alert` node it is possible to "pipe" a value to a `printf` statement.

```javascript
|alert()
  .id('{{ index .Tags "host"}}/mem_used')
  .message('{{ .ID }}:{{ index .Fields "stat" | printf "%0.2f" }}')
```

When working with floating point values in lambda expressions, it is also possible to use the floor function and powers of ten to round to a less precise value.  Note that using `printf` in a string template is much faster.  Note as well that since values are written as 64bit, this has no effect on storage.  If this were to be used with the `InfluxDBOut` node, for example when downsizing data, it could lead to a needless loss of information.

**Example 20 &ndash; Rendering floating points less precise**
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
Example 20 accomplishes something similar to using `printf`.  The `usage_idle` value is rounded down to thousandths of a percent and then used for comparison in the threshold method of the alert node.  It is then written into the alert message.

##### Time precision

<!-- Issue 1244 -->

As Kapacitor and TICKscripts can be used to write values into an InfluxDB database, it may be desirable, in some cases, to specify the time precision to be used.  One example occurs when downsizing data using the calculated mean.  The precision to be written could be set to a value coarser than the default up to and even surpassing the bucket size, i.e. the value set by a call to a method like `window.every()`.  Using a precision larger than the bucket size is not recommended.  Specifying time precision can bring storage and performance improvements.  The most common example occurs when working with the `InfluxDBOut` node, whose precision property can be set.  Note that the `InfluxDBOut` node defaults to the most precise precision, which is nanoseconds. It is important not to confuse _mathematical_ precision, which is used most commonly with field values, and _time_ precision which is specified for timestamps.

**Example 21 &ndash; Setting time precision with InfluxDBOut**
```javascript

stream
    |from()
        .database('telegraf')
        .measurement('cpu')
        .groupBy(*)
    |window()
        .period(5m)
        .every(5m)
        .align()
    |mean('usage_idle')
        .as('usage_idle')
    |influxDBOut()
       .database('telegraf')
       .retentionPolicy('autogen')
       .measurement('mean_cpu_idle')
       .precision('s')
...
```
In Example 21, taken from the guide topic [Continuous Query](/kapacitor/v1.4/guides/continuous_queries/), the time precision of the series to be written to the database "telegraf" as measurement "mean_cpu_idle" is set to the unit seconds.

Valid values for precision are the same as those used in InfluxDB.

**Table 6 &ndash; Precision units**

|String|Unit|
|:-----|----|
| "ns" | nanoseconds |
| "ms" | milliseconds |
| "s" | seconds |
| "m" | minutes |
| "h" | hours |

## Statements

There are two types of statements in TICKscript: Declarations and Expressions.  A declaration can declare either a variable or a database, with which the TICKscript will work.  Expressions express a pipeline (a.k.a chain) of method calls, which create processing nodes and set their properties.

### Declarations

TICKscript works with two types of declarations: Database declarations and Variable declarations.

A **Database declaration** begins with the keyword `dbrp` and is followed by two strings separated by a period.  The first string declares the default database, with which the script will be used.  The second string declares its retention policy.  Note that the database and retention policy can also be declared using the flag `-dbrp` when defining the task with the command `kapacitor define` on the command-line, so this statement is optional.  When used, the Database declaration statement should be the first declaration of a TICKscript.

**Example 22 &ndash; A Database declaration.**
```
dbrp "telegraf"."autogen"
...
```
Example 22 declares that the TICKscript is to be used against the database `telegraf` with its retention policy `autogen`.

A **Variable declaration** begins with the `var` keyword followed by an identifier for the variable being declared.  An assignment operator follows with a literal right side value, which will set the type and value for the new variable.

**Example 23 &ndash; Typical declarations**
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
Example 23 shows six declaration statements. Five of them create variables holding strings and one a lambda expression.

A declaration can also be used to assign an expression to a variable.

**Example 24 &ndash; Declaring an expression to a variable**
```javascript
var data = stream
    |from()
        .database(db)
        .retentionPolicy(rp)
```
In Example 24 the `data` variable holds the stream pipeline declared in the expression beginning with the node `stream`.

### Expressions

An expression begins with a node identifier or with a variable identifier holding another expression.  It then chains together additional node creation methods (chaining methods), property setters (property methods) or user defined functions (UDF).  The pipe operator "|" indicates the start of a chaining method call, returning a new node into the chain.  The dot operator "." adds a property setter.  The ampersand operator "@" introduces a user defined function.

Expressions can be written all on a single line, but this can lead to readability issues.  The command `kapacitor show <taskname>` will show the TICKscript as part of its console output.  This command pretty prints or uses newlines and indentation regardless of how the defining TICKscript was written.  Adding a new line and indenting new method calls is the recommended practice for writing TICKscript expressions.  Typically, when a new chaining method is introduced in an expression, a newline is created and the new link in the chain gets indented three or more spaces.  Likewise, when a new property setter is called, it is set out on a new line and indented an additional number of spaces.  For readability user defined functions should be indented the same as chaining methods.

An expression ends with the last setter of the last node in the pipeline.

**Example 25 &ndash; Single line expressions**
```javascript
...
// Dataframe
var data = batch|query('''SELECT mean(used_percent) AS stat FROM "telegraf"."autogen"."mem" ''').period(period).every(every).groupBy('host')

// Thresholds
var alert = data|eval(lambda: sigma("stat")).as('sigma').keep()|alert().id('{{ index .Tags "host"}}/mem_used').message('{{ .ID }}:{{ index .Fields "stat" }}')
   .info(lambda: "stat" > info OR "sigma" > infoSig).warn(lambda: "stat" > warn OR "sigma" > warnSig).crit(lambda: "stat" > crit OR "sigma" > critSig)
...
```
Example 25 shows an expression with a number of nodes and setters declared all on the same line.  While this is possible, it is not the recommended style.  Note also that the command line utility `tickfmt`, that comes with the Kapacitor distribution, can be used to reformat a TICKscript to follow the recommended style.

**Example 26 &ndash; Recommended expression syntax**
```javascript
...
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
...
```
Example 26, taken from the example [mem_alert_batch.tick](https://github.com/influxdata/kapacitor/blob/03267847561b6261798407e62e5245bc54a7cf0c/examples/telegraf/mem/mem_alert_batch.tick) in the code base, shows the recommended style for writing expressions.  This example contains three expression statements.  The first begins with the declaration of the batch node for the data frame.  This gets assigned to the variable `data`.  The second expression takes the `data` variable and defines thresholds for warning messages.  This gets assigned to the `alert` variable.  The third expression sets the `log` property of the `alert` node.

### Node creation

With two exceptions (`stream` and `batch`) nodes always occur in pipeline expressions (chains), where they are created through chaining methods.  Chaining methods are generally identified using the node type name.  One notable exception to this is the InfluxQL node, which uses aliases.  See the section [Taxonomy of node types](#taxonomy-of-node-types) below.

For each node type, the method that creates an instance of that type uses the same signature.  So if a `query` node creates an `eval` node and adds it to the chain, and if a `from` node can also create an `eval` node and add it to the chain, the chaining method creating a new `eval` node will accept the same arguments (e.g. one or more lambda expressions) regardless of which node created it.

**Example 27 &ndash; Instantiate eval node in stream**
```javascript
...
var data = stream
  |from()
    .database('telegraf')
    .retentionPolicy('autogen')
    .measurement('cpu')
    .groupBy('host')
    .where(lambda: "cpu" == 'cpu-total')
  |eval(lambda: 100.0 - "usage_idle")
    .as('used')
    .keep()
    ...
```
Example 27 creates three nodes: `stream`, `from` and `eval`.

**Example 28 &ndash; Instantiate eval node in batch**
```javascript
...
var data = batch
  |query('''SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu-total' ''')
    .period(period)
    .every(every)
    .groupBy('host')
  |eval(lambda: sigma("stat"))
    .as('sigma')
    .keep()
    ...
```
Example 28 also creates three nodes: `batch`,`query` and `eval`.

Both Examples 27 and 28 create an `eval` node.  Despite that `eval` is chained below a `from` node in Example 27 and below a `query` node in Example 28, the signature of the chaining method remains the same.

A short taxonomy of nodes is presented in the section [Taxonomy of node types](#taxonomy-of-node-types) below.  The catalog of node types is available under the topic [TICKscript nodes](/kapacitor/v1.4/nodes/).

### Pipelines

To reiterate, a pipeline is a logically ordered chain of nodes defined by one or more expressions.  "Logically ordered" means that nodes cannot be chained in any random sequence, but occur in the pipeline according to their role in processing the data.  A pipeline can begin with with one of two mode definition nodes: `batch` or `stream`.  The data frame for a `batch` pipeline is defined in a `query` definition node.  The data stream for a `stream` pipeline is defined in a `from` definition node.  After the definition nodes any other types of nodes may follow.

Standard node types get added to the pipeline with a chaining method indicated by the pipe "|" character.  User defined functions can be added to the pipeline using the ampersand "@" character.

Each node in the pipeline has internal properties that can be set using property methods delineated using a period ".".  These methods get called before the node processes the data.

Each node in the pipeline can alter the data passed along to the nodes that follow: filtering it, restructuring it, reducing it to a new measurement and more.  In some nodes, setting a property can significantly alter the data received by downstream siblings.  For example, with an `eval` node, setting the names of lambda functions with the `as` property effectively blocks field and tag names from being passed downstream.  For this reason it might be important to set the `keep` property, in order to keep them in the pipeline if they will be needed by a later node.

It is important to become familiar with the [reference documentation](/kapacitor/v1.4/nodes/) for each node type before using it in a TICKscript.


**Example 29 &ndash; a typical pipeline**
```javascript
// Dataframe
var data = batch
  |query('''SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu-total' ''')
    .period(period)
    .every(every)
    .groupBy('host')

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

// Alert
alert
  .log('/tmp/cpu_alert_log.txt')
```
Example 29 shows a `batch`&rarr;`query` pipeline broken into three expressions using two variables.  The first expression declares the data frame, the second expression the alert thresholds and the final expression sets the `log` property of the `alert` node.  The entire pipeline begins with the declaration of the `batch` node and ends with the call to the property method `log()`.

# Taxonomy of node types

To aid in understanding the roles that different nodes play in a pipeline, a short taxonomy has been defined.  For complete documentation on each node type see the topic [TICKscript Nodes](/kapacitor/v1.4/nodes/).

**Special nodes**

These nodes are special because they can be created and returned using identifiers other than their type names.  An alias representing an aspect of their functionality can be used.  This may apply in all instances, as with the InfluxQL node, or only in one, as with the Alert node.

   * [`alert`](/kapacitor/v1.4/nodes/alert_node/) - can be returned as a `deadman` switch
   * [`influxQL`](/kapacitor/v1.4/nodes/influx_q_l_node/) - directly calls functions in InfluxQL, so can be returned when a TICKScript chaining method using the name of the InfluxQL method is called.
      * example 1: `from()|mean()` - calls the mean function on a data stream defined in the from node and returns an InfluxQL node.
      * example 2: `query()|mode()` - calls the mode function on the data frame defined in the Query node and returns an InfluxQL node.

**Data source definition nodes**

The first node in a TICKscript pipeline is either `batch` or `stream`. They define the _data source_ used in processing the data.

   * [`batch`](/kapacitor/v1.4/nodes/batch_node/) - chaining method call syntax is not used in the declaration.
   * [`stream`](/kapacitor/v1.4/nodes/stream_node/) - chaining method call syntax is not used in the declaration.

**Data definition nodes**

Mode definition nodes are typically followed by nodes whose purpose is to define a _frame_ or _stream_ of data to be processed by other nodes.

   * [`from`](/kapacitor/v1.4/nodes/from_node/) - has an empty chaining method.  Can follow only a `stream` node.  Configure using property methods.
   * [`query`](/kapacitor/v1.4/nodes/query_node/) - chaining method takes a query string. Can follow only a `batch` node.

**Data manipulation nodes**

Values within the data set can be altered or generated using manipulation nodes.

   * [`default`](/kapacitor/v1.4/nodes/default_node/) - has an empty chaining method. Its `field` and `tag` properties can be used to set default values for fields and tags in the data series.
   * [`sample`](/kapacitor/v1.4/nodes/sample_node/) - chaining method takes an int64 or a duration string.  It extracts a sample of data based on the count or the time period.
   * [`shift`](/kapacitor/v1.4/nodes/shift_node/) - chaining method takes a duration string. It shifts datapoint time stamps.  The duration string can be proceeded by a minus sign to shift the stamps backward in time.
   * [`where`](/kapacitor/v1.4/nodes/where_node/) - chaining method takes a lambda node. It works with a `stream` pipeline like the `WHERE` statement in InfluxQL.
   * [`window`](/kapacitor/v1.4/nodes/window_node/) - has an empty chaining method.  It is configured using property methods. It works in a `stream` pipeline usually after the `from` node to cache data within a moving time range.

**Processing nodes**

Once the data set has been defined it can be passed to other nodes, which will process it, will transform it or will trigger other processes based on changes within.

* Nodes for changing the structure of the data or for mixing together pipelines:
   * [`combine`](/kapacitor/v1.4/nodes/combine_node/) - chaining method takes a list of one or more lambda expression. It can combine the data from a single node with itself.
   * [`eval`](/kapacitor/v1.4/nodes/eval_node/) - chaining method takes a list of one or more lambda expressions. It evaluates expressions on each datapoint it receives and, using its `as` property, makes the results available to nodes that follow in the pipeline.  Note that when multiple lambda expressions are used, the `as` method can contain a list of strings to name the results of each lambda.
   * [`groupBy`](/kapacitor/v1.4/nodes/group_by_node/) - chaining method takes a list of one or more strings representing the tags of the series. It groups incoming data by tags.
   * [`join`](/kapacitor/v1.4/nodes/join_node/) - chaining method takes a list of one or more variables referencing pipeline expressions. It joins data from any number of pipelines based on matching time stamps.
   * [`union`](/kapacitor/v1.4/nodes/union_node/) -  chaining method takes a list of one or more variables referencing pipeline expressions. It creates a union of any number of pipelines.

* Nodes for transforming or processing the datapoints within the data set:
   * [`delete`](/kapacitor/v1.4/nodes/delete_node/) - empty chaining method. It relies on properties (`field`, `tag`) to delete fields and tags from datapoints.
   * [`derivative`](/kapacitor/v1.4/nodes/derivative_node/) - chaining method takes a string representing a field for which a derivative will be calculated.
   * [`flatten`](/kapacitor/v1.4/nodes/flatten_node/) - empty chaining method.  It relies on properties to flatten a set of points on specific dimensions.
   * [`influxQL`](/kapacitor/v1.4/nodes/influx_q_l_node/) - special node (see above). It provides access to InfluxQL functions. It cannot be created directly.
   * [`stateCount`](/kapacitor/v1.4/nodes/state_count_node/) - chaining method takes a lambda expression. It computes the number of consecutive points that are in a given state.
   * [`stateDuration`](/kapacitor/v1.4/nodes/state_duration_node/) - chaining method takes a lambda expression. It computes the duration of time that a given state lasts.
   * [`stats`](/kapacitor/v1.4/nodes/stats_node/) - chaining method takes a duration expression. It emits internal stats about another node at the given interval.

* Nodes for triggering events, processes:
   * [`alert`](/kapacitor/v1.4/nodes/alert_node/) - empty chaining method. It relies on a number of properties for configuring the emission of alerts.
   * [`deadman`](/kapacitor/v1.4//nodes/stream_node/#deadman) - actually a helper function, it is an alias for an `alert` that gets triggered when data flow falls below a specified threshold.
   * [`httpOut`](/kapacitor/v1.4/nodes/http_out_node/) - chaining method takes a string. It caches the most recent data for each group it receives, making it available over the Kapicator http server using the string argument as the final locator context.
   * [`httpPost`](/kapacitor/v1.4/nodes/http_post_node/) - chaining method takes an array of strings.  It can also be empty. It posts data to HTTP endpoints specified in the string array.
   * [`influxDBOut`](/kapacitor/v1.4/nodes/influx_d_b_out_node/) - empty chaining method &ndash; configured through property setters.  It  writes data to InfluxDB as it is received.
   * [`k8sAutoscale`](/kapacitor/v1.4/nodes/k8s_autoscale_node/) - empty chaining method. It relies on a number of properties for configuration. It triggers autoscale on Kubernetes&trade; resources.
   * [`kapacitorLoopback`](/kapacitor/v1.4/nodes/kapacitor_loopback_node/) - empty chaining method &ndash;  configured through property setters. It writes data back into the Kapacitor stream.
   * [`log`](/kapacitor/v1.4/nodes/log_node/) - empty chaining method. It relies on `level` and `prefix` properties for configuration. It logs all data that passes through it.

**User Defined Functions**

User defined functions are nodes that implement functionality defined by user programs or scripts that run as separate processes and that communicate with Kapacitor over sockets or standard system data streams.

   * [`UDF`](/kapacitor/v1.4/nodes/u_d_f_node/) - signature, properties and functionality defined by the user.  To learn about writing User Defined Functions, see the [User Defined Functions Webinar](https://www.influxdata.com/training/advanced-kapacitor-training-user-defined-functions-udfs/?ao_campid=70137000000JiJA) available at [Influx on-line University](https://www.influxdata.com/university/).

**Internally used nodes - Do Not use**

   * [`noOp`](/kapacitor/v1.4/nodes/no_op_node/) - a helper node that performs no operations.  Do not use it!


# InfluxQL in TICKscript

InfluxQL occurs in a TICKscript primarily in a `query` node, whose chaining method takes an InfluxQL query string.  This will nearly always be a `SELECT` statement.

InfluxQL is very similar in its syntax to SQL.  When writing a query string for a TICKscript `query` node, generally only three clauses will be required: `SELECT`, `FROM` and `WHERE`.  The general pattern is as follows:

```SQL
SELECT {<FIELD_KEY> | <TAG_KEY> | <FUNCTION>([<FIELD_KEY>|<TAG_KEY])} FROM <DATABASE>.<RETENTION_POLICY>.<MEASUREMENT> WHERE {<CONDITIONAL_EXPRESSION>}
```
   * The base `SELECT` clause can take one or more field or tag keys, or functions.  These can be combined with mathematical operations and literal values.  Their values or results will be added to the data frame and can be aliased with an `AS` clause.  The star, `*`, wild card can also be used to retrieve all tags and fields from a measurement.
       * When using the `AS` clause the alias identifier can be accessed later on in the TICKscript as a named result by using double quotes.
   * The `FROM` clause requires the database, retention policy and the measurement name from which the values will be selected.  Each of these tokens is separated by a dot. The values for the database and retention policy need to be set out using double quotes.
   * The `WHERE` clause requires a conditional expression.  This may include `AND` and `OR` boolean operators as well as mathematical operations.

**Example 30 &ndash; A simple InfluxQL query statement**
```javascript
batch
    |query('SELECT cpu, usage_idle FROM "telegraf"."autogen".cpu WHERE time > now() - 10s')
        .period(10s)
        .every(10s)
    |httpOut('dump')
```

Example 30 shows a simple `SELECT` statement that takes the `cpu` tag and the `usage_idle` field from the cpu measurement as recorded over the last ten seconds.

**Example 31 &ndash; A simple InfluxQL query statement with variables**
```javascript
var my_field = 'usage_idle'
var my_tag = 'cpu'

batch
    |query('SELECT ' + my_tag + ', ' + my_field + ' FROM "telegraf"."autogen".cpu WHERE time > now() - 10s')
        .period(10s)
        .every(10s)
    |httpOut('dump')
```
Example 31 reiterates the same query from Example 30, but shows how to add variables to the query string.

**Example 32 &ndash; An InfluxQL query statement with a function call**
```javascript
...
var data = batch
  |query('''SELECT 100 - mean(usage_idle) AS stat FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu-total' ''')
    .period(period)
    .every(every)
    .groupBy('host')
...
```
Example 32 shows a `SELECT` statement that includes a function and mathematical operation in the `SELECT` clause, as well as the `AS` alias clause.

Note that the select statement gets passed directly to the InfluxDB API.  Within the InfluxQL query string field and tag names do not need to be accessed using double quotes, as is the case elsewhere in TICKscript.  However, the database name, and retention policy do get wrapped in double quotes. String literals, such as `'cpu-total'` are expressed inside the query string with single quotation marks.

See the [InfluxQL](/influxdb/v1.3/query_language/) documentation for a complete introduction to working with the query language.

# Lambda expressions

Lambda expressions occur in a number of chaining and property methods.  Two of the most common usages are in the creation of an `eval` node and in defining threshold properties on an `alert` node.  They are declared with the keyword "lambda" followed by a colon: `lambda:`.  They can contain mathematical and boolean operations as well as calls to a large library of internal functions.  With many nodes, their results can be captured by setting an `as` property on the node.

The internal functions can be stateless, such as common mathematical and string manipulation functions, or they can be stateful, updating an internal value with each new call.  As of release 1.3 three stateful functions are provided.

 * `sigma` - counts the number of standard deviations a given value is from the running mean.
 * `count` - counts the number of values processed.
 * `spread`- computes the running range of all values.

The full range of lambda expressions and their uses is presented in the topic [Lambda Expressions](/kapacitor/v1.4/tick/expr/).

Within lambda expressions TICKscript variables can be accessed using their plain identifiers.  Tag and field values from data series's can be accessed by surrounding them in double quotes.  Literals can also be used directly.

**Example 33 &ndash; Lambda expressions**
```javascript
...
// Parameters
var info = 70
var warn = 85
var crit = 92
var infoSig = 2.5
var warnSig = 3
var critSig = 3.5
var period = 10s
var every = 10s

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
Example 33 contains four lambda expressions.  The first expression is passed to the `eval` node.  It calls the internal stateful function `sigma`, into which it passes the named result `stat`, which is set using the `AS` clause in the query string of the `query` node.  Through the `.as()` setter of the `eval` node its result is named `sigma`.  Three other lambda expressions occur inside the threshold determining property methods of the `alert` node.  These lambda expressions also access the named results `stat` and `sigma` as well as variables declared at the start of the script.  They each define a series of boolean operations, which set the level of the alert message.


# Summary of variable use between syntax sub-spaces

The following section summarizes how to access variables and data series tags and fields in TICKscript and the different syntax sub-spaces.


<!-- see defect 1238 -->

### TICKscript variable

Declaration examples:

```javascript
var my_var = 'foo'
var my_field = `usage_idle`
var my_num = 2.71
```

   **Accessing...**

   * In **TICKscript** simply use the identifier.

   ```javascript
      var my_other_num = my_num + 3.14
      ...
         |default()
            .tag('bar', my_var)
      ...
   ```

   * In a **query string** simply use the identifier with string concatenation.

   ```javascript
      ...
         |query('SELECT ' + my_field + ' FROM "telegraf"."autogen".cpu WHERE host = \'' + my_var + '\'' )
      ...
   ```

   * In a **lambda expression** simply use the identifier.

   ```javascript
      ...
        .info(lambda: "stat" > my_num )
      ...
   ```

   * In an **InfluxQL node** use the identifier.  Note that in most cases strings will be used as field or tag names.

   ```javascript
      ...
         |mean(my_var)
      ...
   ```

### Tag, Field or Named Result

Examples

```javascript
...
   |query('SELECT mean(usage_idle) AS mean ...')
...
   |eval(lambda: sigma("stat"))
      .as('sigma')
...
```

**Accessing...**


   * In a **TICKscript** method call use single quotes.

   ```javascript
      ...
         |derivative('mean')
      ...
   ```

   * In a **query string** use the identifier directly in the string.

   ```javascript
      ...
         |query('SELECT cpu, usage_idle FROM "telegraf"."autogen".cpu')
      ...
   ```

   * In a **lambda expression** use double quotes.

   ```javascript
      ...
         |eval(lambda: 100.0 - "usage_idle")
      ...
         |alert
             .info(lambda: "sigma" > 2 )
      ...
   ```

   * In an **InfluxQL node**  use single quotes.

   ```javascript
      ...
         |mean('used')
      ...
   ```

# Gotchas

## Literals versus field values

Please keep in mind that literal string values are declared using single quotes.  Double quotes are used only in lambda expressions to access the values of tags and fields.  In most instances using double quotes in place of single quotes will be caught as an error: `unsupported literal type`.  On the other hand, using single quotes when double quotes were intended, i.e. accessing a field value, will not be caught and, if this occurs in a lambda expression, the literal value may be used instead of the desired value of a tag, or a field.

As of Kapacitor 1.3 it is possible to declare a variable using double quotes, which is invalid, and the parser will not flag it as an error.  For example `var my_var = "foo"` will pass so long as it is not used.  However, when this variable is used in a Lambda expression or other method call, it will trigger a compilation error: `unsupported literal type *ast.ReferenceNode`.

## Circular rewrites

When using the InfluxDBOut node, be careful not to create circular rewrites to the same database and the same measurement from which data is being read.

**Example 34 &ndash; A circular rewrite**
```javascript
stream
   |from()
      .measurement('system')
   |eval(lambda: "n_cpus" + 1)
      .as('n_cpus')
   |influxDBOut()
      .database('telegraf')
      .measurement('system')
```
> Note: Example 34 illustrates how an infinite loop might be created.  Please, DO NOT USE IT!

The script in Example 34 could be used to define a task on the database `telegraf` with the retention policy `autogen`.  For example:

```
kapacitor define circular_task -type stream -tick circular_rewrite.tick  -dbrp telegraf.autogen
```
In such a case the above script will loop infinitely adding a new data point with a new value for the field `n_cpus` until the task is stopped.

<!-- defect 589 -->

## Alerts and ids

When using the `deadman` method along with one or more `alert` nodes or when using more than one `alert` node in a pipeline, be sure to set the ID property with the property method `id()`.  The value of ID must be unique on each node.  Failure to do so will lead Kapacitor to assume that they are all the same group of alerts, and so some alerts may not appear as expected.

# Where to next?

See the [examples](https://github.com/influxdata/kapacitor/tree/master/examples) in the code base on Github.  See also the detailed use case solutions in the section [Guides](/kapacitor/v1.4/guides).
