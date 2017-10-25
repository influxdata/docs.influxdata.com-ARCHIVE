---
title: TICKscript Language Introduction

menu:
  kapacitor_1_3:
    name: Introduction
    identifier: tick_intro
    parent: tick
    weight: 1
---
# Contents
* [Overview](#overview)
* [Nodes](#nodes)
* [Pipelines](#pipelines)
* [Basic Examples](#basic-examples)
* [Where to next](#where-to-next)

# Overview

Kapacitor uses a Domain Specific Language(DSL) named **TICKscript** to define **tasks** involving the extraction, transformation and loading of data and involving, moreover, the tracking of arbitrary changes and the detection of events within data.  One common task is defining alerts.  TICKscript is used in `.tick` files to define **pipelines** for processing data.  The TICKscript language is designed to chain together the invocation of data processing operations defined in **nodes**.  The Kapacitor [Getting Started](/kapacitor/v1.3/introduction/getting_started/) guide introduces TICKscript basics in the context of that product.  For a better understanding of what follows, it is recommended that the reader review that document first.

Each script has a flat scope and each variable in the scope can reference a literal value, such as a string, an integer or a float value, or a node instance with methods that can then be called.

These methods come in two forms.

* **Property methods** &ndash; A property method modifies the internal properties of a node and returns a reference to the same node.  Property methods are called using dot ('.') notation.
* **Chaining methods** &ndash; A chaining method creates a new child node and returns a reference to it.  Chaining methods are called using pipe ('|') notation.

# Nodes

In TICKscript the fundamental type is the **node**.  A node has **properties** and, as mentioned, chaining methods.  A new node can be instantiated from a parent or sibling node using a chaining method of that parent or sibling node.  For each **node type** the signature of this method will be the same, regardless of the parent or sibling node type.  The chaining method can accept zero or more arguments used to initialize internal properties of the new node instance.  Common node types are `batch`, `query`, `stream`, `from`, `eval` and `alert`, though there are dozens of others.  The most common argument types used during instantiation are:

   * Strings representing usually a query expression, but can also represent some other property of the node, for example an endpoint context.
      * example: `query('SELECT sum(value) FROM "pages"."default".errors')`
      * example: `httpOut('top10')`
   * **lambda expressions** representing small function blocks to be applied to the data.
      * example: `eval(lambda: "lows.count"/("norms.count" + "lows.count" ))`
   * Duration literals.
      * example: `shift(6h)`
   * Other nodes and their pipelines captured in variables within the script.

**Example 1 &ndash; chaining method takes a node variable**
```javascript
var errors = batch
    |query('SELECT sum(value) FROM "pages"."default".errors')
...
// Get views batch data
var views = batch
    |query('SELECT sum(value) FROM "pages"."default".views')
...
// Join errors and views
errors
    |join(views)
        .as('errors', 'views')
```

Example 1 shows how the variable `views` is used in the call to the chaining method that instantiates a new `join` node.

The top level nodes, which establish the processing type of the task to be defined, `stream` and `batch`, are simply declared and take no arguments.  Nodes with more complex sets of properties rely on **Property methods** for their internal configuration.  

Each node type **wants** data in either batch or stream mode.  Some can handle both. Each node type also **provides** data in batch or stream mode.  Some can provide both.  This _wants/provides_ pattern is key to understanding how nodes work together.  Taking into consideration the _wants/provides_ pattern, four general node use cases can be defined:

   * _want_ a batch and _provide_ a stream - for example, when computing an average or a minimum or a maximum.
   * _want_ a batch and _provide_ a batch - for example, when identifying outliers in a batch of data.
   * _want_ a stream and _provide_ a batch - for example, when grouping together similar data points.
   * _want_ a stream and _provide_ a stream - for example, when applying a mathematical function like a logarithm to a value in a point.

The [node reference documentation](/kapacitor/v1.3/nodes/) lists the property and chaining methods of each node along with examples and descriptions.

# Pipelines

Every TICKscript is broken into one or more **pipelines**.  Pipelines are chains of nodes logically organized along edges that cannot cycle back to earlier nodes in the chain.  The nodes within a pipeline can be assigned to variables. This allows the results of different pipelines to be combined using, for example, a `join` or a `union` node.  It also allows for sections of the pipeline to be broken into reasonably understandable self-descriptive functional units.  In a simple TICKscript there may be no need to assign pipeline nodes to variables.  The initial node in the pipeline sets the processing type for the Kapacitor task they define.  These can be either `stream` or `batch`.  These two types of pipelines cannot be combined.  

### Stream or Batch?

With `stream` processing, datapoints are read, as in a classic data stream, point by point as they arrive.  With `stream` Kapacitor subscribes to all writes of interest in InfluxDB.  With `batch` processing a frame of 'historic' data is read from the database and then processed.  With `stream` processing data can be transformed before being written to InfluxDB.  With `batch` processing, the data should already be stored in InfluxDB.  After processing, it can also be written back to it.  

Which to use depends upon system resources and the kind of computation being undertaken.  When working with a large set of data over a long time frame `batch` is preferred.  It leaves data stored on the disk until it is required, though the query, when triggered, will result in a sudden high load on the database.  Processing a large set of data over a long time frame with `stream` means needlessly holding potentially billions of data points in memory.  When working with smaller time frames  `stream` is preferred.  It lowers the query load on InfluxDB.  

### Pipelines as graphs

Pipelines in Kapacitor are directed acyclic graphs ([DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph)).  This means that
each edge has a direction down which data flows, and that there cannot be any cycles in the pipeline.  An edge can also be thought of as the data-flow relationship that exists between a parent node and its child.  

At the start of any pipeline will be declared one of two fundamental edges.  This first edge establishes the type of processing for the task, however, each ensuing node establishes the edge type between itself and its children.

* `stream`&rarr;`from()`&ndash; an edge that transfers data a single data point at a time.
* `batch`&rarr;`query()`&ndash; an edge that transfers data in chunks instead of one point at a time.  

### Pipeline validity

When connecting nodes and then creating a new Kapacitor task, Kapacitor will check whether or not the TICKscript syntax is well formed, and if the new edges are applicable to the most recent node.  However full functionality of the pipeline will not be validated until runtime, when error messages can appear in the Kapacitor log.

**Example 2 &ndash; a runtime error**
```bash
...
[cpu_alert:alert4] 2017/10/24 14:42:59 E! error evaluating expression for level CRITICAL: left reference value "usage_idle" is missing value
[cpu_alert:alert4] 2017/10/24 14:42:59 E! error evaluating expression for level CRITICAL: left reference value "usage_idle" is missing value
...
```
Example 2 shows a runtime error that is thrown because a field value has gone missing from the pipeline.  This can often happen following an `eval` node when the `eval` node's property `keep()` is not set.  In general, Kapacitor cannot anticipate all the modalities of the data that the task will encounter at runtime.  Some tasks may not be written to handle all deviations or exceptions from the norm, such as when fields or tags go missing.  In these cases Kapacitor will log an error.   

# Basic Examples

**Example 3 &ndash; An elementary stream &rarr; from() pipeline**
```javascript
stream
    |from()
        .measurement('cpu')
    |httpOut('dump')
```

The simple script in Example 3 can be used to create a task with the default Telegraf database.

```
$ kapacitor define sf_task -type stream -tick sf.tick -dbrp telegraf.autogen
```

The task, `sf_task`, will simply cache the latest cpu datapoint as JSON to the HTTP REST endpoint(e.g http<span>://localhost:</span><span>9092/kapacitor/v1/tasks/sf_task/dump</span>).  

This example contains three nodes:

   * The base `stream` node.
   * The requisite `from()` node, that defines the stream of data points.
   * The processing node `httpOut()`, that caches the data it receives to the REST service of Kapacitor.  

It contains two edges.

   * `stream`&rarr;`from()`&ndash; sets the processing type of the task and the data stream.
   * `from()`&rarr;`httpOut()`&ndash; passes the data stream to the HTTP output processing node.

It contains one property method, which is the call on the `from()` node to `.measurement('cpu')` defining the measurement to be used for further processing.  

**Example 4 &ndash; An elementary batch &rarr; query() pipeline**

```javascript
batch
    |query('SELECT * FROM "telegraf"."autogen".cpu WHERE time > now() - 10s')
        .period(10s)
        .every(10s)
    |httpOut('dump')
```

When used to create a task called `bq_task` with the default Telegraf database, the TICKscript in Example 4 will simply dump the last cpu datapoint of the batch of measurements representing the last 10 seconds of activity to the HTTP REST endpoint(e.g. <span>http</span>:<span>//</span>localhost<span>:9092</span><span>/kapacitor/v1/tasks/bq_task/dump</span>).

This example contains three nodes:

   * The base `batch` node.
   * The requisite `query()` node, that defines the data set.
   * The processing node `httpOut()`, that defines the one step in processing the data set.  In this case it is to publish it to the REST service of  Kapacitor.

It contains two edges.

   * `batch`&rarr;`query()`&ndash; sets the processing style and data set.
   * `query()`&rarr;`httpOut()`&ndash; passes the data set to the HTTP output processing node.

It contains two property methods, which are called from the `query()` node.    

   * `period()`&ndash; sets the period in time which the batch of data will cover.
   * `every()`&ndash; sets the frequency at which the batch of data will be processed.

### Where to next?

For basic examples of working with TICKscript see the latest examples in the code base on [GitHub](https://github.com/influxdata/kapacitor/tree/master/examples).

For TICKscript solutions for intermediate to advanced use cases, see the [Guides](/kapacitor/v1.3/guides/) documentation.

The next section covers [TICKscript syntax](/kapacitor/v1.3/tick/syntax/) in more detail. [Continue...](/kapacitor/v1.3/tick/syntax/)
