---
title: Handling Kapacitor alerts during scheduled downtime
description: This guide walks through building Kapacitor TICKscripts that gracefully handle scheduled downtime without triggering unnecessary alerts.
menu:
  kapacitor_1_5:
    name: Handling scheduled downtime
    parent: guides
    weight: 100
---

In many cases, infrastructure downtime is necessary to perform system maintenance.
This type of downtime is typically scheduled beforehand, but can trigger unnecessary
alerts if the affected hosts are monitored by Kapacitor.
This guide walks through creating TICKscripts that gracefully handle scheduled downtime
without triggering alerts.

## Sideload
Avoid unnecessary alerts during scheduled downtime by using the
[`sideload`](/kapacitor/v1.5/nodes/sideload_node) node to load information from
files in the filesystem and set fields and tags on data points which can then be used in alert logic.
The `sideload` node adds fields and tags to points based on hierarchical data
from various file-based sources.

Kapacitor searches the specified files for a given field or tag key.
If it finds the field or tag key in the loaded files, it uses the value in the files to
set the field or tag on data points.
If it doesn't find the field or tag key, it sets them to the default value defined
in the [`field` or `tag` properties](#field).

### Relevant sideload properties
The following properties of `sideload` are relevant to gracefully handling scheduled downtime:

#### source
`source` specifies a directory in which source files live.

#### order
`order` specifies both files that are loaded and searched and the order
in which they are loaded and searched.
_Filepaths are relative to the `source` directory.
Files should be either JSON or YAML._

#### field
`field` defines a field key that Kapacitor should search for and the default value
it should use if it doesn't find a matching field key in the loaded files.

#### tag
`tag` defines a tag key that Kapacitor should search for and the default value
it should use if it doesn't find a matching tag key in the loaded files.


## Setup
With the `sideload` function, you can create what is essentially a white- or
black-list of hosts to ignore during scheduled downtime.
For this example, assume that maintenance will happen on both individual hosts
and hostgroups, both of which are included as tags on each point in the data set.

_In most cases, this can be done simply by host, but to illustrate how the `order`
property works, we'll use both host and hostgroup._

### Sideload source files
On the host on which Kapacitor is running, create a source directory that will
house the JSON or YAML files.
For example, `/usr/kapacitor/scheduled-maintenance`
(_It can be whatever you want as long as the `kapacitord` process can access it)._

Inside this directory, create a file for each host or host group that will be
offline during the scheduled downtime.
For the sake of organization, create `hosts` and `hostgroups` directories
and store the YAML or JSON files in each.
The names of each file should match a value of a `host` or `hostgroup` tag
for hosts that will be taken offline.

For this example, assume the **host1**, **host2**, **host3** hosts and the
**cluster7** and **cluster8** hostgroups will be taken offline.
Create a file for each of these hosts and host groups in their respective directories:

```
/usr/
└── kapacitor/
    └── scheduled-maintenance/
        │
        ├── hosts/
        │   ├── host1.yml
        │   ├── host2.yml
        │   └── host3.yml
        │
        └── hostgroups/
            ├── cluster7.yml
            └── cluster8.yml
```

> You only need to create files for hosts or hostgroups that will be offline.

The contents of the file should contain one or more key-value pairs.
The key is the field or tag key that will be set on each matching point.
The value is the field or tag value that will be set on matching points.

For this example, set the `maintenance` field to `true`.
Each of the source files will look like the following:

###### host1.yml
```yaml
maintenance: true
```

## TICKscript
Create a TICKscript that uses the `sideload` node to load in the maintenance state where ever it is needed.

### Define the sideload source
The `source` should use the `file://` URL protocol to reference the absolute path
of the directory containing the files that should be loaded.

```js
|sideload()
  .source('file:///usr/kapacitor/scheduled-maintenance')
```

### Define the sideload order
The `order` property has access to template data which should be used to populate
the filepaths for loaded files (relative to the [`source`](#define-the-sideload-source)).
This allows Kapacitor to dynamically search for files based on the tag name used in the template.

In this case, use the `host` and `hostgroup` tags.
Kapacitor will iterate through the different values for each tag and search for
matching files in the source directory.

```js
|sideload()
  .source('file:///usr/kapacitor/scheduled-maintenance')
  .order('hosts/{{.host}}.yml' , 'hostgroups/{{.hostgroup}}.yml')
```

The order of file path templates in the `order` property define
the precedence in which file paths are checked.
Those listed first, from left to right, are checked first.

### Define the sideload field
The `field` property requires two arguments:

```js
|sideload()
  // ...
  .field('<key>', <default-value>)
```

###### key
The key that Kapacitor looks for in the source files and the field for which it
defines a value on each data point.

###### default-value
The default value used if no matching file and key are found in the source files.

In this example, use the `maintenance` field and set the default value to `FALSE`.
This assumes hosts are not undergoing maintenance by default.

```js
|sideload()
  .source('file:///usr/kapacitor/scheduled-maintenance')
  .order('hosts/{{.host}}.yml' , 'hostgroups/{{.hostgroup}}.yml')
  .field('maintenance', FALSE)
```

> You can use the `tag` property instead of `field` if you prefer to set a tag
> on each data point rather than a field.

### Update alert logic
The `sideload` node will now set the `maintenance` field on every data point processed by the TICKscript.
For those that have `host` or `hostgroup` tags matching the filenames of the source files,
the `maintenance` field will be set to the value defined in the source file.

Update the alert logic in your TICKscript to ensure `maintenance` is **not** `true`
before sending an alert:

```js
stream
  // ...
  |alert()
    .crit(lambda: !"maintenance" AND "usage_idle" < 30)
    .warn(lambda: !"maintenance" AND "usage_idle" < 50)
    .info(lambda: !"maintenance" AND "usage_idle" < 70)
```

### Full TICKscript example
```js
stream
  |from()
    .measurement('cpu')
    .groupBy(*)
  // Use sideload to maintain the host maintenance state.
  // By default we assume a host is not undergoing maintenance.
  |sideload()
    .source('file:///usr/kapacitor/scheduled-maintenance')
    .order('hosts/{{.host}}.yml' , 'hostgroups/{{.hostgroup}}.yml')
    .field('maintenance', FALSE)
  |alert()
    // Add the `!"maintenance"` condition to the alert.
    .crit(lambda: !"maintenance" AND "usage_idle" < 30)
    .warn(lambda: !"maintenance" AND "usage_idle" < 50)        
    .info(lambda: !"maintenance" AND "usage_idle" < 70)
```

## Prepare for scheduled downtime
[Define a new Kapacitor task](/kapacitor/v1.5/working/cli_client/#tasks-and-task-templates) using your updated TICKscript.

As your scheduled downtime begins, update the `maintenance` value in the appropriate
host and host group source files and reload sideload to avoid alerts being triggered
for those specific hosts and host groups.
