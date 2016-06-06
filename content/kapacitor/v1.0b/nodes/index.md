---
title: TICKscript Node Overview

menu:
  kapacitor_10b:
    name: TICKscript Nodes
    identifier: nodes
    weight: 4
---

> Note: Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.0b/tick/).

Property methods modify the node they are called on and return a
reference to the same node. The two most important property methods
are:

* [Batch Node](/kapacitor/v1.0b/nodes/batch_node)
* [Stream Node](/kapacitor/v1.0b/nodes/stream_node)

Which define the type of task that you are running (either
[stream](/kapacitor/v1.0b/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v1.0b/introduction/getting_started/#trigger-alert-from-batch-data)). The
other available property methods are:

* [Alert Node](/kapacitor/v1.0b/nodes/alert_node)
* [Batch Node](/kapacitor/v1.0b/nodes/batch_node)
* [Derivative Node](/kapacitor/v1.0b/nodes/derivative_node)
* [Eval Node](/kapacitor/v1.0b/nodes/eval_node)
* [From Node](/kapacitor/v1.0b/nodes/from_node)
* [Group By Node](/kapacitor/v1.0b/nodes/group_by_node)
* [HTTP Output Node](/kapacitor/v1.0b/nodes/http_out_node)
* [InfluxDB Output Node](/kapacitor/v1.0b/nodes/influx_d_b_out_node)
* [InfluxQL Node](/kapacitor/v1.0b/nodes/influx_q_l_node)
* [Join Node](/kapacitor/v1.0b/nodes/join_node)
* [Log Node](/kapacitor/v1.0b/nodes/log_node)
* [NoOp Node](/kapacitor/v1.0b/nodes/no_op_node)
* [Sample Node](/kapacitor/v1.0b/nodes/sample_node)
* [Shift Node](/kapacitor/v1.0b/nodes/shift_node)
* [Stats Node](/kapacitor/v1.0b/nodes/stats_node)
* [Stream Node](/kapacitor/v1.0b/nodes/stream_node)
* [Query Node](/kapacitor/v1.0b/nodes/query_node)
* [UDF (User Defined Function) Node](/kapacitor/v1.0b/nodes/u_d_f_node)
* [Union Node](/kapacitor/v1.0b/nodes/union_node)
* [Where Node](/kapacitor/v1.0b/nodes/where_node)
* [Window Node](/kapacitor/v1.0b/nodes/window_node)
