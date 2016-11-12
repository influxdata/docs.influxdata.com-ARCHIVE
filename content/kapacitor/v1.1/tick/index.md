---
title: TICKscript Language Reference

menu:
  kapacitor_1_1:
    name: TICKscript
    identifier: tick
    weight: 3
---

Kapacitor uses a DSL named `TICKscript`.
The DSL is used to define the pipelines for processing data in Kapacitor.

The TICKscript language is an invocation chaining language.
Each script has a flat scope and each variable in the scope
defines methods that can be called on it.
These methods come in two flavors.

* Property methods -- Modifies the node they are called on and returns a reference to the same node.
* Chaining methods -- Creates a new node as a child of the node they are called on and returns a reference to the new node.

The reference documentation lists each node's `Property` and `Chaining` methods along with examples and descriptions.

Every TICKscript will have either a `stream` or `batch` variable defined depending on the type of task you want to run.
The `stream` and `batch` variables are an instance of a [StreamNode](/kapacitor/v1.1/nodes/stream_node/) or [SourceBatchNode](/kapacitor/v0.11/nodes/source_batch_node/) respectively.

Pipelines
---------

Kapacitor uses TICKscripts to define data processing pipelines.
A pipeline is set of nodes that process data and edges that connect the nodes.
Pipelines in Kapacitor are directed acyclic graphs ([DAGs](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) meaning 
each edge has a direction that data flows and there cannot be any cycles in the pipeline.

Each edge has a type, one of the following:

* StreamEdge -- an edge that transfers data a single data point at a time.
* BatchEdge -- an edge that transfers data in chunks instead of one point at a time.

When connecting nodes the TICKscript language will not prevent you from connecting edges of the wrong type but rather the check will be performed at runtime.
So just be aware that a syntactically correct script may define a pipeline that is invalid.

Example
-------

```javascript
stream
    |from()
        .measurement('app')
    |eval(lambda: "errors" / "total")
        .as('error_percent')
    // Write the transformed data to InfluxDB
    |influxDBOut()
        .database('mydb')
        .retentionPolicy('myrp')
        .measurement('errors')
        .tag('kapacitor', 'true')
        .tag('version', '0.2')
```

