---
title: Using dashboard template variables
description: Chronograf dashboards support template variables that let you modify queries through simple user interactions. Variable types include databases, measurements, field keys, tag keys, tag values, comma-separated values (CSV), maps, custom meta queries, and text.
aliases:
  - /chronograf/v1.6/introduction/templating/
  - /chronograf/v1.6/templating/
menu:
  chronograf_1_6:
    weight: 90
    parent: Guides
---

Chronograf's dashboard template variables allow you to alter specific components of cells' queries
without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.

## Using template variables
Template variables are used in cell queries and titles when creating Chronograf dashboards.
Within the query, template variables are referenced by surrounding the variable name with colons (`:`).

```sql
SELECT :variable_name: FROM "telegraf"."autogen".:measurement: WHERE time < :dashboardTime:
```

You can use either [predefined template variables](#predefined-template-variables)
or [custom template variables](#create-custom-template-variables).
Variable values are then selected in your dashboard user-interface (UI).

![Using template variables](/img/chronograf/v1.6/template-vars-use.gif)

## Predefined template variables
Chronograf includes predefined template variables controlled by elements in the Chrongraf UI.
These template variables can be used in any of your cells' queries.

[`:dashboardTime:`](#dashboardtime)  
[`:upperDashboardTime:`](#upperdashboardtime)  
[`:interval:`](#interval)

### dashboardTime
The `:dashboardTime:` template variable is controlled by the "time" dropdown in your Chronograf dashboard.

<img src="/img/chronograf/v1.6/template-vars-time-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard time selector"/>

If using relative times, it represents the time offset specified in the dropdown (-5m, -15m, -30m, etc.) and assumes time is relative to "now".
If using absolute times defined by the date picker, `:dashboardTime:` is populated with lower threshold.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime:
```

> In order to use the date picker to specify a particular time range in the past
> which does not include "now", the query should be constructed using `:dashboardTime:`
> as the lower limit and [`:upperDashboardTime:`](#upperdashboardtime) as the upper limit.

### upperDashboardTime
The `:upperDashboardTime:` template variable is defined by the upper time limit specified using the date picker.

<img src="/img/chronograf/v1.6/template-vars-date-picker.png" style="width:100%;max-width:762px;" alt="Dashboard date picker"/>

It will inherit `now()` when using relative time frames or the upper time limit when using absolute timeframes.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime: AND time < :upperDashboardTime:
```

### interval
The `:interval:` template variable is defined by the interval dropdown in the Chronograf dashboard.

<img src="/img/chronograf/v1.6/template-vars-interval-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard interval selector"/>

In cell queries, it should be used in the `GROUP BY time()` clause that accompanies aggregate functions:

```sql
SELECT mean("usage_system") AS "Average System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardtime:
GROUP BY time(:interval:)
```


## Create custom template variables
Template variables are essentially an array of potential values used to populate parts of your cells' queries.
Chronograf lets you create custom template variables powered by meta queries or CSV uploads that return an array of possible values.

To create a template variable:

1. Click on **Template Variables** at the top of your dashboard, then **+ Add Variable**.
2. Provide a name for the variable.
3. Select the [variable type](#template-variable-types).
   The type defines the method for retrieving the array of possible values.
4. View the list of potential values and select a default.
   If using the CSV or Map types, upload or input the CSV with the desired values in the appropriate format then select a default value.
5. Click **Create**.

![Create a template variable](/img/chronograf/v1.6/template-vars-create.gif)

Once created, the template variable can be used in any of your cell's queries or titles
and a dropdown for the variable will be included at the top of your dashboard.


## Template Variable Types
Chronograf supports the following template variable types:

[Databases](#databases)  
[Measurements](#measurements)  
[Field Keys](#field-keys)  
[Tag Keys](#tag-keys)  
[Tag Values](#tag-values)  
[CSV](#csv)  
[Map](#map)  
[Custom Meta Query](#custom-meta-query)  
[Text](#text)

### Databases
Database template variables allow you to select from multiple target [databases](/influxdb/latest/concepts/glossary/#database).

_**Database meta query**_  
Database template variables use the following meta query to return an array of all databases in your InfluxDB instance.

```sql
SHOW DATABASES
```

_**Example database variable in a cell query**_
```sql
SELECT "purchases" FROM :databaseVar:."autogen"."customers"
```

#### Database variable use cases
Database template variables are good when visualizing multiple databases with similar or identical data structures. They allow you to quickly switch between visualizations for each of your databases.

### Measurements
Vary the target [measurement](/influxdb/latest/concepts/glossary/#measurement).

_**Measurement meta query**_  
Measurement template variables use the following meta query to return an array of all measurements in a given database.

```sql
SHOW MEASUREMENTS ON database_name
```

_**Example measurement variable in a cell query**_
```sql
SELECT * FROM "animals"."autogen".:measurementVar:
```

#### Measurement variable use cases
Measurement template variables allow you to quickly switch between measurements in a single cell or multiple cells in your dashboard.


### Field Keys
Vary the target [field key](/influxdb/latest/concepts/glossary/#field-key).

_**Field key meta query**_  
Field key template variables use the following meta query to return an array of all field keys in a given measurement from a given database.

```sql
SHOW FIELD KEYS ON database_name FROM measurement_name
```

_**Example field key var in a cell query**_
```sql
SELECT :fieldKeyVar: FROM "animals"."autogen"."customers"
```

#### Field key variable use cases
Field key template variables are great if you want to quickly switch between field key visualizations in a given measurement.


### Tag Keys
Vary the target [tag key](/influxdb/latest/concepts/glossary/#tag-key).

_**Tag key meta query**_  
Tag key template variables use the following meta query to return an array of all tag keys in a given measurement from a given database.

```sql
SHOW TAG KEYS ON database_name FROM measurement_name
```

_**Example tag key variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" GROUP BY :tagKeyVar:
```

#### Tag key variable use cases
Tag key template variables are great if you want to quickly switch between tag key visualizations in a given measurement.


### Tag Values
Vary the target [tag value](/influxdb/latest/concepts/glossary/#tag-value).

_**Tag value meta query**_  
Tag value template variables use the following meta query to return an array of all values associated with a given tag key in a specified measurement and database.

```sql
SHOW TAG VALUES ON database_name FROM measurement_name WITH KEY tag_key
```

_**Example tag value variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "species" = :tagValueVar:
```

#### Tag value variable use cases
Tag value template variables are great if you want to quickly switch between tag value visualizations in a given measurement.


### CSV
Vary part of a query with a customized list of comma-separated values (CSV).

_**Example CSVs:**_
```csv
value1, value2, value3, value4
```
```csv
value1
value2
value3
value4
```

> Since string field values [require single quotes in InfluxQL](/influxdb/latest/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries), string values should be wrapped in single quotes.

>```csv
'string1','string2','string3','string4'
```

_**Example CSV variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "petname" = :csvVar:
```

#### CSV variable use cases
CSV template variables are great when the array of values necessary for your variable can't be pulled from InfluxDB using a meta query.
They allow you to use custom variable values.


### Map
Vary part of a query with a customized list of key-value pairs in CSV format.
They key of each key-value pair is used to populate the template variable dropdown in your dashboard.
The value is used when processing cells' queries.

_**Example CSV:**_
```csv
key1,value1
key2,value2
key3,value3
key4,value4
```

<img src="/img/chronograf/v1.6/template-vars-map-dropdown.png" style="width:100%;max-width:140px;" alt="Map variable dropdown"/>

> If values are meant to be used as string field values, wrap them in single quote ([required by InfluxQL](/influxdb/latest/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries)). This only pertains to values. String keys do not matter.

>```csv
key1,'value1'
key2,'value2'
key3,'value3'
key4,'value4'
```

_**Example Map variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "customer" = :mapVar:
```

#### Map variable use cases
Map template variables are good when you need to map or alias simple names or keys to longer or more complex values.
For example, you may want to create a `:customer:` variable that populates your cell queries with a long, numeric customer ID (`11394850823894034209`).
With a map variable, you can alias simple names to complex values, so your list of customers would look something like:

```
Apple,11394850823894034209
Amazon,11394850823894034210
Google,11394850823894034211
Microsoft,11394850823894034212
```

The customer names would populate your template variable dropdown rather than the customer IDs.

### Custom Meta Query
Vary part of a query with a customized meta query that pulls a specific array of values from InfluxDB.
These variables allow you to pull a highly customized array of potential values and offer advanced functionality such as [filtering values based on other template variables](#filtering-template-variables-with-other-template-variables).

<img src="/img/chronograf/v1.6/template-vars-custom-meta-query.png" style="width:100%;max-width:667px;" alt="Custom meta query"/>

_**Example custom meta query variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "customer" = :customMetaVar:
```

#### Custom meta query variable use cases
Custom meta query template variables should be used any time you are pulling values from InfluxDB, but the pre-canned template variable types aren't able to return the desired list of values.

### Text
Vary a part of a query with a single string of text.
There is only one value per text variable, but this value is easily altered.

#### Text variable use cases
Text template variables allow you to dynamically alter queries, such as adding or altering `WHERE` clauses, for multiple cells at once.
You could also use a text template variable to alter a regular expression used in multiple queries.
They are great when troubleshooting incidents that affect multiple visualized metrics.

## Reserved variable names
The following variable names are reserved and cannot be used when creating template variables.
Chronograf accepts [template variables as URL query parameters](#defining-template-variables-in-the-url)
as well as many other parameters that control the display of graphs in your dashboard.
These names are either [predefined variables](#predefined-template-variables) or would
conflict with existing URL query parameters.

`:database:`  
`:measurement:`  
`:dashboardTime:`  
`:upperDashboardTime:`  
`:interval:`  
`:upper:`  
`:lower:`  
`:zoomedUpper:`  
`:zoomedLower:`  

## Advanced template variable usage

### Filtering template variables with other template variables
[Custom meta query template variables](#custom-meta-query) allow you to filter the array of potential variable values using other existing template variables.

For example, let's say you want to list all the field keys associated with a measurement, but want to be able to change the measurement:

1. Create a template variable named `:measurementVar:` _(the name "measurement" is [reserved]( #reserved-variable-names))_ that uses the [Measurements](#measurements) variable type to pull in all measurements from the `telegraf` database.

    <img src="/img/chronograf/v1.6/template-vars-measurement-var.png" style="width:100%;max-width:667px;" alt="measurementVar"/>

2. Create a template variable named `:fieldKey:` that uses the [custom meta query](#custom-meta-query) variable type.
The following meta query pulls a list of field keys based on the existing `:measurementVar:` template variable.

    ```sql
    SHOW FIELD KEYS ON telegraf FROM :measurementVar:
    ```

    <img src="/img/chronograf/v1.6/template-vars-fieldkey.png" style="width:100%;max-width:667px;" alt="fieldKey"/>

3. Create a new dashboard cell that uses the `:fieldKey:` and `:measurementVar` template variables in its query.

    ```sql
    SELECT :fieldKey: FROM "telegraf"..:measurementVar: WHERE time > :dashboardTime:
    ```

The resulting dashboard will work like this:

![Custom meta query filtering](/img/chronograf/v1.6/custom-meta-query-filtering.gif)

### Defining template variables in the URL
Chronograf uses URL query parameters (also known as query string parameters) to set both display options and template variables in the URL.
This makes it easy to share links to dashboards so they load in a specific state with specific template variable values selected.

URL query parameters are appeneded to the end of the URL with a question mark (`?`) indicating beginning of query parameters.
Multiple query paramemters can be chained together using an ampersand (`&`).

To declare a template variable or a date range as a URL query parameter, it must follow the following pattern:

#### Pattern for template variable query parameters
```bash
# Spaces for clarity only
& tempVars %5B variableName %5D = variableValue
```

`&`  
Indicates the beginning of a new query parameter in a series of multiple query parameters.

`tempVars`  
Informs Chronograf that the query parameter being passed is a template variable.
_**Required for all template variable query parameters.**_

`%5B`, `%5D`  
URL-encoded `[` and `]` respectively that enclose the template variable name.

`variableName`  
Name of the template variable.

`variableValue`  
Value of the template variable.

> Whenever template variables are modified in the dashboard, the corresponding
> URL query parameters are automatically updated.

#### Example template variable query parameter
```
.../?&tempVars%5BmeasurementVar%5D=cpu
```

#### Including multiple template variables in the URL
To chain multiple template variables as URL query parameters, include the full [pattern](#pattern-for-template-variable-query-parameters) for _**each**_ template variable.

```bash
# Spaces for clarity only
.../?  &tempVars%5BmeasurementVar%5D=cpu  &tempVars%5BfieldKey%5D=usage_system
```
