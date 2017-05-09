---
title: Release Notes/Changelog
menu:
  chronograf_1_3:
    weight: 0
    parent: About the Project
---

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
  
> See Chronograf's [CHANGELOG](https://github.com/influxdata/chronograf/blob/master/CHANGELOG.md) on GitHub for information about the 1.2.0-beta releases.