---
title: Release Notes/Changelog
menu:
  chronograf_1_3:
    weight: 0
    parent: About the Project
---

## v1.3.3.0 [2017-06-19]

### Bug Fixes
1. Prevent legend from flowing over window bottom bound
1. Prevent Kapacitor configurations from having the same name
1. Limit Kapacitor configuration names to 33 characters to fix display bug

### Features
1. Synchronize vertical crosshair at same time across all graphs in a dashboard
1. Add automatic `GROUP BY (time)` functionality to dashboards
1. Add a Status Page with Recent Alerts bar graph, Recent Alerts table, News Feed, and Getting Started widgets

### UI Improvements
1. When dashboard time range is changed, reset graphs that are zoomed in
1. [Bar graph](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#bar) option added to dashboard
1. Redesign source management table to be more intuitive
1. Redesign [Line + Single Stat](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#line-stat) cells to appear more like a sparkline, and improve legibility


## v1.3.2.0 [2017-06-05]

### Bug Fixes
1. Update the query config's field ordering to always match the input query
1. Allow users to add functions to existing Kapacitor rules
1. Fix logout menu item regression
1. Fix InfluxQL parsing with multiple tag values for a tag key
1. Fix load localStorage and warning UX on fresh Chronograf install
1. Show submenus when the alert notification is present

### Features
  1. Add UI to the Data Explorer for [writing data to InfluxDB](/chronograf/v1.3/guides/transition-web-admin-interface/#writing-data)

### UI Improvements
  1. Make the enter and escape keys perform as expected when renaming dashboards
  1. Improve copy on the Kapacitor configuration page
  1. Reset graph zoom when the user selects a new time range
  1. Upgrade to new version of Influx Theme, and remove excess stylesheets
  1. Replace the user icon with a solid style
  1. Disable query save in cell editor mode if the query does not have a database, measurement, and field
  1. Improve UX of applying functions to fields in the query builder
  
## v1.3.1.0 [2017-05-22]

### Release notes

In versions 1.3.1+, installing a new version of Chronograf automatically clears the localStorage settings.

### Bug Fixes
  1. Fix infinite spinner when `/chronograf` is a [basepath](/chronograf/v1.3/administration/configuration/#p-basepath)
  1. Remove the query templates dropdown from dashboard cell editor mode
  1. Fix the backwards sort arrows in table column headers
  1. Make the logout button consistent with design
  1. Fix the loading spinner on graphs
  1. Filter out any template variable values that are empty, whitespace, or duplicates
  1. Allow users to click the add query button after selecting singleStat as the [visualization type](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-visualization-types-does-chronograf-support)
  1. Add a query for windows uptime - thank you, @brianbaker!

### Features
  1. Add log [event handler](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf) - thank you, @mpchadwick!
  1. Update Go (golang) vendoring to dep and committed vendor directory
  1. Add autocomplete functionality to [template variable](/chronograf/v1.3/guides/dashboard-template-variables/) dropdowns

### UI Improvements
  1. Refactor scrollbars to support non-webkit browsers
  1. Increase the query builder's default height in cell editor mode and in the data explorer
  1. Make the [template variables](/chronograf/v1.3/guides/dashboard-template-variables/) manager more space efficient
  1. Add page spinners to pages that did not have them
  1. Denote which source is connected in the sources table
  1. Use milliseconds in the InfluxDB dashboard instead of nanoseconds
  1. Notify users when local settings are cleared

## v1.3.0 [2017-05-09]

### Bug Fixes
  1. Fix the link to home when using the [`--basepath` option](/chronograf/v1.3/administration/configuration/#p-basepath)
  1. Remove the notification to login on the login page
  1. Support queries that perform math on functions
  1. Prevent the creation of blank template variables
  1. Ensure thresholds for Kapacitor Rule Alerts appear on page load
  1. Update the Kapacitor configuration page when the configuration changes
  1. Fix Authentication when using Chronograf with a set [basepath](/chronograf/v1.3/administration/configuration/#p-basepath)
  1. Show red indicator on Hosts Page for an offline host
  1. Support escaping from presentation mode in Safari
  1. Re-implement level colors on the alerts page
  1. Fix router bug introduced by upgrading to react-router v3.0
  1. Show legend on [Line+Stat](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#line-stat) visualization type
  1. Prevent queries with `:dashboardTime:` from breaking the query builder

### Features
  1. Add line-protocol proxy for InfluxDB/InfluxEnterprise Cluster data sources
  1. Add `:dashboardTime:` to support cell-specific time ranges on dashboards
  1. Add support for enabling and disabling [TICKscripts that were created outside Chronograf](/chronograf/v1.3/guides/advanced-kapacitor/#tickscript-management)
  1. Allow users to delete Kapacitor configurations

### UI Improvements
  1. Save user-provided relative time ranges in cells
  1. Improve how cell legends and options appear on dashboards 
  1. Combine the measurements and tags columns in the Data Explorer and implement a new design for applying functions to fields.
  1. Normalize the terminology in Chronograf
  1. Make overlays full-screen
  1. Change the default global time range to past 1 hour
  1. Add the Source Indicator icon to the Configuration and Admin pages
  
> See Chronograf's [CHANGELOG](https://github.com/influxdata/chronograf/blob/master/CHANGELOG.md) on GitHub for information about the 1.2.0-beta releases.