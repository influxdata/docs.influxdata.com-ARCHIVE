---
title: Writing a socket based UDF

menu:
  kapacitor_1_1:
    name: Writing a socket based UDF
    identifier: socket_udf
    weight: 40
    parent: examples
---

In [another example](/kapacitor/v1.1/examples/anomaly_detection/) we saw how to write a process based UDF for custom anomaly detection workloads.
In this example we are going to learn how to write a simple socket based UDF.

## What is a UDF?

A UDF is a user defined function that can communicate with Kapacitor to process data.
Kapacitor will send it data and the UDF can respond with new or modified data.
A UDF can be written in any language that has [protocol buffer](https://developers.google.com/protocol-buffers/) support.

## What is the difference between a socket UDF and a process UDF?

* A process UDF, is a child process of Kapacitor that communicates over STDIN/STDOUT with Kapacitor and is completely managed by Kapacitor.
* A socket UDF is process external to Kapacitor that communicates over a configured unix domain socket. The process itself is not managed by Kapacitor.

Using a process UDF can be simpler than a socket UDF because Kapacitor will spawn the process and manage everything for you.
On the other hand you may want more control over the UDF process itself and rather expose only a socket to Kapacitor.
One use case that is common is running Kapacitor in a Docker container and the UDF in another container that exposes the socket via a Docker volume.

In both cases the protocol is the same the only difference is the transport mechanism.
Also note that since multiple Kapacitor tasks can use the same UDF, for a process based UDF a new child process will be spawned for each use of the UDF.
In contrast for a socket based UDF, a new connection will be made to the socket for each use of the UDF.
If you have many uses of the same UDF it may be better to use a socket UDF to keep the number of running processes low.


## Writing a UDF

A UDF communicates with Kapacitor via a protocol buffer request/response system.
We provide implementations of that communication layer in both Go and Python.
Since the other example used Python we will use the Go version here.

Our example is going to implement a `mirror` UDF which simply reflects all data it receives back to the Kapacitor server.
This example is actually part of the test suite and a Python and Go implementation can be found [here](https://github.com/influxdata/kapacitor/tree/master/udf/agent/examples/mirror).


### Lifecycle

Before we write any code lets look at the lifecycle of a socket UDF:

1. The UDF process is started, independently from Kapacitor.
2. The process listens on a unix domain socket.
3. Kapacitor connects to the socket and queries basic information about the UDFs options.
4. A Kapacitor task is enabled that uses the UDF and Kapacitor makes a new connection to the socket.
5. The task reads and writes data over the socket connection.
6. If the task is stopped for any reason the socket connection is closed.

### The Main method

We need to write a program that starts up and listens on a socket.
The following code is a main function that listens on a socket at
a default path, or on a custom path specified as the `-socket` flag.


```go
package main

import (
    "flag"
    "log"
    "net"
)


var socketPath = flag.String("socket", "/tmp/mirror.sock", "Where to create the unix socket")

func main() {
    flag.Parse()

    // Create unix socket
    addr, err := net.ResolveUnixAddr("unix", *socketPath)
    if err != nil {
        log.Fatal(err)
    }
    l, err := net.ListenUnix("unix", addr)
    if err != nil {
        log.Fatal(err)
    }

    // More to come here...
}
```


Place the above code in a scratch directory called `main.go`.
This above code can be run via `go run main.go`, but at this point it will exit immediately after listening on the socket.

### The Agent

As mentioned earlier, Kapacitor provides an implementation of the communication layer for UDFs called the `agent`.
Our code need only implement an interface in order to take advantage of the `agent` logic.

The interface we need to implement is as follows:

```go
// The Agent calls the appropriate methods on the Handler as it receives requests over a socket.
//
// Returning an error from any method will cause the Agent to stop and an ErrorResponse to be sent.
// Some *Response objects (like SnapshotResponse) allow for returning their own error within the object itself.
// These types of errors will not stop the Agent and Kapacitor will deal with them appropriately.
//
// The Handler is called from a single goroutine, meaning methods will not be called concurrently.
//
// To write Points/Batches back to the Agent/Kapacitor use the Agent.Responses channel.
type Handler interface {
    // Return the InfoResponse. Describing the properties of this Handler
    Info() (*udf.InfoResponse, error)
    // Initialize the Handler with the provided options.
    Init(*udf.InitRequest) (*udf.InitResponse, error)
    // Create a snapshot of the running state of the handler.
    Snaphost() (*udf.SnapshotResponse, error)
    // Restore a previous snapshot.
    Restore(*udf.RestoreRequest) (*udf.RestoreResponse, error)

    // A batch has begun.
    BeginBatch(*udf.BeginBatch) error
    // A point has arrived.
    Point(*udf.Point) error
    // The batch is complete.
    EndBatch(*udf.EndBatch) error

    // Gracefully stop the Handler.
    // No other methods will be called.
    Stop()
}
```

### The Handler

Let's define our own type so we can start implementing the `Handler` interface.
Update the `main.go` file as follows:

```go
package main

import (
    "flag"
    "log"
    "net"

    "github.com/influxdata/kapacitor/udf/agent"
)



// Mirrors all points it receives back to Kapacitor
type mirrorHandler struct {
    // We need a reference to the agent so we can write data
    // back to Kapacitor.
    agent *agent.Agent
}

func newMirrorHandler(agent *agent.Agent) *mirrorHandler {
    return &mirrorHandler{agent: agent}
}

var socketPath = flag.String("socket", "/tmp/mirror.sock", "Where to create the unix socket")

func main() {
    flag.Parse()

    // Create unix socket
    addr, err := net.ResolveUnixAddr("unix", *socketPath)
    if err != nil {
        log.Fatal(err)
    }
    l, err := net.ListenUnix("unix", addr)
    if err != nil {
        log.Fatal(err)
    }

    // More to come here...
}
```

Now let's add in each of the methods needed to initialize the UDF.
These next methods implement the behavior described in Step 3 of the UDF Lifecycle above,
where Kapacitor connects to the socket in order to query basic information about the UDF.

Add these methods to the `main.go` file:

```go

// Return the InfoResponse. Describing the properties of this UDF agent.
func (*mirrorHandler) Info() (*udf.InfoResponse, error) {
    info := &udf.InfoResponse{
        // We want a stream edge
        Wants:    udf.EdgeType_STREAM,
        // We provide a stream edge
        Provides: udf.EdgeType_STREAM,
        // We expect no options.
        Options:  map[string]*udf.OptionInfo{},
    }
    return info, nil
}

// Initialze the handler based of the provided options.
func (*mirrorHandler) Init(r *udf.InitRequest) (*udf.InitResponse, error) {
    // Since we expected no options this method is trivial
    // and we return success.
    init := &udf.InitResponse{
        Success: true,
        Error:   "",
    }
    return init, nil
}
```

For now, our simple mirroring UDF doesn't need any options, so these methods are trivial.
At the end of this example we will modify the code to accept a custom option.

Now that Kapacitor knows which edge types and options our UDF uses, we need to implement the methods
for handling data.

Add this method to the `main.go` file which sends back every point it receives to Kapacitor via the agent:

```go
func (h *mirrorHandler) Point(p *udf.Point) error {
    // Send back the point we just received
    h.agent.Responses <- &udf.Response{
        Message: &udf.Response_Point{
            Point: p,
        },
    }
    return nil
}
```

Notice that the `agent` has a channel for responses, this is because your UDF can send data to Kapacitor
at any time, so it does not need to be in a response to receive a point.

As a result, we need to close the channel to let the `agent` know
that we will not be sending any more data, which can be done via the `Stop` method.
Once the `agent` calls `Stop` on the `handler`, no other methods will be called and the `agent` won't stop until
the channel is closed.
This gives the UDF the chance to flush out any remaining data before it's shutdown:

```go
// Stop the handler gracefully.
func (h *mirrorHandler) Stop() {
    // Close the channel since we won't be sending any more data to Kapacitor
    close(h.agent.Responses)
}
```

Even though we have implemented the majority of the handler implementation, there are still a few missing methods.
Specifically, the methods around batching and snapshot/restores are missing, but, since we don't need them, we will just give them trivial implementations:

```go
// Create a snapshot of the running state of the process.
func (*mirrorHandler) Snaphost() (*udf.SnapshotResponse, error) {
    return &udf.SnapshotResponse{}, nil
}
// Restore a previous snapshot.
func (*mirrorHandler) Restore(req *udf.RestoreRequest) (*udf.RestoreResponse, error) {
    return &udf.RestoreResponse{
        Success: true,
    }, nil
}

// Start working with the next batch
func (*mirrorHandler) BeginBatch(begin *udf.BeginBatch) error {
    return errors.New("batching not supported")
}
func (*mirrorHandler) EndBatch(end *udf.EndBatch) error {
    return nil
}
```

### The Server

At this point we have a complete implementation of the `Handler` interface.
In step #4 of the Lifecycle above, Kapacitor makes a new connection to the UDF for each use in a task. Since it's possible that our UDF process can handle multiple connections simultaneously, we need a mechanism for creating a new `agent` and `handler` per connection.

A `server` is provided for this purpose, which expects an implementation of the `Accepter` interface:

```go
type Accepter interface {
    // Accept new connections from the listener and handle them accordingly.
    // The typical action is to create a new Agent with the connection as both its in and out objects.
    Accept(net.Conn)
}
```

Here is a simple `accepter` that creates a new `agent` and `mirrorHandler`
for each new connection. Add this to the `main.go` file:

```go
type accepter struct {
    count int64
}

// Create a new agent/handler for each new connection.
// Count and log each new connection and termination.
func (acc *accepter) Accept(conn net.Conn) {
    count := acc.count
    acc.count++
    a := agent.New(conn, conn)
    h := newMirrorHandler(a)
    a.Handler = h

    log.Println("Starting agent for connection", count)
    a.Start()
    go func() {
        err := a.Wait()
        if err != nil {
            log.Fatal(err)
        }
        log.Printf("Agent for connection %d finished", count)
    }()
}
```

Now with all the pieces in place, we can update our `main` function to
start up the `server`. Replace the previously provided `main` function with:

```go
func main() {
    flag.Parse()

    // Create unix socket
    addr, err := net.ResolveUnixAddr("unix", *socketPath)
    if err != nil {
        log.Fatal(err)
    }
    l, err := net.ListenUnix("unix", addr)
    if err != nil {
        log.Fatal(err)
    }

    // Create server that listens on the socket
    s := agent.NewServer(l, &accepter{})

    // Setup signal handler to stop Server on various signals
    s.StopOnSignals(os.Interrupt, syscall.SIGTERM)

    log.Println("Server listening on", addr.String())
    err = s.Serve()
    if err != nil {
        log.Fatal(err)
    }
    log.Println("Server stopped")
}
```

## Start the UDF

At this point we are ready to start the UDF.
Here is the complete `main.go` file for reference:

```go
package main

import (
    "errors"
    "flag"
    "log"
    "net"
    "os"
    "syscall"

    "github.com/influxdata/kapacitor/udf"
    "github.com/influxdata/kapacitor/udf/agent"
)

// Mirrors all points it receives back to Kapacitor
type mirrorHandler struct {
    agent *agent.Agent
}

func newMirrorHandler(agent *agent.Agent) *mirrorHandler {
    return &mirrorHandler{agent: agent}
}

// Return the InfoResponse. Describing the properties of this UDF agent.
func (*mirrorHandler) Info() (*udf.InfoResponse, error) {
    info := &udf.InfoResponse{
        Wants:    udf.EdgeType_STREAM,
        Provides: udf.EdgeType_STREAM,
        Options:  map[string]*udf.OptionInfo{},
    }
    return info, nil
}

// Initialze the handler based of the provided options.
func (*mirrorHandler) Init(r *udf.InitRequest) (*udf.InitResponse, error) {
    init := &udf.InitResponse{
        Success: true,
        Error:   "",
    }
    return init, nil
}

// Create a snapshot of the running state of the process.
func (*mirrorHandler) Snaphost() (*udf.SnapshotResponse, error) {
    return &udf.SnapshotResponse{}, nil
}

// Restore a previous snapshot.
func (*mirrorHandler) Restore(req *udf.RestoreRequest) (*udf.RestoreResponse, error) {
    return &udf.RestoreResponse{
        Success: true,
    }, nil
}

// Start working with the next batch
func (*mirrorHandler) BeginBatch(begin *udf.BeginBatch) error {
    return errors.New("batching not supported")
}

func (h *mirrorHandler) Point(p *udf.Point) error {
    // Send back the point we just received
    h.agent.Responses <- &udf.Response{
        Message: &udf.Response_Point{
            Point: p,
        },
    }
    return nil
}

func (*mirrorHandler) EndBatch(end *udf.EndBatch) error {
    return nil
}

// Stop the handler gracefully.
func (h *mirrorHandler) Stop() {
    close(h.agent.Responses)
}

type accepter struct {
    count int64
}

// Create a new agent/handler for each new connection.
// Count and log each new connection and termination.
func (acc *accepter) Accept(conn net.Conn) {
    count := acc.count
    acc.count++
    a := agent.New(conn, conn)
    h := newMirrorHandler(a)
    a.Handler = h

    log.Println("Starting agent for connection", count)
    a.Start()
    go func() {
        err := a.Wait()
        if err != nil {
            log.Fatal(err)
        }
        log.Printf("Agent for connection %d finished", count)
    }()
}

var socketPath = flag.String("socket", "/tmp/mirror.sock", "Where to create the unix socket")

func main() {
    flag.Parse()

    // Create unix socket
    addr, err := net.ResolveUnixAddr("unix", *socketPath)
    if err != nil {
        log.Fatal(err)
    }
    l, err := net.ListenUnix("unix", addr)
    if err != nil {
        log.Fatal(err)
    }

    // Create server that listens on the socket
    s := agent.NewServer(l, &accepter{})

    // Setup signal handler to stop Server on various signals
    s.StopOnSignals(os.Interrupt, syscall.SIGTERM)

    log.Println("Server listening on", addr.String())
    err = s.Serve()
    if err != nil {
        log.Fatal(err)
    }
    log.Println("Server stopped")
}
```

Run `go run main.go` to start the UDF.
If you get an error about the socket being in use,
just delete the socket file and try running the UDF again.

## Configure Kapacitor to Talk to the UDF

Now that our UDF is ready, we need to tell Kapacitor
where our UDF socket is, and give it a name so that we can use it.
Add this to your Kapacitor configuration file:

```
[udf]
[udf.functions]
    [udf.functions.mirror]
        socket = "/tmp/mirror.sock"
        timeout = "10s"
```

## Start Kapacitor

Start up Kapacitor and you should see it connect to your UDF in both the Kapacitor logs and the UDF process logs.

## Try it out

Take an existing task and add `@mirror()` at any point in the TICKscript pipeline to see it in action.

Here is an example TICKscript, which will need to be saved to a file:

```go
stream
    |from()
        .measurement('cpu')
    @mirror()
    |alert()
        .crit(lambda: "usage_idle" < 30)
```

Define the above alert from your terminal like so:

```sh
kapacitor define mirror_udf_example -type stream -dbrp telegraf.autogen -tick path/to/above/script.tick
```

Start the task:

```sh
kapacitor enable mirror_udf_example
```

Check the status of the task:

```sh
kapacitor show mirror_udf_example
```


## Adding a Custom Field

Now let's change the UDF to add a field to the data.
We can use the `Info/Init` methods to define and consume an option on the UDF, so let's specify the name of the field to add.

Update the `mirrorHandler` type and the methods `Info` and `Init` as follows:

```go
// Mirrors all points it receives back to Kapacitor
type mirrorHandler struct {
    agent *agent.Agent
    name  string
    value float64
}

// Return the InfoResponse. Describing the properties of this UDF agent.
func (*mirrorHandler) Info() (*udf.InfoResponse, error) {
    info := &udf.InfoResponse{
        Wants:    udf.EdgeType_STREAM,
        Provides: udf.EdgeType_STREAM,
        Options: map[string]*udf.OptionInfo{
            "field": {ValueTypes: []udf.ValueType{
                udf.ValueType_STRING,
                udf.ValueType_DOUBLE,
            }},
        },
    }
    return info, nil
}

// Initialze the handler based of the provided options.
func (h *mirrorHandler) Init(r *udf.InitRequest) (*udf.InitResponse, error) {
    init := &udf.InitResponse{
        Success: true,
        Error:   "",
    }
    for _, opt := range r.Options {
        switch opt.Name {
        case "field":
            h.name = opt.Values[0].Value.(*udf.OptionValue_StringValue).StringValue
            h.value = opt.Values[1].Value.(*udf.OptionValue_DoubleValue).DoubleValue
        }
    }

    if h.name == "" {
        init.Success = false
        init.Error = "must supply field"
    }
    return init, nil
}
```

Now we can set the field with its name and value on the points.
Update the `Point` method:

```go
func (h *mirrorHandler) Point(p *udf.Point) error {
    // Send back the point we just received
    if p.FieldsDouble == nil {
        p.FieldsDouble = make(map[string]float64)
    }
    p.FieldsDouble[h.name] = h.value

    h.agent.Responses <- &udf.Response{
        Message: &udf.Response_Point{
            Point: p,
        },
    }
    return nil
}
```

Restart the UDF process and try it out again.
Specify which field name and value to use with the `.field(name, value)` method.
You can add a `|log()` after the `mirror` UDF to see that the new field has indeed been created.

```go
stream
    |from()
        .measurement('cpu')
    @mirror()
        .field('mycustom_field', 42.0)
    |log()
    |alert()
        .cirt(lambda: "usage_idle" < 30)
```

## Summary

At this point, you should be able to write custom UDFs using either the socket or process-based methods.
UDFs have a wide range of uses, from custom downsampling logic as part of a continuous query,
custom anomaly detection algorithms, or simply a system to "massage" your data a bit.

### Next Steps

If you want to learn more, here are a few places to start:

* Modify the mirror UDF, to function like the [DefaultNode](https://docs.influxdata.com/kapacitor/v1.1/nodes/default_node/).
	Instead of always overwriting a field, only set it if the field is not absent.
	Also add support for setting tags as well as fields.
* Change the mirror UDF to work on batches instead of streams.
	This requires changing the edge type in the `Info` method as well as implementing the `BeginBatch` and `EndBatch` methods.
* Take a look at the other [examples](https://github.com/influxdata/kapacitor/tree/master/udf/agent/examples) and modify one to do something similar to one of your existing requirements.
