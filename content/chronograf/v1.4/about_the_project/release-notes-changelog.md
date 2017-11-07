---
title: Release Notes/Changelog
menu:
  chronograf_1_4:
    weight: 0
    parent: About the Project
---

## v1.3.10.0 [2017-10-24]
### Bug Fixes
1. Improve the copy in the retention policy edit page.
1. Fix 'Could not connect to source' bug on source creation with unsafe-ssl.
1. Fix when exporting `SHOW DATABASES` CSV has bad data.
1. Fix not-equal-to highlighting in Kapacitor Rule Builder.
1. Fix undescriptive error messages for database and retention policy creation.
1. Fix drag and drop cancel button when writing data in the data explorer.
1. Fix persistence of "SELECT AS" statements in queries.

### Features
1. Every dashboard can now have its own time range.
1. Add CSV download option in dashboard cells.
1. Implicitly prepend source urls with http://
1. Add support for graph zooming and point display on the millisecond-level.
1. Add manual refresh button for Dashboard, Data Explorer, and Host Pages.

### UI Improvements
1. Increase size of Cell Editor query tabs to reveal more of their query strings.
1. Improve appearance of Admin Page tabs on smaller screens.
1. Add cancel button to TICKscript editor.
1. Redesign dashboard naming & renaming interaction.
1. Redesign dashboard switching dropdown.

## v1.3.9.0 [2017-10-06]

### Bug Fixes
1. Fix Data Explorer disappearing query templates in dropdown.
1. Fix missing alert for duplicate db name.
1. Chronograf shows real status for Windows hosts when metrics are saved in non-default db.
1. Fix false error warning for duplicate Kapacitor name1. Fix unresponsive display options and query builder in dashboards.

### Features
1. Add `fill` options to data explorer and dashboard queries.
1. Support editing kapacitor TICKScript.
1. Introduce the TICKscript editor UI.
1. Add .csv download button to the Data Explorer.
1. Add Data Explorer InfluxQL query and location query synchronization, so queries can be shared via a URL.
1. Able to switch InfluxDB sources on a per graph basis.

### UI Improvements
1. Require a second click when deleting a dashboard cell.
1. Sort database list in Schema Explorer alphabetically.
1. Improve usability of dashboard cell context menus.
1. Move dashboard cell renaming UI into Cell Editor Overlay.
1. Prevent the legend from overlapping graphs at the bottom of the screen.
1. Add a "Plus" icon to every button with an Add or Create action for clarity and consistency.
1. Make hovering over series smoother.
1. Reduce the number of pixels per cell to one point per 3 pixels.
1. Remove tabs from Data Explorer.
1. Improve appearance of placeholder text in inputs.
1. Add ability to use "Default" values in Source Connection form.
1. Display name & port in SourceIndicator tool tip.

## v1.3.8.3 [2017-09-29]
### Bug Fixes
1. Fix duration for single value and custom time ranges.
1. Fix Data Explorer query templates dropdown disappearance.
1. Fix no alert for duplicate db name.
1. Fix unresponsive display options and query builder in dashboards.

## v1.3.8.2 [2017-09-22]
### Bug Fixes
1. Fix duration for custom time ranges.

## v1.3.8.1 [2017-09-08]

### Bug Fixes
1. Fix return code on meta nodes when raft redirects to leader.
1. Reduce points per graph to one point per 3 pixels.

## v1.3.8.0 [2017-09-07]

### Bug Fixes
1. Fix the limit of 100 alert rules on alert rules page.
1. Fix graphs when y-values are constant.
1. Fix crosshair not being removed when user leaves graph.
1. Fix inability to add kapacitor from source page on fresh install.
1. Fix DataExplorer crashing if a field property is not present in the queryConfig.
1. Fix the max y value of stacked graphs preventing display of the upper bounds of the chart.
1. Fix for delayed selection of template variables using URL query params.

### Features
1. Add prefix, suffix, scale, and other y-axis formatting for cells in dashboards.
1. Update the group by time when zooming in graphs.
1. Add the ability to link directly to presentation mode in dashboards with the `present` boolean query parameter in the URL.
1. Add the ability to select a template variable via a URL parameter.

### UI Improvements
1. Use line-stacked graph type for memory information.
1. Improve cell sizes in Admin Database tables.
1. Polish appearance of optional alert parameters in Kapacitor rule builder.
1. Add active state for Status page navbar icon.
1. Improve UX of navigation to a sub-nav item in the navbar.


## v1.3.7.0 [2017-08-23]

### Bug Fixes
 1. Chronograf now renders on Internet Explorer (IE) 11.
 1. Resolve Kapacitor config for PagerDuty via the UI.
 1. Fix Safari display issues in the Cell Editor display options.
 1. Fix uptime status on Windows hosts running Telegraf.
 1. Fix console error for 'placing prop on div'.
 1. Fix Write Data form upload button and add `onDragExit` handler.
 1. Fix missing cell type (and consequently single-stat).
 1. Fix regression and redesign drag & drop interaction.
 1. Prevent stats in the legend from wrapping line.
 1. Fix raw query editor in Data Explorer, not using selected time.

### Features
 1. Improve 'new-sources' server flag example by adding 'type' key.
 1. Add an input and validation to custom time range calendar dropdowns.
 1. Add support for selecting template variables with URL params.

### UI Improvements
 1. Show "Add Graph" button on cells with no queries.

## v1.3.6.1 [2017-08-14]
**Upgrade Note** This release (1.3.6.1) fixes a possibly data corruption issue with dashboard cells' graph types. If you upgraded to 1.3.6.0 and visited any dashboard, once you have then upgraded to this release (1.3.6.1) you will need to manually reset the graph type for every cell via the cell's caret --> Edit --> Display Options. If you upgraded directly to 1.3.6.1, you should not experience this issue.

### Bug Fixes
 1. Fix inaccessible scroll bar in Data Explorer table.
 1. Fix non-persistence of dashboard graph types.

### Features
 1. Add y-axis controls to the API for layouts.

### UI Improvements
 1. Increase screen real estate of Query Maker in the Cell Editor Overlay.

## v1.3.6.0 [2017-08-08]

### Bug Fixes
 1. Fix domain not updating in visualizations when changing time range manually.
 1. Prevent console error spam from Dygraph's synchronize method when a dashboard has only one graph.
 1. Guarantee UUID for each Alert Table key to prevent dropping items when keys overlap.

### Features
 1. Add a few time range shortcuts to the custom time range menu.
 1. Add ability to edit a dashboard graph's y-axis bounds.
 1. Add ability to edit a dashboard graph's y-axis label.

### UI Improvements
 1. Add spinner in write data modal to indicate data is being written.
 1. Fix bar graphs overlapping.
 1. Assign a series consistent coloring when it appears in multiple cells.
 1. Increase size of line protocol manual entry in Data Explorer's Write Data overlay.
 1. Improve error message when request for Status Page News Feed fails.
 1. Provide affirmative UI choice for 'auto' in DisplayOptions with new toggle-based component.

## v1.3.5.0 [2017-07-27]

### Bug Fixes
 1. Fix z-index issue in dashboard cell context menu.
 1. Clarify BoltPath server flag help text by making example the default path.
 1. Fix cell name cancel not reverting to original name.
 1. Fix typo that may have affected PagerDuty node creation in Kapacitor.
 1. Prevent 'auto' GROUP BY as option in Kapacitor rule builder when applying a function to a field.
 1. Prevent clipped buttons in Rule Builder, Data Explorer, and Configuration pages.
 1. Fix JWT for the write path.
 1. Disentangle client Kapacitor rule creation from Data Explorer query creation.

### Features
 1. View server generated TICKscripts.
 1. Add the ability to select Custom Time Ranges in the Hostpages, Data Explorer, and Dashboards.
 1. Clarify BoltPath server flag help text by making example the default path
 1. Add shared secret JWT authorization to InfluxDB.
 1. Add Pushover alert support.
 1. Restore all supported Kapacitor services when creating rules, and add most optional message parameters.

### UI Improvements
 1. Polish alerts table in status page to wrap text less.
 1. Specify that version is for Chronograf on Configuration page.
 1. Move custom time range indicator on cells into corner when in presentation mode.
 1. Highlight legend "Snip" toggle when active.

## v1.3.4.0 [2017-07-10]

### Bug Fixes
 1. Disallow writing to \_internal in the Data Explorer.
 1. Add more than one color to Line+Stat graphs.
 1. Fix updating Retention Policies in single-node InfluxDB instances.
 1. Lock the width of Template Variable dropdown menus to the size of their longest option.

### Features
 1. Add Auth0 as a supported OAuth2 provider.
 1. Add ability to add custom links to User menu via server CLI or ENV vars.
 1. Allow users to configure custom links on startup that will appear under the User menu in the sidebar.
 1. Add support for Auth0 organizations.
 1. Allow users to configure InfluxDB and Kapacitor sources on startup.

### UI Improvements
 1. Redesign Alerts History table on Status Page to have sticky headers.
 1. Refresh Template Variable values on Dashboard page load.
 1. Display current version of Chronograf at the bottom of Configuration page.
 1. Redesign Dashboards table and sort them alphabetically.
 1. Bring design of navigation sidebar in line with Branding Documentation.

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
