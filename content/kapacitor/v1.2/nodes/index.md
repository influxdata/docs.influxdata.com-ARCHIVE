---
title: TICKscript Node Overview
aliases:
    - kapacitor/v1.2/nodes/source_batch_node/
    - kapacitor/v1.2/nodes/source_stream_node/
    - kapacitor/v1.2/nodes/map_node/
    - kapacitor/v1.2/nodes/reduce_node/
menu:
  kapacitor_1_2:
    name: TICKscript Nodes
    identifier: nodes
    weight: 4
---

> Note: Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.2/tick/).

Property methods modify the node they are called on and return a
reference to the same node. The two most important property methods
are:

* [Batch Node](/kapacitor/v1.2/nodes/batch_node)
* [Stream Node](/kapacitor/v1.2/nodes/stream_node)

Which define the type of task that you are running (either
[stream](/kapacitor/v1.2/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v1.2/introduction/getting_started/#trigger-alert-from-batch-data)). The
other available property methods are:

* [Alert Node](/kapacitor/v1.2/nodes/alert_node)
* [Batch Node](/kapacitor/v1.2/nodes/batch_node)
* [Combine Node](/kapacitor/v1.2/nodes/combine_node)
* [Default Node](/kapacitor/v1.2/nodes/default_node)
* [Delete Node](/kapacitor/v1.2/nodes/delete_node)
* [Derivative Node](/kapacitor/v1.2/nodes/derivative_node)
* [Eval Node](/kapacitor/v1.2/nodes/eval_node)
* [Flatten Node](/kapacitor/v1.2/nodes/flatten_node)
* [From Node](/kapacitor/v1.2/nodes/from_node)
* [Group By Node](/kapacitor/v1.2/nodes/group_by_node)
* [HTTP Output Node](/kapacitor/v1.2/nodes/http_out_node)
* [InfluxDB Output Node](/kapacitor/v1.2/nodes/influx_d_b_out_node)
* [InfluxQL Node](/kapacitor/v1.2/nodes/influx_q_l_node)
* [Join Node](/kapacitor/v1.2/nodes/join_node)
* [K8s Autoscale Node](/kapacitor/v1.2/nodes/k8s_autoscale_node)
* [Log Node](/kapacitor/v1.2/nodes/log_node)
* [NoOp Node](/kapacitor/v1.2/nodes/no_op_node)
* [Sample Node](/kapacitor/v1.2/nodes/sample_node)
* [Shift Node](/kapacitor/v1.2/nodes/shift_node)
* [Stats Node](/kapacitor/v1.2/nodes/stats_node)
* [Stream Node](/kapacitor/v1.2/nodes/stream_node)
* [Query Node](/kapacitor/v1.2/nodes/query_node)
* [UDF (User Defined Function) Node](/kapacitor/v1.2/nodes/u_d_f_node)
* [Union Node](/kapacitor/v1.2/nodes/union_node)
* [Where Node](/kapacitor/v1.2/nodes/where_node)
* [Window Node](/kapacitor/v1.2/nodes/window_node)
