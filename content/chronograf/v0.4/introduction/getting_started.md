---
title: Getting Started with Chronograf

menu:
  chronograf_04:
    name: Getting Started
    weight: 0
    parent: Introduction
---

## Getting Started with Chronograf

This guide shows how to download, install, and start visualizing data with Chronograf.

## Download and Install Chronograf
Follow the instructions in the Chronograf Downloads section on the [Downloads page](https://influxdb.com/download/index.html#).

## Start the Chronograf Server
How you start Chronograf depends on how you installed it:

#### Debian or RPM package
```
sudo service chronograf start
```
Note that the Chronograf startup script needs root permission to ensure that it can write to `/var/log`, but the executable runs as a normal user.

#### OS X via [Homebrew](http://brew.sh/)
```
chronograf
```

#### Standalone OS X binary
Assuming you're working with Chronograf version 0.4, from the `chronograf-0.4/` directory:
```
./chronograf-0.4-darwin_amd64
```

Check to see that Chronograf is running at http://127.0.0.1:10000.
If this is the first time you've started Chronograf, you'll see this:

![Add new server](/img/chronograf/add-new-server.png)

> **NOTE:** By default, Chronograf runs on localhost port `10000`.
Those settings are configurable; see the configuration file to change them and to see the other configuration options.
We list the location of the configuration file by installation process below.

> * Debian or RPM package: `/opt/chronograf/config.toml`
> * OS X via Homebrew: `/usr/local/etc/chronograf.toml`
> * Standalone OS X binary: `chronograf-0.x.x/chronograf.toml`

Now that you've got everything installed and running it's time to start visualizing your data in Chronograf!

## Add your first Server
Direct Chronograf to your InfluxDB data by adding a server:

1.
Click the `Add new server` button.

2.
Fill out the form with the relevant information.
In this step the only required fields are `NICKNAME`, `HOST`, and `PORT`.


    In the example below, we've called our server `InfluxDB-1` and it's running on `localhost` on port `8086` (the default `HOST` and `PORT` for InfluxDB).
<br>
<br>
![Add server](/img/chronograf/add-server.png)

3.
Click the `Add` button.


    In the image below, notice that Chronograf is now aware of our InfluxDB server `InfluxDB-1`.
<br>
<br>
![Servers](/img/chronograf/servers.png)

Click `Done` in the top left corner and move on to the next section to create your first graph.
You can always return to the `Servers` page by clicking on the gear in the top right corner.

## Create your first Graph
It's time to graph your data.
In the next steps, we'll create an example graph that shows the average idle CPU percentage grouped by CPU tag and by one minute time intervals.


1.
Click `+` and name your graph in the `New Graph` window.
We'll call our graph `Average idle CPU usage`.

2.
Click the `Save` button.

3.
Choose the server, [database](/influxdb/v1.5/concepts/glossary/#database), and [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) that you want to work with:
<br>
<br>
![Server Tray](/img/chronograf/server-tray.png)

    In this example, we're working with the the server `InfluxDB-1`, the database `telegraf`, and the retention policy `default`.

To create a [query](https://influxdb.com/docs/v0.9/concepts/glossary.html#query), you can either use the query builder or, if you're already familiar with InfluxQL, you can manually enter the query in the text input.
Note that once you manually enter the query, the query builder becomes unavailable for use and the time range in the top right corner becomes void.
The next steps create a query with the query builder.
<br>
4.
Create your query.


For this query, we select the measurement `cpu_usage_idle` in the `FILTER BY` section.
We select the field value `value` and the aggregation function `mean` in the `EXTRACT BY` section.
Finally, we group the data by each tag value of the tag `cpu` and by one minute intervals in the `GROUP BY` section.
Notice that the time range in the top right corner determines the time range of your query.
<br>
<br>
    ![Query Builder](/img/chronograf/query-builder.png)

Click `Done` in the top right corner to complete your graph, and move on to the next section to create your first dashboard.

## Create your first Dashboard
Now that we have a graph we want to add it to a dashboard.

1.
Move to the `DASHBOARDS` tab at the top of your screen.

2.
Click `+` and name your dashboard in the `New Dashboard` window.
We'll call our dashboard `Idle CPU usage`.

    Because our dashboard has no graphs, it looks like this:
    <br>
    <br>
    ![Add Graph to Dashboard](/img/chronograf/add-graph-to-dash.png)

3.
Click the `Add Graph` button.


4.
We want to add the graph we made in the section above so we click `Add From Existing Graphs`.
<br>
<br>
![Add From Existing Graphs](/img/chronograf/add-from-existing-graphs.png)

5.
Select `Average idle CPU usage` and click the `Add Graphs to Dash` button in the top right corner.
<br>
<br>
![Select Graph For Dash](/img/chronograf/select-graph-for-dash.png)

That takes us back to our new dashboard!
One graph on a dashboard isn't spectacularly interesting, so we've added a couple more graphs to show you some of the possibilities:
<br>
<br>
![Sample Dashboard](/img/chronograf/sample-dashboard.png)

And that's it!
You now have the foundation for building beautiful data visualizations with Chronograf.
