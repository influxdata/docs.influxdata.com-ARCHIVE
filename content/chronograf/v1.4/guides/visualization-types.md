---
title: Visualization types in Chronograf
menu:
  chronograf_1_4:
    name: Visualization types
    weight: 20
    parent: Guides
---

## Visualization types in Chronograf

Chronograf's dashboard views support the following visualization types, which can be selected in the **Visualization Type** selection view like this:

[Visualization Type selection view](/img/chronograf/chrono-viz-types-selector.png)

Each of the data visualization types and the available user controls are described below:

* Line Graph
* Stacked Graph
* Step-Plot Graph
* Single Stat
* Line Graph + Single Stat
* Bar Graph
* Gauge
* Table

For information on adding and displaying annotations in graph views, see [Adding annotations to Chronograf views](/chronograf/v1.4/guides/annotations/).


### Line Graph
Show time series in a line graph.

![Line Graph view](/img/chronograf/chrono-viz-line-graph-selector.png)

#### Line Graph Controls

![Line Graph view](/img/chronograf/chrono-viz-line-graph-controls.png)


#### Line Graph example

![Line Graph view](/img/chronograf/chrono-viz-line-graph-example.png)


### Stacked Graph
Show time series arranged on top of each other.

![Stacked Graph view](/img/chronograf/chrono-viz-stacked-graph-selector.png)

#### Stacked Graph Controls

![Stacked Graph view](/img/chronograf/chrono-viz-stacked-graph-controls.png)

#### Stacked Graph example

![Stacked Graph example](/img/chronograf/chrono-viz-stacked-graph-example.png)

### Step-Plot Graph
Show time series in a staircase graph.

![Step-Plot Graph view](/img/chronograf/chrono-viz-step-graph-selector.png)

#### Step-Plot Graph Controls

![Step-Plot Graph view](/img/chronograf/chrono-viz-step-graph-controls.png)


#### Step-Plot Graph example

![Step-Plot Graph view](/img/chronograf/chrono-viz-step-graph-example.png)

### Single Stat
Show the most recent value of a time series.

![Single Stat view](/img/chronograf/chrono-viz-single-stat-selector.png)

If a cell's query includes a [`GROUP BY` tag](/influxdb/latest/query_language/data_exploration/#group-by-tags) clause, Chronograf sorts the different [series](/influxdb/latest/concepts/glossary/#series) lexicographically and shows the most recent [field value](/influxdb/latest/concepts/glossary/#field-value) associated with the first series.
For example, if a query groups by the `name` [tag key](/influxdb/latest/concepts/glossary/#tag-key) and `name` has two [tag values](/influxdb/latest/concepts/glossary/#tag-value) (`chronelda` and `chronz`), Chronograf shows the most recent field value associated with the `chronelda` series.

If a cell's query includes more than one [field key](/influxdb/latest/concepts/glossary/#field-key) in the [`SELECT` clause](/influxdb/latest/query_language/data_exploration/#select-clause), Chronograf returns the most recent field value associated with the first field key in the `SELECT` clause.
For example, if a query's `SELECT` clause is `SELECT "chronogiraffe","chronelda"`, Chronograf shows the most recent field value associated with the `chronogiraffe` field key.

### Line Graph + Single Stat
Show time series in a line graph and overlay the time series' single most recent value.

![Line Graph + Single Stat view](/img/chronograf/chrono-viz-line-graph-single-stat-selector.png)

#### Line Graph + Single Stat Controls

![Line Graph + Single Stat view](/img/chronograf/chrono-viz-line-graph-single-stat-controls.png)

#### Line Graph + Single Stat example

![Line Graph + Single Stat view](/img/chronograf/chrono-viz-line-graph-single-stat-example.png)


### Bar Graph
Show time series in a bar chart.

![Bar Graph view](/img/chronograf/chrono-viz-bar-graph-selector.png)

#### Bar Graph Contols

![Bar Graph view](/img/chronograf/chrono-viz-bar-graph-controls.png)

#### Bar Graph example

![Bar Graph view](/img/chronograf/chrono-viz-bar-graph-example.png)

### Gauge
Shows a single value in a gauge view.

![Gauge view](/img/chronograf/chrono-viz-gauge-selector.png)

#### Gauge Controls

![Gauge view](/img/chronograf/chrono-viz-gauge-controls.png)

#### Gauge example

![Gauge view](/img/chronograf/chrono-viz-gauge-example.png)


### Table

Displays selected time series data in a tabular format.

![Table view](/img/chronograf/chrono-viz-table-view.png)

#### Table Controls

![Table Controls for Table view](/img/chronograf/chrono-viz-table-controls.png)

* Time Format
* Time Axis
* Lock First Column
* Customize Fields
* Thresholds
  - Add Threshold (button)
* Base Color (selection list)
* Threshold Coloring
  - Background
  - Text

#### Table example

![Table Controls for Table view](/img/chronograf/chrono-viz-table-example.png)
