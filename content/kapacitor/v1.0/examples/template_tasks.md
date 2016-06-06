---
title: Template Tasks

menu:
  kapacitor_1:
    name: Template Tasks
    identifier: template_tasks
    weight: 50
    parent: examples
---

Kapacitor has a template system that lets you define a template and reuse it for multipe tasks.
Each task can define its own value for various vars within the template.
Templates can be consumed via the CLI and [API](/kapacitor/v1.0/api/api).

The following is a simple example that defines a template that computes the mean of a field and triggers an alert.

```js
// Which measurement to consume
var measurement string
// Optional where filter
var where_filter = lambda: TRUE
// Optional list of group by dimensions
var groups = [*]
// Which field to process
var field string
// Warning criteria, has access to 'mean' field
var warn lambda
// Critical criteria, has access to 'mean' field
var crit lambda
// How much data to window
var window = 5m
// The slack channel for alerts
var slack_channel = '#alerts'

stream
    |from()
        .measurement(measurement)
        .where(where_filter)
        .groupBy(groups)
    |window()
        .period(window)
        .every(window)
    |mean(field)
    |alert()
         .warn(warn)
         .crit(crit)
         .slack()
         .channel(slack_channel)
```

Notice how everything about the task is a `var` expect for the structure of the task pipeline itself.
This allows you to customize the usage of the template completely.

To use this tempalte, first define the template like so:

```
kapacitor define-template generic_mean_alert -tick path/to/above/script.tick -type stream
```

At this point you can run `show-template` to see more information about our template.

```
kapacitor show-template generic_mean_alert
```

You should see a list of `vars` as well as the DOT string for the template.

A task will gain its type and TICKscript properties from the template.
The specific values of vars and valid DBRPs for a task are unique per task.

Now you can define a task that uses the template to alert on cpu usage.
Create a file `cpu_vars.json` and place in these contents.

```json
{
    "measurement": {"type" : "string", "value" : "cpu" },
    "where_filter": {"type": "lambda", "value": "\"cpu\" == 'cpu-total'"},
    "groups": {"type": "list", "value": [{"type":"string", "value":"host"},{"type":"string", "value":"dc"}]},
    "field": {"type" : "string", "value" : "usage_idle" },
    "warn": {"type" : "lambda", "value" : "\"mean\" < 30.0" },
    "crit": {"type" : "lambda", "value" : "\"mean\" < 10.0" },
    "window": {"type" : "duration", "value" : "1m" },
    "slack_channel": {"type" : "string", "value" : "#alerts_testing" }
}
```


Now define the task using the vars for the task.

```
kapacitor define cpu_alert -template generic_mean_alert -vars cpu_vars.json -dbrp telegraf.default
```

A `show` command will display the `vars` associated with this task.

```
kapacitor show cpu_alert
```

We can also create a task for a memory based alert, using the same template.
Create a `mem_vars.json` and use this snippet.

```json
{
    "measurement": {"type" : "string", "value" : "mem" },
    "groups": {"type": "list", "value": [{"type":"star", "value":"*"}]},
    "field": {"type" : "string", "value" : "used_percent" },
    "warn": {"type" : "lambda", "value" : "\"mean\" > 80.0" },
    "crit": {"type" : "lambda", "value" : "\"mean\" > 90.0" },
    "window": {"type" : "duration", "value" : "10m" },
    "slack_channel": {"type" : "string", "value" : "#alerts_testing" }
}
```

```
kapacitor define mem_alert -template generic_mean_alert -vars mem_vars.json -dbrp telegraf.default
```

Running `show` will display the `vars` associated with this task which are unique to our `mem_alert` task.

```
kapacitor show mem_alert
```

You can define any number of tasks that use the same template.
Updates to the template will update all associated tasks and reload them if necessary.

