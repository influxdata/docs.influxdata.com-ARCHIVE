---
title: TICKscript Node Overview

menu:
  kapacitor_010:
    name: TICKscript Nodes
    identifier: nodes
    weight: 4
---

> Note: Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v0.10/tick/).

Property methods modify the node they are called on and return a
reference to the same node. The two most important property methods
are:

* [Batch Node](/kapacitor/v0.10/nodes/batch_node)
* [Stream Node](/kapacitor/v0.10/nodes/stream_node)

Which define the type of task that you are running (either
[stream](/kapacitor/v0.10/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v0.10/introduction/getting_started/#trigger-alert-from-batch-data)). The
other available property methods are:

* [Alert Node](/kapacitor/v0.10/nodes/alert_node)
* [Derivative Node](/kapacitor/v0.10/nodes/derivative_node)
* [Eval Node](/kapacitor/v0.10/nodes/eval_node)
* [Group By Node](/kapacitor/v0.10/nodes/group_by_node)
* [HTTP Output Node](/kapacitor/v0.10/nodes/http_out_node)
* [InfluxDB Output Node](/kapacitor/v0.10/nodes/influx_d_b_out_node)
* [Join Node](/kapacitor/v0.10/nodes/join_node)
* [Map Node](/kapacitor/v0.10/nodes/map_node)
* [Reduce Node](/kapacitor/v0.10/nodes/reduce_node)
* [Sample Node](/kapacitor/v0.10/nodes/sample_node)
* [Source Batch Node](/kapacitor/v0.10/nodes/source_batch_node)
* [Stats Node](/kapacitor/v0.10/nodes/stats_node)
* [UDF (User Defined Function) Node](/kapacitor/v0.10/nodes/u_d_f_node)
* [Union Node](/kapacitor/v0.10/nodes/union_node)
* [Where Node](/kapacitor/v0.10/nodes/where_node)
* [Window Node](/kapacitor/v0.10/nodes/window_node)
