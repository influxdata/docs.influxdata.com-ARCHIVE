---
title: TICKscript Node Overview

menu:
  kapacitor_1_0:
    name: TICKscript Nodes
    identifier: nodes
    weight: 4
---

> Note: Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.0/tick/).

Property methods modify the node they are called on and return a
reference to the same node. The two most important property methods
are:

* [Batch Node](/kapacitor/v1.0/nodes/batch_node)
* [Stream Node](/kapacitor/v1.0/nodes/stream_node)

Which define the type of task that you are running (either
[stream](/kapacitor/v1.0/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v1.0/introduction/getting_started/#trigger-alert-from-batch-data)). The
other available property methods are:

* [Alert Node](/kapacitor/v1.0/nodes/alert_node)
* [Batch Node](/kapacitor/v1.0/nodes/batch_node)
* [Derivative Node](/kapacitor/v1.0/nodes/derivative_node)
* [Eval Node](/kapacitor/v1.0/nodes/eval_node)
* [From Node](/kapacitor/v1.0/nodes/from_node)
* [Group By Node](/kapacitor/v1.0/nodes/group_by_node)
* [HTTP Output Node](/kapacitor/v1.0/nodes/http_out_node)
* [InfluxDB Output Node](/kapacitor/v1.0/nodes/influx_d_b_out_node)
* [InfluxQL Node](/kapacitor/v1.0/nodes/influx_q_l_node)
* [Join Node](/kapacitor/v1.0/nodes/join_node)
* [Log Node](/kapacitor/v1.0/nodes/log_node)
* [NoOp Node](/kapacitor/v1.0/nodes/no_op_node)
* [Sample Node](/kapacitor/v1.0/nodes/sample_node)
* [Shift Node](/kapacitor/v1.0/nodes/shift_node)
* [Stats Node](/kapacitor/v1.0/nodes/stats_node)
* [Stream Node](/kapacitor/v1.0/nodes/stream_node)
* [Query Node](/kapacitor/v1.0/nodes/query_node)
* [UDF (User Defined Function) Node](/kapacitor/v1.0/nodes/u_d_f_node)
* [Union Node](/kapacitor/v1.0/nodes/union_node)
* [Where Node](/kapacitor/v1.0/nodes/where_node)
* [Window Node](/kapacitor/v1.0/nodes/window_node)
