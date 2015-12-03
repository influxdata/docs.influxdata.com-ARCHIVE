---
title: TICKscript Language Reference
---

Kapacitor uses a DSL named `TICKscript`. The DSL is used to define the pipelines for processing data in Kapacitor.

The TICKscript language is an invocation chaining language. Each script has a flat scope and each variable in the scope
defines methods that can be called on it. These methods come in two flavors.

* Property methods -- Modifies the node they are called on and returns a reference to the same node.
* Chaining methods -- Creates a new node as a child of the node they are called on and returns a reference to the new node.

The following reference documentation list each node's `Property` methods and `Chaining` methods along with examples and descriptions of the function of the node.

Every TICKscript will have either a `stream` or `batch` variable defined depending on the type of task you want to run.
The `stream` and `batch` variables are an instance of a [StreamNode](/docs/kapacitor/v0.1/tick/stream_node.html) or [BatchNode](/docs/kapacitor/v0.1/tick/batch_node.html) respectively.

Pipelines
---------

Kapacitor uses TICKscripts to define data processing pipelines.
A pipeline is set of nodes that process data and edges that connect the nodes.
Pipelines in Kapacitor are directed acyclic graphs ([DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) meaning 
each edge has a direction that data flows and there cannot be any cycles in the pipeline.

Each edge has a type, one of the following:

* StreamEdge -- an edge that transfers data a single data point at a time.
* BatchEdge -- an edge that transfers data in chunks instead of one point at a time.
* MapReduceEdge -- this is special case where the data being transfered is unique to the specific map reduce job.

When connecting nodes the TICKscript language will not prevent you from connecting edges of the wrong type but rather the check will be performed at runtime.
So just be aware that a syntactically correct script may define a pipeline that is invalid.


Example
-------

```javascript
    // Define a basic batch node that queries for idle cpu.
    var cpu = batch
        .query('''
               SELECT mean("idle")
               FROM "tests"."default".cpu
               WHERE dc = 'nyc'
        ''')
        .period(10s)
        .groupBy(time(2s))
    // Filter down a fork of the cpu data for serverA
    cpu
        .fork()
        .where("host = 'serverA'")
        .mapReduce(influxql.top("mean", 10)
        .window()
            .period(1m)
            .every(1m)
        .httpOut("serverA")
    // Filter down a fork of the cpu data for serverB
    cpu
        .fork()
        .where("host = 'serverB'")
        .mapReduce(influxql.top("mean", 10)
        .window()
            .period(1m)
            .every(1m)
        .httpOut("serverB")
```

Syntax
------

### Strings

There are three ways to write string literals:

1. Single quoted strings with backslash escaped single quotes.

    `'single \' quoted'` -> `single ' quoted`

2. Double quoted strings with backslash escaped double quotes.

    `"double \" quoted"` -> `double " quoted`

3. Triple single quoted strings with no escaping.

    `'''triple \" quoted'''` -> `triple \" quoted`

### Numbers

Numbers are typed and are either a `float64` or an `int64`. If the number contains a decimal it is considered to be a `float64` otherwise it is an `int64`.

Valid number literals:

* 1 -- int64
* 1.2 -- float64
* -5 -- int64
* -5.0 -- float64
* 0.42 -- float64
* -.1 -- float64

Invalid number literals:

* .1 -- positive decimals must have a leading zero

### Durations

TICKscript supports durations literals. They are of the form of an InfluxQL duration. See https://influxdb.com/docs/v0.9/query_language/spec.html#literals



### Statements

A statement begins with an identifier and any number of chaining function calls. The result of a statement can be assigned to a variable using the `var` keyword and assignment operator `=`.

Example:

```javascript
    var errors = stream.fork().from("errors")
    var requests = stream.fork().from("requests")
    // Join the errors and requests stream
    errors.join(requests)
            .as("errors", "requests")
            .rename("error_rate")
        .apply(expr("rate", "errors.value / requests.value"))
```

### Whitespace

 Whitespace is ignored and can be used to format the code as you like.

### Comments

 Basic `//` style single line comments are supported.

