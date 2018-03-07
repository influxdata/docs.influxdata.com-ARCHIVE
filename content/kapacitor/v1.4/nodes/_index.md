---
title: TICKscript nodes overview

aliases:
    - kapacitor/v1.4/nodes/source_batch_node/
    - kapacitor/v1.4/nodes/source_stream_node/
    - kapacitor/v1.4/nodes/map_node/
    - kapacitor/v1.4/nodes/reduce_node/
menu:
  kapacitor_1_4:
    name: TICKscript nodes
    identifier: nodes
    weight: 4
---

> ***Note:*** Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.4/tick/).

Nodes represent process invocation units that either take data as a batch or a point-by-point stream, and then alter the data, store the data, or trigger some other activity based on changes in the data (e.g., an alert).

The property methods for these two nodes define the type of task that you are running, either
[stream](/kapacitor/v1.4/introduction/getting_started/#trigger-alert-from-stream-data)
or
[batch](/kapacitor/v1.4/introduction/getting_started/#trigger-alert-from-batch-data).

Below is a complete list of the available nodes. For each node, the associated property methods are described.

## Available nodes

* [Alert node](/kapacitor/v1.4/nodes/alert_node)
* [Barrier node](/kapacitor/v1.4/nodes/barrier_node)
* [Batch node](/kapacitor/v1.4/nodes/batch_node)
* [Combine node](/kapacitor/v1.4/nodes/combine_node)
* [Default node](/kapacitor/v1.4/nodes/default_node)
* [Delete node](/kapacitor/v1.4/nodes/delete_node)
* [Derivative node](/kapacitor/v1.4/nodes/derivative_node)
* [EC2 Autoscale node](/kapacitor/v1.4/nodes/ec2_autoscale_node)
* [Eval node](/kapacitor/v1.4/nodes/eval_node)
* [Flatten node](/kapacitor/v1.4/nodes/flatten_node)
* [From node](/kapacitor/v1.4/nodes/from_node)
* [Group By node](/kapacitor/v1.4/nodes/group_by_node)
* [HTTP Output node](/kapacitor/v1.4/nodes/http_out_node)
* [HTTP Post node](/kapacitor/v1.4/nodes/http_post_node)
* [InfluxDB Output node](/kapacitor/v1.4/nodes/influx_d_b_out_node)
* [InfluxQL node](/kapacitor/v1.4/nodes/influx_q_l_node)
* [Join node](/kapacitor/v1.4/nodes/join_node)
* [K8s Autoscale node](/kapacitor/v1.4/nodes/k8s_autoscale_node)
* [Kapacitor Loopback node](/kapacitor/v1.4/nodes/kapacitor_loopback_node)
* [Log node](/kapacitor/v1.4/nodes/log_node)
* [NoOp node](/kapacitor/v1.4/nodes/no_op_node)
* [Query node](/kapacitor/v1.4/nodes/query_node)
* [Sample node](/kapacitor/v1.4/nodes/sample_node)
* [Shift node](/kapacitor/v1.4/nodes/shift_node)
* [Sideload node](/kapacitor/v1.4/nodes/sideload_node)
* [State Count node](/kapacitor/v1.4/nodes/state_count_node)
* [State Duration node](/kapacitor/v1.4/nodes/state_duration_node)
* [Stats node](/kapacitor/v1.4/nodes/stats_node)
* [Stream node](/kapacitor/v1.4/nodes/stream_node)
* [Swarm Autoscale Node](/kapacitor/v1.4/nodes/swarm_autoscale_node)
* [UDF (User Defined Function) node](/kapacitor/v1.4/nodes/u_d_f_node)
* [Union node](/kapacitor/v1.4/nodes/union_node)
* [Where node](/kapacitor/v1.4/nodes/where_node)
* [Window node](/kapacitor/v1.4/nodes/window_node)
