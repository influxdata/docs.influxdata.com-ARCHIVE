---
title: Release Notes/Changelog
menu:
  kapacitor_1_3:
    weight: 0
    parent: about_the_project
---

## v1.3.0 [2017-05-16]

### Release Notes

This release has two major features.

1. Addition of scraping and discovering for Prometheues style data collection.
2. Updates to the Alert Topic system

Here is a quick example of how to configure Kapacitor to scrape discovered targets.
First configure a discoverer, here we use the file-discovery discoverer.
Next configure a scraper to use that discoverer.

```
# Configure file discoverer
[[file-discovery]]
 enabled = true
 id = "discover_files"
 refresh-interval = "10s"
 ##### This will look for prometheus json files
 ##### File format is here https://prometheus.io/docs/operating/configuration/#%3Cfile_sd_config%3E
 files = ["/tmp/prom/*.json"]

# Configure scraper 
[[scraper]]
 enabled = true
 name = "node_exporter"
 discoverer-id = "discover_files"
 discoverer-service = "file-discovery"
 db = "prometheus"
 rp = "autogen"
 type = "prometheus"
 scheme = "http"
 metrics-path = "/metrics"
 scrape-interval = "2s"
 scrape-timeout = "10s"
```

Add the above snippet to your kapacitor.conf file.

Create the below snippet as the file `/tmp/prom/localhost.json`:

```
[{
 "targets": ["localhost:9100"]
}]
```

Start the Prometheues node_exporter locally.

Now startup Kapacitor and it will discover the localhost:9100 node_exporter target and begin scrapping it for metrics.
For more details on the scraping and discovery systems see the full documentation [here](https://docs.influxdata.com/kapacitor/v1.3/scraping).

The second major feature with this release, are changes to the alert topic system.
The previous release introduce this new system as a technical preview, with this release the alerting service has been simplified.
Alert handlers now only ever have a single action and belong to a single topic.

The handler defintion has been simplified as a result.
Here are some example alert handlers using the new structure:

```yaml
id: my_handler
kind: pagerDuty
options:
  serviceKey: XXX
```

```yaml
id: aggregate_by_1m
kind: aggregate
options:
  interval: 1m
  topic: aggregated
```

```yaml
id: publish_to_system
kind: publish
options:
  topics: [ system ]
```

To define a handler now you must specify which topic the handler belongs to.
For example to define the above aggregate handler on the system topic use this command:

```sh
kapacitor define-handler system aggregate_by_1m.yaml
```

For more details on the alerting system see the full documentation [here](https://docs.influxdata.com/kapacitor/v1.3/alerts).


### Features

- [#1299](https://github.com/influxdata/kapacitor/pull/1299): Allowing sensu handler to be specified 
- [#1284](https://github.com/influxdata/kapacitor/pull/1284): Add type signatures to Kapacitor functions.
- [#1203](https://github.com/influxdata/kapacitor/issues/1203): Add `isPresent` operator for verifying whether a value is present (part of [#1284](https://github.com/influxdata/kapacitor/pull/1284)).
- [#1354](https://github.com/influxdata/kapacitor/pull/1354): Add Kubernetes scraping support.
- [#1359](https://github.com/influxdata/kapacitor/pull/1359): Add groupBy exclude and Add dropOriginalFieldName to flatten.
- [#1360](https://github.com/influxdata/kapacitor/pull/1360): Add KapacitorLoopback node to be able to send data from a task back into Kapacitor.
- [#117](https://github.com/influxdata/kapacitor/issues/117): Add headers to alert POST requests.
- [#1322](https://github.com/influxdata/kapacitor/pull/1322): TLS configuration in Slack service for Mattermost compatibility
- [#1330](https://github.com/influxdata/kapacitor/issues/1330): Generic HTTP Post node
- [#1159](https://github.com/influxdata/kapacitor/pulls/1159): Go version 1.7.4 -> 1.7.5
- [#1175](https://github.com/influxdata/kapacitor/pull/1175): BREAKING: Add generic error counters to every node type.
    Renamed `query_errors` to `errors` in batch node.
    Renamed `eval_errors` to `errors` in eval node.
- [#922](https://github.com/influxdata/kapacitor/issues/922): Expose server specific information in alert templates.
- [#1162](https://github.com/influxdata/kapacitor/pulls/1162): Add Pushover integration.
- [#1221](https://github.com/influxdata/kapacitor/pull/1221): Add `working_cardinality` stat to each node type that tracks the number of groups per node.
- [#1211](https://github.com/influxdata/kapacitor/issues/1211): Add StateDuration node.
- [#1209](https://github.com/influxdata/kapacitor/issues/1209): BREAKING: Refactor the Alerting service.
    The change is completely breaking for the technical preview alerting service, a.k.a. the new alert topic handler features.
    The change boils down to simplifying how you define and interact with topics.
    Alert handlers now only ever have a single action and belong to a single topic.
    An automatic migration from old to new handler definitions will be performed during startup.
    See the updated API docs.
- [#1286](https://github.com/influxdata/kapacitor/issues/1286): Default HipChat URL should be blank
- [#507](https://github.com/influxdata/kapacitor/issues/507): Add API endpoint for performing Kapacitor database backups.
- [#1132](https://github.com/influxdata/kapacitor/issues/1132): Adding source for sensu alert as parameter
- [#1346](https://github.com/influxdata/kapacitor/pull/1346): Add discovery and scraping services.

### Bugfixes

- [#1329](https://github.com/influxdata/kapacitor/issues/1329): BREAKING: A bug was fixed around missing fields in the derivative node.
    The behavior of the node changes slightly in order to provide a consistent fix to the bug.
    The breaking change is that now, the time of the points returned are from the right hand or current point time, instead of the left hand or previous point time.
- [#1353](https://github.com/influxdata/kapacitor/issues/1353): Fix panic in scraping TargetManager.
- [#1238](https://github.com/influxdata/kapacitor/pull/1238): Use ProxyFromEnvironment for all outgoing HTTP traffic.
- [#1294](https://github.com/influxdata/kapacitor/issues/1294): Fix bug where batch queries would be missing all fields after the first nil field.
- [#1343](https://github.com/influxdata/kapacitor/issues/1343): BREAKING: The UDF agent Go API has changed, the changes now make it so that the agent package is self contained.
- [#1133](https://github.com/influxdata/kapacitor/issues/1133): Fix case-sensitivity for Telegram `parseMode` value. 
- [#1147](https://github.com/influxdata/kapacitor/issues/1147): Fix pprof debug endpoint
- [#1164](https://github.com/influxdata/kapacitor/pull/1164): Fix hang in config API to update a config section.
    Now if the service update process takes too long the request will timeout and return an error.
    Previously the request would block forever.
- [#1165](https://github.com/influxdata/kapacitor/issues/1165): Make the alerta auth token prefix configurable and default it to Bearer.
- [#1184](https://github.com/influxdata/kapacitor/pull/1184): Fix logrotate file to correctly rotate error log.
- [#1200](https://github.com/influxdata/kapacitor/pull/1200): Fix bug with alert duration being incorrect after restoring alert state.
- [#1199](https://github.com/influxdata/kapacitor/pull/1199): BREAKING: Fix inconsistency with JSON data from alerts.
    The alert handlers Alerta, Log, OpsGenie, PagerDuty, Post and VictorOps allow extra opaque data to be attached to alert notifications.
    That opaque data was inconsistent and this change fixes that.
    Depending on how that data was consumed this could result in a breaking change, since the original behavior was inconsistent
    we decided it would be best to fix the issue now and make it consistent for all future builds.
    Specifically in the JSON result data the old key `Series` is always `series`, and the old key `Err` is now always `error` instead of for only some of the outputs.
- [#1181](https://github.com/influxdata/kapacitor/pull/1181): Fix bug parsing dbrp values with quotes.
- [#1228](https://github.com/influxdata/kapacitor/pull/1228): Fix panic on loading replay files without a file extension.
- [#1192](https://github.com/influxdata/kapacitor/issues/1192): Fix bug in Default Node not updating batch tags and groupID.
    Also empty string on a tag value is now a sufficient condition for the default conditions to be applied.
    See [#1233](https://github.com/influxdata/kapacitor/pull/1233) for more information.
- [#1068](https://github.com/influxdata/kapacitor/issues/1068): Fix dot view syntax to use xlabels and not create invalid quotes.
- [#1295](https://github.com/influxdata/kapacitor/issues/1295): Fix curruption of recordings list after deleting all recordings.
- [#1237](https://github.com/influxdata/kapacitor/issues/1237): Fix missing "vars" key when listing tasks.
- [#1271](https://github.com/influxdata/kapacitor/issues/1271): Fix bug where aggregates would not be able to change type.
- [#1261](https://github.com/influxdata/kapacitor/issues/1261): Fix panic when the process cannot stat the data dir.

## v1.2.0 [2017-01-23]

### Release Notes

A new system for working with alerts has been introduced.
This alerting system allows you to configure topics for alert events and then configure handlers for various topics.
This way alert generation is decoupled from alert handling.

Existing TICKscripts will continue to work without modification.

To use this new alerting system remove any explicit alert handlers from your TICKscript and specify a topic.
Then configure the handlers for the topic.

```
stream
    |from()
      .measurement('cpu')
      .groupBy('host')
    |alert()
      // Specify the topic for the alert
      .topic('cpu')
      .info(lambda: "value" > 60)
      .warn(lambda: "value" > 70)
      .crit(lambda: "value" > 80)
      // No handlers are configured in the script, they are instead defined on the topic via the API.
```

The API exposes endpoints to query the state of each alert and endpoints for configuring alert handlers.
See the [API docs](https://docs.influxdata.com/kapacitor/latest/api/api/) for more details.
The kapacitor CLI has been updated with commands for defining alert handlers.

This release introduces a new feature where you can window based off the number of points instead of their time.
For example:

```
stream
    |from()
        .measurement('my-measurement')
    // Emit window for every 10 points with 100 points per window.
    |window()
        .periodCount(100)
        .everyCount(10)
    |mean('value')
    |alert()
         .crit(lambda: "mean" > 100)
         .slack()
         .channel('#alerts')
```


With this change alert nodes will have an anonymous topic created for them.
This topic is managed like all other topics preserving state etc. across restarts.
As a result existing alert nodes will now remember the state of alerts after restarts and disiabling/enabling a task.

>NOTE: The new alerting features are being released under technical preview.
This means breaking changes may be made in later releases until the feature is considered complete.
See the [API docs on technical preview](https://docs.influxdata.com/kapacitor/v1.2/api/api/#technical-preview) for specifics of how this effects the API.

### Features

- Add new query property for aligning group by intervals to start times.
- Add new alert API, with support for configuring handlers and topics.
- Move alerta api token to header and add option to skip TLS verification.
- Add SNMP trap service for alerting.
- Add fillPeriod option to Window node, so that the first emit waits till the period has elapsed before emitting.
- Now when the Window node every value is zero, the window will be emitted immediately for each new point.
- Preserve alert state across restarts and disable/enable actions.
- You can now window based on count in addition to time.
- Enable markdown in slack attachments.


### Bugfixes

- Fix issue with the Union node buffering more points than necessary.
- Fix panic during close of failed startup when connecting to InfluxDB.
- Fix panic during replays.
- logrotate.d ignores kapacitor configuration due to bad file mode.
- Fix panic during failed aggregate results.

## v1.1.1 [2016-12-02]

### Release Notes

No changes to Kapacitor, only upgrading to GoLang 1.7.4 for security patches.

## v1.1.0 [2016-10-07]

### Release Notes

New K8sAutoscale node that allows you to auotmatically scale Kubernetes deployments driven by any metrics Kapacitor consumes.
For example, to scale a deployment `myapp` based off requests per second:

```
// The target requests per second per host
var target = 100.0

stream
    |from()
        .measurement('requests')
        .where(lambda: "deployment" == 'myapp')
    // Compute the moving average of the last 5 minutes
    |movingAverage('requests', 5*60)
        .as('mean_requests_per_second')
    |k8sAutoscale()
        .resourceName('app')
        .kind('deployments')
        .min(4)
        .max(100)
        // Compute the desired number of replicas based on target.
        .replicas(lambda: int(ceil("mean_requests_per_second" / target)))
```


New API endpoints have been added to be able to configure InfluxDB clusters and alert handlers dynamically without needing to restart the Kapacitor daemon.
Along with the ability to dynamically configure a service, API endpoints have been added to test the configurable services.
See the [API docs](https://docs.influxdata.com/kapacitor/latest/api/api/) for more details.

>NOTE: The `connect_errors` stat from the query node was removed since the client changed, all errors are now counted in the `query_errors` stat.

### Features

- Add a Kubernetes autoscaler node. You can now autoscale your Kubernetes deployments via Kapacitor.
- Add new API endpoint for dynamically overriding sections of the configuration.
- Upgrade to using GoLang 1.7
- Add API endpoints for testing service integrations.
- Add support for Slack icon emojis and custom usernames.
- Bring Kapacitor up to parity with available InfluxQL functions in 1.1.

### Bugfixes

- Fix bug where keeping a list of fields that where not referenced in the eval expressions would cause an error.
- Fix the number of subscriptions statistic.
- Fix inconsistency with InfluxDB by adding config option to set a default retention policy.
- Sort and dynamically adjust column width in CLI output.
- Adds missing strLength function.

## v1.0.2 [2016-10-06]

### Bugfixes

- Fix bug where errors to save cluster/server ID files were ignored.
- Create data_dir on startup if it does not exist.

## v1.0.1 [2016-09-26]

### Features

- Add TCP alert handler
- Add ability to set alert message as a field
- Add `.create` property to InfluxDBOut node, which when set will create the database and retention policy on task start.
- Allow duration / duration in TICKscript.
- Add support for string manipulation functions.
- Add ability to set specific HTTP port and hostname per configured InfluxDB cluster.

### Bugfixes

- Fixed typo in the default config file
- Change |log() output to be in JSON format so its self documenting structure.
- Fix issue with TMax and the Holt-Winters method.
- Fix bug with TMax and group by time.

## v1.0.0 [2016-09-02]

### Release Notes

First release of Kapacitor v1.0.0.
