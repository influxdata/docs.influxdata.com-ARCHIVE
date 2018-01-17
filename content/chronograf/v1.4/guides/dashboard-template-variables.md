---
title: Using dashboard template variables
menu:
  chronograf_1_4:
    weight: 60
    parent: Guides
---

Engage with your dashboards and gain insights into your data with Chronograf's dashboard template variables.

### Content

* [Overview](#overview)
* [Template Variable Types](#template-variable-types)
  * [Databases](#databases)
  * [Measurements](#measurements)
  * [Field Keys](#field-keys)
  * [Tag Keys](#tag-keys)
  * [Tag Values](#tag-values)
  * [CSV](#csv)

## Overview

Use Chronograf's dashboard template variables to interact with your dashboard cells and explore your data.
Template variables allow you to alter specific components of a cell's query without having to navigate away from the dashboard.

Chronograf supports six template variable types: databases, measurements, field keys, tag keys, tag values, and customized comma-separated values (CSV).
To create a template variable, click on the blue `Manage` button at the top of your dashboard and configure your variable.
Reference your template variable in a cell's query by surrounding its name with colons (`:`).
The sections below describe and provide examples of each template variable type.

## Template Variable Types

### Databases
Vary the target [database](/influxdb/latest/concepts/glossary/#database).

#### Example

##### Configure the variable
<br>
The following steps create a template variable called `:database:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `database`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Select `Databases` in the `Type` dropdown.

**4.** Click on the green `Get Values` button to see the database names on the instance.
Here, we have two databases: `plants` and `animals`.

![Database template creation](/img/chronograf/v1.4/g-templates-database.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:database:` template variable.
The query below selects all `purchases` [values](/influxdb/latest/concepts/glossary/#field-value) from the `customers` [measurement](/influxdb/latest/concepts/glossary/#measurement), the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and the database specified by the `:database:` template variable.
The template variable requires surrounding colons (`:`) in the query.

```
SELECT "purchases" FROM :database:."autogen"."customers"
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the `:database:` template variable:

![Database template](/img/chronograf/v1.4/g-templates-database.gif)

### Measurements
Vary the target [measurement](/influxdb/latest/concepts/glossary/#measurement).

#### Example

##### Configure the variable
<br>
The following steps create a template variable called `:measurement:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `measurement`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Select `Measurements` in the `Type` dropdown.

**4.** Select the target database in the dropdown next to `SHOW MEASUREMENTS ON`. Here, we select the `animals` database.

**5.** Click on the green `Get Values` button to see the measurement names in that database.
Here, we have two measurements: `customers` and `products`.

![Measurement template creation](/img/chronograf/v1.4/g-templates-measurement.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:measurement:` template variable.
The query below selects all [fields](/influxdb/latest/concepts/glossary/#field) in the `animals` database, the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and in the measurement specified by the `:measurement:` template variable.
The template variable requires surrounding colons (`:`) in the query.
```
SELECT * FROM "animals"."autogen".:measurement:
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the `:measurement:` template variable:

![Measurement template](/img/chronograf/v1.4/g-templates-measurement.gif)

### Field Keys
Vary the target [field key](/influxdb/latest/concepts/glossary/#field-key).

#### Example
##### Configure the variable
<br>
The following steps create a template variable called `:field-key:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `field-key`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Select `Field Keys` in the `Type` dropdown.

**4.** Select the target database in the dropdown next to `SHOW FIELD KEYS ON` and the target [measurement](/influxdb/latest/concepts/glossary/#measurement) in the dropdown next to `FROM`. Here, we select the `animals` database and the `customers` measurement.

**5.** Click on the green `Get Values` button to see the field keys in that database and measurement.
Here, we have three field keys: `petname`, `purchases`, and `returns`.

![Field key template creation](/img/chronograf/v1.4/g-templates-fieldkey.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:field-key:` template variable.
The query below selects the field key specified by the `:field-key:` template variable in the `animals` database, the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and the `customers` measurement.
The template variable requires surrounding colons (`:`) in the query.
```
SELECT :field-key: FROM "animals"."autogen"."customers"
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the `:field-key:` template variable:

![Field key template](/img/chronograf/v1.4/g-templates-fieldkey.gif)

### Tag Keys
Vary the target [tag key](/influxdb/latest/concepts/glossary/#tag-key).

#### Example
##### Configure the variable
<br>
The following steps create a template variable called `:tag-key:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `tag-key`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Select `Tag Keys` in the `Type` dropdown.

**4.** Select the target database in the dropdown next to `SHOW TAG KEYS ON` and the target [measurement](/influxdb/latest/concepts/glossary/#measurement) in the dropdown next to `FROM`. Here, we select the `animals` database and the `customers` measurement.

**5.** Click on the green `Get Values` button to see the tag keys in that database and measurement.
Here, we have two tag keys: `location` and `species`.

![Tag key template creation](/img/chronograf/v1.4/g-templates-tagkey.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:tag-key:` template variable.
The query below selects all `purchases` [values](/influxdb/latest/concepts/glossary/#field-value) in the `animals` database, the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and the `customers` measurement.
It [groups](/influxdb/latest/query_language/data_exploration/#group-by-tags) query results by the tag key specified by the `:tag-key:` template variable.
The template variable requires surrounding colons (`:`) in the query.

```
SELECT "purchases" FROM "animals"."autogen"."customers" GROUP BY :tag-key:
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the `:tag-key:` template variable:

![Tag key template](/img/chronograf/v1.4/g-templates-tagkey.gif)

### Tag Values
Vary the target [tag value](/influxdb/latest/concepts/glossary/#tag-value).

#### Example
##### Configure the variable
<br>
The following steps create a template variable called `:tag-value:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `tag-value`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Select `Tag Values` in the `Type` dropdown.

**4.** Select the target database in the dropdown next to `SHOW TAG VALUES ON`, the target [measurement](/influxdb/latest/concepts/glossary/#measurement) in the dropdown next to `FROM`, and the target [tag key](/influxdb/latest/concepts/glossary/#tag-key) in the dropdown next to `WITH KEY =`. Here, we select the `animals` database, the `customers` measurement, and the `species` tag key.

**5.** Click on the green `Get Values` button to see the tag values in that database, measurement, and tag key.
Here, we have two tag values: `chronocat` and `chronogiraffe`.

![Tag value template creation](/img/chronograf/v1.4/g-templates-tagvalue.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:tag-value:` template variable.
The query below selects all `purchases` [values](/influxdb/latest/concepts/glossary/#field-value) in the `animals` database, the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and the `customers` measurement.
It asks for data where the `species` tag key equals the value specified by the `:tag-value:` template variable.
The template variable requires surrounding colons (`:`) in the query.

```
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "species" = :tag-value:
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the `:tag-value:` template variable:

![Tag value template](/img/chronograf/v1.4/g-templates-tagvalue.gif)

### CSV
Vary part of a query with a customized list of comma-separated values (CSV).

#### Example
##### Configure the variable
<br>

The following steps create a template variable called `:field-value:`.

**1.** In the template variable manager, click the blue `Add Variable` button.

**2.** Name the variable in the `Variable` input. Here, we call it `field-value`.
There's no need to include the surrounding colons (`:`) when you enter your variable name; Chronograf adds them for you.

**3.** Enter a comma-separated list of values in the input below `Enter values below`.
Here, we enter the list `'chronothan','chronobelle'`.
We single quote the values because we plan to use them as string field values; string field values [require single quotes in InfluxQL](/influxdb/latest/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries).

![CSV template creation](/img/chronograf/v1.4/g-templates-csv.png)

Finally, click on the green `Save Changes` button in the top right corner and exit the template variable manager by clicking on the `X`.

##### Use the variable in a cell
<br>
In [cell editor mode](/chronograf/latest/guides/create-a-dashboard/#step-2-enter-cell-editor-mode), create an [InfluxQL](/influxdb/latest/query_language/) query that uses the `:field-value:` template variable.
The query below selects all `purchases` [values](/influxdb/latest/concepts/glossary/#field-value) in the `animals` database, the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), and the `customers` [measurement](/influxdb/latest/concepts/glossary/#measurement).
It asks for data where the `petname` [field key](/influxdb/latest/concepts/glossary/#field-key) equals the value specified by the CSV `:field-value:` template variable.
The template variable requires surrounding colons (`:`) in the query.
```
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "petname" = :field-value:
```

##### Use the variable on a dashboard
<br>
Use the dropdown at the top of the dashboard to select the different options for the CSV `:field-value:` template variable:

![CSV template](/img/chronograf/v1.4/g-templates-csv.gif)
