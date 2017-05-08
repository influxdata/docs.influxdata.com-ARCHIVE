---
title: Release Notes/Changelog
menu:
  kapacitor_1_3:
    weight: 0
    parent: about_the_project
---

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
