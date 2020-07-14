---
title: Importing and exporting Chronograf dashboards
description: A step-by-step guide that walks through both exporting and importing Chrongraf dashboards.
menu:
  chronograf_1_8:
    weight: 120
    parent: Administration
---

Chronograf makes it easy export and import dashboards. Recreate robust dashboards without having to manually configure them from the ground up.

[Required user roles](#required-user-roles)  
[Export a dashboard](#export-a-dashboard)  
[Import a dashboard](#import-a-dashboard)  

## Required user roles

All users can export a dashboard. To import a dashboard, a user must have an Admin or Editor role.

| Task vs Role     | Admin | Editor | Viewer |
|------------------|:-----:|:------:|:------:|
| Export Dashboard | ✅     | ✅      | ✅   |
| Import Dashboard | ✅     | ✅      | ❌   |

## Export a dashboard

1. On the Dashboards page, hover over the dashboard you want to export, and then click the **Export**
   button on the right.

    <img src="/img/chronograf/v1.8/dashboard-export.png" alt="Exporting a Chronograf dashboard" style="width:100%;max-width:912px"/>

    This downloads a JSON file containing dashboard information including template variables,
cells and cell information such as the query, cell-sizing, color scheme, visualization type, etc.

    > No time series data is exported with a dashboard.
    > Exports include only dashboard-related information as mentioned above.

2. Rename the `.json` extention to `.dashboard`, and save the dashboard file in the `/usr/share/chronograf/canned` directory.

## Import a dashboard

1. On the Dashboards page, click the **Import Dashboard** button.
2. Either drag and drop or select the `.dashboard` file to import.
3. Click the **Upload Dashboard** button.

The newly imported dashboard is included in your list of dashboards.

![Importing a Chronograf dashboard](/img/chronograf/v1.8/dashboard-import.gif)

### Reconciling unmatched sources

If the data sources defined in the imported dashboard file do not match any of your local sources, reconcile each of the unmatched sources during the import process, and then click **Done**.

![Reconcile unmatched sources](/img/chronograf/v1.8/dashboard-import-reconcile.png)

