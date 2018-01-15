---
title: Template Tasks
aliases:
    - kapacitor/v1.4/examples/template_tasks/
menu:
  kapacitor_1_4:
    name: Template Tasks
    identifier: template_tasks
    weight: 9
    parent: work-w-kapacitor
---

Kapacitor has a template system that lets a template be defined and reused for multiple tasks.
Each task can define its own value for all variables declared within the template.
Templates can be consumed via the CLI and the [API](/kapacitor/v1.4/working/api).

The following is a simple example that defines a template that computes the mean of a field and triggers an alert.

**Example 1 &ndash; generic_alert_template.tick**
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

Notice how all of the fields in the method call are defined by variables declared earlier in the script.
This allows complete customized usage of the template when later leveraging it to define concrete tasks.

To use this template script, first define a new template like so:

```
kapacitor define-template generic_mean_alert -tick path/to/above/script.tick
```

At this point `show-template` can be run to see more information about the newly created template.

```
kapacitor show-template generic_mean_alert
```

A list of variables declared for the template should be returned in the group `vars` as part of the console output as follows:

**Example 2 &ndash; The Vars section of kapacitor show-template output**
```
...
Vars:
Name                          Type      Default Value                           Description
crit                          lambda    <required>                              Critical criteria, has access to 'mean' field
field                         string    <required>                              Which field to process
groups                        list      [*]                                     Optional list of group by dimensions
measurement                   string    <required>                              Which measurement to consume
slack_channel                 string    #alerts                                 The slack channel for alerts
warn                          lambda    <required>                              Warning criteria, has access to 'mean' field
where_filter                  lambda    TRUE                                    Optional where filter
window                        duration  5m0s                                    How much data to window
...
```


Each task will acquire its type and TICKscript structure from the template.
The specific values of variables and of the database/retention policy set of a task are unique for each task.

Now a task can be defined that uses the template to trigger an alert on cpu usage.
Create a file `cpu_vars.json` with the following content.

**Example 3 &ndash; A JSON variable file**
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

Now define the task using the template and the variable values defined in the variable file.

```
kapacitor define cpu_alert -template generic_mean_alert -vars cpu_vars.json -dbrp telegraf.autogen
```

The `show` command will display the variable values associated with this task in the section `vars`.

```
kapacitor show cpu_alert
```

Example output:

**Example 4 &ndash; The Vars section of the cpu_alert task**
```
...
Vars:
Name                          Type      Value
crit                          lambda    "mean" < 10.0
field                         string    usage_idle
groups                        list      [host,dc]
measurement                   string    cpu
slack_channel                 string    #alerts_testing
warn                          lambda    "mean" < 30.0
where_filter                  lambda    "cpu" == 'cpu-total'
window                        duration  1m0s
...
```

A similar task for a memory based alert can also be created using the same template.
Create a `mem_vars.json` and use this snippet.

**Example 5 &ndash; A JSON variables file for memory alerts**
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

The task can now be defined as before, but this time with the new variables file
and a different task identifier.

```
kapacitor define mem_alert -template generic_mean_alert -vars mem_vars.json -dbrp telegraf.autogen
```

Running `show` will display the `vars` associated with this task which are unique to the `mem_alert` task.

```
kapacitor show mem_alert
```

And again the `vars` output:

**Example 6 &ndash; The Vars section of the mem_alert task**
```
...
Vars:
Name                          Type      Value
crit                          lambda    "mean" > 90.0
field                         string    used_percent
groups                        list      [*]
measurement                   string    mem
slack_channel                 string    #alerts_testing
warn                          lambda    "mean" > 80.0
window                        duration  10m0s
...
```


Any number of tasks can be defined using the same template.

>NOTE: Updates to the template will update all associated tasks and reload them if necessary.

## Using Variables

Variables work with normal tasks as well and can be used to overwrite any defaults in the script.
Since at any point a TICKscript could come in handy as a template the recommend best practice is to always use `var` declarations in TICKscripts.
This way normal tasks work and if at a later date it is decided that another similar task should be created, doing so is  a trivial exercise of creating a template from the existing TICKscript and then defining additional tasks with variable files.

## Using the `-file` flag

Starting with version 1.4 of Kapacitor, tasks may be generated from templates using a task definition file.
The task definition file is extended from the variables file of previous releases.
Three new fields are made avaialble.  Compare Example 7 below to Example 5 above.

* The `template-id` field is used to select the template.
* The `dbrps` field is used to define one or more database/retention policy sets that the task will use.
* The `vars` field groups together the variables, which were the core of the file in previous releases.

This file may be in either JSON or YAML.

A task for a memory based alert can be created using the same template defined above.
Create a `mem_template_task.json` file using the snippet in Example 7.

<!-- fixes defect 1372 --> 

**Example 7 &ndash; A task definition file in JSON**
```json
{
  "template-id": "generic_mean_alert",
  "dbrps": [{"db": "telegraf", "rp": "autogen"}],
  "vars": {
    "measurement": {"type" : "string", "value" : "mem" },
    "groups": {"type": "list", "value": [{"type":"star", "value":"*"}]},
    "field": {"type" : "string", "value" : "used_percent" },
    "warn": {"type" : "lambda", "value" : "\"mean\" > 80.0" },
    "crit": {"type" : "lambda", "value" : "\"mean\" > 90.0" },
    "window": {"type" : "duration", "value" : "10m" },
    "slack_channel": {"type" : "string", "value" : "#alerts_testing" }
  }
}
```

The task can then be defined with the `file` parameter, which with the new content of the
task definition file replaces the command-line parameters `template`, `dbrp` and `vars`.

```
kapacitor define mem_alert -file mem_template_task.json
```

Using YAML the task definition file, `mem_template_task.yaml`, appears as follows.

**Example 8 &ndash; A task definition file in YAML**
```yaml
template-id: generic_mean_alert
dbrps:
- db: telegraf
  rp: autogen
vars:
  measurement:
    type: string
    value: mem
  groups:
    type: list
    value:
    - type: star
      value: "*"
  field:
    type: string
    value: used_percent
  warn:
    type: lambda
    value: '"mean" > 80.0'
  crit:
    type: lambda
    value: '"mean" > 90.0'
  window:
    type: duration
    value: 10m
  slack_channel:
    type: string
    value: "#alerts_testing"
```

The task can then be defined with the `file` parameter as previously shown.

```
kapacitor define mem_alert -file mem_template_task.yaml
```

## Specifying `dbrp` implicitly
The following is a simple example that defines a template that computes the mean of a field and triggers an alert, where the `dbrp` is specified in the template.

**Example 9 &ndash; Defining the database and retention policy in the template**
```js
dbrp "telegraf"."autogen"

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

Define a new template from this template script like so:

```
kapacitor define-template implicit_generic_mean_alert -tick path/to/above/script.tick
```

A task may then be defined in a YAML file, `implicit_mem_template_task.yaml`

**Example 10 &ndash; A YAML vars file leveraging a template with a predefined database and retention policy**
```yaml
template-id: implicit_generic_mean_alert
vars:
  measurement:
    type: string
    value: mem
  groups:
    type: list
    value:
    - type: star
      value: "*"
  field:
    type: string
    value: used_percent
  warn:
    type: lambda
    value: '"mean" > 80.0'
  crit:
    type: lambda
    value: '"mean" > 90.0'
  window:
    type: duration
    value: 10m
  slack_channel:
    type: string
    value: "#alerts_testing"
```

The task can then be created as follows:

```
kapacitor define mem_alert -file implicit_mem_template_task.yaml
```

>NOTE: When the `dbrp` value has already been declared in the template,
the `dbrps` field must not appear in the task definition file, e.g. in `implicit_mem_template_task.yaml`.
 Doing so will will cause an error.
