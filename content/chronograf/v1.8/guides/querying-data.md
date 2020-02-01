---
title: Explore data in Chronograf
description: Query and visualize data in the Data Explorer.
menu:
  chronograf_1_8:
    name: Exploring data in Chronograf
    weight: 130
    parent: Guides
---
Explore and visualize your data in the **Data Explorer**. For both InfluxQL and Flux, Chronograf allows you to move seamlessly between using the builder or templates and manually editing the query; when possible, the interface automatically populates the builder with the information from your raw query. Choose between [visualization types](/chronograf/latest/guides/visualization-types/) for your query.

To open the **Data Explorer**, click the **Explore** icon in the navigation bar:

<img src="/img/chronograf/v1.8/data-explorer-icon.png" style="width:100%; max-width:400px; margin:2em 0; display: block;">

## Select local time or UTC (Coordinated Universal Time)

- In the upper-right corner of the page, select the time to view metrics and events by clicking one of the following:
  - **UTC** for Coordinated Universal Time
  - **Local** for the local time reported by your browser 

> **Note:** If your organization spans multiple time zones, we recommend using UTC (Coordinated Universal Time) to ensure that everyone sees metrics and events for the same time.

## Explore data with InfluxQL

InfluxQL is a SQL-like query language you can use to interact with data in InfluxDB. For detailed tutorials and reference material, see our [InfluxQL documentation](/influxdb/latest/query_language/).

1. Open the Data Explorer and click **Add a Query**.
2. To the right of the source dropdown above the graph placeholder, select **InfluxQL** as the source type.
3. Use the builder to select from your existing data and allow Chronograf to format the query for you. Alternatively, manually enter and edit a query.
4. You can also select from the dropdown list of **Metaquery Templates**. Metaqueries show information about a database, such as.
5. Click **Show template values** to display the calculated values in the template.

## Explore data with Flux

Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data. To learn more about Flux, see [Getting started with Flux](/flux/v0.7/introduction/getting-started).

> ***Note:*** Flux v0.7 is a technical preview included with [InfluxDB v1.8](/influxdb/v1.8). It is still in active development and many functions provided by InfluxQL and TICKscript have yet to be implemented.


1. Open the Data Explorer and click **Add a Query**.
2. To the right of the source dropdown above the graph placeholder, select **Flux** as the source type.
 The **Schema**, **Functions**, and **Script** panes appear.
3. Use the **Schema** pane to explore your available data. Click the **+** sign next to a bucket name to expand its content.
4. Use the **Functions** pane to view details about the available Flux functions.
5. Use the **Script** pane to enter your Flux query.

    * To get started with your query, click the **Script Wizard**. In the wizard, you can select a bucket, measurement, fields and an aggregate.

      <img src="/img/chronograf/v1.8/flux-script-wizard.png" style="width:100%; max-width:400px; margin:2em 0; display:block;">

    For example, if you make the above selections, the wizard inserts the following script:

    ```js
    from(bucket: "telegraf/autogen")
    |> range(start: dashboardTime)
    |> filter(fn: (r) => r._measurement == "cpu" and (r._field == "usage_system"))
    |> window(every: autoInterval)
    |> toFloat()
    |> percentile(percentile: 0.95)
    |> group(except: ["_time", "_start", "_stop", "_value"])
    ```
    * Alternatively, you can enter your entire script manually.

6. Click **Run Script** in the top bar of the **Script** pane. You can then preview your graph in the above pane.

## Visualize your query

Select the **Visualization** tab at the top of the **Data Explorer**. For details about all of the available visualization options, see [Visualization types in Chronograf](/chronograf/latest/guides/visualization-types/).

## Add queries to dashboards

To add your query and graph to a dashboard:

1. Click **Send to Dashboard** in the upper right.
2. In the **Target Dashboard(s)** dropdown, select at least one existing dashboard to send the cell to, or select **Send to a New Dashboard**.

    <img src="/img/chronograf/send-to-dashboard-target.png" style="width:100%; max-width:597px; margin:2em 0; display: block;">

3. Enter a name for the new cell and, if you created a new dashboard, the new dashboard.
4. Click **Send to Dashboard(s)**.

    <img src="/img/chronograf/v1.8/send-to-dashboard-send.png" style="width:100%; max-width:597px; display:block; margin:2em 0;">
