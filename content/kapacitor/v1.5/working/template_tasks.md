---
title: Template tasks
description: Create Kapacitor task and TICKscript templates that can be used to quickly create new tasks and TICKscripts.
aliases:
  - /kapacitor/v1.5/examples/template_tasks/
  - /kapacitor/v1.5/guides/template_tasks/
menu:
  kapacitor_1_5:
    name: Template tasks
    identifier: template_tasks
    weight: 9
    parent: work-w-kapacitor
---

Kapacitor has a template system that allows a template to be defined and reused for multiple tasks.
Each task can define its own value for all variables declared within the template.
Templates can be consumed using the CLI and the [API](/kapacitor/v1.5/working/api).

## Create a task template
The following is a simple example that defines a template that computes the mean of a field and triggers an alert.

_**Example: generic\_alert\_template.tick**_
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
This allows complete customized usage of the template when later leveraging it to define tasks.

### Defining variables
In a task template, variables are defined using the following patterns:

```js
// Required variable pattern
var varName dataType

// Optional variable patterns
var varName = dataType: defaultValue
var varName = [*]
```

_View the [literal value types](/kapacitor/v1.5/tick/syntax/#types) section of the
TICKscript syntax article for information about available data types._

#### Optional variables
In some cases, a templated task may be used for tasks that do not require a values for all templated variables.
In order for a variable to be optional, provide a default value. In most cases, the default can simply be `TRUE`:

```js
// Pattern
var varName = datatype: defaultValue

// Examples
var where_filter = lambda: TRUE
var warn = lambda: TRUE
var groups = [*]
```


## Define a task template
To use a template script, first define a new template using the `define-template` command:

```bash
kapacitor define-template generic_mean_alert -tick path/to/template_script.tick
```

Use `show-template` to see more information about the newly created template.

```bash
kapacitor show-template generic_mean_alert
```

A list of variables declared for the template should be returned in the group `vars` as part of the console output as shown in this example:

_**Example: The Vars section of kapacitor show-template output**_
```output
...

Vars:
Name           Type      Default Value  Description
crit           lambda    <required>     Critical criteria, has access to 'mean' field
field          string    <required>     Which field to process
groups         list      [*]            Optional list of group by dimensions
measurement    string    <required>     Which measurement to consume
slack_channel  string    #alerts        The slack channel for alerts
warn           lambda    <required>     Warning criteria, has access to 'mean' field
where_filter   lambda    TRUE           Optional where filter
window         duration  5m0s           How much data to window

...
```

Each task will acquire its type and TICKscript structure from the template.
Variable descriptions are derived from comments above each variable in the template.
The specific values of variables and of the database/retention policy are unique for each task
created using the template.

## Define a new task and provide variable values
Now define a task using the template to trigger an alert on CPU usage.
Pass variable values into the template using simple JSON file.

_**Example: A JSON variable file**_
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

Define the new task using the the `-template` and `-vars` arguments to pass in the
template file and the JSON variable file.

```bash
kapacitor define cpu_alert -template generic_mean_alert -vars cpu_vars.json -dbrp telegraf.autogen
```

Use the `show` command to display the variable values associated with newly created task.

```
kapacitor show cpu_alert
```
```
...

Vars:
Name           Type      Value
crit           lambda    "mean" < 10.0
field          string    usage_idle
groups         list      [host,dc]
measurement    string    cpu
slack_channel  string    #alerts_testing
warn           lambda    "mean" < 30.0
where_filter   lambda    "cpu" == 'cpu-total'
window         duration  1m0s

...
```

A similar task for a memory based alert can also be created using the same template.
Create a `mem_vars.json` and use this snippet.

_**Example: A JSON variables file for memory alerts**_
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

_**Example: The Vars section of the mem\_alert task**_
```
...
Vars:
Name           Type      Value
crit           lambda    "mean" > 90.0
field          string    used_percent
groups         list      [*]
measurement    string    mem
slack_channel  string    #alerts_testing
warn           lambda    "mean" > 80.0
window         duration  10m0s
...
```

Any number of tasks can be defined using the same template.

> **NOTE:** Updates to the template will update all associated tasks and reload them if necessary.

## Using Variables

Variables work with normal tasks as well and can be used to overwrite any defaults in the script.
Since at any point a TICKscript could come in handy as a template, the recommended best practice is to always use `var` declarations in TICKscripts.
Normal tasks work and, if at a later date you decide another similar task is needed, you can easily create a template from the existing TICKscript and define additional tasks with variable files.

## Using the `-file` flag

Starting with Kapacitor 1.4, tasks may be generated from templates using a task definition file.
The task definition file is extended from the variables file of previous releases.
Three new fields are made available.

* The `template-id` field is used to select the template.
* The `dbrps` field is used to define one or more database/retention policy sets that the task will use.
* The `vars` field groups together the variables, which were the core of the file in previous releases.

This file may be in either JSON or YAML.

A task for a memory-based alert can be created using the same template that was defined above.
Create a `mem_template_task.json` file using the snippet in Example 7.


_**Example: A task definition file in JSON**_
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

The task can then be defined with the `file` parameter which, with the new content of the
task definition file, replaces the command-line parameters `template`, `dbrp`, and `vars`.

```
kapacitor define mem_alert -file mem_template_task.json
```

Using YAML, the task definition file `mem_template_task.yaml` appears as follows:

_**Example: A task definition file in YAML**_
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

_**Example: Defining the database and retention policy in the template**_
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

Define a new template from this template script:

```bash
kapacitor define-template implicit_generic_mean_alert -tick path/to/script.tick
```

Then define a task in a YAML file, `implicit_mem_template_task.yaml`

_**Example: A YAML vars file leveraging a template with a predefined database and retention policy**_
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

Create the task:

```bash
kapacitor define mem_alert -file implicit_mem_template_task.yaml
```

> **NOTE:** When the `dbrp` value has already been declared in the template,
the `dbrps` field must **not** appear in the task definition file, e.g. in `implicit_mem_template_task.yaml`.
 Doing so will will cause an error.
