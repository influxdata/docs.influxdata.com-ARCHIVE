---
title: TICKscript Node Overview
aliases:
    - kapacitor/v1.4/nodes/source_batch_node/
    - kapacitor/v1.4/nodes/source_stream_node/
    - kapacitor/v1.4/nodes/map_node/
    - kapacitor/v1.4/nodes/reduce_node/
menu:
  kapacitor_1_4:
    name: TICKscript Nodes
    identifier: nodes
    weight: 3
---

> Note: Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.4/tick/).

Property methods modify the node they are called on and return a
reference to the same node. The two most important property methods
are:

* [Batch Node](/kapacitor/v1.4/nodes/batch_node)
* [Stream Node](/kapacitor/v1.4/nodes/stream_node)

Which define the type of task that you are running (either
[stream](/kapacitor/v1.4/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v1.4/introduction/getting_started/#trigger-alert-from-batch-data)). The
other available property methods are:

* [Alert Node](/kapacitor/v1.4/nodes/alert_node)
* [Batch Node](/kapacitor/v1.4/nodes/batch_node)
* [Combine Node](/kapacitor/v1.4/nodes/combine_node)
* [Default Node](/kapacitor/v1.4/nodes/default_node)
* [Delete Node](/kapacitor/v1.4/nodes/delete_node)
* [Derivative Node](/kapacitor/v1.4/nodes/derivative_node)
* [Eval Node](/kapacitor/v1.4/nodes/eval_node)
* [Flatten Node](/kapacitor/v1.4/nodes/flatten_node)
* [From Node](/kapacitor/v1.4/nodes/from_node)
* [Group By Node](/kapacitor/v1.4/nodes/group_by_node)
* [HTTP Output Node](/kapacitor/v1.4/nodes/http_out_node)
* [HTTP Post Node](/kapacitor/v1.4/nodes/http_post_node)
* [InfluxDB Output Node](/kapacitor/v1.4/nodes/influx_d_b_out_node)
* [InfluxQL Node](/kapacitor/v1.4/nodes/influx_q_l_node)
* [Join Node](/kapacitor/v1.4/nodes/join_node)
* [K8s Autoscale Node](/kapacitor/v1.4/nodes/k8s_autoscale_node)
* [Kapacitor Loopback Node](/kapacitor/v1.4/nodes/kapacitor_loopback_node)
* [Log Node](/kapacitor/v1.4/nodes/log_node)
* [NoOp Node](/kapacitor/v1.4/nodes/no_op_node)
* [Query Node](/kapacitor/v1.4/nodes/query_node)
* [Sample Node](/kapacitor/v1.4/nodes/sample_node)
* [Shift Node](/kapacitor/v1.4/nodes/shift_node)
* [Sideload Node](/kapacitor/v1.4/nodes/sideload_node)
* [State Count Node](/kapacitor/v1.4/nodes/state_count_node)
* [State Duration Node](/kapacitor/v1.4/nodes/state_duration_node)
* [Stats Node](/kapacitor/v1.4/nodes/stats_node)
* [Stream Node](/kapacitor/v1.4/nodes/stream_node)
* [Swarm Autoscale Node](/kapacitor/v1.4/nodes/swarm_autoscale_node)
* [UDF (User Defined Function) Node](/kapacitor/v1.4/nodes/u_d_f_node)
* [Union Node](/kapacitor/v1.4/nodes/union_node)
* [Where Node](/kapacitor/v1.4/nodes/where_node)
* [Window Node](/kapacitor/v1.4/nodes/window_node)
