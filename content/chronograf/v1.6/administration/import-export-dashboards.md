---
title: Importing and exporting Chronograf dashboards
description: A step-by-step guide that walks through both exporting and importing Chrongraf dashboards.
menu:
  chronograf_1_6:
    weight: 120
    parent: Administration
---

Chronograf makes it easy to both export and import dashboards.
Dashboard exports are simple JSON files that can be shared and imported into other Chronograf instances.
This allows you to recreate robust dashboards without having to manually configure them from the ground up.

[Exporting a dashboard](#exporting-a-dashboard)  
[Importing a dashboard](#importing-a-dashboard)  
[Required user roles](#required-user-roles)  

## Exporting a dashboard
1. Go to your "Dashboards" landing page.
2. Hover over the dashboard you would like to export and click the "Export"
   button that appears to the right.

<img src="/img/chronograf/v1.6/dashboard-export.png" alt="Exporting a Chronograf dashboard" style="width:100%;max-width:912px"/>

This downloads a JSON file containing dashboard information including template variables,
cells and cell information such as the query, cell-sizing, color scheme, visualization type, etc.

> No time series data is exported with a dashboard.
> Exports include only dashboard-related information as mentioned above.

## Importing a dashboard
1. On your "Dashboards" landing page, click the "Import Dashboard" button.
2. Either drag and drop or select the JSON export file to import.
3. Click the "Upload Dashboard" button.

The newly imported dashboard will be included in your list of dashboards.

![Importing a Chronograf dashboard](/img/chronograf/v1.6/dashboard-import.gif)

### Reconciling unmatched sources
If the data sources defined in the imported dashboard JSON file do not match any of your local sources,
you will have to reconcile each of the unmatched sources during the import process.

![Reconcile unmatched sources](/img/chronograf/v1.6/dashboard-import-reconcile.png)

## Required user roles
Depending on the role of your user, there are some restrictions on importing and exporting dashboards:

| Task vs Role     | Admin | Editor | Viewer |
|------------------|:-----:|:------:|:------:|
| Export Dashboard | ✅     | ✅      | ✅      |
| Import Dashboard | ✅     | ✅      | ❌      |
