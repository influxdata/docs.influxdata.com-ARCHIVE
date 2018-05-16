---
title: Chronograf 1.5 release notes
menu:
  chronograf_1_5:
    name: Release notes
    weight: 10
    parent: About the project
---

## v1.5.0.0 [2018-05-16]

### Features

* Add table view as a visualization type.
* Add default retention policy field as option in source configuration for use in querying hosts from Host List page and Host pages.
* Add support for PagerDuty v2 alert endpoints in UI.
* Add support for OpsGenie v2 alert endpoints in UI.
* Add support for Kafka alert endpoint in UI to configure and create alert handlers.
* Add support for disabling Kapacitor services.
* Add support for multiple Slack alert endpoint configurations in the UI.

### User interface improvements

* Notify user when a dashboard cell is added, removed, or cloned.
* Fix Template Variables Control Bar to top of dashboard page.
* Remove extra click when creating dashboard cell.
* Reduce font sizes in dashboards for increased space efficiency.
* Add overlay animation to Template Variables Manager.
* Display 'No results' on cells without results.
* Disable template variables for non-editing users.
* YAxisLabels in Dashboard Graph Builder not showing until graph is redrawn.
* Ensure table views have a consistent user experience between Google Chrome and Mozilla Firefox.
* Change AutoRefresh interval to paused.
* Get cloned cell name for notification from cloned cell generator function.
* Improve load time for Host page.
* Show Kapacitor batch point info in log panel.

### Bug fixes

* Allow user to select TICKscript editor with mouse-click.
* Change color when value is equal to or greater than threshold value.
* Fix base path for Kapacitor logs.
* Fix logout when using `basepath` and simplify `basepath` usage (deprecates `PREFIX_ROUTES`).
* Fix graphs in alert rule builder for queries that include `groupBy`.
* Fix auto not showing in the group by dropdown and explorer getting disconnected.
* Display y-axis label on initial graph load.
* Fix not being able to change the source in the CEO display.
* Fix only the selected template variable value getting loaded.
* Fix Generic OAuth bug for GitHub Enterprise where the principal was incorrectly being checked for email being Primary and Verified.
* Fix missing icons when using basepath.
* Limit max-width of TICKScript editor.
* Fix naming of new TICKScripts.
* Fix data explorer query error reporting regression.
* Fix Kapacitor Logs fetch regression.

## v1.4.4.1 [2018-04-16]

### Bug fixes

* Snapshot all db struct types in migration files.

## v1.4.4.0 [2018-04-13]

### Features

* Add support for RS256/JWKS verification, support for `id_token` parsing (as in ADFS).
* Add ability to set a color palette for Line, Stacked, Step-Plot, and Bar graphs.
* Add ability to clone dashboards.
* Change `:interval:` to represent a raw InfluxQL duration value.
* Add paginated measurements API to server.
* Data Explorer measurements can be toggled open.

### UI improvements

* New dashboard cells appear at bottom of layout and assume the size of the most common cell.
* Standardize delete confirmation interactions.
* Standardize Save and Cancel interactions.
* Improve cell renaming.

### Bug fixes

* Always save template variables on first edit.
* Query annotations at auto-refresh interval.
* Display link to configure Kapacitor on Alerts Page if no configured Kapacitor.
* Fix saving of new TICKscripts.
* Fix appearance of cell y-axis titles.
* Only add `stateChangesOnly` to new rules.
* Fix 500s when deleting organizations.
* Fixes issues with providing regexp in query.
* Ensure correct basepath prefix in URL pathname when passing InfluxQL query param to Data Explorer.
* Fix type error bug in Kapacitor Alert Config page and persist deleting of team and recipient in OpsGenieConfig.
* Fixes errors caused by switching query tabs in CEO.
* Only send threshold value to parent on blur.
* Require that emails on GitHub & Generic OAuth2 principals be verified & primary, if those fields are provided.
* Send notification when retention policy (rp) creation returns a failure.
* Show valid time in custom time range when now is selected.
* Default to zero for gauges.

## v1.4.3.3 [2018-04-12]

### Bug Fixes

* Require that emails on GitHub & Generic OAuth2 principals be verified & primary if those fields are provided.

## v1.4.3.1 [2018-04-02]

### Bug fixes

* Fixes template variable editing not allowing saving.
* Save template variables on first edit.
* Fix template variables not loading all values.


## v1.4.3.0 [2018-3-28]

### Features

* Add unsafe SSL to Kapacitor UI configuration
* Add server flag to grant SuperAdmin status to users authenticating from a specific Auth0 organization

### UI Improvements

* Redesign system notifications

### Bug Fixes

* Fix Heroku OAuth 2.0 provider support
* Fix error reporting in Data Explorer
* Fix Okta OAuth 2.0 provider support
* Change hover text on delete mappings confirmation button to 'Delete'
* Automatically add graph type 'line' to any graph missing a type
* Fix hanging browser on docker host dashboard
* Fix Kapacitor Rules task enabled checkboxes to only toggle exactly as clicked
* Prevent Multi-Select Dropdown in InfluxDB Admin Users and Roles tabs from losing selection state
* Fix intermittent missing fill from graphs
* Support custom time range in annotations API wrapper

## v1.4.2.5 [2018-04-12]

### Bug Fixes

* Require that emails on GitHub & Generic OAuth2 principals be verified & primary if those fields are provided.

## v1.4.2.3 [2018-03-08]

### Bug fixes

*  Include URL in Kapacitor connection creation requests.

## v1.4.2.1 [2018-02-28]

### Features

* Prevent execution of queries in cells that are not in view on the Dashboard page.
* Add an optional persistent legend which can toggle series visibility to dashboard cells.
* Allow user to annotate graphs via UI or API.

### UI improvements

* Add ability to set a prefix and suffix on Single Stat and Gauge cell types.
* Rename 'Create Alerts' page to 'Manage Tasks'; redesign page to improve clarity of purpose.

### Bug fixes

* Save only selected template variable values into dashboards for non-CSV template variables.
* Use Generic APIKey for OAuth2 group lookup.
* Fix bug in which resizing any cell in a dashboard causes a Gauge cell to resize.
* Don't sort Single Stat & Gauge thresholds when editing threshold values.
* Maintain y-axis labels in dashboard cells.
* Deprecate `--new-sources` in CLI.

## v1.4.1.5 [2018-04-12]

### Bug Fixes

* Require that emails on GitHub & Generic OAuth2 principals be verified & primary if those fields are provided.

## v1.4.1.3 [2018-02-14]

### Bug fixes

* Allow self-signed certificates for InfluxDB Enterprise meta nodes.

## v1.4.1.2 [2018-02-13]

### Bug fixes

* Respect `basepath` when fetching server API routes.
* Set default `tempVar` `:interval`: with Data Explorer CSV download call.
* Display series with value of `0` in a cell legend.

## v1.4.1.1 [2018-02-12]

### Features

- Allow multiple event handlers per rule.
- Add "Send Test Alert" button to test Kapacitor alert configurations.
- Link to Kapacitor config panel from Alert Rule builder.
- Add auto-refresh widget to Hosts List page.
- Upgrade to Go 1.9.4 and Node 6.12.3.
- Allow users to delete themselves.
- Add All Users page, visible only to SuperAdmins.
- Introduce `chronoctl` binary for user CRUD operations.
- Introduce mappings to allow control over new user organization assignments.

### UI improvements

- Clarify terminology regarding InfluxDB and Kapacitor connections.
- Separate saving TICKscript from exiting editor page.
- Enable Save (`⌘ + Enter`) and Cancel (`Escape`) hotkeys in Cell Editor Overlay.
- Enable customization of Single Stat "Base Color".

### Bug fixes

- Fix TICKscript Sensu alerts when no GROUP BY tags selected.
- Display 200 most-recent TICKscript log messages; prevent overlapping.
- Add `TO` to kapacitor SMTP config; improve config update error messages.
- Remove CLI options from `sysvinit` service file.
- Remove CLI options from `systemd` service file.
- Fix disappearance of text in Single Stat graphs during editing.
- Redirect to Alerts page after saving Alert Rule.

## v1.4.0.3 [2018-4-12]

### Bug Fixes

* Require that emails on GitHub & Generic OAuth2 principals be verified & primary if those fields are provided.

## v1.4.0.1 [2018-1-9]

### Features

* Add separate CLI flag for canned sources, Kapacitors, dashboards, and organizations.
* Add Telegraf interval configuration.

### Bug fixes

- Allow insecure (self-signed) certificates for Kapacitor and InfluxDB.
- Fix positioning of custom time indicator.

## v1.4.0.0 [2017-12-22]

### Features

* Add support for multiple organizations, multiple users with role-based access control, and private instances.
* Add Kapacitor logs to the TICKscript editor
* Add time shift feature to DataExplorer and Dashboards
* Add auto group by time to Data Explorer
* Support authentication for Enterprise Meta Nodes
* Add Boolean thresholds for kapacitor threshold alerts
* Update kapacitor alerts to cast to float before sending to influx
* Allow override of generic oauth2 keys for email

### UI improvements

* Introduce customizable Gauge visualization type for dashboard cells
* Improve performance of Hosts, Alert History, and TICKscript logging pages when there are many items to display
* Add filtering by name to Dashboard index page
* Improve performance of hoverline rendering

### Bug fixes

* Fix `.jsdep` step fails when LDFLAGS is exported
* Fix logscale producing console errors when only one point in graph
* Fix 'Cannot connect to source' false error flag on Dashboard page
* Add fractions of seconds to time field in csv export
* Fix Chronograf requiring Telegraf's CPU and system plugins to ensure that all Apps appear on the HOST LIST page.
* Fix template variables in dashboard query building.
* Fix several kapacitor alert creation panics.
* Add shadow-utils to RPM release packages
* Source extra command line options from defaults file
* After CREATE/DELETE queries, refresh list of databases in Data Explorer
* Visualize CREATE/DELETE queries with Table view in Data Explorer
* Include tag values alongside measurement name in Data Explorer result tabs
* Redesign cell display options panel
* Fix queries that include regex, numbers and wildcard
* Fix apps on hosts page from parsing tags with null values
* Fix updated Dashboard names not updating dashboard list
* Fix create dashboard button
* Fix default y-axis labels not displaying properly
* Gracefully scale Template Variables Manager overlay on smaller displays
* Fix Influx Enterprise users from deletion in race condition
* Fix oauth2 logout link not having basepath
* Fix supplying a role link to sources that do not have a metaURL
* Fix hoverline intermittently not rendering
* Update MySQL pre-canned dashboard to have query derivative correctly

## v1.3.10.0 [2017-10-24]

### Bug fixes

* Improve the copy in the retention policy edit page.
* Fix `Could not connect to source` bug on source creation with unsafe-ssl.
* Fix when exporting `SHOW DATABASES` CSV has bad data.
* Fix not-equal-to highlighting in Kapacitor Rule Builder.
* Fix undescriptive error messages for database and retention policy creation.
* Fix drag and drop cancel button when writing data in the data explorer.
* Fix persistence of "SELECT AS" statements in queries.

### Features

* Every dashboard can now have its own time range.
* Add CSV download option in dashboard cells.
* Implicitly prepend source URLs with `http://`
* Add support for graph zooming and point display on the millisecond-level.
* Add manual refresh button for Dashboard, Data Explorer, and Host Pages.

### UI improvements

* Increase size of Cell Editor query tabs to reveal more of their query strings.
* Improve appearance of Admin Page tabs on smaller screens.
* Add cancel button to TICKscript editor.
* Redesign dashboard naming & renaming interaction.
* Redesign dashboard switching dropdown.

## v1.3.9.0 [2017-10-06]

### Bug fixes

* Fix Data Explorer disappearing query templates in dropdown.
* Fix missing alert for duplicate db name.
* Chronograf shows real status for Windows hosts when metrics are saved in non-default db.
* Fix false error warning for duplicate Kapacitor name
* Fix unresponsive display options and query builder in dashboards.

### Features

* Add fill options to Data Explorer and dashboard queries.
* Support editing kapacitor TICKScript.
* Introduce the TICKscript editor UI.
* Add CSV download button to the Data Explorer.
* Add Data Explorer InfluxQL query and location query synchronization, so queries can be shared using a URL.
* Able to switch InfluxDB sources on a per graph basis.

### UI improvements

* Require a second click when deleting a dashboard cell.
* Sort database list in Schema Explorer alphabetically.
* Improve usability of dashboard cell context menus.
* Move dashboard cell renaming UI into Cell Editor Overlay.
* Prevent the legend from overlapping graphs at the bottom of the screen.
* Add a "Plus" icon to every button with an Add or Create action for clarity and consistency.
* Make hovering over series smoother.
* Reduce the number of pixels per cell to one point per 3 pixels.
* Remove tabs from Data Explorer.
* Improve appearance of placeholder text in inputs.
* Add ability to use "Default" values in Source Connection form.
* Display name & port in SourceIndicator tool tip.

## v1.3.8.3 [2017-09-29]

### Bug fixes

* Fix duration for single value and custom time ranges.
* Fix Data Explorer query templates dropdown disappearance.
* Fix no alert for duplicate db name.
* Fix unresponsive display options and query builder in dashboards.

## v1.3.8.2 [2017-09-22]

### Bug fixes

* Fix duration for custom time ranges.

## v1.3.8.1 [2017-09-08]

### Bug fixes

* Fix return code on meta nodes when raft redirects to leader.
* Reduce points per graph to one point per 3 pixels.

## v1.3.8.0 [2017-09-07]

### Bug fixes

* Fix the limit of 100 alert rules on alert rules page.
* Fix graphs when y-values are constant.
* Fix crosshair not being removed when user leaves graph.
* Fix inability to add kapacitor from source page on fresh install.
* Fix DataExplorer crashing if a field property is not present in the queryConfig.
* Fix the max y value of stacked graphs preventing display of the upper bounds of the chart.
* Fix for delayed selection of template variables using URL query params.

### Features

* Add prefix, suffix, scale, and other y-axis formatting for cells in dashboards.
* Update the group by time when zooming in graphs.
* Add the ability to link directly to presentation mode in dashboards with the `present` Boolean query parameter in the URL.
* Add the ability to select a template variable via a URL parameter.

### UI improvements

* Use line-stacked graph type for memory information.
* Improve cell sizes in Admin Database tables.
* Polish appearance of optional alert parameters in Kapacitor rule builder.
* Add active state for Status page navbar icon.
* Improve UX of navigation to a sub-nav item in the navbar.


## v1.3.7.0 [2017-08-23]

### Bug fixes

 * Chronograf now renders on Internet Explorer (IE) 11.
 * Resolve Kapacitor config for PagerDuty via the UI.
 * Fix Safari display issues in the Cell Editor display options.
 * Fix uptime status on Windows hosts running Telegraf.
 * Fix console error for 'placing prop on div'.
 * Fix Write Data form upload button and add `onDragExit` handler.
 * Fix missing cell type (and consequently single-stat).
 * Fix regression and redesign drag & drop interaction.
 * Prevent stats in the legend from wrapping line.
 * Fix raw query editor in Data Explorer, not using selected time.

### Features

 * Improve 'new-sources' server flag example by adding 'type' key.
 * Add an input and validation to custom time range calendar dropdowns.
 * Add support for selecting template variables with URL params.

### UI improvements
 * Show "Add Graph" button on cells with no queries.

## v1.3.6.1 [2017-08-14]

**Upgrade Note** This release (1.3.6.1) fixes a possibly data corruption issue with dashboard cells' graph types. If you upgraded to 1.3.6.0 and visited any dashboard, once you have then upgraded to this release (1.3.6.1) you will need to manually reset the graph type for every cell via the cell's caret --> Edit --> Display Options. If you upgraded directly to 1.3.6.1, you should not experience this issue.

### Bug fixes

 * Fix inaccessible scroll bar in Data Explorer table.
 * Fix non-persistence of dashboard graph types.

### Features

 * Add y-axis controls to the API for layouts.

### UI improvements

 * Increase screen real estate of Query Maker in the Cell Editor Overlay.

## v1.3.6.0 [2017-08-08]

### Bug fixes

 * Fix domain not updating in visualizations when changing time range manually.
 * Prevent console error spam from Dygraph's synchronize method when a dashboard has only one graph.
 * Guarantee UUID for each Alert Table key to prevent dropping items when keys overlap.

### Features

 * Add a few time range shortcuts to the custom time range menu.
 * Add ability to edit a dashboard graph's y-axis bounds.
 * Add ability to edit a dashboard graph's y-axis label.

### UI improvements
 * Add spinner in write data modal to indicate data is being written.
 * Fix bar graphs overlapping.
 * Assign a series consistent coloring when it appears in multiple cells.
 * Increase size of line protocol manual entry in Data Explorer's Write Data overlay.
 * Improve error message when request for Status Page News Feed fails.
 * Provide affirmative UI choice for 'auto' in DisplayOptions with new toggle-based component.

## v1.3.5.0 [2017-07-27]

### Bug fixes

 * Fix z-index issue in dashboard cell context menu.
 * Clarify BoltPath server flag help text by making example the default path.
 * Fix cell name cancel not reverting to original name.
 * Fix typo that may have affected PagerDuty node creation in Kapacitor.
 * Prevent 'auto' GROUP BY as option in Kapacitor rule builder when applying a function to a field.
 * Prevent clipped buttons in Rule Builder, Data Explorer, and Configuration pages.
 * Fix JWT for the write path.
 * Disentangle client Kapacitor rule creation from Data Explorer query creation.

### Features

 * View server generated TICKscripts.
 * Add the ability to select Custom Time Ranges in the Hostpages, Data Explorer, and Dashboards.
 * Clarify BoltPath server flag help text by making example the default path
 * Add shared secret JWT authorization to InfluxDB.
 * Add Pushover alert support.
 * Restore all supported Kapacitor services when creating rules, and add most optional message parameters.

### UI improvements

 * Polish alerts table in status page to wrap text less.
 * Specify that version is for Chronograf on Configuration page.
 * Move custom time range indicator on cells into corner when in presentation mode.
 * Highlight legend "Snip" toggle when active.

## v1.3.4.0 [2017-07-10]

### Bug fixes
 * Disallow writing to \_internal in the Data Explorer.
 * Add more than one color to Line+Stat graphs.
 * Fix updating Retention Policies in single-node InfluxDB instances.
 * Lock the width of Template Variable dropdown menus to the size of their longest option.

### Features

 * Add Auth0 as a supported OAuth2 provider.
 * Add ability to add custom links to User menu via server CLI or ENV vars.
 * Allow users to configure custom links on startup that will appear under the User menu in the sidebar.
 * Add support for Auth0 organizations.
 * Allow users to configure InfluxDB and Kapacitor sources on startup.

### UI improvements

 * Redesign Alerts History table on Status Page to have sticky headers.
 * Refresh Template Variable values on Dashboard page load.
 * Display current version of Chronograf at the bottom of Configuration page.
 * Redesign Dashboards table and sort them alphabetically.
 * Bring design of navigation sidebar in line with Branding Documentation.

## v1.3.3.0 [2017-06-19]

### Bug fixes

  * Prevent legend from flowing over window bottom bound
  * Prevent Kapacitor configurations from having the same name
  * Limit Kapacitor configuration names to 33 characters to fix display bug

### Features

  * Synchronize vertical crosshair at same time across all graphs in a dashboard
  * Add automatic `GROUP BY (time)` functionality to dashboards
  * Add a Status Page with Recent Alerts bar graph, Recent Alerts table, News Feed, and Getting Started widgets

### UI improvements

  * When dashboard time range is changed, reset graphs that are zoomed in
  * [Bar graph](/chronograf/latest/troubleshooting/frequently-asked-questions/#bar) option added to dashboard
  * Redesign source management table to be more intuitive
  * Redesign [Line + Single Stat](/chronograf/latest/troubleshooting/frequently-asked-questions/#line-stat) cells to appear more like a sparkline, and improve legibility


## v1.3.2.0 [2017-06-05]

### Bug fixes

  * Update the query config's field ordering to always match the input query
  * Allow users to add functions to existing Kapacitor rules
  * Fix logout menu item regression
  * Fix InfluxQL parsing with multiple tag values for a tag key
  * Fix load localStorage and warning UX on fresh Chronograf install
  * Show submenus when the alert notification is present

### Features

  * Add UI to the Data Explorer for [writing data to InfluxDB](/chronograf/latest/guides/transition-web-admin-interface/#writing-data)

### UI improvements

  * Make the enter and escape keys perform as expected when renaming dashboards
  * Improve copy on the Kapacitor configuration page
  * Reset graph zoom when the user selects a new time range
  * Upgrade to new version of Influx Theme, and remove excess stylesheets
  * Replace the user icon with a solid style
  * Disable query save in cell editor mode if the query does not have a database, measurement, and field
  * Improve UX of applying functions to fields in the query builder

## v1.3.1.0 [2017-05-22]

### Release notes

In versions 1.3.1+, installing a new version of Chronograf automatically clears the localStorage settings.

### Bug fixes

  * Fix infinite spinner when `/chronograf` is a [basepath](/chronograf/latest/administration/configuration/#p-basepath)
  * Remove the query templates dropdown from dashboard cell editor mode
  * Fix the backwards sort arrows in table column headers
  * Make the logout button consistent with design
  * Fix the loading spinner on graphs
  * Filter out any template variable values that are empty, whitespace, or duplicates
  * Allow users to click the add query button after selecting singleStat as the [visualization type](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-visualization-types-does-chronograf-support)
  * Add a query for windows uptime - thank you, @brianbaker!

### Features

  * Add log [event handler](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf) - thank you, @mpchadwick!
  * Update Go (golang) vendoring to dep and committed vendor directory
  * Add autocomplete functionality to [template variable](/chronograf/latest/guides/dashboard-template-variables/) dropdowns

### UI improvements

  * Refactor scrollbars to support non-webkit browsers
  * Increase the query builder's default height in cell editor mode and in the data explorer
  * Make the [template variables](/chronograf/latest/guides/dashboard-template-variables/) manager more space efficient
  * Add page spinners to pages that did not have them
  * Denote which source is connected in the sources table
  * Use milliseconds in the InfluxDB dashboard instead of nanoseconds
  * Notify users when local settings are cleared

## v1.3.0 [2017-05-09]

### Bug fixes

  * Fix the link to home when using the [`--basepath` option](/chronograf/latest/administration/configuration/#p-basepath)
  * Remove the notification to login on the login page
  * Support queries that perform math on functions
  * Prevent the creation of blank template variables
  * Ensure thresholds for Kapacitor Rule Alerts appear on page load
  * Update the Kapacitor configuration page when the configuration changes
  * Fix Authentication when using Chronograf with a set [basepath](/chronograf/latest/administration/configuration/#p-basepath)
  * Show red indicator on Hosts Page for an offline host
  * Support escaping from presentation mode in Safari
  * Re-implement level colors on the alerts page
  * Fix router bug introduced by upgrading to react-router v3.0
  * Show legend on [Line+Stat](/chronograf/latest/troubleshooting/frequently-asked-questions/#line-stat) visualization type
  * Prevent queries with `:dashboardTime:` from breaking the query builder

### Features

  * Add line-protocol proxy for InfluxDB/InfluxEnterprise Cluster data sources
  * Add `:dashboardTime:` to support cell-specific time ranges on dashboards
  * Add support for enabling and disabling [TICKscripts that were created outside Chronograf](/chronograf/latest/guides/advanced-kapacitor/#tickscript-management)
  * Allow users to delete Kapacitor configurations

### UI improvements

  * Save user-provided relative time ranges in cells
  * Improve how cell legends and options appear on dashboards
  * Combine the measurements and tags columns in the Data Explorer and implement a new design for applying functions to fields.
  * Normalize the terminology in Chronograf
  * Make overlays full-screen
  * Change the default global time range to past 1 hour
  * Add the Source Indicator icon to the Configuration and Admin pages

> See Chronograf's [CHANGELOG](https://github.com/influxdata/chronograf/blob/master/CHANGELOG.md) on GitHub for information about the 1.2.0-beta releases.
