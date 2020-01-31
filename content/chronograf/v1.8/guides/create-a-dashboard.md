---
title: Creating Chronograf dashboards
description: This tutorial guides you quickly through the essential steps required to create custom Chronograf dashboards for use with InfluxDB and the InfluxData Platform.
menu:
  chronograf_1_7:
    name: Creating dashboards
    weight: 30
    parent: Guides
---

Chronograf offers a complete dashboard solution for visualizing your data and monitoring your infrastructure:

* View [pre-created dashboards](/chronograf/latest/guides/using-precreated-dashboards) from the Host List page. Dashboards are available depending on which Telegraf input plugins you have enabled. These pre-created dashboards cannot be cloned or edited.
* Create custom dashboards from scratch by building queries in the Data Explorer, as described [below](#build-a-dashboard).
* Import dashboard templates when you add or update a connection in Chronograf. See [Dashboard templates](#dashboard-templates) for details.


By the end of this guide, you'll be aware of the tools available to you for creating dashboards similar to this example:

![Oh, the Chronobilities](/img/chronograf/v1.7/g-dashboard-possibilities.png)

## Requirements

To perform the tasks in this guide, you must have a working Chronograf instance that is connected to an InfluxDB source.
Data is accessed using the Telegraf [system ](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugins.
For more information, see [Configuring Chronograf](/chronograf/latest/administration/configuration).

## Build a Dashboard

Click **Dashboards** in the navigation bar and then click the **Create Dashboard** button.
A new dashboard is created and ready to begin adding cells.

### Step 1: Name your dashboard

Click **Name This Dashboard** and type a new name. In this guide, "ChronoDash" is used.

### Step 2: Enter cell editor mode

In the first cell, titled "Untitled Cell", click **Edit**
to open the cell editor mode.

![Edit your cell](/img/chronograf/g-dashboard-cell-edit.png)

### Step 3: Create your query

Click the **Add a Query** button to create an [InfluxQL](/influxdb/latest/query_language/) query.
In query editor mode, use the builder to select from your existing data and allow Chronograf to format the query for you.
Alternatively, manually enter and edit a query.
Chronograf allows you to move seamlessly between using the builder and manually editing the query; when possible, the interface automatically populates the builder with the information from your raw query.

For our example, the query builder is used to generate a query that shows the average idle CPU usage grouped by host (in this case, there are three hosts).
By default, Chronograf applies the [`MEAN()` function](/influxdb/latest/query_language/functions/#mean) to the data, groups averages into auto-generated time intervals (`:interval:`), and shows data for the past hour (`:dashboardTime:`).
Those defaults are configurable using the query builder or by manually editing the query.

In addition, the time range (`:dashboardTime:`) is [configurable on the dashboard](#step-6-configure-your-dashboard).

![Build your query](/img/chronograf/v1.7/g-dashboard-builder.png)

### Step 4: Choose your visualization type

Chronograf supports many different [visualization types](/chronograf/latest/guides/visualization-types/). To choose a visualization type, click **Visualization** and select **Step-Plot Graph**.

![Visualization type](/img/chronograf/v1.7/g-dashboard-visualization.png)

### Step 5: Save your cell
Click **Save** (the green checkmark icon) to save your cell.

> ***Note:*** If you navigate away from this page without clicking Save, your work will not be saved.

### Step 6: Configure your dashboard

#### Customize cells:
* You can change the name of the cell from "Untitled Cell" by returning to the cell editor mode, clicking on the name, and renaming it. Remember to save your changes.
* **Move** your cell around by clicking its top bar and dragging it around the page
* **Resize** your cell by clicking and dragging its bottom right corner

#### Explore cell data:
* **Zoom** in on your cell by clicking and dragging your mouse over the area of interest
* **Pan** over your cell data by pressing the shift key and clicking and dragging your mouse over the graph
* **Reset** your cell by double-clicking your mouse in the cell window

    > **Note:**
    These tips only apply to the line, stacked, step-plot, and line+stat [visualization types](/chronograf/latest/guides/visualization-types/).

#### Configure dashboard-wide settings:
* Change the dashboard's *selected time* at the top of the page - the default time is **Local**, which uses your browser's local time. Select **UTC** to use Coordinated Universal Time.

    > **Note:** If your organization spans multiple time zones, we recommend using UTC (Coordinated Universal Time) to ensure that everyone sees metrics and events for the same time.
* Change the dashboard's *auto-refresh interval* at the top of the page - the default interval selected is **Every 15 seconds**.
* Modify the dashboard's *time range* at the top of the page - the default range is **Past 15 minutes**.

Now, you're ready to experiment and complete your dashboard by creating, editing, and repositioning more cells!

## Dashboard templates

Select from a variety of dashboard templates to import and customize based on which Telegraf plugins you have enabled, such as the following examples:

<img src="/img/chronograf/v1.7/protoboard-kubernetes.png" style="width:100%; max-width:600px;">
<img src="/img/chronograf/v1.7/protoboard-mysql.png" style="width:100%; max-width:600px;">
<img src="/img/chronograf/v1.7/protoboard-system.png" style="width:100%; max-width:600px;">
<img src="/img/chronograf/v1.7/protoboard-vsphere.png" style="width:100%; max-width:600px;">

**To import dashboard templates:**

1. From the Configuration page, click **Add Connection** or select an existing connection to edit it.
2. In the **InfluxDB Connection** window, enter or verify your connection details and click **Add** or **Update Connection**.
3. In the **Dashboards** window, select from the available dashboard templates to import based on which Telegraf plugins you have enabled.

    <img src="/img/chronograf/v1.7/protoboard-select.png" style="width:100%; max-width:500px;">
4. Click **Create (x) Dashboards**.    
5. Edit, clone, or configure the dashboards as needed.


## Extra Tips

### Full screen mode
View your dashboard in full screen mode by clicking on the full screen icon in the top right corner of your dashboard.
To exit full screen mode, press the Esc key.

### Template variables
Dashboards support template variables.
See the [Dashboard Template Variables](/chronograf/latest/guides/dashboard-template-variables/) guide for more information.
