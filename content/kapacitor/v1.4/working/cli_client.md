---
title: Command Line Client

menu:
  kapacitor_1_4:
    name: Command Line - Overview
    weight: 12
    parent: work-w-kapacitor
---

# Contents
* [General Options](#general-options)
* [Core Commands](#core-commands)
* [Server Management](#server-management)



## Overview

Two key executables are packaged as a part of Kapacitor.  The daemon `kapacitord`
runs the server, including its HTTP interface.  The command line client
`kapacitor` leverages the HTTP interface and other resources, to provide access
to many Kapacitor features.

A general introduction to the `kapacitor` client is presented in the
[Getting Started](/kapacitor/v1.4/introduction/getting_started/) Guide.

When executed the client can take two options and one command followed by
arguments applicable to that command.  

```
kapacitor [options] [command] [args]
```

This document provides an overview of all the commands that can be undertaken with
`kapacitor` grouped by topical areas of interest.  These include general options,
core commands, server management, data sampling, working with topics and topic
handlers, and working with tasks and task templates.

## General Options

By default the client attempts HTTP communication with the server running on
localhost at port 9092.  The server can also be deployed with SSL enabled.  Two
command line options make it possible to override the default communication
settings and to use the client against any Kapacitor server.  

* `--url` &ndash; This option supplies an HTTP url string (`http(s)://host:port`) to the Kapacitor server. When not set on the command line the value of the environment variable `KAPACITOR_URL` is used.
* `--skipVerify` &ndash; This option disables SSL verification.  When not set on the command line the value of the environment variable `KAPACITOR_UNSAFE_SSL` is used.

**Example 1 &ndash; Using command line options**

```
$ kapacitor -skipVerify -url https://192.168.67.88:9093 list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
cpu_alert_topic                                    stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

## Core Commands

Core commands are those most common in a command line application or are those
which are the most commonly used.

* `help` &ndash; brings up the help message.
* `version` &ndash; prints the release version of the `kapacitor` client.
* `list` &ndash; can be used to print out lists of different Kapacitor artifacts.  This command is presented in more detail in the following sections.
* `delete` &ndash; can be used to remove different Kapacitor arrtifacts.  This command is presented in more detail in the following sections.

## Server Management

The `kapacitor` client can be used to investigate aspects of the server,
to backup its data and to work with logs.  One planned feature will be the
ability to push task definitions to other servers.

* `backup` &ndash; to back up the Kapacitor database.

**Example 2 &ndash; Backup**
```
$ sudo kapacitor backup /mnt/datastore/kapacitor/bak/kapacitor-20180101.db
```
* `stats` &ndash; displays statistics about the server.  Takes one of the following two arguments.
   * `general` &ndash; To view values such as the server ID or hostname and to view counts such as the number of tasks and subscriptions.

   **Example 3 &ndash; General Statistics**
   ```
   $ kapacitor stats general
   ClusterID:                    ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509
   ServerID:                     90582c9c-2e25-4654-903e-0acfc48fb5da
   Host:                         localhost                     
   Tasks:                        8                             
   Enabled Tasks:                2                             
   Subscriptions:                12                            
   Version:                      1.5.0~n201711280812     
   ```

   * `ingress` &ndash;  To view InfluxDB measurements and the number of datapoints that pass through the Kapacitor server.

   **Example 4 &ndash; Ingress Statistics**
   ```
   $ kapacitor stats ingress
    Database   Retention Policy Measurement    Points Received
    _internal  monitor          cq                        5274
    _internal  monitor          database                 52740
    _internal  monitor          httpd                     5274
    _internal  monitor          queryExecutor             5274
    _internal  monitor          runtime                   5274
    _internal  monitor          shard                   300976
    _internal  monitor          subscriber              126576
    _internal  monitor          tsm1_cache              300976
    _internal  monitor          tsm1_engine             300976
    _internal  monitor          tsm1_filestore          300976
    _internal  monitor          tsm1_wal                300976
    _internal  monitor          write                     5274
    _kapacitor autogen          edges                    26370
    _kapacitor autogen          ingress                  73817
    _kapacitor autogen          kapacitor                 2637
    _kapacitor autogen          load                      2637
    _kapacitor autogen          nodes                    23733
    _kapacitor autogen          runtime                   2637
    _kapacitor autogen          topics                   73836
    chronograf autogen          alerts                    1560
    telegraf   autogen          cpu                      47502
    telegraf   autogen          disk                     31676
    telegraf   autogen          diskio                   52800
    telegraf   autogen          kernel                    5280
    telegraf   autogen          mem                       5280
    telegraf   autogen          processes                 5280
    telegraf   autogen          swap                     10560
    telegraf   autogen          system                   15840
   ```
* `vars`
* `push`

### Services

* `list service-tests`
* `service-tests`

### Logging

* `logs`
* `level`
* `watch`
