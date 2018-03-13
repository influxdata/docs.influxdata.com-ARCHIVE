---
title: What's new in Chronograf 1.4
menu:
  chronograf_1_4:
    weight: 10
    parent: About the Project
---
This page includes highlights of new and enhanced functionality in Chronograf. See the [Release notes/changelog](/chronograf/v1.4/about_the_project/release-notes-changelog/) for a complete listing of new features, changes, and bug fixes.

## Chronograf 1.4.3

* Chart annotations

## Chronograf 1.4.2

* Rename **Create Alerts** to **Manage Tasks** and page redesign to improve usability.
* Dashboards
  - Legends for graphs can optionally display
  - Smarter loading of dashboards. When dashboards are used, only visible graphs load and refresh. Graphs that you cannot see become dormant, improving performance and reducing strain on backend databses.
  - Visualizations
    - Set prefixes and suffixes on Single Stat and Gauge visualizations.
- Alerts
  - Alert Rules
    - Test alert handler configurations.
    - Alert Rule Builder
      - Add multiple alert nodes per rule.
  - TICKscript editor
    - Improved log display for easier viewing and debugging.
    - Easier to save TICKscript changes.


## Chronograf 1.4.1

* Allow multiple even handlers per rule.
* Add "Send Test Alert" button to test your Kapacitor alert configurations.
* Hosts List
  - Add "auto-refresh" widget.
* Allow users to delete themselves.
* Chronograf Admin
  - Add All Users page, visible only to SuperAdmins.
  - **Org Mappings**
    - Control new user assignments to organizations
    - Specify OAuth 2.0 providers, provider organizations, and organization access.
* Clearer terminology for InfluxDB and Kapacitor connections.
* Separate saving TICKscripts from existing editing page.
* Cell Editor Overlay: Add keyboard shortcuts for Save (`⌘ + Enter`) and Cancel (`Escape`).

## Chronograf 1.4.0

- Chronograf Admin
  - Support for organizations and role-based access control.
  - Support authentication and authorization using OAuth 2.0 providers.
  -
