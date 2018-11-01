---
title: Querying data in Chronograf with Flux
description:
  chronograf_1_7:
    name: Configuration options
    weight: 30
    parent: Guides
---
You can use the data explorer to explore data using either **InfluxQL** or **Flux**.

Select a database

## Exploring data with InfluxQL

1. Open the Data Explorer from the left sidebar menu.
2. To the right of the source dropdown above the graph placeholder, select **InfluxQL** as the source type.
3. Use the builder to select from your existing data and allow Chronograf to format the query for you. Alternatively, manually enter and edit a query.
4. You can also select from the dropdown list of **Metaquery Templates** to insert a metaquery into the editor.
5. click **Show template values** to xyz.

## Exploring data with Flux

!!! Link to scott's flux stuff

1. Open the Data Explorer from the left sidebar menu.
2. To the right of the source dropdown above the graph placeholder, select **Flux** as the source type.
 ![Flux in the Data Explorer](/img/flux/flux-builder-start.gif)
 The **Explore Schema** and **Script** panes appear.
3. Use the **Explore Schema** pane to explore your available data. Click the **+** sign next to a bucket name to expand its content.
4. Use the **Script** pane to enter your Flux query.
  * To get started with your query, click the **Script Wizard**. In the wizard, you can select a bucket, measurement, fields and an aggregate.
  ![Script Wizard window](/img/chronograf/1.7/flux-script-wizard.png)
  For example, if you make the above selections, the wizard inserts the following script:
  ```
  from(bucket: "telegraf/autogen")
  |> range(start: dashboardTime)
  |> filter(fn: (r) => r._measurement == "cpu" and (r._field == "usage_system"))
  |> window(every: autoInterval)
  |> toFloat()
  |> percentile(percentile: 0.95)
  |> group(except: ["_time", "_start", "_stop", "_value"])
  ```
  * Alternatively, you can enter your entire script manually. For details, see !!!.
4. Click **Run Script** in the top bar of the **Script** pane. You can then preview your graph in the above pane.

## Visualizing your query

[Visualization types in Chronograf](/chronograf/v1.6/guides/visualization-types/)

## Adding queries to dashboards

To add your InfluxQL or Flux query to a dashboard, click **Send to Dashboard** in the upper right.
