---
title: Web Admin Interface
aliases:
  - /docs/v0.9/ui/built_in_admin_and_explorer.html
---

The built-in web administration GUI is a simple way to interact with InfluxDB. For any significant use, whether writing or querying data, the HTTP API ([reading](../guides/querying_data.html), [writing](../guides/writing_data.html)) or the [command line interface](shell.html) are better options.

## Accessing the UI

The Admin UI is available by default at port 8083, e.g. [http://localhost:8083](http://localhost:8083). You can control the port in the InfluxDB config file. 

You can also access remote InfluxDB instances from the same admin page, although you may only connect to one instance at a time. To access an instance at a location other than than http://localhost:8083, click the Settings icon in the upper right and enter the proper connection settings for the target InfluxDB instance.

### HTTP vs HTTPS

The Admin UI uses HTTP by default but can be configured to use HTTPS. In the InfluxDB config file, find the `[admin]` section and set `https-enabled = true`. You must explicitly connect to the instance using `https://`, there is no redirect from `http` to `https`.


### Selecting the Database

Choose your target database for writes and queries from the "Databases" pull-down menu in the upper right. If you have recently created a database you will need to refresh the Admin UI page before it appears in the pull-down menu.

## Writing Data

The Admin UI has a "Write Data" link in the top menu bar. This link pops up a modal dialog that will accept points in the [line protocol](../write_protocols/line.html) format.

## Querying Data

The Admin UI has a "Query" box where you can enter any valid [InfluxQL](../query_language/spec.html) command, including database administration and schema exploration commands. The "Query Templates" pull-down menu will pre-populate the Query box with a number of common InfluxQL queries.
