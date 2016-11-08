---
title: How to contribute a new output to Kapacitor
aliases:
    - kapacitor/v1.1/contributing/custom_output/
menu:
  kapacitor_1_1:
    name: Writing your own Output node
    identifier: custom_output
    weight: 20
    parent: about_the_project
---

If you haven't already check out [this] (https://github.com/influxdb/kapacitor/blob/master/CONTRIBUTING.md)
information to get started contributing.

The Goal
--------

Add a new node to Kapacitor that can output data to a custom endpoint.
For this guide assume we want to output data to a fictitous in-house database called HouseDB.

Overview
--------

Kapacitor processes data via a pipeline.
A pipeline is formally a directed acyclic graph ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)).
The basic idea is that each node in the graph represents some form of processing on the data and each edge passes the data between nodes.
In order to add a new type of node there are two components that need to be written:

1. The API (TICKscript) for creating and configuring the node, and
2. The implementation of the data processing step.

In our example the data processing step is outputting the data to HouseDB.

The code mirrors these requirements with two Go packages.

1. `pipeline` -- this package defines what types of nodes are available and how they are configured.
2. `kapacitor` -- this package provides implementations of each of the nodes defined in the `pipeline` package.

The reason for splitting out defining the node from the implementation of the node is to make the API (i.e.
a TICKscript) clean and easy to follow.

### Updating TICKscript

First things first, we need to update TICKscript so that users can define a our new node.
What should the TICKscript look like to send data to HouseDB?
To connect to a HouseDB instance we need both a URL and a database name, so we need a way to provide that information.
How about this?

```javascript
    node
        |houseDBOut()
            .url('house://housedb.example.com')
            .database('metrics')
```

In order to update TICKscript to support those new methods we need to write a Go type that implements the `pipeline.Node` interface.
The interface can be found [here](https://github.com/influxdb/kapacitor/blob/master/pipeline/node.go)
as well as a complete implementation via the `pipeline.node` type.
Since the implementation of the `Node` is done for us we just need to use it.
First we need a name. `HouseDBOutNode` follows the naming convention.
Let's define a Go `struct` that will implement the interface via composition.
Create a file in the `pipeline` directory called `housedb_out.go` with the following contents:

```go
package pipeline

// A HouseDBOutNode will take the incoming data stream and store it in a
// HouseDB instance.
type HouseDBOutNode struct {
    // Include the generic node implementation.
    node
}
```

Just like that we have a type in Go that implements the needed interface.
In order to allow for the `.url` and `.database` methods we need, simply define fields on the type with the same name.
The first letter needs to capitalized so that it is exported.
It's important that the fields be exported since they will be consumed by the node in the `kapacitor` package.
The rest of the name should have the same capitaization as the method name.
TICKscript will take care of matching the case at runtime.
Update the `housedb_out.go` file.

```go
package pipeline

// A HouseDBOutNode will take the incoming data stream and store it in a
// HouseDB instance.
type HouseDBOutNode struct {
    // Include the generic node implementation.
    node

    // URL for connecting to HouseDB
    Url string

    // Database name
    Database string
}
```

Next we need a consistent way to create a new instance of our node.
But to do so we need to think about how this node connects to other nodes.
Since we are an output node as far as Kapacitor is concerned this is the end of the pipeline.
We will not provide any outbound edges, the graph ends on this node.
Our imaginary HouseDB is flexible and can store data in batches or as single data points.
As a result we do not care what type of data the HouseDBOutNode node receives.
With these facts in mind we can define a function to create a new HouseDBOutNode.
Add this function to the end of the `housedb_out.go` file:

```go
// Create a new HouseDBOutNode that accepts any edge type.
func newHouseDBOutNode(wants EdgeType) *HouseDBOutNode {
    return &HouseDBOutNode{
        node: node{
            desc: "housedb",
            wants: wants,
            provides: NoEdge,
        }
    }
}
```

By explicitly stating the types of edges the node `wants` and `provides`, Kapacitor will do the necessary type checking to prevent invalid pipelines.

Finally we need to add a new `chaining method` so that users can connect HouseDBOutNodes to their existing pipelines.
A `chaining method` is one that creates a new node and adds it as a child of the calling node.
In effect the method chains nodes together.
The `pipeline.chainnode` type contains the set of all methods that can be used for chaining nodes.
Once we add our method to that type any other node can now chain with a HouseDBOutNode.
Add this function to the end of the `pipeline/node.go` file:

```go
// Create a new HouseDBOutNode as a child of the calling node.
func (c *chainnode) HouseDBOut() *HouseDBOutNode {
    h := newHouseDBOutNode(c.Provides())
    c.linkChild(h)
    return h
}
```

We have now defined all the necessary pieces so that TICKscripts can define HouseDBOutNodes:

```javascript
    node
        |houseDBOut() // added as a method to the 'chainnode' type
            .url('house://housedb.example.com') // added as a field to the HouseDBOutNode
            .database('metrics') // added as a field to the HouseDBOutNode
```

### Implementing the HouseDB output

Now that a TICKscript can define our new output node we need to actually provide an implementation so that Kapacitor knows what to do with the node.
Each node in the `pipeline` package has a node of the same name in the `kapacitor` package.
Create a file called `housedb_out.go` and put it in the root of the repo.
Put the contents below in the file.

```go
package kapacitor

import (
    "github.com/influxdb/kapacitor/pipeline"
)

type HouseDBOutNode struct {
    // Include the generic node implementation
    node
    // Keep a reference to the pipeline node
    h    *pipeline.HouseDBOutNode
}
```

The `kapacitor` package also defines an interface named `Node` and provides a default implementation via the `kapacitor.node` type.
Again we use composition to implement the interface.
Notice we also have a field that will contain an instance of the `pipeline.HouseDBOutNode` we just finished defining.
This `pipeline.HouseDBOutNode` acts like a configuration struct telling the `kapacitor.HouseDBOutNode` what it needs to do its job.

Now that we have a struct let's define a function for creating an instance of our new struct.
The `new*Node` methods in the `kapacitor` package follow a convention of:

```go
func newNodeName(et *ExecutingTask, n *pipeline.NodeName) (*NodeName, error) {}
```

In our case we want to define a function called `newHouseDBOutNode`.
Add the following method to the `housedb_out.go` file.:

```go
func newHouseDBOutNode(et *ExecutingTask, n *pipeline.HouseDBOutNode) (*HouseDBOutNode, error) {
    h := &HouseDBOutNode{
        // pass in necessary fields to the 'node' struct
        node: node{Node: n, et: et},
        // Keep a reference to the pipeline.HouseDBOutNode
        h: n,
    }
    // Set the function to be called when running the node
    // more on this in a bit.
    h.node.runF = h.runOut
    return h
}
```

In order for an instance of our node to be created we need to associate it with the node from the `pipeline` package.
This can be done via the switch statement in the `createNode` method in the `task.go` file.
To continue our example:

```go
// Create a node from a given pipeline node.
func (et *ExecutingTask) createNode(p pipeline.Node, l *log.Logger) (n Node, err error) {
    switch t := p.(type) {
    ...
	case *pipeline.HouseDBOutNode:
		n, err = newHouseDBOutNode(et, t, l)
    ...
}
```

Now that we have associated our two types let's get back to implementing the output code.
Notice the line `h.node.runF = h.runOut` in the `newHouseDBOutNode` function.
This line sets the method of the `kapacitor.HouseDBOutNode` that will be called when the node starts execution.
Now we need to define the `runOut` method.
In the file `housedb_out.go` add this method:

```go
func (h *HouseDBOutNode) runOut() error {
    return nil
}
```

With that change the `HouseDBOutNode` is syntactically complete but doesn't do anything yet.
Let's give it something to do!

As we learned earlier nodes communicate via edges.
There is a Go type `kapacitor.Edge` that handles this communication.
All we want to do is read data from the edge and send it to HouseDB.
Recall that we said that a `HouseDBOutNode` "wants" whatever edge type we give it.
Because the node accepts any edge type, we must define how to read stream or batch data.
Lets update the `runOut` method with an appropriate switch statement.

```go
func (h *HouseDBOutNode) runOut() error {
    switch h.Wants() {
    case pipeline.StreamEdge:
        // Read stream data and send to HouseDB
    case pipeline.BatchEdge:
        // Read batch data and send to HouseDB
    }
    return nil
}
```

The `node` type we included via composition in the `HouseDBOutNode` provides a list of edges in the field named `ins`.
Since `HouseDBOutNode` can have only one parent, the edge we are concerned with is the 0th edge.
The `Edge` type provides two methods:

* `NextPoint` for reading stream data.
* `NextBatch` for reading batch data.

Let's update the cases in the switch statements to loop through all data.

```go
func (h *HouseDBOutNode) runOut() error {
    switch h.Wants() {
    case pipeline.StreamEdge:
        // Read stream data and send to HouseDB
        for p, ok := h.ins[0].NextPoint(); ok; p, ok = h.ins[0].NextPoint() {
            // Process a single point
        }
    case pipeline.BatchEdge:
        // Read batch data and send to HouseDB
        for b, ok := h.ins[0].NextBatch(); ok; b, ok = h.ins[0].NextBatch() {
            // Process a batch of points
        }
    }
    return nil
}
```

To make it easy on ourselves we can convert the single point into a batch containing just that point.
Then all we need to do is write a function that takes a batch of points and writes it to HouseDB.

```go
func (h *HouseDBOutNode) runOut() error {
    switch h.Wants() {
    case pipeline.StreamEdge:
        // Read stream data and send to HouseDB
        for p, ok := h.ins[0].NextPoint(); ok; p, ok = h.ins[0].NextPoint() {
            // Turn the point into a batch with just one point.
            batch := models.Batch{
                Name:   p.Name,
                Group:  p.Group,
                Tags:   p.Tags,
                Points: []models.TimeFields{{Time: p.Time, Fields: p.Fields}},
            }
            // Write the batch
            err := h.write(batch)
            if err != nil {
                return err
            }
        }
    case pipeline.BatchEdge:
        // Read batch data and send to HouseDB
        for b, ok := h.ins[0].NextBatch(); ok; b, ok = h.ins[0].NextBatch() {
            // Write the batch
            err := h.write(b)
            if err != nil {
                return err
            }
        }
    }
    return nil
}

// Write a batch of data to HouseDB
func (h *HouseDBOutNode) write(batch models.Batch) error {
    // Implement writing to HouseDB here...
    return nil
}
```

Once we have implemented the `write` method we are done.
As the data arrives at the `HouseDBOutNode`, it will be written to the specified HouseDB instance.

### Summary

We first wrote a node in the `pipeline` package (filepath: `pipeline/housedb_out.go`) to define the TICKscript API for sending data to a HouseDB instance.
We then wrote the implementation of that node in the `kapacitor` package (filepath: `housedb_out.go`).
We also updated `pipeline/node.go` to add a new chaining method and `task.go` to associate the two types.

Here are the complete file contents:

pipeline/housedb_out.go:

```go
package pipeline

// A HouseDBOutNode will take the incoming data stream and store it in a
// HouseDB instance.
type HouseDBOutNode struct {
    // Include the generic node implementation.
    node

    // URL for connecting to HouseDB
    Url string

    // Database name
    Database string
}

// Create a new HouseDBOutNode that accepts any edge type.
func newHouseDBOutNode(wants EdgeType) *HouseDBOutNode {
    return &HouseDBOutNode{
        node: node{
            desc: "housedb",
            wants: wants,
            provides: NoEdge,
        }
    }
}
```

housedb_out.go

```go
package kapacitor

import (
    "github.com/influxdb/kapacitor/pipeline"
)

type HouseDBOutNode struct {
    // Include the generic node implementation
    node
    // Keep a reference to the pipeline node
    h    *pipeline.HouseDBOutNode
}

func newHouseDBOutNode(et *ExecutingTask, n *pipeline.HouseDBOutNode) (*HouseDBOutNode, error) {
    h := &HouseDBOutNode{
        // pass in necessary fields to the 'node' struct
        node: node{Node: n, et: et},
        // Keep a reference to the pipeline.HouseDBOutNode
        h: n,
    }
    // Set the function to be called when running the node
    h.node.runF = h.runOut
    return h
}

func (h *HouseDBOutNode) runOut() error {
    switch h.Wants() {
    case pipeline.StreamEdge:
        // Read stream data and send to HouseDB
        for p, ok := h.ins[0].NextPoint(); ok; p, ok = h.ins[0].NextPoint() {
            // Turn the point into a batch with just one point.
        batch := models.Batch{
                Name:   p.Name,
                Group:  p.Group,
                Tags:   p.Tags,
                Points: []models.TimeFields{{Time: p.Time, Fields: p.Fields}},
            }
            // Write the batch
            err := h.write(batch)
            if err != nil {
                return err
            }
        }
    case pipeline.BatchEdge:
        // Read batch data and send to HouseDB
        for b, ok := h.ins[0].NextBatch(); ok; b, ok = h.ins[0].NextBatch() {
            // Write the batch
            err := h.write(b)
            if err != nil {
                return err
            }
        }
    }
    return nil
}

// Write a batch of data to HouseDB
func (h *HouseDBOutNode) write(batch models.Batch) error {
    // Implement writing to HouseDB here...
    return nil
}
```

pipeline/node.go (only the new chaining method is shown):

```go
...
// Create a new HouseDBOutNode as a child of the calling node.
func (c *chainnode) HouseDBOut() *HouseDBOutNode {
    h := newHouseDBOutNode(c.Provides())
    c.linkChild(h)
    return h
}
...
```

task.go (only the new case is shown):

```go
...
// Create a node from a given pipeline node.
func (et *ExecutingTask) createNode(p pipeline.Node, l *log.Logger) (n Node, err error) {
    switch t := p.(type) {
    ...
	case *pipeline.HouseDBOutNode:
		n, err = newHouseDBOutNode(et, t, l)
    ...
}
...
```

### Documenting your new node

Since TICKscript is its own language we have built a small utility similiar to [godoc](https://godoc.org/golang.org/x/tools/cmd/godoc) named [tickdoc](https://github.com/influxdb/kapacitor/tree/master/tick/cmd/tickdoc).
`tickdoc` generates documentation from comments in the code.
The `tickdoc` utility understands two special comments to help it generate clean documentation.

1. `tick:ignore` -- can be added to any field, method, function or struct. `tickdoc` will skip it and not
    generate any documentation for it. This is most useful to ignore fields that are set via property methods.
2. `tick:property` -- only added to methods. Informs `tickdoc` that the method is a `property method` not a `chaining method`.

Place one of these comments on a line all by itself and `tickdoc` will find it and behave accordingly. Otherwise document your code normaly and `tickdoc` will do the rest.

### Contributing non output node.

Writing any node (not just an output node) is a very similar process and is left as an exercise to the reader.
There are few things that can differ:

The first difference is that your new node will want to use the `pipeline.chainnode` implementation
of the `pipeline.Node` interface in the `pipeline` package if it can send data on to child nodes.
For example:

```go
package pipeline

type MyCustomNode struct {
    // Include pipeline.chainnode so we have all the chaining methods available
    // to our new node
    chainnode

}

func newMyCustomNode(e EdgeType, n Node) *MyCustomNode {
    m := &MyCustomNode{
        chainnode: newBasicChainNode("mycustom", e, e),
    }
    n.linkChild(m)
    return m
}
```

The second difference is that it is possible to define a method that sets fields on a pipeline Node and returns the same instance in order to create a `property method`.
For example:

```go
package pipeline

type MyCustomNode struct {
    // Include pipeline.chainnode so we have all the chaining methods available
    // to our new node
    chainnode

    // Mark this field as ignored for docs
    // Since it is set via the Names method below
    // tick:ignore
    NameList []string `tick:"Names"`

}

func newMyCustomNode(e EdgeType, n Node) *MyCustomNode {
    m := &MyCustomNode{
        chainnode: newBasicChainNode("mycustom", e, e),
    }
    n.linkChild(m)
    return m
}

// Set the NameList field on the node via this method.
//
// Example:
//    node.names('name0', 'name1')
//
// Use the tickdoc comment 'tick:property' to mark this method
// as a 'property method'
// tick:property
func (m *MyCustomNode) Names(name ...string) *MyCustomNode {
    m.NameList = name
    return m
}
```
