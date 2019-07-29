---
title: Contributing new Kapacitor output nodes
aliases:
    - kapacitor/v1.5/contributing/custom_output/
    - kapacitor/v1.5/about_the_project/custom_output/
menu:
  kapacitor_1_5:
    name: Writing your own output node
    identifier: custom_output
    weight: 5
    parent: work-w-kapacitor
---

If you haven't already, check out the [Kapacitor contributing guidelines](https://github.com/influxdb/kapacitor/blob/master/CONTRIBUTING.md)
for information about how to get started contributing.

The goal
--------

Add a new node to Kapacitor that can output data to a custom endpoint.
For this guide assume we want to output data to a fictitous in-house database called HouseDB.

Overview
--------

Kapacitor processes data through a pipeline.
A pipeline is formally a directed acyclic graph ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)).
The basic idea is that each node in the graph represents some form of processing on the data and each edge passes the data between nodes.
In order to add a new type of node there are two components that need to be written:

1. The API (TICKscript) for creating and configuring the node, and
2. The implementation of the data processing step.

In our example the data processing step is outputting the data to HouseDB.

The code mirrors these requirements with two Go packages.

1. `pipeline`: this package defines what types of nodes are available and how they are configured.
2. `kapacitor`: this package provides implementations of each of the nodes defined in the `pipeline` package.

To make the API (i.e., a TICKscript) clean and readable,  defining the node is split out from the implementation of the node.

### Updating TICKscript

First things first, we need to update TICKscript so that users can define a our new node.
What should the TICKscript look like to send data to HouseDB?
To connect to a HouseDB instance, we need both a URL and a database name, so we need a way to provide that information.
How about this?

```js
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

```js
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
    h *pipeline.HouseDBOutNode
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
func newHouseDBOutNode(et *ExecutingTask, n *pipeline.HouseDBOutNode, d NodeDiagnostic) (*HouseDBOutNode, error) {
    h := &HouseDBOutNode{
        // pass in necessary fields to the 'node' struct
        node: node{Node: n, et: et, diag: d},
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
func (et *ExecutingTask) createNode(p pipeline.Node, d NodeDiagnostic) (n Node, err error) {
    switch t := p.(type) {
    ...
	case *pipeline.HouseDBOutNode:
		n, err = newHouseDBOutNode(et, t, d)
    ...
}
```

Now that we have associated our two types let's get back to implementing the output code.
Notice the line `h.node.runF = h.runOut` in the `newHouseDBOutNode` function.
This line sets the method of the `kapacitor.HouseDBOutNode` that will be called when the node starts execution.
Now we need to define the `runOut` method.
In the file `housedb_out.go` add this method:

```go
func (h *HouseDBOutNode) runOut(snapshot []byte) error {
    return nil
}
```

With that change the `HouseDBOutNode` is syntactically complete but doesn't do anything yet.
Let's give it something to do!

As we learned earlier nodes communicate via edges.
There is a Go type `edge.Edge` that handles this communication.
All we want to do is read data from the edge and send it to HouseDB.
Data is represented in the form of an `edge.Message` type.
A node reads messages using an `edge.Consumer`, and a node processes messages by implementing the `edge.Receiver` interface.
The both the `Consumer` and `Receiver` interfaces can be found [here](https://github.com/influxdb/kapacitor/blob/master/edge/consumer.go)

The `node` type we included via composition in the `HouseDBOutNode` provides a list of edges in the field named `ins`.
Since `HouseDBOutNode` can have only one parent, the edge we are concerned with is the 0th edge.
We can consume and process messages from an edge using the `NewConsumerWithReceiver` function.

```go
// NewConsumerWithReceiver creates a new consumer for the edge e and receiver r.
func NewConsumerWithReceiver(e Edge, r Receiver) Consumer {
	return &consumer{
		edge: e,
		r:    r,
	}
}
```

Let's update `runOut` to read and process messages using this function.

```go
func (h *HouseDBOutNode) runOut(snapshot []byte) error {
	consumer := edge.NewConsumerWithReceiver(
		n.ins[0],
		h,
	)
	return consumer.Consume()
}
```

All that's left is for `HouseDBOutNode` to implement the `Receiver` interface and to write a function that takes a batch of points and writes it to HouseDB.
To make it easy on ourselves we can use an `edge.BatchBuffer` for receiving batch messages.
We can also convert single point messages into batch messages containing just one point.

```go
func (h *HouseDBOutNode) BeginBatch(begin edge.BeginBatchMessage) (edge.Message, error) {
	return nil, h.batchBuffer.BeginBatch(begin)
}

func (h *HouseDBOutNode) BatchPoint(bp edge.BatchPointMessage) (edge.Message, error) {
	return nil, h.batchBuffer.BatchPoint(bp)
}

func (h *HouseDBOutNode) EndBatch(end edge.EndBatchMessage) (edge.Message, error) {
    msg := h.batchBuffer.BufferedBatchMessage(end)
    return msg, h.write(msg)
}

func (h *HouseDBOutNode) Point(p edge.PointMessage) (edge.Message, error) {
	batch := edge.NewBufferedBatchMessage(
		edge.NewBeginBatchMessage(
			p.Name(),
			p.Tags(),
			p.Dimensions().ByName,
			p.Time(),
			1,
		),
		[]edge.BatchPointMessage{
			edge.NewBatchPointMessage(
				p.Fields(),
				p.Tags(),
				p.Time(),
			),
		},
		edge.NewEndBatchMessage(),
	)
    return p, h.write(batch)
}

func (h *HouseDBOutNode) Barrier(b edge.BarrierMessage) (edge.Message, error) {
	return b, nil
}
func (h *HouseDBOutNode) DeleteGroup(d edge.DeleteGroupMessage) (edge.Message, error) {
	return d, nil
}
func (h *HouseDBOutNode) Done() {}

// Write a batch of data to HouseDB
func (h *HouseDBOutNode) write(batch edge.BufferedBatchMessage) error {
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
    h *pipeline.HouseDBOutNode
    // Buffer for a batch of points
    batchBuffer *edge.BatchBuffer
}

func newHouseDBOutNode(et *ExecutingTask, n *pipeline.HouseDBOutNode, d NodeDiagnostic) (*HouseDBOutNode, error) {
    h := &HouseDBOutNode{
        // pass in necessary fields to the 'node' struct
        node: node{Node: n, et: et, diag: d},
        // Keep a reference to the pipeline.HouseDBOutNode
        h: n,
        // Buffer for a batch of points
        batchBuffer: new(edge.BatchBuffer),
    }
    // Set the function to be called when running the node
    h.node.runF = h.runOut
    return h
}

func (h *HouseDBOutNode) runOut(snapshot []byte) error {
	consumer := edge.NewConsumerWithReceiver(
		n.ins[0],
		h,
	)
	return consumer.Consume()
}

func (h *HouseDBOutNode) BeginBatch(begin edge.BeginBatchMessage) (edge.Message, error) {
	return nil, h.batchBuffer.BeginBatch(begin)
}

func (h *HouseDBOutNode) BatchPoint(bp edge.BatchPointMessage) (edge.Message, error) {
	return nil, h.batchBuffer.BatchPoint(bp)
}

func (h *HouseDBOutNode) EndBatch(end edge.EndBatchMessage) (edge.Message, error) {
    msg := h.batchBuffer.BufferedBatchMessage(end)
    return msg, h.write(msg)
}

func (h *HouseDBOutNode) Point(p edge.PointMessage) (edge.Message, error) {
	batch := edge.NewBufferedBatchMessage(
		edge.NewBeginBatchMessage(
			p.Name(),
			p.Tags(),
			p.Dimensions().ByName,
			p.Time(),
			1,
		),
		[]edge.BatchPointMessage{
			edge.NewBatchPointMessage(
				p.Fields(),
				p.Tags(),
				p.Time(),
			),
		},
		edge.NewEndBatchMessage(),
	)
    return p, h.write(batch)
}

func (h *HouseDBOutNode) Barrier(b edge.BarrierMessage) (edge.Message, error) {
	return b, nil
}
func (h *HouseDBOutNode) DeleteGroup(d edge.DeleteGroupMessage) (edge.Message, error) {
	return d, nil
}
func (h *HouseDBOutNode) Done() {}

// Write a batch of data to HouseDB
func (h *HouseDBOutNode) write(batch edge.BufferedBatchMessage) error {
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
func (et *ExecutingTask) createNode(p pipeline.Node, d NodeDiagnostic) (n Node, err error) {
    switch t := p.(type) {
    ...
	case *pipeline.HouseDBOutNode:
		n, err = newHouseDBOutNode(et, t, d)
    ...
}
...
```

### Documenting your new node

Since TICKscript is its own language we have built a small utility similiar to [godoc](https://godoc.org/golang.org/x/tools/cmd/godoc) named [tickdoc](https://github.com/influxdb/kapacitor/tree/master/tick/cmd/tickdoc).
`tickdoc` generates documentation from comments in the code.
The `tickdoc` utility understands two special comments to help it generate clean documentation.

1. `tick:ignore`: can be added to any field, method, function or struct. `tickdoc` will skip it and not
    generate any documentation for it. This is most useful to ignore fields that are set via property methods.
2. `tick:property`: only added to methods. Informs `tickdoc` that the method is a `property method` not a `chaining method`.

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
