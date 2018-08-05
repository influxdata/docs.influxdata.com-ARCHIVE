---
title: Load directory service
aliases:
    - kapacitor/v1.5/examples/load_directory/
menu:
  kapacitor_1_5:
    name: Load directory service
    identifier: load_directory
    weight: 15
    parent: guides
---

# File-based definitions of tasks, templates, and load handlers

The load directory service enables file-based definitions of Kapacitor tasks, templates, and topic handlers that are loaded on startup or when a NOHUP signal is sent to the process.

## Configuration
The load directory service configuration is specified in the `[load]` section of the Kapacitor configuration file.

```
[load]
 enabled = true
 dir="/path/to/directory"
```

`dir` specifies the directory where the definition files are located.

The service will attempt to load the definitions from three subdirectories.

The `tasks` directory should contain task TICKscripts and the associated templated task definition files (either YAML or JSON).

The `templates` directory should contain templated TICKscripts.

The `handlers` directory will contain topic handler definitions in yaml or json.

## Tasks

Task files must be placed in the `tasks` subdirectory of the load service
directory. Task TICKscripts are specified based on the following scheme:

* `id` - the file name without the `.tick` extension
* `type` - determined by introspection of the task (stream or batch)
* `dbrp` - defined using the `dbrp` keyword followed by a specified database and retention policy

In the following example, the TICKscript will create a `stream` task named `my_task` for the dbrp `telegraf.autogen`.

```
// /path/to/directory/tasks/my_task.tick
dbrp "telegraf"."autogen"

stream
    |from()
        .measurement('cpu')
        .groupBy(*)
    |alert()
        .warn(lambda: "usage_idle" < 20)
        .crit(lambda: "usage_idle" < 10)
        // Send alerts to the `cpu` topic
        .topic('cpu')
```


## Task templates

Template files must be placed in the `templates` subdirectory of the load service directory.
Task templates are defined according to the following scheme:

* `id` - the file name without the tick extension
* `type` - determined by introspection of the task (stream or batch)
* `dbrp` - defined using the `dbrp` keyword followed by a specified database and retention policy

The following TICKscript example will create a `stream` template named `my_template` for the dbrp `telegaf.autogen`.

```
// /path/to/directory/templates/my_template.tick
dbrp "telegraf"."autogen"

var measurement string
var where_filter = lambda: TRUE
var groups = [*]
var field string
var warn lambda
var crit lambda
var window = 5m
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

### Templated tasks

Templated task files must be placed in the `tasks` subdirectory of the load service directory.
Templated tasks are defined according to the following scheme:

* `id` - filename without the `yaml`, `yml`, or `json` extension
* `dbrps` - required if not specified in template
* `template-id` - required
* `vars` - list of template vars

In this example, the templated task YAML file creates a `stream` task, named `my_templated_task`, for the dbrp `telegraf.autogen`.

```yaml
# /path/to/directory/tasks/my_templated_task.tick
dbrps:
  - { db: "telegraf", rp: "autogen"}
template-id: my_template
vars:
  measurement:
   type: string
   value: cpu
  where_filter:
   type: lambda
   value: "\"cpu\" == 'cpu-total'"
  groups:
   type: list
   value:
       - type: string
         value: host
       - type: string
         value: dc
  field:
   type: string
   value : usage_idle
  warn:
   type: lambda
   value: "\"mean\" < 30.0"
  crit:
   type: lambda
   value: "\"mean\" < 10.0"
  window:
   type: duration
   value : 1m
  slack_channel:
   type: string
   value: "#alerts_testing"
```

The same task can also be created using JSON, as in this example:

```json
{
  "dbrps": [{"db": "telegraf", "rp": "autogen"}],
  "template-id": "my_template",
  "vars": {
    "measurement": {"type" : "string", "value" : "cpu" },
    "where_filter": {"type": "lambda", "value": "\"cpu\" == 'cpu-total'"},
    "groups": {"type": "list", "value": [{"type":"string", "value":"host"},{"type":"string", "value":"dc"}]},
    "field": {"type" : "string", "value" : "usage_idle" },
    "warn": {"type" : "lambda", "value" : "\"mean\" < 30.0" },
    "crit": {"type" : "lambda", "value" : "\"mean\" < 10.0" },
    "window": {"type" : "duration", "value" : "1m" },
    "slack_channel": {"type" : "string", "value" : "#alerts_testing" }
  }
}
```

## Topic handlers

Topic handler files must be placed in the `handlers` subdirectory of the load service directory.

```
id: handler-id
topic: cpu
kind: slack
match: changed() == TRUE
options:
  channel: '#alerts'
```
